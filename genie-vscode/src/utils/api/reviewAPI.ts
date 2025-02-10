import axios from "axios";
import { getBaseApi  } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";

export async function postReviewCode(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
    const response = await axios.post(
      `${getBaseApi()}/review/code`,
      { code, language, project_name, branch_name },
      {
        headers: getAuthHeaders(authToken),
      }
    );
    
    return response.data; //.reviewComments;
  }


export async function postPerformanceReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/performance`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postSecurityReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/security`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postSyntaxReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/syntax`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postOverallReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/overall`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postOwaspReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/owasp`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postTechDebtReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/tech-debt`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postOrgStdReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${getBaseApi}/review/org-std-review`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postCkReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/CK-review`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}
 