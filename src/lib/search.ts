import type { EcommerceProduct } from "@/lib/products";
import { getProductDiscount, getProductPrice } from "@/lib/products";

function normalize(value: string | null | undefined) {
  return (value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export type ProductSearchOptions = {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  prescriptionRequired?: boolean;
  minRating?: number;
  minDiscount?: number;
  sort?: "newest" | "oldest" | "price-low" | "price-high" | "rating" | "best-selling" | "alphabetical" | "discount";
};

export function productSearchHaystack(product: EcommerceProduct) {
  return normalize([
    product.name,
    product.shortName,
    product.subtitle,
    product.genericName,
    product.brand?.name,
    product.manufacturer,
    product.brand?.manufacturer,
    product.taxonomy?.category?.name,
    product.taxonomy?.subCategory?.name,
    product.sku,
    product.barcode || "",
    ...(product.taxonomy?.tags ?? []),
  ].filter(Boolean).join(" "));
}

export function searchProducts(products: EcommerceProduct[], options: ProductSearchOptions = {}) {
  const q = normalize(options.query);
  const filtered = products.filter((product) => {
    const price = getProductPrice(product);
    if (q && !productSearchHaystack(product).includes(q)) return false;
    if (options.category && normalize(product.taxonomy?.category?.name) !== normalize(options.category)) return false;
    if (options.brand && normalize(product.brand?.name) !== normalize(options.brand)) return false;
    if (typeof options.minPrice === "number" && price < options.minPrice) return false;
    if (typeof options.maxPrice === "number" && price > options.maxPrice) return false;
    if (options.inStockOnly && (product.inventory?.availableQuantity ?? 0) <= 0) return false;
    if (typeof options.prescriptionRequired === "boolean" && Boolean(product.purchaseRules?.prescriptionRequired) !== options.prescriptionRequired) return false;
    if (typeof options.minRating === "number" && (product.ratings?.average ?? 0) < options.minRating) return false;
    if (typeof options.minDiscount === "number" && getProductDiscount(product) < options.minDiscount) return false;
    return true;
  });

  return filtered.sort((a, b) => {
    switch (options.sort) {
      case "oldest": return String(a.id).localeCompare(String(b.id));
      case "price-low": return getProductPrice(a) - getProductPrice(b);
      case "price-high": return getProductPrice(b) - getProductPrice(a);
      case "rating": return (b.ratings?.average ?? 0) - (a.ratings?.average ?? 0);
      case "best-selling": return (b.analytics?.salesCount ?? 0) - (a.analytics?.salesCount ?? 0);
      case "alphabetical": return a.name.localeCompare(b.name);
      case "discount": return getProductDiscount(b) - getProductDiscount(a);
      case "newest":
      default: return String(b.id).localeCompare(String(a.id));
    }
  });
}

export function getSearchSuggestions(products: EcommerceProduct[], query: string, limit = 8) {
  return searchProducts(products, { query }).slice(0, limit).map((product) => ({
    id: product.id,
    label: product.name,
    href: `/product/${product.slug || product.id}`,
    image: product.media?.featuredImage?.url,
  }));
}
