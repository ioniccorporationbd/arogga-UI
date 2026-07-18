"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['supplement', 'vitamin', 'nutrition', 'balance'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function BoostAndBalance() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "boost-and-balance",
          title: "Boost & Balance 💊",
          subtitle: "Supplements and wellness products for balanced living.",
          href: "/category/supplements",
          minimumCards: 20,
          background: "#f3f9ec",
          headingColor: "#638c27",
          filter: matchesSection,
        },
      ]}
    />
  );
}
