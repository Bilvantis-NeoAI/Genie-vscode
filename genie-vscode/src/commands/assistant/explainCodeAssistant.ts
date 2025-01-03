import * as vscode from "vscode";
import { postExplainCodeAssistant } from "../../utils/api/assistantAPI";
import { explainCodeAssistantWebViewContent } from "../webview/assistant_webview/explainCodeAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

export function registerExplainCodeAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const explainCode = vscode.commands.registerCommand("extension.explainCode", async () => {
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
          title: "Explain Code",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const explainCodes = await postExplainCodeAssistant(text, language, authToken, project_name, branch_name);
          const formattedContent = JSON.stringify(explainCodes, null, 2);

          const panel = vscode.window.createWebviewPanel("explainCodeAssistant", "Explain Code Assistant", vscode.ViewColumn.One, {});
          panel.webview.html = explainCodeAssistantWebViewContent(formattedContent, "Explain Code Assistant");
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error explain code.");
      }
    }
  });

  context.subscriptions.push(explainCode);
}
