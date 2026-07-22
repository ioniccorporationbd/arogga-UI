import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/orders";
function userPhone(request: NextRequest) { return request.headers.get("x-user-phone") || undefined; }
export async function GET(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const phone = userPhone(request);
  if (!phone) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { orderId } = await params;
  const order = getOrder(phone, orderId);
  if (!order) return NextResponse.json({ error: "Tracking information not found" }, { status: 404 });
  return NextResponse.json({
    courierName: order.courierName,
    trackingNumber: order.trackingNumber,
    currentLocation: order.currentLocation,
    expectedDelivery: order.estimatedDelivery,
    deliveryAgent: order.deliveryAgent,
    lastUpdated: order.updatedAt,
    trackingEvents: order.trackingEvents,
  });
}
