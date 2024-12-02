import * as vscode from "vscode";
import { postAddErrorHandlingAssistant } from "../../utils/api/assistantAPI";
import { addErrorHandlingAssistantWebviewContent } from "../webview/assistant_webview/addErrorHandlingAssistantWebviewContent";

export function registerErrorHandlingAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const commentCode = vscode.commands.registerCommand("extension.errorHandling", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const language = editor.document.languageId;
 
      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Error Handling",
          cancellable: false,
        };
 
        await vscode.window.withProgress(progressOptions, async () => {
          const response = await postAddErrorHandlingAssistant(text, language, authToken);
         
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
 
      } catch (error) {
        vscode.window.showErrorMessage("Error adding error handling code.");
      }
    }
  });
 
  context.subscriptions.push(commentCode);
}
 
 