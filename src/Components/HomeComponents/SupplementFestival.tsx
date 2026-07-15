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

    return () => controller.abort();
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

    return source.slice(0, MAX_PRODUCTS_PER_SECTION);
  }, [products]);

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
      <section className="relative w-full overflow-hidden bg-white py-10 sm:py-12 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#f3fae8] blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#fff5e7] blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-[1440px] space-y-8 px-4 sm:px-6 lg:px-8">
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
        .supplement-slider-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-inline: contain;
          scroll-padding-inline: 0.5rem;
          -webkit-overflow-scrolling: touch;
        }

        .supplement-slider-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .supplement-product-card {
          width: min(78vw, 270px);
        }

        @media (min-width: 640px) {
          .supplement-product-card {
            width: 230px;
          }
        }

        @media (min-width: 1024px) {
          .supplement-product-card {
            width: calc((100% - 80px) / 6);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .supplement-slider-scroll,
          .supplement-slider-scroll *,
          .supplement-slider-scroll *::before,
          .supplement-slider-scroll *::after {
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
  }, [products.length, updateScrollButtons]);

  const scrollProducts = (
    direction: "left" | "right",
  ) => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-supplement-card]",
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
    <section aria-labelledby={`${id}-title`}>
      <div className="mb-5 grid grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-3">
        <h2
          id={`${id}-title`}
          className="text-[20px] font-bold tracking-[-0.025em] text-[#101828] sm:text-[23px]"
        >
          {title}
        </h2>

        {subtitle && (
          <p className="hidden text-center text-[15px] font-medium text-[#101828] lg:block">
            {subtitle}
          </p>
        )}

        <Link
          href={href}
          className="group inline-flex items-center justify-self-end gap-1 text-sm font-semibold text-[#101828] transition hover:text-[#087b75]"
        >
          see all

          <ChevronRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {subtitle && (
        <p className="mb-4 text-sm font-medium text-[#667085] lg:hidden">
          {subtitle}
        </p>
      )}

      <div className="relative">
        <SliderArrow
          direction="left"
          visible={canScrollLeft}
          onClick={() => scrollProducts("left")}
          label={`Show previous ${title} products`}
        />

        <div
          ref={scrollContainerRef}
          className="supplement-slider-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
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
      className="supplement-product-card group flex shrink-0 snap-start flex-col overflow-hidden rounded-[10px] border border-[#dfe4e8] bg-white shadow-[0_8px_22px_-18px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b9d8d4] hover:shadow-[0_24px_45px_-28px_rgba(15,23,42,0.4)]"
    >
      {!compact && (
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
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.045]"
          />

          <DiscountBadge
            discount={product.discountPercent}
          />
        </Link>
      )}

      <div
        className={`flex flex-1 flex-col ${
          compact ? "min-h-[202px] p-3" : "p-3"
        }`}
      >
        <DeliveryBadge />

        <Link
          href={product.href}
          className="mt-3 block"
        >
          <h3
            className={`line-clamp-2 font-semibold text-[#101010] transition-colors group-hover:text-[#087b75] ${
              compact
                ? "min-h-[46px] text-[15px] leading-[23px]"
                : "min-h-[48px] text-[16px] leading-6"
            }`}
          >
            {product.title}
          </h3>
        </Link>

        {!compact && (
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
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] text-[#667085] line-through">
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
            className={`inline-flex min-h-10 min-w-[48px] shrink-0 items-center justify-center gap-1.5 rounded-[7px] border px-2.5 text-sm font-semibold transition active:scale-[0.97] disabled:cursor-not-allowed ${
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

function PromoBanner() {
  return (
    <Link
      href="/offers/healthcare"
      className="group relative block overflow-hidden rounded-[18px] border border-[#e1e6e8] bg-gradient-to-r from-[#f5f6f7] via-[#eef8f6] to-[#edf5ff] p-5 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.4)] sm:p-7"
    >
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#caeee7]/60 blur-3xl"
      />

      <div className="relative flex min-h-[150px] flex-col justify-center sm:min-h-[175px]">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#087b75] shadow-sm">
          <Pill size={14} />
          Essential healthcare
        </div>

        <h3 className="mt-4 max-w-2xl text-[25px] font-bold tracking-[-0.035em] text-[#101828] sm:text-[32px]">
          Everyday medicines delivered safely to your
          doorstep
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#667085]">
          Browse trusted healthcare products and enjoy
          convenient delivery across Bangladesh.
        </p>

        <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#087b75]">
          Explore medicines

          <ChevronRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
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
      className={`absolute top-[44%] z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6dde1] bg-white text-[#087b75] shadow-[0_8px_22px_-10px_rgba(15,23,42,0.35)] transition-all duration-300 hover:scale-105 hover:border-[#087b75] hover:bg-[#eef9f7] disabled:pointer-events-none ${
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
  const highlighted =
    discount === 45 || discount === 38;

  return (
    <span
      className={`absolute left-2 top-0 rounded-b-[4px] px-1.5 py-1 text-center text-[11px] font-extrabold leading-[11px] text-white shadow-sm ${
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

  return {
    ...product,
    slug: createSlug(product.title),
    href: `/product/${createSlug(product.title)}`,
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

function ProductSkeleton({
  compact,
}: {
  compact: boolean;
}) {
  return (
    <div className="supplement-product-card shrink-0 overflow-hidden rounded-[10px] border border-[#e4e7ec] bg-white">
      {!compact && (
        <div className="aspect-square animate-pulse bg-[#eef0f2]" />
      )}

      <div
        className={`space-y-3 p-3 ${
          compact ? "min-h-[202px]" : ""
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