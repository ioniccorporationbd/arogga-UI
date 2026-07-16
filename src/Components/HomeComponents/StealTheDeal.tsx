"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Rocket,
  ShoppingCart,
  Star,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type JsonProduct = {
  id: number;
  brand: string;
  title: string;
  category: string;
  image: string;
  price: number;
  currency: string;
  rating: number | null;
  productUrl: string;
};

type Product = JsonProduct & {
  slug: string;
  href: string;
  discountPercent: number;
  originalPrice: number;
  salePrice: number;
  currencySymbol: string;
  deliveryTime: string;
  inStock: boolean;
};

const PRODUCTS_TO_LOAD = 20;
const PRODUCTS_PER_VIEW = 6;

const discountOptions = [5, 8, 10, 12, 15, 18, 20, 25];

export default function StealTheDeal() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch("/data.json", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Product data could not be loaded. Status: ${response.status}`,
          );
        }

        const json = (await response.json()) as unknown;

        if (!Array.isArray(json)) {
          throw new Error("Invalid product data format.");
        }

        const normalizedProducts = json
          .filter(isValidProduct)
          .slice(0, PRODUCTS_TO_LOAD)
          .map(normalizeProduct);

        setProducts(normalizedProducts);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Product data could not be loaded.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  const visibleProducts = useMemo(() => {
    return products
      .filter((product) => product.inStock)
      .slice(0, PRODUCTS_TO_LOAD);
  }, [products]);

  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const maximumScrollLeft =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 4);

    setCanScrollRight(
      container.scrollLeft < maximumScrollLeft - 4,
    );
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    updateScrollButtons();

    container.addEventListener(
      "scroll",
      updateScrollButtons,
      {
        passive: true,
      },
    );

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateScrollButtons();
      });

      resizeObserver.observe(container);
    } else {
      window.addEventListener(
        "resize",
        updateScrollButtons,
      );
    }

    return () => {
      container.removeEventListener(
        "scroll",
        updateScrollButtons,
      );

      resizeObserver?.disconnect();

      window.removeEventListener(
        "resize",
        updateScrollButtons,
      );
    };
  }, [updateScrollButtons, visibleProducts.length]);

  const scrollProducts = (
    direction: "left" | "right",
  ) => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-product-card]",
      );

    if (!firstCard) return;

    const styles = window.getComputedStyle(container);

    const gap =
      Number.parseFloat(
        styles.columnGap || styles.gap || "16",
      ) || 16;

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const desktopItems =
      window.innerWidth >= 1280
        ? 6
        : window.innerWidth >= 1024
          ? 4
          : window.innerWidth >= 768
            ? 3
            : window.innerWidth >= 640
              ? 2
              : 1;

    const scrollAmount =
      (cardWidth + gap) * desktopItems;

    container.scrollBy({
      left:
        direction === "right"
          ? scrollAmount
          : -scrollAmount,
      behavior: "smooth",
    });
  };

  const toggleCartItem = (productId: number) => {
    setCartItems((currentItems) => {
      if (currentItems.includes(productId)) {
        return currentItems.filter(
          (itemId) => itemId !== productId,
        );
      }

      return [...currentItems, productId];
    });
  };

  return (
    <>
      <section
        className="steal-deal-section"
        aria-labelledby="steal-deal-title"
      >
        <div
          aria-hidden="true"
          className="steal-deal-grid-pattern"
        />

        <div
          aria-hidden="true"
          className="steal-deal-glow steal-deal-glow-left"
        />

        <div
          aria-hidden="true"
          className="steal-deal-glow steal-deal-glow-right"
        />

        <div className="steal-deal-container">
          <header className="steal-deal-header">
            <div className="steal-deal-heading">
              <p className="steal-deal-eyebrow">
                Real beauty products
              </p>

              <h2
                id="steal-deal-title"
                className="steal-deal-title"
              >
                Maybelline: Steal the Deal
              </h2>

              <p className="steal-deal-subtitle">
                Showing 6 at a time from 20 products
              </p>
            </div>

            <Link
              href="/offers"
              className="steal-deal-see-all"
            >
              <span>See all</span>

              <ChevronRight size={16} />
            </Link>
          </header>

          <div className="steal-deal-slider">
            <button
              type="button"
              onClick={() => scrollProducts("left")}
              disabled={!canScrollLeft}
              aria-label="Show previous products"
              className={`steal-deal-arrow steal-deal-arrow-left ${
                canScrollLeft ? "" : "is-hidden"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <div
              ref={scrollContainerRef}
              className="steal-deal-scroll"
            >
              {loading &&
                Array.from({
                  length: PRODUCTS_PER_VIEW,
                }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}

              {!loading &&
                !loadError &&
                visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    added={cartItems.includes(
                      product.id,
                    )}
                    onToggleCart={() =>
                      toggleCartItem(product.id)
                    }
                  />
                ))}

              {!loading &&
                !loadError &&
                visibleProducts.length === 0 && (
                  <EmptyState />
                )}

              {!loading && loadError && (
                <ErrorState message={loadError} />
              )}
            </div>

            <button
              type="button"
              onClick={() => scrollProducts("right")}
              disabled={!canScrollRight}
              aria-label="Show more products"
              className={`steal-deal-arrow steal-deal-arrow-right ${
                canScrollRight ? "" : "is-hidden"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .steal-deal-section {
          --deal-text-20: 20px;
          --deal-text-18: 18px;
          --deal-text-16: 16px;
          --deal-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 64px 0;
          background:
            radial-gradient(
              circle at 5% 10%,
              rgba(255, 199, 235, 0.55),
              transparent 28%
            ),
            radial-gradient(
              circle at 96% 88%,
              rgba(255, 225, 244, 0.75),
              transparent 30%
            ),
            #fff0fa;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .steal-deal-grid-pattern {
          position: absolute;
          inset: 0;
          z-index: -4;
          pointer-events: none;
          opacity: 0.25;
          background-image:
            linear-gradient(
              rgba(231, 44, 163, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(231, 44, 163, 0.04) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.75),
            transparent 95%
          );
        }

        .steal-deal-glow {
          position: absolute;
          z-index: -3;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(92px);
          opacity: 0.58;
          will-change: transform;
        }

        .steal-deal-glow-left {
          top: 10px;
          left: -180px;
          background: rgba(255, 159, 220, 0.46);
          animation: stealGlowLeft 10s ease-in-out infinite;
        }

        .steal-deal-glow-right {
          right: -180px;
          bottom: -90px;
          background: rgba(255, 209, 238, 0.58);
          animation: stealGlowRight 12s ease-in-out infinite;
        }

        .steal-deal-container {
          position: relative;
          width: min(1440px, calc(100% - 64px));
          margin-inline: auto;
        }

        .steal-deal-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 26px;
        }

        .steal-deal-heading {
          min-width: 0;
        }

        .steal-deal-eyebrow {
          margin: 0;
          color: #e82ca3;
          font-size: var(--deal-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .steal-deal-title {
          margin: 6px 0 0;
          color: #ff3db9;
          font-size: var(--deal-text-20);
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: -0.025em;
        }

        .steal-deal-subtitle {
          margin: 6px 0 0;
          color: #7a536d;
          font-size: var(--deal-text-13);
          line-height: 1.6;
        }

        .steal-deal-see-all {
          display: inline-flex;
          min-height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding-inline: 6px;
          border-radius: 999px;
          color: #ff3db9;
          font-size: var(--deal-text-13);
          font-weight: 750;
          line-height: 1;
          text-decoration: none;
          transition:
            color 280ms ease,
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .steal-deal-see-all:hover {
          color: #d82496;
          transform: translateY(-2px);
        }

        .steal-deal-see-all svg {
          transition: transform 280ms ease;
        }

        .steal-deal-see-all:hover svg {
          transform: translateX(4px);
        }

        .steal-deal-slider {
          position: relative;
        }

        .steal-deal-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          overflow-y: visible;
          padding: 10px 2px 20px;
          scroll-padding-inline: 8px;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-inline: contain;
          -webkit-overflow-scrolling: touch;
        }

        .steal-deal-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .deal-product-card {
          width: min(78vw, 260px);
          flex: 0 0 min(78vw, 260px);
          scroll-snap-align: start;
        }

        .deal-card {
          display: flex;
          height: 100%;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #dfe4e8;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 10px 26px -22px rgba(15, 23, 42, 0.5);
          transform: translateZ(0);
          transition:
            transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 350ms ease,
            box-shadow 420ms ease;
          will-change: transform;
          backface-visibility: hidden;
        }

        .deal-card:hover {
          border-color: #e1bdd7;
          transform: translate3d(0, -7px, 0);
          box-shadow:
            0 28px 52px -30px rgba(192, 41, 142, 0.35),
            0 14px 28px -23px rgba(15, 23, 42, 0.35);
        }

        .deal-image-link {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #fafafa;
        }

        .deal-product-image {
          width: 100%;
          height: 100%;
          padding: 16px;
          object-fit: contain;
          transform: scale(1.001);
          transition:
            transform 650ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 500ms ease;
          will-change: transform;
        }

        .deal-card:hover .deal-product-image {
          transform: scale(1.055);
          filter: saturate(1.03) contrast(1.02);
        }

        .deal-discount {
          position: absolute;
          top: 0;
          left: 8px;
          padding: 5px 7px;
          border-radius: 0 0 5px 5px;
          color: #ffffff;
          background: #0969e8;
          box-shadow: 0 5px 12px -7px rgba(9, 105, 232, 0.8);
          font-size: var(--deal-text-13);
          font-weight: 800;
          line-height: 1.05;
          text-align: center;
        }

        .deal-category {
          position: absolute;
          top: 9px;
          right: 9px;
          max-width: 120px;
          overflow: hidden;
          padding: 6px 9px;
          border-radius: 999px;
          color: #087b75;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 7px 16px -11px rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          font-size: var(--deal-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .deal-card-content {
          display: flex;
          min-height: 245px;
          flex: 1;
          flex-direction: column;
          padding: 14px;
        }

        .deal-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 34px;
          align-items: center;
          gap: 8px;
          padding: 5px 9px;
          border-radius: 6px;
          color: #202939;
          background: #f0f1f3;
          font-size: var(--deal-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .deal-delivery-icon {
          display: flex;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffd63d;
          background: #172033;
        }

        .deal-brand {
          margin: 13px 0 0;
          color: #087b75;
          font-size: var(--deal-text-13);
          font-weight: 750;
          line-height: 1.4;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .deal-product-title {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 5px 0 0;
          color: #101010;
          font-size: var(--deal-text-16);
          font-weight: 650;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .deal-card:hover .deal-product-title {
          color: #087b75;
        }

        .deal-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 8px;
        }

        .deal-rating-text {
          margin-left: 6px;
          color: #667085;
          font-size: var(--deal-text-13);
          line-height: 1.4;
        }

        .deal-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 14px;
        }

        .deal-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--deal-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .deal-sale-price {
          margin: 3px 0 0;
          color: #101010;
          font-size: var(--deal-text-18);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .deal-add-button {
          display: inline-flex;
          min-width: 54px;
          min-height: 42px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0 11px;
          border: 1px solid #087b75;
          border-radius: 8px;
          color: #087b75;
          background: #eef9f7;
          font-family: inherit;
          font-size: var(--deal-text-13);
          font-weight: 800;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .deal-add-button:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow: 0 11px 22px -14px rgba(8, 123, 117, 0.65);
          transform: translateY(-2px);
        }

        .deal-add-button:active {
          transform: scale(0.97);
        }

        .deal-add-button.is-added {
          color: #ffffff;
          background: #087b75;
        }

        .deal-source {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          color: #667085;
          font-size: var(--deal-text-13);
          font-weight: 600;
          line-height: 1.4;
          text-decoration: none;
          transition: color 250ms ease;
        }

        .deal-source:hover {
          color: #087b75;
        }

        .steal-deal-arrow {
          position: absolute;
          top: 44%;
          z-index: 30;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid #d9dfe3;
          border-radius: 50%;
          color: #087b75;
          background: #ffffff;
          box-shadow: 0 10px 25px -12px rgba(15, 23, 42, 0.4);
          cursor: pointer;
          transform: translateY(-50%);
          transition:
            opacity 260ms ease,
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 250ms ease,
            background-color 250ms ease;
        }

        .steal-deal-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .steal-deal-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .steal-deal-arrow:hover {
          border-color: #087b75;
          background: #f0faf8;
        }

        .steal-deal-arrow-left:hover {
          transform: translate(-50%, -50%) scale(1.07);
        }

        .steal-deal-arrow-right:hover {
          transform: translate(50%, -50%) scale(1.07);
        }

        .steal-deal-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .deal-state {
          display: flex;
          min-height: 360px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #eadce5;
          border-radius: 18px;
          background: #ffffff;
          padding: 24px;
          text-align: center;
        }

        .deal-state-title {
          margin: 13px 0 0;
          font-size: var(--deal-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .deal-state-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--deal-text-13);
          line-height: 1.6;
        }

        .deal-retry-button {
          min-height: 42px;
          margin-top: 15px;
          padding-inline: 18px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: var(--deal-text-13);
          font-weight: 750;
          cursor: pointer;
          transition:
            background-color 250ms ease,
            transform 250ms ease;
        }

        .deal-retry-button:hover {
          background: #066b66;
          transform: translateY(-2px);
        }

        @keyframes stealGlowLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(30px, -20px, 0) scale(1.08);
          }
        }

        @keyframes stealGlowRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-28px, -18px, 0) scale(1.07);
          }
        }

        @media (min-width: 1280px) {
          .deal-product-card {
            width: calc((100% - 80px) / 6);
            flex-basis: calc((100% - 80px) / 6);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .steal-deal-section {
            padding: 58px 0;
          }

          .steal-deal-container {
            width: min(980px, calc(100% - 48px));
          }

          .deal-product-card {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .steal-deal-section {
            padding: 54px 0;
          }

          .steal-deal-container {
            width: min(760px, calc(100% - 40px));
          }

          .deal-product-card {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }

          .steal-deal-arrow {
            width: 40px;
            height: 40px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .steal-deal-section {
            padding: 50px 0;
          }

          .steal-deal-container {
            width: calc(100% - 32px);
          }

          .deal-product-card {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .steal-deal-arrow {
            display: none;
          }
        }

        @media (max-width: 639px) {
          .steal-deal-section {
            padding: 44px 0 48px;
          }

          .steal-deal-container {
            width: 100%;
          }

          .steal-deal-header {
            align-items: flex-start;
            margin-bottom: 18px;
            padding-inline: 14px;
          }

          .steal-deal-title,
          .steal-deal-subtitle {
            max-width: 230px;
          }

          .steal-deal-see-all {
            min-height: 40px;
            padding-inline: 2px;
          }

          .steal-deal-scroll {
            gap: 12px;
            padding: 10px 14px 20px;
            scroll-padding-inline: 14px;
          }

          .deal-product-card {
            width: min(82vw, 268px);
            flex-basis: min(82vw, 268px);
          }

          .steal-deal-arrow {
            display: none;
          }

          .deal-card-content {
            min-height: 235px;
            padding: 13px;
          }

          .deal-product-image {
            padding: 14px;
          }
        }

        @media (max-width: 380px) {
          .steal-deal-header {
            gap: 12px;
            padding-inline: 11px;
          }

          .steal-deal-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .deal-product-card {
            width: calc(100vw - 36px);
            flex-basis: calc(100vw - 36px);
          }

          .deal-category {
            max-width: 95px;
          }
        }

        @media (hover: none) {
          .deal-card:hover,
          .deal-card:hover .deal-product-image,
          .deal-add-button:hover,
          .steal-deal-see-all:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .steal-deal-section *,
          .steal-deal-section *::before,
          .steal-deal-section *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}

function ProductCard({
  product,
  added,
  onToggleCart,
}: {
  product: Product;
  added: boolean;
  onToggleCart: () => void;
}) {
  const roundedRating = Math.round(
    product.rating ?? 0,
  );

  return (
    <article
      data-product-card
      className="deal-product-card deal-card"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="deal-image-link"
      >
        <img
          src={product.image}
          alt={product.title}
          width={600}
          height={600}
          loading="lazy"
          draggable={false}
          onError={(event) => {
            event.currentTarget.src =
              "/images/product-fallback.png";
          }}
          className="deal-product-image"
        />

        <span className="deal-discount">
          {product.discountPercent}%
          <br />
          OFF
        </span>

        <span className="deal-category">
          {product.category}
        </span>
      </Link>

      <div className="deal-card-content">
        <div className="deal-delivery">
          <span className="deal-delivery-icon">
            <Rocket
              size={13}
              fill="currentColor"
              strokeWidth={0}
            />
          </span>

          {product.deliveryTime}
        </div>

        <p className="deal-brand">
          {product.brand}
        </p>

        <Link
          href={product.href}
          className="deal-product-title"
        >
          {product.title}
        </Link>

        <div className="deal-rating">
          {Array.from({ length: 5 }).map(
            (_, index) => (
              <Star
                key={index}
                size={14}
                fill={
                  index < roundedRating
                    ? "#ffb400"
                    : "#e5e7eb"
                }
                strokeWidth={0}
              />
            ),
          )}

          <span className="deal-rating-text">
            {product.rating !== null
              ? product.rating.toFixed(1)
              : "Not rated"}
          </span>
        </div>

        <div className="deal-price-row">
          <div>
            <p className="deal-old-price">
              {product.currencySymbol}
              {product.originalPrice.toFixed(2)}
            </p>

            <p className="deal-sale-price">
              {product.currencySymbol}
              {product.salePrice.toFixed(2)}
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleCart}
            disabled={!product.inStock}
            aria-label={
              added
                ? `Remove ${product.title} from cart`
                : `Add ${product.title} to cart`
            }
            className={`deal-add-button ${
              added ? "is-added" : ""
            }`}
          >
            {added ? (
              <>
                <Check size={15} />
                Added
              </>
            ) : (
              "ADD"
            )}
          </button>
        </div>

        <a
          href={product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="deal-source"
        >
          Product source
          <ExternalLink size={13} />
        </a>
      </div>
    </article>
  );
}

function normalizeProduct(
  product: JsonProduct,
  index: number,
): Product {
  const discountPercent =
    discountOptions[
      index % discountOptions.length
    ];

  const salePrice = Number(product.price);

  const originalPrice = Number(
    (
      salePrice /
      (1 - discountPercent / 100)
    ).toFixed(2),
  );

  const slug = createSlug(product.title);

  return {
    ...product,
    slug,
    href: `/product/${slug}`,
    discountPercent,
    originalPrice,
    salePrice,
    currencySymbol: getCurrencySymbol(
      product.currency,
    ),
    deliveryTime: "12-24 HOURS",
    inStock: true,
  };
}

function isValidProduct(
  value: unknown,
): value is JsonProduct {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const product = value as Partial<JsonProduct>;

  return (
    typeof product.id === "number" &&
    typeof product.brand === "string" &&
    typeof product.title === "string" &&
    typeof product.category === "string" &&
    typeof product.image === "string" &&
    typeof product.price === "number" &&
    typeof product.currency === "string" &&
    (typeof product.rating === "number" ||
      product.rating === null) &&
    typeof product.productUrl === "string"
  );
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCurrencySymbol(currency: string) {
  switch (currency.toUpperCase()) {
    case "USD":
      return "$";

    case "BDT":
      return "৳";

    case "EUR":
      return "€";

    case "GBP":
      return "£";

    case "INR":
      return "₹";

    default:
      return `${currency} `;
  }
}

function ProductSkeleton() {
  return (
    <div className="deal-product-card deal-card">
      <div className="aspect-square animate-pulse bg-[#f0f2f4]" />

      <div className="space-y-3 p-4">
        <div className="h-9 w-28 animate-pulse rounded bg-[#eef0f2]" />
        <div className="h-4 w-20 animate-pulse rounded bg-[#eef0f2]" />
        <div className="h-5 animate-pulse rounded bg-[#eef0f2]" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-[#eef0f2]" />
        <div className="h-4 w-24 animate-pulse rounded bg-[#eef0f2]" />

        <div className="flex items-end justify-between">
          <div className="h-10 w-20 animate-pulse rounded bg-[#eef0f2]" />
          <div className="h-10 w-12 animate-pulse rounded bg-[#eef0f2]" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="deal-state">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#d92d20]"
        />

        <p className="deal-state-title text-[#b42318]">
          Product data could not be loaded
        </p>

        <p className="deal-state-message">
          {message}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="deal-retry-button"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="deal-state">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="deal-state-title text-[#344054]">
          No products available
        </p>

        <p className="deal-state-message">
          Products will appear here when they become available.
        </p>
      </div>
    </div>
  );
}