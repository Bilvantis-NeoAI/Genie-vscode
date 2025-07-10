// import * as vscode from "vscode";
// import { registerCodeReviewCommand } from "./commands/review/codeReview";
// import { registerOverallReviewCommand } from "./commands/review/overallReview";
// import { registerPerformanceReviewCommand } from "./commands/review/performanceReview";
// import { registerSecurityReviewCommand } from "./commands/review/securityReview";
// import { registerSyntaxReviewCommand } from "./commands/review/syntaxReview";
// import { showLoginRegisterWebview } from "./commands/webview/auth_webview/showLoginRegisterWebview";
// import { showUrlWebview } from "./commands/webview/auth_webview/showUrlWebview";
// import { showLoginPrompt } from "./auth/authDialog";
// import { registerOwaspReviewCommand } from "./commands/review/owaspReview";
// import { registerTechDebtReviewCommand } from "./commands/review/techDebtReview";
// import { registerAddDocstringsAssistantCommand } from "./commands/assistant/addDocstringAssistant";
// import { registerCodeGenerationAssistantCommand } from "./commands/assistant/codeGenerationAssistant";
// import { registerAddCommentsAssistantCommand } from "./commands/assistant/addCommentsCodeAssistant";
// import { registerOrgStdReviewCommand } from "./commands/review/orgStdReview";
// import { registerAddLoggingAssistantCommand } from "./commands/assistant/addLoggingAssistant";
// import { registerErrorHandlingAssistantCommand } from "./commands/assistant/addErrorHandlingAssistant";
// import { registerRefactorCodeAssistantCommand } from "./commands/assistant/refactorCodeAssistant";
// import { registerExplainCodeAssistantCommand } from "./commands/assistant/explainCodeAssistant";
// import { registerUnittestCodeAssistantCommand } from "./commands/assistant/unittestCodeAssistant";
// import { LoginRegisterCommandsProvider } from "./commands/sidebarCommandRegister/LoginRegisterCommandsProvider";
// import { GenieCommandsProvider } from "./commands/sidebarCommandRegister/GenieCommandsProvider";
// import { registerCkReviewCommand } from "./commands/review/ckReview";
// import { registerFilewiseUnitTestCodeAssistantCommand } from "./commands/assistant/filewiseUnitTestCodeAssistant";
// import { loadBaseApi, getKbBaseApi, getBaseApi } from "./auth/config";
// import { registerExplainGitKBCommand } from "./commands/gitKB/explainGitKB";
// import { registerGetCodeGitKBCommand } from "./commands/gitKB/getCodeGitKB";
// import { registerKnowledgeBaseQACommand } from "./commands/KB/queAnsFromKB";
// import { registerAllReviewCommand } from "./commands/review/allReview";
// import { registerRepoDocumentationCommand } from "./commands/document/repoDocumentation";
// import { GenieReloadProvider } from "./commands/sidebarCommandRegister/GenieReloadProvider";
// import { openChatbotWebview } from "./commands/webview/chatbotWebview";


// const jwt = require('jsonwebtoken');
// export let userId: string | undefined;

// export async function activate(context: vscode.ExtensionContext) {
//   const loginRegisterProvider = new LoginRegisterCommandsProvider();
//   // Replace the openLoginPage command registration
//   vscode.window.registerTreeDataProvider("loginRegisterCommands", loginRegisterProvider);
//   // Register sidebar commands
//   context.subscriptions.push(
//     vscode.commands.registerCommand("extension.url", () => {
//       // Directly show the login webview
//       showUrlWebview(context);
//     })
//   );
//   context.subscriptions.push(
//     vscode.commands.registerCommand("extension.login", () => {
//       // Directly show the login webview
//       showLoginRegisterWebview(context, "login");
//     })
//   );

//   context.subscriptions.push(
//     vscode.commands.registerCommand("extension.register", () => {
//       showLoginRegisterWebview(context, "register");
//     })
//   );


