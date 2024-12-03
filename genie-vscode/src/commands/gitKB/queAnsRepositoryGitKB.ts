import * as vscode from "vscode";
import { queAnsRepositoryGitKBWebviewContent } from "../webview/gitKB_webview/queAnsRepositoryGitKBWebviewContent";
import { postQueAnsRepositoryGitKB } from "../../utils/api/gitKBAPI";

export function registerQueAnsRepositoryGitKBCommand(context: vscode.ExtensionContext, authToken: string) {
  const queAnsRepoGitKB = vscode.commands.registerCommand("extension.queAnsRepoGitKB", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
 
      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Get Response From Git KB",
          cancellable: false,
        };
 
        await vscode.window.withProgress(progressOptions, async () => {
          const GitKBresponse = await postQueAnsRepositoryGitKB(text, authToken);
         
          const formattedContent = JSON.stringify(GitKBresponse, null, 2);
       
          const panel = vscode.window.createWebviewPanel("queAnsRepoGitKB", "Que Ans Repo GitKB", vscode.ViewColumn.Beside, {
            enableScripts: true,
          });
 
          panel.webview.html = queAnsRepositoryGitKBWebviewContent(formattedContent);
 
          // Listen for messages from the webview
          panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
              case 'accept':
                // Replace the code in the editor with the commented code
                editor.edit(editBuilder => {
                  editBuilder.replace(selection, GitKBresponse.response);
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
 
  context.subscriptions.push(queAnsRepoGitKB);
}
 
 