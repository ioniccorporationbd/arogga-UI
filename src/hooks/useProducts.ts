"use client";

import { useQuery } from "@tanstack/react-query";
import type { EcommerceProduct } from "@/lib/products";

export const PRODUCT_DATA_QUERY_KEY = ["products", "catalog-api", "legacy"] as const;

async function fetchProducts(): Promise<EcommerceProduct[]> {
  const response = await fetch("/api/catalog/products?shape=legacy", { cache: "force-cache" });
  if (!response.ok) throw new Error(`Unable to load catalog products (${response.status})`);
  const payload: unknown = await response.json();
  if (payload && typeof payload === "object" && Array.isArray((payload as { items?: unknown }).items)) {
    return (payload as { items: EcommerceProduct[] }).items;
  }
  return Array.isArray(payload) ? (payload as EcommerceProduct[]) : [];
}

export function useProducts() {
  return useQuery({ queryKey: PRODUCT_DATA_QUERY_KEY, queryFn: fetchProducts, staleTime: 5 * 60 * 1000 });
}
