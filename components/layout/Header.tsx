import Link from "next/link";
import { routes } from "@/utils/routes";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-4">
        <Link
          href={routes.home}
          className="text-sm font-semibold text-zinc-950"
        >
          Product App
        </Link>
      </div>
    </header>
  );
}
