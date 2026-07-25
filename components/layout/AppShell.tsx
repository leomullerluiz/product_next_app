import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Header } from "./Header";

export function AppShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className={cn("mx-auto w-full max-w-5xl flex-1 px-4 py-8", className)}>
        {children}
      </main>
      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500">
        Leonan Müller
      </footer>
    </div>
  );
}