//   const commandsProvider = new GenieCommandsProvider();
//   const reloadProvider = new GenieReloadProvider();

//   context.subscriptions.push(
//     vscode.window.registerTreeDataProvider("genieCommands", commandsProvider),
//     vscode.window.registerTreeDataProvider("genieReload", reloadProvider),

//     vscode.commands.registerCommand("extension.reloadGenie", () => {
//       vscode.commands.executeCommand("workbench.action.reloadWindow");
//     })
//   );

//   loadBaseApi(context);
//   console.log("Current BASE_API:", getBaseApi());
//   console.log("Current KBase API:", getKbBaseApi());


// //   context.globalState.update("authToken", undefined);
// // context.globalState.update("urlSubmitted", false);
//   let urlSubmitted = context.globalState.get<boolean>("urlSubmitted") || false;
//   let authToken = context.globalState.get<string>("authToken");
//   if (!urlSubmitted) {
//     showUrlWebview(context);
//   // Wait for the URL submission to complete
//     const waitForSubmission = async () => {
//     while (!context.globalState.get("urlSubmitted", false)) {
//       await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for polling
//     }
//     };
//     await waitForSubmission();
//    }

//    urlSubmitted = context.globalState.get<boolean>("urlSubmitted") || false;
//    authToken = context.globalState.get<string>("authToken");

//    // Proceed after the URL is submitted
//   if (urlSubmitted) {
//     if (authToken) {
//       try {
//         const decodedToken = jwt.decode(authToken);
//         const tokenExpiration = decodedToken.exp;
//         userId = decodedToken.userId;
//         const currentTime = Math.floor(Date.now() / 1000);
//           // Token is expired, clear it
//           if (currentTime > tokenExpiration) {
//           context.globalState.update('authToken', undefined);
//           context.globalState.update('urlSubmitted', false);
//           console.log("The token is expired and has been cleared.", context.globalState.get<string>("authToken"));
//         } else {
//             console.log("The token is still valid.");
//         }
//         } catch (error) {
//           console.error("Failed to decode the token:", error);
//         }
//       activateCodeCommands(context);
//       // Register the sidebar provider for Genie commands
//       const genieProvider = new GenieCommandsProvider();
//       vscode.window.registerTreeDataProvider("genieCommands", genieProvider);
//       } else {
//         // Show login/register if authToken is missing
//         // showLoginRegisterWebview(context, "login");
//         showLoginPrompt(context);
//       }
//   } else {
//     // If URL submission hasn't occurred, show URL webview
//     showUrlWebview(context);
//   }


//   context.subscriptions.push(
//     vscode.commands.registerCommand("extension.openChatbot", () => {
//       openChatbotWebview(context);
//     })
//   );


// }

// export function openLoginPage(context: vscode.ExtensionContext) {
//   showLoginRegisterWebview(context, "login");
// }

// export function openSignUpPage(context: vscode.ExtensionContext) {
//   showLoginRegisterWebview(context, "register");
// }

// /**
//  * Activates all code-related commands using the stored auth token.
//  * If the auth token is not available, an error message is shown.
//  */
// export function activateCodeCommands(context: vscode.ExtensionContext) {
//   const authToken = context.globalState.get<string>("authToken");
//   if (!authToken) {
//     vscode.window.showErrorMessage("Authentication is required to activate code commands.");
//     return;
//   }
//   // Register all review commands
//   registerCodeReviewCommand(context, authToken);
//   registerPerformanceReviewCommand(context, authToken);
//   registerSecurityReviewCommand(context, authToken);
//   registerSyntaxReviewCommand(context, authToken);
//   registerOverallReviewCommand(context, authToken);
//   registerOwaspReviewCommand(context, authToken);
//   registerTechDebtReviewCommand(context, authToken);
//   registerOrgStdReviewCommand(context, authToken);
//   registerCkReviewCommand(context, authToken);
//   registerAllReviewCommand(context, authToken);

