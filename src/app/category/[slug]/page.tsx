import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryCatalog from "@/app/[...categoryPath]/CategoryCatalog";
import { getProductsData } from "@/lib/data";
import type { CategoryRoute } from "@/app/[...categoryPath]/category-data";

function titleFromSlug(slug: string) {
  return slug.split("-").filter(Boolean).map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const label = titleFromSlug(slug);
  return {
    title: `${label} Products | Arogga`,
    description: `Shop ${label} products from the local data.json catalog with filters, sorting and pagination.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProductsData();
  const matched = products.filter((product) => product.taxonomy?.category?.slug === slug || product.taxonomy?.subCategory?.slug === slug || product.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === slug);
  if (!matched.length) notFound();

  const label = titleFromSlug(slug);
  const category: CategoryRoute = {
    label,
    href: `/category/${slug}`,
    rootLabel: "Category",
    siblings: [...new Map(products.map((product) => [product.taxonomy?.category?.slug || product.category, { label: product.taxonomy?.category?.name || product.category || "Products", href: `/category/${product.taxonomy?.category?.slug || slug}` }])).values()].slice(0, 8),
  };

  return <CategoryCatalog category={category} products={matched} />;
}
