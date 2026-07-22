export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "returned"
  | "refund_processing"
  | "refunded";

export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded" | "partial_refund";
export type PaymentMethod = "bKash" | "Nagad" | "Rocket" | "Visa" | "Mastercard" | "Bank Transfer" | "Cash on Delivery";

export interface Address {
  name: string;
  phone: string;
  country: string;
  city: string;
  area: string;
  postOffice?: string;
  landmark?: string;
  line1: string;
}

export interface OrderProduct {
  id: string;
  productId: string;
  name: string;
  image: string;
  seller: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  finalPrice: number;
  status: string;
  isReturnEligible: boolean;
  isReviewed: boolean;
  availability: "in_stock" | "out_of_stock" | "limited";
}

export interface TrackingEvent {
  id: string;
  title: string;
  description: string;
  location?: string;
  date: string;
  time: string;
  completed: boolean;
  active: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  ownerPhone: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  products: OrderProduct[];
  shippingAddress: Address;
  billingAddress?: Address;
  customer: { name: string; phone: string };
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  tax: number;
  grandTotal: number;
  estimatedDelivery?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  courierName?: string;
  currentLocation?: string;
  deliveryAgent?: { name: string; phone: string };
  coupon?: { code: string; discount: number };
  cancellationReason?: string;
  returnRequestId?: string;
  trackingEvents: TrackingEvent[];
}

export type OrderQuery = {
  search?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  deliveryStatus?: string;
  returnStatus?: string;
  minAmount?: number;
  maxAmount?: number;
  from?: string;
  to?: string;
  sort?: string;
  page?: number;
  perPage?: number;
};

export type OrderListResponse = {
  orders: Order[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  summary: Record<string, number>;
  statusCounts: Record<string, number>;
};

const customer = { name: "Arogga Customer", phone: "01711111111" };
const address: Address = {
  name: "Mohammed Tamim Hasan",
  phone: "01711111111",
  country: "Bangladesh",
  city: "Dhaka",
  area: "Dhanmondi",
  postOffice: "Dhanmondi Post Office",
  landmark: "Near City Hospital",
  line1: "House 22, Road 8, Dhanmondi",
};

const productImages = [
  "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/thumbnail.webp",
  "https://cdn.dummyjson.com/product-images/beauty/gucci-bloom-eau-de/thumbnail.webp",
  "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/thumbnail.webp",
  "https://cdn.dummyjson.com/product-images/womens-dresses/womens-dresses-corset-leather-with-skirt/thumbnail.webp",
  "https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp",
];

const steps = ["Order Placed", "Payment Confirmed", "Order Confirmed", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered"];
const statusStep: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 2,
  processing: 3,
  packed: 4,
  shipped: 5,
  out_for_delivery: 6,
  delivered: 7,
  cancelled: 1,
  return_requested: 7,
  returned: 7,
  refund_processing: 7,
  refunded: 7,
};

function iso(daysAgo: number, hour = 10) {
  const date = new Date("2026-07-22T10:00:00.000Z");
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour);
  return date.toISOString();
}

