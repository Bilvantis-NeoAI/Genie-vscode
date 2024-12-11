
import * as vscode from "vscode";
import { postSecurityReview } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";

export function registerSecurityReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewSecurity = vscode.commands.registerCommand("extension.reviewSecurity", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const language = editor.document.languageId;

      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Security Reviewing",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const reviewSecurity = await postSecurityReview(text, language, authToken);
          const formattedContent = JSON.stringify(reviewSecurity, null, 2);
          const panel = vscode.window.createWebviewPanel("securityReview", "Security Review", vscode.ViewColumn.One, {});
          // panel.webview.html = reviewGetWebViewContent(reviewSecurity);
          panel.webview.html = reviewGetWebViewContent(formattedContent, "Security Review");
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error reviewing code.");
      }
    }
  });

  context.subscriptions.push(reviewSecurity);
}

