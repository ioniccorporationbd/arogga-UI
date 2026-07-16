"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pill,
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

type SliderSectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  products: Product[];
  loading: boolean;
  cartItems: number[];
  onToggleCart: (productId: number) => void;
  compact?: boolean;
};

const PRODUCTS_PER_VIEW = 6;
const MAX_PRODUCTS_PER_SECTION = 20;

const discountOptions = [
  55, 45, 38, 20, 40, 40, 30, 25, 18, 15, 35, 50, 28, 22,
];

export default function SupplementFestival() {
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

  const supplementProducts = useMemo(() => {
    const matched = products.filter((product) =>
      matchesAnyText(product, [
        "supplement",
        "vitamin",
        "ashwagandha",
        "liver",
        "arginine",
        "cod liver",
        "sea moss",
        "nutrition",
        "herbal",
      ]),
    );

    const source =
      matched.length >= PRODUCTS_PER_VIEW
        ? matched
        : products;

    return source.slice(0, MAX_PRODUCTS_PER_SECTION);
  }, [products]);

  const medicineProducts = useMemo(() => {
    const matched = products.filter((product) =>
      matchesAnyText(product, [
        "medicine",
        "tablet",
        "capsule",
        "syrup",
        "pharmaceutical",
        "healthcare",
      ]),
    );

    const source =
      matched.length >= PRODUCTS_PER_VIEW
        ? matched
        : products.slice(20);

    if (source.length >= PRODUCTS_PER_VIEW) {
      return source.slice(0, MAX_PRODUCTS_PER_SECTION);
    }

    return createLoopedProducts(
      products,
      20,
      MAX_PRODUCTS_PER_SECTION,
    );
  }, [products]);

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
        className="supplement-festival-section"
        aria-label="Supplement and medicine offers"
      >
        <div
          aria-hidden="true"
          className="supplement-background-pattern"
        />

        <div
          aria-hidden="true"
          className="supplement-background-glow supplement-background-glow-left"
        />

        <div
          aria-hidden="true"
          className="supplement-background-glow supplement-background-glow-right"
        />

        <div className="supplement-main-container">
          <SliderSection
            id="supplement-festival"
            title="Supplement Festival"
            subtitle="Up-To 70% Discount"
            href="/offers/supplements"
            products={supplementProducts}
            loading={loading}
            cartItems={cartItems}
            onToggleCart={toggleCartItem}
          />

          <PromoBanner />

          <SliderSection
            id="medicine-essentials"
            title="Medicine Essentials"
            subtitle="Everyday healthcare savings"
            href="/medicine"
            products={medicineProducts}
            loading={loading}
            cartItems={cartItems}
            onToggleCart={toggleCartItem}
            compact
          />
        </div>
      </section>

      <style jsx global>{`
        .supplement-festival-section {
          --supplement-text-20: 20px;
          --supplement-text-18: 18px;
          --supplement-text-16: 16px;
          --supplement-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 64px 0;
          background:
            radial-gradient(
              circle at 6% 12%,
              rgba(228, 248, 205, 0.75),
              transparent 28%
            ),
            radial-gradient(
              circle at 95% 88%,
              rgba(255, 230, 194, 0.65),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #ffffff 0%,
              #fbfef9 52%,
              #fffdf9 100%
            );

          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .supplement-background-pattern {
          position: absolute;
          inset: 0;
          z-index: -4;
          pointer-events: none;
          opacity: 0.26;
          background-image:
            linear-gradient(
              rgba(91, 151, 20, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(91, 151, 20, 0.04) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.75),
            transparent 97%
          );
        }

        .supplement-background-glow {
          position: absolute;
          z-index: -3;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(100px);
          opacity: 0.56;
          will-change: transform;
        }

        .supplement-background-glow-left {
          top: 20px;
          left: -210px;
          background: rgba(199, 238, 153, 0.66);
          animation: supplementGlowLeft 11s ease-in-out infinite;
        }

        .supplement-background-glow-right {
          right: -210px;
          bottom: -90px;
          background: rgba(255, 213, 155, 0.58);
          animation: supplementGlowRight 13s ease-in-out infinite;
        }

        .supplement-main-container {
          position: relative;
          width: min(1440px, calc(100% - 64px));
          margin-inline: auto;
        }

        .supplement-main-container > section + a,
        .supplement-main-container > a + section {
          margin-top: 48px;
        }

        .supplement-slider-section {
          position: relative;
        }

        .supplement-slider-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end;
          gap: 28px;
          margin-bottom: 26px;
        }

        .supplement-heading-group {
          min-width: 0;
        }

        .supplement-eyebrow {
          margin: 0;
          color: #5f9200;
          font-size: var(--supplement-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .supplement-title {
          margin: 7px 0 0;
          color: #101828;
          font-size: var(--supplement-text-20);
          font-weight: 850;
          line-height: 1.3;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .supplement-subtitle {
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--supplement-text-13);
          font-weight: 600;
          line-height: 1.6;
        }

        .supplement-see-all {
          display: inline-flex;
          min-height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding-inline: 6px;
          border-radius: 999px;
          color: #087b75;
          font-size: var(--supplement-text-13);
          font-weight: 800;
          line-height: 1;
          text-decoration: none;
          transition:
            color 260ms ease,
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .supplement-see-all:hover {
          color: #055f5a;
          transform: translateY(-2px);
        }

        .supplement-see-all svg {
          transition: transform 280ms ease;
        }

        .supplement-see-all:hover svg {
          transform: translateX(4px);
        }

        .supplement-slider-shell {
          position: relative;
        }

        .supplement-slider-scroll {
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

        .supplement-slider-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .supplement-product-card {
          width: min(78vw, 268px);
          flex: 0 0 min(78vw, 268px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .supplement-card {
          display: flex;
          height: 100%;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #dfe4e8;
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

        .supplement-card:hover {
          border-color: #bedca1;
          transform: translate3d(0, -7px, 0);
          box-shadow:
            0 31px 60px -34px rgba(95, 146, 0, 0.38),
            0 15px 32px -24px rgba(15, 23, 42, 0.35);
        }

        .supplement-image-link {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fbfcfa 68%,
              #f3f8ed 100%
            );
        }

        .supplement-product-image {
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

        .supplement-card:hover .supplement-product-image {
          transform: scale(1.055);
          filter: saturate(1.04) contrast(1.02);
        }

        .supplement-image-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.16),
            transparent 48%,
            rgba(95, 146, 0, 0.04)
          );
        }

        .supplement-image-shine {
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

        .supplement-card:hover .supplement-image-shine {
          left: 135%;
        }

        .supplement-discount {
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
          font-size: var(--supplement-text-13);
          font-weight: 800;
          line-height: 1.05;
          text-align: center;
        }

        .supplement-discount.is-highlighted {
          background: linear-gradient(
            180deg,
            #f0526b,
            #d92745
          );
          box-shadow: 0 7px 15px -8px rgba(217, 39, 69, 0.82);
        }

        .supplement-brand {
          position: absolute;
          top: 10px;
          right: 10px;
          max-width: 120px;
          overflow: hidden;
          padding: 6px 9px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 999px;
          color: #5f9200;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 9px 20px -14px rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          font-size: var(--supplement-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .supplement-card-content {
          display: flex;
          min-height: 238px;
          flex: 1;
          flex-direction: column;
          padding: 14px;
        }

        .supplement-card-content.is-compact {
          min-height: 214px;
        }

        .supplement-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 34px;
          align-items: center;
          gap: 8px;
          padding: 5px 9px;
          border-radius: 7px;
          color: #202939;
          background: #f0f1f3;
          font-size: var(--supplement-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .supplement-delivery-icon {
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

        .supplement-product-title {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 13px 0 0;
          color: #101828;
          font-size: var(--supplement-text-16);
          font-weight: 650;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .supplement-card:hover .supplement-product-title {
          color: #087b75;
        }

        .supplement-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 8px;
        }

        .supplement-rating-text {
          margin-left: 6px;
          color: #667085;
          font-size: var(--supplement-text-13);
          line-height: 1.4;
        }

        .supplement-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 15px;
        }

        .supplement-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--supplement-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .supplement-sale-price {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(--supplement-text-18);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .supplement-add-button {
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
          font-size: var(--supplement-text-13);
          font-weight: 800;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .supplement-add-button:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow: 0 12px 24px -14px rgba(8, 123, 117, 0.7);
          transform: translateY(-2px);
        }

        .supplement-add-button:active {
          transform: scale(0.97);
        }

        .supplement-add-button.is-added {
          color: #ffffff;
          background: #087b75;
        }

        .supplement-add-button:disabled {
          border-color: #d0d5dd;
          color: #98a2b3;
          background: #f2f4f7;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .supplement-slider-arrow {
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

        .supplement-slider-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .supplement-slider-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .supplement-slider-arrow:hover {
          border-color: #087b75;
          background: #eef9f7;
          box-shadow: 0 14px 28px -14px rgba(8, 123, 117, 0.45);
        }

        .supplement-slider-arrow-left:hover {
          transform: translate(-50%, -50%) scale(1.07);
        }

        .supplement-slider-arrow-right:hover {
          transform: translate(50%, -50%) scale(1.07);
        }

        .supplement-slider-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .supplement-promo-banner {
          position: relative;
          display: block;
          overflow: hidden;
          padding: 32px;
          border: 1px solid #dce5de;
          border-radius: 22px;
          color: inherit;
          background:
            linear-gradient(
              120deg,
              rgba(255, 255, 255, 0.97),
              rgba(237, 249, 243, 0.94) 48%,
              rgba(238, 246, 255, 0.95)
            );
          box-shadow:
            0 22px 52px -38px rgba(15, 23, 42, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.9);
          text-decoration: none;
          transform: translateZ(0);
          transition:
            transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 350ms ease,
            box-shadow 420ms ease;
          will-change: transform;
        }

        .supplement-promo-banner:hover {
          border-color: #b9dbcf;
          transform: translateY(-5px);
          box-shadow:
            0 32px 65px -38px rgba(8, 123, 117, 0.34),
            inset 0 1px rgba(255, 255, 255, 0.95);
        }

        .supplement-promo-pattern {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.25;
          background-image:
            radial-gradient(
              circle at 1px 1px,
              rgba(8, 123, 117, 0.13) 1px,
              transparent 0
            );
          background-size: 22px 22px;
          mask-image: linear-gradient(
            to right,
            transparent,
            rgba(0, 0, 0, 0.9)
          );
        }

        .supplement-promo-glow {
          position: absolute;
          right: -80px;
          top: -100px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          pointer-events: none;
          background: rgba(166, 225, 213, 0.55);
          filter: blur(72px);
          transition: transform 600ms ease;
        }

        .supplement-promo-banner:hover .supplement-promo-glow {
          transform: scale(1.15) translateX(-12px);
        }

        .supplement-promo-content {
          position: relative;
          display: flex;
          min-height: 190px;
          max-width: 760px;
          flex-direction: column;
          justify-content: center;
        }

        .supplement-promo-badge {
          display: inline-flex;
          width: fit-content;
          min-height: 38px;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border: 1px solid rgba(8, 123, 117, 0.1);
          border-radius: 999px;
          color: #087b75;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 10px 25px -20px rgba(8, 123, 117, 0.5);
          font-size: var(--supplement-text-13);
          font-weight: 800;
          line-height: 1;
        }

        .supplement-promo-title {
          max-width: 720px;
          margin: 18px 0 0;
          color: #101828;
          font-size: var(--supplement-text-20);
          font-weight: 850;
          line-height: 1.35;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .supplement-promo-description {
          max-width: 620px;
          margin: 10px 0 0;
          color: #667085;
          font-size: var(--supplement-text-16);
          line-height: 1.7;
        }

        .supplement-promo-action {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 7px;
          margin-top: 20px;
          color: #087b75;
          font-size: var(--supplement-text-13);
          font-weight: 800;
          line-height: 1;
        }

        .supplement-promo-action svg {
          transition: transform 280ms ease;
        }

        .supplement-promo-banner:hover
          .supplement-promo-action
          svg {
          transform: translateX(4px);
        }

        .supplement-state {
          display: flex;
          min-height: 310px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #e0e5e8;
          border-radius: 18px;
          background: #ffffff;
          padding: 24px;
          text-align: center;
        }

        .supplement-state-title {
          margin: 13px 0 0;
          color: #344054;
          font-size: var(--supplement-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .supplement-state-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--supplement-text-13);
          line-height: 1.6;
        }

        .supplement-error {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 56px 24px;
          background: #ffffff;
          text-align: center;
        }

        .supplement-error-title {
          margin: 14px 0 0;
          color: #b42318;
          font-size: var(--supplement-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .supplement-retry-button {
          min-height: 42px;
          margin-top: 15px;
          padding-inline: 18px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: var(--supplement-text-13);
          font-weight: 750;
          cursor: pointer;
          transition:
            background-color 250ms ease,
            transform 250ms ease;
        }

        .supplement-retry-button:hover {
          background: #066b66;
          transform: translateY(-2px);
        }

        @keyframes supplementGlowLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(32px, -20px, 0) scale(1.08);
          }
        }

        @keyframes supplementGlowRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-30px, -18px, 0) scale(1.07);
          }
        }

        @media (min-width: 1280px) {
          .supplement-product-card {
            width: calc((100% - 80px) / 6);
            flex-basis: calc((100% - 80px) / 6);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .supplement-festival-section {
            padding: 58px 0;
          }

          .supplement-main-container {
            width: min(980px, calc(100% - 48px));
          }

          .supplement-product-card {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .supplement-festival-section {
            padding: 54px 0;
          }

          .supplement-main-container {
            width: min(760px, calc(100% - 40px));
          }

          .supplement-product-card {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }

          .supplement-slider-arrow {
            width: 40px;
            height: 40px;
          }

          .supplement-promo-banner {
            padding: 28px;
          }

          .supplement-promo-content {
            min-height: 175px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .supplement-festival-section {
            padding: 50px 0;
          }

          .supplement-main-container {
            width: calc(100% - 32px);
          }

          .supplement-product-card {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .supplement-slider-arrow {
            display: none;
          }

          .supplement-promo-banner {
            padding: 25px;
          }
        }

        @media (max-width: 639px) {
          .supplement-festival-section {
            padding: 44px 0 48px;
          }

          .supplement-main-container {
            width: 100%;
          }

          .supplement-main-container > section + a,
          .supplement-main-container > a + section {
            margin-top: 40px;
          }

          .supplement-slider-header {
            align-items: start;
            gap: 14px;
            margin-bottom: 18px;
            padding-inline: 14px;
          }

          .supplement-heading-group {
            max-width: 250px;
          }

          .supplement-title {
            max-width: 250px;
          }

          .supplement-see-all {
            min-height: 40px;
            padding-inline: 2px;
          }

          .supplement-slider-scroll {
            gap: 12px;
            padding: 10px 14px 20px;
            scroll-padding-inline: 14px;
          }

          .supplement-product-card {
            width: min(82vw, 268px);
            flex-basis: min(82vw, 268px);
          }

          .supplement-slider-arrow {
            display: none;
          }

          .supplement-card-content {
            min-height: 226px;
            padding: 13px;
          }

          .supplement-card-content.is-compact {
            min-height: 210px;
          }

          .supplement-product-image {
            padding: 12px;
          }

          .supplement-promo-banner {
            margin-inline: 14px;
            padding: 22px;
            border-radius: 18px;
          }

          .supplement-promo-content {
            min-height: 180px;
          }

          .supplement-promo-description {
            line-height: 1.6;
          }
        }

        @media (max-width: 380px) {
          .supplement-slider-header {
            padding-inline: 11px;
          }

          .supplement-heading-group,
          .supplement-title {
            max-width: 218px;
          }

          .supplement-slider-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .supplement-product-card {
            width: calc(100vw - 36px);
            flex-basis: calc(100vw - 36px);
          }

          .supplement-brand {
            max-width: 88px;
          }

          .supplement-promo-banner {
            margin-inline: 11px;
            padding: 19px;
          }
        }

        @media (hover: none) {
          .supplement-card:hover,
          .supplement-card:hover .supplement-product-image,
          .supplement-add-button:hover,
          .supplement-see-all:hover,
          .supplement-promo-banner:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .supplement-festival-section *,
          .supplement-festival-section *::before,
          .supplement-festival-section *::after {
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

function SliderSection({
  id,
  title,
  subtitle,
  href,
  products,
  loading,
  cartItems,
  onToggleCart,
  compact = false,
}: SliderSectionProps) {
  const scrollContainerRef =
    useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] =
    useState(false);

  const [canScrollRight, setCanScrollRight] =
    useState(false);

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
  }, [products.length, updateScrollButtons]);

  const scrollProducts = (
    direction: "left" | "right",
  ) => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-supplement-card]",
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
      className="supplement-slider-section"
      aria-labelledby={`${id}-title`}
    >
      <header className="supplement-slider-header">
        <div className="supplement-heading-group">
          <p className="supplement-eyebrow">
            Health and wellness collection
          </p>

          <h2
            id={`${id}-title`}
            className="supplement-title"
          >
            {title}
          </h2>

          {subtitle && (
            <p className="supplement-subtitle">
              {subtitle}
            </p>
          )}
        </div>

        <Link
          href={href}
          className="supplement-see-all"
        >
          <span>See all</span>

          <ChevronRight size={16} />
        </Link>
      </header>

      <div className="supplement-slider-shell">
        <SliderArrow
          direction="left"
          visible={canScrollLeft}
          onClick={() => scrollProducts("left")}
          label={`Show previous ${title} products`}
        />

        <div
          ref={scrollContainerRef}
          className="supplement-slider-scroll"
        >
          {loading &&
            Array.from({
              length: PRODUCTS_PER_VIEW,
            }).map((_, index) => (
              <ProductSkeleton
                key={index}
                compact={compact}
              />
            ))}

          {!loading &&
            products.map((product) => (
              <ProductCard
                key={`${id}-${product.id}`}
                product={product}
                added={cartItems.includes(product.id)}
                onToggleCart={() =>
                  onToggleCart(product.id)
                }
                compact={compact}
              />
            ))}

          {!loading && products.length === 0 && (
            <EmptyState />
          )}
        </div>

        <SliderArrow
          direction="right"
          visible={canScrollRight}
          onClick={() => scrollProducts("right")}
          label={`Show more ${title} products`}
        />
      </div>
    </section>
  );
}

function ProductCard({
  product,
  added,
  onToggleCart,
  compact,
}: {
  product: Product;
  added: boolean;
  onToggleCart: () => void;
  compact: boolean;
}) {
  const roundedRating = Math.round(
    product.rating ?? 0,
  );

  return (
    <article
      data-supplement-card
      className="supplement-product-card supplement-card"
    >
      {!compact && (
        <Link
          href={product.href}
          aria-label={product.title}
          className="supplement-image-link"
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
            className="supplement-product-image"
          />

          <div
            aria-hidden="true"
            className="supplement-image-overlay"
          />

          <div
            aria-hidden="true"
            className="supplement-image-shine"
          />

          <DiscountBadge
            discount={product.discountPercent}
          />

          <span className="supplement-brand">
            {product.brand}
          </span>
        </Link>
      )}

      <div
        className={`supplement-card-content ${
          compact ? "is-compact" : ""
        }`}
      >
        <DeliveryBadge />

        <Link
          href={product.href}
          className="supplement-product-title"
        >
          {product.title}
        </Link>

        {!compact && (
          <div className="supplement-rating">
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

            <span className="supplement-rating-text">
              ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="supplement-price-row">
          <div>
            <p className="supplement-old-price">
              {product.currencySymbol}
              {formatPrice(product.originalPrice)}
            </p>

            <p className="supplement-sale-price">
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
            className={`supplement-add-button ${
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

function PromoBanner() {
  return (
    <Link
      href="/offers/healthcare"
      className="supplement-promo-banner"
    >
      <div
        aria-hidden="true"
        className="supplement-promo-pattern"
      />

      <div
        aria-hidden="true"
        className="supplement-promo-glow"
      />

      <div className="supplement-promo-content">
        <div className="supplement-promo-badge">
          <Pill size={16} />
          Essential healthcare
        </div>

        <h3 className="supplement-promo-title">
          Everyday medicines delivered safely to your doorstep
        </h3>

        <p className="supplement-promo-description">
          Browse trusted healthcare products and enjoy convenient delivery
          across Bangladesh.
        </p>

        <span className="supplement-promo-action">
          Explore medicines

          <ChevronRight size={16} />
        </span>
      </div>
    </Link>
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
      className={`supplement-slider-arrow ${
        direction === "left"
          ? "supplement-slider-arrow-left"
          : "supplement-slider-arrow-right"
      } ${visible ? "" : "is-hidden"}`}
    >
      <Icon size={20} />
    </button>
  );
}

function DeliveryBadge() {
  return (
    <div className="supplement-delivery">
      <span className="supplement-delivery-icon">
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
  const highlighted =
    discount === 45 || discount === 38;

  return (
    <span
      className={`supplement-discount ${
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
  const discountPercent =
    discountOptions[index % discountOptions.length];

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
        ? ((product.id * 23) % 150) + 1
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

function matchesAnyText(
  product: Product,
  words: string[],
) {
  const searchableText = [
    product.brand,
    product.title,
    product.category,
  ]
    .join(" ")
    .toLowerCase();

  return words.some((word) =>
    searchableText.includes(word.toLowerCase()),
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

function ProductSkeleton({
  compact,
}: {
  compact: boolean;
}) {
  return (
    <div className="supplement-product-card supplement-card">
      {!compact && (
        <div className="aspect-square animate-pulse bg-[#eef0f2]" />
      )}

      <div
        className={`space-y-3 p-4 ${
          compact ? "min-h-[214px]" : ""
        }`}
      >
        <div className="h-9 w-28 animate-pulse rounded bg-[#eef0f2]" />

        <div className="h-5 animate-pulse rounded bg-[#eef0f2]" />

        <div className="h-5 w-4/5 animate-pulse rounded bg-[#eef0f2]" />

        {!compact && (
          <div className="h-4 w-24 animate-pulse rounded bg-[#eef0f2]" />
        )}

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
    <section className="supplement-error">
      <div>
        <ShoppingCart
          size={36}
          className="mx-auto text-[#d92d20]"
        />

        <p className="supplement-error-title">
          Product data could not be loaded
        </p>

        <p className="supplement-state-message">
          {message}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="supplement-retry-button"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="supplement-state">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="supplement-state-title">
          No products available
        </p>

        <p className="supplement-state-message">
          Products will appear here when they become available.
        </p>
      </div>
    </div>
  );
}