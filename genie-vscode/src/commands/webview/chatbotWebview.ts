import * as vscode from "vscode";

export function openChatbotWebview(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "neoaiChatbot",
    "NeoAI Chatbot",
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );

  panel.webview.html = getWebviewContent();

  panel.webview.onDidReceiveMessage(async (message) => {
    if (message.command === "submitQuestion") {
      let { question, fileContent, fileName } = message;

      if (!fileContent || !fileName) {
        let activeEditor = vscode.window.activeTextEditor;

        if (!activeEditor || !activeEditor.document) {
          const editors = vscode.window.visibleTextEditors;
          const besideEditor = editors.find(editor => editor.viewColumn === vscode.ViewColumn.One);
          if (besideEditor) activeEditor = besideEditor;
        }

        if (activeEditor) {
          const document = activeEditor.document;
          fileContent = document.getText();
          fileName = document.fileName.split(/[/\\]/).pop() || "Untitled";
        } else {
          fileContent = "";
          fileName = "No file selected or open";
        }
      }

      const responseText = await sendChatRequest(question, fileContent, fileName);
      panel.webview.postMessage({ command: "response", data: responseText });
    }

    if (message.command === "getFileSuggestions") {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        panel.webview.postMessage({ command: "fileSuggestions", files: [] });
        return;
      }

      try {
        const files = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
        const relativePaths = files.map(f => vscode.workspace.asRelativePath(f));
        const filtered = message.query
          ? relativePaths.filter(name =>
              name.toLowerCase().includes(message.query.toLowerCase())
            )
          : relativePaths;

        panel.webview.postMessage({
          command: "fileSuggestions",
          files: filtered.slice(0, 50), // Limit to 50 results
        });
      } catch (err) {
        vscode.window.showErrorMessage("Failed to load file suggestions");
        panel.webview.postMessage({ command: "fileSuggestions", files: [] });
      }
    }

    if (message.command === "loadFileByName") {
      const filePath = message.fileName;
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) return;

      const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, filePath);

      try {
        const fileBytes = await vscode.workspace.fs.readFile(fileUri);
        const fileContent = Buffer.from(fileBytes).toString("utf8");

        panel.webview.postMessage({
          command: "fileLoaded",
          fileName: filePath,
          content: fileContent,
        });
      } catch (err) {
        vscode.window.showErrorMessage("Unable to load file: " + filePath);
      }
    }
  });
}

