"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  ImageOff,
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
  href: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  reviewCount: number;
  currencySymbol: string;
};

const MAX_PRODUCTS = 30;

const discountValues = [
  18, 10, 36, 9, 5, 10, 22, 14, 30, 8,
  16, 12, 25, 7, 20, 11, 33, 15, 28, 6,
];

export default function CraveCartSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch("/api/catalog/products?shape=legacy", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load data.json. Status: ${response.status}`,
          );
        }

        const result = (await response.json()) as unknown;

        if (!Array.isArray(result)) {
          throw new Error(
            "public/data.json must contain a JSON array.",
          );
        }

        const normalizedProducts = result
          .filter(isValidProduct)
          .slice(0, MAX_PRODUCTS)
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
            : "Unable to load products.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  const displayedProducts = useMemo(
    () => products,
    [products],
  );

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;

    if (!container) return;

    const maximumScroll =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 4);

    setCanScrollRight(
      maximumScroll > 4 &&
        container.scrollLeft < maximumScroll - 4,
    );
  }, []);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    updateScrollState();

    container.addEventListener(
      "scroll",
      updateScrollState,
      {
        passive: true,
      },
    );

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrollState)
        : null;

    resizeObserver?.observe(container);

    if (!resizeObserver) {
      window.addEventListener(
        "resize",
        updateScrollState,
      );
    }

    return () => {
      container.removeEventListener(
        "scroll",
        updateScrollState,
      );

      resizeObserver?.disconnect();

      window.removeEventListener(
        "resize",
        updateScrollState,
      );
    };
  }, [displayedProducts.length, updateScrollState]);

  const scrollProducts = (
    direction: "left" | "right",
  ) => {
    const container = scrollRef.current;

    if (!container) return;

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-crave-product-card]",
      );

    if (!firstCard) return;

    const computedStyle =
      window.getComputedStyle(container);

    const gap =
      Number.parseFloat(
        computedStyle.columnGap ||
          computedStyle.gap ||
          "16",
      ) || 16;

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const visibleCards =
      window.innerWidth >= 1280
        ? 6
        : window.innerWidth >= 1024
          ? 4
          : window.innerWidth >= 768
            ? 3
            : window.innerWidth >= 640
              ? 2
              : 1;

    const distance =
      (cardWidth + gap) * visibleCards;

    container.scrollBy({
      left:
        direction === "right"
          ? distance
          : -distance,
      behavior: "smooth",
    });
  };

  const toggleCart = (productId: number) => {
    setCartItems((currentItems) =>
      currentItems.includes(productId)
        ? currentItems.filter(
            (id) => id !== productId,
          )
        : [...currentItems, productId],
    );
  };

  if (!loading && loadError) {
    return <ProductError message={loadError} />;
  }

  return (
    <>
      <section
        aria-labelledby="crave-cart-title"
        className="crave-cart-section"
      >
        <div
          aria-hidden="true"
          className="crave-cart-pattern"
        />

        <div
          aria-hidden="true"
          className="crave-cart-glow crave-cart-glow-left"
        />

        <div
          aria-hidden="true"
          className="crave-cart-glow crave-cart-glow-right"
        />

        <div className="crave-cart-container">
          <header className="crave-cart-header">
            <div className="crave-cart-heading">
              <p className="crave-cart-eyebrow">
                Everyday essentials
              </p>

              <h2
                id="crave-cart-title"
                className="crave-cart-title"
              >
                Crave Cart
              </h2>

              <p className="crave-cart-description">
                Explore selected food, grocery and daily
                essentials from your product catalog.
              </p>
            </div>

            <Link
              href="/food-and-nutrition"
              className="crave-cart-see-all"
            >
              <span>See all</span>

              <ChevronRight
                size={18}
                strokeWidth={1.8}
              />
            </Link>
          </header>

          <div className="crave-cart-slider">
            <ProductArrow
              direction="left"
              visible={canScrollLeft}
              onClick={() =>
                scrollProducts("left")
              }
            />

            <div
              ref={scrollRef}
              className="crave-cart-scroll"
            >
              {loading &&
                Array.from({
                  length: 6,
                }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}

              {!loading &&
                displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    added={cartItems.includes(
                      product.id,
                    )}
                    onToggleCart={() =>
                      toggleCart(product.id)
                    }
                  />
                ))}

              {!loading &&
                displayedProducts.length === 0 && (
                  <EmptyProducts />
                )}
            </div>

            <ProductArrow
              direction="right"
              visible={canScrollRight}
              onClick={() =>
                scrollProducts("right")
              }
            />
          </div>
        </div>
      </section>

      <style>{`
        .crave-cart-section {
          --crave-text-20: 20px;
          --crave-text-18: 18px;
          --crave-text-16: 16px;
          --crave-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 54px 0 60px;
          background:
            radial-gradient(
              circle at 5% 8%,
              rgba(208, 230, 250, 0.75),
              transparent 28%
            ),
            radial-gradient(
              circle at 95% 90%,
              rgba(211, 238, 242, 0.6),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #e9f1fa 0%,
              #edf4fa 54%,
              #e7f1f5 100%
            );
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .crave-cart-pattern {
          position: absolute;
          inset: 0;
          z-index: -3;
          pointer-events: none;
          opacity: 0.2;
          background-image:
            linear-gradient(
              rgba(24, 92, 154, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(24, 92, 154, 0.035) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
        }

        .crave-cart-glow {
          position: absolute;
          z-index: -2;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(110px);
          opacity: 0.48;
        }

        .crave-cart-glow-left {
          top: -130px;
          left: -230px;
          background: rgba(62, 137, 215, 0.4);
        }

        .crave-cart-glow-right {
          right: -230px;
          bottom: -140px;
          background: rgba(56, 184, 172, 0.35);
        }

        .crave-cart-container {
          position: relative;
          width: min(
            1440px,
            calc(100% - 48px)
          );
          margin-inline: auto;
        }

        .crave-cart-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }

        .crave-cart-heading {
          min-width: 0;
        }

        .crave-cart-eyebrow {
          margin: 0;
          color: #145ca0;
          font-size: var(--crave-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .crave-cart-title {
          margin: 4px 0 0;
          color: #145ca0;
          font-size: var(--crave-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .crave-cart-description {
          max-width: 620px;
          margin: 7px 0 0;
          color: #52606d;
          font-size: var(--crave-text-13);
          line-height: 1.7;
        }

        .crave-cart-see-all {
          display: inline-flex;
          min-height: 42px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 8px 15px;
          border: 1px solid
            rgba(20, 92, 160, 0.23);
          border-radius: 999px;
          color: #145ca0;
          background: rgba(
            255,
            255,
            255,
            0.88
          );
          box-shadow:
            0 14px 28px -21px
              rgba(20, 92, 160, 0.54);
          font-size: var(--crave-text-13);
          font-weight: 800;
          text-decoration: none;
          backdrop-filter: blur(12px);
          transition:
            color 280ms ease,
            border-color 280ms ease,
            background-color 280ms ease,
            transform 300ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            box-shadow 300ms ease;
        }

        .crave-cart-see-all:hover {
          border-color: #145ca0;
          color: #ffffff;
          background: #145ca0;
          box-shadow:
            0 19px 34px -20px
              rgba(20, 92, 160, 0.7);
          transform: translateY(-2px);
        }

        .crave-cart-see-all svg {
          transition: transform 280ms ease;
        }

        .crave-cart-see-all:hover svg {
          transform: translateX(3px);
        }

        .crave-cart-slider {
          position: relative;
        }

        .crave-cart-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          overflow-y: visible;
          padding: 8px 2px 18px;
          scroll-padding-inline: 8px;
          scroll-snap-type: x mandatory;
          overscroll-behavior-inline: contain;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }

        .crave-cart-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .crave-product-wrapper {
          width: min(78vw, 252px);
          flex: 0 0 min(78vw, 252px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .crave-product-card {
          display: flex;
          height: 100%;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid
            rgba(15, 23, 42, 0.09);
          border-radius: 15px;
          background: rgba(
            255,
            255,
            255,
            0.98
          );
          box-shadow:
            0 13px 34px -28px
              rgba(15, 23, 42, 0.46),
            0 2px 7px
              rgba(15, 23, 42, 0.03);
          transform: translateZ(0);
          transition:
            transform 440ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            border-color 350ms ease,
            box-shadow 440ms ease;
          will-change: transform;
        }

        .crave-product-card:hover {
          border-color: rgba(
            20,
            92,
            160,
            0.34
          );
          box-shadow:
            0 34px 68px -37px
              rgba(20, 92, 160, 0.44),
            0 16px 34px -27px
              rgba(15, 23, 42, 0.3);
          transform: translate3d(
            0,
            -7px,
            0
          );
        }

        .crave-product-image-link {
          position: relative;
          display: block;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fafcfd 66%,
              #eef3f7 100%
            );
        }

        .crave-product-image {
          display: block;
          width: 100%;
          height: 100%;
          padding: 14px;
          object-fit: contain;
          transform: scale(1.001);
          transition:
            transform 680ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            filter 500ms ease;
          will-change: transform;
        }

        .crave-product-card:hover
          .crave-product-image {
          filter:
            saturate(1.05)
            contrast(1.02);
          transform: scale(1.065);
        }

        .crave-product-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.18),
            transparent 48%,
            rgba(20, 92, 160, 0.035)
          );
        }

        .crave-product-shine {
          position: absolute;
          inset: 0 auto 0 -85%;
          width: 42%;
          pointer-events: none;
          transform: rotate(18deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.58),
            transparent
          );
          transition: left 760ms ease;
        }

        .crave-product-card:hover
          .crave-product-shine {
          left: 135%;
        }

        .crave-product-discount {
          position: absolute;
          top: 0;
          left: 9px;
          z-index: 4;
          min-width: 38px;
          padding: 6px 7px;
          border-radius: 0 0 7px 7px;
          color: #ffffff;
          background: linear-gradient(
            180deg,
            #247af0,
            #0759b5
          );
          box-shadow:
            0 9px 17px -10px
              rgba(7, 89, 181, 0.85);
          font-size: var(--crave-text-13);
          font-weight: 850;
          line-height: 1.05;
          text-align: center;
        }

        .crave-product-discount.is-hot {
          background: linear-gradient(
            180deg,
            #f0526b,
            #d92745
          );
          box-shadow:
            0 9px 17px -10px
              rgba(217, 39, 69, 0.82);
        }

        .crave-product-brand {
          position: absolute;
          top: 10px;
          right: 10px;
          max-width: 105px;
          overflow: hidden;
          padding: 5px 8px;
          border: 1px solid
            rgba(255, 255, 255, 0.88);
          border-radius: 999px;
          color: #145ca0;
          background: rgba(
            255,
            255,
            255,
            0.92
          );
          box-shadow:
            0 9px 20px -14px
              rgba(15, 23, 42, 0.5);
          font-size: var(--crave-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
          backdrop-filter: blur(10px);
        }

        .crave-product-content {
          display: flex;
          min-height: 228px;
          flex: 1;
          flex-direction: column;
          padding: 13px;
        }

        .crave-product-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 32px;
          align-items: center;
          gap: 7px;
          padding: 5px 8px;
          border-radius: 7px;
          color: #202939;
          background: #eff1f3;
          font-size: var(--crave-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .crave-product-delivery-icon {
          display: flex;
          width: 23px;
          height: 23px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffd63d;
          background: #172033;
        }

        .crave-product-name {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 12px 0 0;
          color: #101828;
          font-size: var(--crave-text-16);
          font-weight: 680;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .crave-product-card:hover
          .crave-product-name {
          color: #145ca0;
        }

        .crave-product-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 7px;
        }

        .crave-product-review {
          margin-left: 6px;
          color: #667085;
          font-size: var(--crave-text-13);
          line-height: 1.4;
        }

        .crave-product-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 13px;
        }

        .crave-product-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--crave-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .crave-product-sale-price {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(--crave-text-18);
          font-weight: 850;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .crave-product-add-button {
          display: inline-flex;
          min-width: 58px;
          min-height: 40px;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0 10px;
          border: 1px solid #087b75;
          border-radius: 8px;
          color: #087b75;
          background: #eef9f7;
          font-family: inherit;
          font-size: var(--crave-text-13);
          font-weight: 850;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .crave-product-add-button:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow:
            0 12px 24px -14px
              rgba(8, 123, 117, 0.7);
          transform: translateY(-2px);
        }

        .crave-product-add-button.is-added {
          color: #ffffff;
          background: #087b75;
        }

        .crave-product-arrow {
          position: absolute;
          top: 43%;
          z-index: 30;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid
            rgba(20, 92, 160, 0.2);
          border-radius: 50%;
          color: #145ca0;
          background: rgba(
            255,
            255,
            255,
            0.97
          );
          box-shadow:
            0 12px 27px -14px
              rgba(15, 23, 42, 0.45);
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition:
            opacity 260ms ease,
            transform 300ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            color 250ms ease,
            border-color 250ms ease,
            background-color 250ms ease;
        }

        .crave-product-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .crave-product-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .crave-product-arrow:hover {
          border-color: #145ca0;
          color: #ffffff;
          background: #145ca0;
        }

        .crave-product-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .crave-product-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #98a2b3;
          background: #f7f9fa;
        }

        .crave-product-fallback span {
          font-size: var(--crave-text-13);
          font-weight: 700;
        }

        .crave-empty {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #d9e2e8;
          border-radius: 15px;
          background: rgba(
            255,
            255,
            255,
            0.9
          );
          padding: 24px;
          text-align: center;
        }

        .crave-empty-title {
          margin: 12px 0 0;
          color: #344054;
          font-size: var(--crave-text-16);
          font-weight: 750;
        }

        .crave-empty-text {
          margin: 6px 0 0;
          color: #667085;
          font-size: var(--crave-text-13);
          line-height: 1.6;
        }

        @media (min-width: 1280px) {
          .crave-product-wrapper {
            width: calc((100% - 80px) / 6);
            flex-basis: calc((100% - 80px) / 6);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .crave-cart-section {
            padding: 50px 0 56px;
          }

          .crave-cart-container {
            width: min(
              1180px,
              calc(100% - 40px)
            );
          }

          .crave-product-wrapper {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .crave-cart-section {
            padding: 46px 0 52px;
          }

          .crave-cart-container {
            width: calc(100% - 32px);
          }

          .crave-product-wrapper {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .crave-cart-section {
            padding: 42px 0 48px;
          }

          .crave-cart-container {
            width: calc(100% - 24px);
          }

          .crave-product-wrapper {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .crave-product-arrow {
            display: none;
          }
        }

        @media (max-width: 639px) {
          .crave-cart-section {
            padding: 36px 0 42px;
          }

          .crave-cart-container {
            width: 100%;
          }

          .crave-cart-header {
            margin-bottom: 16px;
            padding-inline: 14px;
          }

          .crave-cart-description {
            max-width: 330px;
          }

          .crave-cart-see-all {
            min-height: 40px;
            padding-inline: 13px;
          }

          .crave-cart-scroll {
            gap: 12px;
            padding: 8px 14px 18px;
            scroll-padding-inline: 14px;
          }

          .crave-product-wrapper {
            width: min(80vw, 255px);
            flex-basis: min(80vw, 255px);
          }

          .crave-product-arrow {
            display: none;
          }

          .crave-product-content {
            min-height: 220px;
            padding: 12px;
          }

          .crave-product-image {
            padding: 12px;
          }
        }

        @media (max-width: 420px) {
          .crave-cart-header {
            align-items: flex-start;
            gap: 10px;
            padding-inline: 11px;
          }

          .crave-cart-see-all span {
            display: none;
          }

          .crave-cart-see-all {
            width: 40px;
            min-width: 40px;
            padding: 0;
          }

          .crave-cart-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }
        }

        @media (max-width: 380px) {
          .crave-product-wrapper {
            width: calc(100vw - 36px);
            flex-basis: calc(100vw - 36px);
          }
        }

        @media (hover: none) {
          .crave-product-card:hover,
          .crave-product-card:hover
            .crave-product-image,
          .crave-product-add-button:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .crave-cart-section *,
          .crave-cart-section *::before,
          .crave-cart-section *::after {
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
  const [imageError, setImageError] =
    useState(false);

  const roundedRating = Math.max(
    0,
    Math.min(
      5,
      Math.round(product.rating ?? 0),
    ),
  );

  return (
    <article
      data-crave-product-card
      className="crave-product-wrapper crave-product-card"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="crave-product-image-link"
      >
        {!imageError ? (
          <img
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            loading="lazy"
            draggable={false}
            onError={() => setImageError(true)}
            className="crave-product-image"
          />
        ) : (
          <div className="crave-product-fallback">
            <ImageOff
              size={20}
              strokeWidth={1.7}
            />

            <span>Image unavailable</span>
          </div>
        )}

        <span
          aria-hidden="true"
          className="crave-product-overlay"
        />

        <span
          aria-hidden="true"
          className="crave-product-shine"
        />

        <span
          className={[
            "crave-product-discount",
            product.discount >= 15
              ? "is-hot"
              : "",
          ].join(" ")}
        >
          {product.discount}%
          <br />
          OFF
        </span>

        <span className="crave-product-brand">
          {product.brand || "Product"}
        </span>
      </Link>

      <div className="crave-product-content">
        <DeliveryBadge />

        <Link
          href={product.href}
          className="crave-product-name"
        >
          {product.title}
        </Link>

        <div className="crave-product-rating">
          {Array.from({
            length: 5,
          }).map((_, index) => (
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
          ))}

          <span className="crave-product-review">
            ({product.reviewCount})
          </span>
        </div>

        <div className="crave-product-price-row">
          <div>
            <p className="crave-product-old-price">
              {product.currencySymbol}
              {formatPrice(
                product.originalPrice,
              )}
            </p>

            <p className="crave-product-sale-price">
              {product.currencySymbol}
              {formatPrice(product.salePrice)}
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleCart}
            aria-label={
              added
                ? `Remove ${product.title} from cart`
                : `Add ${product.title} to cart`
            }
            className={[
              "crave-product-add-button",
              added ? "is-added" : "",
            ].join(" ")}
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

function ProductArrow({
  direction,
  visible,
  onClick,
}: {
  direction: "left" | "right";
  visible: boolean;
  onClick: () => void;
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
      aria-label={
        direction === "left"
          ? "Show previous products"
          : "Show more products"
      }
      className={[
        "crave-product-arrow",
        direction === "left"
          ? "crave-product-arrow-left"
          : "crave-product-arrow-right",
        visible ? "" : "is-hidden",
      ].join(" ")}
    >
      <Icon size={20} strokeWidth={1.8} />
    </button>
  );
}

function DeliveryBadge() {
  return (
    <div className="crave-product-delivery">
      <span className="crave-product-delivery-icon">
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

function normalizeProduct(
  product: JsonProduct,
  index: number,
): Product {
  const salePrice = Number(product.price);

  const discount =
    discountValues[
      index % discountValues.length
    ];

  const originalPrice = Number(
    (
      salePrice /
      (1 - discount / 100)
    ).toFixed(2),
  );

  return {
    ...product,
    href: `/products/${product.id}`,
    salePrice,
    originalPrice,
    discount,
    reviewCount:
      product.rating !== null
        ? ((product.id * 23) % 150) + 1
        : 0,
    currencySymbol: getCurrencySymbol(
      product.currency,
    ),
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

  const product =
    value as Partial<JsonProduct>;

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
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2);
}

function ProductSkeleton() {
  return (
    <div className="crave-product-wrapper crave-product-card">
      <div className="aspect-square animate-pulse bg-[#e6edf3]" />

      <div className="space-y-3 p-4">
        <div className="h-8 w-28 animate-pulse rounded bg-[#e6edf3]" />

        <div className="h-5 animate-pulse rounded bg-[#e6edf3]" />

        <div className="h-5 w-4/5 animate-pulse rounded bg-[#e6edf3]" />

        <div className="h-4 w-24 animate-pulse rounded bg-[#e6edf3]" />

        <div className="flex items-end justify-between pt-3">
          <div className="h-10 w-20 animate-pulse rounded bg-[#e6edf3]" />

          <div className="h-10 w-14 animate-pulse rounded bg-[#e6edf3]" />
        </div>
      </div>
    </div>
  );
}

function EmptyProducts() {
  return (
    <div className="crave-empty">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="crave-empty-title">
          No products available
        </p>

        <p className="crave-empty-text">
          Products will appear here when they are
          available.
        </p>
      </div>
    </div>
  );
}

function ProductError({
  message,
}: {
  message: string;
}) {
  return (
    <section className="flex min-h-[320px] items-center justify-center bg-[#eaf2fb] px-5 py-12 text-center">
      <div>
        <ShoppingCart
          size={36}
          className="mx-auto text-[#b42318]"
        />

        <p className="mt-3 text-[16px] font-extrabold text-[#b42318]">
          Product data could not be loaded
        </p>

        <p className="mt-2 text-[13px] leading-6 text-[#667085]">
          {message}
        </p>

        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new Event("arogga-catalog-retry"))
          }
          className="mt-4 min-h-[42px] rounded-[9px] bg-[#145ca0] px-5 text-[13px] font-bold text-white"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}