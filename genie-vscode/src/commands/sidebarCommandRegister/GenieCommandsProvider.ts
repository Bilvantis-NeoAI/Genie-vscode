import * as vscode from "vscode";

// GenieCommandsProvider class provides the data for the tree view
export class GenieCommandsProvider implements vscode.TreeDataProvider<GenieCommand | GenieCategory> {
  private _onDidChangeTreeData: vscode.EventEmitter<GenieCommand | GenieCategory | undefined | null | void> =
    new vscode.EventEmitter<GenieCommand | GenieCategory | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<GenieCommand | GenieCategory | undefined | null | void> =
    this._onDidChangeTreeData.event;

  getTreeItem(element: GenieCommand | GenieCategory): vscode.TreeItem {
    return element;
  }

  getChildren(element?: GenieCommand | GenieCategory): Thenable<(GenieCommand | GenieCategory)[]> {
    if (!element) {
      return Promise.resolve([
        new GenieCategory("Assistant", "extensions"),
        new GenieCategory("Review", "list-unordered"),
        new GenieCategory("Git - Knowledge Base", "git-merge"),
        new GenieCategory("Knowledge Base", "book")
      ]);
    } else if (element.label === "Assistant") {
      return Promise.resolve([
        new GenieCommand("Add Docstring", "extension.addDocstrings", "Ctrl+Alt+D", "Cmd+Ctrl+D"),
        new GenieCommand("Add Error Handler", "extension.errorHandling", "Ctrl+Alt+E", "Cmd+Ctrl+E"),
        new GenieCommand("Add Logging", "extension.addLogging", "Ctrl+Alt+L", "Cmd+Ctrl+L"),
        new GenieCommand("Code Generation", "extension.codeGeneration", "Ctrl+Alt+G", "Cmd+Ctrl+G"),
        new GenieCommand("Comment Code", "extension.addComments", "Ctrl+Alt+C", "Cmd+Ctrl+C"),
        new GenieCommand("Explain Code", "extension.explainCode", "Ctrl+Alt+X", "Cmd+Ctrl+X"),
        new GenieCommand("Refactor Code", "extension.refactorCode", "Ctrl+Alt+R", "Cmd+Ctrl+R"),
        new GenieCommand("Unit Test Code", "extension.unittestCode", "Ctrl+Alt+U", "Cmd+Ctrl+U")
      ]);
    } else if (element.label === "Review") {
      return Promise.resolve([
        new GenieCommand("Code Overall Review", "extension.reviewOverall", "Ctrl+Shift+O", "Cmd+Shift+O"),
        new GenieCommand("Code Review", "extension.reviewCode", "Ctrl+Shift+R", "Cmd+Shift+R"),
        new GenieCommand("Tech Depth Review", "extension.reviewTechDepth", "Ctrl+Shift+C", "Cmd+Shift+C"),
        new GenieCommand("Org Std Review", "extension.reviewOrgStd", "Ctrl+Shift+G", "Cmd+Shift+G"),
        new GenieCommand("Owasp Review", "extension.reviewOwasp", "Ctrl+Shift+W", "Cmd+Shift+W"),
        new GenieCommand("Performance Review", "extension.reviewPerformance", "Ctrl+Shift+P", "Cmd+Shift+P"),
        new GenieCommand("Security Review", "extension.reviewSecurity", "Ctrl+Shift+S", "Cmd+Shift+S"),
        new GenieCommand("Syntax Review", "extension.reviewSyntax", "Ctrl+Shift+Y", "Cmd+Shift+Y"),
      ]);
    } else if (element.label === "Git - Knowledge Base") {
      return Promise.resolve([
        new GenieCommand("Explain", "extension.explainGitKB", "Ctrl+Shift+A", "Cmd+Shift+A"),
        new GenieCommand("Get Code", "extension.getCodeGitKB", "Ctrl+Shift+B", "Cmd+Shift+B")
      ]);
    } else if (element.label === "Knowledge Base") {
      return Promise.resolve([
        new GenieCommand("Get Response From KB", "extension.knowledgeBaseQueAns", "Ctrl+Shift+K", "Cmd+Shift+K"),
      ]);
    }

    return Promise.resolve([]);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class GenieCategory extends vscode.TreeItem {
  constructor(label: string, iconName: string) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.contextValue = "category";
    this.iconPath = new vscode.ThemeIcon(iconName);
  }
}

class GenieCommand extends vscode.TreeItem {
  constructor(label: string, command: string, ctrlShortcut: string, cmdShortcut: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    const isMac = process.platform === "darwin"; // Detect macOS
    const shortcut = isMac ? cmdShortcut : ctrlShortcut;

    this.command = {
      command,
      title: label,
    };
    this.tooltip = `${label} (${shortcut})`; // Show shortcut in the tooltip
    this.description = shortcut; // Show shortcut as the description
  }
}
