import * as vscode from "vscode";
import { postFilewiseUnitTestCodeAssistant, pollJobStatus } from "../../utils/api/assistantAPI";
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

    const text = editor.document.getText();
    const language = editor.document.languageId;

    if (language !== 'java' && language !== 'python') {
      vscode.window.showErrorMessage('Only Java and Python files are allowed for this operation.');
      isExecuting = false;
      return;
    }

    console.log("***Language:",language);
    

    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
    const { project_name, branch_name } = await getGitInfo(workspacePath);

    console.log(`Project name:${project_name} Branch_name:${branch_name}`);

    let panel: vscode.WebviewPanel | undefined = undefined;

    try {
      abortController = new AbortController();
      panel = vscode.window.createWebviewPanel(
        "filewiseUnitTestCodeAssistant",
        "Filewise Unit Test Code Assistant",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.onDidReceiveMessage(
        message => {
          if (message.command === 'reject') {
            panel?.dispose(); 
          } else if (message.command === 'noTestCaseSelected') {
            vscode.window.showWarningMessage("Please select at least one test case to download.");
          }
        },
        undefined,
        context.subscriptions
      );

      panel.webview.html = filewiseUnitTestCodeAssistantWebviewContent(
        JSON.stringify({ status: "Initializing..."}),
        "Filewise Unit Test Code Assistant",
        language
      );

      const progressOptions: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: "Generating Test Cases for given file",
        cancellable: true,
      };

      console.log("***ProgressOptions are",progressOptions);

      await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
        let wasCancelled = false;
        cancel.onCancellationRequested(() => {
          abortController.abort();
          wasCancelled = true;
          isExecuting = false;
          if (panel) {
            panel.dispose();
          }
          vscode.window.showWarningMessage("Filewise Unit Test Code process was cancelled.");
        });


        try {
          const initialResponse = await postFilewiseUnitTestCodeAssistant(
            text,
            language,
            authToken,
            project_name,
            branch_name,
            { signal: abortController.signal }
          );

          console.log("***initial Response",initialResponse);

          if (wasCancelled) {
            return;
          }

          const jobId = initialResponse.JobID;

          if (!jobId) {
            vscode.window.showErrorMessage("Job ID was not generated.");
            return;
          }

          let isJobCompleted = false;
          let result: any = null;

          while (!isJobCompleted && !wasCancelled) {
            const statusResponse = await pollJobStatus(jobId, authToken, { signal: abortController.signal });

            if (panel && statusResponse.Status_display) {
              panel.webview.html = filewiseUnitTestCodeAssistantWebviewContent(
                JSON.stringify({ status: statusResponse.Status_display }),
                "Filewise Unit Test Code Assistant",
                language
              );

            }

            if (statusResponse.status.toLowerCase() === "completed") {
              isJobCompleted = true;
              result = statusResponse.results;
            } else if (statusResponse.status.toLowerCase() === "failed") {
              isJobCompleted = true;
              // vscode.window.showErrorMessage("Job failed.");
              break;
            } else {
              await new Promise(resolve => setTimeout(resolve, 10000));
            }
          }

          if (result && panel) {
            const formattedContent = JSON.stringify(result, null, 2);
            panel.webview.html = filewiseUnitTestCodeAssistantWebviewContent(
              formattedContent,
              "Filewise Unit Test Code Assistant",
              language
            );
          }

        } catch (error: any) {
          if (wasCancelled || error.name === "AbortError") {
            vscode.window.showWarningMessage("Filewise Unit Test Code process was cancelled.");
            return;
          }

          const errorMessage = `Error Filewise Unit Test Code: ${error.message || "An unknown error occurred."}`;
          if (panel) {
            panel.webview.postMessage({ command: "error", errorMessage });
          }
        }
      });

    } catch (error: any) {
      vscode.window.showErrorMessage(`Error Filewise Unit Test Code: ${error.message || "An unknown error occurred."}`);
    } finally {
      isExecuting = false;
    }
  });

  context.subscriptions.push(testCases);
}

