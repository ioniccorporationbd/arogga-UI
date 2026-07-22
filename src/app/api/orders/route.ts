import { NextRequest, NextResponse } from "next/server";
import { getOrders, type OrderQuery } from "@/lib/orders";

function userPhone(request: NextRequest) {
  return request.headers.get("x-user-phone") || undefined;
}

export async function GET(request: NextRequest) {
  if (!userPhone(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sp = request.nextUrl.searchParams;
  const query: OrderQuery = {
    search: sp.get("search") || undefined,
    status: sp.get("status") || undefined,
    paymentStatus: sp.get("paymentStatus") || undefined,
    paymentMethod: sp.get("paymentMethod") || undefined,
    deliveryStatus: sp.get("deliveryStatus") || undefined,
    returnStatus: sp.get("returnStatus") || undefined,
    minAmount: sp.get("minAmount") ? Number(sp.get("minAmount")) : undefined,
    maxAmount: sp.get("maxAmount") ? Number(sp.get("maxAmount")) : undefined,
    from: sp.get("from") || undefined,
    to: sp.get("to") || undefined,
    sort: sp.get("sort") || undefined,
    page: sp.get("page") ? Number(sp.get("page")) : 1,
    perPage: sp.get("perPage") ? Number(sp.get("perPage")) : 10,
  };
  return NextResponse.json(getOrders(userPhone(request), query));
}
