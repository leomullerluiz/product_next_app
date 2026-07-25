
type ApiEnvelope<T> =
  | { success: true; data: T }
  | {
    success: false;
    error: { code?: string; message?: string; details?: unknown };
  };

type ApiFailureEnvelope = Extract<ApiEnvelope<unknown>, { success: false }>;

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
  const payload = await requestPayload<T>(path, init);

  if (payload === undefined) {
    return undefined as T;
  }

  if (!isRecord(payload) || !("data" in payload)) {
    throw new ApiError({
      status: 200,
      message: "A API nao retornou dados.",
    });
  }

  return payload.data as T;
}

export async function apiRawRequest<T>(
  path: string,
  init: ApiRequestInit = {},
): Promise<T> {
  const payload = await requestPayload<T>(path, init);

  if (payload === undefined) {
    return undefined as T;
  }

  return payload as T;
}

async function requestPayload<T>(
  path: string,
  init: ApiRequestInit,
): Promise<ApiEnvelope<T> | T | undefined> {
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
    .catch(() => null)) as ApiEnvelope<T> | T | null;

  const failure = getFailureEnvelope(payload);

  if (!response.ok || failure) {
    const error = failure?.error;

    throw new ApiError({
      status: response.status,
      code: error?.code,
      message: error?.message ?? "Nao foi possivel concluir a requisicao.",
      details: error?.details,
    });
  }

  if (response.status === 204) {
    return undefined;
  }

  return payload ?? undefined;
}

function getFailureEnvelope(
  payload: unknown,
): ApiFailureEnvelope | undefined {
  if (
    isRecord(payload) &&
    payload.success === false &&
    isRecord(payload.error)
  ) {
    return payload as ApiFailureEnvelope;
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
