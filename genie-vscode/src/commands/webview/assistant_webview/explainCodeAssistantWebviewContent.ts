export function explainCodeAssistantWebViewContent(content: string, title: string): string {
    interface explanation {
        overview: string;
        detailedExplanation: string;
        status?: string;
    }

    interface ParsedContent {
        quality: string;
        remarks: string;
        explanation: explanation[];
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
    </div>
    <div id="content">
        <h2>Summary:</h2>
        <table>
            <tr>
                <th>Quality</th>
                <th>Remarks</th>
            </tr>
            <tr>
                <td>${parsedContent.quality}</td>
                <td>${parsedContent.remarks}</td>
            </tr>
        </table>
        <h2>Issues:</h2>
        <table id="issuesTable">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Overview</th>
                    <th>DetailedExplanation</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="issuesBody">
                ${parsedContent.explanation
                    .map(
                        (explanation: explanation, index: number) => `
                        <tr data-severity="">
                            <td>${index + 1}</td>
                            <td>${explanation.overview}</td>
                            <td>${explanation.detailedExplanation}
                            
                            <td>
                                <select class="status-dropdown" onchange="updateStatus(${index}, this.value)">
                                    <option value="accept" ${explanation.status === 'accept' ? 'selected' : ''}>Accept</option>
                                    <option value="reject" ${explanation.status === 'reject' ? 'selected' : ''}>Reject</option>
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

