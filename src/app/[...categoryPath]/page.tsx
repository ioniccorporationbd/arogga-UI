import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerProducts } from "@/lib/server-products";
import CategoryCatalog from "./CategoryCatalog";

type Props = { params: Promise<{ categoryPath: string[] }> };

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function titleCase(value: string) { return value.split("-").filter(Boolean).map((item)=>item.charAt(0).toUpperCase()+item.slice(1)).join(" "); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryPath } = await params;
  const title = titleCase(categoryPath.at(-1) ?? "Products");
  return { title: `${title} | Arogga Marketplace`, description: `Shop ${title} products with dynamic pricing, stock and product details.` };
}

export default async function DynamicCategoryPage({ params }: Props) {
  const { categoryPath } = await params;
  if (!categoryPath.length) notFound();
  const target = normalize(categoryPath.at(-1) ?? "");
  const products = await getServerProducts();
  const matched = products.filter((product) => {
    if (product.status !== "active" || product.visibility !== "public") return false;
    const tokens = [product.taxonomy.department.slug, product.taxonomy.category.slug, product.taxonomy.subCategory?.slug, ...product.taxonomy.collections.map((item)=>item.slug), ...product.taxonomy.tags, product.brand.slug].filter(Boolean).map((item)=>normalize(String(item)));
    return tokens.some((item)=>item===target || item.includes(target) || target.includes(item));
  });
  const fallback = matched.length ? matched : products.filter((p)=>p.status === "active" && p.visibility === "public").slice(0, 240);
  const title = titleCase(categoryPath.at(-1) ?? "Products");
  return <CategoryCatalog title={title} path={categoryPath.join("/")} products={fallback} />;
}
