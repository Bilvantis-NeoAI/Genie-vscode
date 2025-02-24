import * as vscode from "vscode";
import { postFilewiseUnitTestCodeAssistant } from "../../utils/api/assistantAPI";
import { filewiseUnitTestCodeAssistantWebviewContent } from "../webview/assistant_webview/filewiseUnitTestCodeAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

let abortController = new AbortController(); 

export function registerFilewiseUnitTestCodeAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const testCases = vscode.commands.registerCommand("extension.assistantFilewiseUnitTestCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      // const selection = editor.selection;
      const text = editor.document.getText();
      
      const language = editor.document.languageId;
      // Validate if the language is either 'java' or 'python'
      if (language !== 'java' && language !== 'python') {
        vscode.window.showErrorMessage('Only Java and Python files are allowed for this operation.');
        return; // Prevent further execution if the language is not Java or Python
      }
      
      // Get workspace folder path
      const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
      // Fetch Git information using the getGitInfo function
      const { project_name, branch_name } = await getGitInfo(workspacePath);
      
      try {
        abortController = new AbortController();

        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Generating Test Cases for given file",
          cancellable: true,
        };
 
        await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
          let wasCancelled = false;
          cancel.onCancellationRequested(() => {
            abortController.abort();
            wasCancelled = true;
          });

          try {
            const response = await postFilewiseUnitTestCodeAssistant(text, language, authToken, project_name, branch_name, {signal: abortController.signal,});
          
          const formattedContent = JSON.stringify(response, null, 2);        
          const panel = vscode.window.createWebviewPanel("filewiseUnitTestCodeAssistant", "Filewise Unit Test Code Assistant", vscode.ViewColumn.Beside, {
            enableScripts: true,
          });
 
          panel.webview.html = filewiseUnitTestCodeAssistantWebviewContent(formattedContent, "Filewise Unit Test Code Assistant", language);
 
          // Listen for messages from the webview
          panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
              case 'reject':
                panel.dispose();
                break;
                case 'noTestCaseSelected':
                  vscode.window.showErrorMessage(message.message);
                  break;
              
            }
          }
        );
          }
          catch (error: any) {
            if (error.name === "AbortError" || error.message === "canceled") {
              wasCancelled = true;
              // return; // Prevent error message when canceled
            } else {
              vscode.window.showErrorMessage(`Error Filewise Unit Test Code: ${error.message || "An unknown error occurred."}`);

            }
            
          } finally {
            if (wasCancelled) {
              vscode.window.showWarningMessage("Filewise Unit Test Code process was cancelled.");
            }
          }
        });
 
      } catch (error:any) {
        vscode.window.showErrorMessage(`Error Filewise Unit Test Code: ${error.message || "An unknown error occurred."}`);
      }
    }
  });
 
  context.subscriptions.push(testCases);
}
 
 