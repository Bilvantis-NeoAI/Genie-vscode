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
exports.registerExplainCodeAssistantCommand = registerExplainCodeAssistantCommand;
const vscode = __importStar(require("vscode"));
const assistantAPI_1 = require("../../utils/api/assistantAPI");
const explainCodeAssistantWebviewContent_1 = require("../webview/assistant_webview/explainCodeAssistantWebviewContent");
function registerExplainCodeAssistantCommand(context, authToken) {
    const explainCode = vscode.commands.registerCommand("extension.explainCode", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            const language = editor.document.languageId;
            try {
                const progressOptions = {
                    location: vscode.ProgressLocation.Notification,
                    title: "Explain Code",
                    cancellable: false,
                };
                await vscode.window.withProgress(progressOptions, async () => {
                    const explainCodes = await (0, assistantAPI_1.postExplainCodeAssistant)(text, language, authToken);
                    const formattedContent = JSON.stringify(explainCodes, null, 2);
                    const panel = vscode.window.createWebviewPanel("explainCodeAssistant", "Explain Code Assistant", vscode.ViewColumn.One, {});
                    panel.webview.html = (0, explainCodeAssistantWebviewContent_1.explainCodeAssistantWebViewContent)(formattedContent, "Explain Code Assistant");
                });
            }
            catch (error) {
                vscode.window.showErrorMessage("Error explain code.");
            }
        }
    });
    context.subscriptions.push(explainCode);
}
//# sourceMappingURL=explainCodeAssistant.js.map