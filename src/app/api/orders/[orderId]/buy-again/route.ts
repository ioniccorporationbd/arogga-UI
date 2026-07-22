import { NextRequest, NextResponse } from "next/server";
import { buyAgain } from "@/lib/orders";
function userPhone(request: NextRequest) { return request.headers.get("x-user-phone") || undefined; }
export async function POST(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const phone = userPhone(request);
  if (!phone) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { orderId } = await params;
    return NextResponse.json({ ...buyAgain(phone, orderId), message: "Available items are ready for cart" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Buy again failed" }, { status: 400 });
  }
}