//   //Register all Assistant Commands
//   registerAddCommentsAssistantCommand(context, authToken);
//   registerAddDocstringsAssistantCommand(context, authToken);
//   registerCodeGenerationAssistantCommand(context, authToken);
//   registerErrorHandlingAssistantCommand(context, authToken);
//   registerAddLoggingAssistantCommand(context, authToken);
//   registerRefactorCodeAssistantCommand(context, authToken);
//   registerExplainCodeAssistantCommand(context, authToken);
//   registerUnittestCodeAssistantCommand(context, authToken);
//   registerFilewiseUnitTestCodeAssistantCommand(context, authToken);

//   //Register Git KB Commands
//   registerExplainGitKBCommand(context, authToken);
//   registerGetCodeGitKBCommand(context, authToken);

//   //Register KB Commands
//   registerKnowledgeBaseQACommand(context, authToken);

//   //Register all Documentation Commands
//   registerRepoDocumentationCommand(context, authToken);

// }


// export function deactivate() {}


///////////////////////////////////////////////////////////////////////////////

import * as vscode from "vscode";
import { registerCodeReviewCommand } from "./commands/review/codeReview";
import { registerOverallReviewCommand } from "./commands/review/overallReview";
import { registerPerformanceReviewCommand } from "./commands/review/performanceReview";
import { registerSecurityReviewCommand } from "./commands/review/securityReview";
import { registerSyntaxReviewCommand } from "./commands/review/syntaxReview";
import { showLoginRegisterWebview } from "./commands/webview/auth_webview/showLoginRegisterWebview";
import { showUrlWebview } from "./commands/webview/auth_webview/showUrlWebview";
import { showLoginPrompt } from "./auth/authDialog";
import { registerOwaspReviewCommand } from "./commands/review/owaspReview";
import { registerTechDebtReviewCommand } from "./commands/review/techDebtReview";
import { registerAddDocstringsAssistantCommand } from "./commands/assistant/addDocstringAssistant";
import { registerCodeGenerationAssistantCommand } from "./commands/assistant/codeGenerationAssistant";
import { registerAddCommentsAssistantCommand } from "./commands/assistant/addCommentsCodeAssistant";
import { registerOrgStdReviewCommand } from "./commands/review/orgStdReview";
import { registerAddLoggingAssistantCommand } from "./commands/assistant/addLoggingAssistant";
import { registerErrorHandlingAssistantCommand } from "./commands/assistant/addErrorHandlingAssistant";
import { registerRefactorCodeAssistantCommand } from "./commands/assistant/refactorCodeAssistant";
import { registerExplainCodeAssistantCommand } from "./commands/assistant/explainCodeAssistant";
import { registerUnittestCodeAssistantCommand } from "./commands/assistant/unittestCodeAssistant";
import { LoginRegisterCommandsProvider } from "./commands/sidebarCommandRegister/LoginRegisterCommandsProvider";
import { GenieCommandsProvider } from "./commands/sidebarCommandRegister/GenieCommandsProvider";
import { registerCkReviewCommand } from "./commands/review/ckReview";
import { registerFilewiseUnitTestCodeAssistantCommand } from "./commands/assistant/filewiseUnitTestCodeAssistant";
import { loadBaseApi, getKbBaseApi, getBaseApi } from "./auth/config";
import { registerExplainGitKBCommand } from "./commands/gitKB/explainGitKB";
import { registerGetCodeGitKBCommand } from "./commands/gitKB/getCodeGitKB";
import { registerKnowledgeBaseQACommand } from "./commands/KB/queAnsFromKB";
import { registerAllReviewCommand } from "./commands/review/allReview";
import { registerRepoDocumentationCommand } from "./commands/document/repoDocumentation";
import { GenieReloadProvider } from "./commands/sidebarCommandRegister/GenieReloadProvider";
import { openChatbotWebview } from "./commands/webview/chatbotWebview";

const jwt = require("jsonwebtoken");
export let userId: string | undefined;

