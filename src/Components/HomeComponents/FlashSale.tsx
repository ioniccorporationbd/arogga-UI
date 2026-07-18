"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['sale', 'deal', 'discount'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function FlashSale() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "flash-sale",
          title: "Flash Sale",
          subtitle: "Limited-time deals with special catalog discounts.",
          href: "/offers/flash-sale",
          minimumCards: 20,
          background: "#fff1ef",
          headingColor: "#d63b2f",
          filter: matchesSection,
        },
      ]}
    />
  );
}
