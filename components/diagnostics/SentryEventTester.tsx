"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { SentryDsnStatus } from "@/utils/sentryDsn";

class SentryTestClientError extends Error {
  constructor() {
    super("Erro client-side enviado pela pagina /sentry-test.");
    this.name = "SentryTestClientError";
  }
}

type SendStatus = "idle" | "sending" | "sent" | "failed";

const statusLabel: Record<SendStatus, string> = {
  idle: "Pronto",
  sending: "Enviando",
  sent: "Enviado",
  failed: "Falhou",
};

const statusTone: Record<SendStatus, "neutral" | "success" | "warning"> = {
  idle: "neutral",
  sending: "neutral",
  sent: "success",
  failed: "warning",
};

export function SentryEventTester({
  dsnStatus,
}: {
  dsnStatus: SentryDsnStatus;
}) {
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const [eventId, setEventId] = useState("");

  async function sendExampleError() {
    if (dsnStatus !== "valid") {
      setSendStatus("failed");
      setEventId("");
      return;
    }

    setSendStatus("sending");

    const nextEventId = Sentry.captureException(
      new SentryTestClientError(),
      {
        tags: {
          source: "sentry-test",
          runtime: "browser",
        },
      },
    );

    const flushed = await Sentry.flush(2_000);

    setEventId(nextEventId);
    setSendStatus(flushed ? "sent" : "failed");
  }

  return (
    <Card className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-950">
            Erro client-side
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Envia um evento manual para validar o SDK do Sentry no browser.
          </p>
        </div>
        <Badge tone={statusTone[sendStatus]}>{statusLabel[sendStatus]}</Badge>
      </div>

      {dsnStatus === "valid" ? (
        <p className="text-sm text-zinc-600">
          A DSN foi encontrada no build. Clique para enviar um erro de teste.
        </p>
      ) : (
        <p className="text-sm text-red-600">
          Configure NEXT_PUBLIC_SENTRY_DSN e refaca o build antes de enviar o
          evento.
        </p>
      )}

      {eventId ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-medium uppercase text-zinc-500">Event id</p>
          <p className="mt-1 break-all font-mono text-xs text-zinc-950">
            {eventId}
          </p>
        </div>
      ) : null}

      <div>
        <Button
          onClick={sendExampleError}
          disabled={sendStatus === "sending"}
          variant={dsnStatus === "valid" ? "primary" : "secondary"}
        >
          Enviar erro de teste
        </Button>
      </div>
    </Card>
  );
}
