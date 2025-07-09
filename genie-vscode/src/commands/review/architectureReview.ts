// import * as vscode from "vscode";
// import { exec } from "child_process";
// import * as path from "path";
// import * as fs from "fs";

// import { architectureReviewWebviewContent } from "../webview/review_Webview/architectureReviewWebviewContent";

// export function registerArchitectureReviewCommand(context: vscode.ExtensionContext) {
//   const runArchitectureReview = vscode.commands.registerCommand(
//     "extension.architectureReview",
//     () => {
//       const panel = vscode.window.createWebviewPanel(
//         "ArchitectureReview",
//         "Architecture Review",
//         vscode.ViewColumn.One,
//         { enableScripts: true }
//       );

//       panel.webview.html = architectureReviewWebviewContent();

//       panel.webview.onDidReceiveMessage(async (message) => {
//         switch (message.command) {
//           case "selectJavaFile": {
//             const fileUri = await vscode.window.showOpenDialog({
//               canSelectMany: false,
//               openLabel: "Select .java File",
//               filters: { "Java Files": ["java"] }
//             });
//             if (fileUri && fileUri[0]) {
//               panel.webview.postMessage({
//                 command: "setJavaPath",
//                 path: fileUri[0].fsPath
//               });
//             }
//             break;
//           }

//           case "generateArchitectureReview": {
//             const javaPath = message.javaPath;

//             const jarPath = path.join(context.extensionPath, "resources", "JavaAnalyzer.jar");
//             const javaDir = path.dirname(javaPath);
//             const reportPath = path.join(javaDir, "output.txt");

//             if (!fs.existsSync(jarPath)) {
//               vscode.window.showErrorMessage("JAR file not found at: " + jarPath);
//               return;
//             }

//             exec(`java -jar "${jarPath}" "${javaPath}"`, { cwd: javaDir }, (error, stdout, stderr) => {
//               let output = "";

//               if (fs.existsSync(reportPath)) {
//                 output = fs.readFileSync(reportPath, "utf-8");
//                 // Optionally delete file
//                 // fs.unlinkSync(reportPath);
//               } else {
//                 output = "Error: Report file not found.";
//                 if (stderr) output += `\n[stderr]: ${stderr}`;
//                 if (error) output += `\n[error]: ${error.message}`;
//               }

//               panel.webview.postMessage({
//                 command: "displayReportMarkdown",
//                 output
//               });
//             });

//             break;
//           }
//         }
//       });
//     }
//   );

//   context.subscriptions.push(runArchitectureReview);
// }






// import * as vscode from "vscode";
// import { exec } from "child_process";
// import * as path from "path";
// import * as fs from "fs";
// import { architectureReviewWebviewContent } from "../webview/review_Webview/architectureReviewWebviewContent";

// export function registerArchitectureReviewCommand(context: vscode.ExtensionContext) {
//   const runArchitectureReview = vscode.commands.registerCommand("extension.architectureReview", () => {
//     const panel = vscode.window.createWebviewPanel(
//       "ArchitectureReview",
//       "Architecture Review",
//       vscode.ViewColumn.One,
//       { enableScripts: true }
//     );

//     panel.webview.html = architectureReviewWebviewContent();

//     panel.webview.onDidReceiveMessage(async (message) => {
//       switch (message.command) {
//         case "selectJavaOrFolder": {
//           const uri = await vscode.window.showOpenDialog({
//             canSelectMany: false,
//             canSelectFiles: true,
//             canSelectFolders: true,
//             openLabel: "Select Java File or Folder",
//           });

//           if (uri && uri[0]) {
//             panel.webview.postMessage({
//               command: "setSelectedPath",
//               path: uri[0].fsPath,
//             });
//           }
//           break;
//         }

//         case "generateArchitectureReview": {
//           const selectedPath = message.path;
//           const jarPath = path.join(context.extensionPath, "resources", "ArchRuleset-7.0.0.jar");

