import { describe, expect, it } from "vitest";

import { buildCartKey, mergeCartLines, validateCartQuantity } from "../src/lib/cart/cart-domain";
import { recalculateCartTotals } from "../src/lib/cart/recalculate";
import { normalizeProductVariants } from "../src/lib/product-variants";
import { shouldRequireWishlistLogin } from "../src/lib/wishlist/wishlist-domain";

const product = {
  id: "p1",
  slug: "demo-product",
  name: "Demo Product",
  pricing: { regularPrice: 120, salePrice: 100 },
  inventory: { availableQuantity: 8 },
  purchaseRules: { maximumQuantity: 5 },
  media: { featuredImage: { url: "/demo.jpg" } },
  options: [
    { name: "Pack", value: "10 tablets" },
    { name: "Pack", value: "20 tablets" },
  ],
};

describe("product variants", () => {
  it("creates stable variant ids and SKUs without using display labels as identity", () => {
    const variants = normalizeProductVariants(product);
    expect(variants).toHaveLength(2);
    expect(variants[0]).toMatchObject({ productId: "p1", sku: "P1-PACK-10-TABLETS", available: true });
    expect(variants[0].id).toBe("p1:pack-10-tablets");
    expect(variants[0].options).toEqual({ pack: "10 tablets" });
  });

  it("marks unavailable variants disabled", () => {
    const variants = normalizeProductVariants({ ...product, inventory: { availableQuantity: 0 } });
    expect(variants[0].available).toBe(false);
    expect(variants[0].stock).toBe(0);
  });
});

describe("cart domain", () => {
  it("creates cartKey from productId and variantId", () => {
    expect(buildCartKey("p1", "v1")).toBe("p1:v1");
  });

  it("keeps same product with different variants as separate cart lines", () => {
    const first = { cartKey: "p1:v1", productId: "p1", variantId: "v1", slug: "p", name: "P", image: "/p.jpg", sku: "P-V1", selectedOptions: { pack: "10" }, quantity: 1, maxQuantity: 5 };
    const second = { ...first, cartKey: "p1:v2", variantId: "v2", sku: "P-V2", selectedOptions: { pack: "20" } };
    expect(mergeCartLines([], first, 1)).toHaveLength(1);
    expect(mergeCartLines([first], second, 1)).toHaveLength(2);
  });

  it("merges same cartKey and caps quantity at maximum", () => {
    const line = { cartKey: "p1:v1", productId: "p1", variantId: "v1", slug: "p", name: "P", image: "/p.jpg", sku: "P-V1", selectedOptions: {}, quantity: 3, maxQuantity: 5 };
    expect(mergeCartLines([line], line, 10)[0].quantity).toBe(5);
    expect(validateCartQuantity(9, 5)).toEqual({ quantity: 5, warning: "Quantity adjusted to available limit" });
  });
});

describe("trusted cart recalculation", () => {
  it("recalculates price, VAT, shipping and coupon discounts from product variants", () => {
    const variants = normalizeProductVariants(product);
    const result = recalculateCartTotals({
      items: [{ productId: "p1", variantId: variants[0].id, quantity: 2 }],
      couponCode: "SAVE10",
    }, [product]);
    expect(result.lines[0]).toMatchObject({ productId: "p1", variantId: variants[0].id, quantity: 2, regularPrice: 120, salePrice: 100, itemSubtotal: 200 });
    expect(result.summary.discount).toBe(40);
    expect(result.summary.couponDiscount).toBe(20);
    expect(result.summary.vat).toBe(9);
    expect(result.summary.shipping).toBe(60);
    expect(result.summary.grandTotal).toBe(249);
  });

  it("returns warnings for out of stock and invalid coupon", () => {
    const variants = normalizeProductVariants({ ...product, inventory: { availableQuantity: 0 } });
    const result = recalculateCartTotals({ items: [{ productId: "p1", variantId: variants[0].id, quantity: 1 }], couponCode: "BAD" }, [{ ...product, inventory: { availableQuantity: 0 } }]);
    expect(result.lines[0].warnings).toContain("Out of stock");
    expect(result.warnings).toContain("Coupon code is not valid");
  });
});

describe("wishlist domain", () => {
  it("protects wishlist actions for guests", () => {
    expect(shouldRequireWishlistLogin(null)).toBe(true);
    expect(shouldRequireWishlistLogin({ phone: "+8801712345678" })).toBe(false);
  });
});
