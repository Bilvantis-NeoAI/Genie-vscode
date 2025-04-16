export function filewiseUnitTestCodeAssistantWebviewContent(content: string, title: string, language: string): string {
    function escapeHtml(html: string): string {
        return html.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
                   .replace(/"/g, "&quot;")
                   .replace(/'/g, "&#039;");
    }


    function renderData(data: any): string {
        if (data === null || data === undefined ||
            (Array.isArray(data) && data.length === 0) ||
            (typeof data === 'object' && Object.keys(data).length === 0)) {
            return `<p><em>Data: No data available</em></p>`;
        }

        
    
        function formatValue(val: any): string {
            if (typeof val === 'object' && val !== null) {
                if (Array.isArray(val)) {
                    return `<ul>${val.map(item => `<li>${escapeHtml(String(item))}</li>`).join('')}</ul>`;
                } else {
                    return `<table><tbody>${
                        Object.entries(val).map(([k, v]) => 
                            `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${formatValue(v)}</td></tr>`
                        ).join('')
                    }</tbody></table>`;
                }
            }
            return escapeHtml(String(val));
        }
    
        if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
            return `<div>${escapeHtml(String(data))}</div>`;
        }
    
        if (Array.isArray(data)) {
            return data.map((item, index) => {
                let label = `Data ${index + 1}`;
                if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                    // Render object with key-value pairs
                    let rows = Object.entries(item).map(([key, value]) => {
                        return `<tr><td><strong>${escapeHtml(key)}</strong></td><td>${formatValue(value)}</td></tr>`;
                    }).join('');
                    return `
                        <div>
                            <h4>${label}</h4>
                            <table>
                                <tbody>
                                    ${rows}
                                </tbody>
                            </table>
                        </div>
                    `;
                } else {
                    // Render primitive or array
                    return `<div><strong>${label}:</strong> ${escapeHtml(JSON.stringify(item))}</div>`;
                }
            }).join('');
        }
    
        if (typeof data === 'object' && data !== null) {
            let rows = Object.entries(data).map(([key, value]) => {
                return `<tr><td><strong>${escapeHtml(key)}</strong></td><td>${formatValue(value)}</td></tr>`;
            }).join('');
            return `
                <table>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            `;
        }
    
        return `<div>${escapeHtml(JSON.stringify(data))}</div>`;
    }
    
    
    let htmlOutput = "";
    let errorOccurred = false;
    let imports = "";

    try {
        const parsed = JSON.parse(content);
        

        imports = parsed.imports || ""; // Extract imports from response
        

        if (Array.isArray(imports)) {
            imports = imports.join('\n');
        }
       
        
        
        if (parsed.testcases && Array.isArray(parsed.testcases)) {
            for (const [index, test] of parsed.testcases.entries()) {
                htmlOutput += `
                    <section style="margin-bottom: 40px; padding: 20px; border: 2px solid #555; border-radius: 10px; background-color: #292929;">
                        <input 
                        type="checkbox" 
                        class="testcase-checkbox" 
                        data-index="${index}" 
                        data-description="${escapeHtml(test.description || '')}" 
                        data-testcase="${escapeHtml(test.testcase || '')}" 
                        data-data='${escapeHtml(JSON.stringify(test.data || []))}'
                        data-confidence-score="${escapeHtml(String(test.confidence_score || ''))}" 
                        data-intervention-needed="${escapeHtml(String(test.intervention_needed || ''))}" 
                        >
                        <label>Select this Test Case</label>

                        <h3>Description:</h3>
                        <p>${escapeHtml(test.description || '')}</p>

                        <h3>Data:</h3>
                        ${renderData(test.data || [])}

                        <h3>Test Case:</h3>
                        <pre id="testcase-${index}">${escapeHtml(test.testcase || '')}</pre>
                    </section>
                `;
            }
        } else {
            htmlOutput = `<p><strong>No testcases found.</strong></p><pre>${escapeHtml(content)}</pre>`;
        }
    } catch (err) {
        htmlOutput = `<p style="color:red;">Error parsing content: ${escapeHtml((err as Error).message)}</p>`;
        errorOccurred = true;
    }

    // Determine which buttons to show
    let downloadButtons = `
        <button onclick="downloadPDF()">Download PDF</button>
    `;

    if (language.toLowerCase() === 'python') {
        downloadButtons += `<button onclick="downloadPython()">Download .py</button>`;
    } else if (language.toLowerCase() === 'java') {
        downloadButtons += `<button onclick="downloadJava()">Download .java</button>`;
    }

    // Add Reject button (always shown)
    downloadButtons += `<button id="reject">Reject</button>`;
       

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title id="header">${escapeHtml(title)}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
        <style>
            body {
                margin: 0;
                padding: 20px;
                
                background-color: #1e1e1e;
                color: #f8f8f2;
            }
                #header {
            padding: 10px;
            cursor: move;
            background-color: #444;
            color: #fff;
            border-bottom: 1px solid #ccc;
            font-size: 18px;
          }

            pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                background-color: #2d2d2d;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #444;
                overflow-x: auto;
                font-family: monospace;
            }
            table, td {
                border: 1px solid #444;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1em;
            }
            td {
                padding: 6px 10px;
                vertical-align: top;
            }
            ul {
                margin: 0;
                padding-left: 20px;
            }
            li {
                margin-bottom: 4px;
            }
            button {
               background-color: #444;
                color: #fff;
                border: none;
                padding: 10px 20px;
                cursor: pointer;
                margin: 5px;
            }
        </style>
    </head>
    <body>
        <h2>${escapeHtml(title)}</h2>

        <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
        <input type="checkbox" id="select-all-checkbox" onchange="toggleSelectAll(this)">
        Select All Test Cases
        </label>

        ${htmlOutput}

        ${downloadButtons}

        <script>
           const vscode = acquireVsCodeApi(); 
           const imports = ${JSON.stringify(imports)};
           const pageTitle = ${JSON.stringify(title)};

           function getSelectedTestCases() {
                const selected = [];
                document.querySelectorAll('.testcase-checkbox:checked').forEach(cb => {
                    let dataStr = cb.getAttribute('data-data') || '[]';
                    let data;
                    try {
                        data = JSON.parse(dataStr);
                    } catch {
                        data = [];
                    }

                    selected.push({
                        description: cb.getAttribute('data-description'),
                        testcase: cb.getAttribute('data-testcase'),
                        data: data,
                        confidence_score: cb.getAttribute('data-confidence-score') || '',
                        intervention_needed: cb.getAttribute('data-intervention-needed') || ''
                    });
                });
                return selected;
            }

          function toggleSelectAll(checkbox) {
                const isChecked = checkbox.checked;
                document.querySelectorAll('.testcase-checkbox').forEach(cb => cb.checked = isChecked);
            }

            


            

            function downloadPDF() {
                const testCases = getSelectedTestCases();
                if (testCases.length === 0) {
                    vscode.postMessage({ command: 'noTestCaseSelected', message: 'Please select at least one test case.' });
                    return;
                }

            

            


                const docDefinition = {
                    pageOrientation: 'landscape',
                    content: [
                        { text: pageTitle, style: 'header' },
                        { text: 'Test Cases:', style: 'subheader' },
                        {
                            table: {
                                headerRows: 1,
                                widths: ['6%', '26%', '26%', '26%', '8%', '8%'],
                                body: [
                                    [
                                        { text: 'S.No', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                        { text: 'Description', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                        { text: 'Test Case', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                        { text: 'Data', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                        { text: 'Confidence Score', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                        { text: 'Intervention Needed', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }
                                    ],
                                    ...testCases.map((test, index) => [
                                        { text: String(index + 1), fontSize: 10, alignment: 'center' },
                                        { text: test.description, fontSize: 10 },
                                        { text: test.testcase, fontSize: 10 },
                                        { text: JSON.stringify(test.data).replace(/\\n/g, ' '), fontSize: 10 },
                                        { text: test.confidence_score, fontSize: 10, alignment: 'center' },
                                        { text: test.intervention_needed, fontSize: 10, alignment: 'center' }
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

                pdfMake.createPdf(docDefinition).download(
                    pageTitle + '_' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    .replace(/ /g, '_').toLowerCase() + '.pdf'
                );
            
            }


           function downloadPython() {
                const testCases = getSelectedTestCases();
                if (testCases.length === 0) {
                    vscode.postMessage({ command: 'noTestCaseSelected', message: 'Please select at least one test case.' });
                    return;
                }
                // Include data along with the test case code
                const content = imports + "\\n\\n" + testCases.map(tc => {
                    const dataStr = JSON.stringify(tc.data);
                    return "#Data:" + dataStr + "\\n\\n" + tc.testcase;
                }).join("\\n\\n");
                const filename = pageTitle + '_' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    .replace(/ /g, '_').toLowerCase() + '.py';
                downloadFile(content, filename);
            }

            function downloadJava() {
                const testCases = getSelectedTestCases();
                if (testCases.length === 0) {       
                    vscode.postMessage({ command: 'noTestCaseSelected', message: 'Please select at least one test case.' });
                    return;
                }
                // Include data along with the test case code
                const content = imports + "\\n\\n" + testCases.map(tc => {
                    const dataStr = JSON.stringify(tc.data);
                    return "//Data:" + dataStr + "\\n\\n" + tc.testcase;
                }).join("\\n\\n");
                const filename = pageTitle + '_' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    .replace(/ /g, '_').toLowerCase() + '.java';
                downloadFile(content, filename);
            }
            function downloadFile(content, filename) {
                const blob = new Blob([content], { type: 'text/plain' });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            }
            ${errorOccurred ? `console.error("Error parsing content:", ${JSON.stringify(content)});` : ""}
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('reject').addEventListener('click', () => {
                    vscode.postMessage({ command: 'reject' });
                });
            });
        </script>       
    </body>
    </html>
    `;
}


