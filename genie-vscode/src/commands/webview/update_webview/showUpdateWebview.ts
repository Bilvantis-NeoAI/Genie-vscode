import * as vscode from "vscode";

export async function showUpdateWebview(
    context: vscode.ExtensionContext,
    localVersion: string,
    latestVersion: string
): Promise<boolean> {
    return new Promise((resolve) => {
        const panel = vscode.window.createWebviewPanel(
            "versionUpdateView",
            "CodeGenie Update Available",
            vscode.ViewColumn.One,
            {
                enableScripts: true,
            }
        );

        panel.webview.html = getHtml(localVersion, latestVersion);

        panel.webview.onDidReceiveMessage(
            (message) => {
                if (message.command === "accept") {
                    vscode.window.showInformationMessage("Opening releases page to download the latest VSIX...");
                    resolve(true);
                    panel.dispose();
                } else if (message.command === "reject") {
                    vscode.window.showWarningMessage("Continuing with current version.");
                    resolve(false);
                    panel.dispose();
                }
            },
            undefined,
            context.subscriptions
        );
    });
}

function getHtml(localVersion: string, latestVersion: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>CodeGenie Update</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
    :root {
        --cg-primary: #07439C;
        --cg-primary-hover: #035f99;
        --cg-bg: #f2f2f0;
        --cg-panel-bg: #ffffff;
        --cg-accent: #e9e5e5;
    }

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 18px;
        font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: var(--cg-bg);
        color: #333;
    }

    h2 {
        margin: 0 0 12px;
        font-weight: 600;
        color: var(--cg-primary);
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 20px;
    }

    .container {
        background: var(--cg-panel-bg);
        padding: 20px 22px;
        border-radius: 10px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        border: 1px solid #d9d9d9;
    }

    .versions {
        background: var(--cg-accent);
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 13px;
    }

    .versions p {
        margin: 4px 0;
    }

    .versions strong {
        color: var(--cg-primary);
    }

    .message {
        line-height: 1.5;
        font-size: 13px;
        margin: 14px 0 18px;
    }

    a {
        color: var(--cg-primary);
        text-decoration: none;
        font-weight: 500;
    }

    a:hover {
        text-decoration: underline;
    }

    .actions {
        display: flex;
        gap: 12px;
        margin-top: 10px;
    }

    button {
        appearance: none;
        border: none;
        padding: 10px 18px;
        font-size: 13px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        letter-spacing: .3px;
        transition: background .15s ease, transform .15s ease;
    }

    #accept {
        background: var(--cg-primary);
        color: #fff;
    }

    #accept:hover {
        background: var(--cg-primary-hover);
    }

    #reject {
        background: #ffffff;
        color: var(--cg-primary);
        border: 1px solid var(--cg-primary);
    }

    #reject:hover {
        background: #f6faff;
    }

    footer {
        margin-top: 26px;
        font-size: 11px;
        color: #666;
        border-top: 1px solid #ddd;
        padding-top: 10px;
        line-height: 1.4;
    }

    .badge {
        background: #ffc10733;
        color: #b86d00;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 6px;
        font-weight: 600;
        vertical-align: middle;
    }

    @media (max-width: 520px) {
        .actions { flex-direction: column; }
        button { width: 100%; }
    }
</style>
</head>

<body>
<div class="container">
    <h2>CodeGenie Update <span class="badge">Available</span></h2>

    <div class="versions">
        <p><strong>Installed version:</strong> ${localVersion}</p>
        <p><strong>Latest version:</strong> ${latestVersion}</p>
    </div>

    <div class="message">
        A newer version of the CodeGenie extension is available.<br />
        Download the updated VSIX from the releases page and install it manually.
    </div>

    
    <p><a href="https://github.com/Jagannath173/vsix_version/releases" target="_blank"><b>Open Releases Page</b></a></p>

    <div class="actions">
        <button id="accept">Download Update</button>
        <button id="reject">Keep Current Version</button>
    </div>

    <footer>
        You must uninstall the current version and then install the latest VSIX to enable the extended features.
    </footer>
</div>

<script>
    const vscode = acquireVsCodeApi();

    document.getElementById('accept').addEventListener('click', () => {
        vscode.postMessage({ command: "accept" });
    });

    document.getElementById('reject').addEventListener('click', () => {
        vscode.postMessage({ command: "reject" });
    });
</script>
</body>
</html>`;
}
