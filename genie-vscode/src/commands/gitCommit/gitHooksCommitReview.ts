// import * as fs from 'fs';
// import * as path from 'path';
// import * as vscode from 'vscode';
// import { execSync } from 'child_process';
// import * as os from 'os';
// import { BASE_API } from "../../auth/config";

// // Function to detect the current OS
// function detectOS() {
//     const platform = os.platform();

//     // Return OS type as a string
//     switch (platform) {
//         case 'win32':
//             return 'windows';
//         case 'darwin':
//             return 'mac';
//         case 'linux':
//             return 'linux';
//         default:
//             return 'unknown';
//     }
// }

// // Function to handle OS-specific configurations
// function configureForOS(osType: string) {
//     switch (osType) {
//         case 'windows':
//             // Set execution policy on Windows using PowerShell
//             const setExecutionPolicyCommand = `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force`;
//             execSync(`powershell -Command "${setExecutionPolicyCommand}"`, { stdio: 'ignore' });
//             break;
//         case 'mac':
//         case 'linux':
//             // No additional configuration needed for macOS/Linux
//             break;
//         default:
//             console.error("Unknown OS. Please ensure this platform is supported.");
//             break;
//     }
// }

// // Main function to set up Git hooks
// export function gitHooksCommitReview(): void {
//     try {
//         // Create the hooks folder path
//         const hooksDir = path.join(os.homedir(), "hooks-folder");
//         const normalizedHooksDir = hooksDir.replace(/\//g, path.sep); // Correct path separator for current OS

//         if (!fs.existsSync(hooksDir)) {
//             fs.mkdirSync(hooksDir, { recursive: true });
//             vscode.window.showInformationMessage("Hooks directory created.");
//         } else {
//             console.log("Hooks directory already exists.");
//         }

//         // Set Git global hooks path
//         execSync(`git config --global core.hooksPath ${normalizedHooksDir}`);

//         // Detect OS and apply platform-specific configurations
//         const osType = detectOS();
//         configureForOS(osType);

//         // Create and write pre-commit hook
//         const preCommitScript = `#!/bin/bash
// # Global pre-commit hook to check for Python installation
// # Check for Python
// if command -v python3 > /dev/null 2>&1; then
//     echo "Python3 is available. Commit review feature is enabled."
// elif command -v python > /dev/null 2>&1; then
//     echo "Python is available. Commit review feature is enabled."
// else
//     echo "WARNING: Python3 is not installed. Commit review functionality will not work." >&2
// fi
// # Allow the commit to proceed
// exit 0
//         `;
//         fs.writeFileSync(path.join(normalizedHooksDir, "pre-commit"), preCommitScript, { mode: 0o755 });

//         // Create and write post-commit hook
//         const postCommitScript = `#!/bin/bash
// # Encryption key (must match the decryption key on the API)
// ENCRYPTION_KEY="my_secret_key"

// # Generate encrypted diff content
// encrypt_diff_content() {
//     echo -n "$1" | openssl enc -aes-256-cbc -a -salt -pass pass:"$ENCRYPTION_KEY"
// }

// # Get commit details using Git commands
// commit_id=$(git rev-parse HEAD)
// parent_commit_id=$(git rev-parse HEAD^)
// diff_content=$(git diff "$parent_commit_id" "$commit_id")
// commit_message=$(git log --format=%B -n 1 "$commit_id")
// branch=$(git rev-parse --abbrev-ref HEAD)
// username=$(git config user.name)
// repo_name=$(git config --get remote.origin.url | sed 's#.*/##;s/.git//')

// # Validate mandatory fields
// if [[ -z "$diff_content" ]]; then
//     diff_content="No changes detected"
// fi

// if [[ -z "$commit_message" ]]; then
//     commit_message="No commit message provided"
// fi

// # Encrypt diff_content and commit_message
// encrypted_diff_content=$(encrypt_diff_content "$diff_content")
// encrypted_message=$(encrypt_diff_content "$commit_message")

// # Escape special characters in commit_message using Python
// if command -v python3 > /dev/null 2>&1; then
//     escaped_commit_message=$(printf '%s' "$commit_message" | python3 -c "import json, sys; print(json.dumps(sys.stdin.read()))")
//     escaped_diff_content=$(printf '%s' "$diff_content" | python3 -c "import json, sys; print(json.dumps(sys.stdin.read()))")
// elif command -v python > /dev/null 2>&1; then
//     escaped_commit_message=$(printf '%s' "$commit_message" | python -c "import json, sys; print(json.dumps(sys.stdin.read()))")
//     escaped_diff_content=$(printf '%s' "$diff_content" | python -c "import json, sys; print(json.dumps(sys.stdin.read()))")
// fi


