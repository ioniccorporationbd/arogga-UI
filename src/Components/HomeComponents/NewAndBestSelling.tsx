"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Rocket,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
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

  createdAt?: string;
  isNew?: boolean;
  isBestSelling?: boolean;
  salesCount?: number;
  reviewCount?: number;
  discountPercent?: number;
  originalPrice?: number;
  inStock?: boolean;
};

type Product = JsonProduct & {
  slug: string;
  href: string;
  salePrice: number;
  displayOriginalPrice: number;
  displayDiscount: number;
  currencySymbol: string;
  displayReviewCount: number;
  deliveryTime: string;
  available: boolean;
};

type ProductSectionConfig = {
  id: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  href: string;
  type: "new" | "best-selling";
  fallbackStart: number;
  maxProducts: number;
  fixedDiscount?: number;
  icon: ReactNode;
  accent: string;
  softAccent: string;
  background: string;
};

type ProductSliderSectionProps = {
  config: ProductSectionConfig;
  allProducts: Product[];
  loading: boolean;
  cartItems: number[];
  onToggleCart: (productId: number) => void;
};

const PRODUCTS_PER_VIEW = 6;
const PRODUCTS_PER_SECTION = 20;

const fallbackDiscounts = [
  1, 2, 1, 1, 1, 1, 3, 5, 8, 10, 12, 15, 18, 20,
];

const sectionConfigs: ProductSectionConfig[] = [
  {
    id: "newly-launched",
    title: "Newly Launched Items",
    subtitle:
      "Explore the latest products recently added to our collection.",
    eyebrow: "Fresh arrivals",
    href: "/new-arrivals",
    type: "new",
    fallbackStart: 0,
    maxProducts: PRODUCTS_PER_SECTION,
    icon: <Sparkles size={20} />,
    accent: "#087b75",
    softAccent: "#eef9f7",
    background:
      "linear-gradient(135deg, #f7fffd 0%, #ffffff 52%, #eefaf7 100%)",
  },
  {
    id: "best-selling",
    title: "Best Selling Products",
    subtitle:
      "Shop popular products trusted and frequently purchased by customers.",
    eyebrow: "Customer favourites",
    href: "/best-selling",
    type: "best-selling",
    fallbackStart: 20,
    maxProducts: PRODUCTS_PER_SECTION,
    fixedDiscount: 10,
    icon: <TrendingUp size={20} />,
    accent: "#b87817",
    softAccent: "#fff8eb",
    background:
      "linear-gradient(135deg, #fffaf2 0%, #ffffff 52%, #fff6e6 100%)",
  },
];