function getWebviewContent(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      background-color: #1e1e1e;
      color: #ddd;
      display: flex;
      flex-direction: column;
      height: 100vh;
      font-size: 13px;
    }
    #fileRow {
      padding: 10px;
      background-color: #2a2a2a;
      border-bottom: 1px solid #444;
    }
    .file-inline {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .file-label {
      display: inline-block;
      padding: 6px 12px;
      background-color: #444;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
    .file-label input[type="file"] {
      display: none;
    }
    .file-btn {
      background-color: #333;
      color: #ccc;
      border: 1px solid #555;
      border-radius: 20px;
      padding: 5px 10px;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    .file-btn:hover {
      background-color: #444;
    }
    .file-btn span {
      font-weight: bold;
      color: #f44;
    }
    #chat {
      flex: 1;
      overflow-y: auto;
      padding: 10px 20px;
    }
    .message-row {
      display: flex;
      width: 100%;
      margin-bottom: 10px;
    }
    .message-row.left {
      justify-content: flex-start;
    }
    .message-row.right {
      justify-content: flex-end;
    }
    .message {
      max-width: 95%;
      padding: 6px;
      border-radius: 6px;
      white-space: pre-wrap;
      font-size: 13px;
      border: 1px solid #444;
      background-color: #222;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    }
    .user {
      background-color: #0a84ff;
      color: white;
    }
    .assistant {
      background-color: #333;
      border: 1px solid #555;
    }
    #inputContainer {
      padding: 10px;
      border-top: 1px solid #444;
      background: #2a2a2a;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
    }
    textarea {
      resize: none;
      width: 100%;
      padding: 6px;
      font-size: 13px;
      border-radius: 6px;
      border: none;
      background: #1e1e1e;
      color: white;
      flex: 1;
    }
    button {
      padding: 6px 12px;
      border: none;
      border-radius: 5px;
      background-color: #0a84ff;
      color: white;
      font-weight: bold;
      font-size: 13px;
    }
    pre {
      background: #111;
      padding: 8px;
      border-radius: 5px;
      overflow-x: auto;
      color: #ccc;
      margin: 6px 0;
    }
  </style>
</head>
<body>
  <div id="fileRow">
    <div class="file-inline">
      <label class="file-label">
        Choose File
        <input type="file" id="fileInput" />
      </label>
      <div id="fileInfo"></div>
    </div>
  </div>
  <div id="chat"></div>
  <div id="inputContainer">
    <textarea id="question" rows="2" placeholder="Ask your question..."></textarea>
    <button id="sendBtn">Send</button>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    const chat = document.getElementById("chat");
    const textarea = document.getElementById("question");
    const sendBtn = document.getElementById("sendBtn");
    const fileInput = document.getElementById("fileInput");
    const fileInfo = document.getElementById("fileInfo");

    let fileContent = "";
    let fileName = "";







    function addMessage(content, isUser = false) {
  const row = document.createElement("div");
  row.className = "message-row " + (isUser ? "left" : "right");

  const div = document.createElement("div");
  div.className = "message " + (isUser ? "user" : "assistant");

  const formatted = content.replace(/\\\`\\\`\\\`([\\s\\S]*?)\\\`\\\`\\\`/g, function(_, code) {
    return '<pre>' + code + '</pre>';
  });


  const contentDiv = document.createElement("div");
  contentDiv.className = "content-part";
  contentDiv.innerHTML = formatted;
  div.appendChild(contentDiv);

  if (!isUser) {
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.style.marginTop = "5px";
    copyBtn.style.fontSize = "11px";
    copyBtn.style.padding = "3px 8px";
    copyBtn.style.background = "#555";
    copyBtn.style.color = "#fff";
    copyBtn.style.border = "none";
    copyBtn.style.borderRadius = "4px";
    copyBtn.style.cursor = "pointer";

    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(content).then(function () {
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copied";
        setTimeout(function () {
          copyBtn.textContent = original;
        }, 3000);
      });
    });

    div.appendChild(copyBtn);
  }

  row.appendChild(div);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}





    sendBtn.addEventListener("click", () => {
      const question = textarea.value.trim();
      if (!question) return;
      addMessage(question, true);
      textarea.value = "";
      vscode.postMessage({ command: "submitQuestion", question, fileContent, fileName });
    });

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          fileContent = event.target.result;
          fileName = file.name;
          fileInfo.innerHTML = '<div class="file-btn" id="cancelFile">' + fileName + ' <span>×</span></div>';
          document.getElementById("cancelFile").addEventListener("click", () => {
            fileInput.value = "";
            fileContent = "";
            fileName = "";
            fileInfo.innerText = "";
          });
        };
        reader.readAsText(file);
      }
    });

    // --- @file autocomplete ---
    let suggestionBox;
    function createSuggestionBox() {
      suggestionBox = document.createElement("div");
      suggestionBox.style.position = "absolute";
      suggestionBox.style.background = "#2a2a2a";
      suggestionBox.style.border = "1px solid #555";
      suggestionBox.style.padding = "5px 0";
      suggestionBox.style.borderRadius = "4px";
      suggestionBox.style.maxHeight = "150px";
      suggestionBox.style.overflowY = "auto";
      suggestionBox.style.display = "none";
      suggestionBox.style.zIndex = 9999;
      document.body.appendChild(suggestionBox);
    }
    createSuggestionBox();

    textarea.addEventListener("input", () => {
      const value = textarea.value;
      const match = value.match(/@([\\w-./]*)$/);
      if (match) {
        vscode.postMessage({ command: "getFileSuggestions", query: match[1] });
      } else {
        suggestionBox.style.display = "none";
      }
    });

    function showFileSuggestions(files) {
      suggestionBox.innerHTML = "";
      files.forEach(file => {
        const div = document.createElement("div");
        div.style.padding = "6px 12px";
        div.style.cursor = "pointer";
        div.style.color = "#ddd";
        div.innerText = file;
        div.addEventListener("click", () => {
          textarea.value = textarea.value.replace(/@([\\w-./]*)$/, file);
          suggestionBox.style.display = "none";
          vscode.postMessage({ command: "loadFileByName", fileName: file });
        });
        suggestionBox.appendChild(div);
      });
      const rect = textarea.getBoundingClientRect();
      suggestionBox.style.left = rect.left + "px";
      suggestionBox.style.top = rect.top + window.scrollY - 160 + "px";
      suggestionBox.style.width = rect.width + "px";
      suggestionBox.style.display = "block";
    }

    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.command === "response") {
        addMessage(message.data, false);
      } else if (message.command === "fileSuggestions") {
        showFileSuggestions(message.files);
      } else if (message.command === "fileLoaded") {
        fileContent = message.content;
        fileName = message.fileName;
        fileInfo.innerHTML = '<div class="file-btn" id="cancelFile">' + fileName + ' <span>×</span></div>';
        textarea.value="";
        document.getElementById("cancelFile").addEventListener("click", () => {
          fileInput.value = "";
          fileContent = "";
          fileName = "";
          fileInfo.innerText = "";
        });
        if(suggestionBox) {
        suggestionBox.style.display="none";
        }
      }
    });
  </script>
</body>
</html>
`;
}

async function sendChatRequest(question: string, fileContent: string, fileName: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `✅ Mock Response:\nYou asked: "${question}"\nUsing file: ${fileContent}`;
}
