
import * as vscode from "vscode";
import { postOrgStdReview } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";
import { getGitInfo } from "../gitInfo";

let panel: vscode.WebviewPanel | undefined;

export function registerOrgStdReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewOrgStd = vscode.commands.registerCommand("extension.reviewOrgStd", async () => {
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
          title: "Org Std Reviewing",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const reviewOrgStds = await postOrgStdReview(text, language, authToken, project_name, branch_name);
          const formattedContent = JSON.stringify(reviewOrgStds, null, 2);

          if (panel) {
            panel.reveal(vscode.ViewColumn.One);
          } else {
            panel = vscode.window.createWebviewPanel("orgStdReview", "Org Std Review", vscode.ViewColumn.One, {
              enableScripts: true,
              retainContextWhenHidden: true,
            }
          );
          panel.onDidDispose(() => {
            panel = undefined;
          });
          }
          panel.webview.html = reviewGetWebViewContent(formattedContent, "Org Std Review");
        });
      } catch (error:any) {
        const errorMessage = error.message || "An unknown error occurred.";
        vscode.window.showErrorMessage(`Error Org Std Review: ${errorMessage}`);
      }
    }
  });

  context.subscriptions.push(reviewOrgStd);
}

