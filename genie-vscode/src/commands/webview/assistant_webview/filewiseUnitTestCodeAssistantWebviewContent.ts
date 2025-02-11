export function filewiseUnitTestCodeAssistantWebviewContent(content: string, title: string): string {
    interface TestCase {
        description: string;
        testcase: string;
        data: string[][];
    }
  
    interface ParsedContent {
        testcases: TestCase[];
    }
  
    function escapeHtml(html: string): string {
        return html.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
                   .replace(/"/g, "&quot;")
                   .replace(/'/g, "&#039;");
    }
  
    let parsedContent: ParsedContent;
    try {
        parsedContent = JSON.parse(content);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return `<h1>Error parsing content</h1><p>${errorMessage}</p>`;
    }
  
    const testCasesHtml = parsedContent.testcases.map(testCase => {
        const dataHtml = testCase.data.length === 0
            ? `<p><strong>Data:</strong> No data available</p>`
            : testCase.data.map((dataArray, index) => {
                let formattedData = "";
                
                if (Array.isArray(dataArray)) {
                    formattedData = dataArray.map(item => 
                        typeof item === 'object' ? JSON.stringify(item) : String(item)
                    ).join(", ");
                } else if (typeof dataArray === 'object') {
                    formattedData = JSON.stringify(dataArray);
                } else {
                    formattedData = String(dataArray);
                }
    
                return `<p><strong>Data ${index + 1}:</strong> ${escapeHtml(formattedData)}</p>`;
            }).join("\n");
    
        return `
            <div class="testcase-section">
                <h3>${escapeHtml(testCase.description)}</h3>
                <pre><code>${escapeHtml(testCase.testcase)}</code></pre>
                ${dataHtml}
            </div>
        `;
    }).join("\n");

    const jsonData = JSON.stringify(parsedContent, null, 2);
    const unitTests = JSON.stringify(parsedContent.testcases);

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(title)}</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/pdfmake.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/vfs_fonts.js"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #2d2d2d;
            color: #f8f8f2;
          }
          #floating-window {
            position: absolute;
            top: 50px;
            left: 50px;
            width: 800px;
            height: auto;
            border: 1px solid #ccc;
            background-color: #1e1e1e;
            resize: both;
            overflow: auto;
            z-index: 1000;
            padding: 15px;
          }
          #header {
            padding: 10px;
            cursor: move;
            background-color: #444;
            color: #fff;
            border-bottom: 1px solid #ccc;
            font-size: 18px;
          }
          .testcase-section {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 5px;
            background-color: #292929;
          }
          pre {
            max-width: 100%;
            word-wrap: break-word;
            white-space: pre-wrap;
            background-color: #1e1e1e;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 5px;
          }
          #buttons {
            margin-top: 10px;
            text-align: center;
          }
          button {
            background-color: #444;
            color: #fff;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            margin: 5px;
          }
          button:hover {
            background-color: #555;
          }
        </style>
      </head>
      <body>
        <div id="floating-window">
          <div id="header">${escapeHtml(title)}</div>
          <div id="content">
            ${testCasesHtml}
          </div>
          <div id="buttons">
            <button id="download">Download</button>
            <button id="reject">Reject</button>
          </div>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            const parsedContent = ${jsonData};
            const unitTests = ${unitTests};

            document.getElementById("download").addEventListener("click", () => {
                const docDefinition = {
                    pageOrientation: 'landscape',
                    content: [
                        { text: '${escapeHtml(title)}', style: 'header' },
                        { text: 'Test Cases:', style: 'subheader' },
                        {
                            table: {
                                headerRows: 1,
                                widths: ['10%', '30%', '30%', '30%'],
                                body: [
                                    [
                                        { text: 'S.No', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                        { text: 'Description', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                        { text: 'Test Case', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                        { text: 'Data', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }
                                    ],
                                    ...unitTests.map((testCase, index) => [
                                        { text: String(index + 1), fontSize: 10, alignment: 'center' },
                                        { text: testCase.description, fontSize: 10 },
                                        { text: testCase.testcase, fontSize: 10 },
                                        { 
                                            text: testCase.data.map((dataArray, i) => {
                                                let formattedData = '';
                                                if (Array.isArray(dataArray)) {
                                                    formattedData = dataArray.map(item => 
                                                        typeof item === 'object' ? JSON.stringify(item) : String(item)
                                                    ).join(", ");
                                                } else if (typeof dataArray === 'object') {
                                                    formattedData = JSON.stringify(dataArray);
                                                } else {
                                                    formattedData = String(dataArray);
                                                }
                                                return "Data " + (i + 1) + ": " + formattedData;
                                            }).join("\\n"),
                                            fontSize: 10
                                        }
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

                pdfMake.createPdf(docDefinition).download('${escapeHtml(title)}_' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '_').toLowerCase() + '.pdf'); 
            });

            document.getElementById('reject').addEventListener('click', () => {
                vscode.postMessage({ command: 'reject' });
            });
        </script>
      </body>
      </html>
    `;
}