export default function NewAndBestSelling() {
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
      <section
        className="new-best-section"
        aria-label="New and best selling products"
      >
        <div
          aria-hidden="true"
          className="new-best-page-pattern"
        />

        <div
          aria-hidden="true"
          className="new-best-page-glow new-best-page-glow-left"
        />

        <div
          aria-hidden="true"
          className="new-best-page-glow new-best-page-glow-right"
        />

        <div className="new-best-container">
          {sectionConfigs.map((config) => (
            <ProductSliderSection
              key={config.id}
              config={config}
              allProducts={products}
              loading={loading}
              cartItems={cartItems}
              onToggleCart={toggleCartItem}
            />
          ))}
        </div>
      </section>

      <style jsx global>{`
        .new-best-section {
          --new-best-text-20: 20px;
          --new-best-text-18: 18px;
          --new-best-text-16: 16px;
          --new-best-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 64px 0;
          background:
            radial-gradient(
              circle at 4% 6%,
              rgba(214, 244, 237, 0.54),
              transparent 29%
            ),
            radial-gradient(
              circle at 96% 94%,
              rgba(255, 230, 188, 0.58),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #ffffff 0%,
              #fbfefd 50%,
              #fffdf9 100%
            );
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .new-best-page-pattern {
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
            rgba(0, 0, 0, 0.78),
            transparent 98%
          );
        }

        .new-best-page-glow {
          position: absolute;
          z-index: -3;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(110px);
          opacity: 0.54;
          will-change: transform;
        }

        .new-best-page-glow-left {
          top: 0;
          left: -230px;
          background: rgba(151, 225, 211, 0.52);
          animation: newBestGlowLeft 12s ease-in-out infinite;
        }

        .new-best-page-glow-right {
          right: -230px;
          bottom: -100px;
          background: rgba(255, 210, 141, 0.5);
          animation: newBestGlowRight 14s ease-in-out infinite;
        }

        .new-best-container {
          position: relative;
          width: min(1440px, calc(100% - 64px));
          margin-inline: auto;
        }

        .new-best-container > section + section {
          margin-top: 64px;
          padding-top: 60px;
          border-top: 1px solid rgba(15, 23, 42, 0.07);
        }

        .new-best-row {
          position: relative;
          padding: 30px;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 24px;
          box-shadow:
            0 24px 54px -44px rgba(15, 23, 42, 0.3),
            inset 0 1px rgba(255, 255, 255, 0.88);
        }

        .new-best-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end;
          gap: 30px;
          margin-bottom: 28px;
        }

        .new-best-heading-group {
          display: flex;
          min-width: 0;
          max-width: 800px;
          align-items: flex-start;
          gap: 14px;
        }

        .new-best-heading-content {
          min-width: 0;
        }

        .new-best-heading-icon {
          display: flex;
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 14px;
          box-shadow:
            0 12px 28px -20px rgba(15, 23, 42, 0.36),
            inset 0 1px rgba(255, 255, 255, 0.92);
          transition:
            transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 350ms ease;
        }

        .new-best-row:hover .new-best-heading-icon {
          transform: rotate(-5deg) scale(1.06);
          box-shadow:
            0 18px 36px -20px rgba(15, 23, 42, 0.4),
            inset 0 1px rgba(255, 255, 255, 0.98);
        }

        .new-best-eyebrow {
          margin: 0;
          font-size: var(--new-best-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .new-best-title {
          margin: 7px 0 0;
          color: #101828;
          font-size: var(--new-best-text-20);
          font-weight: 850;
          line-height: 1.3;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .new-best-subtitle {
          max-width: 680px;
          margin: 8px 0 0;
          color: #667085;
          font-size: var(--new-best-text-13);
          line-height: 1.65;
        }

        .new-best-see-all {
          display: inline-flex;
          min-height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding-inline: 6px;
          border-radius: 999px;
          font-size: var(--new-best-text-13);
          font-weight: 800;
          line-height: 1;
          text-decoration: none;
          transition:
            opacity 250ms ease,
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .new-best-see-all:hover {
          opacity: 0.75;
          transform: translateY(-2px);
        }

        .new-best-see-all svg {
          transition: transform 280ms ease;
        }

        .new-best-see-all:hover svg {
          transform: translateX(4px);
        }

        .new-best-slider {
          position: relative;
        }

        .new-best-scroll {
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

        .new-best-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .new-best-product-card {
          width: min(78vw, 268px);
          flex: 0 0 min(78vw, 268px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .new-best-card {
          display: flex;
          height: 100%;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #dfe4e8;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.98);
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

        .new-best-card:hover {
          border-color: #b4d8d3;
          transform: translate3d(0, -7px, 0);
          box-shadow:
            0 31px 60px -34px rgba(8, 123, 117, 0.38),
            0 15px 32px -24px rgba(15, 23, 42, 0.34);
        }

        .new-best-image-link {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fbfcfc 68%,
              #f2f6f5 100%
            );
        }

        .new-best-product-image {
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

        .new-best-card:hover .new-best-product-image {
          transform: scale(1.055);
          filter: saturate(1.04) contrast(1.02);
        }

        .new-best-image-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.16),
            transparent 48%,
            rgba(8, 123, 117, 0.04)
          );
        }

        .new-best-image-shine {
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

        .new-best-card:hover .new-best-image-shine {
          left: 135%;
        }

        .new-best-discount {
          position: absolute;
          top: 0;
          left: 9px;
          padding: 6px 8px;
          border-radius: 0 0 6px 6px;
          color: #ffffff;
          background: linear-gradient(
            180deg,
            #1677ef,
            #0755a5
          );
          box-shadow: 0 7px 15px -8px rgba(7, 85, 165, 0.85);
          font-size: var(--new-best-text-13);
          font-weight: 800;
          line-height: 1.05;
          text-align: center;
        }

        .new-best-discount.is-highlighted {
          background: linear-gradient(
            180deg,
            #f0526b,
            #d92745
          );
          box-shadow: 0 7px 15px -8px rgba(217, 39, 69, 0.82);
        }

        .new-best-brand {
          position: absolute;
          top: 10px;
          right: 10px;
          max-width: 120px;
          overflow: hidden;
          padding: 6px 9px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 9px 20px -14px rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          font-size: var(--new-best-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .new-best-card-content {
          display: flex;
          min-height: 238px;
          flex: 1;
          flex-direction: column;
          padding: 14px;
        }

        .new-best-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 34px;
          align-items: center;
          gap: 8px;
          padding: 5px 9px;
          border-radius: 7px;
          color: #202939;
          background: #f0f1f3;
          font-size: var(--new-best-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .new-best-delivery-icon {
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

        .new-best-product-title {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 13px 0 0;
          color: #101828;
          font-size: var(--new-best-text-16);
          font-weight: 650;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .new-best-card:hover .new-best-product-title {
          color: #087b75;
        }

        .new-best-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 8px;
        }

        .new-best-rating-text {
          margin-left: 6px;
          color: #667085;
          font-size: var(--new-best-text-13);
          line-height: 1.4;
        }

        .new-best-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 15px;
        }

        .new-best-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--new-best-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .new-best-sale-price {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(--new-best-text-18);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .new-best-add-button {
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
          font-size: var(--new-best-text-13);
          font-weight: 800;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .new-best-add-button:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow: 0 12px 24px -14px rgba(8, 123, 117, 0.7);
          transform: translateY(-2px);
        }

        .new-best-add-button:active {
          transform: scale(0.97);
        }

        .new-best-add-button.is-added {
          color: #ffffff;
          background: #087b75;
        }

        .new-best-add-button:disabled {
          border-color: #d0d5dd;
          color: #98a2b3;
          background: #f2f4f7;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .new-best-arrow {
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
            background-color 250ms ease,
            box-shadow 250ms ease;
        }

        .new-best-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .new-best-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .new-best-arrow:hover {
          border-color: #087b75;
          background: #eef9f7;
          box-shadow: 0 14px 28px -14px rgba(8, 123, 117, 0.45);
        }

        .new-best-arrow-left:hover {
          transform: translate(-50%, -50%) scale(1.07);
        }

        .new-best-arrow-right:hover {
          transform: translate(50%, -50%) scale(1.07);
        }

        .new-best-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .new-best-state {
          display: flex;
          min-height: 320px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #e0e5e8;
          border-radius: 18px;
          background: #ffffff;
          padding: 24px;
          text-align: center;
        }

        .new-best-state-title {
          margin: 13px 0 0;
          color: #344054;
          font-size: var(--new-best-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .new-best-state-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--new-best-text-13);
          line-height: 1.6;
        }

        .new-best-error {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 56px 24px;
          background: #ffffff;
          text-align: center;
        }

        .new-best-error-title {
          margin: 14px 0 0;
          color: #b42318;
          font-size: var(--new-best-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .new-best-retry-button {
          min-height: 42px;
          margin-top: 15px;
          padding-inline: 18px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: var(--new-best-text-13);
          font-weight: 750;
          cursor: pointer;
          transition:
            background-color 250ms ease,
            transform 250ms ease;
        }

        .new-best-retry-button:hover {
          background: #066b66;
          transform: translateY(-2px);
        }

        @keyframes newBestGlowLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(34px, -20px, 0) scale(1.08);
          }
        }

        @keyframes newBestGlowRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-32px, -18px, 0) scale(1.07);
          }
        }

        @media (min-width: 1280px) {
          .new-best-product-card {
            width: calc((100% - 80px) / 6);
            flex-basis: calc((100% - 80px) / 6);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .new-best-section {
            padding: 58px 0;
          }

          .new-best-container {
            width: min(980px, calc(100% - 48px));
          }

          .new-best-row {
            padding: 26px;
          }

          .new-best-product-card {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }

          .new-best-container > section + section {
            margin-top: 56px;
            padding-top: 54px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .new-best-section {
            padding: 54px 0;
          }

          .new-best-container {
            width: min(760px, calc(100% - 40px));
          }

          .new-best-row {
            padding: 24px;
          }

          .new-best-product-card {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }

          .new-best-arrow {
            width: 40px;
            height: 40px;
          }

          .new-best-container > section + section {
            margin-top: 50px;
            padding-top: 48px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .new-best-section {
            padding: 50px 0;
          }

          .new-best-container {
            width: calc(100% - 32px);
          }

          .new-best-row {
            padding: 22px;
          }

          .new-best-product-card {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .new-best-arrow {
            display: none;
          }

          .new-best-container > section + section {
            margin-top: 46px;
            padding-top: 44px;
          }
        }

        @media (max-width: 639px) {
          .new-best-section {
            padding: 44px 0 48px;
          }

          .new-best-container {
            width: 100%;
          }

          .new-best-row {
            padding: 20px 0;
            border-right: 0;
            border-left: 0;
            border-radius: 0;
          }

          .new-best-header {
            align-items: start;
            gap: 14px;
            margin-bottom: 18px;
            padding-inline: 14px;
          }

          .new-best-heading-group {
            max-width: 265px;
            gap: 10px;
          }

          .new-best-heading-icon {
            display: none;
          }

          .new-best-title,
          .new-best-subtitle {
            max-width: 250px;
          }

          .new-best-subtitle {
            margin-top: 6px;
          }

          .new-best-see-all {
            min-height: 40px;
            padding-inline: 2px;
          }

          .new-best-scroll {
            gap: 12px;
            padding: 10px 14px 20px;
            scroll-padding-inline: 14px;
          }

          .new-best-product-card {
            width: min(82vw, 268px);
            flex-basis: min(82vw, 268px);
          }

          .new-best-arrow {
            display: none;
          }

          .new-best-card-content {
            min-height: 226px;
            padding: 13px;
          }

          .new-best-product-image {
            padding: 12px;
          }

          .new-best-container > section + section {
            margin-top: 40px;
            padding-top: 38px;
          }
        }

        @media (max-width: 380px) {
          .new-best-header {
            padding-inline: 11px;
          }

          .new-best-heading-group,
          .new-best-title,
          .new-best-subtitle {
            max-width: 218px;
          }

          .new-best-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .new-best-product-card {
            width: calc(100vw - 36px);
            flex-basis: calc(100vw - 36px);
          }

          .new-best-brand {
            max-width: 88px;
          }
        }

        @media (hover: none) {
          .new-best-card:hover,
          .new-best-card:hover .new-best-product-image,
          .new-best-add-button:hover,
          .new-best-see-all:hover,
          .new-best-row:hover .new-best-heading-icon {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .new-best-section *,
          .new-best-section *::before,
          .new-best-section *::after {
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
  allProducts,
  loading,
  cartItems,
  onToggleCart,
}: ProductSliderSectionProps) {
  const scrollContainerRef =
    useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] =
    useState(false);

  const [canScrollRight, setCanScrollRight] =
    useState(false);

  const sectionProducts = useMemo(() => {
    const availableProducts = allProducts.filter(
      (product) => product.available,
    );

    let selectedProducts: Product[] = [];

    if (config.type === "new") {
      const explicitNewProducts =
        availableProducts.filter(
          (product) => product.isNew === true,
        );

      if (
        explicitNewProducts.length >=
        PRODUCTS_PER_VIEW
      ) {
        selectedProducts = [
          ...explicitNewProducts,
        ].sort(sortNewestProducts);
      } else {
        selectedProducts = [
          ...availableProducts,
        ].sort(sortNewestProducts);
      }
    }

    if (config.type === "best-selling") {
      const explicitBestSellers =
        availableProducts.filter(
          (product) =>
            product.isBestSelling === true,
        );

      if (
        explicitBestSellers.length >=
        PRODUCTS_PER_VIEW
      ) {
        selectedProducts = [
          ...explicitBestSellers,
        ].sort(sortBestSellingProducts);
      } else {
        selectedProducts = [
          ...availableProducts,
        ].sort(sortBestSellingProducts);
      }
    }

    if (
      selectedProducts.length <
      PRODUCTS_PER_VIEW
    ) {
      selectedProducts = createLoopedRange(
        availableProducts,
        config.fallbackStart,
        config.maxProducts,
      );
    } else {
      selectedProducts = selectedProducts.slice(
        0,
        config.maxProducts,
      );
    }

    if (
      typeof config.fixedDiscount === "number"
    ) {
      return selectedProducts.map((product) =>
        applyFixedDiscount(
          product,
          config.fixedDiscount as number,
        ),
      );
    }

    return selectedProducts;
  }, [allProducts, config]);

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
        "[data-new-best-card]",
      );

    if (!firstCard) {
      return;
    }

    const styles =
      window.getComputedStyle(container);

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

  return (
    <section
      className="new-best-row"
      style={{
        background: config.background,
      }}
      aria-labelledby={`${config.id}-title`}
    >
      <header className="new-best-header">
        <div className="new-best-heading-group">
          <span
            className="new-best-heading-icon"
            style={{
              color: config.accent,
              backgroundColor: config.softAccent,
            }}
          >
            {config.icon}
          </span>

          <div className="new-best-heading-content">
            <p
              className="new-best-eyebrow"
              style={{
                color: config.accent,
              }}
            >
              {config.eyebrow}
            </p>

            <h2
              id={`${config.id}-title`}
              className="new-best-title"
            >
              {config.title}
            </h2>

            <p className="new-best-subtitle">
              {config.subtitle}
            </p>
          </div>
        </div>

        <Link
          href={config.href}
          className="new-best-see-all"
          style={{
            color: config.accent,
          }}
        >
          <span>See all</span>
          <ChevronRight size={16} />
        </Link>
      </header>

      <div className="new-best-slider">
        <SliderArrow
          direction="left"
          visible={canScrollLeft}
          label={`Show previous ${config.title} products`}
          onClick={() =>
            scrollProducts("left")
          }
        />

        <div
          ref={scrollContainerRef}
          className="new-best-scroll"
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
                added={cartItems.includes(
                  product.id,
                )}
                accent={config.accent}
                softAccent={config.softAccent}
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

        <SliderArrow
          direction="right"
          visible={canScrollRight}
          label={`Show more ${config.title} products`}
          onClick={() =>
            scrollProducts("right")
          }
        />
      </div>
    </section>
  );
}

function ProductCard({
  product,
  added,
  accent,
  softAccent,
  onToggleCart,
}: {
  product: Product;
  added: boolean;
  accent: string;
  softAccent: string;
  onToggleCart: () => void;
}) {
  const roundedRating = Math.round(
    product.rating ?? 0,
  );

  return (
    <article
      data-new-best-card
      className="new-best-product-card new-best-card"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="new-best-image-link"
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
          className="new-best-product-image"
        />

        <div
          aria-hidden="true"
          className="new-best-image-overlay"
        />

        <div
          aria-hidden="true"
          className="new-best-image-shine"
        />

        <DiscountBadge
          discount={product.displayDiscount}
        />

        <span
          className="new-best-brand"
          style={{
            color: accent,
          }}
        >
          {product.brand}
        </span>
      </Link>

      <div className="new-best-card-content">
        <DeliveryBadge />

        <Link
          href={product.href}
          className="new-best-product-title"
        >
          {product.title}
        </Link>

        <div className="new-best-rating">
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

          <span className="new-best-rating-text">
            ({product.displayReviewCount})
          </span>
        </div>

        <div className="new-best-price-row">
          <div>
            <p className="new-best-old-price">
              {product.currencySymbol}
              {formatPrice(
                product.displayOriginalPrice,
              )}
            </p>

            <p className="new-best-sale-price">
              {product.currencySymbol}
              {formatPrice(product.salePrice)}
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleCart}
            disabled={!product.available}
            aria-label={
              added
                ? `Remove ${product.title} from cart`
                : `Add ${product.title} to cart`
            }
            className={`new-best-add-button ${
              added ? "is-added" : ""
            }`}
            style={
              added
                ? {
                    borderColor: accent,
                    backgroundColor: accent,
                  }
                : {
                    borderColor: accent,
                    color: accent,
                    backgroundColor: softAccent,
                  }
            }
          >
            {added ? (
              <>
                <Check size={16} />
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
      className={`new-best-arrow ${
        direction === "left"
          ? "new-best-arrow-left"
          : "new-best-arrow-right"
      } ${visible ? "" : "is-hidden"}`}
    >
      <Icon size={20} />
    </button>
  );
}

function DeliveryBadge() {
  return (
    <div className="new-best-delivery">
      <span className="new-best-delivery-icon">
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
  const highlighted = discount >= 15;

  return (
    <span
      className={`new-best-discount ${
        highlighted ? "is-highlighted" : ""
      }`}
    >
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
  const salePrice = Number(product.price);

  const displayDiscount =
    typeof product.discountPercent === "number"
      ? product.discountPercent
      : fallbackDiscounts[
          index % fallbackDiscounts.length
        ];

  const displayOriginalPrice =
    typeof product.originalPrice === "number"
      ? product.originalPrice
      : Number(
          (
            salePrice /
            (1 - displayDiscount / 100)
          ).toFixed(2),
        );

  const slug = createSlug(product.title);

  return {
    ...product,
    slug,
    href: `/product/${slug}`,
    salePrice,
    displayOriginalPrice,
    displayDiscount,
    currencySymbol: getCurrencySymbol(
      product.currency,
    ),
    displayReviewCount:
      typeof product.reviewCount === "number"
        ? product.reviewCount
        : product.rating !== null
          ? ((product.id * 37) % 160) + 1
          : 0,
    deliveryTime: "12-24 HOURS",
    available: product.inStock !== false,
  };
}

function sortNewestProducts(
  first: Product,
  second: Product,
) {
  const firstTimestamp =
    first.createdAt &&
    !Number.isNaN(Date.parse(first.createdAt))
      ? Date.parse(first.createdAt)
      : first.id;

  const secondTimestamp =
    second.createdAt &&
    !Number.isNaN(Date.parse(second.createdAt))
      ? Date.parse(second.createdAt)
      : second.id;

  return secondTimestamp - firstTimestamp;
}

function sortBestSellingProducts(
  first: Product,
  second: Product,
) {
  const firstScore =
    (first.salesCount ?? 0) * 1000 +
    first.displayReviewCount * 10 +
    (first.rating ?? 0);

  const secondScore =
    (second.salesCount ?? 0) * 1000 +
    second.displayReviewCount * 10 +
    (second.rating ?? 0);

  return secondScore - firstScore;
}

function applyFixedDiscount(
  product: Product,
  discountPercent: number,
): Product {
  const originalPrice = Number(
    (
      product.salePrice /
      (1 - discountPercent / 100)
    ).toFixed(2),
  );

  return {
    ...product,
    displayDiscount: discountPercent,
    displayOriginalPrice: originalPrice,
  };
}

function createLoopedRange(
  products: Product[],
  startIndex: number,
  count: number,
) {
  if (products.length === 0) {
    return [];
  }

  const result: Product[] = [];
  const maximum =
    Math.min(count, products.length);

  for (
    let index = 0;
    index < maximum;
    index += 1
  ) {
    result.push(
      products[
        (startIndex + index) %
          products.length
      ],
    );
  }

  return result;
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
    typeof product.category ===
      "string" &&
    typeof product.image === "string" &&
    typeof product.price === "number" &&
    typeof product.currency ===
      "string" &&
    (typeof product.rating ===
      "number" ||
      product.rating === null) &&
    typeof product.productUrl ===
      "string"
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

function getCurrencySymbol(
  currency: string,
) {
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
    <div className="new-best-product-card new-best-card">
      <div className="aspect-square animate-pulse bg-[#eef0f2]" />

      <div className="space-y-3 p-4">
        <div className="h-9 w-28 animate-pulse rounded bg-[#eef0f2]" />

        <div className="h-5 animate-pulse rounded bg-[#eef0f2]" />

        <div className="h-5 w-4/5 animate-pulse rounded bg-[#eef0f2]" />

        <div className="h-4 w-24 animate-pulse rounded bg-[#eef0f2]" />

        <div className="flex items-end justify-between pt-3">
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
    <>
      <section className="new-best-error">
        <div>
          <ShoppingCart
            size={36}
            className="mx-auto text-[#d92d20]"
          />

          <p className="new-best-error-title">
            Product data could not be loaded
          </p>

          <p className="new-best-state-message">
            {message}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="new-best-retry-button"
          >
            Try Again
          </button>
        </div>
      </section>

      <style jsx global>{`
        .new-best-error {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 56px 24px;
          background: #ffffff;
          text-align: center;
        }

        .new-best-error-title {
          margin: 14px 0 0;
          color: #b42318;
          font-size: 16px;
          font-weight: 750;
          line-height: 1.4;
        }

        .new-best-state-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.6;
        }

        .new-best-retry-button {
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
    <div className="new-best-state">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="new-best-state-title">
          No products available
        </p>

        <p className="new-best-state-message">
          Products will appear here when available.
        </p>
      </div>
    </div>
  );
}