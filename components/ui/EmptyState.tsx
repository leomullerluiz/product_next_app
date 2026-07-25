import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "grid place-items-center gap-2 rounded-xl border border-dashed border-zinc-200 bg-white/60 p-10 text-center",
        className,
      )}
    >
      <h2 className="text-sm font-semibold text-zinc-950">{title}</h2>
      {description ? (
        <p className="max-w-md text-sm text-zinc-600">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
