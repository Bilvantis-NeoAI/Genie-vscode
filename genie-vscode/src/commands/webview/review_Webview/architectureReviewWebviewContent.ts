// export function architectureReviewWebviewContent(): string {
//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <title>Architecture Review</title>
//   <style>
//     body {
//       font-family: 'Poppins', sans-serif;
//       background-color: #f0f2f5;
//       color: black;
//       margin: 0;
//       padding: 0;
//       display: flex;
//       justify-content: center;
//       align-items: flex-start;
//       min-height: 100vh;
//     }
//     .container {
//       max-width: 950px;
//       width: 100%;
//       padding: 30px;
//       margin-top: 40px;
//       margin-bottom: 40px;
//       box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
//       background-color: #ffffff;
//       border-radius: 10px;
//     }
//     h1 {
//       font-size: 2rem;
//       margin-bottom: 12px;
//       color: #07439C;
//     }
//     label {
//       display: block;
//       margin-top: 20px;
//       font-weight: bold;
//       color: black;
//     }
//     .file-select-wrapper {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       margin-top: 10px;
//       flex-wrap: wrap;
//     }
//     .file-input {
//       flex-grow: 1;
//     }
//     input[type="text"] {
//       width: 100%;
//       padding: 8px;
//       border-radius: 4px;
//       border: 1px solid #ccc;
//       font-size: 14px;
//     }
//     .button-wrapper {
//       display: flex;
//       justify-content: center;
//       gap: 20px;
//       margin-top: 30px;
//     }
//     button {
//       padding: 10px 18px;
//       font-size: 14px;
//       background-color: #07439C;
//       color: #ffffff;
//       border: none;
//       border-radius: 4px;
//       cursor: pointer;
//     }
//     button.clear-btn {
//       background-color: #777;
//     }
//     #report_container {
//       margin-top: 20px;
//       white-space: pre-wrap;
//       font-family: monospace;
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <h1>Architecture Review</h1>

//     <label>Select Java File or Folder <span style="color: red;">*</span></label>
//     <div class="file-select-wrapper">
//       <button id="select_path">Browse</button>
//       <div class="file-input">
//         <input type="text" id="java_path" placeholder="Paste file or folder path here" />
//       </div>
//     </div>

//     <div class="button-wrapper">
//       <button id="submit">Submit</button>
//       <button id="clear" class="clear-btn">Clear</button>
//     </div>

//     <div id="report_container"></div>
//   </div>

//   <script>
//     const vscode = acquireVsCodeApi();

//     document.getElementById("select_path").addEventListener("click", () => {
//       vscode.postMessage({ command: "selectJavaOrFolder" });
//     });

//     document.getElementById("submit").addEventListener("click", () => {
//       const pathField = document.getElementById("java_path");
//       const selectedPath = pathField.value.trim();
//       const container = document.getElementById("report_container");
//       container.innerHTML = "";

//       if (!selectedPath) {
//         alert("Please select or enter a .java file or folder path.");
//         return;
//       }

//       vscode.postMessage({
//         command: "generateArchitectureReview",
//         path: selectedPath
//       });
//     });

//     document.getElementById("clear").addEventListener("click", () => {
//       document.getElementById("java_path").value = "";
//       document.getElementById("report_container").innerHTML = "";
//     });

//     window.addEventListener("message", (event) => {
//       const message = event.data;
//       if (message.command === "setSelectedPath") {
//         document.getElementById("java_path").value = message.path;
//       } else if (message.command === "displayReportMarkdown") {
//         const container = document.getElementById("report_container");
//         container.innerHTML = message.output || "No report content found.";
//       }
//     });
//   </script>
// </body>
// </html>`;
// }


export function architectureReviewWebviewContent(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Architecture Review</title>
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
    .file-select-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .file-input {
      flex-grow: 1;
    }
    input[type="text"] {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ccc;
      font-size: 14px;
    }
    .button-wrapper {
      display: flex;
      justify-content: center;
      gap: 20px;
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
    }
    button.clear-btn {
      background-color: #777;
    }
    #report_container {
      margin-top: 20px;
      white-space: pre-wrap;
      font-family: monospace;
    }
    #loader {
      display: none;
      text-align: center;
      margin-top: 20px;
    }
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-top: 4px solid #07439C;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Architecture Review</h1>

    <label>Select Java File or Folder <span style="color: red;">*</span></label>
    <div class="file-select-wrapper">
      <button id="select_path">Browse</button>
      <div class="file-input">
        <input type="text" id="java_path" placeholder="Paste file or folder path here" />
      </div>
    </div>

    <div class="button-wrapper">
      <button id="submit">Submit</button>
      <button id="clear" class="clear-btn">Clear</button>
    </div>

    <div id="loader"><div class="spinner"></div></div>
    <div id="report_container"></div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    document.getElementById("select_path").addEventListener("click", () => {
      vscode.postMessage({ command: "selectJavaOrFolder" });
    });

    document.getElementById("submit").addEventListener("click", () => {
      const pathField = document.getElementById("java_path");
      const selectedPath = pathField.value.trim();
      const container = document.getElementById("report_container");
      const loader = document.getElementById("loader");

      container.innerHTML = "";
      loader.style.display = "block"; // Show loader

      if (!selectedPath) {
        loader.style.display = "none"; // Hide loader if no input
        alert("Please select or enter a .java file or folder path.");
        return;
      }

      vscode.postMessage({
        command: "generateArchitectureReview",
        path: selectedPath
      });
    });

    document.getElementById("clear").addEventListener("click", () => {
      document.getElementById("java_path").value = "";
      document.getElementById("report_container").innerHTML = "";
      document.getElementById("loader").style.display = "none";
    });

    window.addEventListener("message", (event) => {
      const message = event.data;
      const loader = document.getElementById("loader");

      if (message.command === "setSelectedPath") {
        document.getElementById("java_path").value = message.path;
      } else if (message.command === "displayReportMarkdown") {
        loader.style.display = "none"; // Hide loader
        const container = document.getElementById("report_container");
        container.innerHTML = message.output || "No report content found.";
      }
    });
  </script>
</body>
</html>`;
}
