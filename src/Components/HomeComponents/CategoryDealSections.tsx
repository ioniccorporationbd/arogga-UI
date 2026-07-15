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
  Utensils,
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
  href: string;
  keywords: string[];
  fallbackStart: number;
  maxProducts: number;
  icon: ReactNode;
  accent: string;
  background: string;
  fixedDiscount?: number;
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
    subtitle: "Up to 76% discount for limited time 🔥",
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
    icon: <Zap size={18} />,
    accent: "#111827",
    background: "#ffffff",
  },
  {
    id: "boost-balance",
    title: "Boost & Balance",
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
    icon: <HeartPulse size={18} />,
    accent: "#111827",
    background: "#ffffff",
  },
  {
    id: "tiny-tots",
    title: "Tiny Tots 🧸",
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
    icon: <Baby size={18} />,
    accent: "#111827",
    background: "#ffffff",
  },
  {
    id: "everyday-k-glow",
    title: "Everyday K-Glow",
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
    icon: <Sparkles size={18} />,
    accent: "#111827",
    background: "#ffffff",
  },
  {
    id: "grocery-essentials",
    title: "Grocery Essentials 🛒",
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
    icon: <Coffee size={18} />,
    accent: "#111827",
    background: "#ffffff",
  },
  {
    id: "protect-your-health",
    title: "Protect Your Health 🩺",
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
    icon: <HeartPulse size={18} />,
    accent: "#111827",
    background: "#ffffff",
  },
  {
    id: "shop-your-glow",
    title: "Shop Your Glow ✨",
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
    icon: <Sparkles size={18} />,
    accent: "#111827",
    background: "#ffffff",
  },
  {
    id: "paws-claws",
    title: "Paws & Claws 🐾",
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
    icon: <PawPrint size={18} />,
    accent: "#111827",
    background: "#ffffff",
  },
  {
    id: "kitchen-home",
    title: "Kitchen & Home Essentials",
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
    icon: <Home size={18} />,
    accent: "#111827",
    background: "#ffffff",
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

    return () => controller.abort();
  }, []);

  const toggleCartItem = (productId: number) => {
    setCartItems((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  if (!loading && loadError) {
    return <ErrorState message={loadError} />;
  }

  return (
    <>
      <section className="w-full bg-white py-10 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-[1440px] space-y-14 px-4 sm:px-6 lg:space-y-16 lg:px-8">
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
        .category-deal-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-inline: contain;
          scroll-padding-inline: 0.5rem;
          -webkit-overflow-scrolling: touch;
        }

        .category-deal-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .category-deal-card {
          width: min(76vw, 250px);
        }

        @media (min-width: 640px) {
          .category-deal-card {
            width: 220px;
          }
        }

        @media (min-width: 1024px) {
          .category-deal-card {
            width: calc((100% - 80px) / 6);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-deal-scroll,
          .category-deal-scroll *,
          .category-deal-scroll *::before,
          .category-deal-scroll *::after {
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
}: {
  config: SectionConfig;
  allProducts: Product[];
  loading: boolean;
  cartItems: number[];
  onToggleCart: (productId: number) => void;
}) {
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
        applyFixedDiscount(product, config.fixedDiscount!),
      );
    }

    return selectedProducts;
  }, [allProducts, config]);

  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const maximumScrollLeft =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(
      container.scrollLeft < maximumScrollLeft - 4,
    );
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

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

    if (!container) return;

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-category-product-card]",
      );

    if (!firstCard) return;

    const styles = window.getComputedStyle(container);

    const gap =
      Number.parseFloat(
        styles.columnGap || styles.gap || "16",
      ) || 16;

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const scrollAmount =
      (cardWidth + gap) * PRODUCTS_PER_VIEW;

    container.scrollBy({
      left:
        direction === "right"
          ? scrollAmount
          : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section aria-labelledby={`${config.id}-title`}>
      <div className="mb-5 grid grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-3">
        <div className="flex items-center gap-2.5">
          <span
            className="hidden h-9 w-9 items-center justify-center rounded-xl bg-[#f4f7f7] sm:flex"
            style={{
              color: config.accent,
            }}
          >
            {config.icon}
          </span>

          <h2
            id={`${config.id}-title`}
            className="text-[18px] font-bold tracking-[-0.025em] sm:text-[21px]"
            style={{
              color: config.accent,
            }}
          >
            {config.title}
          </h2>
        </div>

        {config.subtitle && (
          <p className="hidden text-center text-sm font-medium text-[#344054] lg:block">
            {config.subtitle}
          </p>
        )}

        <Link
          href={config.href}
          className="group inline-flex items-center justify-self-end gap-1 text-sm font-semibold text-[#111827] transition hover:text-[#087b75]"
        >
          see all

          <ChevronRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {config.subtitle && (
        <p className="mb-4 text-sm text-[#667085] lg:hidden">
          {config.subtitle}
        </p>
      )}

      <div className="relative">
        <SliderArrow
          direction="left"
          visible={canScrollLeft}
          onClick={() => scrollProducts("left")}
          label={`Show previous ${config.title} products`}
        />

        <div
          ref={scrollContainerRef}
          className="category-deal-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
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
      data-category-product-card
      className="category-deal-card group flex shrink-0 snap-start flex-col overflow-hidden rounded-[9px] border border-[#e1e5e8] bg-white shadow-[0_7px_20px_-18px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#b7d7d2] hover:shadow-[0_22px_42px_-28px_rgba(15,23,42,0.38)]"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="relative block aspect-square overflow-hidden bg-[#fbfbfb]"
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
          className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <DiscountBadge
          discount={product.discountPercent}
        />
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <DeliveryBadge />

        <Link
          href={product.href}
          className="mt-3 block"
        >
          <h3 className="line-clamp-2 min-h-[44px] text-[14px] font-semibold leading-[22px] text-[#111827] transition-colors group-hover:text-[#087b75]">
            {product.title}
          </h3>
        </Link>

        <div className="mt-2 flex min-h-5 items-center gap-0.5">
          {Array.from({ length: 5 }).map(
            (_, index) => (
              <Star
                key={index}
                size={13}
                fill={
                  index < roundedRating
                    ? "#ffb400"
                    : "#dce3ea"
                }
                strokeWidth={0}
              />
            ),
          )}

          <span className="ml-1.5 text-[11px] text-[#667085]">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="min-w-0">
            <p className="truncate text-[12px] text-[#667085] line-through">
              {product.currencySymbol}
              {formatPrice(product.originalPrice)}
            </p>

            <p className="mt-0.5 text-[16px] font-bold text-[#101828]">
              {product.currencySymbol}
              {formatPrice(product.salePrice)}
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleCart}
            disabled={!product.inStock}
            className={`inline-flex min-h-9 min-w-[46px] shrink-0 items-center justify-center gap-1 rounded-[6px] border px-2 text-[12px] font-semibold transition active:scale-[0.97] ${
              added
                ? "border-[#087b75] bg-[#087b75] text-white"
                : "border-[#087b75] bg-[#eef9f7] text-[#087b75] hover:bg-[#087b75] hover:text-white"
            }`}
          >
            {added ? (
              <>
                <Check size={14} />
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
      className={`absolute top-[43%] z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6dde1] bg-white text-[#087b75] shadow-[0_8px_22px_-10px_rgba(15,23,42,0.35)] transition-all duration-300 hover:scale-105 hover:border-[#087b75] hover:bg-[#eef9f7] disabled:pointer-events-none ${
        direction === "left"
          ? "left-0 -translate-x-1/2"
          : "right-0 translate-x-1/2"
      } ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Icon size={18} />
    </button>
  );
}

function DeliveryBadge() {
  return (
    <div className="inline-flex w-fit items-center gap-1.5 rounded-[4px] bg-[#f0f1f3] px-2 py-1.5 text-[10px] font-semibold text-[#202939]">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#172033] text-[#ffd63d]">
        <Rocket
          size={11}
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
      className={`absolute left-2 top-0 rounded-b-[4px] px-1.5 py-1 text-center text-[10px] font-extrabold leading-[10px] text-white shadow-sm ${
        highlighted
          ? "bg-[#e73855]"
          : "bg-[#0969e8]"
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
  if (products.length === 0) return [];

  const result: Product[] = [];

  for (let index = 0; index < count; index += 1) {
    const product =
      products[(startIndex + index) % products.length];

    result.push(product);
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
    <div className="category-deal-card shrink-0 overflow-hidden rounded-[9px] border border-[#e4e7ec] bg-white">
      <div className="aspect-square animate-pulse bg-[#eef0f2]" />

      <div className="space-y-3 p-3">
        <div className="h-8 w-24 animate-pulse rounded bg-[#eef0f2]" />
        <div className="h-4 animate-pulse rounded bg-[#eef0f2]" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-[#eef0f2]" />
        <div className="h-4 w-20 animate-pulse rounded bg-[#eef0f2]" />

        <div className="flex items-end justify-between pt-3">
          <div className="h-9 w-20 animate-pulse rounded bg-[#eef0f2]" />
          <div className="h-9 w-12 animate-pulse rounded bg-[#eef0f2]" />
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
    <section className="w-full bg-white py-14">
      <div className="mx-auto flex min-h-[280px] w-full max-w-[1440px] items-center justify-center px-4 text-center">
        <div>
          <ShoppingCart
            size={36}
            className="mx-auto text-[#d92d20]"
          />

          <p className="mt-4 font-semibold text-[#b42318]">
            Product data could not be loaded
          </p>

          <p className="mt-2 text-sm text-[#667085]">
            {message}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-4 rounded-lg bg-[#087b75] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#066b66]"
          >
            Try Again
          </button>
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center rounded-xl border border-[#e0e5e8] bg-white px-6 text-center">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="mt-3 font-semibold text-[#344054]">
          No products available
        </p>

        <p className="mt-2 text-sm text-[#667085]">
          Products will appear here when available.
        </p>
      </div>
    </div>
  );
}