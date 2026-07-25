import { apiRequest } from "@/services/api/client";
import type {
  ProductInput,
  ProductListResult,
  ProductResult,
} from "./types";

export function listProducts(accessToken: string) {
  return apiRequest<ProductListResult>("/produtos", {
    headers: authHeaders(accessToken),
  });
}

export function createProduct(accessToken: string, input: ProductInput) {
  return apiRequest<ProductResult>("/produtos", {
    method: "POST",
    headers: authHeaders(accessToken),
    body: input,
  });
}

function authHeaders(accessToken: string) {
  return {
    Authorization: accessToken,
  };
}
