"use client";

import {
  EllipsisVertical,
  LoaderCircle,
  Pencil,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  useDeleteProductMutation,
  useProductsQuery,
  useUpdateProductMutation,
} from "@/facades/products";
import type { Product, ProductInput } from "@/facades/products";
import { getErrorMessage, getFieldErrors } from "@/services/api/errors";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatBrlCurrencyInput,
  formatCurrency,
  formatDate,
  parseBrlCurrencyInput,
} from "@/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/contexts/ToastContext";

type ProductForm = {
  nome: string;
  descricao: string;
  preco: string;
  quantidade_estoque: string;
  categoria: string;
};

const initialForm: ProductForm = {
  nome: "",
  descricao: "",
  preco: "",
  quantidade_estoque: "",
  categoria: "",
};

export function ProductListPanel({ accessToken }: { accessToken: string }) {
  const { showToast } = useToast();
  const productsQuery = useProductsQuery(accessToken);
  const updateProductMutation = useUpdateProductMutation(accessToken);
  const deleteProductMutation = useDeleteProductMutation(accessToken);
  const products = productsQuery.data?.products ?? [];
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  function openEdit(product: Product) {
    updateProductMutation.reset();
    setEditingProduct(product);
    setForm(productToForm(product));
    setFieldErrors({});
    setMessage("");
  }

  function closeEdit() {
    if (updateProductMutation.isPending) {
      return;
    }

    setEditingProduct(null);
    setForm(initialForm);
    setFieldErrors({});
    setMessage("");
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingProduct) {
      return;
    }

    setFieldErrors({});
    setMessage("");

    const payload = toProductInput(form);

    if (!payload) {
      setMessage("Revise preco e estoque antes de salvar.");
      return;
    }

    try {
      const result = await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        input: payload,
      });

      showToast({
        variant: "success",
        title: "Produto atualizado",
        description: result.product.nome,
      });
      closeEdit();
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setMessage(getErrorMessage(error));
    }
  }

  function openDelete(product: Product) {
    setDeletingProduct(product);
  }

  function closeDelete() {
    if (deleteProductMutation.isPending) {
      return;
    }

    setDeletingProduct(null);
  }

  async function handleDelete() {
    if (!deletingProduct) {
      return;
    }

    const product = deletingProduct;

    try {
      await deleteProductMutation.mutateAsync(product.id);
      showToast({
        variant: "success",
        title: "Produto excluido",
        description: product.nome,
      });
      setDeletingProduct(null);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Nao foi possivel excluir",
        description: getErrorMessage(error),
      });
    }
  }

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
                  <th className="px-4 py-3 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((product) => {
                  const isDeleting =
                    deleteProductMutation.isPending &&
                    deleteProductMutation.variables === product.id;

                  return (
                    <tr key={product.id} className="bg-white">
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-950">
                          {product.nome}
                        </p>
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
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            aria-label={`Abrir acoes de ${product.nome}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                          >
                            <EllipsisVertical size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-40" align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => openEdit(product)}
                                disabled={updateProductMutation.isPending}
                              >
                                <Pencil size={16} />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => openDelete(product)}
                                disabled={deleteProductMutation.isPending}
                              >
                                {isDeleting ? (
                                  <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <Dialog
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => {
          if (!open) {
            closeDelete();
          }
        }}
      >
        <DialogContent showCloseButton={!deleteProductMutation.isPending}>
          <DialogHeader>
            <DialogTitle>Excluir produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <span className="font-medium text-zinc-950">
                {deletingProduct?.nome}
              </span>
              ? Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={closeDelete}
              disabled={deleteProductMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => void handleDelete()}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : (
                <Trash2 size={16} />
              )}
              Excluir produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingProduct ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/30 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-title"
            className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Edicao
                </p>
                <h3
                  id="edit-product-title"
                  className="mt-1 text-xl font-semibold text-zinc-950"
                >
                  Editar produto
                </h3>
              </div>
              <button
                type="button"
                aria-label="Fechar edicao"
                onClick={closeEdit}
                disabled={updateProductMutation.isPending}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:pointer-events-none disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            <form className="mt-5 grid gap-4" onSubmit={handleUpdate}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Nome"
                  name="nome"
                  value={form.nome}
                  error={fieldErrors.nome}
                  disabled={updateProductMutation.isPending}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      nome: event.target.value,
                    }))
                  }
                  required
                />
                <Input
                  label="Categoria"
                  name="categoria"
                  value={form.categoria}
                  error={fieldErrors.categoria}
                  disabled={updateProductMutation.isPending}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      categoria: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <Input
                label="Descricao"
                name="descricao"
                value={form.descricao}
                error={fieldErrors.descricao}
                disabled={updateProductMutation.isPending}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    descricao: event.target.value,
                  }))
                }
                required
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Preco"
                  name="preco"
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={form.preco}
                  error={fieldErrors.preco}
                  disabled={updateProductMutation.isPending}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      preco: formatBrlCurrencyInput(event.target.value),
                    }))
                  }
                  required
                />
                <Input
                  label="Estoque"
                  name="quantidade_estoque"
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantidade_estoque}
                  error={fieldErrors.quantidade_estoque}
                  disabled={updateProductMutation.isPending}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      quantidade_estoque: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              {message ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
                  {message}
                </p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={closeEdit}
                  disabled={updateProductMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateProductMutation.isPending}>
                  {updateProductMutation.isPending ? (
                    <LoaderCircle className="animate-spin" size={16} />
                  ) : (
                    <Pencil size={16} />
                  )}
                  Salvar alteracoes
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function productToForm(product: Product): ProductForm {
  return {
    nome: product.nome,
    descricao: product.descricao,
    preco: formatCurrency(product.preco),
    quantidade_estoque: String(product.quantidade_estoque),
    categoria: product.categoria,
  };
}

function toProductInput(form: ProductForm): ProductInput | null {
  const preco = parseBrlCurrencyInput(form.preco);
  const quantidadeEstoque = Number(form.quantidade_estoque);

  if (
    !Number.isFinite(preco) ||
    preco < 0 ||
    !Number.isInteger(quantidadeEstoque) ||
    quantidadeEstoque < 0
  ) {
    return null;
  }

  return {
    nome: form.nome.trim(),
    descricao: form.descricao.trim(),
    preco,
    quantidade_estoque: quantidadeEstoque,
    categoria: form.categoria.trim(),
  };
}
