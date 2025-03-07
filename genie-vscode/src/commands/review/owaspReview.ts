 
import * as vscode from "vscode";
import { postOwaspReview } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";
import { getGitInfo } from "../gitInfo";

let panel: vscode.WebviewPanel | undefined;
let abortController = new AbortController();
let isExecuting = false;

export function registerOwaspReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewOwasp = vscode.commands.registerCommand("extension.reviewOwasp", async () => {
      if (isExecuting) {
              vscode.window.showWarningMessage("OWASP review is already in progress.");
              return;
            }
      isExecuting = true;
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor found!");
        isExecuting = false; // Reset before returning
        return;
      }
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      if (!text) {
        vscode.window.showWarningMessage("No code selected. Please select code to review.");
        isExecuting = false;
        return;
      }
      const language = editor.document.languageId;

      // Get workspace folder path
      const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
      // Fetch Git information using the getGitInfo function
      const { project_name, branch_name } = await getGitInfo(workspacePath);


      try {
        abortController = new AbortController();

        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Performing Owasp Review",
          cancellable: true,
        };

        await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
          let wasCancelled = false;

          cancel.onCancellationRequested(() => {
            abortController.abort(); // Cancel the request
            wasCancelled = true;
          });

          try {
          const reviewOwasp = await postOwaspReview(text, language, authToken, project_name, branch_name, {signal: abortController.signal});
          if (wasCancelled) {
            return;
          }
          const formattedContent = JSON.stringify(reviewOwasp, null, 2);

          if (panel) {
            panel.reveal(vscode.ViewColumn.One);
          } else {
            panel = vscode.window.createWebviewPanel(
              "owaspReview", 
              "Owasp Review", 
              vscode.ViewColumn.One, 
              {
                enableScripts: true,
                retainContextWhenHidden: true,
              });
              panel.onDidDispose(() => {
                panel = undefined;
              });
          }
          panel.webview.html = reviewGetWebViewContent(formattedContent, "Owasp Review");
        }
        catch (error: any) {
          if (error.name === "AbortError" || error.message === "canceled") {
            wasCancelled = true;
          } else {
            vscode.window.showErrorMessage(`Error Owasp Review: ${error.message || "An unknown error occurred."}`);
          }
        } finally {
          if (wasCancelled) {
            vscode.window.showWarningMessage("Owasp Review process was canceled.");
          }
        }

        });
      } catch (error:any) {
        vscode.window.showErrorMessage(`Error Owasp Review: ${error.message || "An unknown error occurred."}`);
      } finally {
        isExecuting = false;
      }
    
  });

  context.subscriptions.push(reviewOwasp);
}

