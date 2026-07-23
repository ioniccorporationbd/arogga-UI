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

export type LegacyCartItem = Partial<CartItem> & {
  id?: string;
  price?: number;
  regularPrice?: number;
};

export function buildCartKey(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

export function validateCartQuantity(quantity: number, maxQuantity: number, stock = maxQuantity) {
  const safeMax = Math.max(1, Math.min(maxQuantity || 1, stock || 1));
  const safeQuantity = Math.max(1, Math.min(Math.floor(quantity || 1), safeMax));
  return {
    quantity: safeQuantity,
    warning: safeQuantity !== quantity ? "Quantity adjusted to available limit" : undefined,
  };
}

export function mergeCartLines(items: CartItem[], item: CartItem, quantity = item.quantity) {
  const validated = validateCartQuantity(quantity, item.maxQuantity);
  const found = items.find((entry) => entry.cartKey === item.cartKey);
  if (!found) return [{ ...item, quantity: validated.quantity }, ...items];
  return items.map((entry) => {
    if (entry.cartKey !== item.cartKey) return entry;
    const next = validateCartQuantity(entry.quantity + quantity, item.maxQuantity);
    return { ...entry, ...item, quantity: next.quantity };
  });
}

export function normalizeCartItem(item: LegacyCartItem): CartItem | null {
  const productId = String(item.productId || item.id || "");
  const variantId = String(item.variantId || item.id || productId || "");
  if (!productId || !variantId || !item.name || !item.slug || !item.image) return null;
  return {
    cartKey: item.cartKey || buildCartKey(productId, variantId),
    productId,
    variantId,
    slug: item.slug,
    name: item.name,
    image: item.image,
    sku: item.sku || variantId,
    selectedOptions: item.selectedOptions || {},
    quantity: Math.max(1, Number(item.quantity || 1)),
    maxQuantity: Math.max(1, Number(item.maxQuantity || 99)),
    regularPrice: item.regularPrice,
    salePrice: item.salePrice ?? item.price,
  };
}

export function calculateCartDisplayTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + (item.regularPrice ?? item.salePrice ?? 0) * item.quantity, 0);
  const saleSubtotal = items.reduce((sum, item) => sum + (item.salePrice ?? item.regularPrice ?? 0) * item.quantity, 0);
  const discount = Math.max(0, subtotal - saleSubtotal);
  const vat = Math.round(saleSubtotal * 0.05);
  const shipping = saleSubtotal > 0 && saleSubtotal < 999 ? 60 : 0;
  const total = saleSubtotal + vat;
  const grandTotal = total + shipping;
  return { subtotal, discount, vat, shipping, total, grandTotal };
}
