"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  PawPrint,
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
  uniqueId: string;
  href: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  reviewCount: number;
  currencySymbol: string;
};

type FeaturedBrand = {
  id: number;
  name: string;
  href: string;
  logo: string;
};

const PRODUCT_LIMIT = 24;

const discountValues = [
  6, 4, 10, 10, 10, 10, 14, 8, 20, 12, 18, 5, 16, 22, 9, 25, 7, 30, 11,
  15,
];

const veterinaryKeywords = [
  "vet",
  "veterinary",
  "animal",
  "pet",
  "cat",
  "dog",
  "bird",
  "poultry",
  "livestock",
  "antibiotic",
  "antibacterial",
  "care",
];

const featuredBrands: FeaturedBrand[] = [
  {
    id: 1,
    name: "CeraVe",
    href: "/brands/cerave",
    logo: "https://logo.clearbit.com/cerave.com?size=512",
  },
  {
    id: 2,
    name: "Cetaphil",
    href: "/brands/cetaphil",
    logo: "https://logo.clearbit.com/cetaphil.com?size=512",
  },
  {
    id: 3,
    name: "TRESemmé",
    href: "/brands/tresemme",
    logo: "https://logo.clearbit.com/tresemme.com?size=512",
  },
  {
    id: 4,
    name: "Head & Shoulders",
    href: "/brands/head-and-shoulders",
    logo: "https://logo.clearbit.com/headandshoulders.com?size=512",
  },
  {
    id: 5,
    name: "Marico Bangladesh",
    href: "/brands/marico",
    logo: "https://logo.clearbit.com/marico.com?size=512",
  },
  {
    id: 6,
    name: "Innsæi",
    href: "/brands/innsaei",
    logo: "https://logo.clearbit.com/innsaei.com?size=512",
  },
  {
    id: 7,
    name: "NatureBell",
    href: "/brands/naturebell",
    logo: "https://logo.clearbit.com/naturebellusa.com?size=512",
  },
  {
    id: 8,
    name: "Reckitt",
    href: "/brands/reckitt",
    logo: "https://logo.clearbit.com/reckitt.com?size=512",
  },
  {
    id: 9,
    name: "Himalaya",
    href: "/brands/himalaya",
    logo: "https://logo.clearbit.com/himalayawellness.com?size=512",
  },
  {
    id: 10,
    name: "Square Toiletries",
    href: "/brands/square-toiletries",
    logo: "https://logo.clearbit.com/squaretoiletries.com?size=512",
  },
  {
    id: 11,
    name: "Beauty Glazed",
    href: "/brands/beauty-glazed",
    logo: "https://logo.clearbit.com/beautyglazed.com?size=512",
  },
  {
    id: 12,
    name: "AMA",
    href: "/brands/ama",
    logo: "https://logo.clearbit.com/amacoffee.com?size=512",
  },
];

