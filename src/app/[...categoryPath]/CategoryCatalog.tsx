"use client";

import { Check, ChevronLeft, ChevronRight, Search, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { EcommerceProduct } from "@/lib/products";
import { getCurrencySymbol, getProductDiscount, getProductPrice } from "@/lib/products";

type Props = { title: string; path: string; products: EcommerceProduct[] };

export default function CategoryCatalog({ title, path, products }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);
  const [added, setAdded] = useState<string[]>([]);
  const pageSize = 24;

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    const list = products.filter((product) => {
      const searchable = `${product.name} ${product.shortName} ${product.brand.name}`.toLowerCase();
      return (!value || searchable.includes(value)) && (!inStock || product.inventory.availableQuantity > 0);
    });
    return [...list].sort((a, b) => {
      const ap = getProductPrice(a);
      const bp = getProductPrice(b);
      if (sort === "price-asc") return ap - bp;
      if (sort === "price-desc") return bp - ap;
      if (sort === "rating") return (b.ratings.average ?? 0) - (a.ratings.average ?? 0);
      return b.ratings.count - a.ratings.count;
    });
  }, [products, query, sort, inStock]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function addToCart(product: EcommerceProduct) {
    const raw = localStorage.getItem("arogga-cart");
    const cart = raw ? JSON.parse(raw) : [];
    const existing = cart.find((item: { id: string }) => item.id === product.id);
    const next = existing
      ? cart.map((item: { id: string; quantity: number }) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { id: product.id, slug: product.slug, name: product.name, image: product.media.featuredImage.url, price: getProductPrice(product), quantity: 1 }];
    localStorage.setItem("arogga-cart", JSON.stringify(next));
    setAdded((current) => current.includes(product.id) ? current : [...current, product.id]);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto w-[min(1440px,calc(100%-32px))] py-6">
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-teal-700">Home</Link> <span>/</span> <span className="text-slate-900">{title}</span></nav>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">Dynamic category</p><h1 className="mt-1 text-3xl font-bold text-slate-950">{title}</h1><p className="mt-2 text-sm text-slate-500">{filtered.length} products found for /{path}</p></div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative min-w-[280px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input value={query} onChange={(e)=>{setQuery(e.target.value);setPage(1)}} placeholder="Search products" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 outline-none focus:border-teal-500"/></label>
              <select value={sort} onChange={(e)=>{setSort(e.target.value);setPage(1)}} className="h-11 rounded-xl border border-slate-200 bg-white px-3">
                <option value="popular">Most popular</option><option value="rating">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
              </select>
              <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm"><input type="checkbox" checked={inStock} onChange={(e)=>{setInStock(e.target.checked);setPage(1)}}/> In stock</label>
            </div>
          </div>
        </section>

        {visible.length ? <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {visible.map((product) => {
            const price = getProductPrice(product); const discount = getProductDiscount(product); const isAdded = added.includes(product.id); const stock = product.inventory.availableQuantity > 0;
            return <article key={product.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-white p-3">
                <img src={product.media.featuredImage.url} alt={product.media.featuredImage.alt || product.name} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" loading="lazy"/>
                {discount > 0 && <span className="absolute left-2 top-2 rounded-lg bg-rose-500 px-2 py-1 text-[11px] font-bold text-white">{discount}% OFF</span>}
                <span className={`absolute right-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold ${stock ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{stock ? "IN STOCK" : "OUT OF STOCK"}</span>
              </Link>
              <div className="p-3"><p className="truncate text-xs font-semibold text-teal-700">{product.brand.name}</p><Link href={`/products/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold text-slate-900 hover:text-teal-700">{product.name}</Link>
                <div className="mt-2 flex items-center gap-1 text-amber-500"><Star size={13} fill="currentColor"/><span className="text-xs font-semibold">{(product.ratings.average ?? 0).toFixed(1)}</span><span className="text-xs text-slate-400">({product.ratings.count})</span></div>
                <div className="mt-3 flex items-end justify-between gap-2"><div><p className="text-xs text-slate-400 line-through">{getCurrencySymbol(product.pricing.currency)}{product.pricing.regularPrice}</p><p className="text-base font-bold text-slate-950">{getCurrencySymbol(product.pricing.currency)}{price}</p></div><button disabled={!stock} onClick={()=>addToCart(product)} className="flex h-9 items-center gap-1 rounded-lg border border-teal-600 px-2 text-xs font-bold text-teal-700 hover:bg-teal-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40">{isAdded ? <><Check size={14}/> Added</> : <><ShoppingCart size={14}/> Add</>}</button></div>
              </div>
            </article>
          })}
        </section> : <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center"><h2 className="text-xl font-bold">No matching products</h2><p className="mt-2 text-slate-500">Try another search or category.</p></div>}

        <div className="mt-8 flex items-center justify-center gap-3"><button disabled={currentPage<=1} onClick={()=>setPage((p)=>Math.max(1,p-1))} className="flex size-10 items-center justify-center rounded-xl border bg-white disabled:opacity-40"><ChevronLeft size={18}/></button><span className="text-sm font-semibold">Page {currentPage} of {totalPages}</span><button disabled={currentPage>=totalPages} onClick={()=>setPage((p)=>Math.min(totalPages,p+1))} className="flex size-10 items-center justify-center rounded-xl border bg-white disabled:opacity-40"><ChevronRight size={18}/></button></div>
      </div>
    </main>
  );
}
