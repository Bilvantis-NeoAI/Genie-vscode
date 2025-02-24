import * as vscode from "vscode";
import { postAddErrorHandlingAssistant } from "../../utils/api/assistantAPI";
import { addErrorHandlingAssistantWebviewContent } from "../webview/assistant_webview/addErrorHandlingAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

let abortController = new AbortController();

export function registerErrorHandlingAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const commentCode = vscode.commands.registerCommand("extension.errorHandling", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
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
          title: "Error Handling",
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
            const response = await postAddErrorHandlingAssistant(text, language, authToken, project_name, branch_name, {signal: abortController.signal,});
            if (wasCancelled) {
              return;
            }
            const formattedContent = JSON.stringify(response, null, 2);
        
            const panel = vscode.window.createWebviewPanel("addErrorHandlingAssistant", "Error Handling Assistant", vscode.ViewColumn.Beside, {
              enableScripts: true,
            });
  
            panel.webview.html = addErrorHandlingAssistantWebviewContent(formattedContent, "Error Handling Assistant");
            // Listen for messages from the webview
          panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
              case 'accept':
                // Replace the code in the editor with the commented code
                editor.edit(editBuilder => {
                  editBuilder.replace(selection, response.exceptionHandlingAdded);
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
              vscode.window.showErrorMessage(`Error Add Error Handler: ${error.message || "An unknown error occurred."}`);

            }
            
          } finally {
            if (wasCancelled) {
              vscode.window.showWarningMessage("Add Error Handler process was cancelled.");
            }
          }

        });
 
      } catch (error:any) {
        vscode.window.showErrorMessage(`Error Add Error Handler: ${error.message || "An unknown error occurred."}`);
      }
    }
  });
 
  context.subscriptions.push(commentCode);
}
 
 