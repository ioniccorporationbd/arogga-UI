"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['skin cafe', 'skincare', 'skin'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function SkinCafeEssentials() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "skin-cafe-essentials",
          title: "Skin Cafe Essentials",
          subtitle: "Skin Cafe favorites and skincare essentials.",
          href: "/brand/skin-cafe",
          minimumCards: 20,
          background: "#fff4ee",
          headingColor: "#b95e3d",
          filter: matchesSection,
        },
      ]}
    />
  );
}
