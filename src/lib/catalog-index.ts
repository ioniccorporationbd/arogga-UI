import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

export type ProductSearchItem = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  subcategory?: string | null;
  subcategorySlug?: string | null;
  image: string;
  price: number;
  salePrice?: number;
  discountPercentage: number;
  stockStatus: string;
  rating: number;
  sold: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  tags: string[];
};

export type CatalogQuery = {
  q?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availability?: string;
  discount?: number;
  sort?: string;
  page?: number;
  limit?: number;
};

let indexCache: ProductSearchItem[] | null = null;

async function readJson<T>(filename: string): Promise<T> {
  const filePath = path.join(process.cwd(), "public", "data", filename);
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

export async function getProductIndex() {
  if (indexCache) return indexCache;
  indexCache = await readJson<ProductSearchItem[]>("products-index.json");
  return indexCache;
}

function includes(value: string | undefined | null, query: string) {
  return String(value || "").toLowerCase().includes(query.toLowerCase());
}

function score(item: ProductSearchItem, q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return 0;
  let result = 0;
  if (item.name.toLowerCase() === query) result += 80;
  if (includes(item.name, query)) result += 40;
  if (includes(item.brand, query)) result += 18;
  if (includes(item.category, query)) result += 12;
  if (item.tags.some((tag) => includes(tag, query))) result += 10;
  return result;
}

export async function queryCatalog(query: CatalogQuery) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(60, Math.max(1, query.limit || 24));
  const minPrice = Number.isFinite(query.minPrice) ? Number(query.minPrice) : undefined;
  const maxPrice = Number.isFinite(query.maxPrice) ? Number(query.maxPrice) : undefined;
  const rating = Number.isFinite(query.rating) ? Number(query.rating) : undefined;
  const discount = Number.isFinite(query.discount) ? Number(query.discount) : undefined;
  const q = query.q?.trim() || "";

  let items = await getProductIndex();

  if (query.category) items = items.filter((item) => item.categorySlug === query.category);
  if (query.subcategory) items = items.filter((item) => item.subcategorySlug === query.subcategory);
  if (query.brand) items = items.filter((item) => item.brandSlug === query.brand);
  if (minPrice !== undefined) items = items.filter((item) => (item.salePrice || item.price) >= minPrice);
  if (maxPrice !== undefined) items = items.filter((item) => (item.salePrice || item.price) <= maxPrice);
  if (rating !== undefined) items = items.filter((item) => item.rating >= rating);
  if (discount !== undefined) items = items.filter((item) => item.discountPercentage >= discount);
  if (query.availability === "in-stock") items = items.filter((item) => item.stockStatus !== "out_of_stock");
  if (q) items = items.map((item) => ({ item, score: score(item, q) })).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score).map((entry) => entry.item);

  switch (query.sort) {
    case "price-asc": items = [...items].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break;
    case "price-desc": items = [...items].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break;
    case "rating": items = [...items].sort((a, b) => b.rating - a.rating); break;
    case "discount": items = [...items].sort((a, b) => b.discountPercentage - a.discountPercentage); break;
    case "best-selling": items = [...items].sort((a, b) => b.sold - a.sold); break;
    case "newest": items = [...items].filter((item) => item.newArrival).concat(items.filter((item) => !item.newArrival)); break;
    default: items = [...items].sort((a, b) => Number(b.featured) - Number(a.featured) || b.sold - a.sold || b.rating - a.rating);
  }

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    meta: { page: safePage, limit, total, pageCount, hasNextPage: safePage < pageCount, hasPreviousPage: safePage > 1 },
  };
}
