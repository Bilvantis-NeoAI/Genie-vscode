// // working fine without filter
// export function reviewGetWebViewContent(content: string, title: string): string {
//     let parsedContent;
//     try {
//         parsedContent = JSON.parse(content);
//     } catch (e) {
//         const errorMessage = e instanceof Error ? e.message : String(e);
//         return `<h1>Error parsing content</h1><p>${errorMessage}</p>`;
//     }
  
//     return `<!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>${title}</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             background-color: #f2f0f0;
//             color: #333;
//             margin: 0;
//             padding: 10px;
//         }
//         h1, h2 {
//             color: #047ccc;
//         }
//         .header {
//             border-bottom: 1px solid #047ccc;
//             margin-bottom: 10px;
//             padding-bottom: 5px;
//         }
//         table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 10px 0;
//         }
//         th, td {
//             text-align: left;
//             padding: 8px;
//             border: 1px solid #ddd;
//         }
//         th {
//             background-color: #047ccc;
//             color: white;
//         }
//         td.pre-formatted {
//             max-width: 100px;
//             word-wrap: break-word;
//             white-space: pre-wrap;
//         }
//         td.explanation, td.fix {
//             max-width: 100px;
//             word-wrap: break-word;
//         }
//         .severity-critical {
//             color: red;
//         }
//         .severity-minor {
//             color: orange;
//         }
//         .severity-major {
//             color: red;
//         }
//         .severity-cosmetic {
//             color: blue;
//         }
//         button.download-btn {
//             padding: 5px 10px;
//             background-color: #047ccc;
//             color: white;
//             border: none;
//             border-radius: 5px;
//             cursor: pointer;
//         }
//         button.download-btn:hover {
//             background-color: #035f99;
//         }
//     </style>
//   </head>
//   <body>
//     <div class="header">
//         <h1>${title}</h1>
//         <button class="download-btn" onclick="downloadPDF()">Download as PDF</button>
//     </div>
//     <div id="content">
//         <h2>Summary</h2>
//         <table>
//             <tr>
//                 <th>Quality</th>
//                 <th>Remarks</th>
//                 <th>Overall Severity</th>
//             </tr>
//             <tr>
//                 <td>${parsedContent.quality}</td>
//                 <td>${parsedContent.remarks}</td>
//                 <td>${parsedContent.overallSeverity}</td>
//             </tr>
//         </table>
//         <h2>Issues</h2>
//         <table>
//             <thead>
//                 <tr>
//                     <th>S.No</th>
//                     <th>Identification</th>
//                     <th>Fix</th>
//                     <th>Explanation</th>
//                     <th>Severity</th>
//                     <th>Status</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${parsedContent.issues
//                     .sort((a: { severity: string }, b: { severity: string }) => {
//                         const severityOrder: { [key: string]: number } = { critical: 0, major: 1, minor: 2, cosmetic: 3 };
//                         const severityA = severityOrder[a.severity.toLowerCase()] ?? 4;
//                         const severityB = severityOrder[b.severity.toLowerCase()] ?? 4;
//                         return severityA - severityB;
//                     })
//                     .map(
//                         (issue: any, index: number) => `
//                         <tr>
//                             <td>${index + 1}</td>
//                             <td><pre>${issue.identification}</pre></td>
//                             <td><pre>${issue.fix}</pre></td>
//                             <td>${issue.explanation}</td>
//                             <td class="severity severity-${issue.severity.toLowerCase()}">${issue.severity}</td>
//                             <td>
//                                 <select class="status-dropdown" onchange="updateStatus(${index}, this.value)">
//                                     <option value="accept" ${issue.status === 'accept' ? 'selected' : ''}>Accept</option>
//                                     <option value="reject" ${issue.status === 'reject' ? 'selected' : ''}>Reject</option>
//                                 </select>
//                             </td>
//                         </tr>
//                     `
//                     )
//                     .join('')}
//             </tbody>
//         </table>
//     </div>
//     <script>
//         function downloadPDF() {
//             const vscode = acquireVsCodeApi();
//             vscode.postMessage({ command: 'generatePdf' });
//         }
//         function updateStatus(index, value) {
//             console.log("Row:", index, "Status Updated to:", value);
//         }
//     </script>
//   </body>
//   </html>`;
//   }


// filter icon getting based on data
// export function reviewGetWebViewContent(content: string, title: string): string {
//     interface Issue {
//         identification: string;
//         explanation: string;
//         fix: string;
//         score: number;
//         severity: string;
//         status?: string;
//     }

//     interface ParsedContent {
//         quality: string;
//         remarks: string;
//         overallSeverity: string;
//         issues: Issue[];
//     }

