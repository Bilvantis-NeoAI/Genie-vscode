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
exports.registerUnittestCodeAssistantCommand = registerUnittestCodeAssistantCommand;
const vscode = __importStar(require("vscode"));
const assistantAPI_1 = require("../../utils/api/assistantAPI");
const unitestCodeAssistantWebviewContent_1 = require("../webview/assistant_webview/unitestCodeAssistantWebviewContent");
function registerUnittestCodeAssistantCommand(context, authToken) {
    const unittestCode = vscode.commands.registerCommand("extension.unittestCode", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            const language = editor.document.languageId;
            try {
                const progressOptions = {
                    location: vscode.ProgressLocation.Notification,
                    title: "Unit Test Code",
                    cancellable: false,
                };
                await vscode.window.withProgress(progressOptions, async () => {
                    const unittestCodes = await (0, assistantAPI_1.postUnittestCodeAssistant)(text, language, authToken);
                    const formattedContent = JSON.stringify(unittestCodes, null, 2);
                    const panel = vscode.window.createWebviewPanel("unittestCodeAssistant", "Unit Test Code Assistant", vscode.ViewColumn.One, {});
                    panel.webview.html = (0, unitestCodeAssistantWebviewContent_1.unittestCodeAssistantWebViewContent)(formattedContent, "Unit Test Code Assistant");
                });
            }
            catch (error) {
                vscode.window.showErrorMessage("Error Unit Test code.");
            }
        }
    });
    context.subscriptions.push(unittestCode);
}
//# sourceMappingURL=unittestCodeAssistant.js.map