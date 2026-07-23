import type { Address } from "./Address";
import type { PaymentMethod, DeliveryMethod } from "./Payment";

export type OrderStatus = "pending" | "confirmed" | "processing" | "packed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "returned" | "refunded" | "failed";

export type OrderItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  variantSku?: string;
  image?: string;
};

export type Order = {
  id: string;
  number: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  taxTotal: number;
  grandTotal: number;
  address?: Address;
  paymentMethod?: PaymentMethod;
  deliveryMethod?: DeliveryMethod;
  createdAt: string;
  updatedAt?: string;
};
