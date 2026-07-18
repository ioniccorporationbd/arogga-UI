"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['supplement', 'vitamin', 'mineral', 'nutrition'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function SupplementFestival() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "supplement-festival",
          title: "Supplement Festival",
          subtitle: "Explore vitamins, minerals, and nutritional supplements.",
          href: "/offers/supplement-festival",
          minimumCards: 20,
          background: "#f1f8eb",
          headingColor: "#5f8f2e",
          filter: matchesSection,
        },
      ]}
    />
  );
}
