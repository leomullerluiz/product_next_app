"use client";

import { RefreshCw } from "lucide-react";
import { useProductsQuery } from "@/facades/products";
import { getErrorMessage } from "@/services/api/errors";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { formatCurrency, formatDate } from "@/utils/format";

export function ProductListPanel({ accessToken }: { accessToken: string }) {
  const productsQuery = useProductsQuery(accessToken);
  const products = productsQuery.data?.products ?? [];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Produtos
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
            Listagem
          </h2>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => void productsQuery.refetch()}
          disabled={productsQuery.isFetching}
        >
          <RefreshCw
            size={16}
            className={productsQuery.isFetching ? "animate-spin" : undefined}
          />
          Atualizar
        </Button>
      </div>

      {productsQuery.isLoading ? <LoadingState rows={4} /> : null}

      {productsQuery.isError ? (
        <EmptyState
          title="Nao foi possivel carregar os produtos"
          description={getErrorMessage(productsQuery.error)}
          action={
            <Button
              variant="secondary"
              onClick={() => void productsQuery.refetch()}
            >
              Tentar novamente
            </Button>
          }
        />
      ) : null}

      {productsQuery.isSuccess && products.length === 0 ? (
        <EmptyState
          title="Nenhum produto cadastrado"
          description="Use a opcao cadastrar produto para criar o primeiro item."
        />
      ) : null}

      {products.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-medium uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Preco</th>
                  <th className="px-4 py-3">Estoque</th>
                  <th className="px-4 py-3">Criado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((product) => (
                  <tr key={product.id} className="bg-white">
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-950">{product.nome}</p>
                      <p className="mt-0.5 max-w-md text-zinc-500">
                        {product.descricao}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      {product.categoria}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-950">
                      {formatCurrency(product.preco)}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      {product.quantidade_estoque}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {formatDate(product.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
