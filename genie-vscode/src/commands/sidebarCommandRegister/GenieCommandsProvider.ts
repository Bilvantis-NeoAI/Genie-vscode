import * as vscode from "vscode";

// GenieCommandsProvider class provides the data for the tree view
export class GenieCommandsProvider implements vscode.TreeDataProvider<GenieCommand | GenieCategory> {
  private _onDidChangeTreeData: vscode.EventEmitter<GenieCommand | GenieCategory | undefined | null | void> =
    new vscode.EventEmitter<GenieCommand | GenieCategory | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<GenieCommand | GenieCategory | undefined | null | void> =
    this._onDidChangeTreeData.event;

  // Method to provide the tree item for each GenieCommand or category
  getTreeItem(element: GenieCommand | GenieCategory): vscode.TreeItem {
    return element;
  }

  // Method to provide the list of children (commands or categories)
  getChildren(element?: GenieCommand | GenieCategory): Thenable<(GenieCommand | GenieCategory)[]> {
    if (!element) {
      // Top-level categories
      return Promise.resolve([
        new GenieCategory("Assistant"),
        new GenieCategory("Review"),
      ]);
    } else if (element.label === "Assistant") {
      // Commands under the "Assistant" category
      return Promise.resolve([
      ]);
    } else if (element.label === "Review") {
      // Commands under the "Review" category
      return Promise.resolve([
        new GenieCommand("Code Review", "extension.reviewCode", "(Ctrl+Shift+R)"),
        new GenieCommand("Performance Review", "extension.reviewPerformance", "(Ctrl+Shift+P)"),
        new GenieCommand("Security Review", "extension.reviewSecurity", "(Ctrl+Shift+S)"),
        new GenieCommand("Syntax Review", "extension.reviewSyntax", "(Ctrl+Shift+Y)"),
        new GenieCommand("Owasp Review", "extension.reviewOwasp", "(Ctrl+Shift+W)"),
        new GenieCommand("Code Overall Review", "extension.reviewOverall", "(Ctrl+Shift+O)"),
      ]);
    }

    return Promise.resolve([]);
  }

  // Optional: Can be used to refresh the tree data when needed
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class GenieCategory extends vscode.TreeItem {
  constructor(label: string) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed); // Categories are collapsible
    this.contextValue = "category";
  }
}

class GenieCommand extends vscode.TreeItem {
  constructor(label: string, command: string, public shortcut: string) {
    super(label, vscode.TreeItemCollapsibleState.None); // Commands are non-collapsible
    this.command = {
      command,
      title: label,
    };
    // Add a description to display the shortcut
    this.tooltip = `${label} ${shortcut}`; // Show shortcut in the tooltip
    this.description = shortcut; // Show shortcut as the description
  }
}
