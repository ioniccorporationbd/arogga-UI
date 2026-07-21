"use client";

import { ChevronLeft, ChevronRight, Rocket, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import AddToCartButton from "@/Components/cart/AddToCartButton";
import {
  FALLBACK_IMAGE,
  type ProductCardData,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        setProducts(await fetchTaraProducts(controller.signal));
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
    <section className="hc-row" style={{ background: section.background || "#fff" }} aria-labelledby={`${section.id}-title`}>
      <div className="hc-container">
        <header className="hc-header">
          <div>
            <h2 id={`${section.id}-title`} style={{ color: section.headingColor || "#087b75" }}>
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
            addedLabel="Added"
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
    .hc-sections{width:100%;overflow:hidden}.hc-row{padding:52px 0}.hc-container{width:min(1440px,calc(100% - 64px));margin:auto}.hc-header{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:22px}.hc-header h2{margin:0;font-size:22px;font-weight:850;letter-spacing:-.02em}.hc-header p{margin:7px 0 0;color:#667085;font-size:13px}.hc-header>a{display:flex;align-items:center;gap:5px;color:#087b75;font-weight:800;font-size:13px;text-decoration:none}.hc-slider{position:relative}.hc-scroll{display:flex;flex-wrap:nowrap;gap:16px;overflow-x:auto;padding:10px 2px 20px;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-inline:contain;-webkit-overflow-scrolling:touch}.hc-scroll::-webkit-scrollbar{display:none}.hc-card{width:calc((100% - 80px)/6);min-width:calc((100% - 80px)/6);flex:0 0 calc((100% - 80px)/6);display:flex;flex-direction:column;overflow:hidden;border:1px solid #dfe4e8;border-radius:15px;background:#fff;box-shadow:0 10px 28px -23px rgba(15,23,42,.48);scroll-snap-align:start;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease}.hc-card:hover{border-color:#a8d6cf;transform:translateY(-6px);box-shadow:0 25px 45px -30px rgba(8,123,117,.55)}.hc-image-link{position:relative;display:block;aspect-ratio:1;overflow:hidden;background:#fafcfb}.hc-image-link img{width:100%;height:100%;padding:15px;object-fit:contain;transition:transform .4s ease}.hc-card:hover img{transform:scale(1.05)}.hc-discount{position:absolute;top:0;left:9px;padding:6px 8px;border-radius:0 0 6px 6px;color:#fff;background:#0969e8;font-size:12px;font-weight:800;text-align:center}.hc-brand{position:absolute;top:10px;right:10px;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:6px 9px;border-radius:999px;color:#087b75;background:rgba(255,255,255,.94);font-size:11px;font-weight:750;box-shadow:0 8px 18px -14px rgba(15,23,42,.6)}.hc-content{display:flex;min-height:250px;flex:1;flex-direction:column;padding:13px}.hc-delivery{display:flex;width:max-content;align-items:center;gap:7px;padding:5px 8px;border-radius:7px;background:#f0f1f3;font-size:11px;font-weight:750}.hc-delivery span{display:flex;width:23px;height:23px;align-items:center;justify-content:center;border-radius:50%;color:#ffd63d;background:#172033}.hc-title{display:-webkit-box;min-height:45px;margin-top:11px;overflow:hidden;color:#101828;font-size:14px;font-weight:680;line-height:1.55;text-decoration:none;-webkit-line-clamp:2;-webkit-box-orient:vertical}.hc-title:hover{color:#087b75}.hc-category,.hc-stock{margin:5px 0 0;color:#667085;font-size:11px}.hc-stock.in-stock{color:#087b75}.hc-stock.out-of-stock{color:#d92d20}.hc-rating{display:flex;align-items:center;gap:1px;margin-top:7px}.hc-rating small{margin-left:5px;color:#667085;font-size:11px}.hc-price-row{display:flex;justify-content:space-between;align-items:flex-end;gap:8px;margin-top:auto;padding-top:12px}.hc-price-row del{display:block;color:#667085;font-size:11px}.hc-price-row strong{display:block;margin-top:3px;color:#101828;font-size:17px}.hc-add-button{min-height:30px!important;padding:0 11px!important;border-radius:999px!important;font-size:10px!important;letter-spacing:.03em}.hc-add-button svg{width:13px;height:13px}.hc-add-button:hover{transform:translateY(-1px)}.hc-arrow{position:absolute;top:43%;z-index:5;width:42px;height:42px;border:1px solid #d7dde1;border-radius:50%;color:#087b75;background:#fff;box-shadow:0 10px 25px -12px rgba(15,23,42,.42);cursor:pointer;transition:.25s}.hc-left{left:-21px}.hc-right{right:-21px}.hc-arrow.hidden{opacity:0;pointer-events:none}.hc-skeleton{padding:14px}.hc-skeleton div{aspect-ratio:1;background:#eef0f2;animation:hc-pulse 1.4s infinite}.hc-skeleton span{display:block;height:16px;margin-top:12px;border-radius:5px;background:#eef0f2;animation:hc-pulse 1.4s infinite}.hc-error{display:grid;place-items:center;gap:8px;min-height:280px;color:#b42318}@keyframes hc-pulse{50%{opacity:.55}}
    @media(max-width:1279px){.hc-card{width:calc((100% - 48px)/4);min-width:calc((100% - 48px)/4);flex-basis:calc((100% - 48px)/4)}}
    @media(max-width:1023px){.hc-container{width:calc(100% - 32px)}.hc-card{width:calc((100% - 32px)/3);min-width:calc((100% - 32px)/3);flex-basis:calc((100% - 32px)/3)}}
    @media(max-width:767px){.hc-row{padding:40px 0}.hc-container{width:100%}.hc-header{padding:0 14px}.hc-scroll{padding-left:14px;padding-right:14px;gap:12px}.hc-arrow{display:none}.hc-card{width:min(78vw,245px);min-width:min(78vw,245px);flex-basis:min(78vw,245px)}}
    @media(prefers-reduced-motion:reduce){.hc-card,.hc-image-link img,.hc-price-row button{transition:none!important}.hc-scroll{scroll-behavior:auto!important}}
  `}</style>;
}
