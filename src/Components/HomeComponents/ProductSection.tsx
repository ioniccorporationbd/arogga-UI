"use client";

import { Check, ChevronLeft, ChevronRight, Rocket, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FALLBACK_IMAGE,
  ProductCardData,
  fetchTaraProducts,
  getRandomProducts,
} from "./product-data";

export type ProductSectionConfig = {
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
  minimumCards?: number;
  startIndex?: number;
  background?: string;
  headingColor?: string;
  filter?: (product: ProductCardData) => boolean;
};

export function ProductSectionCollection({ sections }: { sections: ProductSectionConfig[] }) {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setProducts(await fetchTaraProducts(controller.signal));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Product data could not be loaded.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const toggleCart = (id: string) => {
    setCartItems((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  };

  if (error) {
    return <div className="hc-error"><ShoppingCart size={34} /><strong>Product data could not be loaded</strong><span>{error}</span></div>;
  }

  return (
    <div className="hc-sections">
      {sections.map((section) => (
        <ProductRow
          key={section.id}
          section={section}
          products={products}
          loading={loading}
          cartItems={cartItems}
          onToggleCart={toggleCart}
        />
      ))}
      <ProductSectionStyles />
    </div>
  );
}

function ProductRow({ section, products, loading, cartItems, onToggleCart }: {
  section: ProductSectionConfig;
  products: ProductCardData[];
  loading: boolean;
  cartItems: string[];
  onToggleCart: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const minimum = section.minimumCards ?? 20;

  const cards = useMemo(() => {
    const matched = section.filter ? products.filter(section.filter) : products;
    const source = matched.length > 0 ? matched : products;
    return getRandomProducts(source, minimum, `${section.id}-${section.startIndex ?? 0}`);
  }, [minimum, products, section]);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setLeft(el.scrollLeft > 4);
    setRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [cards.length, update]);

  const scroll = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-hc-card]");
    const width = card?.getBoundingClientRect().width ?? 230;
    el.scrollBy({ left: direction * (width + 16) * 4, behavior: "smooth" });
  };

  return (
    <section className="hc-row" style={{ background: section.background || "#fff" }}>
      <div className="hc-container">
        <header className="hc-header">
          <div>
            <h2 style={{ color: section.headingColor || "#087b75" }}>{section.title}</h2>
            {section.subtitle && <p>{section.subtitle}</p>}
          </div>
          <Link href={section.href || "/store"}>See all <ChevronRight size={16} /></Link>
        </header>
        <div className="hc-slider">
          <button className={`hc-arrow hc-left ${left ? "" : "hidden"}`} onClick={() => scroll(-1)} aria-label="Previous products"><ChevronLeft /></button>
          <div ref={ref} className="hc-scroll">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
              : cards.map((product) => (
                  <ProductCard
                    key={product.renderKey}
                    product={product}
                    added={cartItems.includes(product.id)}
                    onToggle={() => onToggleCart(product.id)}
                  />
                ))}
          </div>
          <button className={`hc-arrow hc-right ${right ? "" : "hidden"}`} onClick={() => scroll(1)} aria-label="Next products"><ChevronRight /></button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, added, onToggle }: { product: ProductCardData; added: boolean; onToggle: () => void }) {
  const stars = Math.round(product.rating ?? 0);
  return (
    <article data-hc-card className="hc-card">
      <Link href={product.href} className="hc-image-link">
        <img src={product.image} alt={product.imageAlt} loading="lazy" onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }} />
        {product.discountPercent > 0 && <span className="hc-discount">{product.discountPercent}%<br />OFF</span>}
        <span className="hc-brand">{product.brand}</span>
      </Link>
      <div className="hc-content">
        <div className="hc-delivery"><span><Rocket size={13} fill="currentColor" strokeWidth={0} /></span>{product.deliveryTime}</div>
        <Link href={product.href} className="hc-title">{product.name}</Link>
        <p className="hc-category">{product.category}</p>
        <div className="hc-rating">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < stars ? "#ffb400" : "#dce3ea"} strokeWidth={0} />)}
          <small>{product.rating !== null ? `${product.rating.toFixed(1)} (${product.reviewCount})` : "Not rated"}</small>
        </div>
        <p className="hc-stock">{product.inStock ? `${product.availableQuantity} available` : "Out of stock"}</p>
        <div className="hc-price-row">
          <div>
            {product.discountPercent > 0 && <del>{product.currencySymbol}{formatPrice(product.regularPrice)}</del>}
            <strong>{product.currencySymbol}{formatPrice(product.salePrice)}</strong>
          </div>
          <button disabled={!product.inStock} onClick={onToggle} className={added ? "added" : ""}>
            {added ? <><Check size={15} /> Added</> : "ADD"}
          </button>
        </div>
      </div>
    </article>
  );
}

