import * as vscode from "vscode";
import { postAllReview } from "../../utils/api/reviewAPI";
import { reviewAllWebViewContent } from "../webview/review_Webview/reviewAllWebviewContent";
import { getGitInfo } from "../gitInfo";
 
let panel: vscode.WebviewPanel | undefined;
 
export function registerAllReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewAllCode = vscode.commands.registerCommand("extension.reviewAll", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor){
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    if (!text) {
      vscode.window.showWarningMessage("No code selected. Please select code to review.");
      return;
    }
 
    const language = editor.document.languageId;
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
 
    try {
      const { project_name, branch_name } = await getGitInfo(workspacePath);
 
      const progressOptions: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: "All Reviewing",
        cancellable: false,
      };
 
      await vscode.window.withProgress(progressOptions, async () => {
        const reviewComments = await postAllReview(text, language, authToken, project_name, branch_name);
        const formattedContent = JSON.stringify(reviewComments, null, 2);
 
        // Reuse or create the webview panel
        if (panel) {
          panel.reveal(vscode.ViewColumn.One);
        } else {
          panel = vscode.window.createWebviewPanel(
            "AllReview",
            "All Review",
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
 
        panel.webview.html = reviewAllWebViewContent(formattedContent, "All Review");
      });
 
      // vscode.window.showInformationMessage("Code review completed successfully.");
    } catch (error: any) {
      const errorMessage = error.message || "An unknown error occurred.";
      vscode.window.showErrorMessage(`Error All Review: ${errorMessage}`);
    }
  }
  });
 
  context.subscriptions.push(reviewAllCode);
}
 