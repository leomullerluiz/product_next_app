"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getSentryDsnDiagnostics } from "@/utils/sentryDsn";

export function SentryDsnClientCheck({
  expectedFingerprint,
}: {
  expectedFingerprint: string;
}) {
  const clientDiagnostics = getSentryDsnDiagnostics(
    process.env.NEXT_PUBLIC_SENTRY_DSN,
  );
  const isMatch = clientDiagnostics.fingerprint === expectedFingerprint;
  const badgeTone: "success" | "warning" = isMatch ? "success" : "warning";
  const label = isMatch ? "Bundle ok" : "Divergente";

  return (
    <Card className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-950">Client bundle</h2>
        <Badge tone={badgeTone}>{label}</Badge>
      </div>
      <p className="text-sm text-zinc-600">
        {isMatch
          ? "O valor embutido no client bundle bate com o valor renderizado no build."
          : "O valor embutido no client bundle nao bate com o valor renderizado no build."}
      </p>
    </Card>
  );
}
