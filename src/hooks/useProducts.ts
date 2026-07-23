"use client";

import { useQuery } from "@tanstack/react-query";
import type { EcommerceProduct } from "@/lib/products";

export const PRODUCT_DATA_QUERY_KEY = ["products", "data-json"] as const;

async function fetchProducts(): Promise<EcommerceProduct[]> {
  const response = await fetch("/data.json", { cache: "force-cache" });
  if (!response.ok) throw new Error(`Unable to load /data.json (${response.status})`);
  const payload: unknown = await response.json();
  return Array.isArray(payload) ? (payload as EcommerceProduct[]) : [];
}

export function useProducts() {
  return useQuery({ queryKey: PRODUCT_DATA_QUERY_KEY, queryFn: fetchProducts, staleTime: 5 * 60 * 1000 });
}
