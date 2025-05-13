import axios from "axios";
import { getBaseApi } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";

interface JobStatusResponse {
  status: string;
  Status_display: string;
}

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
      signal: options?.signal,
    }
  );
  return response.data;
}

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
    throw new Error(error.response?.data?.detail || error.message || "Failed to fetch status");
  }
}

export async function downloadMarkdown(JobID: string, authToken: string): Promise<string> {
  const apiUrl = `${getBaseApi()}/assistant/repo-documentation/download/${JobID}`;
  try {
    const response = await axios.get(apiUrl, {
      headers: getAuthHeaders(authToken),
    });
    return response.data;
  } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || "Failed to download markdown");
  }
}


export async function cancelRepoDocumentation(jobID: string, authToken: string): Promise<void> {
  const apiUrl = `${getBaseApi()}/assistant/repo-documentation/cancel`;
  try {
    await axios.post(
      apiUrl,
      { JobID: jobID },
      { headers: getAuthHeaders(authToken) }
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to cancel the request");
  }
}