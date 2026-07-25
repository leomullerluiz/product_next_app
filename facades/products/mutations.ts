"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/services/products/service";
import type { ProductInput } from "@/services/products/types";
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
