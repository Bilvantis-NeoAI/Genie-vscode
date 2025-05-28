import * as vscode from "vscode";

export class GenieReloadProvider implements vscode.TreeDataProvider<GenieReload> {
  getTreeItem(element: GenieReload): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<GenieReload[]> {
    return Promise.resolve([
      new GenieReload("Reload the plugin to get latest changes", "extension.reloadGenie", "refresh", "Latest changes will be reflected on reload")
    ]);
  }
}

class GenieReload extends vscode.TreeItem {
  constructor(label: string, command: string, iconName: string, tooltipDescription: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = { command, title: label };
    this.tooltip = tooltipDescription;
    this.iconPath = new vscode.ThemeIcon(iconName);
  }
}
