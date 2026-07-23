import { z } from "zod";

import { findProductVariant, normalizeProductVariants } from "../product-variants";

export const cartRecalculateSchema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), variantId: z.string().min(1), quantity: z.number().int().positive() })).default([]),
  couponCode: z.string().trim().optional(),
  deliveryMethod: z.string().trim().optional(),
});

export type CartRecalculateInput = z.infer<typeof cartRecalculateSchema>;

type SourceProduct = Parameters<typeof normalizeProductVariants>[0] & { id?: string | number; slug?: string; name?: string };

const VALID_COUPONS: Record<string, number> = { SAVE10: 0.1, AROGGA10: 0.1 };

function productId(product: SourceProduct) {
  return String(product.id || product.slug || "");
}

export function recalculateCartTotals(input: CartRecalculateInput, products: SourceProduct[]) {
  const warnings: string[] = [];
  const lines = input.items.map((item) => {
    const product = products.find((entry) => productId(entry) === item.productId || entry.slug === item.productId);
    const lineWarnings: string[] = [];
    if (!product) {
      lineWarnings.push("Product not found");
      return { ...item, name: "Unavailable product", slug: "", image: "", sku: "", selectedOptions: {}, quantity: 0, maxQuantity: 0, regularPrice: 0, salePrice: 0, itemSubtotal: 0, itemDiscount: 0, stock: 0, available: false, warnings: lineWarnings };
    }
    const variant = findProductVariant(product, item.variantId);
    if (!variant) {
      lineWarnings.push("Variant not found");
      return { ...item, name: product.name || "Unavailable variant", slug: product.slug || "", image: "", sku: "", selectedOptions: {}, quantity: 0, maxQuantity: 0, regularPrice: 0, salePrice: 0, itemSubtotal: 0, itemDiscount: 0, stock: 0, available: false, warnings: lineWarnings };
    }
    if (!variant.available || variant.stock <= 0) lineWarnings.push("Out of stock");
    const allowedQuantity = Math.max(0, Math.min(item.quantity, variant.maxQuantity, variant.stock));
    if (allowedQuantity !== item.quantity && variant.stock > 0) lineWarnings.push("Quantity adjusted to available stock");
    const effectivePrice = variant.salePrice ?? variant.regularPrice;
    const itemSubtotal = effectivePrice * allowedQuantity;
    const itemDiscount = Math.max(0, (variant.regularPrice - effectivePrice) * allowedQuantity);
    return {
      productId: productId(product),
      variantId: variant.id,
      cartKey: `${productId(product)}:${variant.id}`,
      slug: product.slug || productId(product),
      name: product.name || variant.name,
      image: variant.image || "",
      sku: variant.sku,
      selectedOptions: variant.options,
      quantity: allowedQuantity,
      maxQuantity: variant.maxQuantity,
      regularPrice: variant.regularPrice,
      salePrice: effectivePrice,
      itemSubtotal,
      itemDiscount,
      stock: variant.stock,
      available: variant.available,
      warnings: lineWarnings,
    };
  });

  const subtotal = lines.reduce((sum, line) => sum + line.regularPrice * line.quantity, 0);
  const saleSubtotal = lines.reduce((sum, line) => sum + line.itemSubtotal, 0);
  const discount = lines.reduce((sum, line) => sum + line.itemDiscount, 0);
  const coupon = input.couponCode?.trim().toUpperCase();
  const couponRate = coupon ? VALID_COUPONS[coupon] : 0;
  if (coupon && !couponRate) warnings.push("Coupon code is not valid");
  const couponDiscount = Math.round(saleSubtotal * couponRate);
  const taxable = Math.max(0, saleSubtotal - couponDiscount);
  const vat = Math.round(taxable * 0.05);
  const shipping = taxable > 0 && taxable < 999 ? input.deliveryMethod === "pickup" ? 0 : 60 : 0;
  const grandTotal = taxable + vat + shipping;

  return {
    lines,
    summary: { subtotal, saleSubtotal, discount, couponDiscount, vat, shipping, total: taxable + vat, grandTotal },
    warnings,
  };
}
