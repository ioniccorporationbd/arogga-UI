"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['beauty', 'makeup', 'glow', 'cosmetic'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function ShopYourGlow() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "shop-your-glow",
          title: "Shop Your Glow 🌟",
          subtitle: "Beauty, makeup, and personal glow essentials.",
          href: "/category/beauty",
          minimumCards: 20,
          background: "#fff0fa",
          headingColor: "#d62b9a",
          filter: matchesSection,
        },
      ]}
    />
  );
}
