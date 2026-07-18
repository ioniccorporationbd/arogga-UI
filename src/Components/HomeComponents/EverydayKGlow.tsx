"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['korean', 'k-beauty', 'skin', 'glow'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function EverydayKGlow() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "everyday-k-glow",
          title: "Everyday K-Glow",
          subtitle: "K-beauty inspired skincare for a daily radiant look.",
          href: "/category/k-beauty",
          minimumCards: 20,
          background: "#fff3f7",
          headingColor: "#c24573",
          filter: matchesSection,
        },
      ]}
    />
  );
}
