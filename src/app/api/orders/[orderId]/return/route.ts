import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, parseSession } from "@/lib/auth/session";
import { requestReturn } from "@/lib/orders";
function userPhone(request: NextRequest) { const value = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return parseSession(value)?.phone; }
export async function POST(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const phone = userPhone(request);
  if (!phone) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await request.json().catch(() => ({}));
    const { orderId } = await params;
    const order = requestReturn(phone, orderId);
    return NextResponse.json({ order, requestId: order.returnRequestId, message: "Return request submitted" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Return request failed" }, { status: 400 });
  }
}
