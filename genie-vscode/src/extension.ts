import * as vscode from "vscode";
import { GenieCommandsProvider } from "./commands/sidebarCommandRegister/GenieCommandsProvider";
import { registerCodeReviewCommand } from "./commands/review/codeReview";
import { registerOverallReviewCommand } from "./commands/review/overallReview";
import { registerPerformanceReviewCommand } from "./commands/review/performanceReview";
import { registerSecurityReviewCommand } from "./commands/review/securityReview";
import { registerSyntaxReviewCommand } from "./commands/review/syntaxReview";
import { showLoginRegisterWebview } from "./commands/webview/auth_webview/showLoginRegisterWebview";
import { showUrlWebview } from "./commands/webview/auth_webview/showUrlWebview";
import { showLoginPrompt } from "./auth/authDialog";
import { registerOwaspReviewCommand } from "./commands/review/owaspReview";
import { registerCyclometricCXReviewCommand } from "./commands/review/cyclometric_cx";
import { registerAddDocstringsAssistantCommand } from "./commands/assistant/addDocstringAssistant";
import { registerCodeGenerationAssistantCommand } from "./commands/assistant/codeGenerationAssistant";
import { registerAddCommentsAssistantCommand } from "./commands/assistant/addCommentsCodeAssistant";
import { registerOrgStdReviewCommand } from "./commands/review/orgStdReview";
import { registerAddLoggingAssistantCommand } from "./commands/assistant/addLoggingAssistant";
import { registerErrorHandlingAssistantCommand } from "./commands/assistant/addErrorHandlingAssistant";
import { registerRefactorCodeAssistantCommand } from "./commands/assistant/refactorCodeAssistant";
import { registerExplainCodeAssistantCommand } from "./commands/assistant/explainCodeAssistant";
import { registerUnittestCodeAssistantCommand } from "./commands/assistant/unittestCodeAssistant";

let isLoggedIn = false;
let authToken: string | undefined;

export async function activate(context: vscode.ExtensionContext) {
  // Reset auth token on activation
  context.globalState.update("authToken", undefined);
  context.globalState.update("urlSubmitted", false);

  let urlSubmitted = context.globalState.get("urlSubmitted", false);
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

   // Proceed after the URL is submitted
  urlSubmitted = context.globalState.get("urlSubmitted", false);
  if (urlSubmitted) {
    showLoginPrompt(context);
  }
  
  // Load previously stored auth token if available
  const storedToken = context.globalState.get<string>("authToken");

  if (storedToken) {
    authToken = storedToken;
    isLoggedIn = true;
    activateCodeCommands(context);
  } 

  // Register the sidebar provider for Genie commands
  const genieProvider = new GenieCommandsProvider();
  vscode.window.registerTreeDataProvider("genieCommands", genieProvider);
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
  registerCyclometricCXReviewCommand(context, authToken);
  registerOrgStdReviewCommand(context, authToken);
  
  //Register all Assistant Commands
  registerAddCommentsAssistantCommand(context, authToken);
  registerAddDocstringsAssistantCommand(context, authToken);
  registerCodeGenerationAssistantCommand(context, authToken);
  registerErrorHandlingAssistantCommand(context, authToken);
  registerAddLoggingAssistantCommand(context, authToken);
  registerRefactorCodeAssistantCommand(context, authToken);
  registerExplainCodeAssistantCommand(context, authToken);
  registerUnittestCodeAssistantCommand(context, authToken);
}
