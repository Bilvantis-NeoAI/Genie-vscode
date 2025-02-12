import * as vscode from 'vscode';
import { activateCodeCommands } from '../../../extension';
import { BASE_API } from '../../../auth/config';

import { GenieCommandsProvider } from '../../sidebarCommandRegister/GenieCommandsProvider';
let activeWebview: vscode.WebviewPanel | null = null; // Keep track of the active webview
 
 
export function showLoginRegisterWebview(
    context: vscode.ExtensionContext,
    mode: 'login' | 'register',
    error_message?: string,
    success_message?: string
) {
    if (activeWebview) {
        activeWebview.dispose(); // Dispose of any existing webview
    }
   
    const panel = vscode.window.createWebviewPanel(
        'loginRegisterWebview',
        mode === 'login' ? 'Login' : 'Register',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
        }
    );
 
    const formAction = mode === 'login' ? `${BASE_API}/auth/login` : `${BASE_API}/auth/register`;
 
    const message_html = `
        ${error_message ? `<div class="alert alert-danger" role="alert">${error_message}</div>` : ''}
        ${success_message ? `<div class="alert alert-success" role="alert">${success_message}</div>` : ''}
    `;
 
    const webviewContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${mode === 'login' ? 'Login' : 'Register'}</title>
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
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
                max-width: 500px;
                width: 100%;
            }
            .auth-link {
                text-align: center;
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="auth-form">
            <h2 class="text-center">${mode === 'login' ? 'Login' : 'Register'}</h2>
            ${message_html}
            <form id="authForm">
                <!-- For Login -->
                ${mode === 'login' ? `
                <div class="form-group">
                    <!-- Email Field -->
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" class="form-control" required>
                </div>
                <div class="form-group">
                <!-- Password Field -->
                <label for="password">Password:</label>
                <div class="input-group">
                    <input type="password" id="password" name="password" class="form-control" required>
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary toggle-password" type="button" tabindex="-1">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- For Register -->
            ${mode === 'register' ? `
            <div class="row">
                <div class="col-md-6">
                    <!-- Email Field -->
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" class="form-control" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <!-- Username Field -->
                    <div class="form-group">
                        <label for="username">User Name:</label>
                        <input type="text" id="username" name="username" class="form-control" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <!-- Full Name Field -->
                    <div class="form-group">
                        <label for="full_name">Full Name:</label>
                        <input type="text" id="full_name" name="full_name" class="form-control" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <!-- Company Name Field -->
                    <div class="form-group">
                        <label for="company_name">Company Name:</label>
                        <input type="text" id="company_name" name="company_name" class="form-control" required>
                    </div>
                </div>
            </div>
            <div class="row">
    <div class="col-md-6">
        <!-- Password Field -->
        <div class="form-group">
            <label for="password">Password:</label>
            <div class="input-group">
                <input type="password" id="password" name="password" class="form-control" required>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary toggle-password" type="button" tabindex="-1">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <!-- Confirm Password Field -->
        <div class="form-group">
            <label for="confirm_password">Confirm Password:</label>
            <div class="input-group">
                <input type="password" id="confirm_password" name="confirm_password" class="form-control" required>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary toggle-password" type="button" tabindex="-1">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
` : ''}

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary btn-block">${mode === 'login' ? 'Login' : 'Register'}</button>
            </form>

            <div class="auth-link">
                <p>
                    ${mode === 'login'
                        ? `Don't have an account? <a href="#" onclick="toggleMode('register')">Register</a>`
                        : `Already have an account? <a href="#" onclick="toggleMode('login')">Login</a>`
                    }
                </p>
            </div>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
 
            function toggleMode(mode) {
                vscode.postMessage({ command: 'toggle', mode: mode });
            }
            
            document.querySelectorAll('.toggle-password').forEach((button) => {
    button.addEventListener('click', () => {
        const passwordInput = button.closest('.input-group').querySelector('input');
        const icon = button.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

            const authForm = document.getElementById('authForm');
            if (authForm) {
                authForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    if ('${mode}' === 'register') {
                        const payload = {
                            email:document.getElementById('email').value,
                            full_name: document.getElementById('full_name').value,
                            password: document.getElementById('password').value,
                            confirm_password: document.getElementById('confirm_password').value,
                            username: document.getElementById('username').value,
                            company_name: document.getElementById('company_name').value,

                            
                        };
 
                        fetch('${formAction}', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            body: JSON.stringify(payload),
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message === 'User registered successfully') {
                                vscode.postMessage({ command: 'loginRegisterSuccess', message: 'Registration successful! Please login.' });
                            } else {
                                vscode.postMessage({ command: 'loginRegisterError', error: data.detail || 'Registration failed' });
                            }
                        })
                        .catch(error => {
                            vscode.postMessage({ command: 'loginRegisterError', error: error.message });
                        });
                    } else {
                        const formData = new FormData(event.target);
                        fetch('${formAction}', {
                            method: 'POST',
                            body: formData,
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data && data.access_token) {
                                vscode.postMessage({ command: 'loginRegisterSuccess', token: data.access_token });
                            } else {
                                const errorDetail = data?.detail || 'Login failed! Incorrect login details';
                                vscode.postMessage({ command: 'loginRegisterError', error: errorDetail });
                            }
                        })
                        .catch(error => {
                            vscode.postMessage({ command: 'loginRegisterError', error: error.message });
                        });
 
                    }
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
                case 'toggle':
                    panel.dispose();
                    showLoginRegisterWebview(context, message.mode);
                    break;
                case 'loginRegisterSuccess':
                    if (message.token) {
                        context.globalState.update('authToken', message.token).then(() => {
                            vscode.window.showInformationMessage('Login Successful!');
                            const genieProvider = new GenieCommandsProvider();
                            vscode.window.registerTreeDataProvider("genieCommands", genieProvider);
                            vscode.commands.executeCommand('workbench.action.closeAllEditors'); //closeActiveEditor
                            panel.dispose();
                        });
                        activateCodeCommands(context);
                    } else {
                        vscode.window.showInformationMessage(message.message); // Show success message after registration
                        // After registration, switch to login page
                        showLoginRegisterWebview(context, 'login');
                    }
                    break;
                case 'loginRegisterError':
                    vscode.window.showErrorMessage(message.error);
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
}
 
 
 
 