import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.arogga.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/checkout", "/profile", "/orders", "/inbox", "/search"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
