import * as vscode from "vscode";
import { ANSWER_CONFIG } from "../../auth/config";
import { knowledgeBaseQA } from "../../utils/api/KBAPI";
import { knowledgeBaseQAWebviewContent } from "../webview/KB_webview/queAnsFromKBWebviewContent";

let panel: vscode.WebviewPanel | undefined;
let abortController = new AbortController();

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
          abortController = new AbortController();
          const progressOptions: vscode.ProgressOptions = {
            location: vscode.ProgressLocation.Notification,
            title: "Getting Response From KB",
            cancellable: true,
          };
          
          await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
            let wasCancelled = false;
            cancel.onCancellationRequested(() => {
              abortController.abort();
              wasCancelled = true;    
            });
            try{
            // Fetch response from knowledge base API
            const KBresponse = await knowledgeBaseQA(
              question,
              ANSWER_CONFIG,
              authToken, {signal: abortController.signal}
            );
            if (wasCancelled) {
              return;
            }

            const formattedContent = JSON.stringify(KBresponse, null, 2);
        if (panel) {
          panel.reveal(vscode.ViewColumn.One);
        }
        else {
          panel = vscode.window.createWebviewPanel(
            "knowledgeBaseQA",
            "Knowledge Base QA",
            vscode.ViewColumn.One,
            {
              enableScripts: true,
              retainContextWhenHidden: true,
            }
          );
          panel.onDidDispose(() => {
            panel = undefined;
          });
        }
          panel.webview.html = knowledgeBaseQAWebviewContent(formattedContent, "Knowledge Base QA");
      }
      catch (error: any) {
                  if (error.name === "AbortError" || error.message === "canceled") {
                    wasCancelled = true;
                    // return; // Prevent error message when canceled
                  } else {
                    vscode.window.showErrorMessage(`Error Get Response From KB: ${error.message || "An unknown error occurred."}`);
      
                  }
                  
                } finally {
                  if (wasCancelled) {
                    vscode.window.showWarningMessage("Get Response From KB process was cancelled.");
                  }
                } 
        });
      } catch (error:any) {
        vscode.window.showErrorMessage(`Error Get Response From KB: ${error.message || "An unknown error occurred."}`);
       
      }
    }
  });

  context.subscriptions.push(knowledgeBaseQueAns);

}
