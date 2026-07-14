"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  WheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type CategoryItem = {
  label: string;
  href: string;
};

const categories: CategoryItem[] = [
  { label: "Home", href: "/" },
  { label: "Medicine", href: "/medicine" },
  { label: "Healthcare", href: "/healthcare" },
  { label: "Beauty", href: "/beauty" },
  { label: "Sexual Wellness", href: "/sexual-wellness" },
  { label: "Baby & Mom Care", href: "/baby-mom-care" },
  { label: "Herbal", href: "/herbal" },
  { label: "Home Care", href: "/home-care" },
  { label: "Supplement", href: "/supplement" },
  { label: "Food and Nutrition", href: "/food-and-nutrition" },
  { label: "Pet Care", href: "/pet-care" },
  { label: "Veterinary", href: "/veterinary" },
  { label: "Homeopathy", href: "/homeopathy" },
  {
    label: "Browse by Health Concern",
    href: "/health-concern",
  },
  { label: "Vital Organs", href: "/vital-organs" },
  {
    label: "Life Style Package",
    href: "/life-style-package",
  },
  {
    label: "Checkups for Women",
    href: "/checkups-for-women",
  },
  {
    label: "Checkups for Men",
    href: "/checkups-for-men",
  },
];

export default function CategoryNav() {
  const pathname = usePathname();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }

      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const maxScrollLeft =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(
      container.scrollLeft < maxScrollLeft - 4,
    );
  }, []);

  const getScrollAmount = () => {
    const container = scrollContainerRef.current;

    if (!container) {
      return 500;
    }

    return Math.max(container.clientWidth * 0.72, 420);
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth",
    });
  };

  const handleWheel = (
    event: WheelEvent<HTMLDivElement>,
  ) => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const horizontalMovement =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    if (horizontalMovement === 0) {
      return;
    }

    event.preventDefault();

    container.scrollBy({
      left: horizontalMovement * 1.25,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    updateScrollButtons();

    const handleScroll = () => {
      updateScrollButtons();
    };

    const resizeObserver = new ResizeObserver(() => {
      updateScrollButtons();
    });

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    resizeObserver.observe(container);

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll,
      );

      resizeObserver.disconnect();
    };
  }, [updateScrollButtons]);

  useEffect(() => {
    const activeLink = activeLinkRef.current;

    if (!activeLink) {
      return;
    }

    const timeout = window.setTimeout(() => {
      activeLink.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }, 100);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <section className="w-full border-y border-[#e6e9ed] bg-white">
      <div className="relative mx-auto flex h-[66px] w-full max-w-[1420px] items-stretch px-4 sm:px-6 lg:px-8">
        {/* Left fade and arrow */}
        <div
          className={`absolute bottom-0 left-4 top-0 z-20 flex items-center bg-gradient-to-r from-white via-white to-transparent pr-5 transition-all duration-300 sm:left-6 lg:left-8 ${
            canScrollLeft
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none -translate-x-2 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Show previous categories"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px] border border-[#e1e5e9] bg-white text-[#4b5563] shadow-[0_2px_8px_rgba(15,23,42,0.07)] transition duration-200 hover:border-[#087b75] hover:bg-[#f1f9f8] hover:text-[#087b75] active:scale-95 disabled:cursor-default"
          >
            <ChevronLeft size={19} strokeWidth={1.7} />
          </button>
        </div>

        {/* Scrollable category area */}
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="category-scroll-container flex min-w-0 flex-1 items-stretch overflow-x-auto overflow-y-hidden"
        >
          <nav className="flex min-w-max items-stretch px-0">
            {categories.map((category) => {
              const active = isActive(category.href);

              return (
                <Link
                  key={category.href}
                  ref={
                    active
                      ? activeLinkRef
                      : undefined
                  }
                  href={category.href}
                  className={`group relative flex h-full shrink-0 items-center whitespace-nowrap px-[18px] text-[14px] font-medium transition-colors duration-200 ${
                    active
                      ? "text-[#087b75]"
                      : "text-[#222936] hover:text-[#087b75]"
                  }`}
                >
                  {category.label}

                  <span
                    className={`absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-t-[3px] bg-[#087b75] transition-all duration-300 ${
                      active
                        ? "w-[74px] opacity-100"
                        : "w-0 opacity-0 group-hover:w-[34px] group-hover:opacity-45"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right fade and arrow */}
        <div
          className={`absolute bottom-0 right-4 top-0 z-20 flex items-center bg-gradient-to-l from-white via-white to-transparent pl-5 transition-all duration-300 sm:right-6 lg:right-8 ${
            canScrollRight
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none translate-x-2 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Show more categories"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px] border border-[#e1e5e9] bg-white text-[#4b5563] shadow-[0_2px_8px_rgba(15,23,42,0.07)] transition duration-200 hover:border-[#087b75] hover:bg-[#f1f9f8] hover:text-[#087b75] active:scale-95 disabled:cursor-default"
          >
            <ChevronRight size={19} strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </section>
  );
}