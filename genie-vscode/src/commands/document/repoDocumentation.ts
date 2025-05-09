import * as vscode from "vscode";
import { getRepoDocWebviewContent } from "../webview/document_webview/getRepoDocWebviewContent";
import { postRepoDocumentation, postJobStatus, downloadMarkdown } from "../../utils/api/documentAPI";

// Function to handle repository documentation commands
export function registerRepoDocumentationCommand(context: vscode.ExtensionContext, authToken: string): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.repoDocumentation", () => {
      const panel = vscode.window.createWebviewPanel(
        "repoDocumentation",
        "Repository Documentation",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );

      panel.webview.html = getRepoDocWebviewContent();

      panel.webview.onDidReceiveMessage(async (message) => {
        // Step 1: Trigger Documentation Generation
        if (message.command === 'fetchDocumentation') {
          const { repo_url, pat, branch } = message;
          try {
            const response = await postRepoDocumentation(repo_url, pat, branch, authToken);
            const jobId = response?.JobID;
            panel.webview.postMessage({
              command: 'displayJobID',
              jobId: jobId || "No Job ID received"
            });
          } catch (error: any) {
            panel.webview.postMessage({
              command: 'displayError',
              error: error.message || "Failed to fetch documentation"
            });
          }
        }

        // Step 2: Poll Job Status
        else if (message.command === 'checkJobStatus') {
          const { jobID } = message;
          try {
            const statusResponse = await postJobStatus(jobID, authToken);
            panel.webview.postMessage({
              command: 'displayJobStatus',
              status: statusResponse.status,
              statusDetails: statusResponse.Status_display
            });
          } catch (error: any) {
            panel.webview.postMessage({
              command: 'displayError',
              error: error.message || "Failed to fetch status"
            });
          }
        }

        // ✅ Step 3: Download Final Markdown
        else if (message.command === 'downloadMarkdown') {
          const { jobID } = message;
          try {
            const markdown = await downloadMarkdown(jobID, authToken);
            panel.webview.postMessage({
              command: 'displayMarkdown',
              markdown
            });
          } catch (error: any) {
            panel.webview.postMessage({
              command: 'displayError',
              error: error.message || "Failed to download markdown"
            });
          }
        }
      });
    })
  );
}
