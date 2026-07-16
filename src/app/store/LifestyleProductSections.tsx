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
  uniqueId: string;
  href: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  reviewCount: number;
  currencySymbol: string;
};

type SectionConfiguration = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  startIndex: number;
  productCount: number;
  accent: string;
  accentDark: string;
  softAccent: string;
  background: string;
};

const sectionConfigurations: SectionConfiguration[] = [
  {
    id: "fresh-clean-days",
    title: "Fresh & Clean Days",
    eyebrow: "Home care essentials",
    description:
      "Discover cleaning, hygiene and household essentials selected from your product catalog.",
    href: "/home-care",
    startIndex: 0,
    productCount: 20,
    accent: "#16856f",
    accentDark: "#096555",
    softAccent: "#eaf8f4",
    background:
      "linear-gradient(145deg, #f7fdfb 0%, #ffffff 50%, #effaf7 100%)",
  },
  {
    id: "your-pets-best",
    title: "Your Pet’s Best",
    eyebrow: "Pet care collection",
    description:
      "Explore useful food, grooming and everyday care products for your pets.",
    href: "/pet-care",
    startIndex: 20,
    productCount: 20,
    accent: "#bf6b1e",
    accentDark: "#915014",
    softAccent: "#fff4e8",
    background:
      "linear-gradient(145deg, #fffaf3 0%, #ffffff 50%, #fff4e8 100%)",
  },
  {
    id: "turn-up-the-heat",
    title: "Turn Up the Heat",
    eyebrow: "Personal wellness",
    description:
      "Browse personal wellness products with discreet delivery and selected offers.",
    href: "/sexual-wellness",
    startIndex: 40,
    productCount: 20,
    accent: "#c74355",
    accentDark: "#9f2d3d",
    softAccent: "#fff0f2",
    background:
      "linear-gradient(145deg, #fff7f8 0%, #ffffff 50%, #fff0f2 100%)",
  },
];

const discountValues = [
  7, 10, 1, 8, 18, 12, 15, 10, 35, 38,
  5, 20, 21, 25, 62, 34, 17, 13, 28, 9,
];

