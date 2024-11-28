"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showUrlWebview = showUrlWebview;
const vscode = __importStar(require("vscode"));
const config_1 = require("./config");
function showUrlWebview(context, error_message, success_message) {
    const panel = vscode.window.createWebviewPanel('urlWebview', 'URL', vscode.ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
    });
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
        <style>
            body {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
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
            <h2 class="text-center">URL</h2>
            ${message_html}
            <form id="authForm">
                <div class="form-group">
                    <label for="url">Url:</label>
                    <input type="text" id="url" name="url" class="form-control" required>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">URL</button>
            </form>
        </div>
        <script>
            const vscode = acquireVsCodeApi();

            const authForm = document.getElementById('authForm');
            if (authForm) {
                authForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const userUrl = document.getElementById('url').value;
                    

                    fetch(\`\${userUrl}/handshake\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: userUrl }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === 'API is reachable') {
                            vscode.postMessage({ command: 'urlRegisterSuccess', message: ' URL Submitted successfully, Please login/Register.', userUrl  });
                        
                            } else {
                            vscode.postMessage({ command: 'urlRegisterError', error: data.detail || 'URL SUbmiiton failed' });
                        }
                    })
                    .catch(error => {
                        vscode.postMessage({ command: 'urlRegisterError', error: error.message });
                    });
                });
            }
        </script>
    </body>
    </html>
    `;
    panel.webview.html = webviewContent;
    panel.webview.onDidReceiveMessage((message) => {
        switch (message.command) {
            case 'urlRegisterSuccess':
                vscode.window.showInformationMessage(message.message);
                if (message.userUrl) {
                    (0, config_1.exchangeUrl)(message.userUrl);
                }
                context.globalState.update('urlSubmitted', true);
                panel.dispose();
                break;
            case 'urlRegisterError':
                vscode.window.showErrorMessage(message.error);
                break;
        }
    }, undefined, context.subscriptions);
}
//# sourceMappingURL=showUrlWebview.js.map