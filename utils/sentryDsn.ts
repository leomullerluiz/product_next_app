export type SentryDsnStatus = "missing" | "valid" | "invalid";

export type SentryDsnDiagnostics = {
  status: SentryDsnStatus;
  maskedDsn: string;
  host: string;
  projectId: string;
  protocol: string;
  publicKeyPreview: string;
  fingerprint: string;
  message: string;
};

const EMPTY_DIAGNOSTICS: SentryDsnDiagnostics = {
  status: "missing",
  maskedDsn: "",
  host: "",
  projectId: "",
  protocol: "",
  publicKeyPreview: "",
  fingerprint: "empty",
  message: "NEXT_PUBLIC_SENTRY_DSN nao foi definido no build.",
};

export function getSentryDsnDiagnostics(
  dsn: string | null | undefined,
): SentryDsnDiagnostics {
  const trimmedDsn = dsn?.trim() ?? "";

  if (!trimmedDsn) {
    return EMPTY_DIAGNOSTICS;
  }

  try {
    const url = new URL(trimmedDsn);
    const protocol = url.protocol.replace(":", "");
    const projectId = url.pathname.split("/").filter(Boolean).at(-1) ?? "";

    if (!["http", "https"].includes(protocol)) {
      return invalidDiagnostics(trimmedDsn, "A DSN deve usar http ou https.");
    }

    if (!url.username) {
      return invalidDiagnostics(trimmedDsn, "A DSN nao possui public key.");
    }

    if (!url.hostname) {
      return invalidDiagnostics(trimmedDsn, "A DSN nao possui host.");
    }

    if (!projectId) {
      return invalidDiagnostics(trimmedDsn, "A DSN nao possui project id.");
    }

    return {
      status: "valid",
      maskedDsn: maskDsn(url),
      host: url.host,
      projectId,
      protocol,
      publicKeyPreview: maskToken(url.username),
      fingerprint: fingerprint(trimmedDsn),
      message: "NEXT_PUBLIC_SENTRY_DSN foi definido e parece valido.",
    };
  } catch {
    return invalidDiagnostics(trimmedDsn, "A DSN nao e uma URL valida.");
  }
}

function invalidDiagnostics(dsn: string, message: string): SentryDsnDiagnostics {
  return {
    status: "invalid",
    maskedDsn: dsn ? maskRawValue(dsn) : "",
    host: "",
    projectId: "",
    protocol: "",
    publicKeyPreview: "",
    fingerprint: fingerprint(dsn),
    message,
  };
}

function maskDsn(url: URL) {
  const credentials = url.password
    ? `${maskToken(url.username)}:${maskToken(url.password)}`
    : maskToken(url.username);

  return `${url.protocol}//${credentials}@${url.host}${url.pathname}`;
}

function maskRawValue(value: string) {
  if (value.length <= 12) {
    return "***";
  }

  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

function maskToken(value: string) {
  if (value.length <= 8) {
    return `${value.slice(0, 1)}...${value.slice(-1)}`;
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function fingerprint(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash.toString(16).padStart(8, "0");
}
