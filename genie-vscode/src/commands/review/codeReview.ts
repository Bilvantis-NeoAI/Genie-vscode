import * as vscode from "vscode";
import { postReviewCode } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";
import { getGitInfo } from "../gitInfo";

export function registerCodeReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewCode = vscode.commands.registerCommand("extension.reviewCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const language = editor.document.languageId;

      // Get workspace folder path
      const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
      // Fetch Git information using the getGitInfo function
      const { project_name, branch_name } = await getGitInfo(workspacePath);

      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Code Reviewing",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
        const reviewComments = await postReviewCode(text, language, authToken, project_name, branch_name);
          const formattedContent = JSON.stringify(reviewComments, null, 2);

          const panel = vscode.window.createWebviewPanel("codeReview", "Code Review", vscode.ViewColumn.One, {});
          // panel.webview.html = reviewGetWebViewContent(reviewComments);
          panel.webview.html = reviewGetWebViewContent(formattedContent, "Code Review");
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error reviewing code.");
      }
    }
  });

  context.subscriptions.push(reviewCode);
}
