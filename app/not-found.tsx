import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { routes } from "@/utils/routes";

export default function NotFound() {
  return (
    <AppShell>
      <EmptyState
        title="Pagina nao encontrada"
        description="O endereco acessado nao existe ou foi movido."
        action={
          <Link href={routes.home}>
            <Button>Voltar para o inicio</Button>
          </Link>
        }
      />
    </AppShell>
  );
}
