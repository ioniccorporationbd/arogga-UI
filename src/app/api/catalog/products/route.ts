import { NextResponse } from "next/server";
import { queryCatalog } from "@/lib/catalog-index";

function numberParam(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await queryCatalog({
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    subcategory: searchParams.get("subcategory") || undefined,
    brand: searchParams.get("brand") || undefined,
    minPrice: numberParam(searchParams.get("minPrice")),
    maxPrice: numberParam(searchParams.get("maxPrice")),
    rating: numberParam(searchParams.get("rating")),
    discount: numberParam(searchParams.get("discount")),
    availability: searchParams.get("availability") || undefined,
    sort: searchParams.get("sort") || undefined,
    page: numberParam(searchParams.get("page")),
    limit: numberParam(searchParams.get("limit")),
  });

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
    },
  });
}