function dateText(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function timeText(isoDate: string) { return new Date(isoDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }

function makeEvents(status: OrderStatus, createdAt: string): TrackingEvent[] {
  const activeIndex = statusStep[status];
  const events = steps.map((title, index) => {
    const d = new Date(createdAt);
    d.setHours(9 + index);
    d.setDate(d.getDate() + Math.max(0, index - 1));
    return {
      id: `${title}-${index}`,
      title,
      description: index <= activeIndex ? `${title} completed for this order.` : `${title} is waiting for the previous step.`,
      location: index >= 5 ? "Dhaka Sorting Hub" : "Arogga Fulfillment Center",
      date: dateText(d.toISOString()),
      time: timeText(d.toISOString()),
      completed: index < activeIndex || status === "delivered",
      active: index === activeIndex && status !== "delivered",
    };
  });
  if (["cancelled", "return_requested", "returned", "refund_processing", "refunded"].includes(status)) {
    events.push({
      id: `${status}-event`,
      title: status.replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      description: `Order status changed to ${status.replaceAll("_", " ")}.`,
      location: "Customer Support",
      date: dateText(new Date().toISOString()),
      time: timeText(new Date().toISOString()),
      completed: true,
      active: true,
    });
  }
  return events;
}

function makeProduct(seed: number, overrides: Partial<OrderProduct> = {}): OrderProduct {
  const names = ["Sports Sneakers Off White & Red", "Gucci Bloom Eau de", "Apple iPhone Charger", "Leather Corset Dress", "Premium Ice Cream Pack"];
  const price = [14249, 89, 19, 185, 8][seed % 5];
  const discount = seed % 2 ? Math.round(price * 0.08) : 0;
  return {
    id: `line-${seed}`,
    productId: String(100091 + seed),
    name: names[seed % names.length],
    image: productImages[seed % productImages.length],
    seller: ["Off White", "Gucci", "Apple", "Fashion Hub", "Arogga Grocery"][seed % 5],
    size: ["Standard", "M", "XL", "500ml", "One Size"][seed % 5],
    color: ["Off White & Red", "Pink", "White", "Black", "Vanilla"][seed % 5],
    quantity: (seed % 3) + 1,
    unitPrice: price,
    discount,
    finalPrice: price - discount,
    status: "Available",
    isReturnEligible: seed % 2 === 0,
    isReviewed: false,
    availability: seed % 7 === 0 ? "out_of_stock" : seed % 4 === 0 ? "limited" : "in_stock",
    ...overrides,
  };
}

function makeOrder(index: number, status: OrderStatus, paymentStatus: PaymentStatus, method: PaymentMethod): Order {
  const products = [makeProduct(index), makeProduct(index + 1)].slice(0, index % 3 === 0 ? 1 : 2);
  const subtotal = products.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0);
  const discount = products.reduce((sum, p) => sum + p.discount * p.quantity, 0) + (index % 2 ? 75 : 0);
  const deliveryCharge = status === "delivered" ? 0 : 60;
  const tax = Math.round((subtotal - discount) * 0.015);
  const grandTotal = subtotal - discount + deliveryCharge + tax;
  const createdAt = iso(index + 1, 8 + index);
  const estimated = new Date(createdAt); estimated.setDate(estimated.getDate() + 3 + (index % 3));
  return {
    id: `ord-${1000 + index}`,
    orderNumber: `ARG-${20260700 + index}`,
    ownerPhone: customer.phone,
    createdAt,
    updatedAt: iso(index, 12),
    status,
    paymentStatus,
    paymentMethod: method,
    products,
    shippingAddress: address,
    billingAddress: address,
    customer,
    subtotal,
    discount,
    deliveryCharge,
    tax,
    grandTotal,
    estimatedDelivery: estimated.toISOString(),
    deliveredAt: status === "delivered" ? iso(index - 1, 16) : undefined,
    trackingNumber: `TRK${880170000 + index}`,
    courierName: ["Pathao Courier", "RedX", "Steadfast", "Paperfly"][index % 4],
    currentLocation: ["Dhanmondi Hub", "Dhaka Sorting Hub", "Mohakhali Dispatch", "Customer Area"][index % 4],
    deliveryAgent: index % 2 === 0 ? { name: "Rahim Uddin", phone: "01810117100" } : undefined,
    coupon: index % 2 ? { code: "AROGGA75", discount: 75 } : undefined,
    trackingEvents: makeEvents(status, createdAt),
  };
}

const seedOrders: Order[] = [
  makeOrder(1, "pending", "unpaid", "Cash on Delivery"),
  makeOrder(2, "confirmed", "paid", "bKash"),
  makeOrder(3, "processing", "paid", "Nagad"),
  makeOrder(4, "packed", "paid", "Visa"),
  makeOrder(5, "shipped", "paid", "Mastercard"),
  makeOrder(6, "out_for_delivery", "paid", "Rocket"),
  makeOrder(7, "delivered", "paid", "bKash"),
  makeOrder(8, "cancelled", "refunded", "Bank Transfer"),
  makeOrder(9, "returned", "refunded", "Visa"),
  makeOrder(10, "refund_processing", "partial_refund", "Nagad"),
  makeOrder(11, "refunded", "refunded", "Rocket"),
  makeOrder(12, "processing", "paid", "Dutch-Bangla Bank" as PaymentMethod),
];

let orders = seedOrders;
function owned(phone?: string) { return orders.filter((order) => !phone || order.ownerPhone === phone); }

export function getOrders(phone: string | undefined, query: OrderQuery): OrderListResponse {
  let result = owned(phone);
  const search = query.search?.trim().toLowerCase();
  if (search) {
    result = result.filter((order) =>
      order.orderNumber.toLowerCase().includes(search) ||
      order.trackingNumber?.toLowerCase().includes(search) ||
      order.products.some((p) => p.name.toLowerCase().includes(search) || p.seller.toLowerCase().includes(search)),
    );
  }
  if (query.status && query.status !== "all") result = result.filter((o) => o.status === query.status);
  if (query.paymentStatus && query.paymentStatus !== "all") result = result.filter((o) => o.paymentStatus === query.paymentStatus);
  if (query.paymentMethod && query.paymentMethod !== "all") result = result.filter((o) => o.paymentMethod === query.paymentMethod);
  if (query.deliveryStatus && query.deliveryStatus !== "all") result = result.filter((o) => ["shipped", "out_for_delivery", "delivered"].includes(o.status) === (query.deliveryStatus === "active"));
  if (query.returnStatus && query.returnStatus !== "all") result = result.filter((o) => ["return_requested", "returned", "refund_processing", "refunded"].includes(o.status));
  if (query.minAmount) result = result.filter((o) => o.grandTotal >= Number(query.minAmount));
  if (query.maxAmount) result = result.filter((o) => o.grandTotal <= Number(query.maxAmount));
  if (query.from) result = result.filter((o) => new Date(o.createdAt) >= new Date(String(query.from)));
  if (query.to) result = result.filter((o) => new Date(o.createdAt) <= new Date(String(query.to)));

  const sort = query.sort || "newest";
  result = [...result].sort((a, b) => {
    if (sort === "oldest") return +new Date(a.createdAt) - +new Date(b.createdAt);
    if (sort === "highest") return b.grandTotal - a.grandTotal;
    if (sort === "lowest") return a.grandTotal - b.grandTotal;
    if (sort === "updated") return +new Date(b.updatedAt) - +new Date(a.updatedAt);
    return +new Date(b.createdAt) - +new Date(a.createdAt);
  });

  const all = owned(phone);
  const summary: Record<string, number> = {
    total: all.length,
    processing: all.filter((o) => o.status === "processing").length,
    shipped: all.filter((o) => ["shipped", "out_for_delivery"].includes(o.status)).length,
    delivered: all.filter((o) => o.status === "delivered").length,
    cancelled: all.filter((o) => o.status === "cancelled").length,
    returned: all.filter((o) => ["returned", "return_requested", "refund_processing", "refunded"].includes(o.status)).length,
  };
  const statusCounts = all.reduce<Record<string, number>>((acc, order) => {
    acc.all = (acc.all || 0) + 1;
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  const total = result.length;
  const page = Math.max(1, Number(query.page || 1));
  const perPage = Math.max(1, Number(query.perPage || 10));
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return { orders: result.slice((page - 1) * perPage, page * perPage), total, page, perPage, totalPages, summary, statusCounts };
}

export function getOrder(phone: string | undefined, orderId: string) {
  return owned(phone).find((order) => order.id === orderId || order.orderNumber === orderId) || null;
}

export function cancelOrder(phone: string | undefined, orderId: string, reason: string, comment?: string) {
  const order = getOrder(phone, orderId);
  if (!order) throw new Error("Order not found");
  if (["shipped", "out_for_delivery", "delivered", "cancelled", "returned", "refunded"].includes(order.status)) throw new Error("This order cannot be cancelled now.");
  orders = orders.map((item) => item.id === order.id ? {
    ...item,
    status: "cancelled",
    paymentStatus: item.paymentStatus === "paid" ? "refunded" : item.paymentStatus,
    cancellationReason: comment ? `${reason} — ${comment}` : reason,
    updatedAt: new Date().toISOString(),
    trackingEvents: makeEvents("cancelled", item.createdAt),
  } : item);
  return getOrder(phone, orderId)!;
}

export function requestReturn(phone: string | undefined, orderId: string) {
  const order = getOrder(phone, orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "delivered") throw new Error("Returns are only available for delivered orders.");
  orders = orders.map((item) => item.id === order.id ? {
    ...item,
    status: "return_requested",
    returnRequestId: `RTN-${Date.now().toString().slice(-7)}`,
    updatedAt: new Date().toISOString(),
    trackingEvents: makeEvents("return_requested", item.createdAt),
  } : item);
  return getOrder(phone, orderId)!;
}

export function submitReview(phone: string | undefined, orderId: string, productIds: string[]) {
  const order = getOrder(phone, orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "delivered") throw new Error("Reviews are only available for delivered products.");
  orders = orders.map((item) => item.id === order.id ? {
    ...item,
    products: item.products.map((p) => productIds.includes(p.id) ? { ...p, isReviewed: true } : p),
    updatedAt: new Date().toISOString(),
  } : item);
  return getOrder(phone, orderId)!;
}

export function buyAgain(phone: string | undefined, orderId: string) {
  const order = getOrder(phone, orderId);
  if (!order) throw new Error("Order not found");
  return {
    added: order.products.filter((p) => p.availability !== "out_of_stock"),
    unavailable: order.products.filter((p) => p.availability === "out_of_stock"),
  };
}

export function invoiceText(phone: string | undefined, orderId: string) {
  const order = getOrder(phone, orderId);
  if (!order) throw new Error("Invoice unavailable");
  return `Invoice ${order.orderNumber}\nCustomer: ${order.customer.name}\nTotal: ${order.grandTotal}\nPayment: ${order.paymentMethod} (${order.paymentStatus})`;
}
