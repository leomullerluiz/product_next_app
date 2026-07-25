import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, formatNumber, truncate } from "@/utils/format";

describe("formatDate", () => {
  it("returns an empty string for an invalid date", () => {
    expect(formatDate("not-a-date")).toBe("");
  });

  it("formats a valid ISO date", () => {
    expect(formatDate("2026-01-10T12:00:00.000Z")).not.toBe("");
  });
});

describe("formatNumber", () => {
  it("guards against non finite values", () => {
    expect(formatNumber(Number.NaN)).toBe("");
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe("");
  });

  it("formats using the default locale", () => {
    expect(formatNumber(1234.5)).toBe("1.234,5");
  });
});

describe("formatCurrency", () => {
  it("includes the currency symbol", () => {
    expect(formatCurrency(10)).toContain("R$");
  });
});

describe("truncate", () => {
  it("keeps short strings untouched", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("cuts on a word boundary", () => {
    expect(truncate("uma frase bem grande aqui", 15)).toBe("uma frase bem...");
  });
});
