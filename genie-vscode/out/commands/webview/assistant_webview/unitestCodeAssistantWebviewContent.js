"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unittestCodeAssistantWebViewContent = unittestCodeAssistantWebViewContent;
function unittestCodeAssistantWebViewContent(content, title) {
    let parsedContent;
    try {
        parsedContent = JSON.parse(content);
    }
    catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return `<h1>Error parsing content</h1><p>${errorMessage}</p>`;
    }
    // Extract unique severities from the issues
    const uniqueSeverities = [...new Set(parsedContent.unitTests.map(unitTests => unitTests.severity.toLowerCase()))];
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
                    <th>TestCase</th>
                    <th>Explanation</th>
                    <th>Importance</th>
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
                ${parsedContent.unitTests
        .sort((a, b) => {
        const severityOrder = { critical: 0, major: 1, minor: 2, cosmetic: 3 };
        const severityA = severityOrder[a.severity.toLowerCase()] ?? 4;
        const severityB = severityOrder[b.severity.toLowerCase()] ?? 4;
        return severityA - severityB;
    })
        .map((unitTests, index) => `
                        <tr data-severity="${unitTests.severity.toLowerCase()}">
                            <td>${index + 1}</td>
                            <td><pre>${unitTests.testCase}</pre></td>
                            <td>${unitTests.explanation}
                            <td>${unitTests.importance}</td>
                            <td class="severity severity-${unitTests.severity.toLowerCase()}">${unitTests.severity}</td>
                            <td>
                                <select class="status-dropdown" onchange="updateStatus(${index}, this.value)">
                                    <option value="accept" ${unitTests.status === 'accept' ? 'selected' : ''}>Accept</option>
                                    <option value="reject" ${unitTests.status === 'reject' ? 'selected' : ''}>Reject</option>
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
//# sourceMappingURL=unitestCodeAssistantWebviewContent.js.map