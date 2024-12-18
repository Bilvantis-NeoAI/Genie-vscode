import * as vscode from 'vscode';
import { exchangeUrl } from '../../../auth/config';
export function showUrlWebview(
    context: vscode.ExtensionContext,
    error_message?: string,
    success_message?: string
) {
    const panel = vscode.window.createWebviewPanel(
        'urlWebview',
        'Server Link',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
        }
    );

    const message_html = `
        ${error_message ? `<div class="alert alert-danger" role="alert">${error_message}</div>` : ''}
        ${success_message ? `<div class="alert alert-success" role="alert">${success_message}</div>` : ''}
    `;
    // let updatedUrl = ''

    const webviewContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>URL Submit</title>
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            body {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                font-family: 'Poppins', sans-serif;
                background-color: #f0f2f5;
            }
            .auth-form {
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                background-color: #ffffff;
                max-width: 400px;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <div class="auth-form">
            <h2 class="text-center">Server Link</h2>
            ${message_html}
            <form id="authForm">
                <div class="form-group">
                    <label for="url">Domain:</label>
                    <input type="text" id="url" name="url" class="form-control" value="http://34.46.36.105:3000" required>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">Submit</button>
            </form>
        </div>
        <script>
            const vscode = acquireVsCodeApi();

            const authForm = document.getElementById('authForm');
            if (authForm) {
                authForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const userUrl = document.getElementById('url').value;
                    

                    fetch(\`\${userUrl}/touch\`, {
                        method: 'GET',
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === 'API is valid and operational') {
                            vscode.postMessage({ command: 'urlRegisterSuccess', message: ' URL Submitted successfully.', userUrl  });
                        
                            } else {
                            vscode.postMessage({ command: 'urlRegisterError', error: data.detail || 'URL SUbmiiton failed' });
                        }
                    })
                    .catch(error => {
                        //vscode.postMessage({ command: 'urlRegisterError', error: error.message });
                        vscode.postMessage({ command: 'urlRegisterError', error: 'Invalid URL link or network issue. Please check and try again.' });
                    });
                });
            }
        </script>
    </body>
    </html>
    `;

    panel.webview.html = webviewContent;

    panel.webview.onDidReceiveMessage(
        (message) => {
            switch (message.command) {
                case 'urlRegisterSuccess':
                    vscode.window.showInformationMessage(message.message);
                    
                    if (message.userUrl) {
                        exchangeUrl(message.userUrl);
                        
                    }
                    context.globalState.update('urlSubmitted', true);
                    panel.dispose();
                    break;
                case 'urlRegisterError':
                    vscode.window.showErrorMessage(message.error);
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
}