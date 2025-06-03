import axios from "axios";
import { getAuthHeaders } from "../../auth/apiHeaders";
import { getKbBaseApi } from "../../auth/config";


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