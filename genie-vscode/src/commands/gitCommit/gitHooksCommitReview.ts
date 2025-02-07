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
        const hooksDir = path.join(os.homedir(), "hooks-folder");
        const normalizedHooksDir = hooksDir.replace(/\//g, path.sep); // Correct path separator for current OS
        if (!fs.existsSync(hooksDir)) {
            fs.mkdirSync(hooksDir, { recursive: true });
            vscode.window.showInformationMessage("Hooks directory created.");
        } else {
            // Delete the folder if it exists
            fs.rmSync(hooksDir, { recursive: true, force: true });
            // vscode.window.showInformationMessage("Hooks directory deleted.");
            // Recreate the hooks folder
            fs.mkdirSync(hooksDir, { recursive: true });
            // console.log(`Created new hooks folder at: ${hooksDir}`);
            vscode.window.showInformationMessage("Hooks directory created");
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
 
# Save the JSON payload to a temporary file
json_file=$(mktemp)
echo "$json_payload" > "$json_file"
 
 
# Send the JSON payload to the API from the temporary file
response=$(curl -s -X POST -H "Content-Type: application/json" -d @"$json_file" "$api_url")
 
# Clean up the temporary file
rm "$json_file"
 
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
   "user_id": "${userId}"
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
# Extract commit review details
commit_quality=$(echo "$response" | $python_cmd -c "import json, sys; data = json.loads(sys.stdin.read()); print(data.get('quality', ''))")
commit_remarks=$(echo "$response" | $python_cmd -c "import json, sys; data = json.loads(sys.stdin.read()); print(data.get('remarks', ''))")
commit_severity=$(echo "$response" | $python_cmd -c "import json, sys; data = json.loads(sys.stdin.read()); print(data.get('overallSeverity', ''))")
 
# Extract issues details using Python
issues=$(echo "$response" | $python_cmd -c "import json, sys; data = json.loads(sys.stdin.read()); print(json.dumps(data.get('issues', [])))")
 
# Prepare issue rows
issue_rows=""
while IFS= read -r issue; do
    identification=$(echo "$issue" | $python_cmd -c "import json, sys; from html import escape; print(escape(json.loads(sys.stdin.read())['identification']))")
    explanation=$(echo "$issue" | $python_cmd -c "import json, sys; from html import escape; print(escape(json.loads(sys.stdin.read())['explanation']))")
    severity=$(echo "$issue" | $python_cmd -c "import json, sys; print(json.loads(sys.stdin.read())['severity'])")
    fix=$(echo "$issue" | $python_cmd -c "import json, sys; from html import escape; print(escape(json.loads(sys.stdin.read())['fix']))")
 
    issue_rows+="<tr><td>$identification</td><td>$explanation</td><td class='severity-$severity'>$severity</td><td>$fix</td></tr>"
done < <(echo "$issues" | $python_cmd -c "import json, sys; data = json.loads(sys.stdin.read()); [print(json.dumps(i)) for i in data]")
 
# Generate an HTML file
html_file=$(mktemp --suffix=.html 2>/dev/null || mktemp -t commit_review.html)
cat > "$html_file" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Commit Review</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.4/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.4/vfs_fonts.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
<style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f2f0f0;
            color: #333;
            margin: 0;
            padding: 10px;
            box-sizing: border-box;
        }
        h2, h3 {
            color: #07439C;
        }
        .header {
            border-bottom: 1px solid #07439C;
            margin-bottom: 10px;
            padding-bottom: 5px;
        }
        .table-container {
            overflow-x: auto; /* Add horizontal scroll for small screens */
        }
        table {
            width: 100%;
            max-width: 100%; /* Ensure table doesn't exceed container width */
            border-collapse: collapse;
            margin: 10px 0;
        }
        th, td {
            text-align: left;
            padding: 8px;
            border: 1px solid #ddd;
        }
        th {
            background-color: #07439C;
            color: white;
        }
        /* Add specific styling for the Remarks column */
        th.remarks, td.remarks {
            width: 800px; /* Adjust the width as needed */
            white-space: nowrap; /* Prevent text wrapping */
            overflow: hidden; /* Ensure content doesn't overflow */
            text-overflow: ellipsis; /* Add ellipsis if text overflows */
        }
        td.identification {
            max-width: 300px; /* Set a maximum width for the column */
            overflow-x: auto; /* Enable horizontal scrolling */
            white-space: nowrap; /* Prevent wrapping */
            scrollbar-color: white lightgray; /* Thumb color and track color */
            scrollbar-width: thin; /* Makes the scrollbar thinner */
        }
        td.pre-formatted {
            max-width: 100px;
            word-wrap: break-word;
        }
        td.explanation, td.fix {
            max-width: 100px;
            word-wrap: break-word;
        }
        .severity-critical {
            color: red;
        }
        .severity-minor {
            color: orange;
        }
        .severity-major {
            color: red;
        }
        .severity-cosmetic {
            color: blue;
        }
        button.download-btn {
            padding: 5px 10px;
            background-color: #07439C;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button.download-btn:hover {
            background-color: #035f99;
        }
</style>
</head>
<body>
<div class="header">
        <h2>Commit Review</h2>
        
    </div>
    
<div id="content">
    
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
                <h3>Summary:</h3>
            </div>
            <div>
                <button id="downloadButton" class="download-btn">Download as PDF</button>
                
            </div>
            
        </div>
        
        
<table>
    <tr>
        <th>Quality</th>
        <th>Remarks</th>
        <th>Overall Severity</th>
    </tr>
    <tr>
        <td>$commit_quality</td>
        <td>$commit_remarks</td>
        <td>$commit_severity</td>
    </tr>
</table>
 
<div id="content">
    
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
                <h3>Issues Identified:</h3>
            </div>         
</div>
<table>
    <tr>
        <th>Issue</th>
        <th>Explanation</th>
        <th>Severity</th>
        <th>Suggested Fix</th>
    </tr>
    $issue_rows
</table>
</div>
<script>
    document.getElementById("downloadButton").addEventListener("click", () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        .replace(' ', '_')
        .replace(',', ''); // Convert "06 Feb 2025" to "06_Feb_2025"
 
        const fileName = 'commit_review_' + formattedDate + '.pdf';
        const issues = $issues;
        
        const docDefinition = {
            pageOrientation: 'landscape',
            content: [
                { text: 'Commit Review', style: 'header' },
                { text: 'Summary:', style: 'subheader' },
                {
                    table: {
                        widths: ['25%', '50%', '25%'],
                        body: [
                            [{ text: 'Quality',fillColor: '#E9E5E5', bold: true ,alignment: 'center'}, { text: 'Remarks', fillColor: '#E9E5E5',bold: true,alignment: 'center' }, { text: 'Overall Severity',fillColor: '#E9E5E5', bold: true,alignment: 'center' }],
                            [
                                { text: '$commit_quality', alignment: 'center' },
                                { text: '$commit_remarks', alignment: 'center' },
                                { text: '$commit_severity', alignment: 'center' }
                            ]
                        ]
                    }
                },
                { text: 'Issues Identified:', style: 'subheader' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['5%', '20%', '40%', '10%', '25%'],
                        body: [
                            [
                                { text: 'S.No',fillColor: '#E9E5E5', bold: true ,alignment: 'center'},
                                { text: 'Issue',fillColor: '#E9E5E5', bold: true ,alignment: 'center'},
                                { text: 'Explanation',fillColor: '#E9E5E5', bold: true ,alignment: 'center' },
                                { text: 'Severity',fillColor: '#E9E5E5', bold: true, alignment: 'center' },
                                { text: 'Suggested Fix',fillColor: '#E9E5E5', bold: true, alignment: 'center' }
                            ],
                            ...issues.map((issue, index) => [
                                { text: index + 1, fontSize: 10, alignment: 'center' },
                                { text: issue.identification, fontSize: 10 },
                                { text: issue.explanation, fontSize: 10 },
                                { text: issue.severity, fontSize: 10, alignment: 'center' },
                                { text: issue.fix, fontSize: 10 }
                            ])
                        ]
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5]
                }
            }
        };
 
        pdfMake.createPdf(docDefinition).download(fileName);
    });
</script>
</body>
</html>
EOF
# Open the HTML file in the default browser and bring it to the foreground
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "$html_file" &  
    sleep 1  
    wmctrl -a "$(basename "$html_file")" 2>/dev/null || echo "Switch manually."
elif [[ "$OSTYPE" == "darwin"* ]]; then
    open "$html_file"
    sleep 1  
    osascript -e 'tell application "Google Chrome" to activate' 2>/dev/null ||     osascript -e 'tell application "Safari" to activate' 2>/dev/null ||     echo "Switch manually."
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    start "" "$html_file"
    sleep 1  
    powershell -Command "(New-Object -ComObject WScript.Shell).AppActivate('chrome')"
else
    echo "Unsupported OS. Open the file manually: $html_file"
fi  
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
 
 
 
 