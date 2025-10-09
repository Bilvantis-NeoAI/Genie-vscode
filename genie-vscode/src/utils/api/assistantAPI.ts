import axios from "axios";
import { getAuthHeaders } from "../../auth/apiHeaders";
import { getBaseApi } from "../../auth/config";

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


export async function pollJobStatus(JobID: string, authToken: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/assistant/file-testCases/status`,
    { JobID },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postFilewiseUnitTestCodeAssistant(
  code: string,
  language: string,
  authToken: string,
  project_name: any,
  branch_name: string,
  options?: { signal?: AbortSignal }
): Promise<any> {

  console.log(`***API Response: language: ${language},AuthToken:${authToken},project_name,branch_name,options`);


  try {
    const response = await axios.post(
      `${getBaseApi()}/assistant/file-testCases`,
      { code, language, project_name, branch_name },
      {
        headers: getAuthHeaders(authToken),
        signal: options?.signal,
      }
    );
    console.log("***Response", response);
    return response.data;
  } catch (error: any) {
    console.error("*** API call failed:", error?.response?.data || error.message || error);
    throw error;
  }
}

