// import * as vscode from "vscode";
// import { postAllReview } from "../../utils/api/reviewAPI";
// import { reviewAllWebViewContent } from "../webview/review_Webview/reviewAllWebviewContent";
// import { getGitInfo } from "../gitInfo";

// let panel: vscode.WebviewPanel | undefined;
// let abortController = new AbortController(); 
// let isExecuting = false;

// export function registerAllReviewCommand(context: vscode.ExtensionContext, authToken: string) {
//   const reviewAllCode = vscode.commands.registerCommand("extension.reviewAll", async () => {
//       if (isExecuting) {
//         vscode.window.showWarningMessage("Overall review is already in progress.");
//         return;
//       }
  
//       isExecuting = true;

//       const editor = vscode.window.activeTextEditor;
//       if (!editor) {
//         vscode.window.showWarningMessage("No active editor found!");
//         isExecuting = false;
//         return;
//       }
//       const selection = editor.selection;
//       const text = editor.document.getText(selection);
//       if (!text) {
//         vscode.window.showWarningMessage("No code selected. Please select code to review.");
//         isExecuting = false;
//         return;
//       }

//       const language = editor.document.languageId;
//       const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";

//       try {
//         const { project_name, branch_name } = await getGitInfo(workspacePath);

//         abortController = new AbortController(); // Always create a fresh instance

//         const progressOptions: vscode.ProgressOptions = {
//           location: vscode.ProgressLocation.Notification,
//           title: "Performing Overall Review",
//           cancellable: true, // Allow user to cancel
//         };

//         await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
//           let wasCancelled = false; // Track if the user canceled

//           cancel.onCancellationRequested(() => {
//             abortController.abort(); // Cancel the request
//             wasCancelled = true;
//           });

//           try {
//             const reviewComments = await postAllReview(text, language, authToken, project_name, branch_name, {
//               signal: abortController.signal, // Pass abort signal
//             });

//             if (wasCancelled) {
//               return; // Don't proceed if canceled
//             }

//             const formattedContent = JSON.stringify(reviewComments, null, 2);

//             // Reuse or create the webview panel
//             if (panel) {
//               panel.reveal(vscode.ViewColumn.One);
//             } else {
//               panel = vscode.window.createWebviewPanel(
//                 "OverallReview",
//                 "Overall Review",
//                 vscode.ViewColumn.One,
//                 {
//                   enableScripts: true,
//                   retainContextWhenHidden: true,
//                 }
//               );

//               panel.onDidDispose(() => {
//                 panel = undefined;
//               });
//             }

//             panel.webview.html = reviewAllWebViewContent(formattedContent, "Overall Review");
//           } catch (error: any) {
//             if (error.name === "AbortError" || error.message === "canceled") {
//               wasCancelled = true;
//             } else {
//               vscode.window.showErrorMessage(`Error Overall Review: ${error.message || "An unknown error occurred."}`);
//             }
//           } finally {
//             if (wasCancelled) {
//               vscode.window.showWarningMessage("Overall Review process was canceled.");
//             }
//           }
//         });

//       } catch (error: any) {
//         vscode.window.showErrorMessage(`Error Over All Review: ${error.message || "An unknown error occurred."}`);
//       } finally {
//         isExecuting = false;
//     }
//   });

//   context.subscriptions.push(reviewAllCode);
// }


import * as vscode from "vscode";
import { postAllReview } from "../../utils/api/reviewAPI";
import { submitReview } from "../../utils/api/reviewAPI";
import { reviewAllWebViewContent } from "../webview/review_Webview/reviewAllWebviewContent";
import { getGitInfo } from "../gitInfo";
import { getReviewResponseWebViewContent } from "../webview/review_Webview/reviewAllFixedWebviewContent";

let panel: vscode.WebviewPanel | undefined;
let abortController = new AbortController();
let isExecuting = false;

