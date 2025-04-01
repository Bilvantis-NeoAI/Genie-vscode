export function reviewTerminalContent(jsonData: object, title: string): string {
    const escapeHtml = (str: string) => str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    console.log("📄 Formatted Content for WebView:", jsonData);

    if (!jsonData || typeof jsonData !== "object") {
        console.error("Invalid Data Structure:", jsonData);
        return `
        <html><body><h2>Invalid Data</h2>
        <p>Missing expected properties in JSON data.</p></body></html>`;
    }

    const {
        message = "No message",
        "error_text": errorText = "N/A",
        "file_contents": fileContents = [],
        "language": language = "N/A",
        "project_name": projectName = "N/A",
        "branch_name": branchName = "N/A"
    } = jsonData as any;

    const fileContentHtml = Array.isArray(fileContents) && fileContents.length
        ? fileContents.map((file: any, index: number) => `
            <div class="file-container">
                <h3>File: ${escapeHtml(file.path || "Unknown File")}</h3>
                <button class="copy-btn" onclick="copyToClipboard(${index})">Copy</button>
                <pre id="file-content-${index}">${escapeHtml(file.content || "No content available")}</pre>
                
            </div>
        `).join("")
        : "<p>No file content available.</p>";

    return `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #1e1e1e; color: #ffffff; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #252526; color: #ffffff; }
            th, td { border: 1px solid #444; padding: 10px; text-align: left; }
            th { background: #333; }
            pre { background: #1e1e1e; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; }
            h2 { color: #ffffff; }
            .container { max-width: 900px; margin: auto; }
           
            .copy-btn {
                position: absolute;
                right: 10px;
                margin-top: 5px;
                padding: 6px 10px;
                background: #07439C;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 5px;
            }
            .copy-btn.copied {
                background: #38b000;
            }
            .file-container {
                position: relative;
                margin-bottom: 15px;
                padding: 10px;
                border: 1px solid #444;
                border-radius: 5px;
                background: #252526;
            }

        </style>
    </head>
    <body>
        <div class="container">
            <h2>${title}</h2>
            <table>
                <tr><th>Message</th><td>${message}</td></tr>
                <tr><th>Error Text</th><td><pre>${errorText}</pre></td></tr>
                <tr><th>Language</th><td>${language}</td></tr>
                <tr><th>Project Name</th><td>${projectName}</td></tr>
                <tr><th>Branch Name</th><td>${branchName}</td></tr>
            </table>
            <h3>File Contents</h3>
            ${fileContentHtml}
        </div>

        <script>
            function copyToClipboard(fileIndex) {
                const textToCopy = document.getElementById('file-content-' + fileIndex).innerText;

                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        const button = document.querySelectorAll('.copy-btn')[fileIndex];
                        button.textContent = "Copied!";
                        button.classList.add("copied");

                        setTimeout(() => {
                            button.textContent = "Copy";
                            button.classList.remove("copied");
                        }, 2000);
                    })
                    .catch(err => {
                        console.error("Failed to copy:", err);
                        alert("Failed to copy text.");
                    });
            }
        </script>
    </body>
    </html>`;
}



// export function reviewTerminalContent(jsonData: object, title: string): string {
//     const escapeHtml = (str: string) => str
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#39;");

//     console.log("📄 Formatted Content for WebView:", jsonData);

//     if (!jsonData || typeof jsonData !== "object") {
//         console.error("Invalid Data Structure:", jsonData);
//         return `
//         <html><body><h2>Invalid Data</h2>
//         <p>Missing expected properties in JSON data.</p></body></html>`;
//     }

//     const {
//         message = "No message",
//         "error_text": errorText = "N/A",
//         "file_contents": fileContents = [],
//         "language": language = "N/A",
//         "project_name": projectName = "N/A",
//         "branch_name": branchName = "N/A"
//     } = jsonData as any;

//     const fileContentHtml = Array.isArray(fileContents) && fileContents.length
//         ? fileContents.map((file: any, index: number) => `
//             <div class="file-container">
//                 <div class="file-header">
//                     <span class="file-path">Path: ${escapeHtml(file.path || "Unknown File")}</span>
//                     <button class="copy-btn" onclick="copyToClipboard(${index})">Copy</button>
//                 </div>
//                 <pre id="file-content-${index}">${escapeHtml(file.content || "No content available")}</pre>
//             </div>
//         `).join("")
//         : "<p>No file content available.</p>";

//     return `
//     <html>
//     <head>
//         <style>
//             body { font-family: Arial, sans-serif; background-color: #1e1e1e; color: #ffffff; padding: 20px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #252526; color: #ffffff; }
//             th, td { border: 1px solid #444; padding: 10px; text-align: left; }
//             th { background: #333; }
//             pre { background: #1e1e1e; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; }
//             h2 { color: #ffffff; }
//             .container { max-width: 900px; margin: auto; }
//             .file-container {
//                 position: relative;
//                 margin-bottom: 15px;
//                 padding: 10px;
//                 border: 1px solid #444;
//                 border-radius: 5px;
//                 background: #252526;
//             }
//             .file-header {
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: center;
//                 margin-bottom: 10px; /* Adds spacing between file header and code block */
//             }
//             .file-path {
//                 font-weight: bold;
//                 color: #ffffff;
//             }
//             .copy-btn {
//                 padding: 6px 10px;
//                 background: #07439C; /* Button color */
//                 color: white;
//                 border: none;
//                 cursor: pointer;
//                 border-radius: 5px;
//             }
//             .copy-btn.copied {
//                 background: #38b000; /* Button color after copying */
//             }
//         </style>
//     </head>
//     <body>
//         <div class="container">
//             <h2>${title}</h2>
//             <table>
//                 <tr><th>Message</th><td>${message}</td></tr>
//                 <tr><th>Error Text</th><td><pre>${errorText}</pre></td></tr>
//                 <tr><th>Language</th><td>${language}</td></tr>
//                 <tr><th>Project Name</th><td>${projectName}</td></tr>
//                 <tr><th>Branch Name</th><td>${branchName}</td></tr>
//             </table>
//             <h3>File Contents</h3>
//             ${fileContentHtml}
//         </div>

//         <script>
//             function copyToClipboard(fileIndex) {
//                 const textToCopy = document.getElementById('file-content-' + fileIndex).innerText;

//                 navigator.clipboard.writeText(textToCopy)
//                     .then(() => {
//                         const button = document.querySelectorAll('.copy-btn')[fileIndex];
//                         button.textContent = "Copied!";
//                         button.classList.add("copied");

//                         setTimeout(() => {
//                             button.textContent = "Copy";
//                             button.classList.remove("copied");
//                         }, 2000);
//                     })
//                     .catch(err => {
//                         console.error("Failed to copy:", err);
//                         alert("Failed to copy text.");
//                     });
//             }
//         </script>
//     </body>
//     </html>`;
// }