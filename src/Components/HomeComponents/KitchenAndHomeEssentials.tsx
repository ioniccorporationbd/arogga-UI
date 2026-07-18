"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['kitchen', 'home', 'household', 'cleaning'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function KitchenAndHomeEssentials() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "kitchen-home-essentials",
          title: "Kitchen & Home Essentials",
          subtitle: "Useful products for your kitchen and everyday home care.",
          href: "/category/kitchen-home",
          minimumCards: 20,
          background: "#fff9ed",
          headingColor: "#9b6410",
          filter: matchesSection,
        },
      ]}
    />
  );
}
