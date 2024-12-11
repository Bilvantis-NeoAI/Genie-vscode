import * as vscode from "vscode";
import { openSignUpPage, openLoginPage } from "../extension";
 
export async function showLoginPrompt(context: vscode.ExtensionContext) { 
  const action = await vscode.window.showInformationMessage(
    " Wel come To Genie, Please Login or Register",
    { modal: true },
    "Login",
    "Register"
  );
 
  if (action === "Register") {
    openSignUpPage(context);
  } else if (action === "Login") {
    openLoginPage(context);
  }
}
 