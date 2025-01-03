import * as vscode from "vscode";
import { postAddLoggingAssistant } from "../../utils/api/assistantAPI";
import { addLoggingAssistantWebviewContent } from "../webview/assistant_webview/addLoggingAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

export function registerAddLoggingAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const addLogging = vscode.commands.registerCommand("extension.addLogging", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const language = editor.document.languageId;
      // Get workspace folder path
      const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
      // Fetch Git information using the getGitInfo function
      const { project_name, branch_name } = await getGitInfo(workspacePath);
      
      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Add Logging",
          cancellable: false,
        };
 
        await vscode.window.withProgress(progressOptions, async () => {
          const response = await postAddLoggingAssistant(text, language, authToken, project_name, branch_name);
         
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
        });
 
      } catch (error) {
        vscode.window.showErrorMessage("Error logging code.");
      }
    }
  });
 
  context.subscriptions.push(addLogging);
}
 
 