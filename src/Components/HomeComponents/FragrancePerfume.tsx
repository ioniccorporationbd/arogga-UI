"use client";

import {
  Baby,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  HeartPulse,
  Home,
  PawPrint,
  Rocket,
  ShoppingCart,
  Sparkles,
  Star,
  Zap,
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

type SectionConfig = {
  id: string;
  title: string;
  subtitle?: string;
  eyebrow: string;
  href: string;
  keywords: string[];
  fallbackStart: number;
  maxProducts: number;
  icon: ReactNode;
  accent: string;
  softAccent: string;
  background: string;
  fixedDiscount?: number;
};

type ProductSliderSectionProps = {
  config: SectionConfig;
  allProducts: Product[];
  loading: boolean;
  cartItems: number[];
  onToggleCart: (productId: number) => void;
};

const PRODUCTS_PER_VIEW = 6;
const MAX_PRODUCTS_PER_SECTION = 20;

const discountOptions = [
  76, 74, 72, 71, 70, 55, 52, 40, 35, 30, 28, 25, 23, 20, 19, 18, 15, 12,
  10, 8, 7, 5, 3,
];

const sectionConfigs: SectionConfig[] = [
  {
    id: "flash-sale",
    title: "Flash Sale",
    subtitle: "Up to 76% discount for a limited time",
    eyebrow: "Limited-time offers",
    href: "/offers/flash-sale",
    keywords: [
      "flash",
      "lipstick",
      "cream",
      "mask",
      "gift",
      "beauty",
      "cosmetic",
      "skincare",
    ],
    fallbackStart: 0,
    maxProducts: MAX_PRODUCTS_PER_SECTION,
    icon: <Zap size={20} />,
    accent: "#e73b56",
    softAccent: "#fff0f3",
    background:
      "linear-gradient(135deg, #fff7f8 0%, #fffdfd 52%, #fff3f6 100%)",
  },
  {
    id: "boost-balance",
    title: "Boost & Balance",
    subtitle: "Nutrition and wellness support for everyday balance",
    eyebrow: "Wellness collection",
    href: "/offers/boost-balance",
    keywords: [
      "supplement",
      "ashwagandha",
      "garlic",
      "maca",
      "joint",
      "herbal",
      "capsule",
      "vitamin",
      "nutrition",
    ],
    fallbackStart: 6,
    maxProducts: MAX_PRODUCTS_PER_SECTION,
    icon: <HeartPulse size={20} />,
    accent: "#639c00",
    softAccent: "#f1f8e4",
    background:
      "linear-gradient(135deg, #fbfff5 0%, #ffffff 52%, #f5fbe9 100%)",
  },
  {
    id: "tiny-tots",
    title: "Tiny Tots",
    subtitle: "Gentle care and daily essentials for babies and children",
    eyebrow: "Baby and child care",
    href: "/baby-care",
    keywords: [
      "baby",
      "infant",
      "formula",
      "feeding",
      "bottle",
      "kids",
      "child",
      "moisturizing",
      "bath",
    ],
    fallbackStart: 12,
    maxProducts: MAX_PRODUCTS_PER_SECTION,
    icon: <Baby size={20} />,
    accent: "#b86a00",
    softAccent: "#fff7e8",
    background:
      "linear-gradient(135deg, #fffaf2 0%, #ffffff 52%, #fff5df 100%)",
  },
  {
    id: "everyday-k-glow",
    title: "Everyday K-Glow",
    subtitle: "Popular Korean skincare for bright, hydrated-looking skin",
    eyebrow: "Korean beauty",
    href: "/beauty/korean-skincare",
    keywords: [
      "korean",
      "k-beauty",
      "cosrx",
      "serum",
      "toner",
      "glutathione",
      "centella",
      "snail",
      "niacinamide",
      "glow",
    ],
    fallbackStart: 18,
    maxProducts: MAX_PRODUCTS_PER_SECTION,
    icon: <Sparkles size={20} />,
    accent: "#9b51d4",
    softAccent: "#f7effd",
    background:
      "linear-gradient(135deg, #fcf8ff 0%, #ffffff 52%, #f8f0ff 100%)",
  },
  {
    id: "grocery-essentials",
    title: "Grocery Essentials",
    subtitle: "Food, drinks and pantry items for your everyday needs",
    eyebrow: "Daily grocery",
    href: "/grocery",
    keywords: [
      "coffee",
      "tea",
      "milk",
      "rice",
      "ghee",
      "food",
      "grocery",
      "powder",
      "drink",
    ],
    fallbackStart: 24,
    maxProducts: MAX_PRODUCTS_PER_SECTION,
    icon: <Coffee size={20} />,
    accent: "#9a6414",
    softAccent: "#fff7e9",
    background:
      "linear-gradient(135deg, #fffbf4 0%, #ffffff 52%, #fff8e9 100%)",
  },
  {
    id: "protect-your-health",
    title: "Protect Your Health",
    subtitle: "Healthcare devices and medical essentials for daily support",
    eyebrow: "Healthcare essentials",
    href: "/healthcare",
    keywords: [
      "health",
      "oximeter",
      "pain relief",
      "neck cushion",
      "syringe",
      "knee cap",
      "medical",
      "device",
      "mask",
      "medicine",
    ],
    fallbackStart: 30,
    maxProducts: MAX_PRODUCTS_PER_SECTION,
    icon: <HeartPulse size={20} />,
    accent: "#0755a5",
    softAccent: "#eef6ff",
    background:
      "linear-gradient(135deg, #f5faff 0%, #ffffff 52%, #eef6ff 100%)",
  },
  {
    id: "shop-your-glow",
    title: "Shop Your Glow",
    subtitle: "Beauty and skincare products selected for radiant daily care",
    eyebrow: "Beauty collection",
    href: "/beauty",
    keywords: [
      "beauty",
      "glow",
      "mask",
      "serum",
      "moisturizer",
      "sunscreen",
      "face",
      "cream",
      "skincare",
    ],
    fallbackStart: 36,
    maxProducts: MAX_PRODUCTS_PER_SECTION,
    icon: <Sparkles size={20} />,
    accent: "#d02f9a",
    softAccent: "#fff0fa",
    background:
      "linear-gradient(135deg, #fff8fd 0%, #ffffff 52%, #fff0fa 100%)",
  },
  {
    id: "paws-claws",
    title: "Paws & Claws",
    subtitle: "Pet food, hygiene and everyday care for your animals",
    eyebrow: "Pet care collection",
    href: "/pet-care",
    keywords: [
      "pet",
      "cat",
      "dog",
      "poultry",
      "chicken",
      "animal",
      "pet food",
      "antiseptic",
    ],
    fallbackStart: 42,
    maxProducts: MAX_PRODUCTS_PER_SECTION,
    icon: <PawPrint size={20} />,
    accent: "#087b75",
    softAccent: "#eef9f7",
    background:
      "linear-gradient(135deg, #f5fffd 0%, #ffffff 52%, #ebfaf7 100%)",
  },
  {
    id: "kitchen-home",
    title: "Kitchen & Home Essentials",
    subtitle: "Useful products for a clean, fresh and organized home",
    eyebrow: "Home essentials",
    href: "/home-care",
    keywords: [
      "home",
      "kitchen",
      "cleaner",
      "air freshener",
      "liquid",
      "perfume",
      "mug",
      "hand wash",
      "household",
    ],
    fallbackStart: 48,
    maxProducts: MAX_PRODUCTS_PER_SECTION,
    icon: <Home size={20} />,
    accent: "#5d6470",
    softAccent: "#f3f5f7",
    background:
      "linear-gradient(135deg, #fafbfc 0%, #ffffff 52%, #f4f6f8 100%)",
  },
];

export default function CategoryDealSections() {
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
        className="category-deals-section"
        aria-label="Product category offers"
      >
        <div
          aria-hidden="true"
          className="category-deals-page-pattern"
        />

        <div
          aria-hidden="true"
          className="category-deals-page-glow category-deals-page-glow-left"
        />

        <div
          aria-hidden="true"
          className="category-deals-page-glow category-deals-page-glow-right"
        />

        <div className="category-deals-container">
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
        .category-deals-section {
          --category-text-20: 20px;
          --category-text-18: 18px;
          --category-text-16: 16px;
          --category-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 64px 0;
          background:
            radial-gradient(
              circle at 4% 4%,
              rgba(218, 246, 240, 0.52),
              transparent 28%
            ),
            radial-gradient(
              circle at 96% 96%,
              rgba(230, 238, 255, 0.65),
              transparent 30%
            ),
            #ffffff;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .category-deals-page-pattern {
          position: absolute;
          inset: 0;
          z-index: -4;
          pointer-events: none;
          opacity: 0.24;
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
            rgba(0, 0, 0, 0.8),
            transparent 98%
          );
        }

        .category-deals-page-glow {
          position: absolute;
          z-index: -3;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(110px);
          opacity: 0.5;
          will-change: transform;
        }

        .category-deals-page-glow-left {
          top: 0;
          left: -230px;
          background: rgba(161, 230, 217, 0.5);
          animation: categoryGlowLeft 12s ease-in-out infinite;
        }

        .category-deals-page-glow-right {
          right: -230px;
          bottom: -100px;
          background: rgba(184, 209, 255, 0.52);
          animation: categoryGlowRight 14s ease-in-out infinite;
        }

        .category-deals-container {
          position: relative;
          width: min(1440px, calc(100% - 64px));
          margin-inline: auto;
        }

        .category-deals-container > section + section {
          margin-top: 64px;
          padding-top: 60px;
          border-top: 1px solid rgba(15, 23, 42, 0.07);
        }

        .category-deal-row {
          position: relative;
          padding: 30px;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 24px;
          box-shadow:
            0 24px 54px -44px rgba(15, 23, 42, 0.3),
            inset 0 1px rgba(255, 255, 255, 0.85);
        }

        .category-deal-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end;
          gap: 30px;
          margin-bottom: 28px;
        }

        .category-deal-heading {
          display: flex;
          min-width: 0;
          max-width: 780px;
          align-items: flex-start;
          gap: 14px;
        }

        .category-deal-heading-icon {
          display: flex;
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 14px;
          box-shadow:
            0 12px 28px -20px rgba(15, 23, 42, 0.35),
            inset 0 1px rgba(255, 255, 255, 0.9);
          transition:
            transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 350ms ease;
        }

        .category-deal-row:hover
          .category-deal-heading-icon {
          transform: rotate(-5deg) scale(1.05);
          box-shadow:
            0 18px 36px -20px rgba(15, 23, 42, 0.4),
            inset 0 1px rgba(255, 255, 255, 0.95);
        }

        .category-deal-eyebrow {
          margin: 0;
          font-size: var(--category-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .category-deal-title {
          margin: 7px 0 0;
          color: #101828;
          font-size: var(--category-text-20);
          font-weight: 850;
          line-height: 1.3;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .category-deal-subtitle {
          max-width: 680px;
          margin: 8px 0 0;
          color: #667085;
          font-size: var(--category-text-13);
          line-height: 1.65;
        }

        .category-deal-see-all {
          display: inline-flex;
          min-height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding-inline: 6px;
          border-radius: 999px;
          font-size: var(--category-text-13);
          font-weight: 800;
          line-height: 1;
          text-decoration: none;
          transition:
            opacity 250ms ease,
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .category-deal-see-all:hover {
          opacity: 0.75;
          transform: translateY(-2px);
        }

        .category-deal-see-all svg {
          transition: transform 280ms ease;
        }

        .category-deal-see-all:hover svg {
          transform: translateX(4px);
        }

        .category-deal-slider {
          position: relative;
        }

        .category-deal-scroll {
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

        .category-deal-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .category-deal-product-card {
          width: min(78vw, 268px);
          flex: 0 0 min(78vw, 268px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .category-deal-card {
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

        .category-deal-card:hover {
          border-color: #b5d8d3;
          transform: translate3d(0, -7px, 0);
          box-shadow:
            0 31px 60px -34px rgba(8, 123, 117, 0.38),
            0 15px 32px -24px rgba(15, 23, 42, 0.34);
        }

        .category-deal-image-link {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #fbfcfc 68%,
              #f3f6f5 100%
            );
        }

        .category-deal-product-image {
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

        .category-deal-card:hover
          .category-deal-product-image {
          transform: scale(1.055);
          filter: saturate(1.04) contrast(1.02);
        }

        .category-deal-image-overlay {
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

        .category-deal-image-shine {
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

        .category-deal-card:hover
          .category-deal-image-shine {
          left: 135%;
        }

        .category-deal-discount {
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
          font-size: var(--category-text-13);
          font-weight: 800;
          line-height: 1.05;
          text-align: center;
        }

        .category-deal-discount.is-highlighted {
          background: linear-gradient(
            180deg,
            #f0526b,
            #d92745
          );
          box-shadow: 0 7px 15px -8px rgba(217, 39, 69, 0.82);
        }

        .category-deal-brand {
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
          font-size: var(--category-text-13);
          font-weight: 700;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .category-deal-card-content {
          display: flex;
          min-height: 238px;
          flex: 1;
          flex-direction: column;
          padding: 14px;
        }

        .category-deal-delivery {
          display: inline-flex;
          width: fit-content;
          min-height: 34px;
          align-items: center;
          gap: 8px;
          padding: 5px 9px;
          border-radius: 7px;
          color: #202939;
          background: #f0f1f3;
          font-size: var(--category-text-13);
          font-weight: 700;
          line-height: 1;
        }

        .category-deal-delivery-icon {
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

        .category-deal-product-title {
          display: -webkit-box;
          min-height: 48px;
          overflow: hidden;
          margin: 13px 0 0;
          color: #101828;
          font-size: var(--category-text-16);
          font-weight: 650;
          line-height: 1.5;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .category-deal-card:hover
          .category-deal-product-title {
          color: #087b75;
        }

        .category-deal-rating {
          display: flex;
          min-height: 22px;
          align-items: center;
          gap: 2px;
          margin-top: 8px;
        }

        .category-deal-rating-text {
          margin-left: 6px;
          color: #667085;
          font-size: var(--category-text-13);
          line-height: 1.4;
        }

        .category-deal-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 15px;
        }

        .category-deal-old-price {
          margin: 0;
          color: #667085;
          font-size: var(--category-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .category-deal-sale-price {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(--category-text-18);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .category-deal-add-button {
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
          font-size: var(--category-text-13);
          font-weight: 800;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .category-deal-add-button:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow: 0 12px 24px -14px rgba(8, 123, 117, 0.7);
          transform: translateY(-2px);
        }

        .category-deal-add-button:active {
          transform: scale(0.97);
        }

        .category-deal-add-button.is-added {
          color: #ffffff;
          background: #087b75;
        }

        .category-deal-add-button:disabled {
          border-color: #d0d5dd;
          color: #98a2b3;
          background: #f2f4f7;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .category-deal-arrow {
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

        .category-deal-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .category-deal-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .category-deal-arrow:hover {
          border-color: #087b75;
          background: #eef9f7;
          box-shadow: 0 14px 28px -14px rgba(8, 123, 117, 0.45);
        }

        .category-deal-arrow-left:hover {
          transform: translate(-50%, -50%) scale(1.07);
        }

        .category-deal-arrow-right:hover {
          transform: translate(50%, -50%) scale(1.07);
        }

        .category-deal-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .category-deal-state {
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

        .category-deal-state-title {
          margin: 13px 0 0;
          color: #344054;
          font-size: var(--category-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .category-deal-state-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--category-text-13);
          line-height: 1.6;
        }

        .category-deal-error {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 56px 24px;
          background: #ffffff;
          text-align: center;
        }

        .category-deal-error-title {
          margin: 14px 0 0;
          color: #b42318;
          font-size: var(--category-text-16);
          font-weight: 750;
          line-height: 1.4;
        }

        .category-deal-retry-button {
          min-height: 42px;
          margin-top: 15px;
          padding-inline: 18px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: var(--category-text-13);
          font-weight: 750;
          cursor: pointer;
          transition:
            background-color 250ms ease,
            transform 250ms ease;
        }

        .category-deal-retry-button:hover {
          background: #066b66;
          transform: translateY(-2px);
        }

        @keyframes categoryGlowLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(34px, -20px, 0) scale(1.08);
          }
        }

        @keyframes categoryGlowRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-32px, -18px, 0) scale(1.07);
          }
        }

        @media (min-width: 1280px) {
          .category-deal-product-card {
            width: calc((100% - 80px) / 6);
            flex-basis: calc((100% - 80px) / 6);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .category-deals-section {
            padding: 58px 0;
          }

          .category-deals-container {
            width: min(980px, calc(100% - 48px));
          }

          .category-deal-row {
            padding: 26px;
          }

          .category-deal-product-card {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }

          .category-deals-container > section + section {
            margin-top: 56px;
            padding-top: 54px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .category-deals-section {
            padding: 54px 0;
          }

          .category-deals-container {
            width: min(760px, calc(100% - 40px));
          }

          .category-deal-row {
            padding: 24px;
          }

          .category-deal-product-card {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }

          .category-deal-arrow {
            width: 40px;
            height: 40px;
          }

          .category-deals-container > section + section {
            margin-top: 50px;
            padding-top: 48px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .category-deals-section {
            padding: 50px 0;
          }

          .category-deals-container {
            width: calc(100% - 32px);
          }

          .category-deal-row {
            padding: 22px;
          }

          .category-deal-product-card {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .category-deal-arrow {
            display: none;
          }

          .category-deals-container > section + section {
            margin-top: 46px;
            padding-top: 44px;
          }
        }

        @media (max-width: 639px) {
          .category-deals-section {
            padding: 44px 0 48px;
          }

          .category-deals-container {
            width: 100%;
          }

          .category-deal-row {
            padding: 20px 0;
            border-right: 0;
            border-left: 0;
            border-radius: 0;
          }

          .category-deal-header {
            align-items: start;
            gap: 14px;
            margin-bottom: 18px;
            padding-inline: 14px;
          }

          .category-deal-heading {
            max-width: 260px;
            gap: 10px;
          }

          .category-deal-heading-icon {
            display: none;
          }

          .category-deal-title,
          .category-deal-subtitle {
            max-width: 250px;
          }

          .category-deal-subtitle {
            margin-top: 6px;
          }

          .category-deal-see-all {
            min-height: 40px;
            padding-inline: 2px;
          }

          .category-deal-scroll {
            gap: 12px;
            padding: 10px 14px 20px;
            scroll-padding-inline: 14px;
          }

          .category-deal-product-card {
            width: min(82vw, 268px);
            flex-basis: min(82vw, 268px);
          }

          .category-deal-arrow {
            display: none;
          }

          .category-deal-card-content {
            min-height: 226px;
            padding: 13px;
          }

          .category-deal-product-image {
            padding: 12px;
          }

          .category-deals-container > section + section {
            margin-top: 40px;
            padding-top: 38px;
          }
        }

        @media (max-width: 380px) {
          .category-deal-header {
            padding-inline: 11px;
          }

          .category-deal-heading,
          .category-deal-title,
          .category-deal-subtitle {
            max-width: 218px;
          }

          .category-deal-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .category-deal-product-card {
            width: calc(100vw - 36px);
            flex-basis: calc(100vw - 36px);
          }

          .category-deal-brand {
            max-width: 88px;
          }
        }

        @media (hover: none) {
          .category-deal-card:hover,
          .category-deal-card:hover
            .category-deal-product-image,
          .category-deal-add-button:hover,
          .category-deal-see-all:hover,
          .category-deal-row:hover
            .category-deal-heading-icon {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-deals-section *,
          .category-deals-section *::before,
          .category-deals-section *::after {
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sectionProducts = useMemo(() => {
    const inStockProducts = allProducts.filter(
      (product) => product.inStock,
    );

    const matchedProducts = inStockProducts.filter((product) =>
      matchesKeywords(product, config.keywords),
    );

    let selectedProducts: Product[];

    if (matchedProducts.length >= PRODUCTS_PER_VIEW) {
      selectedProducts = matchedProducts.slice(
        0,
        config.maxProducts,
      );
    } else {
      selectedProducts = createLoopedRange(
        inStockProducts,
        config.fallbackStart,
        config.maxProducts,
      );
    }

    if (typeof config.fixedDiscount === "number") {
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
        "[data-category-product-card]",
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
      className="category-deal-row"
      style={{
        background: config.background,
      }}
      aria-labelledby={`${config.id}-title`}
    >
      <header className="category-deal-header">
        <div className="category-deal-heading">
          <span
            className="category-deal-heading-icon"
            style={{
              color: config.accent,
              backgroundColor: config.softAccent,
            }}
          >
            {config.icon}
          </span>

          <div>
            <p
              className="category-deal-eyebrow"
              style={{
                color: config.accent,
              }}
            >
              {config.eyebrow}
            </p>

            <h2
              id={`${config.id}-title`}
              className="category-deal-title"
            >
              {config.title}
            </h2>

            {config.subtitle && (
              <p className="category-deal-subtitle">
                {config.subtitle}
              </p>
            )}
          </div>
        </div>

        <Link
          href={config.href}
          className="category-deal-see-all"
          style={{
            color: config.accent,
          }}
        >
          <span>See all</span>
          <ChevronRight size={16} />
        </Link>
      </header>

      <div className="category-deal-slider">
        <SliderArrow
          direction="left"
          visible={canScrollLeft}
          onClick={() => scrollProducts("left")}
          label={`Show previous ${config.title} products`}
        />

        <div
          ref={scrollContainerRef}
          className="category-deal-scroll"
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
          onClick={() => scrollProducts("right")}
          label={`Show more ${config.title} products`}
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
  const roundedRating = Math.round(product.rating ?? 0);

  return (
    <article
      data-category-product-card
      className="category-deal-product-card category-deal-card"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="category-deal-image-link"
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
          className="category-deal-product-image"
        />

        <div
          aria-hidden="true"
          className="category-deal-image-overlay"
        />

        <div
          aria-hidden="true"
          className="category-deal-image-shine"
        />

        <DiscountBadge
          discount={product.discountPercent}
        />

        <span
          className="category-deal-brand"
          style={{
            color: accent,
          }}
        >
          {product.brand}
        </span>
      </Link>

      <div className="category-deal-card-content">
        <DeliveryBadge />

        <Link
          href={product.href}
          className="category-deal-product-title"
        >
          {product.title}
        </Link>

        <div className="category-deal-rating">
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

          <span className="category-deal-rating-text">
            ({product.reviewCount})
          </span>
        </div>

        <div className="category-deal-price-row">
          <div>
            <p className="category-deal-old-price">
              {product.currencySymbol}
              {formatPrice(product.originalPrice)}
            </p>

            <p className="category-deal-sale-price">
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
            className={`category-deal-add-button ${
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
      className={`category-deal-arrow ${
        direction === "left"
          ? "category-deal-arrow-left"
          : "category-deal-arrow-right"
      } ${visible ? "" : "is-hidden"}`}
    >
      <Icon size={20} />
    </button>
  );
}

function DeliveryBadge() {
  return (
    <div className="category-deal-delivery">
      <span className="category-deal-delivery-icon">
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
  const highlighted = discount >= 35;

  return (
    <span
      className={`category-deal-discount ${
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
        ? ((product.id * 17) % 450) + 1
        : 0,
    deliveryTime: "12-24 HOURS",
    inStock: true,
  };
}

function matchesKeywords(
  product: Product,
  keywords: string[],
) {
  const text = [
    product.brand,
    product.title,
    product.category,
  ]
    .join(" ")
    .toLowerCase();

  return keywords.some((keyword) =>
    text.includes(keyword.toLowerCase()),
  );
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
    discountPercent,
    originalPrice,
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
    <div className="category-deal-product-card category-deal-card">
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
      <section className="category-deal-error">
        <div>
          <ShoppingCart
            size={36}
            className="mx-auto text-[#d92d20]"
          />

          <p className="category-deal-error-title">
            Product data could not be loaded
          </p>

          <p className="category-deal-state-message">
            {message}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="category-deal-retry-button"
          >
            Try Again
          </button>
        </div>
      </section>

      <style jsx global>{`
        .category-deal-error {
          display: flex;
          min-height: 300px;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 56px 24px;
          background: #ffffff;
          text-align: center;
        }

        .category-deal-error-title {
          margin: 14px 0 0;
          color: #b42318;
          font-size: 16px;
          font-weight: 750;
          line-height: 1.4;
        }

        .category-deal-state-message {
          margin: 7px 0 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.6;
        }

        .category-deal-retry-button {
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
    <div className="category-deal-state">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="category-deal-state-title">
          No products available
        </p>

        <p className="category-deal-state-message">
          Products will appear here when available.
        </p>
      </div>
    </div>
  );
}