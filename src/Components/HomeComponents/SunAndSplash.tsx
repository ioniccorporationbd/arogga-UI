"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Rocket,
  ShoppingCart,
  Star,
  Sun,
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
  reviewCount: number;
  deliveryTime: string;
  inStock: boolean;
};

const PRODUCTS_PER_VIEW = 6;
const MAX_PRODUCTS = 20;

const discountOptions = [
  27, 38, 31, 4, 29, 11, 25, 20, 18, 15, 12, 30, 35, 40,
];

const sunAndSplashKeywords = [
  "sunscreen",
  "sun cream",
  "sun block",
  "spf",
  "cleanser",
  "face wash",
  "foaming",
  "facial cleanser",
  "gel cleanser",
  "salicylic",
  "brightening",
  "skin",
  "skincare",
  "acne",
  "face",
];

export default function SunAndSplash() {
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

  const sectionProducts = useMemo(() => {
    const availableProducts = products.filter(
      (product) => product.inStock,
    );

    const matchedProducts = availableProducts.filter((product) =>
      matchesKeywords(product, sunAndSplashKeywords),
    );

    if (matchedProducts.length >= PRODUCTS_PER_VIEW) {
      return matchedProducts.slice(0, MAX_PRODUCTS);
    }

    return availableProducts.slice(0, MAX_PRODUCTS);
  }, [products]);

  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const maximumScrollLeft =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 4);

    setCanScrollRight(
      container.scrollLeft < maximumScrollLeft - 4,
    );
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    updateScrollButtons();

    container.addEventListener("scroll", updateScrollButtons, {
      passive: true,
    });

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateScrollButtons);
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", updateScrollButtons);
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
  }, [sectionProducts.length, updateScrollButtons]);

  const scrollProducts = (
    direction: "left" | "right",
  ) => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-sun-product-card]",
      );

    if (!firstCard) {
      return;
    }

    const styles = window.getComputedStyle(container);

    const gap =
      Number.parseFloat(
        styles.columnGap || styles.gap || "16",
      ) || 16;

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const visibleCount =
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
      (cardWidth + gap) * visibleCount;

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

  if (!loading && loadError) {
    return <ErrorState message={loadError} />;
  }

  return (
    <>
      <section
        className="sun-splash-section"
        aria-labelledby="sun-splash-title"
      >
        <div
          aria-hidden="true"
          className="sun-splash-pattern"
        />

        <div
          aria-hidden="true"
          className="sun-splash-glow sun-splash-glow-left"
        />

        <div
          aria-hidden="true"
          className="sun-splash-glow sun-splash-glow-right"
        />

        <div className="sun-splash-container">
          <header className="sun-splash-header">
            <div className="sun-splash-heading-group">
              <span className="sun-splash-heading-icon">
                <Sun size={20} />
              </span>

              <div>
                <p className="sun-splash-eyebrow">
                  Skincare essentials
                </p>

                <h2
                  id="sun-splash-title"
                  className="sun-splash-title"
                >
                  Sun &amp; Splash
                </h2>

                <p className="sun-splash-description">
                  Discover sunscreen, cleansers and everyday skincare
                  essentials selected for healthy, refreshed skin.
                </p>
              </div>
            </div>

            <Link
              href="/offers/sun-and-splash"
              className="sun-splash-see-all"
            >
              <span>See all</span>

              <ChevronRight size={16} />
            </Link>
          </header>

          <div className="sun-splash-slider">
            <SliderArrow
              direction="left"
              visible={canScrollLeft}
              onClick={() => scrollProducts("left")}
              label="Show previous Sun and Splash products"
            />

            <div
              ref={scrollContainerRef}
              className="sun-splash-scroll"
            >
              {loading &&
                Array.from({
                  length: PRODUCTS_PER_VIEW,
                }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}

              {!loading &&
                sectionProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    added={cartItems.includes(product.id)}
                    onToggleCart={() =>
                      toggleCartItem(product.id)
                    }
                  />
                ))}

              {!loading &&
                sectionProducts.length === 0 && (
                  <EmptyState />
                )}
            </div>

            <SliderArrow
              direction="right"
              visible={canScrollRight}
              onClick={() => scrollProducts("right")}
              label="Show more Sun and Splash products"
            />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .sun-splash-section {
          --sun-text-20: 20px;
          --sun-text-18: 18px;
          --sun-text-16: 16px;
          --sun-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 64px 0;
          background:
            radial-gradient(
              circle at 5% 10%,
              rgba(255, 255, 255, 0.92),
              transparent 28%
            ),
            radial-gradient(
              circle at 96% 88%,
              rgba(193, 222, 255, 0.74),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #eff7ff 0%,
              #eaf3fd 50%,
              #e4f0fc 100%
            );
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .sun-splash-pattern {
          position: absolute;
          inset: 0;
          z-index: -4;
          pointer-events: none;
          opacity: 0.3;
          background-image:
            linear-gradient(
              rgba(7, 85, 165, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(7, 85, 165, 0.04) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.78),
            transparent 98%
          );
        }

        .sun-splash-glow {
          position: absolute;
          z-index: -3;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(100px);
          opacity: 0.6;
          will-change: transform;
        }

        .sun-splash-glow-left {
          top: 20px;
          left: -220px;
          background: rgba(255, 255, 255, 0.94);
          animation: sunSplashGlowLeft 11s ease-in-out infinite;
        }

        .sun-splash-glow-right {
          right: -220px;
          bottom: -100px;
          background: rgba(148, 201, 255, 0.62);
          animation: sunSplashGlowRight 13s ease-in-out infinite;
        }

        .sun-splash-container {
          position: relative;
          width: min(1440px, calc(100% - 64px));
          margin-inline: auto;
        }

        .sun-splash-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end;
          gap: 30px;
          margin-bottom: 28px;
        }

        .sun-splash-heading-group {
          display: flex;
          min-width: 0;
          max-width: 780px;
          align-items: flex-start;
          gap: 14px;
        }

        .sun-splash-heading-icon {
          display: flex;
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 14px;
          color: #0755a5;
          background: rgba(255, 255, 255, 0.92);
          box-shadow:
            0 12px 28px -20px rgba(7, 85, 165, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          transition:
            transform 350ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 350ms ease;
        }

        .sun-splash-header:hover
          .sun-splash-heading-icon {
          transform: rotate(-5deg) scale(1.05);
          box-shadow:
            0 18px 34px -20px rgba(7, 85, 165, 0.48),
            inset 0 1px rgba(255, 255, 255, 0.95);
        }

        .sun-splash-eyebrow {
          margin: 0;
          color: #5d7da1;
          font-size: var(--sun-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .sun-splash-title {
          margin: 7px 0 0;
          color: #0755a5;
          font-size: var(--sun-text-20);
          font-weight: 850;
          line-height: 1.3;
          letter-spacing: -0.025em;
        }

        .sun-splash-description {
          max-width: 680px;
          margin: 8px 0 0;
          color: #667085;
          font-size: var(--sun-text-13);
          line-height: 1.65;
        }

        .sun-splash-see-all {
          display: inline-flex;
          min-height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding-inline: 6px;
          border-radius: 999px;
          color: #0755a5;
          font-size: var(--sun-text-13);
          font-weight: 800;
          line-height: 1;
          text-decoration: none;
          transition:
            color 260ms ease,
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sun-splash-see-all:hover {
          color: #087b75;
          transform: translateY(-2px);
        }

        .sun-splash-see-all svg {
          transition: transform 280ms ease;
        }

        .sun-splash-see-all:hover svg {
          transform: translateX(4px);
        }

        .sun-splash-slider {
          position: relative;
        }

        .sun-splash-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          overflow-y: visible;
          padding: 12px 2px 22px;
          scroll-padding-inline: 8px;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-inline: contain;
          -webkit-overflow-scrolling: touch;
        }

        .sun-splash-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .sun-splash-product-card {
          width: min(78vw, 268px);
          flex: 0 0 min(78vw, 268px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .sun-splash-card {
          display: flex;
          height: 100%;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #dce4eb;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.97);
          box-shadow:
            0 10px 28px -23px rgba(15, 23, 42, 0.5),
            0 2px 7px rgba(15, 23, 42, 0.03);
          transform: translateZ(0);
          transition:
            transform 430ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 350ms ease,
            box-shadow 430ms ease;
          will-change: transform;
          backface-visibility: hidden;
        }

        .sun-splash-card:hover {
          border-color: #a9cce8;
          transform: translate3d(0, -7px, 0);
          box-shadow:
            0 31px 60px -34px rgba(7, 85, 165, 0.4),
            0 15px 32px -24px rgba(15, 23, 42, 0.35);
        }

        .sun-splash-image-link {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fafcff 68%,
              #f1f7fd 100%
            );
        }

        .sun-splash-product-image {
          width: 100%;
          height: 100%;
          padding: 15px;
          object-fit: contain;
          transform: scale(1.001);
          transition:
            transform 680ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 500ms ease;
          will-change: transform;
        }

        .sun-splash-card:hover
          .sun-splash-product-image {
          transform: scale(1.055);
          filter: saturate(1.04) contrast(1.02);
        }

        .sun-splash-image-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.16),
            transparent 48%,
            rgba(7, 85, 165, 0.04)
          );
        }

        .sun-splash-image-shine {
          position: absolute;
          inset: 0 auto 0 -88%;
          width: 42%;
          pointer-events: none;
          transform: rotate(18deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.52),
            transparent
          );
          transition: left 760ms ease;
        }

        .sun-splash-card:hover
          .sun-splash-image-shine {
          left: 135%;
        }

        .sun-splash-discount {
          position: absolute;
          top: 0;
          left: 9px;
          padding: 6px 8px;
          border-radius: 0 0 6px 6px;
          color: #ffffff;
          background: linear-gradient(
            180deg,
            #1981ff,
            #0755a5
          );
          box-shadow: 0 7px 15px -8px rgba(7, 85, 165, 0.85);
          font-size: var(--sun-text-13);
          font-weight: 800;
          line-height: 1.05;
          text-align: center;
        }

        .sun-splash-brand {
          position: absolute;
          top: 10px;
          right: 10px;
          max-width: 120px;
          overflow: hidden;
          padding: 6px 9px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 999px;
          color: #0755a5;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 9px 20px -14px rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          font-size: var(--sun-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sun-splash-card-content {
          display: flex;
          min-height: 238px;
          flex: 1;
          flex-direction: column;
          padding: 14px;
        }

        .sun-splash-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 34px;
          align-items: center;
          gap: 8px;
          padding: 5px 9px;
          border-radius: 7px;
          color: #202939;
          background: #f0f1f3;
          font-size: var(--sun-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .sun-splash-delivery-icon {
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

        .sun-splash-product-title {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 13px 0 0;
          color: #101828;
          font-size: var(--sun-text-16);
          font-weight: 650;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .sun-splash-card:hover
          .sun-splash-product-title {
          color: #0755a5;
        }

        .sun-splash-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 8px;
        }

        .sun-splash-rating-text {
          margin-left: 6px;
          color: #667085;
          font-size: var(--sun-text-13);
          line-height: 1.4;
        }

        .sun-splash-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 15px;
        }

        .sun-splash-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--sun-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .sun-splash-sale-price {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(--sun-text-18);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .sun-splash-add-button {
          display: inline-flex;
          min-width: 56px;
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
          font-size: var(--sun-text-13);
          font-weight: 800;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .sun-splash-add-button:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow: 0 12px 24px -14px rgba(8, 123, 117, 0.7);
          transform: translateY(-2px);
        }

        .sun-splash-add-button:active {
          transform: scale(0.97);
        }

        .sun-splash-add-button.is-added {
          color: #ffffff;
          background: #087b75;
        }

        .sun-splash-add-button:disabled {
          border-color: #d0d5dd;
          color: #98a2b3;
          background: #f2f4f7;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .sun-splash-arrow {
          position: absolute;
          top: 43%;
          z-index: 30;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid #d4dfe9;
          border-radius: 50%;
          color: #0755a5;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 10px 25px -12px rgba(15, 23, 42, 0.42);
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition:
            opacity 260ms ease,
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 250ms ease,
            background-color 250ms ease,
            box-shadow 250ms ease;
        }

        .sun-splash-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .sun-splash-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .sun-splash-arrow:hover {
          border-color: #0755a5;
          background: #f2f8ff;
          box-shadow: 0 14px 28px -14px rgba(7, 85, 165, 0.45);
        }

        .sun-splash-arrow-left:hover {
          transform: translate(-50%, -50%) scale(1.07);
        }

        .sun-splash-arrow-right:hover {
          transform: translate(50%, -50%) scale(1.07);
        }

        .sun-splash-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .sun-splash-state {
          display: flex;
          min-height: 320px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #dce4eb;
          border-radius: 18px;
          background: #ffffff;
          padding: 24px;
          text-align: center;
        }

        .sun-splash-state-title {
          margin: 13px 0 0;
          color: #344054;
          font-size: var(--sun-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .sun-splash-state-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--sun-text-13);
          line-height: 1.6;
        }

        .sun-splash-error {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 56px 24px;
          background: #eaf3fd;
          text-align: center;
        }

        .sun-splash-error-title {
          margin: 14px 0 0;
          color: #b42318;
          font-size: var(--sun-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .sun-splash-retry-button {
          min-height: 42px;
          margin-top: 15px;
          padding-inline: 18px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: var(--sun-text-13);
          font-weight: 750;
          cursor: pointer;
          transition:
            background-color 250ms ease,
            transform 250ms ease;
        }

        .sun-splash-retry-button:hover {
          background: #066b66;
          transform: translateY(-2px);
        }

        @keyframes sunSplashGlowLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(32px, -20px, 0) scale(1.08);
          }
        }

        @keyframes sunSplashGlowRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-30px, -18px, 0) scale(1.07);
          }
        }

        @media (min-width: 1280px) {
          .sun-splash-product-card {
            width: calc((100% - 80px) / 6);
            flex-basis: calc((100% - 80px) / 6);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .sun-splash-section {
            padding: 58px 0;
          }

          .sun-splash-container {
            width: min(980px, calc(100% - 48px));
          }

          .sun-splash-product-card {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .sun-splash-section {
            padding: 54px 0;
          }

          .sun-splash-container {
            width: min(760px, calc(100% - 40px));
          }

          .sun-splash-product-card {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }

          .sun-splash-arrow {
            width: 40px;
            height: 40px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .sun-splash-section {
            padding: 50px 0;
          }

          .sun-splash-container {
            width: calc(100% - 32px);
          }

          .sun-splash-product-card {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .sun-splash-arrow {
            display: none;
          }
        }

        @media (max-width: 639px) {
          .sun-splash-section {
            padding: 44px 0 48px;
          }

          .sun-splash-container {
            width: 100%;
          }

          .sun-splash-header {
            align-items: start;
            gap: 14px;
            margin-bottom: 18px;
            padding-inline: 14px;
          }

          .sun-splash-heading-group {
            max-width: 270px;
            gap: 10px;
          }

          .sun-splash-heading-icon {
            display: none;
          }

          .sun-splash-description {
            max-width: 250px;
            margin-top: 6px;
          }

          .sun-splash-see-all {
            min-height: 40px;
            padding-inline: 2px;
          }

          .sun-splash-scroll {
            gap: 12px;
            padding: 10px 14px 20px;
            scroll-padding-inline: 14px;
          }

          .sun-splash-product-card {
            width: min(82vw, 268px);
            flex-basis: min(82vw, 268px);
          }

          .sun-splash-arrow {
            display: none;
          }

          .sun-splash-card-content {
            min-height: 226px;
            padding: 13px;
          }

          .sun-splash-product-image {
            padding: 12px;
          }
        }

        @media (max-width: 380px) {
          .sun-splash-header {
            padding-inline: 11px;
          }

          .sun-splash-heading-group,
          .sun-splash-description {
            max-width: 218px;
          }

          .sun-splash-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .sun-splash-product-card {
            width: calc(100vw - 36px);
            flex-basis: calc(100vw - 36px);
          }

          .sun-splash-brand {
            max-width: 88px;
          }
        }

        @media (hover: none) {
          .sun-splash-card:hover,
          .sun-splash-card:hover
            .sun-splash-product-image,
          .sun-splash-add-button:hover,
          .sun-splash-see-all:hover,
          .sun-splash-header:hover
            .sun-splash-heading-icon {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sun-splash-section *,
          .sun-splash-section *::before,
          .sun-splash-section *::after {
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
      data-sun-product-card
      className="sun-splash-product-card sun-splash-card"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="sun-splash-image-link"
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
          className="sun-splash-product-image"
        />

        <div
          aria-hidden="true"
          className="sun-splash-image-overlay"
        />

        <div
          aria-hidden="true"
          className="sun-splash-image-shine"
        />

        <DiscountBadge
          discount={product.discountPercent}
        />

        <span className="sun-splash-brand">
          {product.brand}
        </span>
      </Link>

      <div className="sun-splash-card-content">
        <DeliveryBadge />

        <Link
          href={product.href}
          className="sun-splash-product-title"
        >
          {product.title}
        </Link>

        <div className="sun-splash-rating">
          {Array.from({ length: 5 }).map(
            (_, index) => (
              <Star
                key={index}
                size={14}
                fill={
                  index < roundedRating
                    ? "#ffb400"
                    : "#dce3ea"
                }
                strokeWidth={0}
              />
            ),
          )}

          <span className="sun-splash-rating-text">
            ({product.reviewCount})
          </span>
        </div>

        <div className="sun-splash-price-row">
          <div>
            <p className="sun-splash-old-price">
              {product.currencySymbol}
              {formatPrice(product.originalPrice)}
            </p>

            <p className="sun-splash-sale-price">
              {product.currencySymbol}
              {formatPrice(product.salePrice)}
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
            className={`sun-splash-add-button ${
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
      </div>
    </article>
  );
}

function SliderArrow({
  direction,
  visible,
  onClick,
  label,
}: {
  direction: "left" | "right";
  visible: boolean;
  onClick: () => void;
  label: string;
}) {
  const Icon =
    direction === "left"
      ? ChevronLeft
      : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!visible}
      aria-label={label}
      className={`sun-splash-arrow ${
        direction === "left"
          ? "sun-splash-arrow-left"
          : "sun-splash-arrow-right"
      } ${visible ? "" : "is-hidden"}`}
    >
      <Icon size={20} />
    </button>
  );
}

function DeliveryBadge() {
  return (
    <div className="sun-splash-delivery">
      <span className="sun-splash-delivery-icon">
        <Rocket
          size={13}
          fill="currentColor"
          strokeWidth={0}
        />
      </span>

      12-24 HOURS
    </div>
  );
}

function DiscountBadge({
  discount,
}: {
  discount: number;
}) {
  return (
    <span className="sun-splash-discount">
      {discount}%
      <br />
      OFF
    </span>
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
    reviewCount:
      product.rating !== null
        ? ((product.id * 29) % 600) + 1
        : 0,
    deliveryTime: "12-24 HOURS",
    inStock: true,
  };
}

function matchesKeywords(
  product: Product,
  keywords: string[],
) {
  const searchableText = [
    product.brand,
    product.title,
    product.category,
  ]
    .join(" ")
    .toLowerCase();

  return keywords.some((keyword) =>
    searchableText.includes(
      keyword.toLowerCase(),
    ),
  );
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
    case "BDT":
      return "৳";

    case "USD":
      return "$";

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

function formatPrice(value: number) {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(2);
}

function ProductSkeleton() {
  return (
    <div className="sun-splash-product-card sun-splash-card">
      <div className="aspect-square animate-pulse bg-[#edf2f7]" />

      <div className="space-y-3 p-4">
        <div className="h-9 w-28 animate-pulse rounded bg-[#e5ebf1]" />

        <div className="h-5 animate-pulse rounded bg-[#e5ebf1]" />

        <div className="h-5 w-4/5 animate-pulse rounded bg-[#e5ebf1]" />

        <div className="h-4 w-24 animate-pulse rounded bg-[#e5ebf1]" />

        <div className="flex items-end justify-between pt-3">
          <div className="h-10 w-20 animate-pulse rounded bg-[#e5ebf1]" />

          <div className="h-10 w-12 animate-pulse rounded bg-[#e5ebf1]" />
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
    <>
      <section className="sun-splash-error">
        <div>
          <ShoppingCart
            size={36}
            className="mx-auto text-[#d92d20]"
          />

          <p className="sun-splash-error-title">
            Product data could not be loaded
          </p>

          <p className="sun-splash-state-message">
            {message}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="sun-splash-retry-button"
          >
            Try Again
          </button>
        </div>
      </section>

      <style jsx global>{`
        .sun-splash-error {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 56px 24px;
          background: #eaf3fd;
          text-align: center;
        }

        .sun-splash-error-title {
          margin: 14px 0 0;
          color: #b42318;
          font-size: 16px;
          font-weight: 750;
          line-height: 1.4;
        }

        .sun-splash-state-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.6;
        }

        .sun-splash-retry-button {
          min-height: 42px;
          margin-top: 15px;
          padding-inline: 18px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

function EmptyState() {
  return (
    <div className="sun-splash-state">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="sun-splash-state-title">
          No products available
        </p>

        <p className="sun-splash-state-message">
          Products will appear here when available.
        </p>
      </div>
    </div>
  );
}