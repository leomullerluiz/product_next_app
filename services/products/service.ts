import { apiRequest } from "@/services/api/client";
import { productsRoutes } from "@/utils/productsRoutes";
import type {
  ProductInput,
  ProductListResult,
  ProductResult,
} from "./types";

export function listProducts(accessToken: string) {
  return apiRequest<ProductListResult>(productsRoutes.list, {
    headers: authHeaders(accessToken),
  });
}

export function createProduct(accessToken: string, input: ProductInput) {
  return apiRequest<ProductResult>(productsRoutes.list, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: input,
  });
}

export function updateProduct(
  accessToken: string,
  id: number,
  input: ProductInput,
) {
  return apiRequest<ProductResult>(productsRoutes.detail(id), {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: input,
  });
}

export function deleteProduct(accessToken: string, id: number) {
  return apiRequest<void>(productsRoutes.detail(id), {
    method: "DELETE",
    headers: authHeaders(accessToken),
  });
}

function authHeaders(accessToken: string) {
  return {
    Authorization: accessToken,
  };
}
