export function architectureReviewWebviewContent(): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Architecture Review</title>
    <style>
      body {
        font-family: sans-serif;
        padding: 40px;
        max-width: 600px;
        margin: auto;
        background-color: var(--vscode-editor-background);
        color: var(--vscode-editor-foreground);
      }

      h1 {
        font-size: 1.5rem;
        text-align: center;
        margin-bottom: 30px;
      }

      .form-field {
        margin-bottom: 20px;
      }

      label {
        font-weight: bold;
        display: block;
        margin-bottom: 5px;
      }

      input {
        width: 100%;
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      button {
        width: 100%;
        padding: 12px;
        font-size: 16px;
        background-color: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background-color: var(--vscode-button-hoverBackground);
      }

      textarea {
        margin-top: 30px;
        width: 100%;
        height: 200px;
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #f8f8f8;
      }
    </style>
  </head>
  <body>
    <h1>📘 Architecture Review</h1>

    <div class="form-field">
      <label for="repoUrl">Repository URL</label>
      <input type="text" id="repoUrl" placeholder="e.g. https://github.com/user/repo">
    </div>

    <div class="form-field">
      <label for="pat">GitHub Personal Access Token (PAT)</label>
      <input type="password" id="pat" placeholder="Enter your PAT">
    </div>

    <div class="form-field">
      <label for="branch">Branch Name</label>
      <input type="text" id="branch" placeholder="e.g. main">
    </div>

    <button id="submit">Submit</button>

    <textarea id="markdownDisplay" readonly placeholder="Output will appear here..."></textarea>

    <script>
      const vscode = acquireVsCodeApi();

      document.getElementById("submit").addEventListener("click", () => {
        const payload = {
          repoUrl: document.getElementById("repoUrl").value,
          pat: document.getElementById("pat").value,
          branch: document.getElementById("branch").value
        };

        vscode.postMessage({
          command: 'fetchDocumentation',
          payload: payload
        });
      });

      window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'displayMarkdown') {
          document.getElementById("markdownDisplay").value = message.markdown || "No content received.";
        }
      });
    </script>
  </body>
  </html>
  `;
}

