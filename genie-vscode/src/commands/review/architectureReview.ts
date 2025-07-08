import * as vscode from "vscode";
import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs";

import { architectureReviewWebviewContent } from "../webview/review_Webview/architectureReviewWebviewContent";

export function registerArchitectureReviewCommand(context: vscode.ExtensionContext) {
  const runArchitectureReview = vscode.commands.registerCommand(
    "extension.architectureReview",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "ArchitectureReview",
        "Architecture Review",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = architectureReviewWebviewContent();

      panel.webview.onDidReceiveMessage(async (message) => {
        switch (message.command) {
          case "selectJavaFile": {
            const fileUri = await vscode.window.showOpenDialog({
              canSelectMany: false,
              openLabel: "Select .java File",
              filters: { "Java Files": ["java"] }
            });
            if (fileUri && fileUri[0]) {
              panel.webview.postMessage({
                command: "setJavaPath",
                path: fileUri[0].fsPath
              });
            }
            break;
          }

          case "generateArchitectureReview": {
            const javaPath = message.javaPath;

            const jarPath = path.join(context.extensionPath, "resources", "JavaAnalyzer.jar");
            const javaDir = path.dirname(javaPath);
            const reportPath = path.join(javaDir, "output.txt");

            if (!fs.existsSync(jarPath)) {
              vscode.window.showErrorMessage("JAR file not found at: " + jarPath);
              return;
            }

            exec(`java -jar "${jarPath}" "${javaPath}"`, { cwd: javaDir }, (error, stdout, stderr) => {
              let output = "";

              if (fs.existsSync(reportPath)) {
                output = fs.readFileSync(reportPath, "utf-8");
                // Optionally delete file
                // fs.unlinkSync(reportPath);
              } else {
                output = "Error: Report file not found.";
                if (stderr) output += `\n[stderr]: ${stderr}`;
                if (error) output += `\n[error]: ${error.message}`;
              }

              panel.webview.postMessage({
                command: "displayReportMarkdown",
                output
              });
            });

            break;
          }
        }
      });
    }
  );

  context.subscriptions.push(runArchitectureReview);
}
