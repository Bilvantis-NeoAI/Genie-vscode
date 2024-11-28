"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewGetWebViewContent = reviewGetWebViewContent;
// working fine without filter
function reviewGetWebViewContent(content, title) {
    let parsedContent;
    try {
        parsedContent = JSON.parse(content);
    }
    catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return `<h1>Error parsing content</h1><p>${errorMessage}</p>`;
    }
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f0f0;
            color: #333;
            margin: 0;
            padding: 10px;
        }
        h1, h2 {
            color: #047ccc;
        }
        .header {
            border-bottom: 1px solid #047ccc;
            margin-bottom: 10px;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        th, td {
            text-align: left;
            padding: 8px;
            border: 1px solid #ddd;
        }
        th {
            background-color: #047ccc;
            color: white;
        }
        td.pre-formatted {
            max-width: 100px;
            word-wrap: break-word;
            white-space: pre-wrap;
        }
        td.explanation, td.fix {
            max-width: 100px;
            word-wrap: break-word;
        }
        .severity-critical {
            color: red;
        }
        .severity-minor {
            color: orange;
        }
        .severity-major {
            color: red;
        }
        .severity-cosmetic {
            color: blue;
        }
        button.download-btn {
            padding: 5px 10px;
            background-color: #047ccc;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button.download-btn:hover {
            background-color: #035f99;
        }
    </style>
  </head>
  <body>
    <div class="header">
        <h1>${title}</h1>
        <button class="download-btn" onclick="downloadPDF()">Download as PDF</button>
    </div>
    <div id="content">
        <h2>Summary</h2>
        <table>
            <tr>
                <th>Quality</th>
                <th>Remarks</th>
                <th>Overall Severity</th>
            </tr>
            <tr>
                <td>${parsedContent.quality}</td>
                <td>${parsedContent.remarks}</td>
                <td>${parsedContent.overallSeverity}</td>
            </tr>
        </table>
        <h2>Issues</h2>
        <table>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Identification</th>
                    <th>Fix</th>
                    <th>Explanation</th>
                    <th>Severity</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${parsedContent.issues
        .sort((a, b) => {
        const severityOrder = { critical: 0, major: 1, minor: 2, cosmetic: 3 };
        const severityA = severityOrder[a.severity.toLowerCase()] ?? 4;
        const severityB = severityOrder[b.severity.toLowerCase()] ?? 4;
        return severityA - severityB;
    })
        .map((issue, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td><pre>${issue.identification}</pre></td>
                            <td><pre>${issue.fix}</pre></td>
                            <td>${issue.explanation}</td>
                            <td class="severity severity-${issue.severity.toLowerCase()}">${issue.severity}</td>
                            <td>
                                <select class="status-dropdown" onchange="updateStatus(${index}, this.value)">
                                    <option value="accept" ${issue.status === 'accept' ? 'selected' : ''}>Accept</option>
                                    <option value="reject" ${issue.status === 'reject' ? 'selected' : ''}>Reject</option>
                                </select>
                            </td>
                        </tr>
                    `)
        .join('')}
            </tbody>
        </table>
    </div>
    <script>
        function downloadPDF() {
            const vscode = acquireVsCodeApi();
            vscode.postMessage({ command: 'generatePdf' });
        }
        function updateStatus(index, value) {
            console.log("Row:", index, "Status Updated to:", value);
        }
    </script>
  </body>
  </html>`;
}
//# sourceMappingURL=reviewWebviewContent.js.map