//           // If selectedPath is a .java file, compile it first
//           const isJavaFile = selectedPath.endsWith(".java");
//           const workingDir = isJavaFile ? path.dirname(selectedPath) : selectedPath;

//           const compileAndRun = () => {
//             exec(`java -jar "${jarPath}" "${workingDir}"`, { cwd: workingDir }, (error, stdout, stderr) => {
//               const reportPath = path.join(workingDir, "output.txt");
//               let output = "";

//               if (fs.existsSync(reportPath)) {
//                 output = fs.readFileSync(reportPath, "utf-8");
//               } else {
//                 output = "Error: Report file not found.";
//                 if (stderr) output += `\n[stderr]: ${stderr}`;
//                 if (error) output += `\n[error]: ${error.message}`;
//               }

//               panel.webview.postMessage({
//                 command: "displayReportMarkdown",
//                 output,
//               });
//             });
//           };

//           if (isJavaFile) {
//             exec(`javac "${selectedPath}"`, { cwd: workingDir }, (err, stdout, stderr) => {
//               if (err) {
//                 panel.webview.postMessage({
//                   command: "displayReportMarkdown",
//                   output: `Compilation failed:\n${stderr || err.message}`,
//                 });
//               } else {
//                 compileAndRun();
//               }
//             });
//           } else {
//             compileAndRun(); // If folder selected, assume .class files already exist
//           }

//           break;
//         }
//       }
//     });
//   });

//   context.subscriptions.push(runArchitectureReview);
// }


import * as vscode from "vscode";
import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { architectureReviewWebviewContent } from "../webview/review_Webview/architectureReviewWebviewContent";

