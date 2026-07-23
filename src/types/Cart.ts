export type CartItem = {
  cartKey: string;
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  image: string;
  sku: string;
  selectedOptions: Record<string, string>;
  quantity: number;
  maxQuantity: number;
  regularPrice?: number;
  salePrice?: number;
};

export type CartSummary = {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  vat: number;
  shipping: number;
  total: number;
  grandTotal: number;
};
