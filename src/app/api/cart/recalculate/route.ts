import { NextResponse } from "next/server";

import { cartRecalculateSchema, recalculateCartTotals } from "@/lib/cart/recalculate";
import { getProductsData } from "@/lib/data";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = cartRecalculateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid cart payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const products = await getProductsData();
  const result = recalculateCartTotals(parsed.data, products as Parameters<typeof recalculateCartTotals>[1]);
  return NextResponse.json({ ok: true, ...result });
}
