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
    href: "/offers/all-in-one-care",
    background: "#f5fbe9",
    headingColor: "#69ae00",
    startIndex: 0,
    productCount: 18,
  },
  {
    id: "himalaya-savings",
    title: "Himalaya: Natural savings you can’t miss",
    href: "/offers/himalaya",
    background: "#fffaf0",
    headingColor: "#d69816",
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
    <section className="w-full">
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

      <style jsx global>{`
        .multi-deal-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-inline: contain;
          scroll-padding-inline: 0.5rem;
          -webkit-overflow-scrolling: touch;
        }

        .multi-deal-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .multi-deal-product-card {
          width: min(78vw, 260px);
        }

        @media (min-width: 640px) {
          .multi-deal-product-card {
            width: 230px;
          }
        }

        @media (min-width: 1024px) {
          .multi-deal-product-card {
            width: calc((100% - 80px) / 6);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .multi-deal-scroll,
          .multi-deal-scroll *,
          .multi-deal-scroll *::before,
          .multi-deal-scroll *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
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
          product.brand.toLowerCase() ===
          config.preferredBrand?.toLowerCase(),
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

    return inStockProducts.slice(0, config.productCount);
  }, [config, products]);

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
      resizeObserver = new ResizeObserver(() => {
        updateScrollButtons();
      });

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
        "[data-product-card]",
      );

    if (!firstCard) return;

    const containerStyle =
      window.getComputedStyle(container);

    const gap =
      Number.parseFloat(
        containerStyle.columnGap ||
          containerStyle.gap ||
          "16",
      ) || 16;

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const amount =
      (cardWidth + gap) * PRODUCTS_PER_VIEW;

    container.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="relative w-full overflow-hidden py-10 sm:py-12 lg:py-14"
      style={{
        backgroundColor: config.background,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-0 h-72 w-72 rounded-full bg-white/40 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-white/50 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
          <h2
            className="text-[20px] font-bold tracking-[-0.025em] sm:text-[23px]"
            style={{
              color: config.headingColor,
            }}
          >
            {config.title}
          </h2>

          <Link
            href={config.href}
            className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold transition hover:opacity-75"
            style={{
              color: config.headingColor,
            }}
          >
            see all

            <ChevronRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollProducts("left")}
            disabled={!canScrollLeft}
            aria-label={`Show previous products from ${config.title}`}
            className={`absolute left-0 top-[42%] z-30 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d7dde1] bg-white text-[#087b75] shadow-[0_8px_22px_-10px_rgba(15,23,42,0.35)] transition-all duration-300 hover:scale-105 hover:border-[#087b75] hover:bg-[#eef9f7] disabled:pointer-events-none ${
              canScrollLeft
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={scrollContainerRef}
            className="multi-deal-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
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
            className={`absolute right-0 top-[42%] z-30 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d7dde1] bg-white text-[#087b75] shadow-[0_8px_22px_-10px_rgba(15,23,42,0.35)] transition-all duration-300 hover:scale-105 hover:border-[#087b75] hover:bg-[#eef9f7] disabled:pointer-events-none ${
              canScrollRight
                ? "opacity-100"
                : "opacity-0"
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
      data-product-card
      className="multi-deal-product-card group flex shrink-0 snap-start flex-col overflow-hidden rounded-[9px] border border-[#dfe4e8] bg-white shadow-[0_7px_18px_-16px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#bad9d5] hover:shadow-[0_22px_40px_-26px_rgba(15,23,42,0.4)]"
    >
      <Link
        href={product.href}
        aria-label={product.title}
        className="relative block aspect-square overflow-hidden bg-[#fafafa]"
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
          className="h-full w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.045]"
        />

        <span className="absolute left-2 top-0 rounded-b-[4px] bg-[#0969e8] px-1.5 py-1 text-center text-[11px] font-extrabold leading-[11px] text-white shadow-sm">
          {product.discountPercent}%
          <br />
          OFF
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-[4px] bg-[#f0f1f3] px-2 py-1.5 text-[11px] font-semibold text-[#202939]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#172033] text-[#ffd63d]">
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
          className="mt-3 block"
        >
          <h3 className="line-clamp-2 min-h-[48px] text-[15px] font-semibold leading-6 text-[#101010] transition-colors duration-200 group-hover:text-[#087b75]">
            {product.title}
          </h3>
        </Link>

        <div className="mt-2 flex min-h-5 items-center gap-0.5">
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

          <span className="ml-1.5 text-[12px] text-[#667085]">
            (
            {product.rating !== null
              ? product.reviewCount
              : 0}
            )
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-[13px] text-[#667085] line-through">
              {product.currencySymbol}
              {formatPrice(product.originalPrice)}
            </p>

            <p className="mt-0.5 text-[18px] font-bold text-black">
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
            className={`inline-flex min-h-10 min-w-[48px] items-center justify-center gap-1.5 rounded-[7px] border px-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:border-[#d0d5dd] disabled:bg-[#f2f4f7] disabled:text-[#98a2b3] ${
              added
                ? "border-[#087b75] bg-[#087b75] text-white"
                : "border-[#087b75] bg-[#eef9f7] text-[#087b75] hover:bg-[#087b75] hover:text-white"
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
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(2);
}

function ProductSkeleton() {
  return (
    <div className="multi-deal-product-card shrink-0 overflow-hidden rounded-[9px] border border-[#e4e7ec] bg-white">
      <div className="aspect-square animate-pulse bg-[#f0f2f4]" />

      <div className="space-y-3 p-3">
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
    <section className="w-full bg-[#fff7f7] py-14">
      <div className="mx-auto flex min-h-[280px] w-full max-w-[1400px] items-center justify-center px-4 text-center">
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
    <div className="flex min-h-[360px] w-full items-center justify-center rounded-xl border border-[#e0e5e8] bg-white px-6 text-center">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="mt-3 font-semibold text-[#344054]">
          No products available
        </p>

        <p className="mt-2 text-sm text-[#667085]">
          Products will appear here when they become
          available.
        </p>
      </div>
    </div>
  );
}