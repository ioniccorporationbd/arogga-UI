import { NextRequest, NextResponse } from "next/server";
import { submitReview } from "@/lib/orders";
function userPhone(request: NextRequest) { return request.headers.get("x-user-phone") || undefined; }
export async function POST(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const phone = userPhone(request);
  if (!phone) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json().catch(() => ({}));
    if (!body.productIds?.length) return NextResponse.json({ error: "Select at least one product" }, { status: 400 });
    const { orderId } = await params;
    return NextResponse.json({ order: submitReview(phone, orderId, body.productIds), message: "Review submitted" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Review submission failed" }, { status: 400 });
  }
}
