"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Rocket,
  ShoppingCart,
  Star,
  Sun,
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

const PRODUCTS_PER_VIEW = 6;
const MAX_PRODUCTS = 20;

const discountOptions = [
  27, 38, 31, 4, 29, 11, 25, 20, 18, 15, 12, 30, 35, 40,
];

const sunAndSplashKeywords = [
  "sunscreen",
  "sun cream",
  "sun block",
  "spf",
  "cleanser",
  "face wash",
  "foaming",
  "facial cleanser",
  "gel cleanser",
  "salicylic",
  "brightening",
  "skin",
  "skincare",
  "acne",
  "face",
];

export default function SunAndSplash() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(
    null,
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [canScrollLeft, setCanScrollLeft] =
    useState(false);
  const [canScrollRight, setCanScrollRight] =
    useState(false);

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

  const sectionProducts = useMemo(() => {
    const availableProducts = products.filter(
      (product) => product.inStock,
    );

    const matchedProducts = availableProducts.filter(
      (product) =>
        matchesKeywords(
          product,
          sunAndSplashKeywords,
        ),
    );

    if (matchedProducts.length >= PRODUCTS_PER_VIEW) {
      return matchedProducts.slice(0, MAX_PRODUCTS);
    }

    return availableProducts.slice(0, MAX_PRODUCTS);
  }, [products]);

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
  }, [
    sectionProducts.length,
    updateScrollButtons,
  ]);

  const scrollProducts = (
    direction: "left" | "right",
  ) => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-sun-product-card]",
      );

    if (!firstCard) return;

    const styles = window.getComputedStyle(container);

    const gap =
      Number.parseFloat(
        styles.columnGap ||
          styles.gap ||
          "16",
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

  const toggleCartItem = (productId: number) => {
    setCartItems((currentItems) => {
      if (currentItems.includes(productId)) {
        return currentItems.filter(
          (itemId) => itemId !== productId,
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
      <section className="relative w-full overflow-hidden bg-[#eaf3fd] py-10 sm:py-12 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 top-0 h-80 w-80 rounded-full bg-white/50 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 bottom-0 h-80 w-80 rounded-full bg-[#dcecff]/70 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <span className="hidden h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0755a5] shadow-sm sm:flex">
                <Sun size={20} />
              </span>

              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#5d7da1]">
                  Skincare essentials
                </p>

                <h2 className="mt-0.5 text-[21px] font-bold tracking-[-0.025em] text-[#0755a5] sm:text-[24px]">
                  Sun &amp; Splash
                </h2>
              </div>
            </div>

            <Link
              href="/offers/sun-and-splash"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#0755a5] transition-colors hover:text-[#087b75]"
            >
              see all

              <ChevronRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="relative">
            <SliderArrow
              direction="left"
              visible={canScrollLeft}
              onClick={() => scrollProducts("left")}
              label="Show previous Sun and Splash products"
            />

            <div
              ref={scrollContainerRef}
              className="sun-splash-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
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
                    key={product.id}
                    product={product}
                    added={cartItems.includes(
                      product.id,
                    )}
                    onToggleCart={() =>
                      toggleCartItem(product.id)
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
              label="Show more Sun and Splash products"
            />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .sun-splash-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-inline: contain;
          scroll-padding-inline: 0.5rem;
          -webkit-overflow-scrolling: touch;
        }

        .sun-splash-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .sun-splash-product-card {
          width: min(78vw, 270px);
        }

        @media (min-width: 640px) {
          .sun-splash-product-card {
            width: 230px;
          }
        }

        @media (min-width: 1024px) {
          .sun-splash-product-card {
            width: calc((100% - 80px) / 6);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sun-splash-scroll,
          .sun-splash-scroll *,
          .sun-splash-scroll *::before,
          .sun-splash-scroll *::after {
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
  const roundedRating = Math.round(
    product.rating ?? 0,
  );

  return (
    <article
      data-sun-product-card
      className="sun-splash-product-card group flex shrink-0 snap-start flex-col overflow-hidden rounded-[10px] border border-[#dfe4e8] bg-white shadow-[0_8px_22px_-18px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b9d8d4] hover:shadow-[0_24px_45px_-28px_rgba(15,23,42,0.4)]"
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
          className="h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.045]"
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
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] text-[#667085] line-through">
              {product.currencySymbol}
              {formatPrice(product.originalPrice)}
            </p>

            <p className="mt-0.5 text-[18px] font-bold text-[#101010]">
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
            className={`inline-flex min-h-10 min-w-[48px] shrink-0 items-center justify-center gap-1.5 rounded-[7px] border px-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:border-[#d0d5dd] disabled:bg-[#f2f4f7] disabled:text-[#98a2b3] ${
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
      className={`absolute top-[43%] z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6dde1] bg-white text-[#087b75] shadow-[0_8px_22px_-10px_rgba(15,23,42,0.35)] transition-all duration-300 hover:scale-105 hover:border-[#087b75] hover:bg-[#eef9f7] disabled:pointer-events-none ${
        direction === "left"
          ? "left-0 -translate-x-1/2"
          : "right-0 translate-x-1/2"
      } ${
        visible
          ? "opacity-100"
          : "opacity-0"
      }`}
    >
      <Icon size={20} />
    </button>
  );
}

function DeliveryBadge() {
  return (
    <div className="inline-flex w-fit items-center gap-2 rounded-[5px] bg-[#f0f1f3] px-2 py-1.5 text-[11px] font-semibold text-[#202939]">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#172033] text-[#ffd63d]">
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
  return (
    <span className="absolute left-2 top-0 rounded-b-[4px] bg-[#0969e8] px-1.5 py-1 text-center text-[11px] font-extrabold leading-[11px] text-white shadow-sm">
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
        ? ((product.id * 29) % 600) + 1
        : 0,
    deliveryTime: "12-24 HOURS",
    inStock: true,
  };
}

function matchesKeywords(
  product: Product,
  keywords: string[],
) {
  const searchableText = [
    product.brand,
    product.title,
    product.category,
  ]
    .join(" ")
    .toLowerCase();

  return keywords.some((keyword) =>
    searchableText.includes(
      keyword.toLowerCase(),
    ),
  );
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
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(2);
}

function ProductSkeleton() {
  return (
    <div className="sun-splash-product-card shrink-0 overflow-hidden rounded-[10px] border border-[#e4e7ec] bg-white">
      <div className="aspect-square animate-pulse bg-[#eef0f2]" />

      <div className="space-y-3 p-3">
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
    <section className="w-full bg-[#eaf3fd] py-14">
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
    <div className="flex min-h-[320px] w-full items-center justify-center rounded-xl border border-[#dce4eb] bg-white px-6 text-center">
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