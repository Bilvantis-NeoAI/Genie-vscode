import axios from "axios";
import { getBaseApi  } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";

export async function postReviewCode(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
    const response = await axios.post(
      `${getBaseApi()}/review/code`,
      { code, language, project_name, branch_name },
      {
        headers: getAuthHeaders(authToken),
        signal: options?.signal,
      }
    );
    
    return response.data; //.reviewComments;
  }


export async function postPerformanceReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/performance`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postSecurityReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/security`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postSyntaxReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/syntax`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postOverallReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/overall`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postOwaspReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/owasp`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postTechDebtReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/tech-debt`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postOrgStdReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/org-std-review`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postCkReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/CK-review`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postAllReview(
  code: string,
  language: string,
  authToken: string,
  project_name: any,
  branch_name: string,
  options?: { signal?: AbortSignal } // Accept optional abort signal
): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/review`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal, // Pass the signal to Axios
    }
  );

  return response.data;
}


// export async function postReviewTerminal(
//   requestData: { 
//     errorText: string; 
//     filePath: string; 
//     // fileContent: string; 
//     fileContents: { path: string; content: string }[];
//     language: string; 
//     project_name: any; 
//     branch_name: string; 
//     authToken: string; 
//   },
//   options?: { signal?: AbortSignal }
// ): Promise<object> {  // Return an object, not a string
//   if (!requestData.errorText || !requestData.fileContents.length) {
//     console.error("Missing required request data.");
//     return { error: "Missing required request data" };
//   }

//   return {
//     message: "Received Debug Review Request",
//     "Error Text": requestData.errorText,
//     "File Path": requestData.filePath,
//     "File Content": requestData.fileContents,
//     "Language": requestData.language,
//     "Project Name": requestData.project_name,
//     "Branch Name": requestData.branch_name,
//     "Auth Token": requestData.authToken ? "Provided" : "Missing"
//   };
// }



export async function postReviewTerminal(
  requestData: {
    errorText: string;
    fileContents: { path: string; content: string }[];
    language: string;
    project_name: any;
    branch_name: string;
    authToken: string;
  },
  options?: { signal?: AbortSignal }
): Promise<object> {
  if (!requestData.errorText || !requestData.fileContents.length) {
    console.error("Missing required request data.");
    return { error: "Missing required request data" };
  }
  return {
    "error_text": requestData.errorText,
    "file_contents": requestData.fileContents.map(file => ({
      "path": file.path,
      "content": file.content,
    })),
    "language": requestData.language,
    "project_name": requestData.project_name,
    "branch_name": requestData.branch_name,
    "authToken": requestData.authToken ? "Provided" : "Missing"
  };

}
