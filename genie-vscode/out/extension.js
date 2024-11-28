"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.openLoginPage = openLoginPage;
exports.openSignUpPage = openSignUpPage;
exports.activateCodeCommands = activateCodeCommands;
const vscode = __importStar(require("vscode"));
const GenieCommandsProvider_1 = require("./commands/sidebarCommandRegister/GenieCommandsProvider");
const codeReview_1 = require("./commands/review/codeReview");
const overallReview_1 = require("./commands/review/overallReview");
const performanceReview_1 = require("./commands/review/performanceReview");
const securityReview_1 = require("./commands/review/securityReview");
const syntaxReview_1 = require("./commands/review/syntaxReview");
const showLoginRegisterWebview_1 = require("./commands/webview/auth_webview/showLoginRegisterWebview");
const showUrlWebview_1 = require("./commands/webview/auth_webview/showUrlWebview");
const authDialog_1 = require("./auth/authDialog");
const owaspReview_1 = require("./commands/review/owaspReview");
let isLoggedIn = false;
let authToken;
async function activate(context) {
    // Reset auth token on activation
    context.globalState.update("authToken", undefined);
    context.globalState.update("urlSubmitted", false);
    let urlSubmitted = context.globalState.get("urlSubmitted", false);
    if (!urlSubmitted) {
        (0, showUrlWebview_1.showUrlWebview)(context);
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
        (0, authDialog_1.showLoginPrompt)(context);
    }
    // Load previously stored auth token if available
    const storedToken = context.globalState.get("authToken");
    if (storedToken) {
        authToken = storedToken;
        isLoggedIn = true;
        activateCodeCommands(context);
    }
    // Register the sidebar provider for Genie commands
    const genieProvider = new GenieCommandsProvider_1.GenieCommandsProvider();
    vscode.window.registerTreeDataProvider("genieCommands", genieProvider);
}
function openLoginPage(context) {
    (0, showLoginRegisterWebview_1.showLoginRegisterWebview)(context, "login");
}
function openSignUpPage(context) {
    (0, showLoginRegisterWebview_1.showLoginRegisterWebview)(context, "register");
}
/**
 * Activates all code-related commands using the stored auth token.
 * If the auth token is not available, an error message is shown.
 */
function activateCodeCommands(context) {
    const authToken = context.globalState.get("authToken");
    if (!authToken) {
        vscode.window.showErrorMessage("Authentication is required to activate code commands.");
        return;
    }
    // Register all review commands
    (0, codeReview_1.registerCodeReviewCommand)(context, authToken);
    (0, performanceReview_1.registerPerformanceReviewCommand)(context, authToken);
    (0, securityReview_1.registerSecurityReviewCommand)(context, authToken);
    (0, syntaxReview_1.registerSyntaxReviewCommand)(context, authToken);
    (0, overallReview_1.registerOverallReviewCommand)(context, authToken);
    (0, owaspReview_1.registerOwaspReviewCommand)(context, authToken);
}
//# sourceMappingURL=extension.js.map