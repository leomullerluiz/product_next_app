"use client"; // Error boundaries must be Client Components

import "./globals.css";

// Replaces the root layout when it fails, so it must render <html> and <body>.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <title>Erro inesperado</title>
        <h1 className="text-lg font-semibold">Erro inesperado</h1>
        <p className="max-w-md text-sm opacity-70">
          A aplicacao nao pode ser carregada.
          {error.digest ? ` Codigo: ${error.digest}` : ""}
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