export async function activate(context: vscode.ExtensionContext) {
  const loginRegisterProvider = new LoginRegisterCommandsProvider();
  vscode.window.registerTreeDataProvider("loginRegisterCommands", loginRegisterProvider);

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.url", () => showUrlWebview(context)),
    vscode.commands.registerCommand("extension.login", () => showLoginRegisterWebview(context, "login")),
    vscode.commands.registerCommand("extension.register", () => showLoginRegisterWebview(context, "register"))
  );

  const commandsProvider = new GenieCommandsProvider();
  const reloadProvider = new GenieReloadProvider();

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("genieCommands", commandsProvider),
    vscode.window.registerTreeDataProvider("genieReload", reloadProvider),
    vscode.commands.registerCommand("extension.reloadGenie", () => vscode.commands.executeCommand("workbench.action.reloadWindow"))
  );

  loadBaseApi(context);
  console.log("Current BASE_API:", getBaseApi());
  console.log("Current KBase API:", getKbBaseApi());

  let urlSubmitted = context.globalState.get<boolean>("urlSubmitted") || false;
  let authToken = context.globalState.get<string>("authToken");

  if (!urlSubmitted) {
    showUrlWebview(context);
    const waitForSubmission = async () => {
      while (!context.globalState.get("urlSubmitted", false)) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    };
    await waitForSubmission();
  }

  urlSubmitted = context.globalState.get<boolean>("urlSubmitted") || false;
  authToken = context.globalState.get<string>("authToken");

  if (urlSubmitted) {
    if (authToken) {
      try {
        const decodedToken = jwt.decode(authToken);
        const tokenExpiration = decodedToken.exp;
        userId = decodedToken.userId;
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime > tokenExpiration) {
          context.globalState.update("authToken", undefined);
          context.globalState.update("urlSubmitted", false);
          console.log("The token is expired and has been cleared.", context.globalState.get<string>("authToken"));
        } else {
          console.log("The token is still valid.");
        }
      } catch (error) {
        console.error("Failed to decode the token:", error);
      }

      activateCodeCommands(context);

      const genieProvider = new GenieCommandsProvider();
      vscode.window.registerTreeDataProvider("genieCommands", genieProvider);
    } else {
      showLoginPrompt(context);
    }
  } else {
    showUrlWebview(context);
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.openChatbot", () => openChatbotWebview(context))
  );

  // Register inline assistant dropdown
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { scheme: "file", language: "*" },
      new AssistantActionProvider(),
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
    )
  );
}

export function deactivate() {}

export function openLoginPage(context: vscode.ExtensionContext) {
  showLoginRegisterWebview(context, "login");
}

export function openSignUpPage(context: vscode.ExtensionContext) {
  showLoginRegisterWebview(context, "register");
}

export function activateCodeCommands(context: vscode.ExtensionContext) {
  const authToken = context.globalState.get<string>("authToken");
  if (!authToken) {
    vscode.window.showErrorMessage("Authentication is required to activate code commands.");
    return;
  }

  registerCodeReviewCommand(context, authToken);
  registerPerformanceReviewCommand(context, authToken);
  registerSecurityReviewCommand(context, authToken);
  registerSyntaxReviewCommand(context, authToken);
  registerOverallReviewCommand(context, authToken);
  registerOwaspReviewCommand(context, authToken);
  registerTechDebtReviewCommand(context, authToken);
  registerOrgStdReviewCommand(context, authToken);
  registerCkReviewCommand(context, authToken);
  registerAllReviewCommand(context, authToken);

  registerAddCommentsAssistantCommand(context, authToken);
  registerAddDocstringsAssistantCommand(context, authToken);
  registerCodeGenerationAssistantCommand(context, authToken);
  registerErrorHandlingAssistantCommand(context, authToken);
  registerAddLoggingAssistantCommand(context, authToken);
  registerRefactorCodeAssistantCommand(context, authToken);
  registerExplainCodeAssistantCommand(context, authToken);
  registerUnittestCodeAssistantCommand(context, authToken);
  registerFilewiseUnitTestCodeAssistantCommand(context, authToken);

  registerExplainGitKBCommand(context, authToken);
  registerGetCodeGitKBCommand(context, authToken);
  registerKnowledgeBaseQACommand(context, authToken);
  registerRepoDocumentationCommand(context, authToken);
}

