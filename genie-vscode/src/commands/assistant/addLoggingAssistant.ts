import * as vscode from "vscode";
import { postAddLoggingAssistant } from "../../utils/api/assistantAPI";
import { addLoggingAssistantWebviewContent } from "../webview/assistant_webview/addLoggingAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

let abortController = new AbortController(); 
let isExecuting = false;

export function registerAddLoggingAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const addLogging = vscode.commands.registerCommand("extension.addLogging", async () => {
      if (isExecuting) {
        vscode.window.showWarningMessage("Add Logging is already in progress.");
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
      const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";      
      const { project_name, branch_name } = await getGitInfo(workspacePath);
      
      try {
        abortController = new AbortController();

        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Adding Log Statements",
          cancellable: true,
        };
 
        await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
          let wasCancelled = false;
          cancel.onCancellationRequested(() => {
            abortController.abort();
            wasCancelled = true;
          });

          try {
            const response = await postAddLoggingAssistant(text, language, authToken, project_name, branch_name, {signal: abortController.signal,});
            if (wasCancelled) {
              return;
            }
            const formattedContent = JSON.stringify(response, null, 2);
       
          const panel = vscode.window.createWebviewPanel("addLoggingAssistant", "Logging Assistant", vscode.ViewColumn.Beside, {
            enableScripts: true,
          });
          panel.webview.html = addLoggingAssistantWebviewContent(formattedContent, "Logging Assistant");
 
          // Listen for messages from the webview
          panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
              case 'accept':
                // Replace the code in the editor with the commented code
                editor.edit(editBuilder => {
                  editBuilder.replace(selection, response.loggedCode);
                });
                panel.dispose(); // Close the webview after accepting
                break;
              case 'reject':
                // Just close the webview without making any changes
                panel.dispose();
                break;
            }
          });
          }
          catch (error: any) {
            if (error.name === "AbortError" || error.message === "canceled") {
              wasCancelled = true;
              // return; // Prevent error message when canceled
            } else {
              vscode.window.showErrorMessage(`Error Add Logging: ${error.message || "An unknown error occurred."}`);

            }
            
          } finally {
            if (wasCancelled) {
              vscode.window.showWarningMessage("Add Logging process was cancelled.");
            }
          }
        });
 
      } catch (error:any) {
        vscode.window.showErrorMessage(`Error Add Logging: ${error.message || "An unknown error occurred."}`);
      } finally {
        isExecuting = false;
      }
  });
 
  context.subscriptions.push(addLogging);
}
 
 