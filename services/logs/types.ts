export type RequestLogUser = {
  id: number | null;
  login: string | null;
  name: string | null;
};

export type RequestLog = {
  id: number;
  method: string;
  uri: string;
  status_code: number;
  client_ip?: string | null;
  user_agent?: string | null;
  user: RequestLogUser | null;
  duration_ms: number;
  created_at: string;
};

export type RequestLogListParams = {
  page: number;
  pageSize: number;
};

export type RequestLogPaginatedResult = {
  data: RequestLog[];
  currentPage: number;
  pageCount: number;
  totalCount: number;
  pageSize: number;
};

export type RequestLogPaginatedApiResult =
  | RequestLogPaginatedResult
  | { success: true; data: RequestLogPaginatedResult };