export function registerArchitectureReviewCommand(context: vscode.ExtensionContext) {
  const runArchitectureReview = vscode.commands.registerCommand("extension.architectureReview", () => {
    const panel = vscode.window.createWebviewPanel(
      "ArchitectureReview",
      "Architecture Review",
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = architectureReviewWebviewContent();

    panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case "selectJavaOrFolder": {
          const uri = await vscode.window.showOpenDialog({
            canSelectMany: false,
            canSelectFiles: true,
            canSelectFolders: false,
            openLabel: "Select Java File or Folder",
            // filters: {
            //   Java: ['java']
            // },

          });

          if (uri && uri[0]) {
            panel.webview.postMessage({
              command: "setSelectedPath",
              path: uri[0].fsPath,
            });
          }
          break;
        }

        // case "generateArchitectureReview": {
        //   const selectedPath = message.path;
        //   const jarPath = path.join(context.extensionPath, "resources", "JavaAnalyzer.jar");

        //   const isJavaFile = selectedPath.endsWith(".java");
        //   const workingDir = isJavaFile ? path.dirname(selectedPath) : selectedPath;

        //   // const compileAndRun = () => {
        //   //   exec(`java -jar "${jarPath}" "${workingDir}"`, { cwd: workingDir }, (error, stdout, stderr) => {
        //   //     const reportPath = path.join(workingDir, "output.txt");
        //   //     let output = "";

        //   //     if (fs.existsSync(reportPath)) {
        //   //       output = fs.readFileSync(reportPath, "utf-8");
        //   //     } else {
        //   //       output = "Error: Report file not found.";
        //   //       if (stderr) output += `\n[stderr]: ${stderr}`;
        //   //       if (error) output += `\n[error]: ${error.message}`;
        //   //     }

        //   //     panel.webview.postMessage({
        //   //       command: "displayReportMarkdown",
        //   //       output,
        //   //     });
        //   //   });
        //   // };
        //   // const compileAndRun = () => {
        //   //   const reportPath = path.join(workingDir, "output.txt");

        //   //   // Clear previous output.txt file if it exists
        //   //   if (fs.existsSync(reportPath)) {
        //   //     fs.unlinkSync(reportPath);
        //   //   }

        //   //   exec(`java -jar "${jarPath}" "${workingDir}"`, { cwd: workingDir }, (error, stdout, stderr) => {
        //   //     let output = "";

        //   //     if (fs.existsSync(reportPath)) {
        //   //       output = fs.readFileSync(reportPath, "utf-8");
        //   //     } else {
        //   //       output = "Error: Report file not found.";
        //   //       if (stderr) output += `\n[stderr]: ${stderr}`;
        //   //       if (error) output += `\n[error]: ${error.message}`;
        //   //     }

        //   //     panel.webview.postMessage({
        //   //       command: "displayReportMarkdown",
        //   //       output,
        //   //     });
        //   //   });
        //   // };

        //   const compileAndRun = () => {
        //     const reportPath = path.join(workingDir, "output.txt");

        //     // Clear previous output.txt file if it exists
        //     if (fs.existsSync(reportPath)) {
        //       fs.unlinkSync(reportPath);
        //     }

        //     const execCommand = `java -jar "${jarPath}" "${workingDir}"`;
        //     console.log("Executing:", execCommand); // 🔍 This prints the full command to your VS Code debug console

        //     exec(execCommand, { cwd: workingDir }, (error, stdout, stderr) => {
        //       let output = "";

        //       if (fs.existsSync(reportPath)) {
        //         output = fs.readFileSync(reportPath, "utf-8");
        //       } else {
        //         output = "Error: Report file not found.";
        //         if (stderr) output += `\n[stderr]: ${stderr}`;
        //         if (error) output += `\n[error]: ${error.message}`;
        //       }

        //       panel.webview.postMessage({
        //         command: "displayReportMarkdown",
        //         output,
        //       });
        //     });
        //   };



        //   if (isJavaFile) {
        //     exec(`javac "${selectedPath}"`, { cwd: workingDir }, (err, stdout, stderr) => {
        //       if (err) {
        //         panel.webview.postMessage({
        //           command: "displayReportMarkdown",
        //           output: `Compilation failed:\n${stderr || err.message}`,
        //         });
        //       } else {
        //         compileAndRun();
        //       }
        //     });
        //   } else {
        //     compileAndRun();
        //   }

        //   break;
        // }

        case "generateArchitectureReview": {
          const selectedPath = message.path;
          const jarPath = path.join(context.extensionPath, "resources", "JavaAnalyzer.jar");

          const isJavaFile = selectedPath.endsWith(".java");
          const workingDir = isJavaFile ? path.dirname(selectedPath) : selectedPath;
          const reportPath = path.join(workingDir, "output.txt");

          // Clear old output.txt
          if (fs.existsSync(reportPath)) {
            fs.unlinkSync(reportPath);
          }

          const compileAndRun = () => {
            // 🔍 For file, pass the full .java path. For folder, just the folder.
            const runPath = isJavaFile ? selectedPath : workingDir;

            const execCommand = `java -jar "${jarPath}" "${runPath}"`;
            console.log("Executing:", execCommand);

            exec(execCommand, { cwd: workingDir }, (error, stdout, stderr) => {
              let output = "";

              if (fs.existsSync(reportPath)) {
                output = fs.readFileSync(reportPath, "utf-8");
              } else {
                output = "Error: Report file not found.";
                if (stderr) output += `\n[stderr]: ${stderr}`;
                if (error) output += `\n[error]: ${error.message}`;
              }

              panel.webview.postMessage({
                command: "displayReportMarkdown",
                output,
              });
            });
          };

          if (isJavaFile) {
            exec(`javac "${selectedPath}"`, { cwd: workingDir }, (err, stdout, stderr) => {
              if (err) {
                panel.webview.postMessage({
                  command: "displayReportMarkdown",
                  output: `Compilation failed:\n${stderr || err.message}`,
                });
              } else {
                compileAndRun();
              }
            });
          } else {
            compileAndRun();
          }

          break;
        }

      }
    });
  });

  context.subscriptions.push(runArchitectureReview);
}