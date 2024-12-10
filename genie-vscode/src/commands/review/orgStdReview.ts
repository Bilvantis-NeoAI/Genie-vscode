
import * as vscode from "vscode";
import { postOrgStdReview } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_webview/reviewWebviewContent"

export function registerOrgStdReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewOrgStd = vscode.commands.registerCommand("extension.reviewOrgStd", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const language = editor.document.languageId;

      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Org Std Reviewing",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const reviewOrgStds = await postOrgStdReview(text, language, authToken);
          const formattedContent = JSON.stringify(reviewOrgStds, null, 2);

          const panel = vscode.window.createWebviewPanel("orgStdReview", "Org Std Review", vscode.ViewColumn.One, {});
          // panel.webview.html = reviewGetWebViewContent(reviewPerformance);
          panel.webview.html = reviewGetWebViewContent(formattedContent, "Org Std Review");
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error reviewing code.");
      }
    }
  });

  context.subscriptions.push(reviewOrgStd);
}

