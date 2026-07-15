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
  href: string;
  type: "new" | "best-selling";
  fallbackStart: number;
  maxProducts: number;
  fixedDiscount?: number;
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
    href: "/new-arrivals",
    type: "new",
    fallbackStart: 0,
    maxProducts: PRODUCTS_PER_SECTION,
  },
  {
    id: "best-selling",
    title: "Best Selling Products",
    href: "/best-selling",
    type: "best-selling",
    fallbackStart: 20,
    maxProducts: PRODUCTS_PER_SECTION,
    fixedDiscount: 10,
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
      <section className="relative w-full overflow-hidden bg-white py-10 sm:py-12 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#f4faf8] blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#fff7ec] blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-[1440px] space-y-14 px-4 sm:px-6 lg:space-y-16 lg:px-8">
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
        .new-best-product-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-inline: contain;
          scroll-padding-inline: 0.5rem;
          -webkit-overflow-scrolling: touch;
        }

        .new-best-product-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .new-best-product-card {
          width: min(78vw, 270px);
        }

        @media (min-width: 640px) {
          .new-best-product-card {
            width: 230px;
          }
        }

        @media (min-width: 1024px) {
          .new-best-product-card {
            width: calc((100% - 80px) / 6);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .new-best-product-scroll,
          .new-best-product-scroll *,
          .new-best-product-scroll *::before,
          .new-best-product-scroll *::after {
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
  config: ProductSectionConfig;
  allProducts: Product[];
  loading: boolean;
  cartItems: number[];
  onToggleCart: (productId: number) => void;
}) {
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
          config.fixedDiscount!,
        ),
      );
    }

    return selectedProducts;
  }, [allProducts, config]);

  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const maximumScrollLeft =
      container.scrollWidth -
      container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 4);

    setCanScrollRight(
      container.scrollLeft <
        maximumScrollLeft - 4,
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

    let resizeObserver:
      | ResizeObserver
      | null = null;

    if (
      typeof ResizeObserver !== "undefined"
    ) {
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
        "[data-new-best-card]",
      );

    if (!firstCard) return;

    const styles =
      window.getComputedStyle(container);

    const gap =
      Number.parseFloat(
        styles.columnGap ||
          styles.gap ||
          "16",
      ) || 16;

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const scrollAmount =
      (cardWidth + gap) *
      PRODUCTS_PER_VIEW;

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
      aria-labelledby={`${config.id}-title`}
    >
      <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
        <h2
          id={`${config.id}-title`}
          className="text-[20px] font-bold tracking-[-0.025em] text-[#101828] sm:text-[23px]"
        >
          {config.title}
        </h2>

        <Link
          href={config.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#101828] transition-colors hover:text-[#087b75]"
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
          label={`Show previous ${config.title} products`}
          onClick={() =>
            scrollProducts("left")
          }
        />

        <div
          ref={scrollContainerRef}
          className="new-best-product-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
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
      data-new-best-card
      className="new-best-product-card group flex shrink-0 snap-start flex-col overflow-hidden rounded-[10px] border border-[#dfe4e8] bg-white shadow-[0_8px_22px_-18px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b9d8d4] hover:shadow-[0_24px_45px_-28px_rgba(15,23,42,0.4)]"
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
          discount={
            product.displayDiscount
          }
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

          <span className="ml-1.5 text-[12px] text-[#667085]">
            ({product.displayReviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] text-[#667085] line-through">
              {product.currencySymbol}
              {formatPrice(
                product.displayOriginalPrice,
              )}
            </p>

            <p className="mt-0.5 text-[18px] font-bold text-[#101010]">
              {product.currencySymbol}
              {formatPrice(
                product.salePrice,
              )}
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
  const salePrice = Number(product.price);

  const displayDiscount =
    typeof product.discountPercent ===
    "number"
      ? product.discountPercent
      : fallbackDiscounts[
          index %
            fallbackDiscounts.length
        ];

  const displayOriginalPrice =
    typeof product.originalPrice ===
    "number"
      ? product.originalPrice
      : Number(
          (
            salePrice /
            (1 -
              displayDiscount / 100)
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
      typeof product.reviewCount ===
      "number"
        ? product.reviewCount
        : product.rating !== null
          ? ((product.id * 37) % 160) + 1
          : 0,
    deliveryTime: "12-24 HOURS",
    available:
      product.inStock !== false,
  };
}

function sortNewestProducts(
  first: Product,
  second: Product,
) {
  const firstTimestamp =
    first.createdAt &&
    !Number.isNaN(
      Date.parse(first.createdAt),
    )
      ? Date.parse(first.createdAt)
      : first.id;

  const secondTimestamp =
    second.createdAt &&
    !Number.isNaN(
      Date.parse(second.createdAt),
    )
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
    (first.displayReviewCount ?? 0) * 10 +
    (first.rating ?? 0);

  const secondScore =
    (second.salesCount ?? 0) * 1000 +
    (second.displayReviewCount ?? 0) * 10 +
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
    <div className="new-best-product-card shrink-0 overflow-hidden rounded-[10px] border border-[#e4e7ec] bg-white">
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
    <div className="flex min-h-[320px] w-full items-center justify-center rounded-xl border border-[#e0e5e8] bg-white px-6 text-center">
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