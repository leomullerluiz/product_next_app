"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-16">
      <EmptyState
        title="Algo deu errado"
        description="Nao foi possivel renderizar esta area. Voce pode tentar novamente."
        action={<Button onClick={() => unstable_retry()}>Tentar novamente</Button>}
      />
    </div>
  );
}
