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
        new GenieCommand("Add Docstring", "extension.addDocstrings", 'file-code', 'Automatically add docstrings to your code.'),
        new GenieCommand("Add Error Handler", "extension.errorHandling", 'warning', 'Insert error handling code snippets.'),
        new GenieCommand("Add Logging", "extension.addLogging", 'debug', 'Add logging functionality to your code.'),
        new GenieCommand("Code Generation", "extension.codeGeneration", 'rocket', 'Generate code using AI tools.'),
        new GenieCommand("Comment Code", "extension.addComments", 'comment', 'Add meaningful comments to your code.'),
        new GenieCommand("Explain Code", "extension.explainCode", 'info', 'Get explanations for your code.'),
        new GenieCommand("Refactor Code", "extension.refactorCode", 'gear', 'Refactor and optimize your code.'),
        new GenieCommand("Unit Test Code", "extension.unittestCode", 'check', 'Generate unit tests for your code.')
      ]);
    } else if (element.label === "Review") {
      return Promise.resolve([
        new GenieCommand("Code Overall Review", "extension.reviewOverall", 'file-code', 'Perform an overall review of your code.'),
        new GenieCommand("Code Review", "extension.reviewCode", 'file-text', 'Review specific sections of your code.'),
        new GenieCommand("Tech Depth Review", "extension.reviewTechDepth", 'flame', 'Identify and analyze technical debt.'),
        new GenieCommand("Org Std Review", "extension.reviewOrgStd", 'organization', 'Ensure adherence to organizational coding standards.'),
        new GenieCommand("Owasp Review", "extension.reviewOwasp", 'shield', 'Perform a security review based on OWASP guidelines.'),
        new GenieCommand("Performance Review", "extension.reviewPerformance", 'pulse', 'Analyze and improve code performance.'),
        new GenieCommand("Security Review", "extension.reviewSecurity", 'lock', 'Identify security vulnerabilities in your code.'),
        new GenieCommand("Syntax Review", "extension.reviewSyntax", 'checklist', 'Check for syntax errors and inconsistencies.'),
        
      ]);
    } else if (element.label === "Git - Knowledge Base") {
      return Promise.resolve([
        new GenieCommand("Explain", "extension.explainGitKB", 'comment', 'Get explanations form Git concepts.'),
        new GenieCommand("Get Code", "extension.getCodeGitKB", 'git-branch', 'Retrieve code snippets from the Git knowledge base.'),
        
      ]);
    } else if (element.label === "Knowledge Base") {
      return Promise.resolve([
        new GenieCommand("Get Response From KB", "extension.knowledgeBaseQueAns", 'search', 'Fetch answers from the Knowledge Base for your queries.'),

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
  constructor(label: string, command: string, iconName: string, tooltipDescription: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = {
      command,
      title: label,
    };
    // this.tooltip = `${label}`; // Show shortcut in the tooltip
    this.tooltip = tooltipDescription
    this.description = ''; // Show shortcut as the description
    this.iconPath = new vscode.ThemeIcon(iconName);
  }
}
