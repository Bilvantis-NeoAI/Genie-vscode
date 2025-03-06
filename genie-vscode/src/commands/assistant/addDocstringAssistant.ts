import * as vscode from "vscode";
import { postAddDocStringsAssistant } from "../../utils/api/assistantAPI";
import { addDocstringsAssistantWebviewContent } from "../webview/assistant_webview/addDocstringAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

let abortController = new AbortController(); 
let isExecuting = false;

export function registerAddDocstringsAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const addDocstrings = vscode.commands.registerCommand("extension.addDocstrings", async () => {
      if (isExecuting) {
        vscode.window.showWarningMessage("Add Docstring is already in progress.");
        return;
      }
      isExecuting = true;
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor found!");
        isExecuting = false; 
        return;
      }
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      if (!text) {
        vscode.window.showWarningMessage("No code selected. Please select code to assistant.");
        isExecuting = false;
        return;
      }

      const language = editor.document.languageId;
      const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
      const { project_name, branch_name } = await getGitInfo(workspacePath);

      // let abortController = new AbortController(); // Initialize AbortController

      try {
        abortController = new AbortController();

        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Adding Docstrings",
          cancellable: true, // Allow user to cancel
        };

        await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
          let wasCancelled = false;
          cancel.onCancellationRequested(() => {
            abortController.abort(); // Cancel the API call
            wasCancelled = true;
            // vscode.window.showWarningMessage("Add Docstrings process canceled."); // Show only one message
          });

          try {
            const response = await postAddDocStringsAssistant(text, language, authToken, project_name, branch_name, {
              signal: abortController.signal, // Pass abort signal
            });
            if (wasCancelled) {
              return;
            }

            const formattedContent = JSON.stringify(response, null, 2);

            const panel = vscode.window.createWebviewPanel("addDocstringsAssistant", "Docstrings Assistant", vscode.ViewColumn.Beside, {
              enableScripts: true,
            });

            panel.webview.html = addDocstringsAssistantWebviewContent(formattedContent, "Docstrings Assistant");

            panel.webview.onDidReceiveMessage((message) => {
              switch (message.command) {
                case 'accept':
                  editor.edit(editBuilder => {
                    editBuilder.replace(selection, response.documentationAdded);
                  });
                  panel.dispose();
                  break;
                case 'reject':
                  panel.dispose();
                  break;
              }
            });
          } catch (error: any) {
            if (error.name === "AbortError" || error.message === "canceled") {
              wasCancelled = true;
              // return; // Prevent error message when canceled
            } else {
              vscode.window.showErrorMessage(`Error Add Docstring Code: ${error.message || "An unknown error occurred."}`);

            }
            
          } finally {
            if (wasCancelled) {
              vscode.window.showWarningMessage("Add Docstring process was cancelled.");
            }
          }
        });

      } catch (error: any) {
        vscode.window.showErrorMessage(`Error Add Docstring Code: ${error.message || "An unknown error occurred."}`);
      } finally {
        isExecuting = false;
      }
  });

  context.subscriptions.push(addDocstrings);
}
