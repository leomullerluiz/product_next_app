import { LoadingState } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <LoadingState label="Carregando pagina..." />
    </div>
  );
}
