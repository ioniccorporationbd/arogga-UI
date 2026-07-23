import type { Product, ProductListItem } from "@/types";

export type ProductQuery = {
  q?: string; category?: string; subcategory?: string; brand?: string; minPrice?: number; maxPrice?: number; rating?: number; discount?: number; availability?: string; sort?: string; page?: number; limit?: number;
};

export type ProductListResult = {
  items: ProductListItem[];
  meta: { page: number; limit: number; total: number; pageCount: number; hasNextPage: boolean; hasPreviousPage: boolean };
};

export interface ProductRepository {
  list(query?: ProductQuery): Promise<ProductListResult>;
  searchSuggestions(q: string, limit?: number): Promise<ProductListItem[]>;
  getBySlug(slug: string): Promise<Product | null>;
  getById(id: string): Promise<Product | null>;
}
