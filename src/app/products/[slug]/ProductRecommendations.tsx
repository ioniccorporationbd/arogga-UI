"use client";

import { ProductSectionCollection, type ProductSectionConfig } from "@/Components/HomeComponents/ProductSection";

export default function ProductRecommendations({
  currentProductId,
  brand,
  category,
}: {
  currentProductId: string;
  brand: string;
  category: string;
}) {
  const normalizedBrand = brand.trim().toLowerCase();
  const normalizedCategory = category.trim().toLowerCase();

  const sections: ProductSectionConfig[] = [
    {
      id: `similar-${currentProductId}`,
      title: "Similar Products",
      subtitle: `More products from ${category || "this category"}`,
      minimumCards: 20,
      startIndex: 20,
      background: "linear-gradient(145deg,#fff8fb 0%,#fff0f5 100%)",
      headingColor: "#c23a6b",
      filter: (product) =>
        product.id !== currentProductId && product.category.toLowerCase() === normalizedCategory,
    },
    {
      id: `brand-${currentProductId}`,
      title: `More from ${brand || "This Brand"}`,
      subtitle: "Explore more products from the same brand",
      minimumCards: 20,
      startIndex: 80,
      background: "linear-gradient(145deg,#ffffff 0%,#f7fbfa 100%)",
      headingColor: "#087b75",
      filter: (product) =>
        product.id !== currentProductId && product.brand.toLowerCase() === normalizedBrand,
    },
    {
      id: `together-${currentProductId}`,
      title: "Frequently Bought Together",
      subtitle: "Popular additions customers often explore together",
      minimumCards: 20,
      startIndex: 160,
      background: "linear-gradient(145deg,#f4f8fc 0%,#eaf2fa 100%)",
      headingColor: "#3563a9",
      filter: (product) => product.id !== currentProductId,
    },
  ];

  return <ProductSectionCollection sections={sections} />;
}
