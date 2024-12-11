import * as vscode from "vscode";
import { ANSWER_CONFIG } from "../../auth/config";
import { knowledgeBaseQA } from "../../utils/api/KBAPI";
import { knowledgeBaseQAWebviewContent } from "../webview/KB_webview/queAnsFromKBWebviewContent";
export function registerKnowledgeBaseQACommand(
  context: vscode.ExtensionContext,
  authToken: string
) {
  const knowledgeBaseQueAns = vscode.commands.registerCommand(
    "extension.knowledgeBaseQueAns",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = editor.selection;
        const question = editor.document.getText(selection); // Selected text is the question

        if (!question.trim()) {
          vscode.window.showErrorMessage(
            "Please select some text to use as the question."
          );
          return;
        }

        try {
          const progressOptions: vscode.ProgressOptions = {
            location: vscode.ProgressLocation.Notification,
            title: "Getting Response From KB",
            cancellable: false,
          };

          await vscode.window.withProgress(progressOptions, async () => {
            // Fetch response from knowledge base API
            const KBresponse = await knowledgeBaseQA(
              question,
              ANSWER_CONFIG,
              authToken
            );

             // Log response to the console
             console.log("Knowledge Base Response:", KBresponse);

            const formattedContent = JSON.stringify(KBresponse, null, 2);

            const panel = vscode.window.createWebviewPanel("knowledgeBaseQA", "Knowledge Base QA", vscode.ViewColumn.One, {});
          panel.webview.html = knowledgeBaseQAWebviewContent(formattedContent, "Knowledge Base QA");
        });
      } catch (error) {
        vscode.window.showErrorMessage("Error explain code.");
      }
    }
  });

  context.subscriptions.push(knowledgeBaseQueAns);

}
