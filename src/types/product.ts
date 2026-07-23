export type ProductVariant = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  options: Record<string, string>;
  regularPrice: number;
  salePrice?: number;
  stock: number;
  image?: string;
  maxQuantity: number;
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand?: { id?: string; name: string; slug?: string; logo?: string | null; manufacturer?: string; countryOfOrigin?: string | null };
  category?: string;
  categorySlug?: string;
  subcategory?: string;
  subcategorySlug?: string;
  images?: string[];
  image?: string;
  video?: string;
  price: number;
  salePrice?: number;
  stockStatus: "in_stock" | "out_of_stock" | "low_stock" | string;
  variants?: ProductVariant[];
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  description?: string;
  shortDescription?: string;
  highlights?: string[];
  ingredients?: string[];
  usageInstructions?: string[];
  warnings?: string[];
  storageInstructions?: string[];
  requiresPrescription?: boolean;
  raw?: unknown;
};

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug?: string;
  category: string;
  categorySlug?: string;
  image: string;
  price: number;
  salePrice?: number;
  stockStatus: string;
  rating?: number;
  discountPercentage?: number;
};
