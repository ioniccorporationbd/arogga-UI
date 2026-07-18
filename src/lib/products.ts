export type EcommerceProduct = {
  id: string;
  uuid: string;
  sku: string;
  barcode: string | null;
  slug: string;
  status: string;
  visibility: string;
  productType: string;
  condition: string;
  name: string;
  shortName: string;
  subtitle: string;
  brand: { id: string; name: string; slug: string; logo: string | null; manufacturer: string; countryOfOrigin: string | null };
  taxonomy: {
    department: { id: string; name: string; slug: string };
    category: { id: string; name: string; slug: string };
    subCategory: { id: string; name: string; slug: string } | null;
    collections: { id: string; name: string; slug: string }[];
    tags: string[];
  };
  content: {
    shortDescription: string;
    description: string;
    highlights: string[];
    features: { title: string; value: string }[];
    benefits: string[];
    howToUse: string[];
    ingredients: string[];
    warnings: string[];
    storageInstructions: string[];
    additionalInfo: Record<string, string | null>;
  };
  pricing: {
    currency: string;
    regularPrice: number;
    salePrice: number | null;
    compareAtPrice: number | null;
    discount: { isDiscounted: boolean; type: string | null; value: number; percentage: number };
  };
  inventory: { stockStatus: string; availableQuantity: number; lowStockThreshold: number };
  media: {
    featuredImage: { url: string; thumbnailUrl: string; alt: string; title: string; width: number | null; height: number | null; mimeType: string | null };
    gallery: { url: string; alt?: string }[];
  };
  attributes: { id: string; name: string; slug: string; value: string; visible: boolean; filterable: boolean; comparable: boolean }[];
  shipping: { freeShipping: boolean; delivery: { estimatedMinimumDays: number; estimatedMaximumDays: number; sameDayEligible: boolean } };
  purchaseRules: { minimumQuantity: number; maximumQuantity: number | null };
  ratings: { average: number | null; count: number };
  seller: { name: string; fulfilledBy: string; returnPolicy: { returnable: boolean; returnWindowDays: number; conditions: string[] } };
  seo: { metaTitle: string; metaDescription: string; canonicalUrl: string };
  urls: { local: string; api: string; source: string };
};

export function getCurrencySymbol(currency: string) {
  return ({ USD: "$", BDT: "৳", EUR: "€", GBP: "£" } as Record<string, string>)[currency] ?? `${currency} `;
}

export function getProductPrice(product: EcommerceProduct) {
  return product.pricing.salePrice ?? product.pricing.regularPrice;
}

export function getProductDiscount(product: EcommerceProduct) {
  return Math.max(0, Math.round(product.pricing.discount?.percentage ?? 0));
}
