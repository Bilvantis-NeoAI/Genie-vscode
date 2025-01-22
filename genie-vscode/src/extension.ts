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
import { registerExplainGitKBCommand } from "./commands/gitKB/explainGitKB";
import { registerGetCodeGitKBCommand } from "./commands/gitKB/getCodeGitKB";
import { registerKnowledgeBaseQACommand } from "./commands/KB/queAnsFromKB";
import { LoginRegisterCommandsProvider } from "./commands/sidebarCommandRegister/LoginRegisterCommandsProvider";
import { gitHooksCommitReview } from "./commands/gitCommit/gitHooksCommitReview";
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { GenieCommandsProvider } from "./commands/sidebarCommandRegister/GenieCommandsProvider";
import { registerCkReviewCommand } from "./commands/review/ckReview";

 
 
let isLoggedIn = false;
// let authToken: string | undefined;
export let userId: string | undefined;
const jwt = require('jsonwebtoken');
 
export async function activate(context: vscode.ExtensionContext) {
  const loginRegisterProvider = new LoginRegisterCommandsProvider();
  // Replace the openLoginPage command registration
  vscode.window.registerTreeDataProvider("loginRegisterCommands", loginRegisterProvider);
 
  // Register sidebar commands
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.url", () => {
      // Directly show the login webview
      showUrlWebview(context);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.login", () => {
      // Directly show the login webview
      showLoginRegisterWebview(context, "login");
    })
  );
 
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.register", () => {
      showLoginRegisterWebview(context, "register");
    })
  );
 
  let urlSubmitted = context.globalState.get<boolean>("urlSubmitted") || false;
  let authToken = context.globalState.get<string>("authToken");  
 
  if (!urlSubmitted) {
    showUrlWebview(context);
 
  // Wait for the URL submission to complete
    const waitForSubmission = async () => {
    while (!context.globalState.get("urlSubmitted", false)) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for polling
    }
    };
    await waitForSubmission();
   }
 
   urlSubmitted = context.globalState.get<boolean>("urlSubmitted") || false;
   authToken = context.globalState.get<string>("authToken");

   // Proceed after the URL is submitted
  if (urlSubmitted) {
 
    if (authToken) {      

      try {
        console.log("*** authtoken if condition");
        const decodedToken = jwt.decode(authToken);
        const tokenExpiration = decodedToken.exp;
        console.log("***", tokenExpiration);
        userId = decodedToken.userId;
        const currentTime = Math.floor(Date.now() / 1000);
        console.log("*** current time", currentTime);
          
          // Token is expired, clear it
          if (currentTime > tokenExpiration) {
          context.globalState.update('authToken', undefined);
          context.globalState.update('urlSubmitted', false);
          console.log("The token is expired and has been cleared.", context.globalState.get<string>("authToken"));
        } else {
            console.log("The token is still valid.");
        }
        } catch (error) {
          console.error("Failed to decode the token:", error);
        }

      // authToken = storedToken;
      isLoggedIn = true;
      activateCodeCommands(context);
      // Register the sidebar provider for Genie commands
      const genieProvider = new GenieCommandsProvider();
      vscode.window.registerTreeDataProvider("genieCommands", genieProvider);
       
      } else {
        // Show login/register if authToken is missing
        // showLoginRegisterWebview(context, "login");
        showLoginPrompt(context);
      }
 
  } else {
    // If URL submission hasn't occurred, show URL webview
    showUrlWebview(context);
  }
}
 
export function openLoginPage(context: vscode.ExtensionContext) {
  showLoginRegisterWebview(context, "login");
}
 
export function openSignUpPage(context: vscode.ExtensionContext) {
  showLoginRegisterWebview(context, "register");
}
 
/**
 * Activates all code-related commands using the stored auth token.
 * If the auth token is not available, an error message is shown.
 */
export function activateCodeCommands(context: vscode.ExtensionContext) {
  const authToken = context.globalState.get<string>("authToken");
 
 
  if (!authToken) {
    vscode.window.showErrorMessage("Authentication is required to activate code commands.");
    return;
  }
 
  // Register all review commands
  registerCodeReviewCommand(context, authToken);
  registerPerformanceReviewCommand(context, authToken);
  registerSecurityReviewCommand(context, authToken);
  registerSyntaxReviewCommand(context, authToken);
  registerOverallReviewCommand(context, authToken);
  registerOwaspReviewCommand(context, authToken);
  registerTechDebtReviewCommand(context, authToken);
  registerOrgStdReviewCommand(context, authToken);
  registerCkReviewCommand(context, authToken);
 
  //Register all Assistant Commands
  registerAddCommentsAssistantCommand(context, authToken);
  registerAddDocstringsAssistantCommand(context, authToken);
  registerCodeGenerationAssistantCommand(context, authToken);
  registerErrorHandlingAssistantCommand(context, authToken);
  registerAddLoggingAssistantCommand(context, authToken);
  registerRefactorCodeAssistantCommand(context, authToken);
  registerExplainCodeAssistantCommand(context, authToken);
  registerUnittestCodeAssistantCommand(context, authToken);
 
  //Register Git KB Commands
  registerExplainGitKBCommand(context, authToken);
  registerGetCodeGitKBCommand(context, authToken);
 
  //Register KB Commands
  registerKnowledgeBaseQACommand(context, authToken);
 
  //gitHooks
  gitHooksCommitReview();
}
 
 
export function deactivate() {
  try {
    // Dynamically detect the folder path in the user's home directory
    const hooksDir = path.join(os.homedir(), "hooks-folder");
 
    if (fs.existsSync(hooksDir)) {
      fs.rmSync(hooksDir, { recursive: true, force: true }); // Delete the folder and its contents
    } else {
      console.log(`Hooks folder does not exist at: ${hooksDir}`);
    }
  } catch (error) {
    console.error("Error deleting hooks folder during deactivation:", error);
  }
}
 
 
 
 
 