export default function LifestyleProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [cartItems, setCartItems] = useState<string[]>([]);

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
            `Unable to load /data.json. Status: ${response.status}`,
          );
        }

        const data = (await response.json()) as unknown;

        if (!Array.isArray(data)) {
          throw new Error(
            "public/data.json must contain a JSON array.",
          );
        }

        const validProducts = data
          .filter(isValidProduct)
          .map(normalizeProduct);

        setProducts(validProducts);
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
        aria-label="Lifestyle product collections"
        className="lifestyle-sections"
      >
        <div
          aria-hidden="true"
          className="lifestyle-background-pattern"
        />

        <div className="lifestyle-container">
          {sectionConfigurations.map((configuration) => (
            <ProductCollection
              key={configuration.id}
              configuration={configuration}
              products={products}
              loading={loading}
              cartItems={cartItems}
              onToggleCart={toggleCart}
            />
          ))}
        </div>
      </section>

      <style jsx global>{`
        .lifestyle-sections {
          --lifestyle-text-20: 20px;
          --lifestyle-text-18: 18px;
          --lifestyle-text-16: 16px;
          --lifestyle-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 56px 0 64px;
          background:
            radial-gradient(
              circle at 3% 5%,
              rgba(207, 234, 247, 0.55),
              transparent 28%
            ),
            radial-gradient(
              circle at 97% 95%,
              rgba(226, 242, 237, 0.65),
              transparent 30%
            ),
            #f8fbfc;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .lifestyle-background-pattern {
          position: absolute;
          inset: 0;
          z-index: -2;
          pointer-events: none;
          opacity: 0.22;
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
          background-size: 44px 44px;
        }

        .lifestyle-container {
          position: relative;
          width: min(1440px, calc(100% - 48px));
          margin-inline: auto;
        }

        .lifestyle-collection {
          position: relative;
          overflow: hidden;
          padding: 28px;
          border: 1px solid rgba(15, 23, 42, 0.07);
          border-radius: 22px;
          box-shadow:
            0 28px 65px -50px rgba(15, 23, 42, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.92);
        }

        .lifestyle-collection + .lifestyle-collection {
          margin-top: 38px;
        }

        .lifestyle-collection::before {
          position: absolute;
          top: -105px;
          right: -90px;
          width: 240px;
          height: 240px;
          border: 36px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          pointer-events: none;
          content: "";
        }

        .lifestyle-header {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
        }

        .lifestyle-heading-content {
          min-width: 0;
        }

        .lifestyle-eyebrow {
          margin: 0;
          font-size: var(--lifestyle-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .lifestyle-title {
          margin: 4px 0 0;
          font-size: var(--lifestyle-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .lifestyle-description {
          max-width: 650px;
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--lifestyle-text-13);
          line-height: 1.7;
        }

        .lifestyle-see-all {
          display: inline-flex;
          min-height: 42px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 8px 15px;
          border: 1px solid var(--section-accent);
          border-radius: 999px;
          color: var(--section-accent);
          background: rgba(255, 255, 255, 0.9);
          box-shadow:
            0 14px 28px -21px color-mix(
              in srgb,
              var(--section-accent) 60%,
              transparent
            );
          font-size: var(--lifestyle-text-13);
          font-weight: 800;
          text-decoration: none;
          backdrop-filter: blur(12px);
          transition:
            color 280ms ease,
            background-color 280ms ease,
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 300ms ease;
        }

        .lifestyle-see-all:hover {
          color: #ffffff;
          background: var(--section-accent);
          transform: translateY(-2px);
        }

        .lifestyle-see-all svg {
          transition: transform 280ms ease;
        }

        .lifestyle-see-all:hover svg {
          transform: translateX(3px);
        }

        .lifestyle-slider {
          position: relative;
          z-index: 3;
        }

        .lifestyle-scroll {
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

        .lifestyle-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .lifestyle-product-wrapper {
          width: min(78vw, 252px);
          flex: 0 0 min(78vw, 252px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .lifestyle-product-card {
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

        .lifestyle-product-card:hover {
          border-color: color-mix(
            in srgb,
            var(--section-accent) 35%,
            transparent
          );
          box-shadow:
            0 34px 68px -37px color-mix(
              in srgb,
              var(--section-accent) 44%,
              transparent
            ),
            0 16px 34px -27px rgba(15, 23, 42, 0.3);
          transform: translate3d(0, -7px, 0);
        }

        .lifestyle-product-image-link {
          position: relative;
          display: block;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fafcfc 66%,
              #f0f4f4 100%
            );
        }

        .lifestyle-product-image {
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

        .lifestyle-product-card:hover
          .lifestyle-product-image {
          filter: saturate(1.05) contrast(1.02);
          transform: scale(1.065);
        }

        .lifestyle-product-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.18),
            transparent 48%,
            color-mix(
              in srgb,
              var(--section-accent) 4%,
              transparent
            )
          );
        }

        .lifestyle-product-shine {
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

        .lifestyle-product-card:hover
          .lifestyle-product-shine {
          left: 135%;
        }

        .lifestyle-product-discount {
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
            0 9px 17px -10px rgba(7, 89, 181, 0.85);
          font-size: var(--lifestyle-text-13);
          font-weight: 850;
          line-height: 1.05;
          text-align: center;
        }

        .lifestyle-product-discount.is-highlighted {
          background: linear-gradient(
            180deg,
            #f0526b,
            #d92745
          );
          box-shadow:
            0 9px 17px -10px rgba(217, 39, 69, 0.82);
        }

        .lifestyle-product-brand {
          position: absolute;
          top: 10px;
          right: 10px;
          max-width: 110px;
          overflow: hidden;
          padding: 5px 8px;
          border: 1px solid rgba(255, 255, 255, 0.88);
          border-radius: 999px;
          color: var(--section-accent);
          background: rgba(255, 255, 255, 0.92);
          box-shadow:
            0 9px 20px -14px rgba(15, 23, 42, 0.5);
          font-size: var(--lifestyle-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
          backdrop-filter: blur(10px);
        }

        .lifestyle-product-content {
          display: flex;
          min-height: 228px;
          flex: 1;
          flex-direction: column;
          padding: 13px;
        }

        .lifestyle-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 32px;
          align-items: center;
          gap: 7px;
          padding: 5px 8px;
          border-radius: 7px;
          color: #202939;
          background: #eff1f3;
          font-size: var(--lifestyle-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .lifestyle-delivery-icon {
          display: flex;
          width: 23px;
          height: 23px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffd63d;
          background: #172033;
        }

        .lifestyle-product-name {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 12px 0 0;
          color: #101828;
          font-size: var(--lifestyle-text-16);
          font-weight: 680;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .lifestyle-product-card:hover
          .lifestyle-product-name {
          color: var(--section-accent);
        }

        .lifestyle-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 7px;
        }

        .lifestyle-review-count {
          margin-left: 6px;
          color: #667085;
          font-size: var(--lifestyle-text-13);
          line-height: 1.4;
        }

        .lifestyle-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 13px;
        }

        .lifestyle-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--lifestyle-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .lifestyle-sale-price {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(--lifestyle-text-18);
          font-weight: 850;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .lifestyle-add-button {
          display: inline-flex;
          min-width: 58px;
          min-height: 40px;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0 10px;
          border: 1px solid var(--section-accent);
          border-radius: 8px;
          color: var(--section-accent);
          background: var(--section-soft-accent);
          font-family: inherit;
          font-size: var(--lifestyle-text-13);
          font-weight: 850;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .lifestyle-add-button:hover,
        .lifestyle-add-button.is-added {
          color: #ffffff;
          background: var(--section-accent);
        }

        .lifestyle-add-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 12px 24px -14px color-mix(
              in srgb,
              var(--section-accent) 70%,
              transparent
            );
        }

        .lifestyle-arrow {
          position: absolute;
          top: 43%;
          z-index: 30;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid color-mix(
            in srgb,
            var(--section-accent) 22%,
            transparent
          );
          border-radius: 50%;
          color: var(--section-accent);
          background: rgba(255, 255, 255, 0.97);
          box-shadow:
            0 12px 27px -14px rgba(15, 23, 42, 0.45);
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition:
            opacity 260ms ease,
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
            color 250ms ease,
            background-color 250ms ease;
        }

        .lifestyle-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .lifestyle-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .lifestyle-arrow:hover {
          color: #ffffff;
          background: var(--section-accent);
        }

        .lifestyle-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .lifestyle-image-fallback {
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

        .lifestyle-image-fallback span {
          font-size: var(--lifestyle-text-13);
          font-weight: 700;
        }

        .lifestyle-empty {
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

        .lifestyle-empty-title {
          margin: 12px 0 0;
          color: #344054;
          font-size: var(--lifestyle-text-16);
          font-weight: 750;
        }

        .lifestyle-empty-text {
          margin: 6px 0 0;
          color: #667085;
          font-size: var(--lifestyle-text-13);
          line-height: 1.6;
        }

        @media (min-width: 1280px) {
          .lifestyle-product-wrapper {
            width: calc((100% - 80px) / 6);
            flex-basis: calc((100% - 80px) / 6);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .lifestyle-sections {
            padding: 52px 0 58px;
          }

          .lifestyle-container {
            width: min(1180px, calc(100% - 40px));
          }

          .lifestyle-collection {
            padding: 25px;
          }

          .lifestyle-product-wrapper {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .lifestyle-sections {
            padding: 48px 0 54px;
          }

          .lifestyle-container {
            width: calc(100% - 32px);
          }

          .lifestyle-collection {
            padding: 22px;
          }

          .lifestyle-product-wrapper {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .lifestyle-sections {
            padding: 44px 0 50px;
          }

          .lifestyle-container {
            width: calc(100% - 24px);
          }

          .lifestyle-collection {
            padding: 20px;
          }

          .lifestyle-product-wrapper {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .lifestyle-arrow {
            display: none;
          }
        }

        @media (max-width: 639px) {
          .lifestyle-sections {
            padding: 38px 0 44px;
          }

          .lifestyle-container {
            width: 100%;
          }

          .lifestyle-collection {
            padding: 20px 0;
            border-right: 0;
            border-left: 0;
            border-radius: 0;
          }

          .lifestyle-collection + .lifestyle-collection {
            margin-top: 30px;
          }

          .lifestyle-header {
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
            padding-inline: 14px;
          }

          .lifestyle-description {
            max-width: 330px;
          }

          .lifestyle-see-all {
            min-height: 40px;
            padding-inline: 13px;
          }

          .lifestyle-scroll {
            gap: 12px;
            padding: 8px 14px 18px;
            scroll-padding-inline: 14px;
          }

          .lifestyle-product-wrapper {
            width: min(80vw, 255px);
            flex-basis: min(80vw, 255px);
          }

          .lifestyle-product-content {
            min-height: 220px;
            padding: 12px;
          }

          .lifestyle-product-image {
            padding: 12px;
          }

          .lifestyle-arrow {
            display: none;
          }
        }

        @media (max-width: 420px) {
          .lifestyle-header {
            padding-inline: 11px;
          }

          .lifestyle-see-all span {
            display: none;
          }

          .lifestyle-see-all {
            width: 40px;
            min-width: 40px;
            padding: 0;
          }

          .lifestyle-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }
        }

        @media (max-width: 380px) {
          .lifestyle-product-wrapper {
            width: calc(100vw - 36px);
            flex-basis: calc(100vw - 36px);
          }
        }

        @media (hover: none) {
          .lifestyle-product-card:hover,
          .lifestyle-product-card:hover
            .lifestyle-product-image,
          .lifestyle-add-button:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lifestyle-sections *,
          .lifestyle-sections *::before,
          .lifestyle-sections *::after {
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

function ProductCollection({
  configuration,
  products,
  loading,
  cartItems,
  onToggleCart,
}: {
  configuration: SectionConfiguration;
  products: Product[];
  loading: boolean;
  cartItems: string[];
  onToggleCart: (uniqueId: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const collectionProducts = useMemo(() => {
    if (products.length === 0) {
      return [];
    }

    return Array.from({
      length: Math.min(
        configuration.productCount,
        products.length,
      ),
    }).map((_, index) => {
      const sourceIndex =
        (configuration.startIndex + index) %
        products.length;

      const sourceProduct = products[sourceIndex];

      return {
        ...sourceProduct,
        uniqueId: `${configuration.id}-${sourceProduct.id}-${index}`,
        discount:
          discountValues[
            (configuration.startIndex + index) %
              discountValues.length
          ],
      };
    });
  }, [configuration, products]);

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
  }, [collectionProducts.length, updateScrollButtons]);

  const scrollProducts = (
    direction: "left" | "right",
  ) => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-lifestyle-product-card]",
      );

    if (!firstCard) {
      return;
    }

    const style = window.getComputedStyle(container);

    const gap =
      Number.parseFloat(
        style.columnGap || style.gap || "16",
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

  return (
    <section
      aria-labelledby={`${configuration.id}-title`}
      className="lifestyle-collection"
      style={
        {
          "--section-accent": configuration.accent,
          "--section-accent-dark":
            configuration.accentDark,
          "--section-soft-accent":
            configuration.softAccent,
          background: configuration.background,
        } as React.CSSProperties
      }
    >
      <header className="lifestyle-header">
        <div className="lifestyle-heading-content">
          <p
            className="lifestyle-eyebrow"
            style={{
              color: configuration.accent,
            }}
          >
            {configuration.eyebrow}
          </p>

          <h2
            id={`${configuration.id}-title`}
            className="lifestyle-title"
            style={{
              color: configuration.accentDark,
            }}
          >
            {configuration.title}
          </h2>

          <p className="lifestyle-description">
            {configuration.description}
          </p>
        </div>

        <Link
          href={configuration.href}
          className="lifestyle-see-all"
        >
          <span>See all</span>

          <ChevronRight
            size={18}
            strokeWidth={1.8}
          />
        </Link>
      </header>

      <div className="lifestyle-slider">
        <ProductArrow
          direction="left"
          visible={canScrollLeft}
          onClick={() => scrollProducts("left")}
        />

        <div
          ref={scrollRef}
          className="lifestyle-scroll"
        >
          {loading &&
            Array.from({
              length: 6,
            }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}

          {!loading &&
            collectionProducts.map((product) => (
              <ProductCard
                key={product.uniqueId}
                product={product}
                added={cartItems.includes(
                  product.uniqueId,
                )}
                onToggleCart={() =>
                  onToggleCart(product.uniqueId)
                }
              />
            ))}

          {!loading &&
            collectionProducts.length === 0 && (
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

  const rating = Math.max(
    0,
    Math.min(
      5,
      Math.round(product.rating ?? 0),
    ),
  );

  const originalPrice =
    product.salePrice /
    (1 - product.discount / 100);

  return (
    <article
      data-lifestyle-product-card
      className="lifestyle-product-wrapper lifestyle-product-card"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="lifestyle-product-image-link"
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
            className="lifestyle-product-image"
          />
        ) : (
          <div className="lifestyle-image-fallback">
            <ImageOff
              size={20}
              strokeWidth={1.7}
            />

            <span>Image unavailable</span>
          </div>
        )}

        <span
          aria-hidden="true"
          className="lifestyle-product-overlay"
        />

        <span
          aria-hidden="true"
          className="lifestyle-product-shine"
        />

        <span
          className={[
            "lifestyle-product-discount",
            product.discount >= 18
              ? "is-highlighted"
              : "",
          ].join(" ")}
        >
          {product.discount}%
          <br />
          OFF
        </span>

        <span className="lifestyle-product-brand">
          {product.brand || product.category}
        </span>
      </Link>

      <div className="lifestyle-product-content">
        <DeliveryBadge />

        <Link
          href={product.href}
          className="lifestyle-product-name"
        >
          {product.title}
        </Link>

        <div className="lifestyle-rating">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <Star
              key={index}
              size={14}
              fill={
                index < rating
                  ? "#ffb400"
                  : "#dce3ea"
              }
              strokeWidth={0}
            />
          ))}

          <span className="lifestyle-review-count">
            ({product.reviewCount})
          </span>
        </div>

        <div className="lifestyle-price-row">
          <div>
            <p className="lifestyle-old-price">
              {product.currencySymbol}
              {formatPrice(originalPrice)}
            </p>

            <p className="lifestyle-sale-price">
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
              "lifestyle-add-button",
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
        "lifestyle-arrow",
        direction === "left"
          ? "lifestyle-arrow-left"
          : "lifestyle-arrow-right",
        visible ? "" : "is-hidden",
      ].join(" ")}
    >
      <Icon size={20} strokeWidth={1.8} />
    </button>
  );
}

function DeliveryBadge() {
  return (
    <div className="lifestyle-delivery">
      <span className="lifestyle-delivery-icon">
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
    href: `/product/${createSlug(product.title)}`,
    salePrice,
    originalPrice:
      salePrice / (1 - discount / 100),
    discount,
    reviewCount:
      product.rating !== null
        ? ((product.id * 31) % 180) + 1
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
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2);
}

function ProductSkeleton() {
  return (
    <div className="lifestyle-product-wrapper lifestyle-product-card">
      <div className="aspect-square animate-pulse bg-[#e8eeee]" />

      <div className="space-y-3 p-4">
        <div className="h-8 w-28 animate-pulse rounded bg-[#e8eeee]" />

        <div className="h-5 animate-pulse rounded bg-[#e8eeee]" />

        <div className="h-5 w-4/5 animate-pulse rounded bg-[#e8eeee]" />

        <div className="h-4 w-24 animate-pulse rounded bg-[#e8eeee]" />

        <div className="flex items-end justify-between pt-3">
          <div className="h-10 w-20 animate-pulse rounded bg-[#e8eeee]" />

          <div className="h-10 w-14 animate-pulse rounded bg-[#e8eeee]" />
        </div>
      </div>
    </div>
  );
}

function EmptyProducts() {
  return (
    <div className="lifestyle-empty">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="lifestyle-empty-title">
          No products available
        </p>

        <p className="lifestyle-empty-text">
          Products will appear here when available.
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
    <section className="flex min-h-[320px] items-center justify-center bg-[#f8fbfc] px-5 py-12 text-center">
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