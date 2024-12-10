// import * as vscode from "vscode";

// export class LoginRegisterCommandsProvider implements vscode.TreeDataProvider<LoginRegisterCommand> {
//   private _onDidChangeTreeData: vscode.EventEmitter<LoginRegisterCommand | undefined | void> = new vscode.EventEmitter<LoginRegisterCommand | undefined | void>();
//   readonly onDidChangeTreeData: vscode.Event<LoginRegisterCommand | undefined | void> = this._onDidChangeTreeData.event;

//   // Method to provide the tree item for each Login/Register command
//   getTreeItem(element: LoginRegisterCommand): vscode.TreeItem {
//     return element;
//   }

//   // Method to provide the list of commands
//   getChildren(element?: LoginRegisterCommand): Thenable<LoginRegisterCommand[]> {
//     if (!element) {
//       // Provide the "Login" and "Register" commands
//       return Promise.resolve([
//         new LoginRegisterCommand("Login", "extension.login", "(Ctrl+Shift+L)"),
//         new LoginRegisterCommand("Register", "extension.register", "(Ctrl+Shift+R)"),
//       ]);
//     }
//     return Promise.resolve([]);
//   }

//   // Optional: Can be used to refresh the tree data when needed
//   refresh(): void {
//     this._onDidChangeTreeData.fire();
//   }
// }

// class LoginRegisterCommand extends vscode.TreeItem {
//   constructor(label: string, command: string, public shortcut: string) {
//     super(label, vscode.TreeItemCollapsibleState.None); // Commands are non-collapsible
//     this.command = {
//       command,
//       title: label,
//     };
//     // Add a description to display the shortcut
//     this.tooltip = `${label} ${shortcut}`; // Show shortcut in the tooltip
//     this.description = shortcut; // Show shortcut as the description
//   }
// }

import * as vscode from "vscode";

export class LoginRegisterCommandsProvider implements vscode.TreeDataProvider<LoginRegisterCommand> {
  private _onDidChangeTreeData: vscode.EventEmitter<LoginRegisterCommand | undefined | void> = new vscode.EventEmitter<LoginRegisterCommand | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<LoginRegisterCommand | undefined | void> = this._onDidChangeTreeData.event;

  /**
   * Provides the tree item for each Login/Register command.
   * @param element The LoginRegisterCommand element.
   * @returns The tree item.
   */
  getTreeItem(element: LoginRegisterCommand): vscode.TreeItem {
    return element;
  }

  /**
   * Provides the list of commands for the Login/Register section.
   * @param element The parent element (unused here).
   * @returns A Promise resolving to an array of LoginRegisterCommand objects.
   */
  getChildren(element?: LoginRegisterCommand): Thenable<LoginRegisterCommand[]> {
    if (!element) {
      // Provide "Login" and "Register" commands
      return Promise.resolve([
        new LoginRegisterCommand("Url", "extension.url"),
        new LoginRegisterCommand("Login", "extension.login"),
        new LoginRegisterCommand("Register", "extension.register"),
      ]);
    }
    return Promise.resolve([]);
  }

  /**
   * Refresh the tree data.
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class LoginRegisterCommand extends vscode.TreeItem {
  /**
   * Creates a tree item for the Login/Register command.
   * @param label The label to display.
   * @param command The command to execute.
   */
  constructor(label: string, command: string) {
    super(label, vscode.TreeItemCollapsibleState.None); // Commands are non-collapsible
    this.command = {
      command,
      title: label,
    };
    this.tooltip = label; // Tooltip shows the label
  }
}
