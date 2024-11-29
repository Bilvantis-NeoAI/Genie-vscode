import * as vscode from "vscode";
import { postRefactorCodeAssistant } from "../../utils/api/assistantAPI";
import { refactorCodeAssistantWebviewContent } from "../webview/assistant_webview/refactorCodeAssistantWebviewContent";

export function registerRefactorCodeAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const refactorCode = vscode.commands.registerCommand("extension.refactorCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const language = editor.document.languageId;
 
      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Refactor Code",
          cancellable: false,
        };
 
        await vscode.window.withProgress(progressOptions, async () => {
          const response = await postRefactorCodeAssistant(text, language, authToken);
         
          const formattedContent = JSON.stringify(response, null, 2);
       
          const panel = vscode.window.createWebviewPanel("refactorCodeAssistant", "Refactor Code Assistant", vscode.ViewColumn.Beside, {
            enableScripts: true,
          });
 
          panel.webview.html = refactorCodeAssistantWebviewContent(formattedContent, "Refactor Code Assistant");
 
          // Listen for messages from the webview
          panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
              case 'accept':
                // Replace the code in the editor with the commented code
                editor.edit(editBuilder => {
                  editBuilder.replace(selection, response.refactoredCode);
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
        vscode.window.showErrorMessage("Error Refactoring code.");
      }
    }
  });
 
  context.subscriptions.push(refactorCode);
}
 
 