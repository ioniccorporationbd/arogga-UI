"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
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
  reviewCount: number;
  deliveryTime: string;
  inStock: boolean;
};

type DealSectionConfig = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  background: string;
  headingColor: string;
  startIndex: number;
  productCount: number;
  preferredBrand?: string;
};

const PRODUCTS_PER_VIEW = 6;

const dealSections: DealSectionConfig[] = [
  {
    id: "all-in-one-care",
    title: "All-in-One Care Deals",
    subtitle:
      "Discover everyday healthcare and wellness products at better prices.",
    href: "/offers/all-in-one-care",
    background:
      "linear-gradient(135deg, #f8fdea 0%, #f4fae7 52%, #eef8da 100%)",
    headingColor: "#5e9e00",
    startIndex: 0,
    productCount: 18,
  },
  {
    id: "himalaya-savings",
    title: "Himalaya: Natural Savings You Can’t Miss",
    subtitle:
      "Explore trusted herbal and wellness products from Himalaya.",
    href: "/offers/himalaya",
    background:
      "linear-gradient(135deg, #fffdf6 0%, #fff9ec 52%, #fff3d8 100%)",
    headingColor: "#c8890f",
    startIndex: 18,
    productCount: 18,
    preferredBrand: "Himalaya",
  },
];

const discountOptions = [
  5, 8, 10, 12, 15, 18, 20, 25, 28, 30, 34, 37, 40, 50,
];

