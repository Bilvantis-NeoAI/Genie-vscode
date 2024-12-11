import * as vscode from "vscode";
import { postUnittestCodeAssistant } from "../../utils/api/assistantAPI";
import { unittestCodeAssistantWebViewContent } from "../webview/assistant_webview/unitestCodeAssistantWebviewContent";

export function registerUnittestCodeAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const unittestCode = vscode.commands.registerCommand("extension.unittestCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const language = editor.document.languageId;
      

      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Unit Test Code",
          cancellable: false,
        };

        await vscode.window.withProgress(progressOptions, async () => {
          const unittestCodes = await postUnittestCodeAssistant(text, language, authToken);
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
