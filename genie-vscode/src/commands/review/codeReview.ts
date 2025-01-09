import * as vscode from "vscode";
import { postReviewCode } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";
import { getGitInfo } from "../gitInfo";

let panel: vscode.WebviewPanel | undefined;

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

      const progressOptions: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: "Code Reviewing",
        cancellable: false,
      };

      await vscode.window.withProgress(progressOptions, async () => {
        const reviewComments = await postReviewCode(text, language, authToken, project_name, branch_name);
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
      });

      // vscode.window.showInformationMessage("Code review completed successfully.");
    } catch (error: any) {
      const errorMessage = error.message || "An unknown error occurred.";
      vscode.window.showErrorMessage(`Error reviewing code: ${errorMessage}`);
    }
  }
  });

  context.subscriptions.push(reviewCode);
}