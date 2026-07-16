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
  headingColor: string;
  preferredBrands: string[];
  fallbackStartIndex: number;
  productCount: number;
};

const PRODUCTS_PER_VIEW = 6;
const MAX_PRODUCTS_PER_SECTION = 20;

const discountOptions = [
  5, 8, 10, 12, 15, 18, 20, 25, 28, 30, 33, 35, 37, 40, 46, 50, 55,
];

const dealSections: DealSectionConfig[] = [
  {
    id: "gfors-mega-deals",
    title: "GFORS Mega Deals",
    subtitle:
      "Explore high-value GFORS products with limited-time savings and fast delivery.",
    href: "/offers/gfors",
    headingColor: "#0755a5",
    preferredBrands: ["GFORS", "Gfors"],
    fallbackStartIndex: 0,
    productCount: MAX_PRODUCTS_PER_SECTION,
  },
  {
    id: "skin-cafe-essentials",
    title: "Skin Cafe Essentials",
    subtitle:
      "Discover trusted skincare and beauty essentials selected for everyday care.",
    href: "/offers/skin-cafe",
    headingColor: "#0755a5",
    preferredBrands: [
      "Skin Cafe",
      "Rajkonna",
      "Lilac",
      "Groome",
      "Panam",
    ],
    fallbackStartIndex: 20,
    productCount: MAX_PRODUCTS_PER_SECTION,
  },
];

