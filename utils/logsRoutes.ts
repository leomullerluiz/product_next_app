import { withQuery } from "./routes";

export type LogListParams = {
  page: number;
  pageSize: number;
};

export const logsRoutes = {
  list: (params: LogListParams) => withQuery("/logs", params),
  errors: (params: LogListParams) => withQuery("/logs/errors", params),
} as const;
