
import * as vscode from "vscode";
import { postOverallReview } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";
import { getGitInfo } from "../gitInfo";

let panel: vscode.WebviewPanel | undefined;

export function registerOverallReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewOverall = vscode.commands.registerCommand("extension.reviewOverall", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      if (!text) {
        vscode.window.showWarningMessage("No code selected. Please select code to review.");
        return;
      }

      const language = editor.document.languageId;

      // Get workspace folder path
        const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";     

      try {
        // Fetch Git information using the getGitInfo function
        const { project_name, branch_name } = await getGitInfo(workspacePath);
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Code Overall Reviewing",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const reviewOverall = await postOverallReview(text, language, authToken, project_name, branch_name);
          const formattedContent = JSON.stringify(reviewOverall, null, 2);
          if (panel) {
            panel.reveal(vscode.ViewColumn.One);
          } else {
            panel = vscode.window.createWebviewPanel(
              "codeOverallReview", 
              "Code Overall Review", 
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
         
          panel.webview.html = reviewGetWebViewContent(formattedContent, "Code Overall Review");
        });
      } catch (error:any) {
        const errorMessage = error.message || "An unknown error occurred.";
              vscode.window.showErrorMessage(`Error Overall Review: ${errorMessage}`);
      }
    }
  });

  context.subscriptions.push(reviewOverall);
}

