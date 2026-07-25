import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";



export function HomePage() {
  return (
    <AppShell>
      <PageHeader
        title="Next.js product"
        description="Next app para busca de produtos"
      />

      <div className="grid gap-3 sm:grid-cols-2">

      </div>
    </AppShell>
  );
}
