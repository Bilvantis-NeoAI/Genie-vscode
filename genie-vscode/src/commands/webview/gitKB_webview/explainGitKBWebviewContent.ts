export function explainGitKBWebViewContent(question: string, title: string): string {
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
      parsedContent = JSON.parse(question);
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
          .table-container {
        overflow-x: auto; /* Add horizontal scroll for small screens */
    }
      .header {
          border-bottom: 1px solid #07439C;
          margin-bottom: 10px;
          padding-bottom: 5px;
      }
      table {
          width: 100%;
          max-width: 100%
          border-collapse: collapse;
          margin: 10px 0;
          border-spacing: 0;
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
              <th>Quality</th>
              <th>Remarks</th>
          </tr>
          <tr>
              <td>${parsedContent.quality}</td>
              <td>${parsedContent.remarks}</td>
          </tr>
      </table>
      <h2>Explanation:</h2>
      <table id="issuesTable">
          <thead>
              <tr>
                  <th>S.No</th>
                  <th>Overview</th>
                  <th>Detailed Explanation</th>
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
                                    <option value="Accept" ${
                                      explanation.status === "Accept"
                                        ? "selected"
                                        : ""
                                    }>Accept</option>
                                    <option value="Reject" ${
                                      explanation.status === "Reject"
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
        const explanation = ${JSON.stringify(parsedContent.explanation)};

        function updateStatus(index, value) {
            explanation[index].status = value;
        }

        document.getElementById("downloadButton").addEventListener("click", () => {
    const docDefinition = {
        pageOrientation: 'landscape',
        content: [
            { text: '${title}', style: 'header' },
            { text: 'Summary:', style: 'subheader' },
            {
                table: {
                    widths: [100, '*'],
                    body: [
                        [
                            { text: 'Quality', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                            { text: 'Remarks', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                        ],
                        [
                            { text: json_data.quality || '', fontSize: 10, alignment: 'center' },
                            { text: json_data.remarks || '', fontSize: 10 }
                        ]
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
            { text: 'Explanation:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: [30, 160, '*', 40],
                    body: [
                        [
                            { text: 'S.No', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                            { text: 'Overview', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                            { text: 'Detailed Explanation', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                            { text: 'Status', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                        ],
                        ...explanation.map((explanation, index) => [
                            { text: index + 1, fontSize: 10, alignment: 'center'},
                            { text: explanation.overview, fontSize: 10 },
                            { text: explanation.detailedExplanation, fontSize: 10 },
                            { text: explanation.status || 'Accept', fontSize: 10, alignment: 'center' }
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
            ['Quality', 'Remarks'],
            [json_data.quality || '', json_data.remarks || '']
        ];
        const explanationData = [
            ['S.No', 'Overview', 'DetailedExplanation', 'Status'],
            ...explanation.map((explanation, index) => [
                index + 1,
                explanation.overview,
                explanation.detailedExplanation,
                explanation.status || 'Accept'
            ])
        ];
 
        const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetData);
        const explanationSheet = XLSX.utils.aoa_to_sheet(explanationData);
        

        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
        XLSX.utils.book_append_sheet(workbook, explanationSheet, 'Explanation');
 
        XLSX.writeFile(workbook, '${title}_${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '_').toLowerCase()}.xlsx');

                });


    </script>
</body>
</html>`;
}

