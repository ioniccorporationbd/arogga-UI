import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import type { EcommerceProduct } from "@/lib/products";

export const LOCAL_PRODUCT_DATA_FILE = "data.json";
export const LOCAL_PRODUCT_DATA_URL = "/data.json";

let cache: EcommerceProduct[] | null = null;

export async function getProductsData(): Promise<EcommerceProduct[]> {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "public", LOCAL_PRODUCT_DATA_FILE);
  const file = await readFile(filePath, "utf8");
  const parsed: unknown = JSON.parse(file);
  cache = Array.isArray(parsed) ? (parsed as EcommerceProduct[]) : [];
  return cache;
}

export async function getProductByIdentifier(identifier: string) {
  const products = await getProductsData();
  return products.find((product) => String(product.id) === identifier || product.slug === identifier);
}

export async function getProductsByBrandSlug(slug: string) {
  const products = await getProductsData();
  return products.filter((product) => product.brand?.slug === slug || product.brand?.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === slug);
}

export function normalizeProductUrl(product: EcommerceProduct) {
  return `/product/${product.slug || product.id}`;
}