export default function MultiDealSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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

  const toggleCartItem = (productId: number) => {
    setCartItems((currentItems) => {
      if (currentItems.includes(productId)) {
        return currentItems.filter(
          (currentId) => currentId !== productId,
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
      <section className="multi-deal-sections">
        {dealSections.map((section) => (
          <DealRow
            key={section.id}
            config={section}
            products={products}
            loading={loading}
            cartItems={cartItems}
            onToggleCart={toggleCartItem}
          />
        ))}
      </section>

      <style jsx global>{`
        .multi-deal-sections {
          --multi-text-20: 20px;
          --multi-text-18: 18px;
          --multi-text-16: 16px;
          --multi-text-13: 13px;

          width: 100%;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .multi-deal-row {
          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 64px 0;
        }

        .multi-deal-background-pattern {
          position: absolute;
          inset: 0;
          z-index: -4;
          pointer-events: none;
          opacity: 0.25;
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
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.7),
            transparent 95%
          );
        }

        .multi-deal-glow {
          position: absolute;
          z-index: -3;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(90px);
          opacity: 0.48;
          will-change: transform;
        }

        .multi-deal-glow-left {
          top: 20px;
          left: -190px;
          background: rgba(255, 255, 255, 0.9);
          animation: multiDealGlowLeft 10s ease-in-out infinite;
        }

        .multi-deal-glow-right {
          right: -190px;
          bottom: -100px;
          background: rgba(255, 255, 255, 0.86);
          animation: multiDealGlowRight 12s ease-in-out infinite;
        }

        .multi-deal-container {
          position: relative;
          width: min(1440px, calc(100% - 64px));
          margin-inline: auto;
        }

        .multi-deal-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 28px;
        }

        .multi-deal-heading-group {
          min-width: 0;
          max-width: 760px;
        }

        .multi-deal-title {
          margin: 0;
          font-size: var(--multi-text-20);
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .multi-deal-subtitle {
          max-width: 680px;
          margin: 8px 0 0;
          color: #667085;
          font-size: var(--multi-text-13);
          line-height: 1.65;
        }

        .multi-deal-see-all {
          display: inline-flex;
          min-height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding-inline: 6px;
          border-radius: 999px;
          font-size: var(--multi-text-13);
          font-weight: 800;
          line-height: 1;
          text-decoration: none;
          transition:
            opacity 250ms ease,
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .multi-deal-see-all:hover {
          opacity: 0.75;
          transform: translateY(-2px);
        }

        .multi-deal-see-all svg {
          transition: transform 280ms ease;
        }

        .multi-deal-see-all:hover svg {
          transform: translateX(4px);
        }

        .multi-deal-slider {
          position: relative;
        }

        .multi-deal-scroll {
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

        .multi-deal-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .multi-deal-product-card {
          width: min(78vw, 260px);
          flex: 0 0 min(78vw, 260px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .multi-deal-card {
          display: flex;
          height: 100%;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #dfe4e8;
          border-radius: 15px;
          background: #ffffff;
          box-shadow:
            0 10px 28px -23px rgba(15, 23, 42, 0.48),
            0 2px 7px rgba(15, 23, 42, 0.03);
          transform: translateZ(0);
          transition:
            transform 430ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 350ms ease,
            box-shadow 430ms ease;
          will-change: transform;
          backface-visibility: hidden;
        }

        .multi-deal-card:hover {
          border-color: #b7d9d4;
          transform: translate3d(0, -7px, 0);
          box-shadow:
            0 30px 58px -32px rgba(8, 123, 117, 0.4),
            0 15px 32px -24px rgba(15, 23, 42, 0.34);
        }

        .multi-deal-image-link {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fafcfb 70%,
              #f4f7f6 100%
            );
        }

        .multi-deal-product-image {
          width: 100%;
          height: 100%;
          padding: 15px;
          object-fit: contain;
          transform: scale(1.001);
          transition:
            transform 650ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 500ms ease;
          will-change: transform;
        }

        .multi-deal-card:hover .multi-deal-product-image {
          transform: scale(1.055);
          filter: saturate(1.04) contrast(1.02);
        }

        .multi-deal-image-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.14),
            transparent 48%,
            rgba(15, 23, 42, 0.035)
          );
        }

        .multi-deal-image-shine {
          position: absolute;
          inset: 0 auto 0 -85%;
          width: 42%;
          pointer-events: none;
          transform: rotate(18deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.48),
            transparent
          );
          transition: left 760ms ease;
        }

        .multi-deal-card:hover .multi-deal-image-shine {
          left: 135%;
        }

        .multi-deal-discount {
          position: absolute;
          top: 0;
          left: 9px;
          padding: 6px 8px;
          border-radius: 0 0 6px 6px;
          color: #ffffff;
          background: linear-gradient(180deg, #1578f3, #075fd1);
          box-shadow: 0 7px 15px -8px rgba(9, 105, 232, 0.85);
          font-size: var(--multi-text-13);
          font-weight: 800;
          line-height: 1.05;
          text-align: center;
        }

        .multi-deal-brand {
          position: absolute;
          top: 10px;
          right: 10px;
          max-width: 120px;
          overflow: hidden;
          padding: 6px 9px;
          border: 1px solid rgba(255, 255, 255, 0.85);
          border-radius: 999px;
          color: #087b75;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 9px 20px -14px rgba(15, 23, 42, 0.48);
          backdrop-filter: blur(10px);
          font-size: var(--multi-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .multi-deal-content {
          display: flex;
          min-height: 235px;
          flex: 1;
          flex-direction: column;
          padding: 14px;
        }

        .multi-deal-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 34px;
          align-items: center;
          gap: 8px;
          padding: 5px 9px;
          border-radius: 7px;
          color: #202939;
          background: #f0f1f3;
          font-size: var(--multi-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .multi-deal-delivery-icon {
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

        .multi-deal-product-title {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 13px 0 0;
          color: #101828;
          font-size: var(--multi-text-16);
          font-weight: 650;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .multi-deal-card:hover .multi-deal-product-title {
          color: #087b75;
        }

        .multi-deal-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 8px;
        }

        .multi-deal-rating-text {
          margin-left: 6px;
          color: #667085;
          font-size: var(--multi-text-13);
          line-height: 1.4;
        }

        .multi-deal-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 15px;
        }

        .multi-deal-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--multi-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .multi-deal-sale-price {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(--multi-text-18);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .multi-deal-add-button {
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
          font-size: var(--multi-text-13);
          font-weight: 800;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .multi-deal-add-button:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow: 0 12px 24px -14px rgba(8, 123, 117, 0.7);
          transform: translateY(-2px);
        }

        .multi-deal-add-button:active {
          transform: scale(0.97);
        }

        .multi-deal-add-button.is-added {
          color: #ffffff;
          background: #087b75;
        }

        .multi-deal-add-button:disabled {
          border-color: #d0d5dd;
          color: #98a2b3;
          background: #f2f4f7;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .multi-deal-arrow {
          position: absolute;
          top: 43%;
          z-index: 30;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid #d7dde1;
          border-radius: 50%;
          color: #087b75;
          background: rgba(255, 255, 255, 0.96);
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

        .multi-deal-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .multi-deal-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .multi-deal-arrow:hover {
          border-color: #087b75;
          background: #eef9f7;
          box-shadow: 0 14px 28px -14px rgba(8, 123, 117, 0.45);
        }

        .multi-deal-arrow-left:hover {
          transform: translate(-50%, -50%) scale(1.07);
        }

        .multi-deal-arrow-right:hover {
          transform: translate(50%, -50%) scale(1.07);
        }

        .multi-deal-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .multi-deal-state {
          display: flex;
          min-height: 340px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #e0e5e8;
          border-radius: 18px;
          background: #ffffff;
          padding: 24px;
          text-align: center;
        }

        .multi-deal-state-title {
          margin: 13px 0 0;
          color: #344054;
          font-size: var(--multi-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .multi-deal-state-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--multi-text-13);
          line-height: 1.6;
        }

        .multi-deal-error {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 56px 24px;
          background: #fff7f7;
          text-align: center;
        }

        .multi-deal-error-title {
          margin: 14px 0 0;
          color: #b42318;
          font-size: var(--multi-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .multi-deal-retry-button {
          min-height: 42px;
          margin-top: 15px;
          padding-inline: 18px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: var(--multi-text-13);
          font-weight: 750;
          cursor: pointer;
          transition:
            background-color 250ms ease,
            transform 250ms ease;
        }

        .multi-deal-retry-button:hover {
          background: #066b66;
          transform: translateY(-2px);
        }

        @keyframes multiDealGlowLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(30px, -20px, 0) scale(1.08);
          }
        }

        @keyframes multiDealGlowRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-28px, -18px, 0) scale(1.07);
          }
        }

        @media (min-width: 1280px) {
          .multi-deal-product-card {
            width: calc((100% - 80px) / 6);
            flex-basis: calc((100% - 80px) / 6);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .multi-deal-row {
            padding: 58px 0;
          }

          .multi-deal-container {
            width: min(980px, calc(100% - 48px));
          }

          .multi-deal-product-card {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .multi-deal-row {
            padding: 54px 0;
          }

          .multi-deal-container {
            width: min(760px, calc(100% - 40px));
          }

          .multi-deal-product-card {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }

          .multi-deal-arrow {
            width: 40px;
            height: 40px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .multi-deal-row {
            padding: 50px 0;
          }

          .multi-deal-container {
            width: calc(100% - 32px);
          }

          .multi-deal-product-card {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .multi-deal-arrow {
            display: none;
          }
        }

        @media (max-width: 639px) {
          .multi-deal-row {
            padding: 44px 0 48px;
          }

          .multi-deal-container {
            width: 100%;
          }

          .multi-deal-header {
            align-items: flex-start;
            gap: 14px;
            margin-bottom: 18px;
            padding-inline: 14px;
          }

          .multi-deal-heading-group {
            max-width: 250px;
          }

          .multi-deal-title {
            max-width: 250px;
          }

          .multi-deal-subtitle {
            margin-top: 6px;
          }

          .multi-deal-see-all {
            min-height: 40px;
            padding-inline: 2px;
          }

          .multi-deal-scroll {
            gap: 12px;
            padding: 10px 14px 20px;
            scroll-padding-inline: 14px;
          }

          .multi-deal-product-card {
            width: min(82vw, 268px);
            flex-basis: min(82vw, 268px);
          }

          .multi-deal-arrow {
            display: none;
          }

          .multi-deal-content {
            min-height: 225px;
            padding: 13px;
          }

          .multi-deal-product-image {
            padding: 12px;
          }
        }

        @media (max-width: 380px) {
          .multi-deal-header {
            padding-inline: 11px;
          }

          .multi-deal-heading-group,
          .multi-deal-title {
            max-width: 220px;
          }

          .multi-deal-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .multi-deal-product-card {
            width: calc(100vw - 36px);
            flex-basis: calc(100vw - 36px);
          }

          .multi-deal-brand {
            max-width: 90px;
          }
        }

        @media (hover: none) {
          .multi-deal-card:hover,
          .multi-deal-card:hover .multi-deal-product-image,
          .multi-deal-add-button:hover,
          .multi-deal-see-all:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .multi-deal-sections *,
          .multi-deal-sections *::before,
          .multi-deal-sections *::after {
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

function DealRow({
  config,
  products,
  loading,
  cartItems,
  onToggleCart,
}: {
  config: DealSectionConfig;
  products: Product[];
  loading: boolean;
  cartItems: number[];
  onToggleCart: (productId: number) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sectionProducts = useMemo(() => {
    const inStockProducts = products.filter(
      (product) => product.inStock,
    );

    if (config.preferredBrand) {
      const matchingBrandProducts = inStockProducts.filter(
        (product) =>
          product.brand
            .toLowerCase()
            .includes(config.preferredBrand!.toLowerCase()),
      );

      if (matchingBrandProducts.length >= PRODUCTS_PER_VIEW) {
        return matchingBrandProducts.slice(
          0,
          config.productCount,
        );
      }
    }

    const selectedProducts = inStockProducts.slice(
      config.startIndex,
      config.startIndex + config.productCount,
    );

    if (selectedProducts.length >= PRODUCTS_PER_VIEW) {
      return selectedProducts;
    }

    return createLoopedProducts(
      inStockProducts,
      config.startIndex,
      config.productCount,
    );
  }, [config, products]);

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

    container.addEventListener(
      "scroll",
      updateScrollButtons,
      {
        passive: true,
      },
    );

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(
        updateScrollButtons,
      );

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
        "[data-multi-deal-product-card]",
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

    const amount = (cardWidth + gap) * visibleCount;

    container.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="multi-deal-row"
      style={{
        background: config.background,
      }}
      aria-labelledby={`${config.id}-title`}
    >
      <div
        aria-hidden="true"
        className="multi-deal-background-pattern"
      />

      <div
        aria-hidden="true"
        className="multi-deal-glow multi-deal-glow-left"
      />

      <div
        aria-hidden="true"
        className="multi-deal-glow multi-deal-glow-right"
      />

      <div className="multi-deal-container">
        <header className="multi-deal-header">
          <div className="multi-deal-heading-group">
            <h2
              id={`${config.id}-title`}
              className="multi-deal-title"
              style={{
                color: config.headingColor,
              }}
            >
              {config.title}
            </h2>

            <p className="multi-deal-subtitle">
              {config.subtitle}
            </p>
          </div>

          <Link
            href={config.href}
            className="multi-deal-see-all"
            style={{
              color: config.headingColor,
            }}
          >
            <span>See all</span>
            <ChevronRight size={16} />
          </Link>
        </header>

        <div className="multi-deal-slider">
          <button
            type="button"
            onClick={() => scrollProducts("left")}
            disabled={!canScrollLeft}
            aria-label={`Show previous products from ${config.title}`}
            className={`multi-deal-arrow multi-deal-arrow-left ${
              canScrollLeft ? "" : "is-hidden"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={scrollContainerRef}
            className="multi-deal-scroll"
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
                  key={`${config.id}-${product.id}`}
                  product={product}
                  added={cartItems.includes(product.id)}
                  onToggleCart={() =>
                    onToggleCart(product.id)
                  }
                />
              ))}

            {!loading &&
              sectionProducts.length === 0 && (
                <EmptyState />
              )}
          </div>

          <button
            type="button"
            onClick={() => scrollProducts("right")}
            disabled={!canScrollRight}
            aria-label={`Show more products from ${config.title}`}
            className={`multi-deal-arrow multi-deal-arrow-right ${
              canScrollRight ? "" : "is-hidden"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
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
  const roundedRating = Math.round(
    product.rating ?? 0,
  );

  return (
    <article
      data-multi-deal-product-card
      className="multi-deal-product-card multi-deal-card"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="multi-deal-image-link"
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
          className="multi-deal-product-image"
        />

        <div
          aria-hidden="true"
          className="multi-deal-image-overlay"
        />

        <div
          aria-hidden="true"
          className="multi-deal-image-shine"
        />

        <span className="multi-deal-discount">
          {product.discountPercent}%
          <br />
          OFF
        </span>

        <span className="multi-deal-brand">
          {product.brand}
        </span>
      </Link>

      <div className="multi-deal-content">
        <div className="multi-deal-delivery">
          <span className="multi-deal-delivery-icon">
            <Rocket
              size={13}
              fill="currentColor"
              strokeWidth={0}
            />
          </span>

          {product.deliveryTime}
        </div>

        <Link
          href={product.href}
          className="multi-deal-product-title"
        >
          {product.title}
        </Link>

        <div className="multi-deal-rating">
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

          <span className="multi-deal-rating-text">
            ({product.rating !== null ? product.reviewCount : 0})
          </span>
        </div>

        <div className="multi-deal-price-row">
          <div>
            <p className="multi-deal-old-price">
              {product.currencySymbol}
              {formatPrice(product.originalPrice)}
            </p>

            <p className="multi-deal-sale-price">
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
            className={`multi-deal-add-button ${
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
        ? ((product.id * 17) % 190) + 1
        : 0,
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

function createLoopedProducts(
  products: Product[],
  startIndex: number,
  count: number,
) {
  if (products.length === 0) {
    return [];
  }

  const result: Product[] = [];
  const maximum = Math.min(count, products.length);

  for (
    let index = 0;
    index < maximum;
    index += 1
  ) {
    result.push(
      products[
        (startIndex + index) % products.length
      ],
    );
  }

  return result;
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

function formatPrice(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2);
}

function ProductSkeleton() {
  return (
    <div className="multi-deal-product-card multi-deal-card">
      <div className="aspect-square animate-pulse bg-[#f0f2f4]" />

      <div className="space-y-3 p-4">
        <div className="h-9 w-28 animate-pulse rounded bg-[#eef0f2]" />

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
    <section className="multi-deal-error">
      <div>
        <ShoppingCart
          size={36}
          className="mx-auto text-[#d92d20]"
        />

        <p className="multi-deal-error-title">
          Product data could not be loaded
        </p>

        <p className="multi-deal-state-message">
          {message}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="multi-deal-retry-button"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="multi-deal-state">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="multi-deal-state-title">
          No products available
        </p>

        <p className="multi-deal-state-message">
          Products will appear here when they become available.
        </p>
      </div>
    </div>
  );
}