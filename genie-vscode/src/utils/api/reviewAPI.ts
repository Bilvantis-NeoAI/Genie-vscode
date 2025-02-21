import axios from "axios";
import { getBaseApi  } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";

export async function postAllReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/review`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}
 