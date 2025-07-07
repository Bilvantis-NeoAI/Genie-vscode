import * as vscode from "vscode";

// export function openChatbotWebview(context: vscode.ExtensionContext) {
//    const panel = vscode.window.createWebviewPanel(
//      "neoaiChatbot",
//      "NeoAI Chatbot",
//      vscode.ViewColumn.Beside,
//      {
//        enableScripts: true,
//        retainContextWhenHidden: true,
//      }
//    );

//    panel.webview.html = getWebviewContent();

//    panel.webview.onDidReceiveMessage(async (message) => {
//      if (message.command === "submitQuestion") {
//        let { question, fileContent, fileName } = message;

//        // Fallback to open editor content if file not uploaded
//        if (!fileContent || !fileName) {
//          let activeEditor = vscode.window.activeTextEditor;

//          if (!activeEditor || !activeEditor.document) {
//            const editors = vscode.window.visibleTextEditors;
//            const besideEditor = editors.find(editor => editor.viewColumn === vscode.ViewColumn.One);
//            if (besideEditor) activeEditor = besideEditor;
//          }

//          if (activeEditor) {
//            const document = activeEditor.document;
//            fileContent = document.getText();
//            fileName = document.fileName.split(/[/\\]/).pop() || "Untitled";
//          } else {
//            fileContent = "";
//            fileName = "No file selected or open";
//          }
//        }

//        const responseText = await sendChatRequest(question, fileContent, fileName);

//        panel.webview.postMessage({
//          command: "response",
//          data: responseText,
//        });
//      }
//    });
//  }

// function getWebviewContent(): string {
//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <style>
//     body {
//       margin: 0;
//       font-family: 'Segoe UI', sans-serif;
//       background-color: #1e1e1e;
//       color: #ddd;
//       display: flex;
//       flex-direction: column;
//       height: 100vh;
//       font-size: 13px;
//     }

//     #fileRow {
//       padding: 10px;
//       background-color: #2a2a2a;
//       border-bottom: 1px solid #444;
//     }

//     .file-inline {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//     }

//     .file-label {
//       display: inline-block;
//       padding: 6px 12px;
//       background-color: #444;
//       color: white;
//       border-radius: 4px;
//       cursor: pointer;
//       font-size: 13px;
//     }

//     .file-label input[type="file"] {
//       display: none;
//     }

//     .file-btn {
//       background-color: #333;
//       color: #ccc;
//       border: 1px solid #555;
//       border-radius: 20px;
//       padding: 5px 10px;
//       font-size: 12px;
//       display: inline-flex;
//       align-items: center;
//       gap: 6px;
//       cursor: pointer;
//     }

//     .file-btn:hover {
//       background-color: #444;
//     }

//     .file-btn span {
//       font-weight: bold;
//       color: #f44;
//     }

//     #chat {
//       flex: 1;
//       overflow-y: auto;
//       padding: 10px 20px;
//     }

//     .message {
//   width: fit-content;
//   max-width: 95%;
//   margin-bottom: 10px;
//   padding: 12px;
//   border-radius: 6px;
//   white-space: pre-wrap;
//   font-size: 13px;
//   border: 1px solid #444;
//   background-color: #222;
//   box-shadow: 0 2px 6px rgba(0,0,0,0.4);
// }


//     .user {
//       align-self: flex-end;
//       background-color: #0a84ff;
//       color: white;
//     }

//     .assistant {
//       align-self: flex-start;
//       background-color: #333;
//       border: 1px solid #555;
//     }

//     #inputContainer {
//       padding: 10px;
//       border-top: 1px solid #444;
//       background: #2a2a2a;
//       display: flex;
//       flex-direction: row;
//       align-items: center;
//       gap: 6px;
//     }

//     textarea {
//       resize: none;
//       width: 100%;
//       padding: 6px;
//       font-size: 13px;
//       border-radius: 6px;
//       border: none;
//       background: #1e1e1e;
//       color: white;
//       flex: 1;
//     }

