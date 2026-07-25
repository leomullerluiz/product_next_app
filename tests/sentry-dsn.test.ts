import { describe, expect, it } from "vitest";
import { getSentryDsnDiagnostics } from "@/utils/sentryDsn";

describe("getSentryDsnDiagnostics", () => {
  it("marks an empty DSN as missing", () => {
    expect(getSentryDsnDiagnostics("").status).toBe("missing");
  });

  it("parses a valid Sentry DSN", () => {
    const diagnostics = getSentryDsnDiagnostics(
      "https://abc123456789@sentry.example.com/42",
    );

    expect(diagnostics.status).toBe("valid");
    expect(diagnostics.host).toBe("sentry.example.com");
    expect(diagnostics.projectId).toBe("42");
    expect(diagnostics.protocol).toBe("https");
    expect(diagnostics.maskedDsn).toBe(
      "https://abc1...6789@sentry.example.com/42",
    );
  });

  it("marks malformed values as invalid", () => {
    expect(getSentryDsnDiagnostics("not-a-url").status).toBe("invalid");
  });

  it("requires a project id", () => {
    expect(
      getSentryDsnDiagnostics("https://abc123456789@sentry.example.com").status,
    ).toBe("invalid");
  });
});
