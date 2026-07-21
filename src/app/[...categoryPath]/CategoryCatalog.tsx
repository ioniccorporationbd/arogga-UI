"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Heart,
  ListFilter,
  Search,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  getCurrencySymbol,
  getProductDiscount,
  getProductPrice,
  type EcommerceProduct,
} from "@/lib/products";
import type { CategoryRoute } from "./category-data";
import styles from "./category-page.module.css";

type Props = {
  category: CategoryRoute;
  products: EcommerceProduct[];
};

const PAGE_SIZE = 30;

function addToCart(product: EcommerceProduct) {
  try {
    const key = "arogga-cart";
    const current = JSON.parse(window.localStorage.getItem(key) || "[]") as Array<{
      id: string;
      slug: string;
      name: string;
      price: number;
      image: string;
      quantity: number;
    }>;
    const index = current.findIndex((item) => item.id === product.id);
    if (index >= 0) current[index].quantity += 1;
    else {
      current.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: getProductPrice(product),
        image: product.media?.featuredImage?.url || "",
        quantity: 1,
      });
    }
    window.localStorage.setItem(key, JSON.stringify(current));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error("Unable to update cart", error);
  }
}

export default function CategoryCatalog({ category, products }: Props) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [stockOnly, setStockOnly] = useState(false);
  const [minimumRating, setMinimumRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);

  const brands = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      const name = product.brand?.name || "Other";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [products]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesQuery = !needle || [
        product.name,
        product.shortName,
        product.brand?.name,
        product.taxonomy?.category?.name,
        product.taxonomy?.subCategory?.name,
      ].filter(Boolean).join(" ").toLowerCase().includes(needle);
      const matchesBrand = brand === "all" || product.brand?.name === brand;
      const matchesStock = !stockOnly || (product.inventory?.availableQuantity ?? 0) > 0;
      const matchesRating = (product.ratings?.average ?? 0) >= minimumRating;
      return matchesQuery && matchesBrand && matchesStock && matchesRating;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-low") return getProductPrice(a) - getProductPrice(b);
      if (sort === "price-high") return getProductPrice(b) - getProductPrice(a);
      if (sort === "rating") return (b.ratings?.average ?? 0) - (a.ratings?.average ?? 0);
      if (sort === "newest") return b.id.localeCompare(a.id);
      return (b.ratings?.count ?? 0) - (a.ratings?.count ?? 0);
    });
  }, [brand, minimumRating, products, query, sort, stockOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleProducts = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function resetPage() {
    setPage(1);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><ChevronRight size={13} />
          {category.rootLabel && <><span>{category.rootLabel}</span><ChevronRight size={13} /></>}
          {category.parentLabel && <><span>{category.parentLabel}</span><ChevronRight size={13} /></>}
          <strong>{category.label}</strong>
        </nav>

        <section className={styles.categoryStrip} aria-label="Related categories">
          {category.siblings.slice(0, 8).map((item, index) => (
            <Link key={item.href} href={item.href} className={styles.categoryCard}>
              <span>{["🌿", "💊", "🧴", "🥗", "🩺", "🧪", "🐾", "✨"][index % 8]}</span>
              <strong>{item.label}</strong>
            </Link>
          ))}
        </section>

        <div className={styles.quickLinks}>
          <Link href="/store"><span>🛍️</span> Browse all products</Link>
          <Link href="/offers"><span>🏷️</span> Deals and offers</Link>
          <Link href="/lab"><span>🧪</span> Book lab tests</Link>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.filterTitle}><ListFilter size={17} /><strong>Filters</strong><button type="button" onClick={() => { setBrand("all"); setStockOnly(false); setMinimumRating(0); setQuery(""); resetPage(); }}>Clear all</button></div>

            <div className={styles.filterBlock}>
              <h3>Price</h3>
              <label><input type="radio" name="price" defaultChecked /> All prices</label>
              <label><input type="radio" name="price" onChange={() => { setSort("price-low"); resetPage(); }} /> Low to high</label>
              <label><input type="radio" name="price" onChange={() => { setSort("price-high"); resetPage(); }} /> High to low</label>
            </div>

            <div className={styles.filterBlock}>
              <h3>Availability</h3>
              <label><input type="checkbox" checked={stockOnly} onChange={(event) => { setStockOnly(event.target.checked); resetPage(); }} /> In stock only</label>
            </div>

            <div className={styles.filterBlock}>
              <h3>Brands</h3>
              <label><input type="radio" name="brand" checked={brand === "all"} onChange={() => { setBrand("all"); resetPage(); }} /> All brands</label>
              {brands.map(([name, count]) => (
                <label key={name}><input type="radio" name="brand" checked={brand === name} onChange={() => { setBrand(name); resetPage(); }} /> <span>{name}</span><small>{count}</small></label>
              ))}
            </div>

            <div className={styles.filterBlock}>
              <h3>Product rating</h3>
              {[4, 3, 2].map((rating) => (
                <label key={rating}><input type="radio" name="rating" checked={minimumRating === rating} onChange={() => { setMinimumRating(rating); resetPage(); }} /> {rating}★ & above</label>
              ))}
            </div>
          </aside>

          <main className={styles.catalog}>
            <header className={styles.catalogHeader}>
              <div>
                <p>{category.parentLabel || category.rootLabel || "Category"}</p>
                <h1>{category.label}</h1>
                <span>{filtered.length} products found</span>
              </div>
              <div className={styles.sortWrap}>
                <Grid2X2 size={18} />
                <label>
                  <span>Sort by</span>
                  <select value={sort} onChange={(event) => { setSort(event.target.value); resetPage(); }}>
                    <option value="popular">Popularity</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Top rated</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                  </select>
                  <ChevronDown size={14} />
                </label>
              </div>
            </header>

            <div className={styles.searchBar}>
              <Search size={18} />
              <input value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} placeholder={`Search in ${category.label}`} />
            </div>

            {visibleProducts.length > 0 ? (
              <div className={styles.grid}>
                {visibleProducts.map((product) => {
                  const price = getProductPrice(product);
                  const regular = product.pricing?.regularPrice ?? price;
                  const discount = getProductDiscount(product);
                  const symbol = getCurrencySymbol(product.pricing?.currency || "BDT");
                  const image = product.media?.featuredImage?.url || "/images/product-fallback.png";
                  const rating = product.ratings?.average ?? 0;
                  return (
                    <article className={styles.productCard} key={product.id}>
                      <button type="button" className={styles.favorite} aria-label={`Save ${product.name}`}><Heart size={16} /></button>
                      {discount > 0 && <span className={styles.discount}>{discount}% OFF</span>}
                      <Link href={`/products/${product.slug}`} className={styles.imageWrap}>
                        <Image src={image} alt={product.media?.featuredImage?.alt || product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1000px) 25vw, 180px" className={styles.productImage} unoptimized />
                      </Link>
                      <div className={styles.productBody}>
                        <p className={styles.brand}>{product.brand?.name || "Arogga"}</p>
                        <Link href={`/products/${product.slug}`} className={styles.productName}>{product.name}</Link>
                        <div className={styles.rating}><Star size={12} fill="#f5a623" strokeWidth={0} /><strong>{rating.toFixed(1)}</strong><span>({product.ratings?.count ?? 0})</span></div>
                        <div className={styles.price}><strong>{symbol}{price.toFixed(0)}</strong>{regular > price && <del>{symbol}{regular.toFixed(0)}</del>}</div>
                        <div className={styles.cardBottom}>
                          <small>{(product.inventory?.availableQuantity ?? 0) > 0 ? "In stock" : "Out of stock"}</small>
                          <button type="button" disabled={(product.inventory?.availableQuantity ?? 0) <= 0} onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}><ShoppingCart size={15} /> ADD</button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}><Search size={34} /><h2>No products found</h2><p>Try clearing filters or using another search term.</p></div>
            )}

            {totalPages > 1 && (
              <nav className={styles.pagination} aria-label="Product pages">
                <button type="button" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft size={16} /> Previous</button>
                <span>Page {safePage} of {totalPages}</span>
                <button type="button" disabled={safePage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next <ChevronRight size={16} /></button>
              </nav>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
