import * as vscode from "vscode";
import { postFilewiseUnitTestCodeAssistant } from "../../utils/api/assistantAPI";
import { filewiseUnitTestCodeAssistantWebviewContent } from "../webview/assistant_webview/filewiseUnitTestCodeAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

let abortController = new AbortController(); 
let isExecuting = false;

export function registerFilewiseUnitTestCodeAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const testCases = vscode.commands.registerCommand("extension.assistantFilewiseUnitTestCode", async () => {
      if (isExecuting) {
        vscode.window.showWarningMessage("Filewise Unit Test Code is already in progress.");
        return;
      }
      isExecuting = true;
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor found!");
        isExecuting = false;
        return;
      }
      // const selection = editor.selection;
      const text = editor.document.getText();
      const language = editor.document.languageId;
      
      // Validate if the language is either 'java' or 'python'
      if (language !== 'java' && language !== 'python') {
        vscode.window.showErrorMessage('Only Java and Python files are allowed for this operation.');
        isExecuting = false;
        return;
      }
      
      const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
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
            // Wait for the response before opening the panel
            const response = await postFilewiseUnitTestCodeAssistant(text, language, authToken, project_name, branch_name, { signal: abortController.signal });
            if (wasCancelled) {
              return;
            }
            // Open the panel only after receiving a response
            const panel = vscode.window.createWebviewPanel(
              "filewiseUnitTestCodeAssistant",
              "Filewise Unit Test Code Assistant",
              vscode.ViewColumn.Beside,
              { enableScripts: true }
            );

            const formattedContent = JSON.stringify(response, null, 2);
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
            });

          } catch (error: any) {
            if (wasCancelled) {
              vscode.window.showWarningMessage("Filewise Unit Test Code process was cancelled.");
              return; // Stop further execution
            }
            // if (error.name === "AbortError" || error === "canceled") {
            //   wasCancelled = true;
            // }

            const panel = vscode.window.createWebviewPanel(
              "filewiseUnitTestCodeAssistant",
              "Filewise Unit Test Code Assistant",
              vscode.ViewColumn.Beside,
              { enableScripts: true }
            );

            if (error.response && error.response.status === 406) {
              const { message, error: syntaxError, line_number, offset, content } = error.response.data.detail;
              const errorMessage = `Error: ${message}\nDetails: ${syntaxError}\nLine: ${line_number}, Offset: ${offset}\nContent: ${content}`;
              panel.webview.html = filewiseUnitTestCodeAssistantWebviewContent(JSON.stringify({ error: errorMessage }), "Filewise Unit Test Code Assistant", language);
            } else {
              const errorMessage = `Error Filewise Unit Test Code: ${error || "An unknown error occurred."}`;
              panel.webview.postMessage({ command: "error", errorMessage });
            }

            // if (wasCancelled) {
            //   vscode.window.showWarningMessage("Filewise Unit Test Code process was cancelled.");
            // }
          }
        });
 
      } catch (error:any) {
        vscode.window.showErrorMessage(`Error Filewise Unit Test Code: ${error.message || "An unknown error occurred."}`);
      } finally {
        isExecuting = false;
      }
  });

  context.subscriptions.push(testCases);
}
