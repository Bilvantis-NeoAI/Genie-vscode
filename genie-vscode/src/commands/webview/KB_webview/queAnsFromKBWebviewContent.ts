export function knowledgeBaseQAWebviewContent(question: string, title: string): string {
    interface ParsedContent {
      text: string;
      text2: string;
    }
   
    let parsedContent: ParsedContent;
   
    try {
      parsedContent = JSON.parse(question);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      return `<h1>Error parsing content</h1><p>${errorMessage}</p>`;
    }
   
    const formatAnswer = (answer: string): string => {
      const isCode = /[`]|(?:^\s{4}|\t)/.test(answer); // Detect if answer contains code
      return isCode
        ? `<pre><code style="color: black;">${answer}</code></pre>` // Format as code
        : `<p class="formatted-text">${answer}</p>`; // Apply consistent style to plain text
    };
   
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f0f0;
            color: #333;
            margin: 0;
            padding: 10px;
        }
        h1, h2 {
            color: #047ccc;
        }
        .header {
            border-bottom: 1px solid #047ccc;
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
    </style>
  </head>
  <body>
    <div class="header">
        <h1>${title}</h1>
    </div>
    <div id="content">
        <h2>Question</h2>
        <p class="formatted-text">${parsedContent.text || "No content available for Text 1"}</p>
        <h2>Answer</h2>
        ${formatAnswer(parsedContent.text2 || "No content available for Text 2")}
    </div>
  </body>
  </html>`;
  }
   
   