import { NextRequest, NextResponse } from "next/server";
import { cancelOrder } from "@/lib/orders";

function userPhone(request: NextRequest) { return request.headers.get("x-user-phone") || undefined; }

export async function POST(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const phone = userPhone(request);
  if (!phone) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json().catch(() => ({}));
    if (!body.reason) return NextResponse.json({ error: "Cancellation reason is required" }, { status: 400 });
    const { orderId } = await params;
    return NextResponse.json({ order: cancelOrder(phone, orderId, body.reason, body.comment), message: "Order cancelled successfully" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cancellation failed" }, { status: 400 });
  }
}
