import * as vscode from "vscode";
import { postReviewCode } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";
import { getGitInfo } from "../gitInfo";

let panel: vscode.WebviewPanel | undefined;
let abortController = new AbortController();

export function registerCodeReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewCode = vscode.commands.registerCommand("extension.reviewCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor){
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
      abortController = new AbortController();

      const progressOptions: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: "Performing Code Review",
        cancellable: true,
      };

      await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
        let wasCancelled = false;
        cancel.onCancellationRequested(() => {
          abortController.abort(); // Cancel the request
          wasCancelled = true;
        });

        try {
          const reviewComments = await postReviewCode(text, language, authToken, project_name, branch_name, {signal: abortController.signal});
          if (wasCancelled) {
            return;
          }
        const formattedContent = JSON.stringify(reviewComments, null, 2);

        // Reuse or create the webview panel
        if (panel) {
          panel.reveal(vscode.ViewColumn.One);
        } else {
          panel = vscode.window.createWebviewPanel(
            "codeReview",
            "Code Review",
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

        panel.webview.html = reviewGetWebViewContent(formattedContent, "Code Review");


        }
        catch (error: any) {
          if (error.name === "AbortError" || error.message === "canceled") {
            wasCancelled = true;
          } else {
            vscode.window.showErrorMessage(`Error Code Review: ${error.message || "An unknown error occurred."}`);
          }
        } finally {
          if (wasCancelled) {
            vscode.window.showWarningMessage("Code Review process was canceled.");
          }
        }

        
      });

      // vscode.window.showInformationMessage("Code review completed successfully.");
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error Code Review: ${error.message || "An unknown error occurred."}`);
    }
  }
  });

  context.subscriptions.push(reviewCode);
}