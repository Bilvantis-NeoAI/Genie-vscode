
import * as vscode from "vscode";
import { assistantGetWebViewContent } from "../webview/assistant_webview/assistantWebviewContent";
import { postAddCommentsAssistant } from "../../utils/api/assistantAPI";
import { getGitInfo } from "../gitInfo";

let abortController = new AbortController();
let isExecuting = false;

export function registerAddCommentsAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const addComments = vscode.commands.registerCommand("extension.addComments", async () => {
      if (isExecuting) {
        vscode.window.showWarningMessage("Comment code is already in progress.");
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
      // Fetch Git information using the getGitInfo function
      const { project_name, branch_name } = await getGitInfo(workspacePath);
      try {
        abortController = new AbortController();
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Adding Comments to the Code",
          cancellable: true,
        };
 
        await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
          let wasCancelled = false;
          cancel.onCancellationRequested(() => {
            abortController.abort(); // Cancel the API call
            wasCancelled = true;
            // vscode.window.showWarningMessage("Add Docstrings process canceled."); // Show only one message
          });

          try {
            const response = await postAddCommentsAssistant(text, language, authToken, project_name, branch_name, {signal: abortController.signal,});
            if (wasCancelled) {
              return;
            }
            const formattedContent = JSON.stringify(response, null, 2);
            const panel = vscode.window.createWebviewPanel("addCommentsAssistant", "Add Comments Assistant", vscode.ViewColumn.Beside, {
              enableScripts: true,
            });
            panel.webview.html = assistantGetWebViewContent(formattedContent, "Add Comments Assistant");
 
          // Listen for messages from the webview
          panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
              case 'accept':
                // Replace the code in the editor with the commented code
                editor.edit(editBuilder => {
                  editBuilder.replace(selection, response.commentedCode);
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
              vscode.window.showErrorMessage(`Error Add Comments Code: ${error.message || "An unknown error occurred."}`);
            }       
          } finally {
            if (wasCancelled) {
              vscode.window.showWarningMessage("Add Comments Code process was cancelled.");
            }
          }
        });
 } catch (error: any) {
         vscode.window.showErrorMessage(`Error Add Comments Code: ${error.message || "An unknown error occurred."}`);
        } finally {
          isExecuting = false;
        }
   }); 
   context.subscriptions.push(addComments);
 }