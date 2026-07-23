import type { Product, ProductListItem } from "@/types";
import { getProductByIdentifier } from "@/lib/data";
import { queryCatalog, type ProductSearchItem } from "@/lib/catalog-index";
import type { ProductQuery, ProductRepository } from "../interfaces/ProductRepository";

type RawProduct = {
  id?: string | number;
  slug?: string;
  name?: string;
  brand?: Product["brand"];
  category?: string;
  taxonomy?: { category?: { name?: string; slug?: string }; tags?: string[] };
  thumbnail?: string;
  media?: { featuredImage?: { url?: string }; gallery?: Array<{ url: string }>; video?: { url?: string } };
  images?: string[];
  video?: string;
  price?: number;
  discountPrice?: number;
  pricing?: { regularPrice?: number; salePrice?: number };
  inventory?: { stockStatus?: string };
  variants?: Product["variants"];
  rating?: number;
  ratings?: { average?: number; count?: number };
  reviewCount?: number;
  tags?: string[];
  description?: string;
  requiresPrescription?: boolean;
};

function normalizeProduct(raw: RawProduct): Product {
  const pricing = raw.pricing || {};
  const media = raw.media || {};
  return {
    id: String(raw.id || raw.slug),
    slug: raw.slug || String(raw.id),
    name: raw.name || "Product",
    brand: raw.brand,
    category: raw.category || raw.taxonomy?.category?.name,
    categorySlug: raw.taxonomy?.category?.slug,
    image: raw.thumbnail || media.featuredImage?.url || raw.images?.[0],
    images: raw.images || media.gallery?.map((item) => item.url),
    video: raw.video || media.video?.url,
    price: raw.price || pricing.regularPrice || 0,
    salePrice: raw.discountPrice || pricing.salePrice,
    stockStatus: raw.inventory?.stockStatus || "in_stock",
    variants: raw.variants,
    rating: raw.rating || raw.ratings?.average,
    reviewCount: raw.reviewCount || raw.ratings?.count,
    tags: raw.tags || raw.taxonomy?.tags,
    description: raw.description,
    requiresPrescription: Boolean(raw.requiresPrescription),
    raw,
  };
}

function toListItem(item: ProductSearchItem): ProductListItem {
  return {
    id: String(item.id),
    slug: item.slug,
    name: item.name,
    brand: item.brand,
    brandSlug: item.brandSlug,
    category: item.category,
    categorySlug: item.categorySlug,
    image: item.image,
    price: item.price,
    salePrice: item.salePrice,
    stockStatus: item.stockStatus,
    rating: item.rating,
    discountPercentage: item.discountPercentage,
  };
}

export class JsonProductRepository implements ProductRepository {
  async list(query: ProductQuery = {}) {
    const result = await queryCatalog(query);
    return { ...result, items: result.items.map(toListItem) };
  }

  async searchSuggestions(q: string, limit = 10) {
    const result = await queryCatalog({ q, limit });
    return result.items.map(toListItem);
  }

  async getBySlug(slug: string) {
    const product = await getProductByIdentifier(slug);
    return product ? normalizeProduct(product as RawProduct) : null;
  }

  async getById(id: string) {
    const product = await getProductByIdentifier(id);
    return product ? normalizeProduct(product as RawProduct) : null;
  }
}
