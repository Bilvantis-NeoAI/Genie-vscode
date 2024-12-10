
import * as vscode from "vscode";
import { postPerformanceReview } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";

export function registerPerformanceReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewPerformance = vscode.commands.registerCommand("extension.reviewPerformance", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const language = editor.document.languageId;

      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Performance Reviewing",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const reviewPerformance = await postPerformanceReview(text, language, authToken);
          const formattedContent = JSON.stringify(reviewPerformance, null, 2);

          const panel = vscode.window.createWebviewPanel("performanceReview", "Performance Review", vscode.ViewColumn.One, {});
          // panel.webview.html = reviewGetWebViewContent(reviewPerformance);
          panel.webview.html = reviewGetWebViewContent(formattedContent, "Performance Review");
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error reviewing code.");
      }
    }
  });

  context.subscriptions.push(reviewPerformance);
}

