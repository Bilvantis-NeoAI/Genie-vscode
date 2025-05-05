export function architectureReviewWebviewContent(): string {
    return `
      <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Architecture Review</title>
       <style>
         body {
           font-family: sans-serif;
           padding: 20px;
           color: var(--vscode-editor-foreground);
           background-color: var(--vscode-editor-background);
         }
         h1 {
           font-size: 1.8rem;
         }
         code {
           background-color: var(--vscode-editor-hoverHighlightBackground);
           padding: 2px 6px;
           border-radius: 4px;
         }
         ul {
           margin-left: 20px;
         }
         a {
           color: var(--vscode-textLink-foreground);
         }
         label {
           display: block;
           margin-top: 10px;
         }
         input {
           width: 80%;
           padding: 8px;
           margin-top: 5px;
           font-size: 14px;
         }
         .button-wrapper {
           text-align: center;
           margin-top: 20px;
         }
         button {
           padding: 10px 15px;
           font-size: 14px;
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
           width: 100%;
           padding: 10px;
           margin-top: 10px;
           font-size: 14px;
           border-radius: 4px;
           border: 1px solid #ccc;
           background-color: #f8f8f8;
         }
       </style>
     </head>
     <body>
       <h1>📘 Repository Documentation</h1>
       <p>This panel allows you to fetch documentation for your project by providing the following details.</p>
 
       <label for="repoUrl">Repository URL</label>
       <input type="text" id="repoUrl" placeholder="Enter repository URL">
 
       <label for="pat">Personal Access Token (PAT)</label>
       <input type="text" id="pat" placeholder="Enter your GitHub PAT">
 
       <label for="branch">Branch Name</label>
       <input type="text" id="branch" placeholder="Enter branch name">
 
       <div class="button-wrapper">
         <button id="submit">Submit</button>
       </div>
 
       <h2>🔗 Documentation</h2>
       <textarea id="markdownDisplay" rows="10" readonly></textarea>
 
       <script>
         document.getElementById("submit").addEventListener("click", () => {
           const repoUrl = document.getElementById("repoUrl").value;
           const pat = document.getElementById("pat").value;
           const branch = document.getElementById("branch").value;
           
           const vscode = acquireVsCodeApi();
           vscode.postMessage({
             command: 'fetchDocumentation',
             repoUrl,
             pat,
             branch
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
  