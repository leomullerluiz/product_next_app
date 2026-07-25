import { apiRawRequest } from "@/services/api/client";
import { logsRoutes } from "@/utils/logsRoutes";
import type {
  RequestLogListParams,
  RequestLogPaginatedApiResult,
  RequestLogPaginatedResult,
} from "./types";

export async function listRequestLogs(
  accessToken: string,
  params: RequestLogListParams,
) {
  const result = await apiRawRequest<RequestLogPaginatedApiResult>(
    logsRoutes.list(params),
    {
      headers: authHeaders(accessToken),
    },
  );

  return normalizeLogPage(result);
}

export async function listRequestErrorLogs(
  accessToken: string,
  params: RequestLogListParams,
) {
  const result = await apiRawRequest<RequestLogPaginatedApiResult>(
    logsRoutes.errors(params),
    {
      headers: authHeaders(accessToken),
    },
  );

  return normalizeLogPage(result);
}

function normalizeLogPage(
  result: RequestLogPaginatedApiResult,
): RequestLogPaginatedResult {
  if ("success" in result) {
    return result.data;
  }

  return result;
}

function authHeaders(accessToken: string) {
  return {
    Authorization: accessToken,
  };
}
