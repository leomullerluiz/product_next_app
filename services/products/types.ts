export type Product = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade_estoque: number;
  categoria: string;
  created_at: string;
  updated_at?: string | null;
};

export type ProductInput = {
  nome: string;
  descricao: string;
  preco: number;
  quantidade_estoque: number;
  categoria: string;
};

export type ProductUpdateInput = {
  id: Product["id"];
  input: ProductInput;
};

export type ProductListResult = {
  products: Product[];
};

export type ProductResult = {
  product: Product;
};
