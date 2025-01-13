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
      // Provide "Login", "Register", and "Url" commands with codicon icons
      return Promise.resolve([
        new LoginRegisterCommand("Url", "extension.url", "debug-disconnect"), // Codicon for URL - link-external
        new LoginRegisterCommand("Login", "extension.login", "account"), // Codicon for Login
        new LoginRegisterCommand("Register", "extension.register", "new-file"), // Codicon for Register
        new LoginRegisterCommand("Logout", "extension.logout", "sign-out") // Codicon for Logout
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
   * @param iconName The codicon name to display.
   */
  constructor(label: string, command: string, iconName: string) {
    super(label, vscode.TreeItemCollapsibleState.None); // Commands are non-collapsible
    this.command = {
      command,
      title: label,
    };
    this.tooltip = label; // Tooltip shows the label

    try {
      // Set the icon using codicon
      this.iconPath = new vscode.ThemeIcon(iconName);
    } catch (error) {
      console.error("Error setting icon:", error); // Debugging icon issue
      this.iconPath = new vscode.ThemeIcon("error"); // Fallback to a default error icon
    }
  }
}
