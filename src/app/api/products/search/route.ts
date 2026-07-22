import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { getCurrencySymbol, getProductPrice, type EcommerceProduct } from "@/lib/products";

type ProductIndex = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  brand: string;
  department: string;
  category: string;
  subCategory: string;
  price: number;
  currency: string;
  image: string;
  href: string;
};

let cache: ProductIndex[] | null = null;

function toIndex(product: EcommerceProduct): ProductIndex {
  const currency = product.pricing?.currency || "BDT";

  return {
    id: String(product.id),
    slug: product.slug,
    name: product.name,
    shortName: product.shortName || product.name,
    brand: product.brand?.name || "Brand",
    department: product.taxonomy?.department?.name || "Store",
    category: product.taxonomy?.category?.name || "Products",
    subCategory: product.taxonomy?.subCategory?.name || product.taxonomy?.category?.name || "Products",
    price: getProductPrice(product),
    currency: getCurrencySymbol(currency),
    image: product.media?.featuredImage?.thumbnailUrl || product.media?.featuredImage?.url || "/images/product-fallback.png",
    href: `/products/${product.id}`,
  };
}

async function getIndex() {
  if (cache) return cache;

  const file = await readFile(path.join(process.cwd(), "public", "data.json"), "utf8");
  const parsed: unknown = JSON.parse(file);
  const products = Array.isArray(parsed) ? (parsed as EcommerceProduct[]) : [];

  cache = products
    .filter((product) => (product.status ?? "active") === "active" && (product.visibility ?? "public") === "public")
    .map(toIndex);

  return cache;
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") || "").trim().toLowerCase();
  const limit = Math.min(20, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 8));

  if (q.length < 2) {
    return NextResponse.json({ results: [] }, { headers: { "Cache-Control": "public, max-age=300" } });
  }

  const terms = q.split(/\s+/).filter(Boolean);
  const products = await getIndex();
  const results = products
    .map((product) => {
      const haystack = [
        product.id,
        product.slug,
        product.name,
        product.shortName,
        product.brand,
        product.department,
        product.category,
        product.subCategory,
      ].join(" ").toLowerCase();
      const score = terms.reduce(
        (sum, term) => sum + (product.id === term ? 10 : product.name.toLowerCase().startsWith(term) ? 5 : haystack.includes(term) ? 1 : 0),
        0,
      );
      return { product, score };
    })
    .filter((entry) => entry.score >= terms.length)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .slice(0, limit)
    .map((entry) => entry.product);

  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } },
  );
}
