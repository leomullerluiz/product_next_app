import { ApiError } from "./client";

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isUnauthorized(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 401;
}

export function isValidationError(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 422;
}

export function isRateLimited(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 429;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Algo deu errado. Tente novamente.",
) {
  if (isApiError(error)) {
    if (error.status === 401) {
      return "Sua sessao expirou. Entre novamente para continuar.";
    }

    if (error.status === 403) {
      return "Voce nao tem permissao para esta acao.";
    }

    if (error.status === 404) {
      return "Nao encontramos o que voce procura.";
    }

    if (error.status === 429) {
      return "Muitas requisicoes. Aguarde alguns segundos e tente de novo.";
    }

    if (error.status >= 500) {
      return "O servico esta instavel no momento. Tente novamente em instantes.";
    }

    return error.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function getFieldErrors(error: unknown): Record<string, string> {
  if (!isValidationError(error)) {
    return {};
  }

  if (typeof error.details !== "object" || error.details === null) {
    return {};
  }

  const details = error.details as Record<string, unknown>;

  return Object.entries(details).reduce<Record<string, string>>(
    (acc, [field, messages]) => {
      if (Array.isArray(messages) && typeof messages[0] === "string") {
        acc[field] = messages[0];
      } else if (typeof messages === "string") {
        acc[field] = messages;
      }

      return acc;
    },
    {},
  );
}
