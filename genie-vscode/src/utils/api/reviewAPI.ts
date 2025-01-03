import axios from "axios";
import { BASE_API } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";

export async function postReviewCode(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
    const response = await axios.post(
      `${BASE_API}/review/code`,
      { code, language, project_name, branch_name },
      {
        headers: getAuthHeaders(authToken),
      }
    );
    
    return response.data; //.reviewComments;
  }


export async function postPerformanceReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${BASE_API}/review/performance`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postSecurityReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${BASE_API}/review/security`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postSyntaxReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${BASE_API}/review/syntax`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postOverallReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${BASE_API}/review/overall`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postOwaspReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${BASE_API}/review/owasp`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postTechDepthReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${BASE_API}/review/tech-depth`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}

export async function postOrgStdReview(code: string, language: string, authToken: string, project_name: any, branch_name: string): Promise<any> {
  const response = await axios.post(
    `${BASE_API}/review/org-std-review`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
    }
  );
  return response.data;
}