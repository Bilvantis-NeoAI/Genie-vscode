import * as vscode from "vscode";
import { getCodeGitKBWebviewContent } from "../webview/gitKB_webview/getCodeGitKBWebviewContent";
import { postGetCodeGitKB } from "../../utils/api/gitKBAPI";

export function registerGetCodeGitKBCommand(context: vscode.ExtensionContext, authToken: string) {
  const getCodeGitKB = vscode.commands.registerCommand("extension.getCodeGitKB", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      if (!text) {
        vscode.window.showWarningMessage("No code selected. Please select code to getcode from GitKB.");
        return;
      }
  

      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Get Code From Git KB",
          cancellable: false,
        };
 
        await vscode.window.withProgress(progressOptions, async () => {
          const response = await postGetCodeGitKB(text, authToken);
         
          const formattedContent = JSON.stringify(response, null, 2);
       
          const panel = vscode.window.createWebviewPanel("getCodeFromGitKB", "Get Code From Git KB", vscode.ViewColumn.Beside, {
            enableScripts: true,
          });
 
          panel.webview.html = getCodeGitKBWebviewContent(formattedContent, "Get Code From Git KB");
 
          // Listen for messages from the webview
          panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
              case 'accept':
                // Replace the code in the editor with the commented code
                editor.edit(editBuilder => {
                  editBuilder.replace(selection, response.code);
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
        vscode.window.showErrorMessage(`Error Get Code: ${errorMessage}`);
      }
    }
  });
 
  context.subscriptions.push(getCodeGitKB);
}
 
 