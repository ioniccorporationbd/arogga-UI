"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['baby', 'kids', 'child', 'tiny'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function TinyTots() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "tiny-tots",
          title: "Tiny Tots👣",
          subtitle: "Gentle baby care and children’s daily essentials.",
          href: "/category/baby-care",
          minimumCards: 20,
          background: "#eef7ff",
          headingColor: "#3578b8",
          filter: matchesSection,
        },
      ]}
    />
  );
}
