"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['health', 'wellness', 'hygiene', 'care'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function ProtectYourHealth() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "protect-your-health",
          title: "Protect Your Health🩺",
          subtitle: "Everyday health, hygiene, and wellness essentials.",
          href: "/category/health",
          minimumCards: 20,
          background: "#eef9f7",
          headingColor: "#087b75",
          filter: matchesSection,
        },
      ]}
    />
  );
}
