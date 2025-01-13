import * as vscode from "vscode";
import { postUnittestCodeAssistant } from "../../utils/api/assistantAPI";
import { unittestCodeAssistantWebViewContent } from "../webview/assistant_webview/unitestCodeAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";
import { log } from "console";

let panel: vscode.WebviewPanel | undefined;

export function registerUnittestCodeAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const unittestCode = vscode.commands.registerCommand("extension.unittestCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      if (!text) {
        vscode.window.showWarningMessage("No code selected. Please select code to assistant.");
        return;
      }
      
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
          
          if (panel) {
            panel.reveal(vscode.ViewColumn.One);
          } else {
            panel = vscode.window.createWebviewPanel(
              "unittestCodeAssistant", 
              "Unit Test Code Assistant", 
              vscode.ViewColumn.One, 
              {
                enableScripts: true,
                retainContextWhenHidden: true,
              });
              panel.onDidDispose(() => {
                panel = undefined;
              });
          }
          
          panel.webview.html = unittestCodeAssistantWebViewContent(formattedContent, "Unit Test Code Assistant");
        });
      } catch (error:any) {
        const errorMessage = error.message || "An unknown error occurred.";
        vscode.window.showErrorMessage(`Error Unit Test Code: ${errorMessage}`);
      }
    }
  });

  context.subscriptions.push(unittestCode);
}
