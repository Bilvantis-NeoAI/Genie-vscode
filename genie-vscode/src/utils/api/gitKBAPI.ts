import axios from "axios";
// import { BASE_API } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";
// import { GITKB_BASE_API } from "../../auth/config";
import { getGitKbApi } from "../../auth/config";

// const BASE_URL = "http://localhost:9000";

export async function postQueAnsRepositoryGitKB(question: string, authToken: string, options?: { signal?: AbortSignal }): Promise<any> {  
    const response = await axios.post(
      `${getGitKbApi()}/explain`,
      { question },
      {
        headers: getAuthHeaders(authToken),
        signal: options?.signal,
      }
    );
    return response.data;
  }

  export async function postGetCodeGitKB(question: string, authToken: string, options?: { signal?: AbortSignal }): Promise<any> {
    const response = await axios.post(
      `${getGitKbApi()}/get_code`,
      { question },
      {
        headers: getAuthHeaders(authToken),
        signal: options?.signal,
      }
    );
    return response.data;
  }