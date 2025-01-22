import * as XLSX from 'xlsx';

export function reviewGetWebViewContent(
  content: string,
  title: string
): string {
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
  const hasOverallSeverity = parsedContent.hasOwnProperty("overallSeverity");

  // Determine which column to display
  const showQuality = parsedContent.hasOwnProperty("quality");
  const showStandardsAdherence =
    parsedContent.hasOwnProperty("standardsAdherence");

  // Extract unique severities from the issues
  const uniqueSeverities = [
    ...new Set(
      parsedContent.issues.map((issue) => issue.severity.toLowerCase())
    ),
  ];
  const reviewContentJSON = JSON.stringify(parsedContent, null, 2);

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
    
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
                <h2>Summary:</h2>
            </div>
            <div>
                <button id="downloadButton" class="download-btn">Download as PDF</button>
                <button id="downloadButtonExcel" class="download-btn">Download as Excel</button>
            </div>
            
        </div>

        <table>
            <tr>
                ${showQuality ? "<th>Quality</th>" : ""}
                ${showStandardsAdherence ? "<th>Standards Adherence</th>" : ""}
                <th class="remarks">Remarks</th>
                ${hasOverallSeverity ? "<th>Overall Severity</th>" : ""}
            </tr>
            <tr>
                ${showQuality ? `<td>${parsedContent.quality}</td>` : ""}
                ${
                  showStandardsAdherence
                    ? `<td>${parsedContent.standardsAdherence}</td>`
                    : ""
                }
                <td>${parsedContent.remarks}</td>
                ${
                  hasOverallSeverity
                    ? `<td>${parsedContent.overallSeverity}</td>`
                    : ""
                }
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
                    <th>Severity</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="issuesBody">
                ${parsedContent.issues
                  .sort((a, b) => {
                    const severityOrder: { [key: string]: number } = {
                      critical: 0,
                      major: 1,
                      minor: 2,
                      cosmetic: 3,
                    };
                    const severityA =
                      severityOrder[a.severity.toLowerCase()] ?? 4;
                    const severityB =
                      severityOrder[b.severity.toLowerCase()] ?? 4;
                    return severityA - severityB;
                  })
                  .map(
                    (issue, index) => `
                        <tr data-severity="${issue.severity.toLowerCase()}">
                            <td>${index + 1}</td>
                            <td class="identification"><pre>${
                              issue.identification
                            }</pre></td>
                            <td class="identification"><pre>${
                              issue.fix
                            }</pre></td>
                            <td>${issue.explanation}</td>
                            <td class="severity severity-${issue.severity.toLowerCase()}">${
                      issue.severity
                    }</td>
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
                  .join("")}
            </tbody>
        </table>
    </div>
    <script>
        const json_data = ${JSON.stringify(parsedContent, null, 2)};
        const issues = ${JSON.stringify(parsedContent.issues)};

        function updateStatus(index, value) {
            issues[index].status = value;
        }
        
        document.getElementById("downloadButton").addEventListener("click", () => {
    const hasQuality = json_data.hasOwnProperty('quality') && json_data.quality;
    const hasOverallSeverity = json_data.hasOwnProperty('overallSeverity') && json_data.overallSeverity;
    const hasStandardsAdherence = json_data.hasOwnProperty('standardsAdherence') && json_data.standardsAdherence;

    const summaryTableBody = [
        [
            ...(hasQuality ? [{ text: 'Quality', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }] : []),
            ...(hasStandardsAdherence ? [{ text: 'Standards Adherence', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }] : []),
            { text: 'Remarks', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
            ...(hasOverallSeverity ? [{ text: 'Overall Severity', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }] : [])
        ],
        [
            ...(hasQuality ? [{ text: json_data.quality || '', fontSize: 10, alignment: 'center' }] : []),
            ...(hasStandardsAdherence ? [{ text: json_data.standardsAdherence || '', fontSize: 10, alignment: 'center' }] : []),
            { text: json_data.remarks, fontSize: 10 },
            ...(hasOverallSeverity ? [{ text: json_data.overallSeverity || '', fontSize: 10, alignment: 'center' }] : [])
        ]
    ];

    const issuesTableBody = [
        [
            { text: 'S.No', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
            { text: 'Identification', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
            { text: 'Fix', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
            { text: 'Explanation', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
            { text: 'Severity', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
            { text: 'Status', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }
        ],
        ...issues.map((issue, index) => [
            { text: index + 1, fontSize: 10, alignment: 'center' },
            { text: issue.identification, fontSize: 10 },
            { text: issue.fix, fontSize: 10 },
            { text: issue.explanation, fontSize: 10 },
            { text: issue.severity, fontSize: 10, alignment: 'center' },
            { text: issue.status || 'Accept', fontSize: 10, alignment: 'center' }
        ])
    ];

    const docDefinition = {
        pageOrientation: 'landscape',
        content: [
            { text: '${title}', style: 'header' },
            { text: 'Summary:', style: 'subheader' },
            {
                table: {
                    widths: [
                        ...(hasQuality ? [100] : []),
                        ...(hasStandardsAdherence ? [150] : []),
                        '*',
                        ...(hasOverallSeverity ? [150] : [])
                    ],
                    body: summaryTableBody
                },
                layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#CCCCCC',
                    vLineColor: () => '#CCCCCC',
                    paddingLeft: () => 5,
                    paddingRight: () => 5,
                    paddingTop: () => 5,
                    paddingBottom: () => 5
                }
            },
            { text: 'Issues:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['5%', '27%', '27%', '27%', '8%', '6%'],
                    body: issuesTableBody
                },
                layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#CCCCCC',
                    vLineColor: () => '#CCCCCC',
                    paddingLeft: () => 5,
                    paddingRight: () => 5,
                    paddingTop: () => 5,
                    paddingBottom: () => 5
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            jsonText: {
                fontSize: 10,
                margin: [0, 5, 0, 10]
            }
        }
    };

    pdfMake.createPdf(docDefinition).download('${title}_${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '_').toLowerCase()}.pdf'); 
   });
        
    document.getElementById("downloadButtonExcel").addEventListener("click", () => {
    const workbook = XLSX.utils.book_new();

    const hasQuality = json_data.hasOwnProperty('quality') && json_data.quality;
    const hasOverallSeverity = json_data.hasOwnProperty('overallSeverity') && json_data.overallSeverity;
     const hasStandardsAdherence = json_data.hasOwnProperty('standardsAdherence') && json_data.standardsAdherence;

    const summaryHeaders = [
        ...(hasQuality ? ['Quality'] : []),
        ...(hasStandardsAdherence ? ['Standards Adherence'] : []),
        'Remarks',
        ...(hasOverallSeverity ? ['Overall Severity'] : [])
    ];

    const summaryData = [
        ...(hasQuality ? [json_data.quality || ''] : []),
        ...(hasStandardsAdherence ? [json_data.standardsAdherence || ''] : []),
        json_data.remarks,
        ...(hasOverallSeverity ? [json_data.overallSeverity || ''] : [])
    ];

    const summarySheetData = [summaryHeaders, summaryData];
    const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetData);

    const issuesSheetData = [
        ['S.No', 'Identification', 'Fix', 'Explanation', 'Severity', 'Status'],
        ...issues.map((issue, index) => [
            index + 1,
            issue.identification,
            issue.fix,
            issue.explanation,
            issue.severity,
            issue.status || 'Accept'
        ])
    ];
    const issuesSheet = XLSX.utils.aoa_to_sheet(issuesSheetData);

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    XLSX.utils.book_append_sheet(workbook, issuesSheet, 'Issues');

    XLSX.writeFile(workbook, '${title}_${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '_').toLowerCase()}.xlsx');
});
    
    </script>
</body>
</html>`;
}