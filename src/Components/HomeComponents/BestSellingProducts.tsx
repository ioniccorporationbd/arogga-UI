"use client";

import { ProductSectionCollection } from "./ProductSection";
import type { ProductCardData } from "./product-data";

const keywords = ['best', 'popular'];

function matchesSection(product: ProductCardData) {
  const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return keywords.some((keyword) => searchable.includes(keyword));
}

export default function BestSellingProducts() {
  return (
    <ProductSectionCollection
      sections={[
        {
          id: "best-selling-products",
          title: "Best Selling Products",
          subtitle: "Top-rated and popular products selected from the catalog.",
          href: "/store?sort=best-selling",
          minimumCards: 20,
          background: "#fff8e8",
          headingColor: "#c27a00",
          filter: matchesSection,
        },
      ]}
    />
  );
}
