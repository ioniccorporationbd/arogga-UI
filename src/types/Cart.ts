import type { ProductVariant } from "./product";

export type CartItem = {
  cartKey: string;
  productId: string;
  slug: string;
  name: string;
  image?: string;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  regularPrice?: number;
  maxQuantity?: number;
  stockStatus?: string;
};

export type CartSummary = {
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  taxTotal: number;
  grandTotal: number;
};
