"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/products/service";
import type { ProductInput, ProductUpdateInput } from "@/services/products/types";
import { productsKeys } from "./keys";

export function useCreateProductMutation(accessToken: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProductInput) => createProduct(accessToken ?? "", input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
}

export function useUpdateProductMutation(accessToken: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: ProductUpdateInput) =>
      updateProduct(accessToken ?? "", id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
}

export function useDeleteProductMutation(accessToken: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(accessToken ?? "", id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
}
