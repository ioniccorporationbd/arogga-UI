import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { EcommerceProduct } from "@/lib/products";

let productCache: EcommerceProduct[] | null = null;

export async function getServerProducts(): Promise<EcommerceProduct[]> {
  if (productCache) return productCache;

  const filePath = path.join(process.cwd(), "public", "tara.json");
  const file = await readFile(filePath, "utf8");
  const parsed: unknown = JSON.parse(file);

  productCache = Array.isArray(parsed) ? (parsed as EcommerceProduct[]) : [];
  return productCache;
}

export async function getServerProductBySlug(slug: string) {
  const products = await getServerProducts();
  return products.find((product) => product.slug === slug);
}
