import type { Metadata } from "next";
import { getServerProducts } from "@/lib/server-products";
import CategoryCatalog from "./CategoryCatalog";
import { findCategoryRoute, selectCategoryProducts } from "./category-data";

function makePath(parts: string[]) {
  return `/${parts.map(decodeURIComponent).join("/")}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryPath: string[] }>;
}): Promise<Metadata> {
  const { categoryPath } = await params;
  const category = await findCategoryRoute(makePath(categoryPath));
  if (!category) return {};
  return {
    title: `${category.label} Products | Arogga`,
    description: `Shop ${category.label} products with prices, ratings and delivery information in Bangladesh.`,
  };
}

export default async function DynamicCategoryPage({
  params,
}: {
  params: Promise<{ categoryPath: string[] }>;
}) {
  const { categoryPath } = await params;
  const pathname = makePath(categoryPath);
  const category = await findCategoryRoute(pathname);

  const products = await getServerProducts();
  const selectedProducts = selectCategoryProducts(products, category);

  return <CategoryCatalog category={category} products={selectedProducts} />;
}
