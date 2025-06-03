import * as vscode from "vscode";
import { DB_QUERY, SESSION_ID } from "../../auth/config";
import { knowledgeBaseQA } from "../../utils/api/KBAPI";
import { knowledgeBaseQAWebviewContent } from "../webview/KB_webview/queAnsFromKBWebviewContent";

let panel: vscode.WebviewPanel | undefined;
let abortController = new AbortController();
let isExecuting = false;

const partition_name = "";
const partition_value = "";
export function registerKnowledgeBaseQACommand(
  context: vscode.ExtensionContext,
  authToken: string
) {
  const knowledgeBaseQueAns = vscode.commands.registerCommand(
    "extension.knowledgeBaseQueAns",
    async () => {
        if (isExecuting) {
                vscode.window.showWarningMessage("Get Response From KB is already in progress.");
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
        const query = editor.document.getText(selection); // Selected text is the question

        if (!query.trim()) {
          vscode.window.showWarningMessage(
            "Please select some text to use as the question."
          );
          isExecuting = false;
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
              query,
              SESSION_ID,
              DB_QUERY,
              partition_name,
              partition_value,
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

      } finally {
        isExecuting = false;
    }

  });

  context.subscriptions.push(knowledgeBaseQueAns);

}
