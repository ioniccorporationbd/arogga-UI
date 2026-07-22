import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { EcommerceProduct } from "@/lib/products";

let productCache: EcommerceProduct[] | null = null;

export async function getServerProducts(): Promise<EcommerceProduct[]> {
  if (productCache) return productCache;

  const filePath = path.join(process.cwd(), "public", "product-data.Json");
  const file = await readFile(filePath, "utf8");
  const parsed: unknown = JSON.parse(file);

  productCache = Array.isArray(parsed) ? (parsed as EcommerceProduct[]) : [];
  return productCache;
}

export async function getServerProductByIdentifier(identifier: string): Promise<EcommerceProduct | undefined> {
  const products = await getServerProducts();
  return products.find((product) => String(product.id) === identifier || product.slug === identifier);
}
