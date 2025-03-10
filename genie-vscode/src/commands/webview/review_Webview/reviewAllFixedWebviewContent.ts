// New helper function to generate HTML content for the review response webview
export function getReviewResponseWebViewContent(formattedResponse: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Review Response</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          pre { background-color: #f3f3f3; padding: 10px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>Review Response</h1>
        <pre>${formattedResponse}</pre>
      </body>
      </html>
    `;
  }