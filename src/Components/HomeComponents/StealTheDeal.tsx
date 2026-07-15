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

type Product = {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  brand: string;
  category: string;
  image: string;
  discountPercent: number;
  offerLabel: string;
  deliveryTime: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  salePrice: number;
  currency: string;
  featured: boolean;
  inStock: boolean;
  href: string;
};

const PRODUCTS_TO_SHOW = 6;

export default function StealTheDeal() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

        const data = (await response.json()) as Product[];

        if (!Array.isArray(data)) {
          throw new Error("Invalid product data format.");
        }

        setProducts(data);
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

  const visibleProducts = useMemo(() => {
    const featuredProducts = products.filter(
      (product) => product.featured && product.inStock,
    );

    const source =
      featuredProducts.length >= PRODUCTS_TO_SHOW
        ? featuredProducts
        : products.filter((product) => product.inStock);

    return source.slice(0, PRODUCTS_TO_SHOW);
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
  }, [updateScrollButtons, visibleProducts.length]);

  const scrollProducts = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const amount = Math.max(
      container.clientWidth * 0.8,
      300,
    );

    container.scrollBy({
      left: direction === "right" ? amount : -amount,
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

  return (
    <section className="relative w-full overflow-hidden bg-[#fff0fa] py-10 sm:py-12 lg:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#ffd9f1]/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-[#ffe9f7]/70 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e82ca3] sm:text-xs">
              Limited-time beauty offers
            </p>

            <h2 className="mt-1 text-[21px] font-bold tracking-[-0.025em] text-[#ff3db9] sm:text-[24px]">
              skin&apos;O X innsaei: Steal the Deal
            </h2>
          </div>

          <Link
            href="/offers"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#ff3db9] transition-colors hover:text-[#d82496]"
          >
            See all

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
            aria-label="Show previous products"
            className={`absolute left-0 top-[44%] z-30 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9dfe3] bg-white text-[#087b75] shadow-[0_8px_24px_-10px_rgba(15,23,42,0.35)] transition-all duration-300 hover:scale-105 hover:border-[#087b75] hover:bg-[#f0faf8] disabled:pointer-events-none ${
              canScrollLeft
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={scrollContainerRef}
            className="steal-deal-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
          >
            {loading &&
              Array.from({
                length: PRODUCTS_TO_SHOW,
              }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}

            {!loading &&
              !loadError &&
              visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  added={cartItems.includes(product.id)}
                  onToggleCart={() =>
                    toggleCartItem(product.id)
                  }
                />
              ))}

            {!loading &&
              !loadError &&
              visibleProducts.length === 0 && (
                <EmptyState />
              )}

            {!loading && loadError && (
              <ErrorState message={loadError} />
            )}
          </div>

          <button
            type="button"
            onClick={() => scrollProducts("right")}
            disabled={!canScrollRight}
            aria-label="Show more products"
            className={`absolute right-0 top-[44%] z-30 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9dfe3] bg-white text-[#087b75] shadow-[0_8px_24px_-10px_rgba(15,23,42,0.35)] transition-all duration-300 hover:scale-105 hover:border-[#087b75] hover:bg-[#f0faf8] disabled:pointer-events-none ${
              canScrollRight
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .steal-deal-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-inline: contain;
          scroll-padding-inline: 0.5rem;
          -webkit-overflow-scrolling: touch;
        }

        .steal-deal-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .steal-deal-scroll,
          .steal-deal-scroll *,
          .steal-deal-scroll *::before,
          .steal-deal-scroll *::after {
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

function ProductCard({
  product,
  added,
  onToggleCart,
}: {
  product: Product;
  added: boolean;
  onToggleCart: () => void;
}) {
  const roundedRating = Math.round(product.rating);

  return (
    <article className="group flex w-[215px] shrink-0 snap-start flex-col overflow-hidden rounded-[10px] border border-[#dfe4e8] bg-white shadow-[0_7px_18px_-16px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#e1bdd7] hover:shadow-[0_24px_42px_-25px_rgba(15,23,42,0.4)] sm:w-[220px] lg:w-[calc((100%-80px)/6)] lg:min-w-[205px]">
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
              "https://placehold.co/600x600/fdf2f8/0f766e?text=Product";
          }}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
        />

        <span className="absolute left-2 top-0 rounded-b-[4px] bg-[#0969e8] px-1.5 py-1 text-center text-[10px] font-extrabold leading-[11px] text-white shadow-sm">
          {product.discountPercent}%
          <br />
          OFF
        </span>

        {!product.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-sm font-semibold text-white backdrop-blur-[1px]">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-[5px] bg-[#f0f1f3] px-2 py-1.5 text-[10px] font-semibold text-[#202939]">
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
          <h3 className="line-clamp-2 min-h-[48px] text-[16px] font-semibold leading-6 text-[#101010] transition-colors duration-200 group-hover:text-[#087b75]">
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
                    : "#e5e7eb"
                }
                strokeWidth={0}
                className={
                  index < roundedRating
                    ? "text-[#ffb400]"
                    : "text-[#e5e7eb]"
                }
              />
            ),
          )}

          <span className="ml-1.5 text-xs text-[#667085]">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-[13px] text-[#667085] line-through">
              {product.currency} {product.originalPrice}
            </p>

            <p className="mt-0.5 text-[18px] font-bold text-black">
              {product.currency} {product.salePrice}
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
                ? "border-[#087b75] bg-[#087b75] text-white shadow-[0_8px_18px_-10px_rgba(8,123,117,0.7)]"
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

function ProductSkeleton() {
  return (
    <div className="w-[215px] shrink-0 overflow-hidden rounded-[10px] border border-[#e4e7ec] bg-white sm:w-[220px] lg:min-w-[205px]">
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
    <div className="flex min-h-[360px] w-full items-center justify-center rounded-2xl border border-[#f0c5df] bg-white px-6 text-center">
      <div>
        <ShoppingCart
          size={34}
          className="mx-auto text-[#d92d20]"
        />

        <p className="mt-3 font-semibold text-[#b42318]">
          Product data could not be loaded
        </p>

        <p className="mt-2 text-sm text-[#667085]">
          {message}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-[#087b75] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#066b66]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center rounded-2xl border border-[#eadce5] bg-white px-6 text-center">
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