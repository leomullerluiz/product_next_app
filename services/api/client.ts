
type ApiEnvelope<T> =
  | { success: true; data: T }
  | {
    success: false;
    error: { code?: string; message?: string; details?: unknown };
  };

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(input: {
    status: number;
    message: string;
    code?: string;
    details?: unknown;
  }) {
    super(input.message);
    this.name = "ApiError";
    this.status = input.status;
    this.code = input.code;
    this.details = input.details;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

function requireApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  return API_BASE_URL;
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: BodyInit | object;
};

export async function apiRequest<T>(
  path: string,
  init: ApiRequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  const isJsonBody =
    Boolean(init.body) &&
    typeof init.body === "object" &&
    !(init.body instanceof FormData) &&
    !(init.body instanceof URLSearchParams) &&
    !(init.body instanceof Blob);

  const body = isJsonBody
    ? JSON.stringify(init.body)
    : (init.body as BodyInit | undefined);

  headers.set("accept", "application/json");

  if (isJsonBody && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(`${requireApiBaseUrl()}${normalizePath(path)}`, {
    ...init,
    body,
    headers,
    // Keep cookie-based sessions (HttpOnly) working out of the box.
    credentials: init.credentials ?? "include",
    cache: init.cache ?? "no-store",
  });

  const payload = (await response
    .json()
    .catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || payload?.success === false) {
    const error =
      payload && "error" in payload && payload.error ? payload.error : undefined;

    throw new ApiError({
      status: response.status,
      code: error?.code,
      message: error?.message ?? "Nao foi possivel concluir a requisicao.",
      details: error?.details,
    });
  }

  if (!payload || !("data" in payload)) {
    throw new ApiError({
      status: response.status,
      message: "A API nao retornou dados.",
    });
  }

  return payload.data;
}
