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
  salePrice: number;
  originalPrice: number;
  discount: number;
  reviewCount: number;
  currencySymbol: string;
};

type DealBanner = {
  id: number;
  href: string;
  image: string;
  alt: string;
};

const PRODUCT_LIMIT = 20;

const discountValues = [
  2, 43, 4, 17, 3, 13, 18, 25, 8, 21,
  15, 30, 11, 9, 24, 12, 19, 27, 16, 22,
];

const dealBanners: DealBanner[] = [
  {
    id: 1,
    href: "/offers",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1400&h=520&q=90",
    alt: "Special fifty percent discount offer",
  },
  {
    id: 2,
    href: "/offers",
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1400&h=520&q=90",
    alt: "Buy one and get one free promotional offer",
  },
];

export default function BabyCareHubSection() {
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

        const response = await fetch("/product-data.Json", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load product-data.Json. Status: ${response.status}`,
          );
        }

        const data = (await response.json()) as unknown;

        if (!Array.isArray(data)) {
          throw new Error(
            "public/product-data.Json must contain a JSON array.",
          );
        }

        const normalizedProducts = data
          .filter(isValidProduct)
          .slice(0, PRODUCT_LIMIT)
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
            : "Unable to load product data.",
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

  const updateScrollButtons = useCallback(() => {
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

    updateScrollButtons();

    container.addEventListener(
      "scroll",
      updateScrollButtons,
      {
        passive: true,
      },
    );

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrollButtons)
        : null;

    resizeObserver?.observe(container);

    if (!resizeObserver) {
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
  }, [products.length, updateScrollButtons]);

  const scrollProducts = (
    direction: "left" | "right",
  ) => {
    const container = scrollRef.current;

    if (!container) return;

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-baby-product-card]",
      );

    if (!firstCard) return;

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

    const distance =
      (cardWidth + gap) * visibleCount;

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
    return (
      <ProductError message={loadError} />
    );
  }

  return (
    <>
      <section
        aria-labelledby="baby-care-hub-title"
        className="baby-care-section"
      >
        <div
          aria-hidden="true"
          className="baby-care-pattern"
        />

        <div
          aria-hidden="true"
          className="baby-care-glow baby-care-glow-left"
        />

        <div
          aria-hidden="true"
          className="baby-care-glow baby-care-glow-right"
        />

        <div className="baby-care-container">
          <header className="baby-care-header">
            <div>
              <p className="baby-care-eyebrow">
                Everyday baby essentials
              </p>

              <h2
                id="baby-care-hub-title"
                className="baby-care-title"
              >
                Baby Care Hub
              </h2>

              <p className="baby-care-description">
                Discover daily care, feeding, bath and
                wellness products selected from your
                product catalog.
              </p>
            </div>

            <Link
              href="/baby-mom-care"
              className="baby-care-see-all"
            >
              <span>See all</span>

              <ChevronRight
                size={18}
                strokeWidth={1.8}
              />
            </Link>
          </header>

          <div className="baby-care-slider">
            <ProductArrow
              direction="left"
              visible={canScrollLeft}
              onClick={() =>
                scrollProducts("left")
              }
            />

            <div
              ref={scrollRef}
              className="baby-care-scroll"
            >
              {loading &&
                Array.from({
                  length: 6,
                }).map((_, index) => (
                  <ProductSkeleton
                    key={index}
                  />
                ))}

              {!loading &&
                products.map((product) => (
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
                products.length === 0 && (
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

          <section
            aria-labelledby="top-deals-title"
            className="baby-deals-section"
          >
            <div className="baby-deals-heading">
              <p className="baby-deals-eyebrow">
                Limited-time offers
              </p>

              <h2
                id="top-deals-title"
                className="baby-deals-title"
              >
                Top Deals
              </h2>
            </div>

            <div className="baby-deals-grid">
              {dealBanners.map((deal) => (
                <Link
                  key={deal.id}
                  href={deal.href}
                  aria-label={deal.alt}
                  className="baby-deal-card"
                >
                  <img
                    src={deal.image}
                    alt={deal.alt}
                    width={1400}
                    height={520}
                    loading="lazy"
                    draggable={false}
                    className="baby-deal-image"
                  />

                  <span
                    aria-hidden="true"
                    className="baby-deal-overlay"
                  />

                  <span
                    aria-hidden="true"
                    className="baby-deal-shine"
                  />

                  <span
                    aria-hidden="true"
                    className="baby-deal-arrow"
                  >
                    <ChevronRight
                      size={18}
                      strokeWidth={1.8}
                    />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      <style>{`
        .baby-care-section {
          --baby-text-20: 20px;
          --baby-text-18: 18px;
          --baby-text-16: 16px;
          --baby-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 56px 0 64px;
          background:
            radial-gradient(
              circle at 5% 12%,
              rgba(255, 232, 238, 0.72),
              transparent 29%
            ),
            radial-gradient(
              circle at 95% 88%,
              rgba(223, 240, 255, 0.72),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #ffffff 0%,
              #fffafb 50%,
              #f9fcff 100%
            );
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .baby-care-pattern {
          position: absolute;
          inset: 0;
          z-index: -3;
          pointer-events: none;
          opacity: 0.24;
          background-image:
            linear-gradient(
              rgba(231, 105, 139, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(84, 139, 200, 0.035) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
        }

        .baby-care-glow {
          position: absolute;
          z-index: -2;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(110px);
          opacity: 0.48;
        }

        .baby-care-glow-left {
          top: -120px;
          left: -230px;
          background: rgba(239, 133, 166, 0.38);
        }

        .baby-care-glow-right {
          right: -230px;
          bottom: -130px;
          background: rgba(105, 166, 231, 0.36);
        }

        .baby-care-container {
          position: relative;
          width: min(
            1440px,
            calc(100% - 48px)
          );
          margin-inline: auto;
        }

        .baby-care-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }

        .baby-care-eyebrow {
          margin: 0;
          color: #c94770;
          font-size: var(--baby-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .baby-care-title {
          margin: 4px 0 0;
          color: #101828;
          font-size: var(--baby-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .baby-care-description {
          max-width: 640px;
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--baby-text-13);
          line-height: 1.7;
        }

        .baby-care-see-all {
          display: inline-flex;
          min-height: 42px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 8px 15px;
          border: 1px solid
            rgba(201, 71, 112, 0.24);
          border-radius: 999px;
          color: #c94770;
          background: rgba(
            255,
            255,
            255,
            0.88
          );
          box-shadow:
            0 14px 28px -21px
              rgba(201, 71, 112, 0.55);
          font-size: var(--baby-text-13);
          font-weight: 800;
          text-decoration: none;
          backdrop-filter: blur(12px);
          transition:
            color 280ms ease,
            background-color 280ms ease,
            border-color 280ms ease,
            transform 300ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            box-shadow 300ms ease;
        }

        .baby-care-see-all:hover {
          border-color: #c94770;
          color: #ffffff;
          background: #c94770;
          box-shadow:
            0 19px 34px -20px
              rgba(201, 71, 112, 0.72);
          transform: translateY(-2px);
        }

        .baby-care-see-all svg {
          transition: transform 280ms ease;
        }

        .baby-care-see-all:hover svg {
          transform: translateX(3px);
        }

        .baby-care-slider {
          position: relative;
        }

        .baby-care-scroll {
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

        .baby-care-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .baby-product-wrapper {
          width: min(78vw, 252px);
          flex: 0 0 min(78vw, 252px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .baby-product-card {
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

        .baby-product-card:hover {
          border-color: rgba(
            201,
            71,
            112,
            0.32
          );
          box-shadow:
            0 34px 68px -37px
              rgba(201, 71, 112, 0.38),
            0 16px 34px -27px
              rgba(15, 23, 42, 0.3);
          transform: translate3d(
            0,
            -7px,
            0
          );
        }

        .baby-product-image-link {
          position: relative;
          display: block;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fffafb 67%,
              #f8f1f4 100%
            );
        }

        .baby-product-image {
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

        .baby-product-card:hover
          .baby-product-image {
          filter:
            saturate(1.04)
            contrast(1.02);
          transform: scale(1.065);
        }

        .baby-product-image-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              145deg,
              rgba(
                255,
                255,
                255,
                0.17
              ),
              transparent 47%,
              rgba(
                201,
                71,
                112,
                0.035
              )
            );
        }

        .baby-product-shine {
          position: absolute;
          inset: 0 auto 0 -85%;
          width: 42%;
          pointer-events: none;
          transform: rotate(18deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(
              255,
              255,
              255,
              0.58
            ),
            transparent
          );
          transition: left 760ms ease;
        }

        .baby-product-card:hover
          .baby-product-shine {
          left: 135%;
        }

        .baby-product-discount {
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
          font-size: var(--baby-text-13);
          font-weight: 850;
          line-height: 1.05;
          text-align: center;
        }

        .baby-product-brand {
          position: absolute;
          top: 10px;
          right: 10px;
          max-width: 105px;
          overflow: hidden;
          padding: 5px 8px;
          border: 1px solid
            rgba(255, 255, 255, 0.88);
          border-radius: 999px;
          color: #c94770;
          background: rgba(
            255,
            255,
            255,
            0.93
          );
          box-shadow:
            0 9px 20px -14px
              rgba(15, 23, 42, 0.5);
          font-size: var(--baby-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
          backdrop-filter: blur(10px);
        }

        .baby-product-content {
          display: flex;
          min-height: 228px;
          flex: 1;
          flex-direction: column;
          padding: 13px;
        }

        .baby-product-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 32px;
          align-items: center;
          gap: 7px;
          padding: 5px 8px;
          border-radius: 7px;
          color: #202939;
          background: #eff1f3;
          font-size: var(--baby-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .baby-product-delivery-icon {
          display: flex;
          width: 23px;
          height: 23px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffd63d;
          background: #172033;
        }

        .baby-product-name {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 12px 0 0;
          color: #101828;
          font-size: var(--baby-text-16);
          font-weight: 680;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .baby-product-card:hover
          .baby-product-name {
          color: #c94770;
        }

        .baby-product-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 7px;
        }

        .baby-product-review-count {
          margin-left: 6px;
          color: #667085;
          font-size: var(--baby-text-13);
          line-height: 1.4;
        }

        .baby-product-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 13px;
        }

        .baby-product-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--baby-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .baby-product-sale-price {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(--baby-text-18);
          font-weight: 850;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .baby-product-add-button {
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
          font-size: var(--baby-text-13);
          font-weight: 850;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .baby-product-add-button:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow:
            0 12px 24px -14px
              rgba(8, 123, 117, 0.7);
          transform: translateY(-2px);
        }

        .baby-product-add-button.is-added {
          color: #ffffff;
          background: #087b75;
        }

        .baby-product-arrow {
          position: absolute;
          top: 43%;
          z-index: 30;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid
            rgba(201, 71, 112, 0.2);
          border-radius: 50%;
          color: #c94770;
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
            border-color 250ms ease,
            color 250ms ease,
            background-color 250ms ease;
        }

        .baby-product-arrow-left {
          left: 0;
          transform: translate(
            -50%,
            -50%
          );
        }

        .baby-product-arrow-right {
          right: 0;
          transform: translate(
            50%,
            -50%
          );
        }

        .baby-product-arrow:hover {
          border-color: #c94770;
          color: #ffffff;
          background: #c94770;
        }

        .baby-product-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .baby-product-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #98a2b3;
          background: #fffafb;
        }

        .baby-product-fallback span {
          font-size: var(--baby-text-13);
          font-weight: 700;
        }

        .baby-product-empty {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #e5dce0;
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

        .baby-product-empty-title {
          margin: 12px 0 0;
          color: #344054;
          font-size: var(--baby-text-16);
          font-weight: 750;
        }

        .baby-product-empty-text {
          margin: 6px 0 0;
          color: #667085;
          font-size: var(--baby-text-13);
          line-height: 1.6;
        }

        .baby-deals-section {
          margin-top: 54px;
        }

        .baby-deals-heading {
          margin-bottom: 20px;
          text-align: center;
        }

        .baby-deals-eyebrow {
          margin: 0;
          color: #c94770;
          font-size: var(--baby-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .baby-deals-title {
          margin: 4px 0 0;
          color: #101828;
          font-size: var(--baby-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .baby-deals-grid {
          display: grid;
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
          gap: 20px;
        }

        .baby-deal-card {
          position: relative;
          display: block;
          overflow: hidden;
          min-height: 230px;
          border: 1px solid
            rgba(15, 23, 42, 0.08);
          border-radius: 17px;
          background: #f7f8fa;
          box-shadow:
            0 20px 48px -38px
              rgba(15, 23, 42, 0.42);
          outline: none;
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
        }

        .baby-deal-card:hover {
          border-color: rgba(
            201,
            71,
            112,
            0.28
          );
          box-shadow:
            0 34px 65px -38px
              rgba(201, 71, 112, 0.36);
          transform: translateY(-6px);
        }

        .baby-deal-card:focus-visible {
          outline: 3px solid
            rgba(201, 71, 112, 0.2);
          outline-offset: 4px;
        }

        .baby-deal-image {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 230px;
          object-fit: cover;
          transform: scale(1.001);
          transition:
            transform 800ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            filter 500ms ease;
        }

        .baby-deal-card:hover
          .baby-deal-image {
          filter:
            saturate(1.06)
            contrast(1.02);
          transform: scale(1.035);
        }

        .baby-deal-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.04),
              transparent 28%,
              transparent 72%,
              rgba(0, 0, 0, 0.04)
            ),
            linear-gradient(
              180deg,
              rgba(
                255,
                255,
                255,
                0.02
              ),
              rgba(0, 0, 0, 0.05)
            );
        }

        .baby-deal-shine {
          position: absolute;
          inset: 0 auto 0 -55%;
          width: 24%;
          pointer-events: none;
          transform: skewX(-18deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(
              255,
              255,
              255,
              0.28
            ),
            transparent
          );
          transition: left 850ms ease;
        }

        .baby-deal-card:hover
          .baby-deal-shine {
          left: 135%;
        }

        .baby-deal-arrow {
          position: absolute;
          right: 16px;
          bottom: 16px;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid
            rgba(255, 255, 255, 0.65);
          border-radius: 50%;
          color: #c94770;
          background: rgba(
            255,
            255,
            255,
            0.9
          );
          box-shadow:
            0 14px 28px -18px
              rgba(15, 23, 42, 0.58);
          backdrop-filter: blur(12px);
          opacity: 0;
          transform: translateY(7px);
          transition:
            opacity 300ms ease,
            transform 340ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            color 250ms ease,
            background-color 250ms ease;
        }

        .baby-deal-card:hover
          .baby-deal-arrow {
          opacity: 1;
          transform: translateY(0);
        }

        .baby-deal-arrow:hover {
          color: #ffffff;
          background: #c94770;
        }

        @media (min-width: 1280px) {
          .baby-product-wrapper {
            width: calc(
              (100% - 80px) / 6
            );
            flex-basis: calc(
              (100% - 80px) / 6
            );
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .baby-care-section {
            padding: 52px 0 58px;
          }

          .baby-care-container {
            width: min(
              1180px,
              calc(100% - 40px)
            );
          }

          .baby-product-wrapper {
            width: calc(
              (100% - 48px) / 4
            );
            flex-basis: calc(
              (100% - 48px) / 4
            );
          }

          .baby-deal-card,
          .baby-deal-image {
            min-height: 210px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .baby-care-section {
            padding: 48px 0 54px;
          }

          .baby-care-container {
            width: calc(100% - 32px);
          }

          .baby-product-wrapper {
            width: calc(
              (100% - 32px) / 3
            );
            flex-basis: calc(
              (100% - 32px) / 3
            );
          }

          .baby-deals-section {
            margin-top: 48px;
          }

          .baby-deal-card,
          .baby-deal-image {
            min-height: 190px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .baby-care-section {
            padding: 44px 0 49px;
          }

          .baby-care-container {
            width: calc(100% - 24px);
          }

          .baby-product-wrapper {
            width: calc(
              (100% - 16px) / 2
            );
            flex-basis: calc(
              (100% - 16px) / 2
            );
          }

          .baby-product-arrow {
            display: none;
          }

          .baby-deals-grid {
            gap: 14px;
          }

          .baby-deal-card,
          .baby-deal-image {
            min-height: 170px;
          }
        }

        @media (max-width: 639px) {
          .baby-care-section {
            padding: 38px 0 44px;
          }

          .baby-care-container {
            width: 100%;
          }

          .baby-care-header {
            margin-bottom: 16px;
            padding-inline: 14px;
          }

          .baby-care-description {
            max-width: 330px;
          }

          .baby-care-see-all {
            min-height: 40px;
            padding-inline: 13px;
          }

          .baby-care-scroll {
            gap: 12px;
            padding: 8px 14px 18px;
            scroll-padding-inline: 14px;
          }

          .baby-product-wrapper {
            width: min(80vw, 255px);
            flex-basis: min(80vw, 255px);
          }

          .baby-product-arrow {
            display: none;
          }

          .baby-product-content {
            min-height: 220px;
            padding: 12px;
          }

          .baby-product-image {
            padding: 12px;
          }

          .baby-deals-section {
            margin-top: 40px;
            padding-inline: 14px;
          }

          .baby-deals-heading {
            margin-bottom: 16px;
          }

          .baby-deals-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .baby-deal-card,
          .baby-deal-image {
            min-height: 180px;
          }

          .baby-deal-arrow {
            right: 12px;
            bottom: 12px;
            width: 38px;
            height: 38px;
            opacity: 1;
            transform: none;
          }
        }

        @media (max-width: 420px) {
          .baby-care-header {
            align-items: flex-start;
            gap: 10px;
            padding-inline: 11px;
          }

          .baby-care-see-all span {
            display: none;
          }

          .baby-care-see-all {
            width: 40px;
            min-width: 40px;
            padding: 0;
          }

          .baby-care-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .baby-deals-section {
            padding-inline: 11px;
          }

          .baby-deal-card,
          .baby-deal-image {
            min-height: 165px;
          }
        }

        @media (max-width: 380px) {
          .baby-product-wrapper {
            width: calc(100vw - 36px);
            flex-basis: calc(
              100vw - 36px
            );
          }

          .baby-deal-card,
          .baby-deal-image {
            min-height: 155px;
          }
        }

        @media (hover: none) {
          .baby-product-card:hover,
          .baby-product-card:hover
            .baby-product-image,
          .baby-product-add-button:hover,
          .baby-deal-card:hover,
          .baby-deal-card:hover
            .baby-deal-image {
            transform: none;
          }

          .baby-deal-arrow {
            opacity: 1;
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .baby-care-section *,
          .baby-care-section *::before,
          .baby-care-section *::after {
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
      data-baby-product-card
      className="baby-product-wrapper baby-product-card"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="baby-product-image-link"
      >
        {!imageError ? (
          <img
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            loading="lazy"
            draggable={false}
            onError={() =>
              setImageError(true)
            }
            className="baby-product-image"
          />
        ) : (
          <div className="baby-product-fallback">
            <ImageOff
              size={20}
              strokeWidth={1.7}
            />

            <span>
              Image unavailable
            </span>
          </div>
        )}

        <span
          aria-hidden="true"
          className="baby-product-image-overlay"
        />

        <span
          aria-hidden="true"
          className="baby-product-shine"
        />

        <span className="baby-product-discount">
          {product.discount}%
          <br />
          OFF
        </span>

        <span className="baby-product-brand">
          {product.brand || "Product"}
        </span>
      </Link>

      <div className="baby-product-content">
        <DeliveryBadge />

        <Link
          href={product.href}
          className="baby-product-name"
        >
          {product.title}
        </Link>

        <div className="baby-product-rating">
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

          <span className="baby-product-review-count">
            ({product.reviewCount})
          </span>
        </div>

        <div className="baby-product-price-row">
          <div>
            <p className="baby-product-old-price">
              {product.currencySymbol}
              {formatPrice(
                product.originalPrice,
              )}
            </p>

            <p className="baby-product-sale-price">
              {product.currencySymbol}
              {formatPrice(
                product.salePrice,
              )}
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
              "baby-product-add-button",
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
        "baby-product-arrow",
        direction === "left"
          ? "baby-product-arrow-left"
          : "baby-product-arrow-right",
        visible ? "" : "is-hidden",
      ].join(" ")}
    >
      <Icon
        size={20}
        strokeWidth={1.8}
      />
    </button>
  );
}

function DeliveryBadge() {
  return (
    <div className="baby-product-delivery">
      <span className="baby-product-delivery-icon">
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

  const slug = createSlug(product.title);

  return {
    ...product,
    slug,
    href: `/products/${product.id}`,
    salePrice,
    originalPrice,
    discount,
    reviewCount:
      product.rating !== null
        ? ((product.id * 29) % 180) + 1
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
    <div className="baby-product-wrapper baby-product-card">
      <div className="aspect-square animate-pulse bg-[#f2e8ec]" />

      <div className="space-y-3 p-4">
        <div className="h-8 w-28 animate-pulse rounded bg-[#f2e8ec]" />

        <div className="h-5 animate-pulse rounded bg-[#f2e8ec]" />

        <div className="h-5 w-4/5 animate-pulse rounded bg-[#f2e8ec]" />

        <div className="h-4 w-24 animate-pulse rounded bg-[#f2e8ec]" />

        <div className="flex items-end justify-between pt-3">
          <div className="h-10 w-20 animate-pulse rounded bg-[#f2e8ec]" />

          <div className="h-10 w-14 animate-pulse rounded bg-[#f2e8ec]" />
        </div>
      </div>
    </div>
  );
}

function EmptyProducts() {
  return (
    <div className="baby-product-empty">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="baby-product-empty-title">
          No products available
        </p>

        <p className="baby-product-empty-text">
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
    <section className="flex min-h-[320px] items-center justify-center bg-[#fffafb] px-5 py-12 text-center">
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
            window.location.reload()
          }
          className="mt-4 min-h-[42px] rounded-[9px] bg-[#c94770] px-5 text-[13px] font-bold text-white"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}