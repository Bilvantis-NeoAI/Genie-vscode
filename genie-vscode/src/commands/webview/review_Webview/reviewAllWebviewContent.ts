import { fieldIgnore } from "../../../auth/config";

export function reviewAllWebViewContent(content: string, title: string): string {
    interface issues {
        identification: string;
        explanation: string;
        fix: string;
        severity: string;
        status?: string;
        violationType?: string;
        policyReference?: string;
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
        .violation-type {
            width: 80px;
            word-wrap: break-word;
        }
        .policy-reference {
            width: 100px;
            word-wrap: break-word;
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
            <h1>Summary:</h1>
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
        <h1>Issues:</h1>
        ${Object.entries(parsedContent.issues)
    .map(([category, issues]) => {        
        if (!Array.isArray(issues) || issues.length === 0) return '';

        // Collect all unique extra keys for this category (excluding standard ones)
        const standardKeys = ['identification', 'explanation', 'fix', 'severity', 'status'];
        const extraKeys = Array.from(
            new Set(
                issues.flatMap(issue =>
                    Object.keys(issue).filter(
                        key => !standardKeys.includes(key)
                    )
                )
            )
        );

        return `
        <h2>${category.charAt(0).toUpperCase() + category.slice(1)}:</h2>
        <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th class="s_no">S.No</th>
                    <th class="identification">Identification</th>
                    <th class="explanation">Explanation</th>
                    <th>Fix</th>
                    ${extraKeys.filter(key => !fieldIgnore.includes(key)).map(key => `<th class="${key.replace(/_/g, '-')}">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>`).join('')}
                    <th class="severity">Severity</th>
                    <th class="status">Status</th>
                </tr>
            </thead>
            <tbody>
                ${issues.map((issue, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${issue.identification || '-'}</td>
                        <td>${issue.explanation || '-'}</td>
                        <td class="fix"><pre>${issue.fix || '-'}</pre></td>
                        ${extraKeys.filter(key => !fieldIgnore.includes(key)).map(key => `<td class="${key.replace(/_/g, '-')}">${issue[key] || '-'}</td>`).join('')}
                        <td class="severity severity-${(issue.severity || '').toLowerCase()}">${issue.severity || 'N/A'}</td>
                        <td>
                            <select class="status-dropdown" onchange="updateStatus('${category}', ${index}, this.value)">
                                <option value="Accept" ${issue.status === "Accept" ? "selected" : ""}>Accept</option>
                                <option value="Reject" ${issue.status === "Reject" ? "selected" : ""}>Reject</option>
                            </select>
                        </td>
                    </tr>`).join('')}
            </tbody>
        </table>
        </div>`;
    }).join("")}

    </div>

    <script>
        const json_data = ${JSON.stringify(parsedContent, null, 2)};
        let issues = ${JSON.stringify(parsedContent.issues)};

        function updateStatus(category, index, value) {
            issues[category][index].status = value;
        }

        document.getElementById("downloadButton").addEventListener("click", () => {
            const updatedJsonData = {...json_data, issues};
            const docDefinition = {
                pageOrientation: 'landscape',
                content: [
                    { text: '${title}', style: 'header' },
                    { text: 'Summary:', style: 'subheader' },
                    {
                        table: {
                            widths: [50, '*', 100],
                            body: [
                                [
                                    { text: 'Quality', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                    { text: 'Remark', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                    { text: 'Overall Severity', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }
                                ],
                                [{ text: updatedJsonData.quality, fontSize: 10, alignment: 'center' }, { text: updatedJsonData.remarks, fontSize: 10 }, { text: updatedJsonData.overallSeverity, fontSize: 10, alignment: 'center' }]
                            ]
                        }
                    },
                    { text: 'Issues:', style: 'subheader', fontSize: 18 },
                    ...Object.entries(updatedJsonData.issues).flatMap(([category, issues]) =>
                        issues.length > 0
                            ? [
                                { text: category.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()) + ':', style: 'subheader' },
                                {
                                    table: {
                                        headerRows: 1,
                                        widths: category.toLowerCase().includes("cloud")
                                            ? ['5%', '17%', '16%', '21%', '8%', '13%', '10%', '10%'] // 8 columns
                                            : category.toLowerCase().includes("bigquery")
                                                ? ['5%', '15%', '15%', '15%', '8%', '8%', '8%', '8%','8%', '10%'] // 9 columns
                                                : ['5%', '25%', '25%', '25%', '10%', '10%'],
                                        body: [
                                            [
                                                { text: 'S.No', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                                { text: 'Identification', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                                { text: 'Explanation', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                                { text: 'Fix', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                                ...(category.toLowerCase().includes("cloud")
                                                    ? [
                                                            { text: 'Violation Type', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                                            { text: 'Policy Reference', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                                        ]
                                                    :  category.toLowerCase().includes("bigquery")
                                                        ? [
                                                            { text: 'Violation Type', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                                            { text: 'Rule Reference', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                                            { text: 'Cost Impact', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                                            { text: 'Optimization Priority', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                                        ]
                                                        : []),
                                                { text: 'Severity', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' },
                                                { text: 'Status', bold: true, fillColor: '#E9E5E5', fontSize: 10, alignment: 'center' }
                                            ],
                                            ...issues.map((issue, index) => [
                                                { text: index + 1, fontSize: 10, alignment: 'center' },
                                                { text: issue.identification, fontSize: 10 },
                                                { text: issue.explanation, fontSize: 10 },
                                                { text: issue.fix, fontSize: 10 },
                                                ...(category.toLowerCase().includes("cloud")
                                                    ? [
                                                            { text: issue.violationType || '-', fontSize: 10 },
                                                            { text: issue.policyReference || '-', fontSize: 10 },
                                                        ]
                                                     : category.toLowerCase().includes("bigquery")
                                                        ? [
                                                            { text: issue.violationType || '-', fontSize: 10 },
                                                            { text: issue.policyReference || issue.ruleReference || '-', fontSize: 10 },
                                                            { text: issue.costImpact || '-', fontSize: 10, alignment: 'center' },
                                                            { text: issue.optimizationPriority || '-', fontSize: 10, alignment: 'center' },
                                                        ]
                                                        : []),
                                                { text: issue.severity, fontSize: 10, alignment: 'center' },
                                                { text: issue.status || 'Accept', fontSize: 10, alignment: 'center' }
                                            ])
                                        ]
                                    }
                                }
                            ]
                            : []
                    )

                ],
                styles: {
                    header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
                    subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }
                }
            };
             pdfMake.createPdf(docDefinition).download('${title}_${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '_').toLowerCase()}.pdf');
        });
        
       document.getElementById("downloadButtonExcel").addEventListener("click", () => {
        const updatedJsonData = {...json_data, issues};
        const flattenedIssues = [];
        Object.entries(updatedJsonData.issues).forEach(([category, categoryIssues]) => {
            if (Array.isArray(categoryIssues)) {
                categoryIssues.forEach((issue, index) => {
                    const baseRow = {
                        'S.No': index + 1,
                        'Category': category,
                        'Identification': issue.identification || '-',
                        'Explanation': issue.explanation || '-',
                        'Fix': issue.fix || '-'
                    };
                    if (category.toLowerCase().includes("bigquery")) {
                        baseRow['Violation Type'] = issue.violationType || '-';
                        baseRow['Rule Reference'] = issue.policyReference || issue.ruleReference || '-';
                        baseRow['Cost Impact'] = issue.costImpact || '-';
                        baseRow['Optimization Priority'] = issue.optimizationPriority || '-';
                    } else if (category.toLowerCase().includes("cloud")) {
                        baseRow['Violation Type'] = issue.violationType || '-';
                        baseRow['Policy Reference'] = issue.policyReference || '-';
                    }
                    baseRow['Severity'] = issue.severity || '-';
                    baseRow['Status'] = issue.status || 'Accept';
                    flattenedIssues.push(baseRow);
                });
            }
        });
        const issuesSheet = XLSX.utils.json_to_sheet(flattenedIssues);
        const summarySheet = XLSX.utils.aoa_to_sheet([
            ['Quality', 'Remarks', 'Overall Severity'],
            [updatedJsonData.quality, updatedJsonData.remarks, updatedJsonData.overallSeverity]
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, issuesSheet, 'Issues');
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
        XLSX.writeFile(workbook, '${title}_${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '_').toLowerCase()}.xlsx');
    });

    </script>
</body>
</html>`;
}