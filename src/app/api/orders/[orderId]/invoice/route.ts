import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, parseSession } from "@/lib/auth/session";
import { invoiceText } from "@/lib/orders";
function userPhone(request: NextRequest) { const value = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return parseSession(value)?.phone; }
export async function GET(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const phone = userPhone(request);
  if (!phone) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { orderId } = await params;
    const text = invoiceText(phone, orderId);
    return new NextResponse(text, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="invoice-${orderId}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invoice unavailable" }, { status: 404 });
  }
}
