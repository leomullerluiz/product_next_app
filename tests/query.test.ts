import { describe, expect, it } from "vitest";
import { buildQueryString } from "@/services/api/query";

describe("buildQueryString", () => {
  it("returns an empty string when there is nothing to serialize", () => {
    expect(buildQueryString()).toBe("");
    expect(buildQueryString({ q: undefined, page: null, status: "" })).toBe("");
  });

  it("serializes primitives", () => {
    expect(buildQueryString({ q: "next", page: 2, active: true })).toBe(
      "?q=next&page=2&active=true",
    );
  });

  it("repeats the key for array values and skips empty entries", () => {
    expect(buildQueryString({ status: ["draft", "", "active"] })).toBe(
      "?status=draft&status=active",
    );
  });

  it("encodes special characters", () => {
    expect(buildQueryString({ q: "a b&c" })).toBe("?q=a+b%26c");
  });
});
