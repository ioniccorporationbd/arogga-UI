"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['gfors'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function GFORSMegaDeals() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "gfors-mega-deals",
          title: "GFORS Mega Deals",
          subtitle: "Mega savings on selected GFORS products.",
          href: "/brand/gfors",
          minimumCards: 20,
          background: "#eef4ff",
          headingColor: "#4258b8",
          filter: matchesSection,
        },
      ]}
    />
  );
}
