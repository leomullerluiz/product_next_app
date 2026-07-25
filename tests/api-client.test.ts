import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { productsRoutes } from "@/utils/productsRoutes";

describe("apiRequest", () => {
  const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.test/";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
  });

  it("returns undefined for successful empty responses", async () => {
    const { apiRequest } = await import("@/services/api/client");

    await expect(
      apiRequest<void>(productsRoutes.detail(10), { method: "DELETE" }),
    ).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.test/produtos/10",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});

describe("productsRoutes", () => {
  it("escapes dynamic product ids", () => {
    expect(productsRoutes.detail("abc/123")).toBe("/produtos/abc%2F123");
  });
});
