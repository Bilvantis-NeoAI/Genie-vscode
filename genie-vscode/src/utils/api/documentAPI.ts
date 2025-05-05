import axios from "axios";
import { getBaseApi  } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";

export async function postRepoDocumentation(
   repo_url: string,
   pat: string,
   branch: string,
   authToken: string,
   project_name: string,
   options?: { signal?: AbortSignal }
 ): Promise<any> {
   console.log("*** API get called", repo_url, branch);

   const response = await axios.post(
     `${getBaseApi()}/assistant/repo-documentation`,
     { repo_url, branch, pat, project_name },
     {
       headers: getAuthHeaders(authToken),
       signal: options?.signal, // used here
     }
   );
   console.log("*** response:", response.data);

   return response.data;
 }