//     let parsedContent: ParsedContent;
//     try {
//         parsedContent = JSON.parse(content);
//     } catch (e) {
//         const errorMessage = e instanceof Error ? e.message : String(e);
//         return `<h1>Error parsing content</h1><p>${errorMessage}</p>`;
//     }

//     // Extract unique severities from the issues
//     const uniqueSeverities = [...new Set(parsedContent.issues.map(issue => issue.severity.toLowerCase()))];

//     return `<!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>${title}</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             background-color: #f2f0f0;
//             color: #333;
//             margin: 0;
//             padding: 10px;
//         }
//         h1, h2 {
//             color: #047ccc;
//         }
//         .header {
//             border-bottom: 1px solid #047ccc;
//             margin-bottom: 10px;
//             padding-bottom: 5px;
//         }
//         table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 10px 0;
//         }
//         th, td {
//             text-align: left;
//             padding: 8px;
//             border: 1px solid #ddd;
//         }
//         th {
//             background-color: #047ccc;
//             color: white;
//         }
//         td.pre-formatted {
//             max-width: 100px;
//             word-wrap: break-word;
//             white-space: pre-wrap;
//         }
//         td.explanation, td.fix {
//             max-width: 100px;
//             word-wrap: break-word;
//         }
//         .severity-critical {
//             color: red;
//         }
//         .severity-minor {
//             color: orange;
//         }
//         .severity-major {
//             color: red;
//         }
//         .severity-cosmetic {
//             color: blue;
//         }
//         button.download-btn {
//             padding: 5px 10px;
//             background-color: #047ccc;
//             color: white;
//             border: none;
//             border-radius: 5px;
//             cursor: pointer;
//         }
//         button.download-btn:hover {
//             background-color: #035f99;
//         }
//         .filter-options {
//             display: none;
//             position: absolute;
//             background-color: #f1f1f1;
//             box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
//             z-index: 1;
//             min-width: 150px;
//         }
//         .filter-options a {
//             color: black;
//             padding: 8px 12px;
//             text-decoration: none;
//             display: block;
//         }
//         .filter-options a:hover {
//             background-color: #ddd;
//         }
//         .filter-container:hover .filter-options {
//             display: block;
//         }
//     </style>
//   </head>
//   <body>
//     <div class="header">
//         <h1>${title}</h1>
//         <button class="download-btn" onclick="downloadPDF()">Download as PDF</button>
//     </div>
//     <div id="content">
//         <h2>Summary</h2>
//         <table>
//             <tr>
//                 <th>Quality</th>
//                 <th>Remarks</th>
//                 <th>Overall Severity</th>
//             </tr>
//             <tr>
//                 <td>${parsedContent.quality}</td>
//                 <td>${parsedContent.remarks}</td>
//                 <td>${parsedContent.overallSeverity}</td>
//             </tr>
//         </table>
//         <h2>Issues</h2>
//         <table id="issuesTable">
//             <thead>
//                 <tr>
//                     <th>S.No</th>
//                     <th>Identification</th>
//                     <th>Fix</th>
//                     <th>Explanation</th>
//                     <th>
//                         Severity
//                         <div class="filter-container">
//                             <span>🔽</span>
//                             <div class="filter-options" id="filterOptions">
//                                 <a href="#" onclick="filterSeverity('all')">All</a>
//                                 ${uniqueSeverities.map(severity => `
//                                     <a href="#" onclick="filterSeverity('${severity}')">${severity.charAt(0).toUpperCase() + severity.slice(1)}</a>
//                                 `).join('')}
//                             </div>
//                         </div>
//                     </th>
//                     <th>Status</th>
//                 </tr>
//             </thead>
//             <tbody id="issuesBody">
//                 ${parsedContent.issues
//                     .sort((a: Issue, b: Issue) => {
//                         const severityOrder: { [key: string]: number } = { critical: 0, major: 1, minor: 2, cosmetic: 3 };
//                         const severityA = severityOrder[a.severity.toLowerCase()] ?? 4;
//                         const severityB = severityOrder[b.severity.toLowerCase()] ?? 4;
//                         return severityA - severityB;
//                     })
//                     .map(
//                         (issue: Issue, index: number) => `
//                         <tr data-severity="${issue.severity.toLowerCase()}">
//                             <td>${index + 1}</td>
//                             <td><pre>${issue.identification}</pre></td>
//                             <td><pre>${issue.fix}</pre></td>
//                             <td>${issue.explanation}</td>
//                             <td class="severity severity-${issue.severity.toLowerCase()}">${issue.severity}</td>
//                             <td>
//                                 <select class="status-dropdown" onchange="updateStatus(${index}, this.value)">
//                                     <option value="accept" ${issue.status === 'accept' ? 'selected' : ''}>Accept</option>
//                                     <option value="reject" ${issue.status === 'reject' ? 'selected' : ''}>Reject</option>
//                                 </select>
//                             </td>
//                         </tr>
//                     `
//                     )
//                     .join('')}
//             </tbody>
//         </table>
//     </div>
//     <script>
//     // Function to filter table rows by severity
//     function filterSeverity(severity) {
//         const rows = document.querySelectorAll('#issuesBody tr'); // Select all rows in the table body
//         rows.forEach(row => {
//             const rowSeverity = row.getAttribute('data-severity'); // Get the severity level from the row
//             if (severity === 'all' || rowSeverity === severity) {
//                 row.style.display = ''; // Show the row if severity matches or 'all' is selected
//             } else {
//                 row.style.display = 'none'; // Hide the row otherwise
//             }
//         });
//     }

