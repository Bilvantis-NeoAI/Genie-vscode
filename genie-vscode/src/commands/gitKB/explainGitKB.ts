import * as vscode from "vscode";
import { postQueAnsRepositoryGitKB } from "../../utils/api/gitKBAPI";
import { explainGitKBWebViewContent } from "../webview/gitKB_webview/explainGitKBWebviewContent";

let panel: vscode.WebviewPanel | undefined;

export function registerExplainGitKBCommand(context: vscode.ExtensionContext, authToken: string) {
  const explainGitKB = vscode.commands.registerCommand("extension.explainGitKB", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      if (!text) {
        vscode.window.showWarningMessage("No code selected. Please select code to review.");
        return;
      }

      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Explain From Git KB",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const explainCodes = await postQueAnsRepositoryGitKB(text, authToken);
          const formattedContent = JSON.stringify(explainCodes, null, 2);
          
          if (panel) {
            panel.reveal(vscode.ViewColumn.One);
          } else {
            panel = vscode.window.createWebviewPanel(
              "explainFromGitKB", 
              "Explain From Git KB", 
              vscode.ViewColumn.One, 
              {
                enableScripts: true,
                retainContextWhenHidden: true,
              });
              panel.onDidDispose(() => {
                panel = undefined;
              });

          }
          // const panel = vscode.window.createWebviewPanel("explainFromGitKB", "Explain From Git KB", vscode.ViewColumn.One, {});
          panel.webview.html = explainGitKBWebViewContent(formattedContent, "Explain From Git KB");
        });
      } catch (error:any) {
        const errorMessage = error.message || "An unknown error occurred.";
        vscode.window.showErrorMessage(`Error Explain Code: ${errorMessage}`);
      }
    }
  });

  context.subscriptions.push(explainGitKB);
}
