// export function reviewTerminalContent(jsonData: object, title: string): string {
//     const escapeHtml = (str: string) => str
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#39;");

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
//         "file_contents": fileContents = "N/A",
//         "language": language = "N/A",
//         "project_name": projectName = "N/A",
//         "branch_name": branchName = "N/A"
//     } = jsonData as any;

    
//     const fileContentHtml = Array.isArray(fileContents) && fileContents.length
//         ? fileContents.map((file: any) => `

//             <h3>File: ${escapeHtml(file.path || "Unknown File")}</h3>
//             <pre>${escapeHtml(file.content || "No content available")}</pre>
//         `).join("")
//         : "<p>No file content available.</p>";

// return `
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
//             <button class="copy-btn" onclick="copyToClipboard(this)">Copy</button>
//         </div>
//         <script>
//             function copyToClipboard(button) {
//                 const textToCopy = JSON.stringify(${JSON.stringify(fileContents)}, null, 2);

//                 navigator.clipboard.writeText(textToCopy)
//                     .then(() => {
//                         // Change the button text and style to indicate success
//                         button.textContent = "Copied!";
//                         button.classList.add("copied");

//                         // Revert the button back to normal after 2 seconds
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
//         ? fileContents.map((file: any) => `
//             <h3>File: ${escapeHtml(file.path || "Unknown File")}</h3>
//             <pre>${escapeHtml(file.content || "No content available")}</pre>
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
//             .copy-btn { margin-top: 10px; padding: 8px 12px; background: #007acc; color: white; border: none; cursor: pointer; border-radius: 5px; }
//             .copy-btn.copied { background: #28a745; }
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
//             <button class="copy-btn" onclick="copyToClipboard(this)">Copy</button>
//         </div>

//         <script>
//             // Pass fileContents from TypeScript to JavaScript
//             const fileContents = ${JSON.stringify(fileContents)};

//             function copyToClipboard(button) {
//                 if (!Array.isArray(fileContents) || fileContents.length === 0) {
//                     console.error("Invalid file contents format:", fileContents);
//                     alert("No valid file content to copy.");
//                     return;
//                 }

//                 let textToCopy = fileContents.map(file => 
//                     "File: " + (file.path || "Unknown File") + "\\n" +
//                     "-------------------------------------\\n" +
//                     (file.content || "No content available")
//                 ).join("\\n\\n=====================================\\n\\n");

//                 navigator.clipboard.writeText(textToCopy)
//                     .then(() => {
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
                <pre id="file-content-${index}">${escapeHtml(file.content || "No content available")}</pre>
                <button class="copy-btn" onclick="copyToClipboard(${index})">Copy</button>
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
            .file-container { margin-bottom: 15px; padding: 10px; border: 1px solid #444; border-radius: 5px; background: #252526; }
            .copy-btn { margin-top: 5px; padding: 6px 10px; background: #007acc; color: white; border: none; cursor: pointer; border-radius: 5px; }
            .copy-btn.copied { background: #28a745; }
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