//     // Event Listener for Filter Options
//     document.querySelectorAll('.filter-options a').forEach(option => {
//         option.addEventListener('click', event => {
//             event.preventDefault(); // Prevent default link behavior
//             const severity = option.getAttribute('onclick').match(/filterSeverity\\('(.*?)'\\)/)[1]; // Extract severity value
//             filterSeverity(severity); // Call the filter function
//         });
//     });
//     </script>

//   </body>
//   </html>`;
// }


export function reviewGetWebViewContent(content: string, title: string): string {
    interface Issue {
        identification: string;
        explanation: string;
        fix: string;
        score: number;
        severity: string;
        status?: string;
    }

    interface ParsedContent {
        quality: string;
        remarks: string;
        overallSeverity: string;
        issues: Issue[];
    }

    let parsedContent: ParsedContent;
    try {
        parsedContent = JSON.parse(content);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return `<h1>Error parsing content</h1><p>${errorMessage}</p>`;
    }

    // Extract unique severities from the issues
    const uniqueSeverities = [...new Set(parsedContent.issues.map(issue => issue.severity.toLowerCase()))];

    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
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
        .filter-options {
            display: none;
            position: absolute;
            background-color: #f1f1f1;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
            min-width: 150px;
        }
        .filter-options a {
            color: black;
            padding: 8px 12px;
            text-decoration: none;
            display: block;
        }
        .filter-options a:hover {
            background-color: #ddd;
        }
        .filter-container:hover .filter-options {
            display: block;
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
        <table id="issuesTable">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Identification</th>
                    <th>Fix</th>
                    <th>Explanation</th>
                    <th>
                        Severity
                        <div class="filter-container">
                            <span>🔽</span>
                            <div class="filter-options" id="filterOptions">
                                <a href="#" onclick="filterSeverity('all')">All</a>
                                ${uniqueSeverities.map(severity => `
                                    <a href="#" onclick="filterSeverity('${severity}')">${severity.charAt(0).toUpperCase() + severity.slice(1)}</a>
                                `).join('')}
                            </div>
                        </div>
                    </th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="issuesBody">
                ${parsedContent.issues
                    .sort((a: Issue, b: Issue) => {
                        const severityOrder: { [key: string]: number } = { critical: 0, major: 1, minor: 2, cosmetic: 3 };
                        const severityA = severityOrder[a.severity.toLowerCase()] ?? 4;
                        const severityB = severityOrder[b.severity.toLowerCase()] ?? 4;
                        return severityA - severityB;
                    })
                    .map(
                        (issue: Issue, index: number) => `
                        <tr data-severity="${issue.severity.toLowerCase()}">
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
                    `
                    )
                    .join('')}
            </tbody>
        </table>
    </div>
    <script>
    function downloadPDF() {
            const element = document.body;
            const opt = {
                filename: '${title.replace(/ /g, '_')}.pdf',
                margin: 0,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
            };
            html2pdf().set(opt).from(element).save();
        }

    // Function to filter table rows by severity
    function filterSeverity(severity: string) {
        const rows = document.querySelectorAll<HTMLTableRowElement>('#issuesBody tr'); // Select all rows in the table body
        rows.forEach(row => {
            const rowSeverity = row.getAttribute('data-severity'); // Get the severity level from the row
            if (severity === 'all' || rowSeverity === severity) {
                row.style.display = ''; // Show the row if severity matches or 'all' is selected
            } else {
                row.style.display = 'none'; // Hide the row otherwise
            }
        });
    }

    // Event Listener for Filter Options
    document.querySelectorAll<HTMLAnchorElement>('.filter-options a').forEach(option => {
        option.addEventListener('click', event => {
            event.preventDefault(); // Prevent default link behavior
            const severity = option.getAttribute('onclick')!.match(/filterSeverity\\('(.*?)'\\)/)![1]; // Extract severity value
            filterSeverity(severity); // Call the filter function
        });
    });
    </script>

  </body>
  </html>`;
}

