export function knowledgeBaseQAWebviewContent(
  question: string,
  title: string
): string {
  interface ParsedContent {
    session_id: string;
    response: string;
    query: string;
  }

  let parsedContent: ParsedContent;

  try {
    parsedContent = JSON.parse(question);
    console.log("*** enter to webview", parsedContent);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return `<h1>Error parsing content</h1><p>${errorMessage}</p>`;
  }

  const formatAnswer = (answer: string): string => {
    const isCode = /[`]|(?:^\s{4}|\t)/.test(answer); // Detect code
    return isCode
      ? `<pre><code style="color: black;">${answer}</code></pre>`
      : `<p class="formatted-text">${answer}</p>`;
  };

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.4/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.4/vfs_fonts.js"></script>
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        background-color: #f2f0f0;
        color: #333;
        margin: 0;
        padding: 10px;
      }
      h1, h2 {
        color: #07439C;
      }
      .header {
        border-bottom: 1px solid #07439C;
        margin-bottom: 10px;
        padding-bottom: 5px;
      }
      pre, code {
        background-color: #f9f9f9;
        border-radius: 5px;
        padding: 10px;
        overflow-x: auto;
      }
      pre {
        white-space: pre-wrap;
      }
      p {
        white-space: pre-wrap;
      }
      .formatted-text {
        background-color: #f9f9f9;
        padding: 10px;
        border-radius: 5px;
      }
      .button-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
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
      <div class="button-container">
        <button id="downloadButton" class="download-btn">Download as PDF</button>
      </div>
      <h2>Question:</h2>
        <p class="formatted-text">${parsedContent.query  || "No content available"}</p>
      <h2>Answer:</h2>
      ${formatAnswer(parsedContent.response || "No response available.")}
    </div>

    <script>
      const json_data = ${JSON.stringify(parsedContent, null, 2)};
      document.getElementById("downloadButton").addEventListener("click", () => {
        const docDefinition = {
          pageOrientation: 'landscape',
          content: [
            { text: '${title}', style: 'header' },
            { text: 'Question:', style: 'subheader' },
            { text: json_data.query || 'No question provided.', style: 'content' },
            { text: 'Answer:', style: 'subheader' },
            { text: json_data.response || 'No response provided.', style: 'content' }
          ],
          styles: {
            header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
            subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
            content: { fontSize: 12, margin: [0, 0, 0, 10] }
          }
        };

        pdfMake.createPdf(docDefinition).download('${title}_${new Date()
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "_")
          .toLowerCase()}.pdf');
      });
      </script>
      </body>
      </html>`;
      }
