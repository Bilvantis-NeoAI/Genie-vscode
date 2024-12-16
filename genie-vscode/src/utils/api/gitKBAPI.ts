import axios from "axios";
// import { BASE_API } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";
import { GITKB_BASE_API } from "../../auth/config";

// const BASE_URL = "http://localhost:9000";

export async function postQueAnsRepositoryGitKB(question: string, authToken: string): Promise<any> {
  console.log("**** explain: ", GITKB_BASE_API);
  
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
    console.log("**** get_code: ", GITKB_BASE_API);
    const response = await axios.post(
      `${GITKB_BASE_API}/get_code`,
      { question },
      {
        headers: getAuthHeaders(authToken),
      }
    );
    return response.data;
  }