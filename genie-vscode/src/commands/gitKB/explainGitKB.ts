import * as vscode from "vscode";
import { postQueAnsRepositoryGitKB } from "../../utils/api/gitKBAPI";
import { explainGitKBWebViewContent } from "../webview/gitKB_webview/explainGitKBWebviewContent";
export function registerExplainGitKBCommand(context: vscode.ExtensionContext, authToken: string) {
  const explainGitKB = vscode.commands.registerCommand("extension.explainGitKB", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      

      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Explain From Git KB",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const explainCodes = await postQueAnsRepositoryGitKB(text, authToken);
          const formattedContent = JSON.stringify(explainCodes, null, 2);

          const panel = vscode.window.createWebviewPanel("explainFromGitKB", "Explain From Git KB", vscode.ViewColumn.One, {});
          panel.webview.html = explainGitKBWebViewContent(formattedContent, "Explain From Git KB");
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error explain code.");
      }
    }
  });

  context.subscriptions.push(explainGitKB);
}
