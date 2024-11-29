"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDocstringsAssistantWebviewContent = addDocstringsAssistantWebviewContent;
function addDocstringsAssistantWebviewContent(content, title) {
    let parsedContent;
    try {
        parsedContent = JSON.parse(content);
    }
    catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return `<h1>Error parsing content</h1><p>${errorMessage}</p>`;
    }
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css" rel="stylesheet" />
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #2d2d2d;
            color: #f8f8f2;
          }
          #floating-window {
            position: absolute;
            top: 50px;
            left: 50px;
            width: 600px;
            height: 500px;
            border: 1px solid #ccc;
            background-color: #1e1e1e;
            resize: both;
            overflow: auto;
            z-index: 1000;
          }
          #header {
            padding: 10px;
            cursor: move;
            background-color: #444;
            color: #fff;
            border-bottom: 1px solid #ccc;
          }
          #content {
            padding: 10px;
          }
          h3 {
            color: #f8f8f2;
            margin-bottom: 5px;
          }
          .section {
            margin-bottom: 15px;
          }
          pre {
            max-width: 100%;
            word-wrap: break-word;
            white-space: pre-wrap;
            background-color: #1e1e1e;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 5px;
          }
          #buttons {
            margin-top: 10px;
            text-align: center;
          }
          button {
            background-color: #444;
            color: #fff;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            margin: 5px;
          }
          button:hover {
            background-color: #555;
          }
        </style>
      </head>
      <body>
        <div id="floating-window">
          <div id="header">${title}</div>
          <div id="content">
            <div class="section">
              <h3>Quality:</h3>
              <p>${parsedContent.quality}</p>
            </div>
            <div class="section">
              <h3>Remarks:</h3>
              <p>${parsedContent.remarks}</p>
            </div>
            <div class="section">
              <h3>Overall Severity:</h3>
              <p>${parsedContent.overallSeverity}</p>
            </div>
            <div class="section">
              <h3>Looging added Code:</h3>
              <pre><code>${parsedContent.documentationAdded}</code></pre>
            </div>
          </div>
          <div id="buttons">
            <button id="accept">Accept</button>
            <button id="reject">Reject</button>
          </div>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
         
          document.getElementById('accept').addEventListener('click', () => {
            vscode.postMessage({ command: 'accept' });
          });
         
          document.getElementById('reject').addEventListener('click', () => {
            vscode.postMessage({ command: 'reject' });
          });
        </script>
      </body>
      </html>
    `;
}
//# sourceMappingURL=addDocstringAssistantWebviewContent.js.map