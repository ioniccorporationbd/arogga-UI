import { NextRequest, NextResponse } from "next/server";
import { getServerProducts } from "@/lib/server-products";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function GET(request: NextRequest) {
  const products = await getServerProducts();
  const params = request.nextUrl.searchParams;
  const category = normalize(params.get("category") ?? "");
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const page = Math.max(1, Number(params.get("page") ?? 1) || 1);
  const limit = Math.min(60, Math.max(1, Number(params.get("limit") ?? 24) || 24));
  const sort = params.get("sort") ?? "popular";
  const inStock = params.get("inStock") === "1";

  let filtered = products.filter((product) => {
    if (product.status !== "active" || product.visibility !== "public") return false;
    if (inStock && product.inventory.availableQuantity <= 0) return false;

    const categoryTokens = [
      product.taxonomy.department.slug,
      product.taxonomy.category.slug,
      product.taxonomy.subCategory?.slug,
      ...product.taxonomy.collections.map((item) => item.slug),
      ...product.taxonomy.tags,
      product.brand.slug,
    ].filter(Boolean).map((item) => normalize(String(item)));

    const categoryMatch = !category || categoryTokens.some((item) => item === category || item.includes(category) || category.includes(item));
    const searchable = `${product.name} ${product.shortName} ${product.brand.name} ${product.taxonomy.category.name} ${product.taxonomy.subCategory?.name ?? ""}`.toLowerCase();
    const queryMatch = !query || searchable.includes(query);
    return categoryMatch && queryMatch;
  });

  filtered = [...filtered].sort((a, b) => {
    const aPrice = a.pricing.salePrice ?? a.pricing.regularPrice;
    const bPrice = b.pricing.salePrice ?? b.pricing.regularPrice;
    if (sort === "price-asc") return aPrice - bPrice;
    if (sort === "price-desc") return bPrice - aPrice;
    if (sort === "rating") return (b.ratings.average ?? 0) - (a.ratings.average ?? 0);
    if (sort === "newest") return String(b.id).localeCompare(String(a.id));
    return b.ratings.count - a.ratings.count;
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    products: items,
  });
}
