import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as vscode from 'vscode';
 
export function gitHooksCommitReview(context: vscode.ExtensionContext,authToken: string): void {
  console.log("Git Hooks Commit Review extension is now active!");
  vscode.window.showInformationMessage("Git Hooks Commit Review extension is now active!");
 
  try {
    // Set global hooks path
    const hooksDir = path.join(require("os").homedir(), ".config/git/hooks");
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
      vscode.window.showInformationMessage("Hooks directory created.");
    }
 
    execSync(`git config --global core.hooksPath ${hooksDir}`);
    vscode.window.showInformationMessage("Global hooks path configured.");
 
    // Install pre-commit hook
    const preCommitHookPath = path.join(hooksDir, "pre-commit");
    const preCommitHook = `
#!/bin/bash
# Global pre-commit hook to check for Python installation
 
# Check for Python
if command -v python3 > /dev/null 2>&1; then
    echo "Python3 is available. Commit review feature is enabled."
elif command -v python > /dev/null 2>&1; then
    echo "Python is available. Commit review feature is enabled."
else
    echo "WARNING: Python is not installed. Commit review functionality will not work." >&2
fi
 
# Allow the commit to proceed
exit 0
    `;
    fs.writeFileSync(preCommitHookPath, preCommitHook, { mode: 0o755 });
    vscode.window.showInformationMessage("Pre-commit hook installed.");
 
    // Install post-commit hook
    const postCommitHookPath = path.join(hooksDir, "post-commit");
    const postCommitHook = `
#!/bin/bash
# Global Git post-commit hook with embedded Python logic
if command -v python3 > /dev/null 2>&1; then
    PYTHON_INTERPRETER="python3"
elif command -v python > /dev/null 2>&1; then
    PYTHON_INTERPRETER="python"
else
    echo "Python interpreter not found! Cannot execute post-commit script." >&2
    exit 1
fi
 
$PYTHON_INTERPRETER - <<EOF
import subprocess
import json
import http.client
import urllib.parse
 
def run_command(command):
    result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        raise Exception(f"Error running command: {command}\\n{result.stderr}")
    return result.stdout.strip()
 
try:
    commit_id = run_command("git rev-parse HEAD")
    parent_commit_id = run_command("git rev-parse HEAD^")
    diff_content = run_command(f"git diff {parent_commit_id} {commit_id}")
    commit_message = run_command(f"git log --format=%B -n 1 {commit_id}")
    branch = run_command("git rev-parse --abbrev-ref HEAD")
    username = run_command("git config user.name")
    repo_name = run_command("basename $(git rev-parse --show-toplevel)")
 
    json_payload = json.dumps({
        "diff_content": diff_content,
        "commit_id": commit_id,
        "parent_commit_id": parent_commit_id,
        "username": username,
        "reponame": repo_name,
        "branch": branch,
        "commit_message": commit_message
    })
 
    api_url = "http://localhost:8000/review"
    parsed_url = urllib.parse.urlparse(api_url)
    connection = http.client.HTTPConnection(parsed_url.hostname, parsed_url.port)
    headers = {"Content-Type": "application/json"}
    connection.request("POST", parsed_url.path, body=json_payload, headers=headers)
    response = connection.getresponse()
    print(f"API call made for commit: {commit_id}")
    print(f"Response status code: {response.status}")
    print(f"Response body: {response.read().decode()}")
 
except Exception as e:
    print(f"Error: {e}")
EOF
exit 0
    `;
    fs.writeFileSync(postCommitHookPath, postCommitHook, { mode: 0o755 });
    vscode.window.showInformationMessage("Post-commit hook installed.");
 
    vscode.window.showInformationMessage(
      "Global Git hooks for commit review have been successfully set up!"
    );
  } catch (error) {
    console.error("Error setting up hooks:", error);
    vscode.window.showErrorMessage(
      `Failed to set up Git hooks for commit review`
    );
  }
}
 
 