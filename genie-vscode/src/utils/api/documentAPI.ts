import axios from "axios";
import { getBaseApi } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";

// Define types for the status response (customize based on your actual API response structure)
interface JobStatusResponse {
  status: string;
  Status_display: string;
}

// API call to fetch repository documentation and get the JobID
export async function postRepoDocumentation(
  repo_url: string,
  pat: string,
  branch: string,
  authToken: string,
  options?: { signal?: AbortSignal }
): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/assistant/repo-documentation`,
    { repo_url, branch, pat },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal, // used here
    }
  );
  return response.data;
}

// API call to check the job status
export async function postJobStatus(jobID: string, authToken: string): Promise<JobStatusResponse> {
  const apiUrl = `${getBaseApi()}/assistant/repo-documentation/status`;
  try {
    const response = await axios.post(
      apiUrl,
      { JobID: jobID },
      { headers: getAuthHeaders(authToken) }
    );
    return response.data;
  } catch (error: any) {
    // console.error("Error occurred while calling the API:", error);
    throw new Error(error.response?.data?.detail || error.message || "Failed to fetch status");
  }
}


// ✅ UPDATED: API call to download the generated Markdown using the JobID and authToken
export async function downloadMarkdown(JobID: string, authToken: string): Promise<string> {
  const apiUrl = `${getBaseApi()}/assistant/repo-documentation/download/${JobID}`;
  try {
    const response = await axios.get(apiUrl, {
      headers: getAuthHeaders(authToken),
    });
    return response.data; // assuming it's plain Markdown text
  } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || "Failed to download markdown");
  }
}
