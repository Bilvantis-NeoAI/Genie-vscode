import * as vscode from "vscode";
import { postQueAnsRepositoryGitKB } from "../../utils/api/gitKBAPI";
import { explainGitKBWebViewContent } from "../webview/gitKB_webview/explainGitKBWebviewContent";
// import { importDebug } from "puppeteer";

let panel: vscode.WebviewPanel | undefined;
let abortController = new AbortController();
let isExecuting = false;

export function registerExplainGitKBCommand(context: vscode.ExtensionContext, authToken: string) {
  const explainGitKB = vscode.commands.registerCommand("extension.explainGitKB", async () => {
      if (isExecuting) {
        vscode.window.showWarningMessage("Explain is already in progress.");
        return;
      }

      isExecuting = true;
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor found!");
        isExecuting = false;
        return;
      }
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      if (!text) {
        vscode.window.showWarningMessage("No code selected. Please select code to explain from GitKB.");
        isExecuting = false;
        return;
      }

      try {
        abortController = new AbortController();
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Explaining From Git KB",
          cancellable: true,
        };

        await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
          let wasCancelled = false;
          cancel.onCancellationRequested(() => {
            abortController.abort();
            wasCancelled = true;    
          });
          try{
            const explainCodes = await postQueAnsRepositoryGitKB(text, authToken, {signal: abortController.signal});
          if (wasCancelled) {
            return;
          }
          const formattedContent = JSON.stringify(explainCodes, null, 2);
          
          if (panel) {
            panel.reveal(vscode.ViewColumn.One);
          } else {
            panel = vscode.window.createWebviewPanel(
              "explainFromGitKB", 
              "Explain From Git KB", 
              vscode.ViewColumn.One, 
              {
                enableScripts: true,
                retainContextWhenHidden: true,
              });
              panel.onDidDispose(() => {
                panel = undefined;
              });

          }
          // const panel = vscode.window.createWebviewPanel("explainFromGitKB", "Explain From Git KB", vscode.ViewColumn.One, {});
          panel.webview.html = explainGitKBWebViewContent(formattedContent, "Explain From Git KB");

          } 
          catch (error: any) {
            if (error.name === "AbortError" || error.message === "canceled") {
              wasCancelled = true;
              // return; // Prevent error message when canceled
            } else {
              vscode.window.showErrorMessage(`Error Explain: ${error.message || "An unknown error occurred."}`);

            }
            
          } finally {
            if (wasCancelled) {
              vscode.window.showWarningMessage("Explain process was cancelled.");
            }
          } 
          
        });
      } catch (error:any) {
        vscode.window.showErrorMessage(`Error Explain Code: ${error.message || "An unknown error occurred."}`);
      } finally {
        isExecuting = false;
    }
    
  });

  context.subscriptions.push(explainGitKB);
}
