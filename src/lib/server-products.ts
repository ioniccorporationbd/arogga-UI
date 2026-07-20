import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import type { EcommerceProduct } from "@/lib/products";

let productCache: EcommerceProduct[] | null = null;
let productBySlugCache: Map<string, EcommerceProduct> | null = null;

function parseProductFile(file: string): EcommerceProduct[] {
  try {
    const parsed: unknown = JSON.parse(file);

    return Array.isArray(parsed)
      ? (parsed as EcommerceProduct[])
      : [];
  } catch {
    /*
     * public/data.json contains multiple JSON arrays joined like:
     *
     * [...products][...products]
     *
     * This separates every array and parses them individually.
     */
    const chunks = file.split(/\]\s*\[/g);

    const products: EcommerceProduct[] = [];

    chunks.forEach((chunk, index) => {
      const normalizedChunk = `${
        index === 0 ? "" : "["
      }${chunk}${
        index === chunks.length - 1 ? "" : "]"
      }`;

      const parsedChunk: unknown = JSON.parse(normalizedChunk);

      if (Array.isArray(parsedChunk)) {
        products.push(
          ...(parsedChunk as EcommerceProduct[])
        );
      }
    });

    /*
     * Remove duplicate products.
     * Your data.json currently contains duplicate arrays.
     */
    const uniqueProducts = new Map<
      string,
      EcommerceProduct
    >();

    for (const product of products) {
      const key = product.id || product.slug;

      if (key && !uniqueProducts.has(key)) {
        uniqueProducts.set(key, product);
      }
    }

    return [...uniqueProducts.values()];
  }
}

export async function getServerProducts(): Promise<
  EcommerceProduct[]
> {
  if (productCache) {
    return productCache;
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "data.json"
  );

  const file = await readFile(filePath, "utf8");

  productCache = parseProductFile(file).filter(
    (product) =>
      product.status === "active" &&
      product.visibility === "public"
  );

  productBySlugCache = new Map(
    productCache.map((product) => [
      product.slug,
      product,
    ])
  );

  return productCache;
}

export async function getServerProductBySlug(
  slug: string
) {
  if (!productBySlugCache) {
    await getServerProducts();
  }

  return productBySlugCache?.get(slug);
}