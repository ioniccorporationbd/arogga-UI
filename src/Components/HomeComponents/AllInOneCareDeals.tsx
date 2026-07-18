"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['care', 'health', 'personal'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function AllInOneCareDeals() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "all-in-one-care-deals",
          title: "All-in-One Care Deals",
          subtitle: "Personal care, wellness, and everyday family essentials.",
          href: "/offers/all-in-one-care",
          minimumCards: 20,
          background: "#f2f9ec",
          headingColor: "#5e9e00",
          filter: matchesSection,
        },
      ]}
    />
  );
}
