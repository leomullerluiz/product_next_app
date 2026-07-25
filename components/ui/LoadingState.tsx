import { cn } from "@/utils/cn";

type LoadingStateProps = {
  label?: string;
  rows?: number;
  className?: string;
};

export function LoadingState({
  label = "Carregando...",
  rows = 3,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn("grid gap-3", className)} aria-busy="true">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100"
        />
      ))}
    </div>
  );
}
