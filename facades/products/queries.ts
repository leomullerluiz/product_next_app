"use client";

import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/services/products/service";
import { productsKeys } from "./keys";

export function useProductsQuery(accessToken: string | undefined) {
  return useQuery({
    queryKey: productsKeys.lists(),
    queryFn: () => listProducts(accessToken ?? ""),
    enabled: Boolean(accessToken),
  });
}
