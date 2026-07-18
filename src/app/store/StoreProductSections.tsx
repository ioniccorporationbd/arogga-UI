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
  id: string;
  slug: string;
  name: string;
  shortName: string;
  brand: { name: string };
  taxonomy: { subCategory: { name: string } | null; category: { name: string } };
  media: { featuredImage: { url: string; alt: string } };
  pricing: {
    currency: string;
    regularPrice: number;
    salePrice: number | null;
    discount: { percentage: number };
  };
  inventory: { availableQuantity: number };
  ratings: { average: number | null; count: number };
  shipping: { delivery: { estimatedMinimumDays: number; estimatedMaximumDays: number } };
};

type Product = {
  id: string;
  brand: string;
  title: string;
  category: string;
  image: string;
  rating: number | null;
  slug: string;
  href: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  reviewCount: number;
  currencySymbol: string;
  deliveryText: string;
};

type ProductSectionConfig = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  startIndex: number;
  productCount: number;
  background: string;
  headingColor: string;
  fixedDiscount?: number;
};

type ProductSectionProps = {
  config: ProductSectionConfig;
  products: Product[];
  loading: boolean;
  cartItems: string[];
  onToggleCart: (productId: string) => void;
};

const sectionConfigs: ProductSectionConfig[] = [
  {
    id: "all-products",
    title: "All Products",
    subtitle: "Explore every product from data.json",
    href: "/store",
    startIndex: 0,
    productCount: 9999,
    background:
      "linear-gradient(145deg, #ffffff 0%, #fbfefd 48%, #f4fbf9 100%)",
    headingColor: "#087b75",
  },
];



