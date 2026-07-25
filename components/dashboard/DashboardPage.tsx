"use client";

import {
  ClipboardList,
  LogOut,
  PackagePlus,
  ScrollText,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthSession } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { routes } from "@/utils/routes";
import { ProductCreatePanel } from "./ProductCreatePanel";
import { ProductListPanel } from "./ProductListPanel";
import { RequestLogsPanel } from "./RequestLogsPanel";

type DashboardView = "list" | "create" | "logs" | "errorLogs";

const navItems: Array<{
  id: DashboardView;
  label: string;
  icon: ReactNode;
}> = [
  {
    id: "list",
    label: "Listar",
    icon: <ClipboardList size={16} />,
  },
  {
    id: "create",
    label: "Cadastrar produto",
    icon: <PackagePlus size={16} />,
  },
  {
    id: "logs",
    label: "Logs",
    icon: <ScrollText size={16} />,
  },
  {
    id: "errorLogs",
    label: "Logs erros",
    icon: <TriangleAlert size={16} />,
  },
];

export function DashboardPage() {
  const { session, endSession } = useAuthSession();
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<DashboardView>("list");

  function handleLogout() {
    queryClient.clear();
    endSession();
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-50 px-4 py-10">
        <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 text-center shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Sessao necessaria
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-950">
            Entre para acessar o dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            A sessao fica apenas em memoria. Ao recarregar a pagina, faca login
            novamente.
          </p>
          <Link
            href={routes.home}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Voltar para login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-zinc-200 bg-white px-4 py-4 md:w-64 md:border-b-0 md:border-r">
          <div className="flex items-start justify-between gap-3 md:block">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Product App
              </p>
              <h1 className="mt-1 text-lg font-semibold text-zinc-950">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-zinc-600">
                {session.user.name || session.user.login}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              aria-label="Sair"
              className="md:hidden"
            >
              <LogOut size={16} />
            </Button>
          </div>

          <nav className="mt-5 grid gap-1" aria-label="Dashboard">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium transition",
                  activeView === item.id
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="mt-6 hidden w-full justify-start md:inline-flex"
          >
            <LogOut size={16} />
            Sair
          </Button>
        </aside>

        <section className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          {activeView === "list" ? (
            <ProductListPanel accessToken={session.accessToken} />
          ) : null}
          {activeView === "create" ? (
            <ProductCreatePanel
              accessToken={session.accessToken}
              onCreated={() => setActiveView("list")}
            />
          ) : null}
          {activeView === "logs" ? (
            <RequestLogsPanel accessToken={session.accessToken} kind="all" />
          ) : null}
          {activeView === "errorLogs" ? (
            <RequestLogsPanel accessToken={session.accessToken} kind="errors" />
          ) : null}
        </section>
      </div>
    </main>
  );
}
