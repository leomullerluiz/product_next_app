import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logsRoutes } from "@/utils/logsRoutes";
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

  it("unwraps successful API envelopes", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true, data: { ok: true } }), {
        status: 200,
      }),
    );
    const { apiRequest } = await import("@/services/api/client");

    await expect(apiRequest<{ ok: boolean }>("/health")).resolves.toEqual({
      ok: true,
    });
  });

  it("returns full payloads for raw paginated responses", async () => {
    const payload = {
      data: [],
      currentPage: 0,
      pageCount: 1,
      totalCount: 0,
      pageSize: 20,
    };
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );
    const { apiRawRequest } = await import("@/services/api/client");

    await expect(apiRawRequest<typeof payload>("/logs")).resolves.toEqual(
      payload,
    );
  });
});

describe("productsRoutes", () => {
  it("escapes dynamic product ids", () => {
    expect(productsRoutes.detail("abc/123")).toBe("/produtos/abc%2F123");
  });
});

describe("logsRoutes", () => {
  it("builds paginated log urls", () => {
    expect(logsRoutes.list({ page: 0, pageSize: 20 })).toBe(
      "/logs?page=0&pageSize=20",
    );
    expect(logsRoutes.errors({ page: 2, pageSize: 10 })).toBe(
      "/logs/errors?page=2&pageSize=10",
    );
  });
});
