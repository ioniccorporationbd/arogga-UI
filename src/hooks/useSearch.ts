"use client";

import { useMemo } from "react";
import { searchProducts, type ProductSearchOptions } from "@/lib/search";
import { useProducts } from "./useProducts";

export function useSearch(options: ProductSearchOptions) {
  const query = useProducts();
  const results = useMemo(() => searchProducts(query.data ?? [], options), [options, query.data]);
  return { ...query, results };
}
