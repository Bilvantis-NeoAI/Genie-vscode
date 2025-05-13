export function getRepoDocWebviewContent(): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Repository Documentation</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        background-color: #f0f2f5;
        color: black;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: 100vh;
      }

      .container {
        max-width: 950px;
        width: 100%;
        padding: 30px;
        margin-top: 40px;
        margin-bottom: 40px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        background-color: #ffffff;
        border-radius: 10px;
      }

      h1 {
        font-size: 2rem;
        margin-bottom: 12px;
        color: #07439C;
      }

      label {
        display: block;
        margin-top: 20px;
        font-weight: bold;
        color: black;
      }

      input {
        width: 90%;
        padding: 10px 14px;
        margin-top: 6px;
        border-radius: 6px;
        border: 1px solid #444;
        font-size: 15px;
        background-color: white;
        color: black;
        transition: border-color 0.2s ease-in-out;
      }

      input:focus {
        outline: none;
        border-color: #07439C;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
      }

      .button-wrapper {
        text-align: center;
        margin-top: 30px;
      }

      button {
        padding: 10px 18px;
        font-size: 14px;
        background-color: #07439C;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 0 10px;
      }

      #jobIDDisplay, #statusDisplay {
        background: #ffffff;
        color: black;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        white-space: pre-wrap;
      }

      #markdownDisplay, #download {
        display: none;
      }

      #statusDisplay {
        display: none;
        text-align: center;
        white-space: pre-wrap;
      }

      #spinner {
        width: 20px;
        height: 20px;
        border: 3px solid #ccc;
        border-top: 3px solid #07439C;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 10px;
        display: none;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      #markdownDisplay {
        padding: 10px;
        border-radius: 8px;
        margin-top: 10px;
        background: #ffffff;
        color: black;
      }

      #markdownDisplay h1, h2, h3, h4, h5 {
        color: #07439C;
      }

      #markdownDisplay code {
        background-color: #ffffff;
        color: black;
        padding: 2px 5px;
        border-radius: 4px;
        font-family: monospace;
      }

      pre {
        background-color: #ffffff;
        padding: 10px;
        border-radius: 6px;
        overflow-x: auto;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>📘 Repository Documentation</h1>
      <p>Generate comprehensive documentation for a repository by providing the following details:</p>

      <label for="repo_url">Repository URL <span style="color: red;">*</span></label>
      <input type="text" id="repo_url" placeholder="Enter repository URL" />

      <label for="pat">Personal Access Token (PAT)</label>
      <input type="text" id="pat" placeholder="Enter your GitHub PAT" />

      <label for="branch">Branch Name <span style="color: red;">*</span></label>
      <input type="text" id="branch" placeholder="Enter branch name" />

      <div class="button-wrapper">
        <button id="submit">Submit</button>
        <button id="cancel">Cancel</button>
      </div>

      <div id="statusDisplay">
        <div style="display: flex; align-items: center; justify-content: center;">
          <div id="spinner"></div>
          <span id="statusDetailsSpan"></span>
        </div>
      </div>

      <div class="button-wrapper">
        <button id="download" style="display:none;">Download .md</button>
      </div>

      <div id="markdownDisplay"></div>
    </div>

    <script>
      window.onload = function () {
        const vscode = acquireVsCodeApi();

        const submitBtn = document.getElementById("submit");
        const downloadBtn = document.getElementById("download");
        const cancelBtn = document.getElementById("cancel");

        const statusDisplay = document.getElementById("statusDisplay");
        const markdownDisplay = document.getElementById("markdownDisplay");
        const statusDetailsSpan = document.getElementById("statusDetailsSpan");
        const spinner = document.getElementById("spinner");

        const repoInput = document.getElementById("repo_url");
        const patInput = document.getElementById("pat");
        const branchInput = document.getElementById("branch");

        let jobID = null;
        let pollingInterval = null;
        let latestMarkdown = '';
        cancelBtn.style.display = 'none';

        submitBtn.addEventListener("click", () => {
          const repo_url = repoInput.value.trim();
          const pat = patInput.value.trim();
          const branch = branchInput.value.trim();

          if (!repo_url || !branch) {
            statusDisplay.style.display = 'block';
            statusDetailsSpan.textContent = 'Please fill in all required fields.';
            spinner.style.display = 'none';
            return;
          }

          statusDisplay.style.display = 'block';
          statusDetailsSpan.textContent = 'Submitting...';
          spinner.style.display = 'inline-block';
          markdownDisplay.style.display = 'none';
          downloadBtn.style.display = 'none';

          vscode.postMessage({
            command: 'fetchDocumentation',
            repo_url,
            pat: pat || "",
            branch
          });
        });

        cancelBtn.addEventListener("click", () => {
          if (!jobID) {
            statusDetailsSpan.textContent = "No request is in progress to cancel.";
            return;
          }
          vscode.postMessage({
            command: "cancelJob",
            jobID
          });
          statusDisplay.style.display = 'block';
          statusDetailsSpan.textContent = "Cancelling the request...";
          spinner.style.display = 'inline-block';
          if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
          }
           // Reset state
          jobID = null;
          latestMarkdown = '';
          markdownDisplay.style.display = 'none';
          markdownDisplay.innerHTML = '';
          downloadBtn.style.display = 'none';
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

        const pollStatus = () => {
          if (!jobID) return;
          vscode.postMessage({
            command: 'checkJobStatus',
            jobID
          });
        };

        window.addEventListener('message', event => {
          const message = event.data;

          if (message.command === 'displayJobID') {
            cancelBtn.style.display = 'inline-block';
            jobID = message.jobId;
            console.log("Received Job ID:", jobID);
            pollStatus();
            pollingInterval = setInterval(pollStatus, 10000);
          }

          if (message.command === 'displayJobStatus') {
            statusDisplay.style.display = 'block';
            const status = message.status.toLowerCase();
            statusDetailsSpan.textContent = message.statusDetails || message.Status_display || "Unknown status.";

            if (status === 'completed') {
              spinner.style.display = 'none';
              cancelBtn.style.display = 'none'; 
              if (pollingInterval) clearInterval(pollingInterval);
              vscode.postMessage({
                command: 'downloadMarkdown',
                jobID
              });
            } else if (status === 'failed') {
              spinner.style.display = 'none';
              cancelBtn.style.display = 'none'; 
              if (pollingInterval) clearInterval(pollingInterval);
              statusDetailsSpan.textContent = message.statusDetails || message.Status_display || "Repo documentation request was failed.";

            } else if (status === 'cancelled') {
              spinner.style.display = 'none';
              if (pollingInterval) clearInterval(pollingInterval);
              statusDetailsSpan.textContent = message.statusDetails || message.Status_display || "Repo documentation request was cancelled.";
            } else {
              spinner.style.display = 'inline-block';
            }
              
          }

          if (message.command === 'displayMarkdown') {
            cancelBtn.style.display = 'none';
            latestMarkdown = message.markdown || "# No markdown received.";
            // Replace all H1s (# Header) with H2s (## Header)
            const modifiedMarkdown = latestMarkdown.replace(/^# (.*$)/gm, "## $1");
            markdownDisplay.innerHTML = marked.parse(modifiedMarkdown);
            markdownDisplay.style.display = 'block';
            downloadBtn.style.display = 'inline-block';
          }
        });
      };
    </script>
  </body>
  </html>
  `;
}
