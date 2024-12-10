
import * as vscode from "vscode";
import { postCyclometricCXReview } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_webview/reviewWebviewContent"

export function registerCyclometricCXReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewCyclometricCX = vscode.commands.registerCommand("extension.reviewCyclometricCX", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const language = editor.document.languageId;

      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "CyclometricCX Reviewing",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const reviewCyclometricCX = await postCyclometricCXReview(text, language, authToken);
          const formattedContent = JSON.stringify(reviewCyclometricCX, null, 2);

          const panel = vscode.window.createWebviewPanel("cyclometricCXReview", "Cyclometric-CX Review", vscode.ViewColumn.One, {});
          // panel.webview.html = reviewGetWebViewContent(reviewPerformance);
          panel.webview.html = reviewGetWebViewContent(formattedContent, "Cyclometric-CX Review");
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error reviewing code.");
      }
    }
  });

  context.subscriptions.push(reviewCyclometricCX);
}

