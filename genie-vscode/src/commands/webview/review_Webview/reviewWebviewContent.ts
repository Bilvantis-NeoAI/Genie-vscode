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
        quality?: string;
        standardsAdherence?: string; 
        remarks: string;
        overallSeverity?: string;
        issues: Issue[];
    }

    let parsedContent: ParsedContent;
    try {
        parsedContent = JSON.parse(content);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return `<h1>Error parsing content</h1><p>${errorMessage}</p>`;
    }


    // Check if `overallSeverity` exists
    const hasOverallSeverity = parsedContent.hasOwnProperty('overallSeverity');
    
     // Determine which column to display
     const showQuality = parsedContent.hasOwnProperty('quality');
     const showStandardsAdherence = parsedContent.hasOwnProperty('standardsAdherence');

    // Extract unique severities from the issues
    const uniqueSeverities = [...new Set(parsedContent.issues.map(issue => issue.severity.toLowerCase()))];

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
            max-width: 100%; /* Ensure table doesn't exceed container width */
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
            /* Add specific styling for the Remarks column */
        th.remarks, td.remarks {
            width: 800px; /* Adjust the width as needed */
            white-space: nowrap; /* Prevent text wrapping */
            overflow: hidden; /* Ensure content doesn't overflow */
            text-overflow: ellipsis; /* Add ellipsis if text overflows */
        }
        td.identification {
        max-width: 300px; /* Set a maximum width for the column */
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
            background-color: #07439C;
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
                
                 ${showQuality ? '<th>Quality</th>' : ''}
                ${showStandardsAdherence ? '<th>Quality</th>' : ''}
                
                <th class="remarks">Remarks</th>
                ${hasOverallSeverity ? '<th>Overall Severity</th>' : ''}
            </tr>
            <tr>
                ${showQuality ? `<td>${parsedContent.quality}</td>` : ''}
                ${showStandardsAdherence ? `<td>${parsedContent.standardsAdherence}</td>` : ''}
                <td>${parsedContent.remarks}</td>
                ${hasOverallSeverity ? `<td>${parsedContent.overallSeverity}</td>` : ''}
            </tr>
        </table>
        <h2>Issues:</h2>
        <table id="issuesTable">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Identification</th>
                    <th>Fix</th>
                    <th>Explanation</th>
                    <th>
                        Severity
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
                            <td class="identification"><pre>${issue.identification}</pre></td>
                            <td class="identification"><pre>${issue.fix}</pre></td>
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
    // Function to filter table rows by severity
    function filterSeverity(severity) {
        const rows = document.querySelectorAll('#issuesBody tr'); // Select all rows in the table body
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
    document.querySelectorAll('.filter-options a').forEach(option => {
        option.addEventListener('click', event => {
            event.preventDefault(); // Prevent default link behavior
            const severity = option.getAttribute('onclick').match(/filterSeverity\\('(.*?)'\\)/)[1]; // Extract severity value
            filterSeverity(severity); // Call the filter function
        });
    });
    </script>
  </body>
  </html>`;
}
