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
exports.GenieCommandsProvider = void 0;
const vscode = __importStar(require("vscode"));
// GenieCommandsProvider class provides the data for the tree view
class GenieCommandsProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    // Method to provide the tree item for each GenieCommand or category
    getTreeItem(element) {
        return element;
    }
    // Method to provide the list of children (commands or categories)
    getChildren(element) {
        if (!element) {
            // Top-level categories
            return Promise.resolve([
                new GenieCategory("Assistant"),
                new GenieCategory("Review"),
                new GenieCategory("Git - Knowledge Base"),
                new GenieCategory("Knowledge Base")
            ]);
        }
        else if (element.label === "Assistant") {
            // Commands under the "Assistant" category
            return Promise.resolve([
                new GenieCommand("Add Docstring", "extension.addDocstrings", "(Ctrl+Alt+D)"),
                new GenieCommand("Add Error Handler", "extension.errorHandling", "(Ctrl+Alt+E)"),
                new GenieCommand("Add Logging", "extension.addLogging", "(Ctrl+Alt+L)"),
                new GenieCommand("Code Generation", "extension.codeGeneration", "(Ctrl+Alt+G)"),
                new GenieCommand("Comment Code", "extension.addComments", "(Ctrl+Alt+C)"),
                new GenieCommand("Explain Code", "extension.explainCode", "(Ctrl+Alt+X)"),
                new GenieCommand("Refactor Code", "extension.refactorCode", "(Ctrl+Alt+R)"),
                new GenieCommand("Unit Test Code", "extension.unittestCode", "(Ctrl+Alt+U)")
            ]);
        }
        else if (element.label === "Review") {
            // Commands under the "Review" category
            return Promise.resolve([
                new GenieCommand("Code Overall Review", "extension.reviewOverall", "(Ctrl+Shift+O)"),
                new GenieCommand("Code Review", "extension.reviewCode", "(Ctrl+Shift+R)"),
                new GenieCommand("CyclometricCX Review", "extension.reviewCyclometricCX", "(Ctrl+Shift+C)"),
                new GenieCommand("Org Std Review", "extension.reviewOrgStd", "(Ctrl+Shift+G)"),
                new GenieCommand("Owasp Review", "extension.reviewOwasp", "(Ctrl+Shift+W)"),
                new GenieCommand("Performance Review", "extension.reviewPerformance", "(Ctrl+Shift+P)"),
                new GenieCommand("Security Review", "extension.reviewSecurity", "(Ctrl+Shift+S)"),
                new GenieCommand("Syntax Review", "extension.reviewSyntax", "(Ctrl+Shift+Y)"),
            ]);
        }
        return Promise.resolve([]);
    }
    // Optional: Can be used to refresh the tree data when needed
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.GenieCommandsProvider = GenieCommandsProvider;
class GenieCategory extends vscode.TreeItem {
    constructor(label) {
        super(label, vscode.TreeItemCollapsibleState.Collapsed); // Categories are collapsible
        this.contextValue = "category";
    }
}
class GenieCommand extends vscode.TreeItem {
    shortcut;
    constructor(label, command, shortcut) {
        super(label, vscode.TreeItemCollapsibleState.None); // Commands are non-collapsible
        this.shortcut = shortcut;
        this.command = {
            command,
            title: label,
        };
        // Add a description to display the shortcut
        this.tooltip = `${label} ${shortcut}`; // Show shortcut in the tooltip
        this.description = shortcut; // Show shortcut as the description
    }
}
//# sourceMappingURL=GenieCommandsProvider.js.map