function Skeleton() {
  return <div className="hc-card hc-skeleton"><div /><span /><span /><span /></div>;
}

function formatPrice(value: number) { return Number.isInteger(value) ? String(value) : value.toFixed(2); }

function ProductSectionStyles() {
  return <style jsx global>{`
    .hc-sections{width:100%;overflow:hidden}.hc-row{padding:58px 0}.hc-container{width:min(1440px,calc(100% - 64px));margin:auto}.hc-header{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:24px}.hc-header h2{margin:0;font-size:22px;font-weight:800}.hc-header p{margin:7px 0 0;color:#667085;font-size:13px}.hc-header>a{display:flex;align-items:center;gap:5px;color:#087b75;font-weight:800;font-size:13px;text-decoration:none}.hc-slider{position:relative}.hc-scroll{display:flex;flex-wrap:nowrap;gap:16px;overflow-x:auto;padding:10px 2px 20px;scroll-snap-type:x proximity;scrollbar-width:thin}.hc-card{width:230px;min-width:230px;flex:0 0 230px;display:flex;flex-direction:column;overflow:hidden;border:1px solid #dfe4e8;border-radius:15px;background:#fff;box-shadow:0 10px 28px -23px rgba(15,23,42,.48);scroll-snap-align:start;transition:.3s}.hc-card:hover{transform:translateY(-6px);box-shadow:0 25px 45px -30px rgba(8,123,117,.55)}.hc-image-link{position:relative;display:block;aspect-ratio:1;overflow:hidden;background:#fafcfb}.hc-image-link img{width:100%;height:100%;padding:15px;object-fit:contain;transition:.4s}.hc-card:hover img{transform:scale(1.05)}.hc-discount{position:absolute;top:0;left:9px;padding:6px 8px;border-radius:0 0 6px 6px;color:#fff;background:#0969e8;font-size:12px;font-weight:800;text-align:center}.hc-brand{position:absolute;top:10px;right:10px;max-width:115px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:6px 9px;border-radius:999px;color:#087b75;background:rgba(255,255,255,.94);font-size:12px;font-weight:750}.hc-content{display:flex;min-height:255px;flex:1;flex-direction:column;padding:14px}.hc-delivery{display:flex;width:max-content;align-items:center;gap:7px;padding:5px 9px;border-radius:7px;background:#f0f1f3;font-size:12px;font-weight:750}.hc-delivery span{display:flex;width:24px;height:24px;align-items:center;justify-content:center;border-radius:50%;color:#ffd63d;background:#172033}.hc-title{display:-webkit-box;min-height:48px;margin-top:12px;overflow:hidden;color:#101828;font-size:15px;font-weight:650;line-height:1.5;text-decoration:none;-webkit-line-clamp:2;-webkit-box-orient:vertical}.hc-category,.hc-stock{margin:5px 0 0;color:#667085;font-size:12px}.hc-rating{display:flex;align-items:center;gap:2px;margin-top:8px}.hc-rating small{margin-left:5px;color:#667085}.hc-price-row{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;margin-top:auto;padding-top:14px}.hc-price-row del{display:block;color:#667085;font-size:12px}.hc-price-row strong{display:block;margin-top:3px;color:#101828;font-size:18px}.hc-price-row button{display:flex;min-height:42px;align-items:center;gap:5px;padding:0 11px;border:1px solid #087b75;border-radius:8px;color:#087b75;background:#eef9f7;font-weight:800;cursor:pointer}.hc-price-row button.added,.hc-price-row button:hover{color:#fff;background:#087b75}.hc-price-row button:disabled{opacity:.45;cursor:not-allowed}.hc-arrow{position:absolute;top:43%;z-index:5;width:42px;height:42px;border:1px solid #d7dde1;border-radius:50%;color:#087b75;background:#fff;box-shadow:0 10px 25px -12px rgba(15,23,42,.42);cursor:pointer}.hc-left{left:-21px}.hc-right{right:-21px}.hc-arrow.hidden{opacity:0;pointer-events:none}.hc-skeleton{padding:14px}.hc-skeleton div{aspect-ratio:1;background:#eef0f2;animation:pulse 1.4s infinite}.hc-skeleton span{height:16px;margin-top:12px;border-radius:5px;background:#eef0f2;animation:pulse 1.4s infinite}.hc-error{display:grid;place-items:center;gap:8px;min-height:280px;color:#b42318}@keyframes pulse{50%{opacity:.55}}@media(max-width:767px){.hc-row{padding:44px 0}.hc-container{width:100%}.hc-header{padding:0 14px}.hc-scroll{padding-left:14px;padding-right:14px}.hc-arrow{display:none}.hc-card{width:240px;min-width:240px;flex-basis:240px}}
  `}</style>;
}
