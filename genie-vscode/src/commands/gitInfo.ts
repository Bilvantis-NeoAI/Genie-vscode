// utils/gitInfo.ts
import { exec } from "child_process";
import { promisify } from "util";

// Utility function to execute shell commands asynchronously
const execAsync = promisify(exec);

export async function getGitInfo(workspacePath: string) {
  try {
    // Retrieve Git repository path
    const { stdout: gitRepoPath } = await execAsync("git rev-parse --show-toplevel", { cwd: workspacePath });

    // Retrieve the current branch name
    const { stdout: branchName } = await execAsync("git rev-parse --abbrev-ref HEAD", { cwd: gitRepoPath.trim() });

    // Retrieve Git remote URL
    // const { stdout: gitRemoteUrl } = await execAsync("git remote get-url origin", { cwd: gitRepoPath.trim() });

    // Clean and extract relevant information
    const gitPath = gitRepoPath.trim();
    const branch_name = branchName.trim();
    const project_name = gitPath.split(/[\\/]/).pop();
    // const remoteUrl = gitRemoteUrl.trim();

    // Return all the git information as an object
    // return { gitPath, branch, project, remoteUrl };
    return { project_name, branch_name };
  } catch (error) {
    console.error("Error retrieving Git information:", error);
    throw new Error("Unable to fetch Git information.");
  }
}
