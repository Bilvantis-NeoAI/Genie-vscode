import * as vscode from "vscode";
import { postAddErrorHandlingAssistant } from "../../utils/api/assistantAPI";
import { addErrorHandlingAssistantWebviewContent } from "../webview/assistant_webview/addErrorHandlingAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

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
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Error Handling",
          cancellable: false,
        };
 
        await vscode.window.withProgress(progressOptions, async () => {
          const response = await postAddErrorHandlingAssistant(text, language, authToken, project_name, branch_name);
         
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
        });
 
      } catch (error:any) {
        const errorMessage = error.message || "An unknown error occurred.";
        vscode.window.showErrorMessage(`Error Add Error Handling: ${errorMessage}`);
      }
    }
  });
 
  context.subscriptions.push(commentCode);
}
 
 