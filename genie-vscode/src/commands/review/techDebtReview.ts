
import * as vscode from "vscode";
import { postTechDebtReview } from "../../utils/api/reviewAPI";
import { reviewGetWebViewContent } from "../webview/review_Webview/reviewWebviewContent";
import { getGitInfo } from "../gitInfo";

let panel: vscode.WebviewPanel | undefined;
let abortController = new AbortController();

export function registerTechDebtReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewTechDebt = vscode.commands.registerCommand("extension.reviewTechDebt", async () => {
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
      // Fetch Git information using the getGitInfo function
      const { project_name, branch_name } = await getGitInfo(workspacePath);

      try {
        abortController = new AbortController();

        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Performing Tech Debt Review",
          cancellable: true,
        };

        await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
          let wasCancelled = false;

          cancel.onCancellationRequested(() => {
            abortController.abort(); // Cancel the request
            wasCancelled = true;
          });

          try {
          const reviewTechDebt = await postTechDebtReview(text, language, authToken, project_name, branch_name, {signal: abortController.signal});
          if (wasCancelled) {
            return;
          }
          const formattedContent = JSON.stringify(reviewTechDebt, null, 2);

          if (panel) {
            panel.reveal(vscode.ViewColumn.One);
          } else {
            panel = vscode.window.createWebviewPanel(
              "techDebtReview", 
              "Tech Debt Review", 
              vscode.ViewColumn.One, 
              {
                enableScripts: true,
                retainContextWhenHidden: true,
              });
              panel.onDidDispose(() => {
                panel = undefined;
              });
          }
          panel.webview.html = reviewGetWebViewContent(formattedContent, "Tech Debt Review");
        }
        catch (error: any) {
                    if (error.name === "AbortError" || error.message === "canceled") {
                      wasCancelled = true;
                    } else {
                      vscode.window.showErrorMessage(`Error Tech Debt Review: ${error.message || "An unknown error occurred."}`);
                    }
                  } finally {
                    if (wasCancelled) {
                      vscode.window.showWarningMessage("Tech Debt Review process was canceled.");
                    }
                  }

        });
      } catch (error: any) {
         vscode.window.showErrorMessage(`Error Tech Debt Review: ${error.message || "An unknown error occurred."}`);
      }
    }
  });

  context.subscriptions.push(reviewTechDebt);
}

