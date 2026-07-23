import { describe, expect, it } from "vitest";

import { addressSchema } from "../src/lib/account/address-domain";
import { buildAccountSummary, createInboxMessage, markMessageRead } from "../src/lib/account/account-summary";
import { cancelOrder, createLocalOrder, findOwnedOrder, requestReturnOrder } from "../src/lib/orders/local-order-repository";
import { LocalPaymentSimulator } from "../src/lib/payments/local-payment-simulator";

const owner = "+8801712345678";
const address = {
  id: "addr-1",
  type: "Home" as const,
  recipientName: "Tamim Hasan",
  phone: "01712345678",
  division: "Dhaka",
  district: "Dhaka",
  area: "Dhanmondi",
  postalCode: "1209",
  streetAddress: "Road 1",
  apartment: "A1",
  floor: "2",
  landmark: "Hospital",
  deliveryInstructions: "Call first",
  isDefault: true,
};
const line = { productId: "100001", variantId: "100001:pack-standard-pack", quantity: 1, name: "Mascara", sku: "SKU", regularPrice: 100, salePrice: 80, itemSubtotal: 80 };

describe("account summary", () => {
  it("counts orders, pending orders, unread inbox, wishlist and cart", () => {
    const summary = buildAccountSummary({
      orders: [{ status: "Pending" }, { status: "Delivered" }],
      inbox: [{ read: false }, { read: true }],
      wishlistCount: 3,
      cartCount: 4,
    });
    expect(summary).toEqual({ orderCount: 2, pendingOrderCount: 1, unreadInboxCount: 1, wishlistCount: 3, cartCount: 4 });
  });
});

describe("inbox", () => {
  it("updates unread count when a message is read", () => {
    const message = createInboxMessage(owner, "delivery", "Order shipped");
    expect(message.read).toBe(false);
    expect(markMessageRead([message], message.id)[0].read).toBe(true);
  });
});

describe("orders", () => {
  it("creates owner-scoped orders and prevents duplicate idempotency keys", () => {
    const state = { orders: [] as import("../src/lib/orders/local-order-repository").LocalOrder[] };
    const first = createLocalOrder(state.orders, { ownerPhone: owner, address, items: [line], totals: { grandTotal: 140, subtotal: 100, discount: 20, vat: 4, shipping: 60 }, paymentMethod: "Cash on Delivery", deliveryMethod: "Standard", idempotencyKey: "idem-1" });
    state.orders = first.orders;
    const second = createLocalOrder(state.orders, { ownerPhone: owner, address, items: [line], totals: { grandTotal: 140, subtotal: 100, discount: 20, vat: 4, shipping: 60 }, paymentMethod: "Cash on Delivery", deliveryMethod: "Standard", idempotencyKey: "idem-1" });
    expect(first.order.id).toBe(second.order.id);
    expect(second.orders).toHaveLength(1);
  });

  it("enforces order ownership and cancellation rules", () => {
    const result = createLocalOrder([], { ownerPhone: owner, address, items: [line], totals: { grandTotal: 140, subtotal: 100, discount: 20, vat: 4, shipping: 60 }, paymentMethod: "Cash on Delivery", deliveryMethod: "Standard", idempotencyKey: "idem-2" });
    expect(findOwnedOrder(result.orders, result.order.id, "+8801999999999")).toBeNull();
    expect(cancelOrder(result.orders, result.order.id, owner, "Changed mind").order.status).toBe("Cancelled");
    expect(() => cancelOrder([{ ...result.order, status: "Delivered" }], result.order.id, owner, "late")).toThrow(/cannot be cancelled/i);
  });

  it("allows return requests for delivered orders", () => {
    const result = createLocalOrder([], { ownerPhone: owner, address, items: [line], totals: { grandTotal: 140, subtotal: 100, discount: 20, vat: 4, shipping: 60 }, paymentMethod: "Cash on Delivery", deliveryMethod: "Standard", idempotencyKey: "idem-3" });
    const returned = requestReturnOrder([{ ...result.order, status: "Delivered" }], result.order.id, owner);
    expect(returned.order.status).toBe("Return Requested");
  });
});

describe("addresses and local payments", () => {
  it("validates complete address form values", () => {
    expect(addressSchema.safeParse(address).success).toBe(true);
    expect(addressSchema.safeParse({ ...address, phone: "123" }).success).toBe(false);
  });

  it("labels non-COD as simulated local payments", async () => {
    const simulator = new LocalPaymentSimulator();
    const result = await simulator.charge({ amount: 100, method: "bKash Demo", orderId: "o1" });
    expect(result.simulated).toBe(true);
    expect(result.message).toContain("Simulated local payment");
  });
});
