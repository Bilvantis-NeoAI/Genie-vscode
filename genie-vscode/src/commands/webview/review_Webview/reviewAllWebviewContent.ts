export function reviewAllWebViewContent(content: string, title: string): string {
    interface issues {
        identification: string;
        explanation: string;
        fix: string;
        severity: string;
        status?: string;
    }

    interface ParsedContent {
        quality: string;
        remarks: string;
        overallSeverity: string;
        issues: issues[];
    }

    let parsedContent: ParsedContent;
    try {
        parsedContent = JSON.parse(content);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return `<h1>Error parsing content</h1><p>${errorMessage}</p>`;
    }
return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.4/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.4/vfs_fonts.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f2f0f0;
            color: #333;
            margin: 0;
            padding: 10px;
            box-sizing: border-box;
        }
        h1, h2 {
            color: #07439C;
        }
        .header {
            border-bottom: 1px solid #07439C;
            margin-bottom: 10px;
            padding-bottom: 5px;
        }
        .table-container {
            overflow-x: auto; /* Add horizontal scroll for small screens */
        }
        table {
            width: 100%;
            table-layout: fixed; /* Keeps table width fixed */
            border-collapse: collapse;
            margin: 10px 0;
        }

        th, td {
            text-align: left;
            padding: 8px;
            border: 1px solid #ddd;
            word-wrap: break-word; /* Prevents text overflow */
            overflow: hidden; /* Hides overflow except for "fix" column */
        }

        td.fix {
            min-width: 200px; /* Ensures it does not shrink too much */
            max-width: 300px; /* Defines max width */
            overflow-x: auto; /* Enables horizontal scrolling */
            white-space: nowrap; /* Prevents text from wrapping */
            // display: block; /* Ensures scrolling works */
            scrollbar-color: white lightgray; /* Thumb color and track color */
            scrollbar-width: thin;
        }

        td.fix::-moz-scrollbar {
            height: 5px; /* Adjust scrollbar thickness */
}

        th {
            background-color: #07439C;
            color: white;
        }
        td.pre-formatted {
            max-width: 100px;
            word-wrap: break-word;
        }
        td.identification, td.explanation {
            max-width: 100px;
            word-wrap: break-word;
        }  
        .quality {width: 100px}  
        .overall_severity { width: 150px}    
        .s_no {width: 40px}
        .severity { width: 80px}
        .status { width: 80px}
        .severity-critical { color: red; }
        .severity-major { color: orange; }
        .severity-minor { color: blue; }
        .severity-cosmetic { color: green; }
        .download-btn {
            padding: 5px 10px;
            background-color: #07439C;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .download-btn:hover {
            background-color: #035f99;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
    </div>
    <div id="content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h2>Summary:</h2>
            <div>
                <button id="downloadButton" class="download-btn">Download as PDF</button>
                <button id="downloadButtonExcel" class="download-btn">Download as Excel</button>
            </div>
        </div>
        <table>
            <tr>
                <th class="quality">Quality</th>
                <th class="remark">Remarks</th>
                <th class="overall_severity">Overall Severity</th>
            </tr>
            <tr>
                <td>${parsedContent.quality}</td>
                <td>${parsedContent.remarks}</td>
                <td>${parsedContent.overallSeverity}</td>
            </tr>
        </table>
        </br>
        ${Object.entries(parsedContent.issues)
            .map(([category, issues]) =>
                Array.isArray(issues) && issues.length > 0
                    ? `<h2>${category.charAt(0).toUpperCase() + category.slice(1)}:</h2>
                        <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th class="s_no">S.No</th>
                                    <th class="identification">Identification</th>
                                    <th class="explanation">Explanation</th>
                                    <th>Fix</th>
                                    <th class="severity">Severity</th>
                                    <th class="status">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${issues
                                    .map(
                                        (issue, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${issue.identification}</td>
                                        <td>${issue.explanation}</td>
                                        <td class="fix"><pre>${issue.fix}</pre></td>
                                        <td class="severity-${issue.severity.toLowerCase()}">${issue.severity}</td>
                                        <td>
                                            <select class="status-dropdown" onchange="updateStatus(${index}, this.value)">
                                                <option value="Accept" ${
                                                  issue.status === "Accept"
                                                    ? "selected"
                                                    : ""
                                                }>Accept</option>
                                                <option value="Reject" ${
                                                  issue.status === "Reject"
                                                    ? "selected"
                                                    : ""
                                                }>Reject</option>
                                            </select>
                                        </td>
                                    </tr>
                                `
                                    )
                                    .join('')}
                            </tbody>
                        </table>
                        </div>
                        `
                    : ""
            )
            .join("")}
    </div>
</body>
</html>`;

}

