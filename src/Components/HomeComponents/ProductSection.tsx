"use client";

import { ChevronLeft, ChevronRight, Rocket, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import AddToCartButton from "@/Components/cart/AddToCartButton";
import {
  FALLBACK_IMAGE,
  type ProductCardData,
  fetchProductCatalog,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        setProducts(await fetchProductCatalog(controller.signal));
      } catch (errorValue) {
        if (errorValue instanceof DOMException && errorValue.name === "AbortError") return;
        setError(errorValue instanceof Error ? errorValue.message : "Product data could not be loaded.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadProducts();
    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <div className="hc-error" role="alert">
        <ShoppingBag size={34} />
        <strong>Product data could not be loaded</strong>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="hc-sections">
      {sections.map((section) => (
        <ProductRow key={section.id} section={section} products={products} loading={loading} />
      ))}
      <ProductSectionStyles />
    </div>
  );
}

function ProductRow({
  section,
  products,
  loading,
}: {
  section: ProductSectionConfig;
  products: ProductCardData[];
  loading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const cardCount = section.minimumCards ?? 20;

  const cards = useMemo(() => {
    const matched = section.filter ? products.filter(section.filter) : products;
    const source = matched.length > 0 ? matched : products;
    return getRandomProducts(source, cardCount, `${section.id}-${section.startIndex ?? 0}`);
  }, [cardCount, products, section]);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const maximum = element.scrollWidth - element.clientWidth;
    setCanScrollLeft(element.scrollLeft > 4);
    setCanScrollRight(element.scrollLeft < maximum - 4);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    updateScrollState();
    element.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateScrollState) : null;
    observer?.observe(element);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      observer?.disconnect();
    };
  }, [cards.length, updateScrollState]);

  function scroll(direction: 1 | -1) {
    const element = scrollRef.current;
    if (!element) return;
    const card = element.querySelector<HTMLElement>("[data-hc-card]");
    const cardWidth = card?.getBoundingClientRect().width ?? 220;
    const styles = window.getComputedStyle(element);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
    const visibleCount = window.innerWidth >= 1280 ? 6 : window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 1;

    element.scrollBy({
      left: direction * (cardWidth + gap) * visibleCount,
      behavior: "smooth",
    });
  }

  return (
    <section
      className="hc-row"
      style={{
        "--hc-row-bg": section.background || "#fff",
        "--hc-accent": section.headingColor || "#087b75",
      } as CSSProperties}
      aria-labelledby={`${section.id}-title`}
    >
      <div className="hc-container">
        <header className="hc-header">
          <div>
            <span className="hc-kicker">Curated deals</span>
            <h2 id={`${section.id}-title`}>
              {section.title}
            </h2>
            {section.subtitle && <p>{section.subtitle}</p>}
          </div>
          <Link href={section.href || "/store"}>
            See all <ChevronRight size={16} />
          </Link>
        </header>

        <div className="hc-slider">
          <button
            type="button"
            className={`hc-arrow hc-left ${canScrollLeft ? "" : "hidden"}`}
            onClick={() => scroll(-1)}
            aria-label="Previous products"
          >
            <ChevronLeft />
          </button>

          <div ref={scrollRef} className="hc-scroll">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} />)
              : cards.map((product) => <ProductCard key={product.renderKey} product={product} />)}
          </div>

          <button
            type="button"
            className={`hc-arrow hc-right ${canScrollRight ? "" : "hidden"}`}
            onClick={() => scroll(1)}
            aria-label="Next products"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const stars = Math.round(product.rating ?? 0);

  return (
    <article data-hc-card className="hc-card">
      <Link href={product.href} className="hc-image-link" aria-label={`View ${product.name}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        {product.discountPercent > 0 && (
          <span className="hc-discount">
            {product.discountPercent}%<br />OFF
          </span>
        )}
        <span className="hc-brand">{product.brand}</span>
      </Link>

      <div className="hc-content">
        <div className="hc-delivery">
          <span><Rocket size={13} fill="currentColor" strokeWidth={0} /></span>
          {product.deliveryTime}
        </div>

        <Link href={product.href} className="hc-title">
          {product.name}
        </Link>
        <p className="hc-category">{product.category}</p>

        <div className="hc-rating" aria-label={`${product.rating ?? 0} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={14} fill={index < stars ? "#ffb400" : "#dce3ea"} strokeWidth={0} />
          ))}
          <small>{product.rating !== null ? `${product.rating.toFixed(1)} (${product.reviewCount})` : "Not rated"}</small>
        </div>

        <p className={`hc-stock ${product.inStock ? "in-stock" : "out-of-stock"}`}>
          {product.inStock ? `${product.availableQuantity} available` : "Out of stock"}
        </p>

        <div className="hc-price-row">
          <div>
            {product.discountPercent > 0 && (
              <del>{product.currencySymbol}{formatPrice(product.regularPrice)}</del>
            )}
            <strong>{product.currencySymbol}{formatPrice(product.salePrice)}</strong>
          </div>
          <AddToCartButton
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.salePrice,
              image: product.image,
              sku: product.category,
              maxQuantity: product.availableQuantity,
            }}
            disabled={!product.inStock}
            className="hc-add-button"
            label="Add"
            addedLabel="Done"
            showIcon={false}
          />
        </div>
      </div>
    </article>
  );
}

