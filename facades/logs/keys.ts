import type { RequestLogListParams } from "@/services/logs/types";

export type RequestLogListKind = "all" | "errors";

export const logsKeys = {
  all: ["logs"] as const,
  lists: () => [...logsKeys.all, "list"] as const,
  list: (kind: RequestLogListKind, params: RequestLogListParams) =>
    [...logsKeys.lists(), kind, params] as const,
};
