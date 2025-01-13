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
import { registerTechDepthReviewCommand } from "./commands/review/techDepthReview";
import { registerAddDocstringsAssistantCommand } from "./commands/assistant/addDocstringAssistant";
import { registerCodeGenerationAssistantCommand } from "./commands/assistant/codeGenerationAssistant";
import { registerAddCommentsAssistantCommand } from "./commands/assistant/addCommentsCodeAssistant";
import { registerOrgStdReviewCommand } from "./commands/review/orgStdReview";
import { registerAddLoggingAssistantCommand } from "./commands/assistant/addLoggingAssistant";
import { registerErrorHandlingAssistantCommand } from "./commands/assistant/addErrorHandlingAssistant";
import { registerRefactorCodeAssistantCommand } from "./commands/assistant/refactorCodeAssistant";
import { registerExplainCodeAssistantCommand } from "./commands/assistant/explainCodeAssistant";
import { registerUnittestCodeAssistantCommand } from "./commands/assistant/unittestCodeAssistant";
import { registerExplainGitKBCommand } from "./commands/gitKB/explainGitKB";
import { registerGetCodeGitKBCommand } from "./commands/gitKB/getCodeGitKB";
import { registerKnowledgeBaseQACommand } from "./commands/KB/queAnsFromKB";
import { LoginRegisterCommandsProvider } from "./commands/sidebarCommandRegister/LoginRegisterCommandsProvider";
import { gitHooksCommitReview } from "./commands/gitCommit/gitHooksCommitReview";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { GenieCommandsProvider } from "./commands/sidebarCommandRegister/GenieCommandsProvider";
import { showLogoutWebview } from "./commands/webview/auth_webview/showLogOutWebview";

let globalContext: vscode.ExtensionContext;
let isLoggedIn = false;







export async function activate(context: vscode.ExtensionContext) {



  
 // Reset auth token on activation
// context.secrets.delete("authToken");
// context.secrets.delete("urlSubmitted");
  globalContext = context;
  console.log("globalcontext at activate",globalContext)

  

  const urlSubmitted = await context.secrets.get("urlSubmitted");
  const authToken = await context.secrets.get("authToken");

  console.log("AuthToken at activation:", authToken);
  console.log("URL Submitted at activation:", urlSubmitted);

  const loginRegisterProvider = new LoginRegisterCommandsProvider();
  vscode.window.registerTreeDataProvider("loginRegisterCommands", loginRegisterProvider);

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.url", () => {
      showUrlWebview(context);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.login", () => {
      showLoginRegisterWebview(context, "login");
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.register", () => {
      showLoginRegisterWebview(context, "register");
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.logout", () => {
      showLogoutWebview(context); // Opens the logout webview
      
      // Perform additional tasks like clearing tokens or states here
    isLoggedIn = false; // Mark user as logged out

    // Delete the saved secrets
    context.secrets.delete("authToken");
    context.secrets.delete("urlSubmitted");

    })
  );

  if (!urlSubmitted) {
    showUrlWebview(context);
    await waitForUrlSubmission();
  }

  const updatedUrlSubmitted = await context.secrets.get("urlSubmitted");
  console.log("Updated urlSubmitted", updatedUrlSubmitted)
  const updatedAuthToken = await context.secrets.get("authToken");
  console.log("Updated authToken", updatedAuthToken);

  if (updatedUrlSubmitted) {
    if (updatedAuthToken) {
      isLoggedIn = true;
      activateCodeCommands(context);
      const genieProvider = new GenieCommandsProvider();
      vscode.window.registerTreeDataProvider("genieCommands", genieProvider);
    } else {
      showLoginPrompt(context);
    }
  } else {
    showUrlWebview(context);
  }
}

export function openLoginPage(context: vscode.ExtensionContext) {
  showLoginRegisterWebview(context, "login");
}
 
export function openSignUpPage(context: vscode.ExtensionContext) {
  showLoginRegisterWebview(context, "register");
}

async function waitForUrlSubmission() {
  while ((await globalContext.secrets.get("urlSubmitted")) !== "true") {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

export function activateCodeCommands(context: vscode.ExtensionContext) {
  context.secrets.get("authToken").then((authToken) => {
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
    registerTechDepthReviewCommand(context, authToken);
    registerOrgStdReviewCommand(context, authToken);

    registerAddCommentsAssistantCommand(context, authToken);
    registerAddDocstringsAssistantCommand(context, authToken);
    registerCodeGenerationAssistantCommand(context, authToken);
    registerErrorHandlingAssistantCommand(context, authToken);
    registerAddLoggingAssistantCommand(context, authToken);
    registerRefactorCodeAssistantCommand(context, authToken);
    registerExplainCodeAssistantCommand(context, authToken);
    registerUnittestCodeAssistantCommand(context, authToken);

    registerExplainGitKBCommand(context, authToken);
    registerGetCodeGitKBCommand(context, authToken);

    registerKnowledgeBaseQACommand(context, authToken);

    gitHooksCommitReview();
  });
}





export async function deactivate() {
  try {
    console.log("Deactivation started.");

    try {
     
    } catch (error) {
      console.error("Error during secret deletion:", error);


    const hooksDir = path.join(os.homedir(), "hooks-folder");

    if (fs.existsSync(hooksDir)) {
      fs.rmSync(hooksDir, { recursive: true, force: true });
    } else {
      console.log(`Hooks folder does not exist at: ${hooksDir}`);
    }
  }
  } catch (error) {
    console.error("Error during deactivation:", error);
  }
}