function Skeleton() {
  return <div className="hc-card hc-skeleton"><div /><span /><span /><span /></div>;
}

function formatPrice(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function ProductSectionStyles() {
  return <style>{`
    .hc-sections {
      width: 100%;
      overflow: hidden;
      background: #fff;
    }

    .hc-row {
      --hc-row-bg: #fff;
      --hc-accent: #087b75;
      position: relative;
      isolation: isolate;
      padding: 46px 0;
      background:
        radial-gradient(circle at 6% 12%, color-mix(in srgb, var(--hc-accent) 13%, transparent), transparent 30%),
        radial-gradient(circle at 96% 80%, rgba(255, 190, 118, 0.16), transparent 28%),
        linear-gradient(180deg, color-mix(in srgb, var(--hc-row-bg) 88%, #ffffff), #ffffff 72%);
    }

    .hc-row::before {
      position: absolute;
      inset: 18px 0 auto;
      z-index: -1;
      height: 1px;
      background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--hc-accent) 22%, transparent), transparent);
      content: "";
    }

    .hc-container {
      width: min(1440px, calc(100% - 64px));
      margin: auto;
    }

    .hc-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 18px;
      padding: 0 2px;
    }

    .hc-kicker {
      display: inline-flex;
      min-height: 26px;
      align-items: center;
      padding: 0 10px;
      border: 1px solid color-mix(in srgb, var(--hc-accent) 18%, #ffffff);
      border-radius: 999px;
      color: var(--hc-accent);
      background: color-mix(in srgb, var(--hc-accent) 8%, #ffffff);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.09em;
      text-transform: uppercase;
    }

    .hc-header h2 {
      margin: 8px 0 0;
      color: var(--hc-accent);
      font-size: clamp(21px, 2.15vw, 30px);
      font-weight: 950;
      line-height: 1.05;
      letter-spacing: -0.045em;
    }

    .hc-header p {
      max-width: 540px;
      margin: 8px 0 0;
      color: #667085;
      font-size: 13px;
      line-height: 1.55;
    }

    .hc-header > a {
      display: inline-flex;
      min-height: 38px;
      align-items: center;
      gap: 6px;
      padding: 0 14px;
      border: 1px solid color-mix(in srgb, var(--hc-accent) 18%, #ffffff);
      border-radius: 999px;
      color: var(--hc-accent);
      background: rgba(255, 255, 255, 0.78);
      box-shadow: 0 12px 28px -24px rgba(15, 23, 42, 0.5);
      font-size: 12px;
      font-weight: 900;
      text-decoration: none;
      transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
    }

    .hc-header > a:hover {
      transform: translateY(-2px);
      background: #fff;
      box-shadow: 0 18px 34px -26px color-mix(in srgb, var(--hc-accent) 55%, transparent);
    }

    .hc-slider {
      position: relative;
    }

    .hc-scroll {
      display: flex;
      flex-wrap: nowrap;
      gap: 16px;
      overflow-x: auto;
      padding: 10px 2px 22px;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      overscroll-behavior-inline: contain;
      -webkit-overflow-scrolling: touch;
    }

    .hc-scroll::-webkit-scrollbar { display: none; }

    .hc-card {
      position: relative;
      display: flex;
      width: calc((100% - 80px) / 6);
      min-width: calc((100% - 80px) / 6);
      flex: 0 0 calc((100% - 80px) / 6);
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e4e9ed;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.96);
      box-shadow:
        0 18px 44px -34px rgba(15, 23, 42, 0.55),
        inset 0 1px rgba(255, 255, 255, 0.9);
      scroll-snap-align: start;
      transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
    }

    .hc-card::after {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(145deg, rgba(255,255,255,.28), transparent 38%);
      opacity: 0;
      transition: opacity 260ms ease;
      content: "";
    }

    .hc-card:hover {
      border-color: color-mix(in srgb, var(--hc-accent) 34%, #dfe7ea);
      transform: translateY(-7px);
      box-shadow:
        0 30px 58px -34px color-mix(in srgb, var(--hc-accent) 42%, transparent),
        0 12px 30px -24px rgba(15, 23, 42, 0.38);
    }

    .hc-card:hover::after { opacity: 1; }

    .hc-image-link {
      position: relative;
      display: block;
      aspect-ratio: 1;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 35%, #ffffff, #f3f7f7 68%);
      cursor: pointer;
    }

    .hc-image-link img {
      width: 100%;
      height: 100%;
      padding: 14px;
      object-fit: contain;
      transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 260ms ease;
    }

    .hc-card:hover img {
      transform: scale(1.06);
      filter: saturate(1.04) contrast(1.02);
    }

    .hc-discount {
      position: absolute;
      top: 0;
      left: 10px;
      z-index: 2;
      padding: 6px 8px;
      border-radius: 0 0 8px 8px;
      color: #fff;
      background: linear-gradient(180deg, #0b73ff, #084bc7);
      box-shadow: 0 12px 22px -16px rgba(8, 75, 199, 0.85);
      font-size: 11px;
      font-weight: 900;
      line-height: 1.05;
      text-align: center;
    }

    .hc-brand {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 2;
      max-width: 108px;
      overflow: hidden;
      padding: 5px 8px;
      border: 1px solid rgba(255, 255, 255, 0.78);
      border-radius: 999px;
      color: var(--hc-accent);
      background: rgba(255, 255, 255, 0.92);
      box-shadow: 0 8px 18px -14px rgba(15, 23, 42, 0.58);
      backdrop-filter: blur(10px);
      font-size: 10px;
      font-weight: 850;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .hc-content {
      display: flex;
      min-height: 232px;
      flex: 1;
      flex-direction: column;
      padding: 12px 13px 13px;
    }

    .hc-delivery {
      display: inline-flex;
      width: fit-content;
      align-items: center;
      gap: 5px;
      padding: 5px 8px;
      border-radius: 999px;
      color: #0b817a;
      background: #eefaf8;
      font-size: 10px;
      font-weight: 850;
    }

    .hc-delivery span {
      display: grid;
      width: 17px;
      height: 17px;
      place-items: center;
      border-radius: 999px;
      color: #fff;
      background: #0b817a;
    }

    .hc-title {
      display: -webkit-box;
      min-height: 42px;
      overflow: hidden;
      margin-top: 10px;
      color: #1d2939;
      font-size: 13px;
      font-weight: 850;
      line-height: 1.35;
      text-decoration: none;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      transition: color 180ms ease;
    }

    .hc-title:hover { color: var(--hc-accent); }

    .hc-category {
      overflow: hidden;
      margin: 6px 0 0;
      color: #8a94a3;
      font-size: 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .hc-rating {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-top: 8px;
      color: #98a2b3;
    }

    .hc-rating small {
      margin-left: 4px;
      font-size: 10px;
      font-weight: 750;
    }

    .hc-stock {
      margin: 8px 0 0;
      font-size: 10px;
      font-weight: 850;
    }

    .hc-stock.in-stock { color: #148f67; }
    .hc-stock.out-of-stock { color: #d92d20; }

    .hc-price-row {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 9px;
      margin-top: auto;
      padding-top: 12px;
    }

    .hc-price-row del {
      display: block;
      color: #98a2b3;
      font-size: 10px;
      line-height: 1.2;
    }

    .hc-price-row strong {
      display: block;
      color: #101828;
      font-size: 16px;
      font-weight: 950;
      letter-spacing: -0.03em;
    }

    .hc-add-button {
      min-height: 27px !important;
      padding: 0 10px !important;
      border-radius: 9px !important;
      font-size: 10px !important;
      letter-spacing: .035em;
    }

    .hc-add-button:hover { transform: translateY(-1px); }

    .hc-arrow {
      position: absolute;
      top: 43%;
      z-index: 5;
      display: grid;
      width: 42px;
      height: 42px;
      place-items: center;
      border: 1px solid #dfe9e7;
      border-radius: 14px;
      color: var(--hc-accent);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 18px 34px -24px rgba(15,23,42,.66);
      backdrop-filter: blur(12px);
      cursor: pointer;
      transition: transform 180ms ease, opacity 180ms ease, background 180ms ease;
    }

    .hc-arrow:hover { transform: translateY(-50%) scale(1.04); background: #fff; }
    .hc-arrow svg { width: 20px; height: 20px; }
    .hc-left { left: -18px; transform: translateY(-50%); }
    .hc-right { right: -18px; transform: translateY(-50%); }
    .hc-arrow.hidden { opacity: 0; pointer-events: none; }

    .hc-skeleton {
      min-height: 430px;
      padding: 14px;
      gap: 12px;
    }

    .hc-skeleton div,
    .hc-skeleton span {
      display: block;
      border-radius: 14px;
      background: linear-gradient(90deg, #eef2f3, #f8fafb, #eef2f3);
      background-size: 220% 100%;
      animation: hcSkeleton 1.4s ease-in-out infinite;
    }

    .hc-skeleton div { aspect-ratio: 1; }
    .hc-skeleton span { height: 14px; }

    @keyframes hcSkeleton {
      0% { background-position: 120% 0; }
      100% { background-position: -120% 0; }
    }

    .hc-error {
      display: grid;
      min-height: 220px;
      place-items: center;
      gap: 8px;
      color: #d92d20;
      background: #fff7f6;
      text-align: center;
    }

    @media (max-width: 1279px) {
      .hc-card { width: calc((100% - 48px) / 4); min-width: calc((100% - 48px) / 4); flex-basis: calc((100% - 48px) / 4); }
    }

    @media (max-width: 1023px) {
      .hc-container { width: calc(100% - 32px); }
      .hc-card { width: calc((100% - 32px) / 3); min-width: calc((100% - 32px) / 3); flex-basis: calc((100% - 32px) / 3); }
    }

    @media (max-width: 767px) {
      .hc-row { padding: 36px 0; }
      .hc-container { width: 100%; }
      .hc-header { align-items: flex-start; flex-direction: column; gap: 12px; padding: 0 14px; }
      .hc-scroll { gap: 12px; padding-right: 14px; padding-left: 14px; }
      .hc-arrow { display: none; }
      .hc-card { width: min(78vw, 242px); min-width: min(78vw, 242px); flex-basis: min(78vw, 242px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .hc-card,
      .hc-card::after,
      .hc-image-link img,
      .hc-header > a,
      .hc-arrow,
      .hc-skeleton div,
      .hc-skeleton span {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
      .hc-scroll { scroll-behavior: auto !important; }
    }
  `}</style>;
}
