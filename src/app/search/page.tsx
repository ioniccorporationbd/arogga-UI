import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

import { getProductsData } from "@/lib/data";
import { getProductPrice } from "@/lib/products";
import { searchProducts } from "@/lib/search";

function highlight(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return text;
  const index = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (index < 0) return text;
  return <>{text.slice(0, index)}<mark>{text.slice(index, index + trimmed.length)}</mark>{text.slice(index + trimmed.length)}</>;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const products = await getProductsData();
  const results = q.trim() ? searchProducts(products, { query: q, sort: "best-selling" }).slice(0, 60) : [];
  const suggestions = searchProducts(products, { query: q }).slice(0, 8);

  return (
    <section style={{ width: "min(1640px, calc(100% - clamp(20px, 4vw, 64px)))", margin: "0 auto", padding: "32px 0 80px" }}>
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#087b75", fontWeight: 900, fontSize: 12, textTransform: "uppercase" }}><Search size={16} /> Dynamic JSON Search</span>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", lineHeight: 1 }}>Search results for “{q}”</h1>
        <p style={{ color: "#667085" }}>{results.length} products found from <code>public/data.json</code></p>
      </div>

      {suggestions.length > 0 ? (
        <nav aria-label="Search suggestions" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
          {suggestions.map((product) => <Link key={product.id} href={`/product/${product.slug || product.id}`} style={{ minHeight: 44, display: "inline-flex", alignItems: "center", border: "1px solid #d6ebe8", borderRadius: 999, padding: "0 14px", color: "#087b75", background: "#f2fbfa", fontWeight: 800 }}>{product.shortName || product.name}</Link>)}
        </nav>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))", gap: 16, marginTop: 24 }}>
        {results.map((product) => (
          <Link key={product.id} href={`/product/${product.slug || product.id}`} style={{ border: "1px solid #e4e7ec", borderRadius: 18, padding: 14, textDecoration: "none", color: "#101828", background: "#fff", boxShadow: "0 22px 58px -48px rgba(15,23,42,.55)" }}>
            <div style={{ position: "relative", height: 180, borderRadius: 14, background: "#f8fbfa", overflow: "hidden" }}><Image src={product.media.featuredImage.url} alt={product.name} fill sizes="220px" style={{ objectFit: "contain" }} unoptimized /></div>
            <small style={{ display: "block", marginTop: 12, color: "#087b75", fontWeight: 900 }}>{product.brand?.name || "Brand"}</small>
            <strong style={{ display: "-webkit-box", overflow: "hidden", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", minHeight: 44 }}>{highlight(product.name, q)}</strong>
            <span style={{ display: "block", marginTop: 8, color: "#087b75", fontWeight: 900 }}>৳{getProductPrice(product).toFixed(2)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
