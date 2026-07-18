"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['pet', 'dog', 'cat', 'animal'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function PawsAndClaws() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "paws-and-claws",
          title: "Paws & Claws 🐾",
          subtitle: "Food, grooming, and care products for your pets.",
          href: "/category/pet-care",
          minimumCards: 20,
          background: "#f4fbef",
          headingColor: "#5f8f2e",
          filter: matchesSection,
        },
      ]}
    />
  );
}
