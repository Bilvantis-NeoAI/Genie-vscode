import * as vscode from "vscode";
import { postAllReview } from "../../utils/api/reviewAPI";
import { reviewAllWebViewContent } from "../webview/review_Webview/reviewAllWebviewContent";
import { getGitInfo } from "../gitInfo";

let panel: vscode.WebviewPanel | undefined;
let abortController = new AbortController(); 
let isExecuting = false;

export function registerAllReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewAllCode = vscode.commands.registerCommand("extension.reviewAll", async () => {
      if (isExecuting) {
        vscode.window.showWarningMessage("Overall review is already in progress.");
        return;
      }
  
      isExecuting = true;

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor found!");
        isExecuting = false;
        return;
      }
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      if (!text) {
        vscode.window.showWarningMessage("No code selected. Please select code to review.");
        return;
      }

      const language = editor.document.languageId;
      const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";

      try {
        const { project_name, branch_name } = await getGitInfo(workspacePath);

        abortController = new AbortController(); // Always create a fresh instance

        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Over All Reviewing",
          cancellable: true, // Allow user to cancel
        };

        await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
          let wasCancelled = false; // Track if the user canceled

          cancel.onCancellationRequested(() => {
            abortController.abort(); // Cancel the request
            wasCancelled = true;
          });

          try {
            const reviewComments = await postAllReview(text, language, authToken, project_name, branch_name, {
              signal: abortController.signal, // Pass abort signal
            });

            if (wasCancelled) {
              return; // Don't proceed if canceled
            }

            const formattedContent = JSON.stringify(reviewComments, null, 2);

            // Reuse or create the webview panel
            if (panel) {
              panel.reveal(vscode.ViewColumn.One);
            } else {
              panel = vscode.window.createWebviewPanel(
                "OverAllReview",
                "Over All Review",
                vscode.ViewColumn.One,
                {
                  enableScripts: true,
                  retainContextWhenHidden: true,
                }
              );

              panel.onDidDispose(() => {
                panel = undefined;
              });
            }

            panel.webview.html = reviewAllWebViewContent(formattedContent, "Over All Review");
          } catch (error: any) {
            if (error.name === "AbortError" || error.message === "canceled") {
              wasCancelled = true;
            } else {
              vscode.window.showErrorMessage(`Error Over All Review: ${error.message || "An unknown error occurred."}`);
            }
          } finally {
            if (wasCancelled) {
              vscode.window.showWarningMessage("Over All Review process was canceled.");
            }
          }
        });

      } catch (error: any) {
        vscode.window.showErrorMessage(`Error Over All Review: ${error.message || "An unknown error occurred."}`);
      } finally {
        isExecuting = false;
    }
  });

  context.subscriptions.push(reviewAllCode);
}
