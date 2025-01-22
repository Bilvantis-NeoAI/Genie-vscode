import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { execSync } from 'child_process';
import * as os from 'os';
import { BASE_API } from "../../auth/config";
import { userId } from '../../extension';
 
// Function to detect the current OS
function detectOS() {
    const platform = os.platform();
 
    // Return OS type as a string
    switch (platform) {
        case 'win32':
            return 'windows';
        case 'darwin':
            return 'mac';
        case 'linux':
            return 'linux';
        default:
            return 'unknown';
    }
}
 
// Function to handle OS-specific configurations
function configureForOS(osType: string) {
    switch (osType) {
        case 'windows':
            // Set execution policy on Windows using PowerShell
            const setExecutionPolicyCommand = `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force`;
            execSync(`powershell -Command "${setExecutionPolicyCommand}"`, { stdio: 'ignore' });
            break;
        case 'mac':
        case 'linux':
            // No additional configuration needed for macOS/Linux
            break;
        default:
            console.error("Unknown OS. Please ensure this platform is supported.");
            break;
    }
}
 
// Main function to set up Git hooks
export function gitHooksCommitReview(): void {
    try {
        // Create the hooks folder path
       
 
        console.log("user id exported",userId);
        const hooksDir = path.join(os.homedir(), "hooks-folder");
        const normalizedHooksDir = hooksDir.replace(/\//g, path.sep); // Correct path separator for current OS
 
       
 
        if (!fs.existsSync(hooksDir)) {
            fs.mkdirSync(hooksDir, { recursive: true });
            vscode.window.showInformationMessage("Hooks directory created.");
        } else {
            console.log("Hooks directory already exists.");
        }
 
        // Set Git global hooks path
        execSync(`git config --global core.hooksPath ${normalizedHooksDir}`);
 
        // Detect OS and apply platform-specific configurations
        const osType = detectOS();
        configureForOS(osType);
 
        // Create and write pre-commit hook
        const preCommitScript = `#!/bin/bash
 
# Global pre-commit hook to check for Python installation
 
if command -v python3 > /dev/null 2>&1; then
   python_cmd="python3"
elif command -v python > /dev/null 2>&1; then
   python_cmd="python"
else
   echo "WARNING: Python3 is not installed. Commit review functionality will not work." >&2
   exit 1
fi
 
# Get staged files
staged_files=$(git diff $(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@') --cached --name-only)
diff_content=$(git diff $(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@') --cached)
repo_name=$(git config --get remote.origin.url | sed 's#.*/##;s/.git//')
 
if [[ -z "$staged_files" ]]; then
    echo "No files staged for commit."
    exit 0
fi
 
# Convert staged files to JSON array
staged_files_json=$(printf '%s\n' "$staged_files" | sed 's/^/"/; s/$/"/' | paste -sd, - | sed 's/^/[/' | sed 's/$/]/')
 
 
# Escape diff content properly for JSON
if command -v python3 > /dev/null 2>&1; then
    escaped_diff_content=$(printf '%s' "$diff_content" | python3 -c "import json, sys; print(json.dumps(sys.stdin.read()))")
elif command -v python > /dev/null 2>&1; then
    escaped_diff_content=$(printf '%s' "$diff_content" | python -c "import json, sys; print(json.dumps(sys.stdin.read()))")
fi
 
# Prepare the JSON payload
json_payload=$(cat <<EOF
{
    "staged_files": $staged_files_json,
    "diff_content": $escaped_diff_content,
    "reponame": "$repo_name",
    "user_id": "${userId}"
}
EOF
)
 
api_url="${BASE_API}/review/commit-scan"
 
# Send the JSON payload to the API
response=$(curl -s -X POST -H "Content-Type: application/json" -d "$json_payload" "$api_url" )
 
# Check if the response is received
if [[ -z "$response" ]]; then
    echo "ERROR: An unexpected error occurred while communicating with the server. Please verify your internet connection or consider the possibility of an internal server issue." >&2
    exit 1
fi
 
# Extract values from the raw response using the selected Python interpreter
has_secrets=$($python_cmd -c "import json, sys; data = json.loads(sys.stdin.read()); print(data.get('has_secrets', 'false'))" <<< "$response")
has_disallowed_files=$($python_cmd -c "import json, sys; data = json.loads(sys.stdin.read()); print(data.get('has_disallowed_files', 'false'))" <<< "$response")
files_disallowed=$($python_cmd -c "import json, sys; data = json.loads(sys.stdin.read()); print(', '.join(data.get('files_disallowed', [])))" <<< "$response")
list_secrets_found=$($python_cmd -c "
import json, sys
data = json.loads(sys.stdin.read())
secrets = [
    f\\"{item['filename']} - Pattern: {item['pattern']} - Entropy: High - Line: {item['line_num']} - Content: {item['line_content']}\\"
    for item in data.get('list_secrets_found', [])
]
print('\\n'.join(secrets))
" <<< "$response")
 
 
 
# Convert boolean values to numeric (0 for false, 1 for true)
secrets_found_num=$([[ "$has_secrets" == "true" ]] && echo 1 || echo 0)
disallowed_files_found_num=$([[ "$has_disallowed_files" == "true" ]] && echo 1 || echo 0)
# Abort commit if any disallowed files are detected
if [[ "$has_disallowed_files" == "True" ]]; then
    echo -e "Commit aborted due to disallowed files detected."
    echo -e "The following disallowed files were detected:"
    echo -e "$files_disallowed"
    exit 1
fi
# Handle secrets detection
if [[ "$has_secrets" == "True" ]]; then
    echo -e "Secrets were detected in the staged files."
    if [[ -n "$list_secrets_found" ]]; then
        echo -e "The following secrets were found in the diff content:"
        echo -e "$list_secrets_found"
    fi
    # Ask the user to confirm the commit despite secrets, only once
    echo -n "Do you want to proceed with the commit despite the detected secrets? (Y/N): "
    read user_input < /dev/tty
    case "$user_input" in
        [Yy]*)
            echo "Proceeding with commit."
            ;;
        [Nn]*)
            echo "Commit aborted by user."
            exit 1
            ;;
        *)
            echo "Invalid input. Commit aborted."
            exit 1
            ;;
    esac
fi
exit 0
        `;
        fs.writeFileSync(path.join(normalizedHooksDir, "pre-commit"), preCommitScript, { mode: 0o755 });
 
        // Create and write post-commit hook
        const postCommitScript = `#!/bin/bash
 
# Get commit details using Git commands
commit_id=$(git rev-parse HEAD)
default_branch=$(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@')
default_branch_commit=$(git rev-parse origin/"$default_branch")
diff_content=$(git diff "$default_branch_commit" "$commit_id")
commit_message=$(git log --format=%B -n 1 "$commit_id")
branch=$(git rev-parse --abbrev-ref HEAD)
username=$(git config user.name)
repo_name=$(git config --get remote.origin.url | sed 's#.*/##;s/.git//')
num_files_lines_changed=$(git diff --shortstat "$default_branch_commit" "$commit_id")
files_changed=$(git diff --name-only "$default_branch_commit" "$commit_id")
# Validate diff content
if [[ -z "$diff_content" ]]; then
   diff_content="No changes detected compared to the default branch ($default_branch)"
fi
if [[ -z "$commit_message" ]]; then
   commit_message="No commit message provided"
fi
if [ -z "$files_changed" ]; then
 files_changed="No files changed"
fi
 
if command -v python3 > /dev/null 2>&1; then
    python_cmd="python3"
elif command -v python > /dev/null 2>&1; then
    python_cmd="python"
else
    exit 1
fi
 
# Function to escape special characters using Python
escape_string() {
   local input="$1"
   echo "$input" | $python_cmd -c "import json, sys; print(json.dumps(sys.stdin.read()))"
}
 
# Escape special characters in variables
escaped_commit_message=$(escape_string "$commit_message")
escaped_diff_content=$(escape_string "$diff_content")
escaped_num_files_lines_changed=$(escape_string "$num_files_lines_changed")
escaped_files_changed=$(escape_string "$files_changed")
 
# Prepare the JSON payload
json_payload=$(cat <<EOF
{
   "diff_content": $escaped_diff_content,
   "num_files_lines_changed": $escaped_num_files_lines_changed,
   "commit_id": "$commit_id",
   "default_branch_commit": "$default_branch_commit",
   "username": "$username",
   "reponame": "$repo_name",
   "branch": "$branch",
   "commit_message": $escaped_commit_message,
   "files_changed": $escaped_files_changed,
   "user_id": "67498e2eb96484d566d74a46"
}
EOF
)

# Save the JSON payload to a temporary file
json_file=$(mktemp)
echo "$json_payload" > "$json_file"


 
# Use the BASE_API environment variable
api_url="${BASE_API}/review/commit-review"
# Use the JSON file in the curl request
response=$(curl -s -X POST -H "Content-Type: application/json" -d @"$json_file" "$api_url")

# Clean up the temporary file
rm "$json_file"
 
# Check if the response is received
if [[ -z "$response" ]]; then
    echo "ERROR: An unexpected error occurred while communicating with the server. Please verify your internet connection or consider the possibility of an internal server issue." >&2
    exit 1
fi
 
# Extract commit details using Python and string concatenation
commit_quality=$(echo "$response" | $python_cmd -c "import json, sys; data = json.loads(sys.stdin.read()); print(data['review'].get('quality', ''))")
commit_remarks=$(echo "$response" | $python_cmd -c "import json, sys; data = json.loads(sys.stdin.read()); print(data['review'].get('remarks', ''))")
commit_severity=$(echo "$response" | $python_cmd -c "import json, sys; data = json.loads(sys.stdin.read()); print(data['review'].get('overallSeverity', ''))")
 
# Print the results
echo " "
echo "**********************"
echo "----------------------"
echo "Commit Review Summary:"
echo "----------------------"
echo "Quality: $commit_quality"
echo "Remarks: $commit_remarks"
echo "Overall Severity: $commit_severity"
 
# Display the issues in a structured format using string concatenation
echo ""
echo "Issues Identified:"
echo "-------------------"
 
# Iterate over issues and display each one using string concatenation
echo "$response" | $python_cmd -c "
import json, sys
data = json.loads(sys.stdin.read())
for issue in data['review']['issues']:
    print('Identification: ' + issue['identification'])
    print('Explanation: ' + issue['explanation'])
    print('Severity: ' + issue['severity'])
    print('Suggested Fix: ' + issue['fix'])
    print('-' * 20)
"   
        `;
        fs.writeFileSync(path.join(normalizedHooksDir, "post-commit"), postCommitScript, { mode: 0o755 });
        vscode.window.showInformationMessage("Pre-commit & Post-commit hook installed.");
    } catch (error) {
        console.error("Error setting up hooks:", error);
        vscode.window.showErrorMessage("Failed to set up Git hooks for commit review");
        console.error("Error: ", error);
    }
}
 
export function deactivate() {}
 
 