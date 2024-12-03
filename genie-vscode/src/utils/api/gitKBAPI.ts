import axios from "axios";
// import { BASE_API } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";

const BASE_URL = "http://localhost:9000";

export async function postQueAnsRepositoryGitKB(q: string, authToken: string): Promise<any> {
    const response = await axios.post(
      `${BASE_URL}/qa_git`,
      { q },
      {
        headers: getAuthHeaders(authToken),
      }
    );
    return response.data;
  }