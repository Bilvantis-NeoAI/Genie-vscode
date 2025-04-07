import axios from "axios";
// import { BASE_API } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";
import { ANSWER_CONFIG } from "../../auth/config";
// import { KB_BASE_API } from "../../auth/config";
import { getKbBaseApi } from "../../auth/config";

const answer_config = ANSWER_CONFIG;

export async function knowledgeBaseQA(
  question: string,
  answer_config: string,
  authToken: string,
  options?: { signal?: AbortSignal }
): Promise<any> {
  // Create a new FormData instance
  const formData = new FormData();
  formData.append("question", question);
  formData.append("answer_config", answer_config);

  const response = await axios.post(`${getKbBaseApi()}/answer`, formData, {
    headers: {
      ...getAuthHeaders(authToken),
      "Content-Type": "multipart/form-data", // Ensure proper content type for form data
    },
    signal: options?.signal,
  });
  // console.log("*****", response);
  
  return response.data;
}