// # Prepare the JSON payload
// json_payload=$(cat <<EOF
// {
//     "diff_content": $escaped_diff_content,
//     "commit_id": "$commit_id",
//     "parent_commit_id": "$parent_commit_id",
//     "username": "$username",
//     "reponame": "$repo_name",
//     "branch": "$branch",
//     "commit_message": $escaped_commit_message
// }
// EOF
// )

// # Use the BASE_API environment variable
// echo "Using BASE_API: $BASE_API"
// # Use BASE_API in the URL
// api_url="${BASE_API}/review/commit-review"
// response=$(curl -s -X POST -H "Content-Type: application/json" -d "$json_payload" "$api_url")

// # Output the response from the API
// echo "API response for commit $commit_id: $response"
// if command -v python3 > /dev/null 2>&1; then
//     echo "$response" | python3 -m json.tool
// elif command -v python > /dev/null 2>&1; then
//     echo "$response" | python -m json.tool
// fi

// exit 0
//         `;
//         fs.writeFileSync(path.join(normalizedHooksDir, "post-commit"), postCommitScript, { mode: 0o755 });
//         vscode.window.showInformationMessage("Pre-commit & Post-commit hook installed.");
//     } catch (error) {
//         console.error("Error setting up hooks:", error);
//         vscode.window.showErrorMessage("Failed to set up Git hooks for commit review");
//         console.error("Error: ", error);
//     }
// }

// export function deactivate() {}



import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { execSync } from 'child_process';
import * as os from 'os';
import { BASE_API } from "../../auth/config";

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
# Check for Python
if command -v python3 > /dev/null 2>&1; then
    echo "Python3 is available. Commit review feature is enabled."
elif command -v python > /dev/null 2>&1; then
    echo "Python is available. Commit review feature is enabled."
else
    echo "WARNING: Python3 is not installed. Commit review functionality will not work." >&2
fi
# Allow the commit to proceed
exit 0
        `;
        fs.writeFileSync(path.join(normalizedHooksDir, "pre-commit"), preCommitScript, { mode: 0o755 });

        // Create and write post-commit hook
        const postCommitScript = `#!/bin/bash
# Encryption key (must match the decryption key on the API)
ENCRYPTION_KEY="my_secret_key"
# Generate encrypted diff content
encrypt_diff_content() {
    echo -n "$1" | openssl enc -aes-256-cbc -a -salt -pass pass:"$ENCRYPTION_KEY"
}
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
user_id=
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
# Encrypt diff_content and commit_message
encrypted_diff_content=$(encrypt_diff_content "$diff_content")
encrypted_message=$(encrypt_diff_content "$commit_message")
# Escape special characters in commit_message using Python
if command -v python3 > /dev/null 2>&1; then
    escaped_commit_message=$(printf '%s' "$commit_message" | python3 -c "import json, sys; print(json.dumps(sys.stdin.read()))")
    escaped_diff_content=$(printf '%s' "$diff_content" | python3 -c "import json, sys; print(json.dumps(sys.stdin.read()))")
    escaped_num_files_lines_changed=$(printf '%s' "$num_files_lines_changed" | python3 -c "import json, sys; print(json.dumps(sys.stdin.read()))")
    escaped_files_changed=$(printf '%s' "$files_changed" | python3 -c "import json, sys; print(json.dumps(sys.stdin.read()))")
elif command -v python > /dev/null 2>&1; then
    escaped_commit_message=$(printf '%s' "$commit_message" | python -c "import json, sys; print(json.dumps(sys.stdin.read()))")
    escaped_diff_content=$(printf '%s' "$diff_content" | python -c "import json, sys; print(json.dumps(sys.stdin.read()))")
    escaped_num_files_lines_changed=$(printf '%s' "$num_files_lines_changed" | python -c "import json, sys; print(json.dumps(sys.stdin.read()))")
    escaped_files_changed=$(printf '%s' "$files_changed" | python -c "import json, sys; print(json.dumps(sys.stdin.read()))")
fi
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
    "files_changed": $escaped_files_changed
}
EOF
)
# Use the BASE_API environment variable
echo "Using BASE_API: $BASE_API"
api_url="http://0.0.0.0:3000/review/commit-review"
response=$(curl -s -X POST -H "Content-Type: application/json" -d "$json_payload" "$api_url")
# Output the response from the API in a readable structure
commit_quality=$(echo "$response" | jq -r '.review.quality')
commit_remarks=$(echo "$response" | jq -r '.review.remarks')
commit_severity=$(echo "$response" | jq -r '.review.overallSeverity')
# Print API response in a simple readable format
echo "Commit Review Summary:"
echo "----------------------"
echo "Quality: $commit_quality"
echo "Remarks: $commit_remarks"
echo "Overall Severity: $commit_severity"
# Display the issues in a structured format
echo ""
echo "Issues Identified:"
echo "-------------------"
# Loop through each issue and display it in a clean, readable format
echo "$response" | jq -r '.review.issues[] | "\(.identification): \(.explanation) (Severity: \(.severity))\nSuggested Fix: \(.fix)"'
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
