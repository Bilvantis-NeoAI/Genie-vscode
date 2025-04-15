import axios from "axios";
import { getBaseApi  } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";

export async function postCodeGenerationAssistant(prompt: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
    const response = await axios.post(
      `${getBaseApi()}/assistant/code-generation`,
      { prompt, language, project_name, branch_name },
      {
        headers: getAuthHeaders(authToken),
        signal: options?.signal,
      }
    );
    return response.data;
  }

export async function postAddCommentsAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(    
    `${getBaseApi()}/assistant/add-comments`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken), 
      signal: options?.signal,
    }
  );
  return response.data;
}
 
export async function postAddDocStringsAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/assistant/add-docstrings`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}
 
export async function postExplainCodeAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
const response = await axios.post(
    `${getBaseApi()}/assistant/explain-code`,
    { code, language, project_name, branch_name },
    {
    headers: getAuthHeaders(authToken),
    signal: options?.signal,
    }
);
return response.data;
}

export async function postUnittestCodeAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
    const response = await axios.post(
        `${getBaseApi()}/assistant/unittest-code`,
        { code, language, project_name, branch_name },
        {
        headers: getAuthHeaders(authToken),
        signal: options?.signal,
        }
    );
    return response.data;
    }

export async function postAddLoggingAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
    const response = await axios.post(
        `${getBaseApi()}/assistant/add-logging`,
        { code, language, project_name, branch_name },
        {
        headers: getAuthHeaders(authToken),
        signal: options?.signal,
        }
    );
    return response.data;
    }

export async function postAddErrorHandlingAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
    const response = await axios.post(
        `${getBaseApi()}/assistant/add-error-handlng`,
        { code, language, project_name, branch_name },
        {
        headers: getAuthHeaders(authToken),
        signal: options?.signal,
        }
    );
    return response.data;
    }

export async function postRefactorCodeAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
    const response = await axios.post(
        `${getBaseApi()}/assistant/refactor-code`,
        { code, language, project_name, branch_name },
        {
        headers: getAuthHeaders(authToken),
        signal: options?.signal,
        }
    );
    return response.data;
    }

export async function postFilewiseUnitTestCodeAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/assistant/file-testCases`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  console.log("response data",response.data);
  
  return response.data;
}


export async function postAssistantTerminal(
  error_text: string,
  file_contents: { path: string; content: string }[],
  language: string,
  project_name: any,
  branch_name: string,
  authToken: string,
options?: { signal?: AbortSignal }
): Promise<object> {
const response = await axios.post(
  `${getBaseApi()}/assistant/bug_fixing`,  {error_text, file_contents, language, project_name, branch_name},
  {
    headers: getAuthHeaders(authToken),
    signal: options?.signal, // Pass the signal to Axios
  }
);

return response.data;
}
