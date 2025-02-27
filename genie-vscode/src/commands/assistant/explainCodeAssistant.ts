import * as vscode from "vscode";
import { postExplainCodeAssistant } from "../../utils/api/assistantAPI";
import { explainCodeAssistantWebViewContent } from "../webview/assistant_webview/explainCodeAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

let panel: vscode.WebviewPanel | undefined;
let abortController = new AbortController();
let isExecuting = false;

export function registerExplainCodeAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const explainCode = vscode.commands.registerCommand("extension.explainCode", async () => {
      if (isExecuting) {
        vscode.window.showWarningMessage("Explain Code is already in progress.");
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
        vscode.window.showWarningMessage("No code selected. Please select code to assistant.");
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
          title: "Explaining Code",
          cancellable: true,
        };

        await vscode.window.withProgress(progressOptions, async (progess, cancel) => {
          let wasCancelled = false;
          cancel.onCancellationRequested(() => {
            abortController.abort(); // Cancel the API call
            wasCancelled = true;
            // vscode.window.showWarningMessage("Add Docstrings process canceled."); // Show only one message
          });

          try {
            const explainCodes = await postExplainCodeAssistant(text, language, authToken, project_name, branch_name, {signal: abortController.signal,});
            if (wasCancelled) {
              return;
            }
            const formattedContent = JSON.stringify(explainCodes, null, 2);
            if (panel) {
              panel.reveal(vscode.ViewColumn.One);
            } else {
              panel = vscode.window.createWebviewPanel(
                "explainCodeAssistant", 
                "Explain Code Assistant", 
                vscode.ViewColumn.One, 
                {
                  enableScripts: true,
                  retainContextWhenHidden: true,
                });
                panel.onDidDispose(() => {
                  panel = undefined;
                });
            }
            panel.webview.html = explainCodeAssistantWebViewContent(formattedContent, "Explain Code Assistant");

          }

          catch (error: any) {
            if (error.name === "AbortError" || error.message === "canceled") {
              wasCancelled = true;
              // return; // Prevent error message when canceled
            } else {
              vscode.window.showErrorMessage(`Error Explain Code: ${error.message || "An unknown error occurred."}`);

            }
            
          } finally {
            if (wasCancelled) {
              vscode.window.showWarningMessage("Explain Code process was cancelled.");
            }
          }
          
          
        });
      } catch (error:any) {
        vscode.window.showErrorMessage(`Error Explain Code: ${error.message || "An unknown error occurred."}`);
      } finally {
        isExecuting = false;
      }
    
  });

  context.subscriptions.push(explainCode);
}
