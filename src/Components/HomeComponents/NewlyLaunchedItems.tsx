"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['new', 'latest'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function NewlyLaunchedItems() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "newly-launched-items",
          title: "Newly Launched Items",
          subtitle: "Explore the latest products added to the store.",
          href: "/store?sort=newest",
          minimumCards: 20,
          background: "#f3fbff",
          headingColor: "#087b75",
          filter: matchesSection,
        },
      ]}
    />
  );
}
