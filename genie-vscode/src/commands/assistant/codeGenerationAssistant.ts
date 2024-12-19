import * as vscode from "vscode";
import { codeGenerationAssistantWebviewContent } from "../webview/assistant_webview/codeGenerationAssistantWebviewContent";
import { postCodeGenerationAssistant } from "../../utils/api/assistantAPI";
import { getGitInfo } from "../gitInfo";
 
export function registerCodeGenerationAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const codeGeneration = vscode.commands.registerCommand("extension.codeGeneration", async () => {
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
          title: "Code Generation",
          cancellable: false,
        };
 
        await vscode.window.withProgress(progressOptions, async () => {
          const response = await postCodeGenerationAssistant(text, language, authToken, project_name, branch_name);
         
          const formattedContent = JSON.stringify(response, null, 2);
       
          const panel = vscode.window.createWebviewPanel("codeGenerationAssistant", "Code Generation Assistant", vscode.ViewColumn.Beside, {
            enableScripts: true,
          });
 
          panel.webview.html = codeGenerationAssistantWebviewContent(formattedContent, "Code Generation Assistant");
 
          // Listen for messages from the webview
          panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
              case 'accept':
                // Replace the code in the editor with the commented code
                editor.edit(editBuilder => {
                  editBuilder.replace(selection, response.generatedCode);
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
        vscode.window.showErrorMessage("Error Code Generation code.");
      }
    }
  });
 
  context.subscriptions.push(codeGeneration);
}
 
 