export default function StoreProductSections() {
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
            `Product data could not be loaded. Status: ${response.status}`,
          );
        }

        const json = (await response.json()) as unknown;

        if (!Array.isArray(json)) {
          throw new Error("data.json must contain a JSON array.");
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

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  const toggleCart = (productId: string) => {
    setCartItems((currentItems) => {
      if (currentItems.includes(productId)) {
        return currentItems.filter((id) => id !== productId);
      }

      return [...currentItems, productId];
    });
  };

  if (!loading && loadError) {
    return <ProductLoadError message={loadError} />;
  }

  return (
    <>
      <section
        aria-label="Store product collections"
        className="store-products-section"
      >
        <div
          aria-hidden="true"
          className="store-products-pattern"
        />

        <div
          aria-hidden="true"
          className="store-products-glow store-products-glow-left"
        />

        <div
          aria-hidden="true"
          className="store-products-glow store-products-glow-right"
        />

        <div className="store-products-container">
          {sectionConfigs.map((config) => (
            <ProductSliderSection
              key={config.id}
              config={config}
              products={products}
              loading={loading}
              cartItems={cartItems}
              onToggleCart={toggleCart}
            />
          ))}
        </div>
      </section>

      <style jsx global>{`
        .store-products-section {
          --store-text-20: 20px;
          --store-text-18: 18px;
          --store-text-16: 16px;
          --store-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 56px 0 64px;
          background:
            radial-gradient(
              circle at 4% 8%,
              rgba(213, 244, 237, 0.54),
              transparent 29%
            ),
            radial-gradient(
              circle at 96% 90%,
              rgba(255, 230, 183, 0.48),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #ffffff 0%,
              #fbfefd 52%,
              #fffdf9 100%
            );
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .store-products-pattern {
          position: absolute;
          inset: 0;
          z-index: -3;
          pointer-events: none;
          opacity: 0.23;
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
            rgba(0, 0, 0, 0.82),
            transparent 98%
          );
        }

        .store-products-glow {
          position: absolute;
          z-index: -2;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(110px);
          opacity: 0.48;
        }

        .store-products-glow-left {
          top: -100px;
          left: -240px;
          background: rgba(105, 213, 194, 0.48);
        }

        .store-products-glow-right {
          right: -240px;
          bottom: -120px;
          background: rgba(255, 190, 93, 0.42);
        }

        .store-products-container {
          position: relative;
          width: min(1440px, calc(100% - 48px));
          margin-inline: auto;
        }

        .store-product-row {
          position: relative;
          overflow: hidden;
          padding: 28px;
          border: 1px solid rgba(15, 23, 42, 0.07);
          border-radius: 22px;
          box-shadow:
            0 26px 60px -46px rgba(15, 23, 42, 0.42),
            inset 0 1px rgba(255, 255, 255, 0.88);
        }

        .store-product-row + .store-product-row {
          margin-top: 42px;
        }

        .store-product-row::before {
          position: absolute;
          top: -90px;
          right: -90px;
          width: 230px;
          height: 230px;
          border: 32px solid rgba(255, 255, 255, 0.46);
          border-radius: 50%;
          pointer-events: none;
          content: "";
        }

        .store-product-header {
          position: relative;
          z-index: 3;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: center;
          gap: 20px;
          margin-bottom: 22px;
        }

        .store-product-title-wrapper {
          min-width: 0;
        }

        .store-product-title {
          margin: 0;
          color: #101828;
          font-size: var(--store-text-20);
          font-weight: 850;
          line-height: 1.35;
          letter-spacing: -0.025em;
        }

        .store-product-subtitle {
          margin: 0;
          color: #475467;
          font-size: var(--store-text-13);
          font-weight: 650;
          line-height: 1.5;
          text-align: center;
        }

        .store-product-see-all {
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          justify-content: flex-end;
          gap: 7px;
          justify-self: end;
          color: #101828;
          font-size: var(--store-text-13);
          font-weight: 800;
          text-decoration: none;
          transition:
            color 250ms ease,
            transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .store-product-see-all:hover {
          color: #087b75;
          transform: translateX(3px);
        }

        .store-product-see-all svg {
          transition: transform 260ms ease;
        }

        .store-product-see-all:hover svg {
          transform: translateX(3px);
        }

        .store-product-slider {
          position: relative;
          z-index: 3;
        }

        .store-product-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          overflow-y: visible;
          padding: 8px 2px 18px;
          scroll-padding-inline: 8px;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-inline: contain;
          -webkit-overflow-scrolling: touch;
        }

        .store-product-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .store-product-card-wrapper {
          width: min(78vw, 250px);
          flex: 0 0 min(78vw, 250px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .store-product-card {
          display: flex;
          height: 100%;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #dfe4e8;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow:
            0 10px 30px -25px rgba(15, 23, 42, 0.46),
            0 2px 7px rgba(15, 23, 42, 0.03);
          transform: translateZ(0);
          transition:
            transform 430ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 350ms ease,
            box-shadow 430ms ease;
          will-change: transform;
        }

        .store-product-card:hover {
          border-color: #afd8d2;
          transform: translate3d(0, -7px, 0);
          box-shadow:
            0 32px 64px -35px rgba(8, 123, 117, 0.4),
            0 15px 32px -24px rgba(15, 23, 42, 0.32);
        }

        .store-product-image-link {
          position: relative;
          display: block;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fbfcfc 68%,
              #f1f5f4 100%
            );
        }

        .store-product-image {
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

        .store-product-card:hover .store-product-image {
          filter: saturate(1.04) contrast(1.02);
          transform: scale(1.065);
        }

        .store-product-image-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.16),
            transparent 48%,
            rgba(8, 123, 117, 0.035)
          );
        }

        .store-product-shine {
          position: absolute;
          inset: 0 auto 0 -85%;
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

        .store-product-card:hover .store-product-shine {
          left: 135%;
        }

        .store-product-discount {
          position: absolute;
          top: 0;
          left: 9px;
          z-index: 4;
          min-width: 37px;
          padding: 6px 7px;
          border-radius: 0 0 6px 6px;
          color: #ffffff;
          background: linear-gradient(
            180deg,
            #1677ef,
            #0755a5
          );
          box-shadow: 0 8px 16px -9px rgba(7, 85, 165, 0.85);
          font-size: var(--store-text-13);
          font-weight: 850;
          line-height: 1.05;
          text-align: center;
        }

        .store-product-discount.is-highlighted {
          background: linear-gradient(
            180deg,
            #f0526b,
            #d92745
          );
          box-shadow: 0 8px 16px -9px rgba(217, 39, 69, 0.82);
        }

        .store-product-brand {
          position: absolute;
          top: 10px;
          right: 10px;
          max-width: 110px;
          overflow: hidden;
          padding: 5px 8px;
          border: 1px solid rgba(255, 255, 255, 0.88);
          border-radius: 999px;
          color: #087b75;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 9px 20px -14px rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          font-size: var(--store-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .store-product-content {
          display: flex;
          min-height: 228px;
          flex: 1;
          flex-direction: column;
          padding: 13px;
        }

        .store-product-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 32px;
          align-items: center;
          gap: 7px;
          padding: 5px 8px;
          border-radius: 7px;
          color: #202939;
          background: #eff1f3;
          font-size: var(--store-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .store-product-delivery-icon {
          display: flex;
          width: 23px;
          height: 23px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffd63d;
          background: #172033;
        }

        .store-product-name {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 12px 0 0;
          color: #101828;
          font-size: var(--store-text-16);
          font-weight: 680;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .store-product-card:hover .store-product-name {
          color: #087b75;
        }

        .store-product-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 7px;
        }

        .store-product-review-count {
          margin-left: 6px;
          color: #667085;
          font-size: var(--store-text-13);
          line-height: 1.4;
        }

        .store-product-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 13px;
        }

        .store-product-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--store-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .store-product-sale-price {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(--store-text-18);
          font-weight: 850;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .store-product-add-button {
          display: inline-flex;
          min-width: 56px;
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
          font-size: var(--store-text-13);
          font-weight: 850;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .store-product-add-button:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow: 0 12px 24px -14px rgba(8, 123, 117, 0.7);
          transform: translateY(-2px);
        }

        .store-product-add-button.is-added {
          color: #ffffff;
          background: #087b75;
        }

        .store-product-arrow {
          position: absolute;
          top: 43%;
          z-index: 30;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid #d6dde1;
          border-radius: 50%;
          color: #087b75;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 10px 25px -12px rgba(15, 23, 42, 0.42);
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition:
            opacity 260ms ease,
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 250ms ease,
            background-color 250ms ease;
        }

        .store-product-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .store-product-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .store-product-arrow:hover {
          border-color: #087b75;
          background: #eef9f7;
        }

        .store-product-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .store-product-fallback {
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

        .store-product-fallback span {
          font-size: var(--store-text-13);
          font-weight: 700;
        }

        .store-product-empty {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #e0e5e8;
          border-radius: 16px;
          background: #ffffff;
          padding: 24px;
          text-align: center;
        }

        .store-product-empty-title {
          margin: 12px 0 0;
          color: #344054;
          font-size: var(--store-text-16);
          font-weight: 750;
        }

        .store-product-empty-text {
          margin: 6px 0 0;
          color: #667085;
          font-size: var(--store-text-13);
          line-height: 1.6;
        }

        .store-product-error {
          display: flex;
          min-height: 320px;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          background: #ffffff;
          text-align: center;
        }

        .store-product-error-title {
          margin: 13px 0 0;
          color: #b42318;
          font-size: 16px;
          font-weight: 800;
        }

        .store-product-error-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.6;
        }

        .store-product-retry {
          min-height: 42px;
          margin-top: 15px;
          padding-inline: 18px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        @media (min-width: 1280px) {
          .store-product-card-wrapper {
            width: calc((100% - 80px) / 6);
            flex-basis: calc((100% - 80px) / 6);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .store-products-section {
            padding: 52px 0 58px;
          }

          .store-products-container {
            width: min(1180px, calc(100% - 40px));
          }

          .store-product-row {
            padding: 25px;
          }

          .store-product-card-wrapper {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .store-products-section {
            padding: 48px 0 54px;
          }

          .store-products-container {
            width: calc(100% - 32px);
          }

          .store-product-row {
            padding: 22px;
          }

          .store-product-card-wrapper {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }

          .store-product-header {
            grid-template-columns: minmax(0, 1fr) auto;
          }

          .store-product-subtitle {
            display: none;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .store-products-section {
            padding: 44px 0 50px;
          }

          .store-products-container {
            width: calc(100% - 24px);
          }

          .store-product-row {
            padding: 20px;
          }

          .store-product-card-wrapper {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .store-product-header {
            grid-template-columns: minmax(0, 1fr) auto;
          }

          .store-product-subtitle {
            display: none;
          }

          .store-product-arrow {
            display: none;
          }
        }

        @media (max-width: 639px) {
          .store-products-section {
            padding: 38px 0 44px;
          }

          .store-products-container {
            width: 100%;
          }

          .store-product-row {
            padding: 20px 0;
            border-right: 0;
            border-left: 0;
            border-radius: 0;
          }

          .store-product-row + .store-product-row {
            margin-top: 32px;
          }

          .store-product-header {
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 12px;
            margin-bottom: 15px;
            padding-inline: 14px;
          }

          .store-product-subtitle {
            display: none;
          }

          .store-product-scroll {
            gap: 12px;
            padding: 8px 14px 18px;
            scroll-padding-inline: 14px;
          }

          .store-product-card-wrapper {
            width: min(80vw, 255px);
            flex-basis: min(80vw, 255px);
          }

          .store-product-arrow {
            display: none;
          }

          .store-product-content {
            min-height: 220px;
            padding: 12px;
          }

          .store-product-image {
            padding: 12px;
          }
        }

        @media (max-width: 380px) {
          .store-product-header {
            padding-inline: 11px;
          }

          .store-product-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .store-product-card-wrapper {
            width: calc(100vw - 36px);
            flex-basis: calc(100vw - 36px);
          }
        }

        @media (hover: none) {
          .store-product-card:hover,
          .store-product-card:hover .store-product-image,
          .store-product-add-button:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .store-products-section *,
          .store-products-section *::before,
          .store-products-section *::after {
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

function ProductSliderSection({
  config,
  products,
  loading,
  cartItems,
  onToggleCart,
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sectionProducts = useMemo(() => {
    if (products.length === 0) {
      return [];
    }

    const selectedProducts: Product[] = [];

    for (
      let index = 0;
      index < Math.min(config.productCount, products.length);
      index += 1
    ) {
      const product =
        products[(config.startIndex + index) % products.length];

      selectedProducts.push(
        typeof config.fixedDiscount === "number"
          ? applyFixedDiscount(product, config.fixedDiscount)
          : product,
      );
    }

    return selectedProducts;
  }, [config, products]);

  const updateScrollButtons = useCallback(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const maximumScroll =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 4);

    setCanScrollRight(
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
  }, [sectionProducts.length, updateScrollButtons]);

  const scrollProducts = (
    direction: "left" | "right",
  ) => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-store-product-card]",
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

    container.scrollBy({
      left:
        direction === "right"
          ? (cardWidth + gap) * visibleCount
          : -(cardWidth + gap) * visibleCount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="store-product-row"
      style={{
        background: config.background,
      }}
      aria-labelledby={`${config.id}-title`}
    >
      <header className="store-product-header">
        <div className="store-product-title-wrapper">
          <h2
            id={`${config.id}-title`}
            className="store-product-title"
            style={{
              color: config.headingColor,
            }}
          >
            {config.title}
          </h2>
        </div>

        {config.subtitle ? (
          <p className="store-product-subtitle">
            {config.subtitle}
          </p>
        ) : (
          <span />
        )}

        <Link
          href={config.href}
          className="store-product-see-all"
        >
          <span>See all</span>
          <ChevronRight size={17} strokeWidth={1.8} />
        </Link>
      </header>

      <div className="store-product-slider">
        <ProductArrow
          direction="left"
          visible={canScrollLeft}
          onClick={() => scrollProducts("left")}
        />

        <div
          ref={scrollRef}
          className="store-product-scroll"
        >
          {loading &&
            Array.from({
              length: 6,
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

  const roundedRating = Math.round(product.rating ?? 0);

  return (
    <article
      data-store-product-card
      className="store-product-card-wrapper store-product-card"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="store-product-image-link"
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
            className="store-product-image"
          />
        ) : (
          <div className="store-product-fallback">
            <ImageOff size={20} strokeWidth={1.7} />
            <span>Image unavailable</span>
          </div>
        )}

        <span
          aria-hidden="true"
          className="store-product-image-overlay"
        />

        <span
          aria-hidden="true"
          className="store-product-shine"
        />

        {product.discount > 0 && <DiscountBadge discount={product.discount} />}

        <span className="store-product-brand">
          {product.brand || "Product"}
        </span>
      </Link>

      <div className="store-product-content">
        <DeliveryBadge text={product.deliveryText} />

        <Link
          href={product.href}
          className="store-product-name"
        >
          {product.title}
        </Link>

        <div className="store-product-rating">
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

          <span className="store-product-review-count">
            ({product.reviewCount})
          </span>
        </div>

        <div className="store-product-price-row">
          <div>
            <p className="store-product-old-price">
              {product.currencySymbol}
              {formatPrice(product.originalPrice)}
            </p>

            <p className="store-product-sale-price">
              {product.currencySymbol}
              {formatPrice(product.salePrice)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onToggleCart();
              const current = JSON.parse(localStorage.getItem("arogga-cart") || "[]") as Array<{ id: string; quantity: number }>;
              const exists = current.find((item) => item.id === product.id);
              const next = exists
                ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
                : [...current, { id: product.id, slug: product.slug, name: product.title, image: product.image, price: product.salePrice, quantity: 1 }];
              localStorage.setItem("arogga-cart", JSON.stringify(next));
              window.location.href = product.href;
            }}
            aria-label={
              added
                ? `Remove ${product.title} from cart`
                : `Add ${product.title} to cart`
            }
            className={[
              "store-product-add-button",
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
        "store-product-arrow",
        direction === "left"
          ? "store-product-arrow-left"
          : "store-product-arrow-right",
        visible ? "" : "is-hidden",
      ].join(" ")}
    >
      <Icon size={20} strokeWidth={1.8} />
    </button>
  );
}

function DeliveryBadge({ text }: { text: string }) {
  return (
    <div className="store-product-delivery">
      <span className="store-product-delivery-icon">
        <Rocket
          size={13}
          fill="currentColor"
          strokeWidth={0}
        />
      </span>

      {text}
    </div>
  );
}

function DiscountBadge({
  discount,
}: {
  discount: number;
}) {
  return (
    <span
      className={[
        "store-product-discount",
        discount >= 30 ? "is-highlighted" : "",
      ].join(" ")}
    >
      {discount}%
      <br />
      OFF
    </span>
  );
}

function normalizeProduct(
  product: JsonProduct,
  _index: number,
): Product {
  const salePrice = Number(product.pricing.salePrice ?? product.pricing.regularPrice);
  const discount = Math.max(0, Math.round(product.pricing.discount?.percentage ?? 0));
  const originalPrice = Number(product.pricing.regularPrice);

  return {
    id: product.id,
    brand: product.brand.name,
    title: product.name,
    category: product.taxonomy.subCategory?.name ?? product.taxonomy.category.name,
    image: product.media.featuredImage.url,
    rating: product.ratings.average,
    slug: product.slug,
    href: `/products/${product.slug}`,
    salePrice,
    originalPrice,
    discount,
    reviewCount: product.ratings.count,
    currencySymbol: getCurrencySymbol(product.pricing.currency),
    deliveryText: `${product.shipping.delivery.estimatedMinimumDays}-${product.shipping.delivery.estimatedMaximumDays} DAYS`,
  };
}

function applyFixedDiscount(
  product: Product,
  discount: number,
): Product {
  return {
    ...product,
    discount,
    originalPrice: Number(
      (
        product.salePrice /
        (1 - discount / 100)
      ).toFixed(2),
    ),
  };
}

function isValidProduct(value: unknown): value is JsonProduct {
  if (typeof value !== "object" || value === null) return false;
  const product = value as Partial<JsonProduct>;
  return (
    typeof product.id === "string" &&
    typeof product.slug === "string" &&
    typeof product.name === "string" &&
    typeof product.brand?.name === "string" &&
    typeof product.media?.featuredImage?.url === "string" &&
    typeof product.pricing?.regularPrice === "number" &&
    typeof product.pricing?.currency === "string" &&
    (typeof product.ratings?.average === "number" || product.ratings?.average === null)
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
    <div className="store-product-card-wrapper store-product-card">
      <div className="aspect-square animate-pulse bg-[#eef0f2]" />

      <div className="space-y-3 p-4">
        <div className="h-8 w-28 animate-pulse rounded bg-[#eef0f2]" />

        <div className="h-5 animate-pulse rounded bg-[#eef0f2]" />

        <div className="h-5 w-4/5 animate-pulse rounded bg-[#eef0f2]" />

        <div className="h-4 w-24 animate-pulse rounded bg-[#eef0f2]" />

        <div className="flex items-end justify-between pt-3">
          <div className="h-10 w-20 animate-pulse rounded bg-[#eef0f2]" />

          <div className="h-10 w-14 animate-pulse rounded bg-[#eef0f2]" />
        </div>
      </div>
    </div>
  );
}

function EmptyProducts() {
  return (
    <div className="store-product-empty">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="store-product-empty-title">
          No products available
        </p>

        <p className="store-product-empty-text">
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
    <>
      <section className="store-product-error">
        <div>
          <ShoppingCart
            size={36}
            className="mx-auto text-[#d92d20]"
          />

          <p className="store-product-error-title">
            Product data could not be loaded
          </p>

          <p className="store-product-error-message">
            {message}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="store-product-retry"
          >
            Try Again
          </button>
        </div>
      </section>

      <style jsx global>{`
        .store-product-error {
          display: flex;
          min-height: 320px;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          background: #ffffff;
          text-align: center;
        }

        .store-product-error-title {
          margin: 13px 0 0;
          color: #b42318;
          font-size: 16px;
          font-weight: 800;
        }

        .store-product-error-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.6;
        }

        .store-product-retry {
          min-height: 42px;
          margin-top: 15px;
          padding-inline: 18px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}