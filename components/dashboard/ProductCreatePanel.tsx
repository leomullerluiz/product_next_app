"use client";

import { LoaderCircle, PackagePlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCreateProductMutation } from "@/facades/products";
import type { ProductInput } from "@/facades/products";
import { getErrorMessage, getFieldErrors } from "@/services/api/errors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/contexts/ToastContext";
import {
  formatBrlCurrencyInput,
  parseBrlCurrencyInput,
} from "@/utils/format";

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

export function ProductCreatePanel({
  accessToken,
  onCreated,
}: {
  accessToken: string;
  onCreated: () => void;
}) {
  const { showToast } = useToast();
  const createProductMutation = useCreateProductMutation(accessToken);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setMessage("");

    const payload = toProductInput(form);

    if (!payload) {
      setMessage("Revise preco e estoque antes de cadastrar.");
      return;
    }

    try {
      const result = await createProductMutation.mutateAsync(payload);
      setForm(initialForm);
      showToast({
        variant: "success",
        title: "Produto cadastrado",
        description: result.product.nome,
      });
      onCreated();
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setMessage(getErrorMessage(error));
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Produtos
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
          Cadastrar produto
        </h2>
      </div>

      <Card>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nome"
              name="nome"
              value={form.nome}
              error={fieldErrors.nome}
              onChange={(event) =>
                setForm((current) => ({ ...current, nome: event.target.value }))
              }
              required
            />
            <Input
              label="Categoria"
              name="categoria"
              value={form.categoria}
              error={fieldErrors.categoria}
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

          <div>
            <Button type="submit" disabled={createProductMutation.isPending}>
              {createProductMutation.isPending ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : (
                <PackagePlus size={16} />
              )}
              Cadastrar produto
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
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
