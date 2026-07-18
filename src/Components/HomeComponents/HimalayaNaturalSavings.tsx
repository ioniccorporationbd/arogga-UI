"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['himalaya', 'herbal'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function HimalayaNaturalSavings() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "himalaya-natural-savings",
          title: "Himalaya: Natural savings you can’t miss",
          subtitle: "Herbal care and wellness products from Himalaya.",
          href: "/brand/himalaya",
          minimumCards: 20,
          background: "#fff9e9",
          headingColor: "#b57b00",
          filter: matchesSection,
        },
      ]}
    />
  );
}
