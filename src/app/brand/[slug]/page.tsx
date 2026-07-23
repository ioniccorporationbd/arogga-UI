import type { Metadata } from "next";
import CategoryCatalog from "@/app/[...categoryPath]/CategoryCatalog";
import { getProductsByBrandSlug, getProductsData } from "@/lib/data";
import type { CategoryRoute } from "@/app/[...categoryPath]/category-data";

function titleFromSlug(slug: string) {
  return slug.split("-").filter(Boolean).map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const label = titleFromSlug(slug);
  return {
    title: `${label} Brand Products | Arogga`,
    description: `Shop ${label} products from the local data.json catalog.`,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [matchedProducts, allProducts] = await Promise.all([getProductsByBrandSlug(slug), getProductsData()]);
  const products = matchedProducts.length > 0 ? matchedProducts : allProducts.slice(0, 60);
  const brandName = matchedProducts[0]?.brand?.name || titleFromSlug(slug);
  const brandSiblings = [...new Map(allProducts.map((product) => [product.brand?.slug || product.brand?.name, { label: product.brand?.name || "Brand", href: `/brand/${product.brand?.slug || slug}` }])).values()].slice(0, 8);
  const category: CategoryRoute = {
    label: brandName,
    href: `/brand/${slug}`,
    rootLabel: "Brand",
    siblings: brandSiblings,
  };

  return <CategoryCatalog category={category} products={products} />;
}
