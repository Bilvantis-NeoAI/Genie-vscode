
import * as vscode from "vscode";
import { postSyntaxReview } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";
import { getGitInfo } from "../gitInfo";

export function registerSyntaxReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewSyntax = vscode.commands.registerCommand("extension.reviewSyntax", async () => {
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
          title: "Syntax Reviewing",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const reviewSyntax = await postSyntaxReview(text, language, authToken, project_name, branch_name);
          const formattedContent = JSON.stringify(reviewSyntax, null, 2);

          const panel = vscode.window.createWebviewPanel("syntaxReview", "Syntax Review", vscode.ViewColumn.One, {});
          // panel.webview.html = reviewGetWebViewContent(reviewSyntax);
          panel.webview.html = reviewGetWebViewContent(formattedContent, "Syntax Review");
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error reviewing code.");
      }
    }
  });

  context.subscriptions.push(reviewSyntax);
}

