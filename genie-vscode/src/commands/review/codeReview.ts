import * as vscode from "vscode";
import { postReviewCode } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";

export function registerCodeReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewCode = vscode.commands.registerCommand("extension.reviewCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const language = editor.document.languageId;
      

      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Code Reviewing",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const reviewComments = await postReviewCode(text, language, authToken);
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
