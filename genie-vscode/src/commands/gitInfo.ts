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

    // Clean and extract relevant information
    const gitPath = gitRepoPath.trim();
    const branch_name = branchName.trim();
    const project_name = gitPath.split(/[\\/]/).pop();
    return { project_name, branch_name };
  } catch (error) {
    // console.error("Error retrieving Git information:", error);
    // throw new Error("Unable to fetch Git information.");
    // throw new Error("Unable to fetch Git info. Please open the project from the project folder of Git.");
    // const gitPath="NA";
    const branch_name='NA';
    const project_name="NA";
    return { project_name, branch_name};
  }
}

