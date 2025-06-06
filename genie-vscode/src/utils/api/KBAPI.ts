import axios from "axios";
import { getAuthHeaders } from "../../auth/apiHeaders";
import { getKbBaseApi } from "../../auth/config";

// const test = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyYWh1bDk3QGdtYWlsLmNvbSIsInVzZXJJZCI6IjY4Mzk3NjhiMDFhZmI0YWEwMDI2NjE2MCIsImV4cCI6MTc1MTUyMjgyM30.Wzk3cpAYF5ObzDhCtuoYOTDRKiIX8wAkevtUF9sX7gE";
export async function knowledgeBaseQA(query: string, session_id: string, dbquery: boolean, partition_name: string, partition_value: string, authToken: string, options?: { signal?: AbortSignal }): Promise<any> {
    const response = await axios.post(
        `${getKbBaseApi()}/process-query`,
        { query, session_id, partition_name, partition_value, dbquery },
        {
        headers: getAuthHeaders(authToken),
        signal: options?.signal,
        }
    );
    return response.data;
    }