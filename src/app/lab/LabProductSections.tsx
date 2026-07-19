"use client";

import { ProductSectionCollection } from "@/Components/HomeComponents/ProductSection";

export default function LabProductSections() {
  return (
    <ProductSectionCollection
      sections={[
        { id: "lab-featured", title: "Popular Health Products", subtitle: "20 products selected from tara.json", href: "/lab", minimumCards: 20, background: "#f3fbff", headingColor: "#086f83" },
        { id: "lab-care", title: "Home Care Essentials", subtitle: "A separate random set using the shared fetch function", href: "/lab", minimumCards: 20, startIndex: 80, background: "#f4fbf9", headingColor: "#087b75" },
      ]}
    />
  );
}