// --- ✅ Inline Assistant Lightbulb Feature ---
class AssistantActionProvider implements vscode.CodeActionProvider {
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    if (range.isEmpty) return;

    const selectedText = document.getText(range);

    const docstringAction = new vscode.CodeAction("Add Docstring", vscode.CodeActionKind.QuickFix);
    docstringAction.command = {
      title: "Add Docstring",
      command: "extension.addDocstrings",
      arguments: [selectedText]
    };

    const errorHandlerAction = new vscode.CodeAction("Error Handler", vscode.CodeActionKind.QuickFix);
    errorHandlerAction.command = {
      title: "Error Handler",
      command: "extension.errorHandling",
      arguments: [selectedText]
    };

    const addLoggingAction = new vscode.CodeAction("Add Logging", vscode.CodeActionKind.QuickFix);
    addLoggingAction.command = {
      title: "Add Logging",
      command: "extension.addLogging",
      arguments: [selectedText]
    };

    const codeGenerationAction = new vscode.CodeAction("Code Generation", vscode.CodeActionKind.QuickFix);
    codeGenerationAction.command = {
      title: "Code Generation",
      command: "extension.codeGeneration",
      arguments: [selectedText]
    };

    const commentAction = new vscode.CodeAction("Add Comments", vscode.CodeActionKind.QuickFix);
    commentAction.command = {
      title: "Add Comments",
      command: "extension.addComments",
      arguments: [selectedText]
    };

    const explainAction = new vscode.CodeAction("Explain Code", vscode.CodeActionKind.QuickFix);
    explainAction.command = {
      title: "Explain Code",
      command: "extension.explainCode",
      arguments: [selectedText]
    };

    const refactorAction = new vscode.CodeAction("Refactor Code", vscode.CodeActionKind.QuickFix);
    refactorAction.command = {
      title: "Refactor Code",
      command: "extension.refactorCode",
      arguments: [selectedText]
    };

    const unittestCodeAction = new vscode.CodeAction("Unit Test Code", vscode.CodeActionKind.QuickFix);
    unittestCodeAction.command = {
      title: "Unit Test Code",
      command: "extension.unittestCode",
      arguments: [selectedText]
    };


    const overallReviewAction = new vscode.CodeAction("Overall Review", vscode.CodeActionKind.QuickFix);
    overallReviewAction.command = {
      title: "Overall Review",
      command: "extension.overallReview",
      arguments: [selectedText]
    };


    const explainGitKBAction = new vscode.CodeAction("Get Response From Git KB", vscode.CodeActionKind.QuickFix);
    explainGitKBAction.command = {
      title: "Get Response From Git KB",
      command: "extension.explainGitKB",
      arguments: [selectedText]
    };

    const getCodeGitKBAction = new vscode.CodeAction("Get Code From Git KB", vscode.CodeActionKind.QuickFix);
    getCodeGitKBAction.command = {
      title: "Get Code From Git KB",
      command: "extension.getCodeGitKB",
      arguments: [selectedText]
    };

    const knowledgeBaseQueAnsAction = new vscode.CodeAction("Get Response From KB", vscode.CodeActionKind.QuickFix);
    knowledgeBaseQueAnsAction.command = {
      title: "Get Response From KB",
      command: "extension.knowledgeBaseQueAns",
      arguments: [selectedText]
    };


    return [docstringAction, errorHandlerAction, addLoggingAction, codeGenerationAction, commentAction, explainAction, refactorAction, unittestCodeAction, overallReviewAction, explainGitKBAction, getCodeGitKBAction, knowledgeBaseQueAnsAction ];
  }
}
