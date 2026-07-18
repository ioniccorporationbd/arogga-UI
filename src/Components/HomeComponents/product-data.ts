export type JsonProduct = {
  id: string | number;
  slug: string;
  status?: string;
  visibility?: string;
  name: string;
  shortName?: string | null;
  subtitle?: string | null;
  brand?: { name?: string | null } | null;
  taxonomy?: {
    department?: { name?: string | null; slug?: string | null } | null;
    category?: { name?: string | null; slug?: string | null } | null;
    subCategory?: { name?: string | null; slug?: string | null } | null;
    tags?: string[];
  } | null;
  content?: { shortDescription?: string | null } | null;
  pricing: {
    currency: string;
    regularPrice: number;
    salePrice?: number | null;
    compareAtPrice?: number | null;
    discount?: {
      isDiscounted?: boolean;
      percentage?: number | null;
    } | null;
  };
  inventory: {
    stockStatus: string;
    availableQuantity: number;
  };
  media: {
    featuredImage: {
      url?: string | null;
      thumbnailUrl?: string | null;
      alt?: string | null;
    };
  };
  shipping?: {
    delivery?: {
      estimatedMinimumDays?: number | null;
      estimatedMaximumDays?: number | null;
      sameDayEligible?: boolean;
    } | null;
  } | null;
  ratings?: { average?: number | null; count?: number | null } | null;
  urls?: { local?: string | null; source?: string | null } | null;
};

export type ProductCardData = {
  id: string;
  slug: string;
  href: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  imageAlt: string;
  currencySymbol: string;
  regularPrice: number;
  salePrice: number;
  discountPercent: number;
  rating: number | null;
  reviewCount: number;
  deliveryTime: string;
  availableQuantity: number;
  inStock: boolean;
  sourceUrl: string | null;
};

export const FALLBACK_IMAGE = "/images/product-fallback.png";

export function isValidProduct(value: unknown): value is JsonProduct {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Partial<JsonProduct>;
  return (
    (typeof p.id === "string" || typeof p.id === "number") &&
    typeof p.slug === "string" &&
    typeof p.name === "string" &&
    typeof p.pricing?.currency === "string" &&
    typeof p.pricing?.regularPrice === "number" &&
    typeof p.inventory?.stockStatus === "string" &&
    typeof p.inventory?.availableQuantity === "number" &&
    typeof p.media?.featuredImage === "object" &&
    p.media.featuredImage !== null
  );
}

export function normalizeProduct(product: JsonProduct): ProductCardData {
  const regularPrice = Number(product.pricing.regularPrice);
  const salePrice =
    typeof product.pricing.salePrice === "number" && product.pricing.salePrice > 0
      ? product.pricing.salePrice
      : regularPrice;
  const calculatedDiscount =
    regularPrice > salePrice
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0;
  const configuredDiscount = Number(product.pricing.discount?.percentage || 0);
  const delivery = product.shipping?.delivery;
  const deliveryTime = delivery?.sameDayEligible
    ? "SAME DAY"
    : typeof delivery?.estimatedMinimumDays === "number" &&
        typeof delivery?.estimatedMaximumDays === "number"
      ? `${delivery.estimatedMinimumDays}-${delivery.estimatedMaximumDays} DAYS`
      : "2-5 DAYS";

  return {
    id: String(product.id),
    slug: product.slug,
    href: product.urls?.local || `/products/${product.slug}`,
    name: product.name,
    brand: product.brand?.name || "Brand",
    category:
      product.taxonomy?.subCategory?.name ||
      product.taxonomy?.category?.name ||
      product.taxonomy?.department?.name ||
      "Product",
    image:
      product.media.featuredImage.thumbnailUrl ||
      product.media.featuredImage.url ||
      FALLBACK_IMAGE,
    imageAlt: product.media.featuredImage.alt || product.name,
    currencySymbol: getCurrencySymbol(product.pricing.currency),
    regularPrice,
    salePrice,
    discountPercent: configuredDiscount > 0 ? configuredDiscount : calculatedDiscount,
    rating:
      typeof product.ratings?.average === "number"
        ? product.ratings.average
        : null,
    reviewCount: Number(product.ratings?.count || 0),
    deliveryTime,
    availableQuantity: product.inventory.availableQuantity,
    inStock:
      product.inventory.stockStatus === "in_stock" &&
      product.inventory.availableQuantity > 0,
    sourceUrl: product.urls?.source || null,
  };
}

export function getCurrencySymbol(currency: string) {
  switch (currency.toUpperCase()) {
    case "USD": return "$";
    case "BDT": return "৳";
    case "EUR": return "€";
    case "GBP": return "£";
    case "INR": return "₹";
    default: return `${currency} `;
  }
}

export function ensureMinimumProducts(
  products: ProductCardData[],
  minimum = 20,
): Array<ProductCardData & { renderKey: string }> {
  if (products.length === 0) return [];
  const target = Math.max(minimum, products.length);
  return Array.from({ length: target }, (_, index) => {
    const product = products[index % products.length];
    return { ...product, renderKey: `${product.id}-${index}` };
  });
}