export default function VetCareAndBrandsSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [cartItems, setCartItems] = useState<string[]>([]);
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
            `Unable to load public/product-data.Json. Status: ${response.status}`,
          );
        }

        const result = (await response.json()) as unknown;

        if (!Array.isArray(result)) {
          throw new Error(
            "public/product-data.Json must contain a JSON array of products.",
          );
        }

        const normalizedProducts = result
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

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  const displayedProducts = useMemo(() => {
    if (products.length === 0) {
      return [];
    }

    const veterinaryProducts = products.filter((product) => {
      const searchableText = [
        product.title,
        product.category,
        product.brand,
      ]
        .join(" ")
        .toLowerCase();

      return veterinaryKeywords.some((keyword) =>
        searchableText.includes(keyword),
      );
    });

    const preferredProducts =
      veterinaryProducts.length >= 6
        ? veterinaryProducts
        : products;

    return preferredProducts
      .slice(0, PRODUCT_LIMIT)
      .map((product, index) => {
        const discount =
          discountValues[index % discountValues.length];

        return {
          ...product,
          uniqueId: `vet-product-${product.id}-${index}`,
          discount,
          originalPrice:
            product.salePrice / (1 - discount / 100),
        };
      });
  }, [products]);

  const updateScrollButtons = useCallback(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

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

    if (!container) {
      return;
    }

    updateScrollButtons();

    container.addEventListener("scroll", updateScrollButtons, {
      passive: true,
    });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrollButtons)
        : null;

    resizeObserver?.observe(container);

    if (!resizeObserver) {
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
  }, [displayedProducts.length, updateScrollButtons]);

  const scrollProducts = (
    direction: "left" | "right",
  ) => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-vet-product-card]",
      );

    if (!firstCard) {
      return;
    }

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

    const scrollDistance =
      (cardWidth + gap) * visibleCards;

    container.scrollBy({
      left:
        direction === "right"
          ? scrollDistance
          : -scrollDistance,
      behavior: "smooth",
    });
  };

  const toggleCart = (uniqueId: string) => {
    setCartItems((currentItems) =>
      currentItems.includes(uniqueId)
        ? currentItems.filter((id) => id !== uniqueId)
        : [...currentItems, uniqueId],
    );
  };

  if (!loading && loadError) {
    return <ProductLoadError message={loadError} />;
  }

  return (
    <>
      <section
        aria-labelledby="anti-bacterial-vet-care-title"
        className="vet-brand-section"
      >
        <div
          aria-hidden="true"
          className="vet-brand-pattern"
        />

        <div
          aria-hidden="true"
          className="vet-brand-glow vet-brand-glow-left"
        />

        <div
          aria-hidden="true"
          className="vet-brand-glow vet-brand-glow-right"
        />

        <div className="vet-brand-container">
          <section className="vet-products-panel">
            <span
              aria-hidden="true"
              className="vet-panel-decoration"
            />

            <header className="vet-section-header">
              <div className="vet-heading-content">
                <p className="vet-eyebrow">
                  Veterinary essentials
                </p>

                <h2
                  id="anti-bacterial-vet-care-title"
                  className="vet-section-title"
                >
                  Anti-Bacterial Vet Care
                </h2>

                <p className="vet-section-description">
                  Explore animal health and veterinary-care
                  products selected from your product catalog.
                </p>
              </div>

              <Link
                href="/veterinary"
                className="vet-see-all"
              >
                <span>See all</span>

                <ChevronRight
                  size={18}
                  strokeWidth={1.8}
                />
              </Link>
            </header>

            <div className="vet-product-slider">
              <ProductArrow
                direction="left"
                visible={canScrollLeft}
                onClick={() => scrollProducts("left")}
              />

              <div
                ref={scrollRef}
                className="vet-product-scroll"
              >
                {loading &&
                  Array.from({ length: 6 }).map(
                    (_, index) => (
                      <ProductSkeleton key={index} />
                    ),
                  )}

                {!loading &&
                  displayedProducts.map((product) => (
                    <ProductCard
                      key={product.uniqueId}
                      product={product}
                      added={cartItems.includes(
                        product.uniqueId,
                      )}
                      onToggleCart={() =>
                        toggleCart(product.uniqueId)
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
                onClick={() => scrollProducts("right")}
              />
            </div>
          </section>

          <section
            aria-labelledby="featured-brands-title"
            className="featured-brands-section"
          >
            <header className="featured-brands-header">
              <p className="featured-brands-eyebrow">
                Trusted names
              </p>

              <h2
                id="featured-brands-title"
                className="featured-brands-title"
              >
                Featured Brands
              </h2>

              <p className="featured-brands-description">
                Browse leading healthcare, beauty, wellness
                and household brands available at Anukov.
              </p>
            </header>

            <div className="featured-brands-grid">
              {featuredBrands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                />
              ))}
            </div>
          </section>
        </div>
      </section>

      <style>{`
        .vet-brand-section {
          --vet-text-20: 20px;
          --vet-text-18: 18px;
          --vet-text-16: 16px;
          --vet-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 56px 0 68px;
          background:
            radial-gradient(
              circle at 4% 7%,
              rgba(222, 242, 237, 0.7),
              transparent 29%
            ),
            radial-gradient(
              circle at 96% 92%,
              rgba(229, 238, 253, 0.7),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #fbfefd 0%,
              #ffffff 50%,
              #f7fbff 100%
            );
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .vet-brand-pattern {
          position: absolute;
          inset: 0;
          z-index: -3;
          pointer-events: none;
          opacity: 0.2;
          background-image:
            linear-gradient(
              rgba(8, 123, 117, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(8, 123, 117, 0.035) 1px,
              transparent 1px
            );
          background-size: 46px 46px;
        }

        .vet-brand-glow {
          position: absolute;
          z-index: -2;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(120px);
          opacity: 0.46;
        }

        .vet-brand-glow-left {
          top: -150px;
          left: -250px;
          background: rgba(52, 173, 148, 0.36);
        }

        .vet-brand-glow-right {
          right: -260px;
          bottom: -160px;
          background: rgba(75, 134, 218, 0.3);
        }

        .vet-brand-container {
          position: relative;
          width: min(1440px, calc(100% - 48px));
          margin-inline: auto;
        }

        .vet-products-panel {
          position: relative;
          overflow: hidden;
          padding: 28px;
          border: 1px solid rgba(15, 23, 42, 0.07);
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              #f4fcfa 0%,
              #ffffff 50%,
              #eef9f6 100%
            );
          box-shadow:
            0 28px 65px -50px rgba(15, 23, 42, 0.46),
            inset 0 1px rgba(255, 255, 255, 0.94);
        }

        .vet-panel-decoration {
          position: absolute;
          top: -110px;
          right: -95px;
          width: 250px;
          height: 250px;
          border: 38px solid rgba(255, 255, 255, 0.52);
          border-radius: 50%;
          pointer-events: none;
        }

        .vet-section-header {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
        }

        .vet-heading-content {
          min-width: 0;
        }

        .vet-eyebrow,
        .featured-brands-eyebrow {
          margin: 0;
          color: #087b75;
          font-size: var(--vet-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .vet-section-title,
        .featured-brands-title {
          margin: 4px 0 0;
          color: #075f57;
          font-size: var(--vet-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .vet-section-description,
        .featured-brands-description {
          max-width: 650px;
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--vet-text-13);
          line-height: 1.7;
        }

        .vet-see-all {
          display: inline-flex;
          min-height: 42px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 8px 15px;
          border: 1px solid #087b75;
          border-radius: 999px;
          color: #087b75;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 13px 28px -21px rgba(8, 123, 117, 0.55);
          font-size: var(--vet-text-13);
          font-weight: 800;
          text-decoration: none;
          backdrop-filter: blur(12px);
          transition:
            color 280ms ease,
            background-color 280ms ease,
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 300ms ease;
        }

        .vet-see-all:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow: 0 18px 34px -20px rgba(8, 123, 117, 0.68);
          transform: translateY(-2px);
        }

        .vet-see-all svg {
          transition: transform 280ms ease;
        }

        .vet-see-all:hover svg {
          transform: translateX(3px);
        }

        .vet-product-slider {
          position: relative;
          z-index: 4;
        }

        .vet-product-scroll {
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

        .vet-product-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .vet-product-wrapper {
          width: min(78vw, 252px);
          flex: 0 0 min(78vw, 252px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .vet-product-card {
          display: flex;
          height: 100%;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.09);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow:
            0 13px 34px -28px rgba(15, 23, 42, 0.46),
            0 2px 7px rgba(15, 23, 42, 0.03);
          transform: translateZ(0);
          transition:
            transform 440ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 350ms ease,
            box-shadow 440ms ease;
          will-change: transform;
        }

        .vet-product-card:hover {
          border-color: rgba(8, 123, 117, 0.4);
          box-shadow:
            0 34px 68px -37px rgba(8, 123, 117, 0.42),
            0 16px 34px -27px rgba(15, 23, 42, 0.28);
          transform: translate3d(0, -7px, 0);
        }

        .vet-image-link {
          position: relative;
          display: block;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fafcfc 66%,
              #edf4f2 100%
            );
        }

        .vet-product-image {
          display: block;
          width: 100%;
          height: 100%;
          padding: 14px;
          object-fit: contain;
          transform: scale(1.001);
          transition:
            transform 680ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 500ms ease;
          will-change: transform;
        }

        .vet-product-card:hover .vet-product-image {
          filter: saturate(1.05) contrast(1.02);
          transform: scale(1.065);
        }

        .vet-image-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.18),
            transparent 48%,
            rgba(8, 123, 117, 0.035)
          );
        }

        .vet-image-shine {
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

        .vet-product-card:hover .vet-image-shine {
          left: 135%;
        }

        .vet-discount {
          position: absolute;
          top: 0;
          left: 9px;
          z-index: 5;
          min-width: 38px;
          padding: 6px 7px;
          border-radius: 0 0 7px 7px;
          color: #ffffff;
          background: linear-gradient(180deg, #247af0, #0759b5);
          box-shadow: 0 9px 17px -10px rgba(7, 89, 181, 0.85);
          font-size: var(--vet-text-13);
          font-weight: 850;
          line-height: 1.05;
          text-align: center;
        }

        .vet-discount.is-highlighted {
          background: linear-gradient(180deg, #f0526b, #d92745);
          box-shadow: 0 9px 17px -10px rgba(217, 39, 69, 0.82);
        }

        .vet-product-brand {
          position: absolute;
          top: 10px;
          right: 10px;
          max-width: 108px;
          overflow: hidden;
          padding: 5px 8px;
          border: 1px solid rgba(255, 255, 255, 0.88);
          border-radius: 999px;
          color: #087b75;
          background: rgba(255, 255, 255, 0.93);
          box-shadow: 0 9px 20px -14px rgba(15, 23, 42, 0.5);
          font-size: var(--vet-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
          backdrop-filter: blur(10px);
        }

        .vet-product-content {
          display: flex;
          min-height: 228px;
          flex: 1;
          flex-direction: column;
          padding: 13px;
        }

        .vet-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 32px;
          align-items: center;
          gap: 7px;
          padding: 5px 8px;
          border-radius: 7px;
          color: #202939;
          background: #eff1f3;
          font-size: var(--vet-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .vet-delivery-icon {
          display: flex;
          width: 23px;
          height: 23px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffd63d;
          background: #172033;
        }

        .vet-product-name {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 12px 0 0;
          color: #101828;
          font-size: var(--vet-text-16);
          font-weight: 680;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .vet-product-card:hover .vet-product-name {
          color: #087b75;
        }

        .vet-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 7px;
        }

        .vet-review-count {
          margin-left: 6px;
          color: #667085;
          font-size: var(--vet-text-13);
          line-height: 1.4;
        }

        .vet-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 13px;
        }

        .vet-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--vet-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .vet-sale-price {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(--vet-text-18);
          font-weight: 850;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .vet-add-button {
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
          font-size: var(--vet-text-13);
          font-weight: 850;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .vet-add-button:hover,
        .vet-add-button.is-added {
          color: #ffffff;
          background: #087b75;
        }

        .vet-add-button:hover {
          box-shadow: 0 12px 24px -14px rgba(8, 123, 117, 0.7);
          transform: translateY(-2px);
        }

        .vet-product-arrow {
          position: absolute;
          top: 43%;
          z-index: 30;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid #087b75;
          border-radius: 50%;
          color: #087b75;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 12px 27px -14px rgba(15, 23, 42, 0.45);
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition:
            opacity 260ms ease,
            color 250ms ease,
            background-color 250ms ease;
        }

        .vet-product-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .vet-product-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .vet-product-arrow:hover {
          color: #ffffff;
          background: #087b75;
        }

        .vet-product-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .vet-image-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #98a2b3;
          background: #f7f9f9;
        }

        .vet-image-fallback span {
          font-size: var(--vet-text-13);
          font-weight: 700;
        }

        .vet-empty {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #dce3e6;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.9);
          padding: 24px;
          text-align: center;
        }

        .vet-empty-title {
          margin: 12px 0 0;
          color: #344054;
          font-size: var(--vet-text-16);
          font-weight: 750;
        }

        .vet-empty-description {
          margin: 6px 0 0;
          color: #667085;
          font-size: var(--vet-text-13);
          line-height: 1.6;
        }

        .featured-brands-section {
          position: relative;
          margin-top: 46px;
          padding: 30px;
          border: 1px solid rgba(15, 23, 42, 0.07);
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.98),
              rgba(248, 251, 252, 0.98)
            );
          box-shadow:
            0 28px 65px -50px rgba(15, 23, 42, 0.42),
            inset 0 1px rgba(255, 255, 255, 0.94);
        }

        .featured-brands-header {
          margin-bottom: 28px;
          text-align: center;
        }

        .featured-brands-description {
          margin-right: auto;
          margin-left: auto;
        }

        .featured-brands-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
        }

        .featured-brand-card {
          display: flex;
          min-width: 0;
          min-height: 176px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 13px;
          overflow: hidden;
          padding: 20px;
          border: 1px solid rgba(15, 23, 42, 0.07);
          border-radius: 16px;
          color: #101828;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fbfcfc 72%,
              #f4f7f7 100%
            );
          box-shadow: 0 16px 35px -32px rgba(15, 23, 42, 0.46);
          text-align: center;
          text-decoration: none;
          outline: none;
          transform: translateZ(0);
          transition:
            transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 320ms ease,
            box-shadow 420ms ease;
        }

        .featured-brand-card:hover {
          border-color: rgba(8, 123, 117, 0.3);
          box-shadow:
            0 30px 58px -38px rgba(8, 123, 117, 0.38),
            0 12px 28px -24px rgba(15, 23, 42, 0.28);
          transform: translateY(-6px);
        }

        .featured-brand-card:focus-visible {
          outline: 3px solid rgba(8, 123, 117, 0.2);
          outline-offset: 4px;
        }

        .featured-brand-logo-wrapper {
          position: relative;
          display: flex;
          width: 100%;
          height: 92px;
          align-items: center;
          justify-content: center;
        }

        .featured-brand-logo {
          display: block;
          max-width: 90%;
          max-height: 78px;
          object-fit: contain;
          filter: saturate(1.02);
          transform: scale(1.001);
          transition:
            transform 500ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 300ms ease;
        }

        .featured-brand-card:hover .featured-brand-logo {
          filter: saturate(1.08);
          transform: scale(1.06);
        }

        .featured-brand-name {
          margin: 0;
          color: #344054;
          font-size: var(--vet-text-13);
          font-weight: 750;
          line-height: 1.5;
        }

        .featured-brand-fallback {
          display: flex;
          width: 76px;
          height: 76px;
          align-items: center;
          justify-content: center;
          border: 1px solid #cee6e2;
          border-radius: 18px;
          color: #087b75;
          background: #eff9f7;
          font-size: var(--vet-text-20);
          font-weight: 850;
        }

        @media (min-width: 1280px) {
          .vet-product-wrapper {
            width: calc((100% - 80px) / 6);
            flex-basis: calc((100% - 80px) / 6);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .vet-brand-section {
            padding: 52px 0 60px;
          }

          .vet-brand-container {
            width: min(1180px, calc(100% - 40px));
          }

          .vet-products-panel {
            padding: 25px;
          }

          .vet-product-wrapper {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }

          .featured-brands-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .vet-brand-section {
            padding: 48px 0 56px;
          }

          .vet-brand-container {
            width: calc(100% - 32px);
          }

          .vet-products-panel {
            padding: 22px;
          }

          .vet-product-wrapper {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }

          .featured-brands-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .vet-brand-section {
            padding: 44px 0 50px;
          }

          .vet-brand-container {
            width: calc(100% - 24px);
          }

          .vet-products-panel {
            padding: 20px;
          }

          .vet-product-wrapper {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .vet-product-arrow {
            display: none;
          }

          .featured-brands-section {
            padding: 24px;
          }

          .featured-brands-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }

          .featured-brand-card {
            min-height: 160px;
            padding: 16px;
          }
        }

        @media (max-width: 639px) {
          .vet-brand-section {
            padding: 38px 0 46px;
          }

          .vet-brand-container {
            width: 100%;
          }

          .vet-products-panel {
            padding: 20px 0;
            border-right: 0;
            border-left: 0;
            border-radius: 0;
          }

          .vet-section-header {
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
            padding-inline: 14px;
          }

          .vet-section-description {
            max-width: 330px;
          }

          .vet-see-all {
            min-height: 40px;
            padding-inline: 13px;
          }

          .vet-product-scroll {
            gap: 12px;
            padding: 8px 14px 18px;
            scroll-padding-inline: 14px;
          }

          .vet-product-wrapper {
            width: min(80vw, 255px);
            flex-basis: min(80vw, 255px);
          }

          .vet-product-content {
            min-height: 220px;
            padding: 12px;
          }

          .vet-product-image {
            padding: 12px;
          }

          .vet-product-arrow {
            display: none;
          }

          .featured-brands-section {
            margin-top: 34px;
            padding: 24px 14px;
            border-right: 0;
            border-left: 0;
            border-radius: 0;
          }

          .featured-brands-header {
            margin-bottom: 20px;
            padding-inline: 4px;
          }

          .featured-brands-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .featured-brand-card {
            min-height: 145px;
            gap: 10px;
            padding: 14px 10px;
            border-radius: 13px;
          }

          .featured-brand-logo-wrapper {
            height: 76px;
          }

          .featured-brand-logo {
            max-height: 62px;
          }
        }

        @media (max-width: 420px) {
          .vet-section-header {
            padding-inline: 11px;
          }

          .vet-see-all span {
            display: none;
          }

          .vet-see-all {
            width: 40px;
            min-width: 40px;
            padding: 0;
          }

          .vet-product-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .featured-brands-section {
            padding-right: 11px;
            padding-left: 11px;
          }

          .featured-brand-card {
            min-height: 138px;
          }
        }

        @media (max-width: 350px) {
          .vet-product-wrapper {
            width: calc(100vw - 36px);
            flex-basis: calc(100vw - 36px);
          }

          .featured-brands-grid {
            grid-template-columns: 1fr;
          }

          .featured-brand-card {
            min-height: 145px;
          }
        }

        @media (hover: none) {
          .vet-product-card:hover,
          .vet-product-card:hover .vet-product-image,
          .vet-add-button:hover,
          .featured-brand-card:hover,
          .featured-brand-card:hover .featured-brand-logo {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vet-brand-section *,
          .vet-brand-section *::before,
          .vet-brand-section *::after {
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
  const [imageError, setImageError] = useState(false);

  const roundedRating = Math.max(
    0,
    Math.min(
      5,
      Math.round(product.rating ?? 0),
    ),
  );

  return (
    <article
      data-vet-product-card
      className="vet-product-wrapper vet-product-card"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="vet-image-link"
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
            className="vet-product-image"
          />
        ) : (
          <div className="vet-image-fallback">
            <ImageOff
              size={20}
              strokeWidth={1.7}
            />

            <span>Image unavailable</span>
          </div>
        )}

        <span
          aria-hidden="true"
          className="vet-image-overlay"
        />

        <span
          aria-hidden="true"
          className="vet-image-shine"
        />

        <span
          className={[
            "vet-discount",
            product.discount >= 18
              ? "is-highlighted"
              : "",
          ].join(" ")}
        >
          {product.discount}%
          <br />
          OFF
        </span>

        <span className="vet-product-brand">
          {product.brand || product.category}
        </span>
      </Link>

      <div className="vet-product-content">
        <DeliveryBadge />

        <Link
          href={product.href}
          className="vet-product-name"
        >
          {product.title}
        </Link>

        <div className="vet-rating">
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

          <span className="vet-review-count">
            ({product.reviewCount})
          </span>
        </div>

        <div className="vet-price-row">
          <div>
            <p className="vet-old-price">
              {product.currencySymbol}
              {formatPrice(product.originalPrice)}
            </p>

            <p className="vet-sale-price">
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
              "vet-add-button",
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

function BrandCard({
  brand,
}: {
  brand: FeaturedBrand;
}) {
  const [logoError, setLogoError] = useState(false);

  return (
    <Link
      href={brand.href}
      aria-label={`Browse ${brand.name} products`}
      className="featured-brand-card"
    >
      <div className="featured-brand-logo-wrapper">
        {!logoError ? (
          <img
            src={brand.logo}
            alt={`${brand.name} logo`}
            width={420}
            height={150}
            loading="lazy"
            draggable={false}
            onError={() => setLogoError(true)}
            className="featured-brand-logo"
          />
        ) : (
          <div className="featured-brand-fallback">
            {getBrandInitials(brand.name)}
          </div>
        )}
      </div>

      <p className="featured-brand-name">
        {brand.name}
      </p>
    </Link>
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
          ? "Show previous veterinary products"
          : "Show more veterinary products"
      }
      className={[
        "vet-product-arrow",
        direction === "left"
          ? "vet-product-arrow-left"
          : "vet-product-arrow-right",
        visible ? "" : "is-hidden",
      ].join(" ")}
    >
      <Icon size={20} strokeWidth={1.8} />
    </button>
  );
}

function DeliveryBadge() {
  return (
    <div className="vet-delivery">
      <span className="vet-delivery-icon">
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
    discountValues[index % discountValues.length];

  return {
    ...product,
    uniqueId: `product-${product.id}-${index}`,
    href: `/products/${product.id}`,
    salePrice,
    originalPrice:
      salePrice / (1 - discount / 100),
    discount,
    reviewCount:
      product.rating !== null
        ? ((product.id * 29) % 170) + 1
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
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2);
}

function getBrandInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function ProductSkeleton() {
  return (
    <div className="vet-product-wrapper vet-product-card">
      <div className="aspect-square animate-pulse bg-[#e8efed]" />

      <div className="space-y-3 p-4">
        <div className="h-8 w-28 animate-pulse rounded bg-[#e8efed]" />

        <div className="h-5 animate-pulse rounded bg-[#e8efed]" />

        <div className="h-5 w-4/5 animate-pulse rounded bg-[#e8efed]" />

        <div className="h-4 w-24 animate-pulse rounded bg-[#e8efed]" />

        <div className="flex items-end justify-between pt-3">
          <div className="h-10 w-20 animate-pulse rounded bg-[#e8efed]" />

          <div className="h-10 w-14 animate-pulse rounded bg-[#e8efed]" />
        </div>
      </div>
    </div>
  );
}

function EmptyProducts() {
  return (
    <div className="vet-empty">
      <div>
        <PawPrint
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="vet-empty-title">
          No veterinary products available
        </p>

        <p className="vet-empty-description">
          Products will appear here when they are
          available in product-data.Json.
        </p>
      </div>
    </div>
  );
}

function ProductLoadError({
  message,
}: {
  message: string;
}) {
  return (
    <section className="flex min-h-[320px] items-center justify-center bg-[#f8fbfa] px-5 py-12 text-center">
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
          onClick={() => window.location.reload()}
          className="mt-4 min-h-[42px] rounded-[9px] bg-[#087b75] px-5 text-[13px] font-bold text-white"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}