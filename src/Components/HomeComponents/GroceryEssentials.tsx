"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['grocery', 'food', 'pantry', 'snack'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function GroceryEssentials() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "grocery-essentials",
          title: "Grocery Essentials🛒",
          subtitle: "Daily grocery products for your pantry and family.",
          href: "/category/grocery",
          minimumCards: 20,
          background: "#fff8eb",
          headingColor: "#b66a00",
          filter: matchesSection,
        },
      ]}
    />
  );
}
