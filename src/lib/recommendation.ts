import type { EcommerceProduct } from "@/lib/products";

function intersectionScore(a: string[] = [], b: string[] = []) {
  const target = new Set(b.map((item) => item.toLowerCase()));
  return a.reduce((score, item) => score + (target.has(item.toLowerCase()) ? 4 : 0), 0);
}

export function recommendProducts(products: EcommerceProduct[], current?: EcommerceProduct, limit = 12) {
  const candidates = products.filter((product) => !current || product.id !== current.id);
  if (!current) {
    return [...candidates]
      .sort((a, b) => (b.ratings?.average ?? 0) - (a.ratings?.average ?? 0) || (b.analytics?.salesCount ?? 0) - (a.analytics?.salesCount ?? 0))
      .slice(0, limit);
  }

  return candidates
    .map((product) => {
      let score = 0;
      if (product.taxonomy?.subCategory?.slug && product.taxonomy.subCategory.slug === current.taxonomy?.subCategory?.slug) score += 24;
      if (product.taxonomy?.category?.slug && product.taxonomy.category.slug === current.taxonomy?.category?.slug) score += 14;
      if (product.brand?.slug && product.brand.slug === current.brand?.slug) score += 10;
      score += intersectionScore(product.taxonomy?.tags, current.taxonomy?.tags);
      score += Math.round((product.ratings?.average ?? 0) * 2);
      score += Math.min(10, Math.round((product.analytics?.salesCount ?? 0) / 120));
      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.product);
}

export function frequentlyBoughtTogether(products: EcommerceProduct[], current: EcommerceProduct, limit = 4) {
  return recommendProducts(products, current, limit).filter((product) => product.id !== current.id);
}
