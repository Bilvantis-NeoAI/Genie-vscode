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
exports.registerAddDocstringsAssistantCommand = registerAddDocstringsAssistantCommand;
const vscode = __importStar(require("vscode"));
const assistantAPI_1 = require("../../utils/api/assistantAPI");
const addDocstringAssistantWebviewContent_1 = require("../webview/assistant_webview/addDocstringAssistantWebviewContent");
function registerAddDocstringsAssistantCommand(context, authToken) {
    const addDocstrings = vscode.commands.registerCommand("extension.addDocstrings", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            const language = editor.document.languageId;
            try {
                const progressOptions = {
                    location: vscode.ProgressLocation.Notification,
                    title: "Add Docstrings",
                    cancellable: false,
                };
                await vscode.window.withProgress(progressOptions, async () => {
                    const response = await (0, assistantAPI_1.postAddDocStringsAssistant)(text, language, authToken);
                    const formattedContent = JSON.stringify(response, null, 2);
                    const panel = vscode.window.createWebviewPanel("addDocstringsAssistant", "Add Docstrings Assistant", vscode.ViewColumn.Beside, {
                        enableScripts: true,
                    });
                    panel.webview.html = (0, addDocstringAssistantWebviewContent_1.addDocstringsAssistantWebviewContent)(formattedContent, "Add Docstrings Assistant");
                    // Listen for messages from the webview
                    panel.webview.onDidReceiveMessage((message) => {
                        switch (message.command) {
                            case 'accept':
                                // Replace the code in the editor with the commented code
                                editor.edit(editBuilder => {
                                    editBuilder.replace(selection, response.documentationAdded);
                                });
                                panel.dispose(); // Close the webview after accepting
                                break;
                            case 'reject':
                                // Just close the webview without making any changes
                                panel.dispose();
                                break;
                        }
                    });
                });
            }
            catch (error) {
                vscode.window.showErrorMessage("Error Docstring code.");
            }
        }
    });
    context.subscriptions.push(addDocstrings);
}
//# sourceMappingURL=addDocstringAssistant.js.map