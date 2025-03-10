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

// export async function submitReview(payload: any, authToken: string): Promise<any> {
//   try {
//     console.log("Sending payload to API:", payload);

//     const response = await fetch("https://your-api-endpoint.com/review/submit", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authToken}`, // If needed
//       },
//       body: JSON.stringify(payload),
//     });

//     const responseData = await response.json();
//     console.log("API Response:", responseData);

//     return responseData;
//   } catch (error: any) {
//     console.error("Error submitting review:", error);
//     throw new Error(`Failed to submit review: ${error.message || "Unknown error"}`);
//   }
// }


export async function submitReview(payload: any, authToken: string) {
  try {
    // Log the received payload
    console.log("Received payload:", JSON.stringify(payload, null, 2));
    
    // Mock response for testing
    const mockResponse = {
      details: 'The code presented is a simple implementation of t…n by caching results of expensive function calls.',
      innerMonologue: 'Upon first glance, the code defines a function cal…the docstring can be enhanced for better clarity.',
      documentationAdded: '@memoize\n\ndef fibonacci(n):\n    """\n    Calculate … n\n    return fibonacci(n - 1) + fibonacci(n - 2)'
    };

    // Log the mock response to the console
    console.log("Mock response:", JSON.stringify(mockResponse, null, 2));

    // Return the mock response
    return mockResponse;
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    throw error;
  }
}