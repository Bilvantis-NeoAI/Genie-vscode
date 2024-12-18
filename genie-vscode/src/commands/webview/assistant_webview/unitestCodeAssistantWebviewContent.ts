export function unittestCodeAssistantWebViewContent(content: string, title: string): string {
    interface unitTests {
        testCase: string;
        importance: number;
        severity: string;
        explanation: string;
        status?: string;
    }

    interface ParsedContent {
        details: string;
        unitTests: unitTests[];
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
            max-width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        th, td {
            text-align: left;
            padding: 8px;
            border: 1px solid #ddd;
        }
        th {
            background-color: #07439C;
            color: white;
        }
        td.testcase {
        max-width: 400px; /* Set a maximum width for the column */
        overflow-x: auto; /* Enable horizontal scrolling */
        white-space: nowrap; /* Prevent wrapping */
        scrollbar-color: white lightgray; /* Thumb color and track color */
        scrollbar-width: thin; /* Makes the scrollbar thinner */
        }
        td.pre-formatted {
            max-width: 100px;
            word-wrap: break-word;
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
    </div>
    <div id="content">
        <h2>Summary:</h2>
        <table>
            <tr>
                <th>Details</th>
            </tr>
            <tr>
                <td>${parsedContent.details}</td>
            </tr>
        </table>
        <h2>Issues:</h2>
        <table id="issuesTable">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>TestCase</th>
                    <th>Explanation</th>
                    <th>Importance</th>
                    <th>
                        Severity
                    </th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="issuesBody">
                ${parsedContent.unitTests
                    .sort((a: unitTests, b: unitTests) => {
                        const severityOrder: { [key: string]: number } = { critical: 0, major: 1, minor: 2, cosmetic: 3 };
                        const severityA = severityOrder[a.severity.toLowerCase()] ?? 4;
                        const severityB = severityOrder[b.severity.toLowerCase()] ?? 4;
                        return severityA - severityB;
                    })
                    .map(
                        (unitTests: unitTests, index: number) => `
                        <tr data-severity="${unitTests.severity.toLowerCase()}">
                            <td>${index + 1}</td>
                            <td class="testcase"><pre>${unitTests.testCase}</pre></td>
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
                    `
                    )
                    .join('')}
            </tbody>
        </table>
    </div>
  </body>
  </html>`;
}

