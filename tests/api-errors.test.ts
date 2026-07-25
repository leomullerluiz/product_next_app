import { describe, expect, it } from "vitest";
import { ApiError } from "@/services/api/client";
import {
  getErrorMessage,
  getFieldErrors,
  isApiError,
  isRateLimited,
  isUnauthorized,
  isValidationError,
} from "@/services/api/errors";

describe("error guards", () => {
  it("recognizes ApiError instances by status", () => {
    expect(isApiError(new Error("boom"))).toBe(false);
    expect(isUnauthorized(new ApiError({ status: 401, message: "" }))).toBe(true);
    expect(isValidationError(new ApiError({ status: 422, message: "" }))).toBe(true);
    expect(isRateLimited(new ApiError({ status: 429, message: "" }))).toBe(true);
  });
});

describe("getErrorMessage", () => {
  it("maps known statuses to user facing copy", () => {
    expect(getErrorMessage(new ApiError({ status: 401, message: "raw" }))).toContain(
      "sessao expirou",
    );
    expect(getErrorMessage(new ApiError({ status: 503, message: "raw" }))).toContain(
      "instavel",
    );
  });

  it("keeps the API message for other statuses", () => {
    expect(getErrorMessage(new ApiError({ status: 400, message: "Titulo invalido" }))).toBe(
      "Titulo invalido",
    );
  });

  it("falls back for unknown values", () => {
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
  });
});

describe("getFieldErrors", () => {
  it("returns the first message per field", () => {
    const error = new ApiError({
      status: 422,
      message: "invalid",
      details: { title: ["Obrigatorio", "Muito curto"], description: "Invalido" },
    });

    expect(getFieldErrors(error)).toEqual({
      title: "Obrigatorio",
      description: "Invalido",
    });
  });

  it("returns an empty object for other errors", () => {
    expect(getFieldErrors(new Error("boom"))).toEqual({});
  });
});
