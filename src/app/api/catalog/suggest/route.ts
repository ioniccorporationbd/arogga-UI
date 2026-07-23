import { NextResponse } from "next/server";
import { queryCatalog } from "@/lib/catalog-index";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const limit = Number(searchParams.get("limit") || 10);
  const result = await queryCatalog({ q, limit: Math.min(20, Math.max(1, limit)) });

  return NextResponse.json({
    q,
    suggestions: result.items.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      category: item.category,
      image: item.image,
      price: item.price,
      salePrice: item.salePrice,
      stockStatus: item.stockStatus,
      href: `/product/${item.slug}`,
    })),
  }, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
