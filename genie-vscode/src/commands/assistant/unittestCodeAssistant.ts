import * as vscode from "vscode";
import { postUnittestCodeAssistant } from "../../utils/api/assistantAPI";
import { unittestCodeAssistantWebViewContent } from "../webview/assistant_webview/unitestCodeAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

export function registerUnittestCodeAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const unittestCode = vscode.commands.registerCommand("extension.unittestCode", async () => {
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
          title: "Unit Test Code",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const unittestCodes = await postUnittestCodeAssistant(text, language, authToken, project_name, branch_name);
          const formattedContent = JSON.stringify(unittestCodes, null, 2);

          const panel = vscode.window.createWebviewPanel("unittestCodeAssistant", "Unit Test Code Assistant", vscode.ViewColumn.One, {});
          panel.webview.html = unittestCodeAssistantWebViewContent(formattedContent, "Unit Test Code Assistant");
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error Unit Test code.");
      }
    }
  });

  context.subscriptions.push(unittestCode);
}
