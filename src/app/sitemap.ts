import type { MetadataRoute } from "next";
import { getProductIndex } from "@/lib/catalog-index";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.arogga.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProductIndex();
  const now = new Date();
  const staticRoutes = ["", "/store", "/lab", "/doctor", "/cart", "/checkout", "/orders", "/wishlist", "/inbox", "/profile"];
  const categoryRoutes = Array.from(new Set(products.map((product) => product.categorySlug))).map((slug) => `/category/${slug}`);
  const brandRoutes = Array.from(new Set(products.map((product) => product.brandSlug))).map((slug) => `/brand/${slug}`);
  const productRoutes = products.map((product) => `/product/${product.slug}`);

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route.startsWith("/product") ? "weekly" : "daily",
    priority: route === "" ? 1 : route.startsWith("/product") ? 0.7 : 0.8,
  }));
}