export function registerAllReviewCommand(context: vscode.ExtensionContext, authToken: string) {
  const reviewAllCode = vscode.commands.registerCommand("extension.reviewAll", async () => {
    if (isExecuting) {
      vscode.window.showWarningMessage("Overall review is already in progress.");
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
    const text = editor.document.getText(selection);
    if (!text) {
      vscode.window.showWarningMessage("No code selected. Please select code to review.");
      isExecuting = false;
      return;
    }

    const language = editor.document.languageId;
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";

    try {
      const { project_name, branch_name } = await getGitInfo(workspacePath);

      abortController = new AbortController(); // Always create a fresh instance

      const progressOptions: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: "Performing Overall Review",
        cancellable: true, // Allow user to cancel
      };

      await vscode.window.withProgress(progressOptions, async (progress, cancel) => {
        let wasCancelled = false; // Track if the user canceled

        cancel.onCancellationRequested(() => {
          abortController.abort(); // Cancel the request
          wasCancelled = true;
        });

        try {
          const reviewComments = await postAllReview(text, language, authToken, project_name, branch_name, {
            signal: abortController.signal, // Pass abort signal
          });
          console.log("reviewcomments",reviewComments)

          if (wasCancelled) {
            return; // Don't proceed if canceled
          }

          const formattedContent = JSON.stringify(reviewComments, null, 2);
          console.log("formattedcontent",formattedContent)

          // Reuse or create the webview panel
          if (panel) {
            panel.reveal(vscode.ViewColumn.Beside);
          } else {
            panel = vscode.window.createWebviewPanel(
              "OverallReview",
              "Overall Review",
              vscode.ViewColumn.Beside, // Open beside the current editor
              {
                enableScripts: true,
                retainContextWhenHidden: true,
              }
            );

            panel.onDidDispose(() => {
              panel = undefined;
            });
          }

          panel.webview.html = reviewAllWebViewContent(formattedContent, "Overall Review") + `
            <button id="submitReviewedCode" style="margin-top: 10px; padding: 10px; background-color: green; color: white; border: none; cursor: pointer;">Submit</button>
            <script>
              const reviewComments = ${JSON.stringify(reviewComments, null, 2)};

              document.getElementById("submitReviewedCode").addEventListener("click", () => {
                const vscode = acquireVsCodeApi();
                // Build a new payload that only includes issues with status "Accept"
                const updatedPayload = { ...json_data, issues: {} };
                
                 // Iterate over each category in the issues object
                for (let category in issues) {
                  // Filter the issues: include if status is "Accept" or if status is undefined
                  const acceptedIssues = issues[category]
                    .filter(issue => issue.status === "Accept" || typeof issue.status === "undefined")
                    .map(issue => ({ 
                      ...issue, 
                      // Explicitly set status to "Accept" if it's undefined
                      status: issue.status || "Accept" 
                    }));
                    
                  if (acceptedIssues.length > 0) {
                    updatedPayload.issues[category] = acceptedIssues;
                  }
                }
                
                vscode.postMessage({ command: "submitReviewedCode", payload: updatedPayload });
              });

            </script>
          `;

          panel.webview.onDidReceiveMessage(
            async (message) => {
              if (message.command === "submitReviewedCode") {
                try {
                  await submitReview(message.payload, authToken);
                  vscode.window.showInformationMessage("Review submitted successfully!");
                  const response = await submitReview(message.payload, authToken);
        
                  const formattedResponse = JSON.stringify(response, null, 2);
                   // Close the current webview panel
                   panel?.dispose();
                   panel = undefined;
 
                   // Create a new webview panel to show the formatted response
                   const responsePanel = vscode.window.createWebviewPanel(
                     "ReviewResponse",
                     "Review Response",
                     vscode.ViewColumn.Beside,
                     {
                       enableScripts: true,
                       retainContextWhenHidden: true,
                     }
                   );
 
                   responsePanel.webview.html = getReviewResponseWebViewContent(formattedResponse);
        
                  console.log("Response from submitReview:", formattedResponse);
                } catch (error: any) {
                  vscode.window.showErrorMessage(error.message);
                }
              }
            },
            undefined,
            context.subscriptions
          );


        } catch (error: any) {
          if (error.name === "AbortError" || error.message === "canceled") {
            wasCancelled = true;
          } else {
            vscode.window.showErrorMessage(`Error Overall Review: ${error.message || "An unknown error occurred."}`);
          }
        } finally {
          if (wasCancelled) {
            vscode.window.showWarningMessage("Overall Review process was canceled.");
          }
        }
      });

    } catch (error: any) {
      vscode.window.showErrorMessage(`Error Overall Review: ${error.message || "An unknown error occurred."}`);
    } finally {
      isExecuting = false;
    }
  }); 

  context.subscriptions.push(reviewAllCode);
}



