import axios from "axios";
import { getBaseApi  } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";

export async function postCodeGenerationAssistant(prompt: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
    const response = await axios.post(
      `${getBaseApi()}/assistant/code-generation`,
      { prompt, language, project_name, branch_name },
      {
        headers: getAuthHeaders(authToken),
      }
    );
    return response.data;
  }

export async function postAddCommentsAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(    
    `${getBaseApi()}/assistant/add-comments`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
 
  return response.data;
}
 
export async function postAddDocStringsAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/assistant/add-docstrings`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}
 
export async function postExplainCodeAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
const response = await axios.post(
    `${getBaseApi()}/assistant/explain-code`,
    { code, language, project_name, branch_name },
    {
    headers: getAuthHeaders(authToken),
    }
);
return response.data;
}

export async function postUnittestCodeAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
    const response = await axios.post(
        `${getBaseApi()}/assistant/unittest-code`,
        { code, language, project_name, branch_name },
        {
        headers: getAuthHeaders(authToken),
        }
    );
    return response.data;
    }

export async function postAddLoggingAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
    const response = await axios.post(
        `${getBaseApi()}/assistant/add-logging`,
        { code, language, project_name, branch_name },
        {
        headers: getAuthHeaders(authToken),
        }
    );
    return response.data;
    }

export async function postAddErrorHandlingAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
    const response = await axios.post(
        `${getBaseApi()}/assistant/add-error-handlng`,
        { code, language, project_name, branch_name },
        {
        headers: getAuthHeaders(authToken),
        }
    );
    return response.data;
    }

export async function postRefactorCodeAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
    const response = await axios.post(
        `${getBaseApi()}/assistant/refactor-code`,
        { code, language, project_name, branch_name },
        {
        headers: getAuthHeaders(authToken),
        }
    );
    return response.data;
    }

export async function postFilewiseUnitTestCodeAssistant(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/assistant/file-testCases`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}