import * as vscode from "vscode";
import { exec } from 'child_process';
import * as path from 'path';
import { architectureReviewWebviewContent } from "../webview/review_Webview/architectureReviewWebviewContent"

export function registerArchitectureReviewCommand(context: vscode.ExtensionContext) {
  const runArchitectureReview = vscode.commands.registerCommand('extension.architectureReview', () => {
    const panel = vscode.window.createWebviewPanel(
      'ArchitectureReview',
      'Architecture Review',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = architectureReviewWebviewContent();

    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === 'fetchDocumentation') {
          const { repoUrl, pat, branch } = message.payload;
    
          console.log("Received inputs:", repoUrl, pat, branch);
    
          const jarPath = path.join(context.extensionPath, 'resources', 'HelloWorld.jar');
          exec(`java -jar "${jarPath}"`, (error, stdout, stderr) => {
            let outputText = '';
    
            if (error) {
              outputText = `Error: ${error.message}`;
            } else if (stderr) {
              outputText = `stderr: ${stderr}`;
            } else {
              outputText = stdout;
            }
    
            console.log("JAR Output:", outputText);
    
            panel.webview.postMessage({
              command: 'displayMarkdown',
              markdown: outputText
            });
          });
        }
      },
      undefined,
      context.subscriptions
    );
    
    
  });

  context.subscriptions.push(runArchitectureReview);
}