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
exports.registerUriHandler = registerUriHandler;
const vscode = __importStar(require("vscode"));
function registerUriHandler(context, setAuthToken) {
    const uriHandler = vscode.window.registerUriHandler({
        handleUri(uri) {
            const params = new URLSearchParams(uri.query);
            const token = params.get("access_token");
            if (token) {
                setAuthToken(token);
                // Save the token to global state
                context.globalState.update("authToken", token).then(() => {
                    vscode.window.showInformationMessage("Login successful!");
                    // Close the webview after successful login
                    vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                });
            }
            else {
                vscode.window.showErrorMessage("Failed to retrieve access token.");
            }
        }
    });
    context.subscriptions.push(uriHandler);
}
//# sourceMappingURL=uriHandler.js.map