export default function BlueDealSections() {
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
      <section className="blue-deal-sections">
        <div
          aria-hidden="true"
          className="blue-deal-page-pattern"
        />

        <div
          aria-hidden="true"
          className="blue-deal-page-glow blue-deal-page-glow-left"
        />

        <div
          aria-hidden="true"
          className="blue-deal-page-glow blue-deal-page-glow-right"
        />

        <div className="blue-deal-main-container">
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
        </div>
      </section>

      <style jsx global>{`
        .blue-deal-sections {
          --blue-text-20: 20px;
          --blue-text-18: 18px;
          --blue-text-16: 16px;
          --blue-text-13: 13px;

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
              rgba(205, 229, 255, 0.72),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #edf6ff 0%,
              #eaf3fd 50%,
              #e5f0fc 100%
            );

          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .blue-deal-page-pattern {
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

        .blue-deal-page-glow {
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

        .blue-deal-page-glow-left {
          top: 30px;
          left: -220px;
          background: rgba(255, 255, 255, 0.95);
          animation: blueDealGlowLeft 11s ease-in-out infinite;
        }

        .blue-deal-page-glow-right {
          right: -220px;
          bottom: -100px;
          background: rgba(171, 211, 255, 0.65);
          animation: blueDealGlowRight 13s ease-in-out infinite;
        }

        .blue-deal-main-container {
          position: relative;
          width: min(1440px, calc(100% - 64px));
          margin-inline: auto;
        }

        .blue-deal-main-container > section + section {
          margin-top: 64px;
          padding-top: 60px;
          border-top: 1px solid rgba(7, 85, 165, 0.1);
        }

        .blue-deal-row {
          position: relative;
        }

        .blue-deal-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 28px;
        }

        .blue-deal-heading-group {
          min-width: 0;
          max-width: 760px;
        }

        .blue-deal-eyebrow {
          margin: 0;
          color: #087b75;
          font-size: var(--blue-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .blue-deal-title {
          margin: 7px 0 0;
          font-size: var(--blue-text-20);
          font-weight: 850;
          line-height: 1.3;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .blue-deal-subtitle {
          max-width: 680px;
          margin: 8px 0 0;
          color: #667085;
          font-size: var(--blue-text-13);
          line-height: 1.65;
        }

        .blue-deal-see-all {
          display: inline-flex;
          min-height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding-inline: 6px;
          border-radius: 999px;
          font-size: var(--blue-text-13);
          font-weight: 800;
          line-height: 1;
          text-decoration: none;
          transition:
            opacity 250ms ease,
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .blue-deal-see-all:hover {
          opacity: 0.75;
          transform: translateY(-2px);
        }

        .blue-deal-see-all svg {
          transition: transform 280ms ease;
        }

        .blue-deal-see-all:hover svg {
          transform: translateX(4px);
        }

        .blue-deal-slider {
          position: relative;
        }

        .blue-deal-scroll {
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

        .blue-deal-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .blue-deal-product-card {
          width: min(78vw, 264px);
          flex: 0 0 min(78vw, 264px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .blue-deal-card {
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

        .blue-deal-card:hover {
          border-color: #abcde8;
          transform: translate3d(0, -7px, 0);
          box-shadow:
            0 31px 60px -34px rgba(7, 85, 165, 0.4),
            0 15px 32px -24px rgba(15, 23, 42, 0.35);
        }

        .blue-deal-image-link {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fafcff 67%,
              #f1f7fd 100%
            );
        }

        .blue-deal-product-image {
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

        .blue-deal-card:hover .blue-deal-product-image {
          transform: scale(1.055);
          filter: saturate(1.04) contrast(1.02);
        }

        .blue-deal-image-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.14),
            transparent 46%,
            rgba(7, 85, 165, 0.04)
          );
        }

        .blue-deal-image-shine {
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

        .blue-deal-card:hover .blue-deal-image-shine {
          left: 135%;
        }

        .blue-deal-discount {
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
          font-size: var(--blue-text-13);
          font-weight: 800;
          line-height: 1.05;
          text-align: center;
        }

        .blue-deal-brand {
          position: absolute;
          top: 10px;
          right: 10px;
          max-width: 118px;
          overflow: hidden;
          padding: 6px 9px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 999px;
          color: #0755a5;
          background: rgba(255, 255, 255, 0.93);
          box-shadow: 0 9px 20px -14px rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          font-size: var(--blue-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .blue-deal-content {
          display: flex;
          min-height: 238px;
          flex: 1;
          flex-direction: column;
          padding: 14px;
        }

        .blue-deal-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 34px;
          align-items: center;
          gap: 8px;
          padding: 5px 9px;
          border-radius: 7px;
          color: #202939;
          background: #f0f1f3;
          font-size: var(--blue-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .blue-deal-delivery-icon {
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

        .blue-deal-product-title {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 13px 0 0;
          color: #101828;
          font-size: var(--blue-text-16);
          font-weight: 650;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .blue-deal-card:hover .blue-deal-product-title {
          color: #0755a5;
        }

        .blue-deal-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 8px;
        }

        .blue-deal-rating-text {
          margin-left: 6px;
          color: #667085;
          font-size: var(--blue-text-13);
          line-height: 1.4;
        }

        .blue-deal-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 15px;
        }

        .blue-deal-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--blue-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .blue-deal-sale-price {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(--blue-text-18);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .blue-deal-add-button {
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
          font-size: var(--blue-text-13);
          font-weight: 800;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .blue-deal-add-button:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow: 0 12px 24px -14px rgba(8, 123, 117, 0.7);
          transform: translateY(-2px);
        }

        .blue-deal-add-button:active {
          transform: scale(0.97);
        }

        .blue-deal-add-button.is-added {
          color: #ffffff;
          background: #087b75;
        }

        .blue-deal-add-button:disabled {
          border-color: #d0d5dd;
          color: #98a2b3;
          background: #f2f4f7;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .blue-deal-arrow {
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

        .blue-deal-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .blue-deal-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .blue-deal-arrow:hover {
          border-color: #0755a5;
          background: #f2f8ff;
          box-shadow: 0 14px 28px -14px rgba(7, 85, 165, 0.45);
        }

        .blue-deal-arrow-left:hover {
          transform: translate(-50%, -50%) scale(1.07);
        }

        .blue-deal-arrow-right:hover {
          transform: translate(50%, -50%) scale(1.07);
        }

        .blue-deal-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .blue-deal-state {
          display: flex;
          min-height: 340px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #dce4eb;
          border-radius: 18px;
          background: #ffffff;
          padding: 24px;
          text-align: center;
        }

        .blue-deal-state-title {
          margin: 13px 0 0;
          color: #344054;
          font-size: var(--blue-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .blue-deal-state-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--blue-text-13);
          line-height: 1.6;
        }

        .blue-deal-error {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 56px 24px;
          background: #eaf3fd;
          text-align: center;
        }

        .blue-deal-error-title {
          margin: 14px 0 0;
          color: #b42318;
          font-size: var(--blue-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .blue-deal-retry-button {
          min-height: 42px;
          margin-top: 15px;
          padding-inline: 18px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: var(--blue-text-13);
          font-weight: 750;
          cursor: pointer;
          transition:
            background-color 250ms ease,
            transform 250ms ease;
        }

        .blue-deal-retry-button:hover {
          background: #066b66;
          transform: translateY(-2px);
        }

        @keyframes blueDealGlowLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(32px, -20px, 0) scale(1.08);
          }
        }

        @keyframes blueDealGlowRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-30px, -18px, 0) scale(1.07);
          }
        }

        @media (min-width: 1280px) {
          .blue-deal-product-card {
            width: calc((100% - 80px) / 6);
            flex-basis: calc((100% - 80px) / 6);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .blue-deal-sections {
            padding: 58px 0;
          }

          .blue-deal-main-container {
            width: min(980px, calc(100% - 48px));
          }

          .blue-deal-product-card {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }

          .blue-deal-main-container > section + section {
            margin-top: 56px;
            padding-top: 54px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .blue-deal-sections {
            padding: 54px 0;
          }

          .blue-deal-main-container {
            width: min(760px, calc(100% - 40px));
          }

          .blue-deal-product-card {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }

          .blue-deal-arrow {
            width: 40px;
            height: 40px;
          }

          .blue-deal-main-container > section + section {
            margin-top: 50px;
            padding-top: 48px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .blue-deal-sections {
            padding: 50px 0;
          }

          .blue-deal-main-container {
            width: calc(100% - 32px);
          }

          .blue-deal-product-card {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .blue-deal-arrow {
            display: none;
          }

          .blue-deal-main-container > section + section {
            margin-top: 46px;
            padding-top: 44px;
          }
        }

        @media (max-width: 639px) {
          .blue-deal-sections {
            padding: 44px 0 48px;
          }

          .blue-deal-main-container {
            width: 100%;
          }

          .blue-deal-header {
            align-items: flex-start;
            gap: 14px;
            margin-bottom: 18px;
            padding-inline: 14px;
          }

          .blue-deal-heading-group {
            max-width: 250px;
          }

          .blue-deal-title {
            max-width: 250px;
          }

          .blue-deal-subtitle {
            margin-top: 6px;
          }

          .blue-deal-see-all {
            min-height: 40px;
            padding-inline: 2px;
          }

          .blue-deal-scroll {
            gap: 12px;
            padding: 10px 14px 20px;
            scroll-padding-inline: 14px;
          }

          .blue-deal-product-card {
            width: min(82vw, 268px);
            flex-basis: min(82vw, 268px);
          }

          .blue-deal-arrow {
            display: none;
          }

          .blue-deal-content {
            min-height: 226px;
            padding: 13px;
          }

          .blue-deal-product-image {
            padding: 12px;
          }

          .blue-deal-main-container > section + section {
            margin-top: 42px;
            padding-top: 40px;
          }
        }

        @media (max-width: 380px) {
          .blue-deal-header {
            padding-inline: 11px;
          }

          .blue-deal-heading-group,
          .blue-deal-title {
            max-width: 220px;
          }

          .blue-deal-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .blue-deal-product-card {
            width: calc(100vw - 36px);
            flex-basis: calc(100vw - 36px);
          }

          .blue-deal-brand {
            max-width: 90px;
          }
        }

        @media (hover: none) {
          .blue-deal-card:hover,
          .blue-deal-card:hover .blue-deal-product-image,
          .blue-deal-add-button:hover,
          .blue-deal-see-all:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .blue-deal-sections *,
          .blue-deal-sections *::before,
          .blue-deal-sections *::after {
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

    const matchingProducts = inStockProducts.filter(
      (product) =>
        config.preferredBrands.some((brand) => {
          const normalizedBrand = brand.toLowerCase();

          return (
            product.brand
              .toLowerCase()
              .includes(normalizedBrand) ||
            product.title
              .toLowerCase()
              .includes(normalizedBrand)
          );
        }),
    );

    if (matchingProducts.length >= PRODUCTS_PER_VIEW) {
      return matchingProducts.slice(
        0,
        config.productCount,
      );
    }

    const fallbackProducts = inStockProducts.slice(
      config.fallbackStartIndex,
      config.fallbackStartIndex + config.productCount,
    );

    if (fallbackProducts.length >= PRODUCTS_PER_VIEW) {
      return fallbackProducts;
    }

    return createLoopedProducts(
      inStockProducts,
      config.fallbackStartIndex,
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
        "[data-blue-deal-product-card]",
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

  return (
    <section
      className="blue-deal-row"
      aria-labelledby={`${config.id}-title`}
    >
      <header className="blue-deal-header">
        <div className="blue-deal-heading-group">
          <p className="blue-deal-eyebrow">
            Featured product collection
          </p>

          <h2
            id={`${config.id}-title`}
            className="blue-deal-title"
            style={{
              color: config.headingColor,
            }}
          >
            {config.title}
          </h2>

          <p className="blue-deal-subtitle">
            {config.subtitle}
          </p>
        </div>

        <Link
          href={config.href}
          className="blue-deal-see-all"
          style={{
            color: config.headingColor,
          }}
        >
          <span>See all</span>
          <ChevronRight size={16} />
        </Link>
      </header>

      <div className="blue-deal-slider">
        <button
          type="button"
          onClick={() => scrollProducts("left")}
          disabled={!canScrollLeft}
          aria-label={`Show previous products from ${config.title}`}
          className={`blue-deal-arrow blue-deal-arrow-left ${
            canScrollLeft ? "" : "is-hidden"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollContainerRef}
          className="blue-deal-scroll"
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
          className={`blue-deal-arrow blue-deal-arrow-right ${
            canScrollRight ? "" : "is-hidden"
          }`}
        >
          <ChevronRight size={20} />
        </button>
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
      data-blue-deal-product-card
      className="blue-deal-product-card blue-deal-card"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="blue-deal-image-link"
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
          className="blue-deal-product-image"
        />

        <div
          aria-hidden="true"
          className="blue-deal-image-overlay"
        />

        <div
          aria-hidden="true"
          className="blue-deal-image-shine"
        />

        <span className="blue-deal-discount">
          {product.discountPercent}%
          <br />
          OFF
        </span>

        <span className="blue-deal-brand">
          {product.brand}
        </span>
      </Link>

      <div className="blue-deal-content">
        <div className="blue-deal-delivery">
          <span className="blue-deal-delivery-icon">
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
          className="blue-deal-product-title"
        >
          {product.title}
        </Link>

        <div className="blue-deal-rating">
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

          <span className="blue-deal-rating-text">
            ({product.reviewCount})
          </span>
        </div>

        <div className="blue-deal-price-row">
          <div>
            <p className="blue-deal-old-price">
              {product.currencySymbol}
              {formatPrice(product.originalPrice)}
            </p>

            <p className="blue-deal-sale-price">
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
            className={`blue-deal-add-button ${
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
        ? ((product.id * 19) % 120) + 1
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
    <div className="blue-deal-product-card blue-deal-card">
      <div className="aspect-square animate-pulse bg-[#edf2f7]" />

      <div className="space-y-3 p-4">
        <div className="h-9 w-28 animate-pulse rounded bg-[#e5ebf1]" />

        <div className="h-5 animate-pulse rounded bg-[#e5ebf1]" />

        <div className="h-5 w-4/5 animate-pulse rounded bg-[#e5ebf1]" />

        <div className="h-4 w-24 animate-pulse rounded bg-[#e5ebf1]" />

        <div className="flex items-end justify-between">
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
    <section className="blue-deal-error">
      <div>
        <ShoppingCart
          size={36}
          className="mx-auto text-[#d92d20]"
        />

        <p className="blue-deal-error-title">
          Product data could not be loaded
        </p>

        <p className="blue-deal-state-message">
          {message}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="blue-deal-retry-button"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="blue-deal-state">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="blue-deal-state-title">
          No products available
        </p>

        <p className="blue-deal-state-message">
          Products will appear here when they become available.
        </p>
      </div>
    </div>
  );
}