//     button {
//       padding: 6px 12px;
//       border: none;
//       border-radius: 5px;
//       background-color: #0a84ff;
//       color: white;
//       font-weight: bold;
//       font-size: 13px;
//     }

//     pre {
//       background: #111;
//       padding: 8px;
//       border-radius: 5px;
//       overflow-x: auto;
//       color: #ccc;
//       margin: 6px 0;
//     }
//   </style>
// </head>
// <body>
//   <div id="fileRow">
//     <div class="file-inline">
//       <label class="file-label">
//         Choose File
//         <input type="file" id="fileInput" />
//       </label>
//       <div id="fileInfo"></div>
//     </div>
//   </div>
//   <div id="chat"></div>
//   <div id="inputContainer">
//     <textarea id="question" rows="2" placeholder="Ask your question..."></textarea>
//     <button id="sendBtn">Send</button>
//   </div>
//   <script>
//     const vscode = acquireVsCodeApi();
//     const chat = document.getElementById("chat");
//     const textarea = document.getElementById("question");
//     const sendBtn = document.getElementById("sendBtn");
//     const fileInput = document.getElementById("fileInput");
//     const fileInfo = document.getElementById("fileInfo");

//     let fileContent = "";
//     let fileName = "";

//     function addMessage(content, isUser = false) {
//       const div = document.createElement("div");
//       div.className = "message " + (isUser ? "user" : "assistant");
//       div.innerHTML = content.replace(/\\\`\\\`\\\`([\\s\\S]*?)\\\`\\\`\\\`/g, (_, code) => '<pre>' + code + '</pre>');
//       chat.appendChild(div);
//       chat.scrollTop = chat.scrollHeight;
//     }

//     sendBtn.addEventListener("click", () => {
//       const question = textarea.value.trim();
//       if (!question) return;
//       addMessage(question, true);
//       textarea.value = "";
//       vscode.postMessage({ command: "submitQuestion", question, fileContent, fileName });
//     });

//     textarea.addEventListener("keydown", (e) => {
//       if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         sendBtn.click();
//       }
//     });

//     window.addEventListener("message", (event) => {
//       const message = event.data;
//       if (message.command === "response") {
//         addMessage(message.data, false);
//       }
//     });

//     fileInput.addEventListener("change", (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           fileContent = event.target.result;
//           fileName = file.name;
//           fileInfo.innerHTML = \`
//             <div class="file-btn" id="cancelFile">
//               \${fileName} <span>×</span>
//             </div>
//           \`;
//           document.getElementById("cancelFile").addEventListener("click", () => {
//             fileInput.value = "";
//             fileContent = "";
//             fileName = "";
//             fileInfo.innerText = "";
//           });
//         };
//         reader.readAsText(file);
//       }
//     });
//   </script>
// </body>
// </html>`;
// }

// async function sendChatRequest(question: string, fileContent: string, fileName: string): Promise<string> {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return `✅ Mock Response:\nYou asked: "${question}"\nUsing file: ${fileName}`;
// }



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

       // Fallback to open editor content if file not uploaded
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

       panel.webview.postMessage({
         command: "response",
         data: responseText,
       });
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
      div.innerHTML = content.replace(/\\\`\\\`\\\`([\\s\\S]*?)\\\`\\\`\\\`/g, (_, code) => '<pre>' + code + '</pre>');

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

    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.command === "response") {
        addMessage(message.data, false);
      }
    });

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          fileContent = event.target.result;
          fileName = file.name;
          fileInfo.innerHTML = \`
            <div class="file-btn" id="cancelFile">
              \${fileName} <span>×</span>
            </div>
          \`;
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
  </script>
</body>
</html>`;
}

async function sendChatRequest(question: string, fileContent: string, fileName: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `✅ Mock Response:\nYou asked: "${question}"\nUsing file: ${fileName}`;
}
