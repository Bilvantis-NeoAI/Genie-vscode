import * as vscode from "vscode";

// Function to show the logout webview
export function showLogoutWebview(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'logoutWebview', // Identifies the type of the webview.
    'Logout', // Title of the webview.
    vscode.ViewColumn.One, // Editor column to show the webview.
    { 
      enableScripts: true, // Allows JavaScript to be used in the webview.
      retainContextWhenHidden: true // Retain context when the webview is hidden.
    }
  );

  panel.webview.html = getLogoutWebviewContent(); // Set the webview's HTML content

  // Handle messages from the webview (button click event)
  panel.webview.onDidReceiveMessage(
    message => {
      switch (message.command) {
        case 'logout':
          
          break;
      }
    },
    undefined,
    context.subscriptions
  );
}

// Function to return the HTML content for the logout webview with a logout button
function getLogoutWebviewContent(): string {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Logout</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
          }
          h1 {
            color: #ff0000;
          }
          p {
            color: #555;
          }
          button {
            background-color: #ff0000;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
          }
          button:hover {
            background-color: #cc0000;
          }
        </style>
      </head>
      <body>
        
        <p>Click the button below to log out.</p>
        <button onclick="logout()">Logout</button>

        <script>
          const vscode = acquireVsCodeApi();

          function logout() {
            // Send message to VSCode extension to handle logout
            vscode.postMessage({ command: 'logout' });
          }
        </script>
      </body>
    </html>`;
}
