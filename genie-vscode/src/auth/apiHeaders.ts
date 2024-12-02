export function getAuthHeaders(authToken: string) {
    return {
      Authorization: `Bearer ${authToken}`,
    };
  }
  