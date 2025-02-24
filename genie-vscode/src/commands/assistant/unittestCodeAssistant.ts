import * as vscode from "vscode";
import { postUnittestCodeAssistant } from "../../utils/api/assistantAPI";
import { unittestCodeAssistantWebViewContent } from "../webview/assistant_webview/unitestCodeAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";
import { log } from "console";

let panel: vscode.WebviewPanel | undefined;
let abortController = new AbortController();
let isExecuting = false; 

export function registerUnittestCodeAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const unittestCode = vscode.commands.registerCommand("extension.unittestCode", async () => {
      if (isExecuting) {
        vscode.window.showWarningMessage("Unit Test Code is already in progress.");
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
          title: "Generating Test Cases",
          cancellable: true,
        };

        await vscode.window.withProgress(progressOptions, async (progess, cancel) => {
          let wasCancelled = false;
          cancel.onCancellationRequested(() => {
            abortController.abort();
            wasCancelled = true;    
          });

          try {
            const unittestCodes = await postUnittestCodeAssistant(text, language, authToken, project_name, branch_name, {signal: abortController.signal});
            if (wasCancelled) {
              return;
            }
            const formattedContent = JSON.stringify(unittestCodes, null, 2);
            if (panel) {
              panel.reveal(vscode.ViewColumn.One);
            } else {
              panel = vscode.window.createWebviewPanel(
                "unittestCodeAssistant", 
                "Unit Test Code Assistant", 
                vscode.ViewColumn.One, 
                {
                  enableScripts: true,
                  retainContextWhenHidden: true,
                });
                panel.onDidDispose(() => {
                  panel = undefined;
                });
            }
            
            panel.webview.html = unittestCodeAssistantWebViewContent(formattedContent, "Unit Test Code Assistant");           
          }
          catch (error: any) {
            if (error.name === "AbortError" || error.message === "canceled") {
              wasCancelled = true;
              // return; // Prevent error message when canceled
            } else {
              vscode.window.showErrorMessage(`Error Unit Test Code: ${error.message || "An unknown error occurred."}`);

            }
            
          } finally {
            if (wasCancelled) {
              vscode.window.showWarningMessage("Unit Test Code process was cancelled.");
            }
          } 
        });
      } catch (error:any) {
        vscode.window.showErrorMessage(`Error Unit Test Code: ${error.message || "An unknown error occurred."}`);
      } finally {
        isExecuting = false;
      }
  });

  context.subscriptions.push(unittestCode);
}
