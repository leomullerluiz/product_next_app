import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SentryDsnClientCheck } from "./SentryDsnClientCheck";
import { SentryEventTester } from "./SentryEventTester";
import {
  getSentryDsnDiagnostics,
  type SentryDsnDiagnostics,
} from "@/utils/sentryDsn";

const statusLabel: Record<SentryDsnDiagnostics["status"], string> = {
  missing: "Ausente",
  valid: "Configurado",
  invalid: "Invalido",
};

const statusTone: Record<
  SentryDsnDiagnostics["status"],
  "neutral" | "success" | "warning"
> = {
  missing: "neutral",
  valid: "success",
  invalid: "warning",
};

export function SentryDsnTestPage() {
  const diagnostics = getSentryDsnDiagnostics(
    process.env.NEXT_PUBLIC_SENTRY_DSN,
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Diagnostico"
        title="Sentry DSN"
        description="Verificacao do valor de NEXT_PUBLIC_SENTRY_DSN embutido no build."
      />

      <div className="grid gap-4">
        <Card className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-zinc-950">
              NEXT_PUBLIC_SENTRY_DSN
            </h2>
            <Badge tone={statusTone[diagnostics.status]}>
              {statusLabel[diagnostics.status]}
            </Badge>
          </div>

          <p className="text-sm text-zinc-600">{diagnostics.message}</p>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <DiagnosticItem label="DSN" value={diagnostics.maskedDsn || "-"} />
            <DiagnosticItem label="Host" value={diagnostics.host || "-"} />
            <DiagnosticItem
              label="Project id"
              value={diagnostics.projectId || "-"}
            />
            <DiagnosticItem
              label="Protocol"
              value={diagnostics.protocol || "-"}
            />
            <DiagnosticItem
              label="Public key"
              value={diagnostics.publicKeyPreview || "-"}
            />
            <DiagnosticItem
              label="Fingerprint"
              value={diagnostics.fingerprint}
            />
          </dl>
        </Card>

        <SentryDsnClientCheck
          expectedFingerprint={diagnostics.fingerprint}
        />

        <SentryEventTester dsnStatus={diagnostics.status} />
      </div>
    </AppShell>
  );
}

function DiagnosticItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <dt className="text-xs font-medium uppercase text-zinc-500">{label}</dt>
      <dd className="mt-1 break-all font-mono text-xs text-zinc-950">{value}</dd>
    </div>
  );
}
