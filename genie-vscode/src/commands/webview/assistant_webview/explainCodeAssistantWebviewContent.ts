export function explainCodeAssistantWebViewContent(content: string, title: string): string {
    interface keyComponents {
        name: string;
        description: string;
    }
     interface logicFlow {
        step: string;
        purpose: string;
     }

     interface algorithms {
        name: string;
        description:string
     }
     
    interface explanation {
        overview: string;
        detailedExplanation: string;
        keyComponents: keyComponents[];
        logicFlow: logicFlow[];
        algorithms: algorithms[];
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
        <br/>
        <h2>Explanaton:</h2>
        <table id="issuesTable">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Overview</th>
                    <th>Detailed Explanation</th>
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
                        </tr>
                    `
                    )
                    .join('')}
            </tbody>
        </table>
        <br/>

        <h2>Key Components:</h2>
        <table id="keyComponentsTable">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                ${parsedContent.explanation
                    .flatMap((explanation) =>
                        explanation.keyComponents.map((component, compIndex) => `
                        <tr>
                            <td>${compIndex + 1}</td> 
                            <td>${component.name}</td>
                            <td>${component.description}</td>
                        </tr>
                    `)).join('')}
            </tbody>
        </table>
        <br/>
        <h2>Logic Flow:</h2>
        <table id="keyComponentsTable">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                ${parsedContent.explanation
                    .flatMap((explanation) =>
                        explanation.logicFlow.map((component, compIndex) => `
                        <tr>
                            <td>${compIndex + 1}</td> 
                            <td>${component.step}</td>
                            <td>${component.purpose}</td>
                        </tr>
                    `)).join('')}
            </tbody>
        </table>
        <br />
        <h2>Algorithms:</h2>
        <table id="keyComponentsTable">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                ${parsedContent.explanation
                    .flatMap((explanation) =>
                        explanation.algorithms.map((component, compIndex) => `
                        <tr>
                            <td>${compIndex + 1}</td> 
                            <td>${component.name}</td>
                            <td>${component.description}</td>
                        </tr>
                    `)).join('')}
            </tbody>
        </table>

    </div>
   <script>
        const json_data = ${JSON.stringify(parsedContent, null, 2)};
        const explanation = ${JSON.stringify(parsedContent.explanation)};
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
                                { text: 'Remarks', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }
                            ],
                            [
                                { text: json_data.quality || '', fontSize: 10, alignment: 'center' },
                                { text: json_data.remarks || '', fontSize: 10 }
                            ]
                        ]
                    }
                },

                { text: 'Explanation:', style: 'subheader' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['5%', '45%', '50%'],
                        body: [
                            [
                                { text: 'S.No', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                { text: 'Overview', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                { text: 'Detailed Explanation', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }
                            ],
                            ...explanation.map((item, index) => [
                                { text: index + 1, fontSize: 10, alignment: 'center' },
                                { text: item.overview, fontSize: 10 },
                                { text: item.detailedExplanation, fontSize: 10 }
                            ])
                        ]
                    }
                },

                { text: 'Key Components:', style: 'subheader' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['5%', '25%', '70%'],
                        body: [
                            [   
                                { text: 'S.No', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                { text: 'Name', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                { text: 'Description', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }
                            ],
                            ...explanation[0].keyComponents.map((component, index) => [
                                { text: index + 1, fontSize: 10, alignment: 'center' },
                                { text: component.name, fontSize: 10 },
                                { text: component.description, fontSize: 10 }
                            ])
                        ]
                    }
                },

                { text: 'Logic Flow:', style: 'subheader' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['5%', '25%', '70%'],
                        body: [
                            [   
                                { text: 'S.No', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                { text: 'Step', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                { text: 'Purpose', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }
                            ],
                            ...explanation[0].logicFlow.map((component, index) => [
                                { text: index + 1, fontSize: 10, alignment: 'center' },
                                { text: component.step, fontSize: 10 },
                                { text: component.purpose, fontSize: 10 }
                            ])
                        ]
                    }
                },

                { text: 'Algorithm:', style: 'subheader' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['5%', '25%', '70%'],
                        body: [
                            [   
                                { text: 'S.No', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                { text: 'Name', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                { text: 'Description', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }
                            ],
                            ...explanation[0].algorithms.map((component, index) => [
                                { text: index + 1, fontSize: 10, alignment: 'center' },
                                { text: component.name, fontSize: 10 },
                                { text: component.description, fontSize: 10 }
                            ])
                        ]
                    }
                }

            ],
            styles: {
                header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
                subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }
            }
        };

        pdfMake.createPdf(docDefinition).download('${title}_${new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', month: 'short', year: 'numeric' 
        }).replace(/ /g, '_').toLowerCase()}.pdf');
    });

    document.getElementById("downloadButtonExcel").addEventListener("click", () => {
      const workbook = XLSX.utils.book_new();
        const summarySheetData = [
            ['Quality', 'Remarks'],
            [json_data.quality || '', json_data.remarks || '']
        ];

        const explanationData = [
            ['S.No', 'Overview', 'DetailedExplanation'],
            ...explanation.map((explanation, index) => [
                index + 1,
                explanation.overview,
                explanation.detailedExplanation
            ])
        ];

        const keyComponentsData = [
        ['S.No', 'Name', 'Description'],
        ...explanation[0].keyComponents.map((component, index) => [
            index + 1,
            component.name,
            component.description
        ])
            ];

        const logicFlowData = [
        ['S.No', 'Step', 'Purpose'],
        ...explanation[0].logicFlow.map((component, index) => [
            index + 1,
            component.step,
            component.purpose
        ])
            ];

        const algorithmsData = [
        ['S.No', 'Name', 'Description'],
        ...explanation[0].algorithms.map((component, index) => [
            index + 1,
            component.name,
            component.description
        ])
            ];
 
        const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetData);
        const explanationSheet = XLSX.utils.aoa_to_sheet(explanationData);
        const keyComponentsSheet = XLSX.utils.aoa_to_sheet(keyComponentsData);
        const logicFlowSheet = XLSX.utils.aoa_to_sheet(logicFlowData);
        const algorithmsSheet = XLSX.utils.aoa_to_sheet(algorithmsData);

        

        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
        XLSX.utils.book_append_sheet(workbook, explanationSheet, 'Explanation');
        XLSX.utils.book_append_sheet(workbook, keyComponentsSheet, 'KeyComponents');
        XLSX.utils.book_append_sheet(workbook, logicFlowSheet, 'LogicFlow');
        XLSX.utils.book_append_sheet(workbook, algorithmsSheet, 'Algorithms');
 
        XLSX.writeFile(workbook, '${title}_${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '_').toLowerCase()}.xlsx');

                });

    </script>
  </body>
  </html>`;
}

