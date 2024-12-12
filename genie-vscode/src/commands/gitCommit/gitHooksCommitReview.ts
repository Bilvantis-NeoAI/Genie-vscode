import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { execSync } from 'child_process';
import { BASE_API } from "../../auth/config";
export function gitHooksCommitReview(context: vscode.ExtensionContext, authToken: string): void {
    // console.log("Git Hooks Commit Review extension is now active!");
    // vscode.window.showInformationMessage("Git Hooks Commit Review extension is now active!");
   
    try {
        // Create the hooks folder path
        const hooksDir = path.join(require("os").homedir(), "hooks-folder");
        // Ensure path uses backslashes on Windows
        const normalizedHooksDir = hooksDir.replace(/\//g, '\\');  
 
        if (!fs.existsSync(hooksDir)) {
            fs.mkdirSync(hooksDir, { recursive: true });
            vscode.window.showInformationMessage("Hooks directory created.");
        }
 
        // Set Git global hooks path
        execSync(`git config --global core.hooksPath ${normalizedHooksDir}`);
 
        // Run Set-ExecutionPolicy command using PowerShell
        const setExecutionPolicyCommand = `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force`;
        execSync(`powershell -Command "${setExecutionPolicyCommand}"`, { stdio: 'inherit' });
        // vscode.window.showInformationMessage("Git global hooks path configured and execution policy set.");
 
        // Create and write pre-commit hook
        const preCommitScript = `#!/bin/bash
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
        fs.writeFileSync(path.join(normalizedHooksDir, "pre-commit"), preCommitScript, { mode: 0o755 });
        vscode.window.showInformationMessage("Pre-commit hook installed.");
const postCommitScript=`#!/bin/bash
# Encryption key (must match the decryption key on the API)
ENCRYPTION_KEY="my_secret_key"
 
# Generate encrypted diff content
encrypt_diff_content() {
    echo -n "$1" | openssl enc -aes-256-cbc -a -salt -pass pass:"$ENCRYPTION_KEY"
}
 
# Check for Python availability
if command -v python3 > /dev/null 2>&1; then
    PYTHON_INTERPRETER="python3"
elif command -v python > /dev/null 2>&1; then
    PYTHON_INTERPRETER="python"
else
    echo "Python interpreter not found! Cannot execute post-commit script." >&2
    exit 1
fi
 
# Get commit details using Git commands
commit_id=$(git rev-parse HEAD)
parent_commit_id=$(git rev-parse HEAD^)
diff_content=$(git diff "$parent_commit_id" "$commit_id")
commit_message=$(git log --format=%B -n 1 "$commit_id")
branch=$(git rev-parse --abbrev-ref HEAD)
username=$(git config user.name)
repo_name=$(git config --get remote.origin.url | sed 's#.*/##;s/.git//')
 
# Validate mandatory fields
if [[ -z "$diff_content" ]]; then
    diff_content="No changes detected"
fi
 
if [[ -z "$commit_message" ]]; then
    commit_message="No commit message provided"
fi
 
# Encrypt diff_content and commit_message
encrypted_diff_content=$(encrypt_diff_content "$diff_content")
encrypted_message=$(encrypt_diff_content "$commit_message")
 
# Escape special characters in commit_message using Python
escaped_commit_message=$(printf '%s' "$commit_message" | python -c "import json, sys; print(json.dumps(sys.stdin.read()))")
escaped_diff_content=$(printf '%s' "$diff_content" | python -c "import json, sys; print(json.dumps(sys.stdin.read()))")

# Prepare the JSON payload
json_payload=$(cat <<EOF
{
    "diff_content": $escaped_diff_content,
    "commit_id": "$commit_id",
    "parent_commit_id": "$parent_commit_id",
    "username": "$username",
    "reponame": "$repo_name",
    "branch": "$branch",
    "commit_message": $escaped_commit_message
}
EOF
)

# Use the BASE_API environment variable
echo "Using BASE_API: $BASE_API"
# Use BASE_API in the URL
api_url="${BASE_API}/review/commit-review"
response=$(curl -s -X POST -H "Content-Type: application/json" -d "$json_payload" "$api_url")
 
# Output the response from the API
echo "API response for commit $commit_id: $response"
echo "$response" | python -m json.tool
 
exit 0
 `;
 
        fs.writeFileSync(path.join(normalizedHooksDir, "post-commit"), postCommitScript, { mode: 0o755 });
        vscode.window.showInformationMessage("Post-commit hook installed.");
 
    } catch (error) {
        console.error("Error setting up hooks:", error);
        vscode.window.showErrorMessage("Failed to set up Git hooks for commit review");
    }
}
 
export function deactivate() {}
 
 