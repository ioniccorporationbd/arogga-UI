"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['fragrance', 'perfume', 'scent', 'body spray'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function FragranceAndPerfume() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "fragrance-and-perfume",
          title: "Fragrance & Perfume",
          subtitle: "Discover perfumes, body sprays, and signature scents.",
          href: "/category/fragrance-perfume",
          minimumCards: 20,
          background: "#fff1f8",
          headingColor: "#c43b87",
          filter: matchesSection,
        },
      ]}
    />
  );
}
