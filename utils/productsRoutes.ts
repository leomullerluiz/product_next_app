export const productsRoutes = {
  list: "/produtos",
  detail: (id: number | string) => `/produtos/${encodeURIComponent(String(id))}`,
} as const;
