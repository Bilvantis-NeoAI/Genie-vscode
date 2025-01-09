import axios from "axios";
// import { BASE_API } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";
import { GITKB_BASE_API } from "../../auth/config";
import { basename } from "path";

// const BASE_URL = "http://localhost:9000";

export async function postQueAnsRepositoryGitKB(question: string, authToken: string): Promise<any> {  
    const response = await axios.post(
      `${GITKB_BASE_API}/explain`,
      { question },
      {
        headers: getAuthHeaders(authToken),
      }
    );
    return response.data;
  }

  export async function postGetCodeGitKB(question: string, authToken: string): Promise<any> {
    const response = await axios.post(
      `${GITKB_BASE_API}/get_code`,
      { question },
      {
        headers: getAuthHeaders(authToken),
      }
    );
    return response.data;
  }