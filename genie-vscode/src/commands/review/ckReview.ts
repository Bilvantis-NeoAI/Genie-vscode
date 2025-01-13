import * as vscode from "vscode";
import { postCkReview } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";
import { getGitInfo } from "../gitInfo";
 
let panel: vscode.WebviewPanel | undefined;
 
export function registerCkReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewCode = vscode.commands.registerCommand("extension.reviewCK", async () => {
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
        title: "CK Reviewing",
        cancellable: false,
      };
 
      await vscode.window.withProgress(progressOptions, async () => {
        const reviewComments = await postCkReview(text, language, authToken, project_name, branch_name);
        const formattedContent = JSON.stringify(reviewComments, null, 2);
 
        // Reuse or create the webview panel
        if (panel) {
          panel.reveal(vscode.ViewColumn.One);
        } else {
          panel = vscode.window.createWebviewPanel(
            "CkReview",
            "CK Review",
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
 
        panel.webview.html = reviewGetWebViewContent(formattedContent, "CK Review");
      });
 
      // vscode.window.showInformationMessage("Code review completed successfully.");
    } catch (error: any) {
      const errorMessage = error.message || "An unknown error occurred.";
      vscode.window.showErrorMessage(`Error CK Review: ${errorMessage}`);
    }
  }
  });
 
  context.subscriptions.push(reviewCode);
}
 