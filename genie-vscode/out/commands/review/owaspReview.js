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
exports.registerOwaspReviewCommand = registerOwaspReviewCommand;
const vscode = __importStar(require("vscode"));
const reviewAPI_1 = require("../../utils/api/reviewAPI");
const reviewWebviewContent_1 = require("../webview/review_Webview/reviewWebviewContent");
function registerOwaspReviewCommand(context, authToken) {
    const reviewOwasp = vscode.commands.registerCommand("extension.reviewOwasp", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            const language = editor.document.languageId;
            try {
                const progressOptions = {
                    location: vscode.ProgressLocation.Notification,
                    title: "Owasp Reviewing",
                    cancellable: false,
                };
                await vscode.window.withProgress(progressOptions, async () => {
                    const reviewOwasp = await (0, reviewAPI_1.postOwaspReview)(text, language, authToken);
                    const formattedContent = JSON.stringify(reviewOwasp, null, 2);
                    const panel = vscode.window.createWebviewPanel("owaspReview", "Owasp Review", vscode.ViewColumn.One, {});
                    // panel.webview.html = reviewGetWebViewContent(reviewSyntax);
                    panel.webview.html = (0, reviewWebviewContent_1.reviewGetWebViewContent)(formattedContent, "Owasp Review");
                });
            }
            catch (error) {
                vscode.window.showErrorMessage("Error reviewing code.");
            }
        }
    });
    context.subscriptions.push(reviewOwasp);
}
//# sourceMappingURL=owaspReview.js.map