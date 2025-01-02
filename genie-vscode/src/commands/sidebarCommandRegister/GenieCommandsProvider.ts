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
        new GenieCommand("Add Docstring", "extension.addDocstrings", 'file-code'),
        new GenieCommand("Add Error Handler", "extension.errorHandling", 'warning'),
        new GenieCommand("Add Logging", "extension.addLogging", 'debug'),
        new GenieCommand("Code Generation", "extension.codeGeneration", 'rocket'),
        new GenieCommand("Comment Code", "extension.addComments", 'comment'),
        new GenieCommand("Explain Code", "extension.explainCode", 'info'),
        new GenieCommand("Refactor Code", "extension.refactorCode", 'gear'),
        new GenieCommand("Unit Test Code", "extension.unittestCode", 'check')
      ]);
    } else if (element.label === "Review") {
      return Promise.resolve([
        new GenieCommand("Code Overall Review", "extension.reviewOverall", 'file-code'),
        new GenieCommand("Code Review", "extension.reviewCode", 'file-text'),
        new GenieCommand("Tech Depth Review", "extension.reviewTechDepth", 'flame'),
        new GenieCommand("Org Std Review", "extension.reviewOrgStd", 'organization'),
        new GenieCommand("Owasp Review", "extension.reviewOwasp", 'shield'),
        new GenieCommand("Performance Review", "extension.reviewPerformance", 'pulse'),
        new GenieCommand("Security Review", "extension.reviewSecurity", 'lock'),
        new GenieCommand("Syntax Review", "extension.reviewSyntax", 'checklist'),
        
      ]);
    } else if (element.label === "Git - Knowledge Base") {
      return Promise.resolve([
        new GenieCommand("Explain", "extension.explainGitKB", 'comment'),
        new GenieCommand("Get Code", "extension.getCodeGitKB", 'git-branch'),
        
      ]);
    } else if (element.label === "Knowledge Base") {
      return Promise.resolve([
        new GenieCommand("Get Response From KB", "extension.knowledgeBaseQueAns", 'search'),

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
  constructor(label: string, command: string, iconName: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = {
      command,
      title: label,
    };
    this.tooltip = `${label}`; // Show shortcut in the tooltip
    this.description = ''; // Show shortcut as the description
    this.iconPath = new vscode.ThemeIcon(iconName);
  }
}
