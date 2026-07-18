"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ["skin'o", 'skino', 'innsaei', 'skin'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function SkinOXInnsaeiStealTheDeal() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "skino-innsaei-steal-the-deal",
          title: "skin'O X innsaei: Steal the Deal",
          subtitle: "Special skincare deals from skin’O and innsaei.",
          href: "/offers/skino-innsaei",
          minimumCards: 20,
          background: "#fff0f7",
          headingColor: "#d72c95",
          filter: matchesSection,
        },
      ]}
    />
  );
}
