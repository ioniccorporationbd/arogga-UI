export type NormalizedProductVariant = {
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

type SourceOption = { name?: string; label?: string; type?: string; value?: string; values?: string[]; image?: string; price?: number; salePrice?: number; stock?: number; sku?: string };
type SourceProduct = {
  id?: string | number;
  slug?: string;
  name?: string;
  sku?: string;
  price?: number;
  salePrice?: number;
  regularPrice?: number;
  pricing?: { regularPrice?: number; salePrice?: number; price?: number };
  inventory?: { availableQuantity?: number; stock?: number };
  stock?: number;
  purchaseRules?: { maximumQuantity?: number };
  media?: { featuredImage?: { url?: string }; gallery?: Array<{ url?: string }> };
  image?: string;
  images?: string[];
  options?: SourceOption[];
  variants?: NormalizedProductVariant[];
};

const SUPPORTED = new Set(["size", "pack", "color", "shade", "weight", "volume", "strength", "flavor"]);

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "default";
}

function optionName(option: SourceOption) {
  const key = slugify(option.name || option.label || option.type || "pack");
  return SUPPORTED.has(key) ? key : "pack";
}

function basePrices(product: SourceProduct) {
  const regularPrice = Number(product.pricing?.regularPrice ?? product.regularPrice ?? product.price ?? 0);
  const salePrice = product.pricing?.salePrice ?? product.salePrice ?? product.pricing?.price;
  return { regularPrice, salePrice: typeof salePrice === "number" && salePrice < regularPrice ? salePrice : undefined };
}

function baseStock(product: SourceProduct) {
  return Math.max(0, Number(product.inventory?.availableQuantity ?? product.inventory?.stock ?? product.stock ?? 0));
}

function baseImage(product: SourceProduct) {
  return product.media?.featuredImage?.url || product.image || product.images?.[0] || product.media?.gallery?.[0]?.url;
}

export function normalizeProductVariants(product: SourceProduct): NormalizedProductVariant[] {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.map((variant) => ({
      ...variant,
      id: variant.id || `${product.id}:${slugify(variant.sku || variant.name)}`,
      productId: String(variant.productId || product.id || product.slug || "product"),
      sku: variant.sku || `${String(product.id || product.slug || "PRODUCT").toUpperCase()}-${slugify(variant.name).toUpperCase()}`,
      maxQuantity: Math.max(1, variant.maxQuantity || variant.stock || 1),
      available: Boolean(variant.available && variant.stock > 0),
    }));
  }

  const productId = String(product.id || product.slug || "product");
  const options = Array.isArray(product.options) ? product.options : [];
  const expanded = options.flatMap((option) => {
    const name = optionName(option);
    const values = Array.isArray(option.values) && option.values.length > 0 ? option.values : option.value ? [option.value] : [];
    return values.map((value) => ({ option, name, value }));
  });
  const source = expanded.length > 0 ? expanded : [{ option: {} as SourceOption, name: "pack", value: "Standard Pack" }];
  const prices = basePrices(product);
  const stock = baseStock(product);
  const maxQuantity = Math.max(1, Math.min(Number(product.purchaseRules?.maximumQuantity ?? (stock || 1)), stock || 1));
  const image = baseImage(product);

  return source.map(({ option, name, value }) => {
    const optionSlug = `${name}-${slugify(value)}`;
    const regularPrice = Number(option.price ?? prices.regularPrice);
    const optionSale = typeof option.salePrice === "number" ? option.salePrice : prices.salePrice;
    const variantStock = Math.max(0, Number(option.stock ?? stock));
    return {
      id: `${productId}:${optionSlug}`,
      productId,
      sku: option.sku || `${slugify(productId).toUpperCase()}-${optionSlug.toUpperCase()}`,
      name: value,
      options: { [name]: value },
      regularPrice,
      salePrice: optionSale && optionSale < regularPrice ? optionSale : undefined,
      stock: variantStock,
      image: option.image || image,
      maxQuantity: Math.max(1, Math.min(maxQuantity, variantStock || 1)),
      available: variantStock > 0,
    };
  });
}

export function findProductVariant(product: SourceProduct, variantId: string) {
  return normalizeProductVariants(product).find((variant) => variant.id === variantId || variant.sku === variantId) || null;
}
