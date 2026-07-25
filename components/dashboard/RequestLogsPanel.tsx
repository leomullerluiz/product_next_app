"use client";

import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  useRequestLogsQuery,
  type RequestLog,
  type RequestLogListKind,
} from "@/facades/logs";
import { getErrorMessage } from "@/services/api/errors";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { formatDate } from "@/utils/format";

const PAGE_SIZE = 20;

type RequestLogsPanelProps = {
  accessToken: string;
  kind: RequestLogListKind;
};

export function RequestLogsPanel({ accessToken, kind }: RequestLogsPanelProps) {
  const [page, setPage] = useState(0);
  const logsQuery = useRequestLogsQuery(accessToken, kind, {
    page,
    pageSize: PAGE_SIZE,
  });
  const pageData = logsQuery.data;
  const logs = pageData?.data ?? [];
  const isErrorsView = kind === "errors";
  const currentPage = pageData?.currentPage ?? page;
  const pageCount = pageData?.pageCount ?? 0;
  const totalCount = pageData?.totalCount ?? 0;
  const canGoBack = currentPage > 0 && !logsQuery.isFetching;
  const canGoForward =
    pageCount > 0 && currentPage + 1 < pageCount && !logsQuery.isFetching;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Logs
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
            {isErrorsView ? "Logs erros" : "Logs"}
          </h2>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => void logsQuery.refetch()}
          disabled={logsQuery.isFetching}
        >
          <RefreshCw
            size={16}
            className={logsQuery.isFetching ? "animate-spin" : undefined}
          />
          Atualizar
        </Button>
      </div>

      {logsQuery.isLoading ? <LoadingState rows={5} /> : null}

      {logsQuery.isError ? (
        <EmptyState
          title="Nao foi possivel carregar os logs"
          description={getErrorMessage(logsQuery.error)}
          action={
            <Button variant="secondary" onClick={() => void logsQuery.refetch()}>
              Tentar novamente
            </Button>
          }
        />
      ) : null}

      {logsQuery.isSuccess && logs.length === 0 ? (
        <EmptyState
          title="Nenhum log encontrado"
          description="Nao existem registros para a pagina selecionada."
        />
      ) : null}

      {logs.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-medium uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Metodo</th>
                  <th className="px-4 py-3">Rota</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Duracao</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {logs.map((log) => (
                  <tr key={log.id} className="bg-white">
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                      {formatDate(log.created_at, {
                        dateStyle: "short",
                        timeStyle: "medium",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge>{log.method}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-xl break-all font-medium text-zinc-950">
                        {log.uri}
                      </p>
                      {log.user_agent ? (
                        <p className="mt-1 max-w-xl truncate text-xs text-zinc-500">
                          {log.user_agent}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={getStatusTone(log.status_code)}>
                        {log.status_code}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-700">
                      {log.duration_ms} ms
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      {getUserLabel(log)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                      {log.client_ip ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-3">
            <p className="text-sm text-zinc-600">
              Pagina {pageCount === 0 ? 0 : currentPage + 1} de {pageCount} ·{" "}
              {totalCount} registros
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={!canGoBack}
              >
                <ChevronLeft size={16} />
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((current) => current + 1)}
                disabled={!canGoForward}
              >
                Proxima
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getUserLabel(log: RequestLog) {
  if (!log.user) {
    return "-";
  }

  return log.user.name || log.user.login || "-";
}

function getStatusTone(statusCode: number) {
  if (statusCode === 200 || statusCode === 204) {
    return "success";
  }

  if (statusCode >= 500) {
    return "danger";
  }

  if (statusCode >= 400) {
    return "warning";
  }

  return "neutral";
}
