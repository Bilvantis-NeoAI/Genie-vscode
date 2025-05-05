export function getRepoDocWebviewContent(): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Repository Documentation</title>
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        background-color: var(--vscode-editor-background);
        color: white;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: 100vh;
      }

      .container {
        max-width: 900px;
        width: 100%;
        padding: 30px;
        margin-top: 40px;
      }

      h1 {
        font-size: 2rem;
        margin-bottom: 12px;
      }

      label {
        display: block;
        margin-top: 20px;
        font-weight: 500;
        color: white;
      }

      input {
        width: 90%;
        padding: 10px 14px;
        margin-top: 6px;
        border-radius: 6px;
        border: 1px solid #444;
        font-size: 15px;
        background-color: #2a2a2a;
        color: white;
        transition: border-color 0.2s ease-in-out;
      }

      input:focus {
        outline: none;
        border-color: #4A90E2;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
      }

      .button-wrapper {
        text-align: center;
        margin-top: 30px;
      }

      button {
        padding: 10px 18px;
        font-size: 14px;
        background-color: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 0 10px;
      }

      button:hover {
        background-color: var(--vscode-button-hoverBackground);
      }

      #markdownDisplay {
        background: #1e1e1e;
        padding: 15px;
        border-radius: 5px;
        color: white;
        margin-top: 30px;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>📘 Repository Documentation</h1>
      <p>This panel allows you to fetch documentation for your project by providing the following details.</p>

      <label for="repo_url">Repository URL</label>
      <input type="text" id="repo_url" placeholder="Enter repository URL" />

      <label for="project_name">Project Name</label>
      <input type="text" id="project_name" placeholder="Enter project name" />

      <label for="pat">Personal Access Token (PAT)</label>
      <input type="text" id="pat" placeholder="Enter your GitHub PAT" />

      <label for="branch">Branch Name</label>
      <input type="text" id="branch" placeholder="Enter branch name" />

      <div class="button-wrapper">
        <button id="submit">Submit</button>
        <button id="clear">Clear</button>
        <button id="download" style="display:none;">Download .md</button>
      </div>

      <h2>🔗 Documentation</h2>
      <div id="markdownDisplay"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
      window.onload = function () {
        const vscode = acquireVsCodeApi();

        const submitBtn = document.getElementById("submit");
        const clearBtn = document.getElementById("clear");
        const downloadBtn = document.getElementById("download");

        const repoInput = document.getElementById("repo_url");
        const nameInput = document.getElementById("project_name");
        const patInput = document.getElementById("pat");
        const branchInput = document.getElementById("branch");
        const markdownDisplay = document.getElementById("markdownDisplay");

        let latestMarkdown = "";

        submitBtn.addEventListener("click", () => {
          const repo_url = repoInput.value.trim();
          const project_name = nameInput.value.trim();
          const pat = patInput.value.trim();
          const branch = branchInput.value.trim();

          if (!repo_url || !branch) {
            markdownDisplay.innerHTML = "<span style='color:red'>Please fill in all fields before submitting.</span>";
            return;
          }

          vscode.postMessage({
            command: 'fetchDocumentation',
            repo_url,
            project_name: project_name || "",
            pat: pat || "",
            branch
          });
        });

        clearBtn.addEventListener("click", () => {
          repoInput.value = "";
          nameInput.value = "";
          patInput.value = "";
          branchInput.value = "";
          markdownDisplay.innerHTML = "";
          downloadBtn.style.display = "none";
        });

        downloadBtn.addEventListener("click", () => {
          const blob = new Blob([latestMarkdown], { type: "text/markdown" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "repository_documentation.md";
          a.click();
          URL.revokeObjectURL(url);
        });

        window.addEventListener('message', event => {
          const message = event.data;

          if (message.command === 'displayMarkdown') {
            latestMarkdown = message.markdown || "";
            markdownDisplay.innerHTML = marked.parse(latestMarkdown || "No content received.");
            downloadBtn.style.display = "inline-block";
          }

          if (message.command === 'displayError') {
            markdownDisplay.innerHTML =
              '<div style="color: red; white-space: pre-wrap; background: #2c2c2c; padding: 10px; border-radius: 5px;">' +
              'Error: ' + message.error +
              '</div>';
            downloadBtn.style.display = "none";
          }
        });
      };
    </script>
  </body>
  </html>
  `;
}
