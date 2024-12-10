
import * as vscode from "vscode";
import { postOverallReview } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";

export function registerOverallReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewOverall = vscode.commands.registerCommand("extension.reviewOverall", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const language = editor.document.languageId;

      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Code Overall Reviewing",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const reviewOverall = await postOverallReview(text, language, authToken);
          const formattedContent = JSON.stringify(reviewOverall, null, 2);

          const panel = vscode.window.createWebviewPanel("codeOverallReview", "Overall Review", vscode.ViewColumn.One, {});
          // panel.webview.html = reviewGetWebViewContent(reviewOverall);
          panel.webview.html = reviewGetWebViewContent(formattedContent, "Code Overall Review");
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error reviewing code.");
      }
    }
  });

  context.subscriptions.push(reviewOverall);
}

