"use client";

import { useQuery } from "@tanstack/react-query";
import {
  listRequestErrorLogs,
  listRequestLogs,
} from "@/services/logs/service";
import type { RequestLogListParams } from "@/services/logs/types";
import { logsKeys, type RequestLogListKind } from "./keys";

export function useRequestLogsQuery(
  accessToken: string | undefined,
  kind: RequestLogListKind,
  params: RequestLogListParams,
) {
  return useQuery({
    queryKey: logsKeys.list(kind, params),
    queryFn: () =>
      kind === "errors"
        ? listRequestErrorLogs(accessToken ?? "", params)
        : listRequestLogs(accessToken ?? "", params),
    enabled: Boolean(accessToken),
    placeholderData: (previousData) => previousData,
  });
}
