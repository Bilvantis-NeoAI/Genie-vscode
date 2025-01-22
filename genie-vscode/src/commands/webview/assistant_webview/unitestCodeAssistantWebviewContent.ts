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
                <th>Details</th>
            </tr>
            <tr>
                <td>${parsedContent.details}</td>
            </tr>
        </table>
        <h2>Unit Test Cases:</h2>
        <table id="issuesTable">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Test Case</th>
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
                                    <option value="Accept" ${
                                      unitTests.status === "Accept"
                                        ? "selected"
                                        : ""
                                    }>Accept</option>
                                    <option value="Reject" ${
                                      unitTests.status === "Reject"
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
    <script>
        const json_data = ${JSON.stringify(parsedContent, null, 2)};
        const unitTests = ${JSON.stringify(parsedContent.unitTests)};

        function updateStatus(index, value) {
            unitTests[index].status = value;
        }

        document.getElementById("downloadButton").addEventListener("click", () => {
    const docDefinition = {
        pageOrientation: 'landscape',
        content: [
            { text: '${title}', style: 'header' },
            { text: 'Summary:', style: 'subheader' },
            {
                table: {
                    widths: ['*'],
                    body: [
                        [
                            { text: 'Details', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }
                        ],
                        [{ text: json_data.details || '', fontSize: 10 }]
                    ]
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
            { text: 'Unit Test Cases:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: [30, '*', '*', 55, 40, 40],
                    body: [
                        [
                            { text: 'S.No', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                            { text: 'Test Case', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                            { text: 'Explanation', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                            { text: 'Importance', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                            { text: 'Severity', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                            { text: 'Status', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                        ],

                        ...unitTests.map((unitTests, index) => [
                            { text: index + 1, fontSize: 10, alignment: 'center'},
                            { text: unitTests.testCase, fontSize: 10 },
                            { text: unitTests.explanation, fontSize: 10 },
                            { text: unitTests.importance, fontSize: 10, alignment: 'center' },
                            { text: unitTests.severity, fontSize: 10, alignment: 'center' },
                            { text: unitTests.status || 'Accept', fontSize: 10, alignment: 'center' }
                        ])
                    ]
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
        const summarySheetData = [
            ['Details'],
            [json_data.details || '']
        ];
        const explanationData = [
            ['S.No', 'Test Case', 'Explanation', 'Importance', 'Severity', 'Status'],
            ...unitTests.map((unitTests, index) => [
                index + 1,
                unitTests.testCase,
                unitTests.explanation,
                unitTests.importance,
                unitTests.severity,
                unitTests.status || 'Accept'
            ])
        ];
 
        const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetData);
        const explanationSheet = XLSX.utils.aoa_to_sheet(explanationData);
        

        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
        XLSX.utils.book_append_sheet(workbook, explanationSheet, 'Unit Test Cases');
 
        XLSX.writeFile(workbook, '${title}_${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '_').toLowerCase()}.xlsx');

                });
    </script>
  </body>
  </html>`;
}

