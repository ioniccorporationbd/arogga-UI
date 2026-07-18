"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['medicine', 'otc', 'tablet', 'capsule'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function OTCMedicine() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "otc-medicine",
          title: "OTC Medicine",
          subtitle: "Over-the-counter healthcare products and essentials.",
          href: "/category/otc-medicine",
          minimumCards: 20,
          background: "#eff7ff",
          headingColor: "#326ea8",
          filter: matchesSection,
        },
      ]}
    />
  );
}
