export function fixItTerminalAssistantWebviewContent(jsonData: object, title: string): string {
   const escapeHtml = (str: string) => str
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#39;");

   if (!jsonData || typeof jsonData !== "object") {
       console.error("Invalid Data Structure:", jsonData);
       return `
       <html><body><h2>Invalid Data</h2>
       <p>Missing expected properties in JSON data.</p></body></html>`;
   }

   const {
       "file_contents": fileContents = [],
       "detail_explanation": detailExplanation = "No explanation available"
   } = jsonData as any;

   const fileContentHtml = Array.isArray(fileContents) && fileContents.length
       ? fileContents.map((file: any, index: number) => `
           <div class="file-container">
               <h3>File: ${escapeHtml(file.path || "Unknown File")}</h3>
               <button class="copy-btn" onclick="copyToClipboard(${index})">Copy</button>
               <pre id="file-content-${index}">${escapeHtml(file.corrected_code || "No content available")}</pre>
           </div>
       `).join("")
       : "<p>No file content available.</p>";

   return `
   <html>
   <head>
       <style>
           body { font-family: Arial, sans-serif; background-color: #1e1e1e; color: #ffffff; padding: 20px; }
           pre { background: #1e1e1e; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; }
           h2, h3 { color: #ffffff; }
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
           .details-box {
               background: #252526;
               border: 1px solid #444;
               border-radius: 5px;
               padding: 15px;
               margin-top: 20px;
           }
       </style>
   </head>
   <body>
       <div class="container">
           <h2>${title}</h2>
           <div class="details-box">
               <h3>Details Explanation</h3>
               <pre>${escapeHtml(detailExplanation)}</pre>
           </div>
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
