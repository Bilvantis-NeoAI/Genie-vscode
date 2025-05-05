import * as vscode from "vscode";
import { getRepoDocWebviewContent } from "../webview/document_webview/getRepoDocWebviewContent";
import { postRepoDocumentation } from "../../utils/api/documentAPI";

let abortController = new AbortController();
let isExecuting = false;

export function registerRepoDocumentationCommand(context: vscode.ExtensionContext, authToken: string) {
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

      panel.webview.onDidReceiveMessage(async message => {
        if (message.command === 'fetchDocumentation') {
          if (isExecuting) {
            vscode.window.showWarningMessage("Documentation fetch is already in progress.");
            return;
          }

          const { repo_url, project_name, pat, branch } = message;

          if (!repo_url || !branch) {
            panel.webview.postMessage({
              command: 'displayError',
              error: "Repository URL and Branch are required."
            });
            return;
          }

          isExecuting = true;
          abortController = new AbortController();

          const progressOptions: vscode.ProgressOptions = {
            location: vscode.ProgressLocation.Notification,
            title: "Fetching Repository Documentation",
            cancellable: true,
          };

          await vscode.window.withProgress(progressOptions, async (progress, cancelToken) => {
            let wasCancelled = false;

            cancelToken.onCancellationRequested(() => {
              abortController.abort();
              wasCancelled = true;
            });

            try {
              const markdownContent = await postRepoDocumentation(
                repo_url,
                pat,
                branch,
                authToken,
                project_name,
                { signal: abortController.signal }
              );

              if (!wasCancelled) {
                panel.webview.postMessage({
                  command: 'displayMarkdown',
                  markdown: markdownContent
                });
              }
            } catch (err: any) {
              const isAbort = err.name === "AbortError" || err.message === "canceled";

              panel.webview.postMessage({
                command: 'displayError',
                error: isAbort
                  ? "Documentation request was cancelled."
                  : `${err?.response?.data?.detail || err.message || "An unknown error occurred."}`
              });
            } finally {
              isExecuting = false;
            }
          });
        }
      });

      panel.onDidDispose(() => {
        if (isExecuting) {
          abortController.abort();
          isExecuting = false;
        }
      });
    })
  );
}
