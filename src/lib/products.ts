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
    gallery: { url: string; thumbnailUrl?: string; alt?: string; title?: string; width?: number | null; height?: number | null; mimeType?: string | null }[];
  };
  options?: { name?: string; slug?: string; value?: string; colorHex?: string | null }[];
  attributes: { id: string; name: string; slug: string; value: string; visible: boolean; filterable: boolean; comparable: boolean }[];
  shipping: {
    freeShipping: boolean;
    package?: { type?: string; quantityPerPackage?: number };
    delivery: { estimatedMinimumDays: number; estimatedMaximumDays: number; sameDayEligible: boolean };
  };
  purchaseRules: {
    minimumQuantity: number;
    maximumQuantity: number | null;
    maximumPerOrder?: number | null;
    prescriptionRequired?: boolean;
  };
  ratings: {
    average: number | null;
    count: number;
    verifiedPurchaseCount?: number;
    distribution?: { "5": number; "4": number; "3": number; "2": number; "1": number };
  };
  reviews?: { enabled: boolean; requiresPurchase: boolean; requiresApproval: boolean };
  seller: { name: string; fulfilledBy: string; returnPolicy: { returnable: boolean; returnWindowDays: number; conditions: string[] } };
  compliance?: { isHazardous: boolean; isFragile: boolean; requiresColdStorage: boolean; regulatedProduct: boolean; licenseRequired: boolean };
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    openGraph?: { title: string; description: string; image: string; type: string };
  };
  urls: { local: string; api: string; source: string };
  availability?: { isAvailable: boolean; availableFrom: string | null; availableUntil: string | null; salesChannels: string[]; regions: string[] };
  analytics?: { viewCount: number; salesCount: number; wishlistCount: number; cartAdditionCount: number; conversionRate: number };

  // Flat API-ready fields mirrored in public/data.json. Existing nested fields stay for backward compatibility.
  genericName?: string;
  manufacturer?: string;
  category?: string;
  subcategory?: string;
  type?: string;
  price?: number;
  discountPrice?: number;
  discountPercentage?: number;
  currency?: string;
  stock?: number;
  sold?: number;
  prescriptionRequired?: boolean;
  images?: string[];
  thumbnail?: string;
  video?: string;
  description?: string;
  shortDescription?: string;
  ingredients?: string[];
  benefits?: string[];
  highlights?: string[];
  specifications?: Record<string, string>;
  dosage?: string;
  warnings?: string[];
  sideEffects?: string[];
  storage?: string;
  packageSize?: string;
  weight?: string;
  unit?: string;
  country?: string;
  expiry?: string;
  rating?: number;
  reviewCount?: number;
  faq?: Array<{ question?: string; answer?: string }>;
  tags?: string[];
  relatedProducts?: string[];
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
