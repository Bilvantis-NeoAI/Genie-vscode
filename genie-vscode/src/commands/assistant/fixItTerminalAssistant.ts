import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { postAssistantTerminal } from "../../utils/api/assistantAPI";
import { fixItTerminalAssistantWebviewContent } from "../webview/assistant_webview/fixItTerminalAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

let panel: vscode.WebviewPanel | undefined;
let abortController = new AbortController();
let isExecuting = false;

export function registerFixItTerminalAssistantCommand(
  context: vscode.ExtensionContext,
  authToken: string
) {
  const assistantFixIt = vscode.commands.registerCommand(
    "extension.fixIt",
    async () => {
      if (isExecuting) {
        vscode.window.showWarningMessage("Fix It Assistant is already in progress.");
        return;
      }
      isExecuting = true; 

      const editor = vscode.window.activeTextEditor;
      let errorText = "";

      if (editor) {
        const selection = editor.selection;
        errorText = editor.document.getText(selection);
      }

      if (!errorText.trim()) {
        // Clear clipboard to detect if copySelection had any effect
        await vscode.env.clipboard.writeText("");
    
        // Try to copy selection from terminal
        await vscode.commands.executeCommand("workbench.action.terminal.copySelection");
        await new Promise((resolve) => setTimeout(resolve, 300)); // Wait for clipboard update
    
        errorText = await vscode.env.clipboard.readText();
    
        if (!errorText.trim()) {
            isExecuting = false; // Stop execution if no selection is found
            return;
        }
    }
    
    

      const projectRoot =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
      const normalizedProjectRoot = path.normalize(projectRoot.toLowerCase());

      const fileMatches = [
        ...errorText.matchAll(/File ["“']?(.+?)["”'], line (\d+)/g),
      ];

      if (fileMatches.length === 0) {
        console.log("No file paths found in error message.");
      }

      let projectFiles: string[] = [];

      for (const match of fileMatches) {
        let extractedPath = match[1].trim();
        let lineNumber = match[2];

        extractedPath = path.resolve(extractedPath);
        const normalizedExtractedPath = extractedPath.toLowerCase();

        if (normalizedExtractedPath.startsWith(normalizedProjectRoot)) {
          projectFiles.push(extractedPath); // Store all matching project files
        }
      }

      if (projectFiles.length === 0) {
        vscode.window.showErrorMessage(
          "Could not extract a valid project file path from the error message."
        );
        isExecuting = false;
        return;
      }

      let fileContents: { path: string; content: string }[] = [];

      for (const filePath of projectFiles) {
        try {
          const content = fs.readFileSync(filePath, "utf8");
          fileContents.push({ path: filePath, content });
        } catch (err: any) {
          vscode.window.showErrorMessage(
            `Failed to read file ${filePath}: ${err.message}`
          );
        }
      }

      if (fileContents.length === 0) {
        console.error("🚨 No valid file contents retrieved!");
        vscode.window.showErrorMessage("No file content available for Assistant.");
        isExecuting = false;
        return;
      }

      const language = editor?.document.languageId || "plaintext";
      const workspacePath =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";

      try {
        const { project_name, branch_name } = await getGitInfo(workspacePath);
        abortController = new AbortController();

        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Performing Fix It Assistant",
          cancellable: true,
        };

        await vscode.window.withProgress(
          progressOptions,
          async (progress, cancel) => {
            let wasCancelled = false;
            cancel.onCancellationRequested(() => {
              abortController.abort();
              wasCancelled = true;
            });

            try {
              const assistantComments = await postAssistantTerminal(
                errorText,
                fileContents,
                language,
                project_name,
                branch_name,
                authToken,
                { signal: abortController.signal }
              );

              if (wasCancelled) {
                return;
              }
              console.log("🛠️ Raw API Response:", assistantComments);

              if (!assistantComments || typeof assistantComments !== "object") {
                vscode.window.showErrorMessage(
                  "Received unexpected API response."
                );
                console.error("Unexpected API Response:", assistantComments);
                return;
              }
              const formattedContent = JSON.stringify(assistantComments, null, 2);
              if (panel) {
                panel.reveal(vscode.ViewColumn.One);
              } else {
                panel = vscode.window.createWebviewPanel(
                  "FixItAssistant",
                  "Fix It Assistant",
                  vscode.ViewColumn.One,
                  { enableScripts: true, retainContextWhenHidden: true }
                );

                panel.onDidDispose(() => {
                  panel = undefined;
                });
              }
              panel.webview.html = fixItTerminalAssistantWebviewContent(
                JSON.parse(formattedContent),
                "Fix It Assistant"
              );
            } catch (error: any) {
              if (error.name === "AbortError" || error.message === "canceled") {
                wasCancelled = true;
              } else {
                vscode.window.showErrorMessage(
                  `Error Fix It Assistant: ${
                    error.message || "An unknown error occurred."
                  }`
                );
              }
            } finally {
              if (wasCancelled) {
                vscode.window.showWarningMessage(
                  "Fix It Assistant process was canceled."
                );
              }
            }
          }
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Error Code Assistant: ${error.message || "An unknown error occurred."}`
        );
      } finally {
        isExecuting = false;
      }
    }
  );
  context.subscriptions.push(assistantFixIt);
}
