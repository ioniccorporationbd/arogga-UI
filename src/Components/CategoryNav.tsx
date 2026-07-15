"use client";

import {
  ChevronLeft,
  ChevronRight,
  Home,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  WheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type CategoryItem = {
  label: string;
  href: string;
  featured?: boolean;
};

const categories: CategoryItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Medicine",
    href: "/medicine",
  },
  {
    label: "Healthcare",
    href: "/healthcare",
  },
  {
    label: "Beauty",
    href: "/beauty",
  },
  {
    label: "Sexual Wellness",
    href: "/sexual-wellness",
  },
  {
    label: "Baby & Mom Care",
    href: "/baby-mom-care",
  },
  {
    label: "Herbal",
    href: "/herbal",
  },
  {
    label: "Home Care",
    href: "/home-care",
  },
  {
    label: "Supplement",
    href: "/supplement",
  },
  {
    label: "Food and Nutrition",
    href: "/food-and-nutrition",
  },
  {
    label: "Pet Care",
    href: "/pet-care",
  },
  {
    label: "Veterinary",
    href: "/veterinary",
  },
  {
    label: "Homeopathy",
    href: "/homeopathy",
  },
  {
    label: "Browse by Health Concern",
    href: "/health-concern",
    featured: true,
  },
  {
    label: "Vital Organs",
    href: "/vital-organs",
  },
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

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);
  const wheelAnimationRef = useRef<number | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStateRef = useRef({
    startX: 0,
    startScrollLeft: 0,
    pointerId: 0,
  });

  const activeCategory = useMemo(() => {
    return categories.find((category) => {
      if (category.href === "/") {
        return pathname === "/";
      }

      return (
        pathname === category.href ||
        pathname.startsWith(`${category.href}/`)
      );
    });
  }, [pathname]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }

      return (
        pathname === href ||
        pathname.startsWith(`${href}/`)
      );
    },
    [pathname],
  );

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const maxScrollLeft = Math.max(
      container.scrollWidth - container.clientWidth,
      0,
    );

    const currentScrollLeft = Math.max(
      Math.min(container.scrollLeft, maxScrollLeft),
      0,
    );

    setCanScrollLeft(currentScrollLeft > 5);
    setCanScrollRight(
      currentScrollLeft < maxScrollLeft - 5,
    );

    setScrollProgress(
      maxScrollLeft > 0
        ? (currentScrollLeft / maxScrollLeft) * 100
        : 100,
    );
  }, []);

  const getScrollAmount = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return 420;

    return Math.max(
      Math.min(container.clientWidth * 0.72, 720),
      320,
    );
  }, []);

  const scrollByAmount = useCallback(
    (amount: number) => {
      const container = scrollContainerRef.current;

      if (!container) return;

      container.scrollBy({
        left: amount,
        behavior: "smooth",
      });
    },
    [],
  );

  const scrollLeft = useCallback(() => {
    scrollByAmount(-getScrollAmount());
  }, [getScrollAmount, scrollByAmount]);

  const scrollRight = useCallback(() => {
    scrollByAmount(getScrollAmount());
  }, [getScrollAmount, scrollByAmount]);

  const handleWheel = (
    event: WheelEvent<HTMLDivElement>,
  ) => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const movement =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    if (Math.abs(movement) < 1) return;

    const maxScrollLeft =
      container.scrollWidth - container.clientWidth;

    const movingRight = movement > 0;
    const atLeftEdge = container.scrollLeft <= 0;
    const atRightEdge =
      container.scrollLeft >= maxScrollLeft - 1;

    if (
      (movingRight && atRightEdge) ||
      (!movingRight && atLeftEdge)
    ) {
      return;
    }

    event.preventDefault();

    if (wheelAnimationRef.current !== null) {
      window.cancelAnimationFrame(
        wheelAnimationRef.current,
      );
    }

    wheelAnimationRef.current =
      window.requestAnimationFrame(() => {
        container.scrollLeft += movement * 1.1;
        updateScrollState();
      });
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const container = scrollContainerRef.current;

    if (!container || event.pointerType === "touch") {
      return;
    }

    dragStateRef.current = {
      startX: event.clientX,
      startScrollLeft: container.scrollLeft,
      pointerId: event.pointerId,
    };

    setIsDragging(true);

    container.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const container = scrollContainerRef.current;

    if (!container || !isDragging) return;

    const distance =
      event.clientX - dragStateRef.current.startX;

    container.scrollLeft =
      dragStateRef.current.startScrollLeft - distance;

    updateScrollState();
  };

  const stopDragging = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const container = scrollContainerRef.current;

    if (!container || !isDragging) return;

    setIsDragging(false);

    if (
      container.hasPointerCapture(
        dragStateRef.current.pointerId,
      )
    ) {
      container.releasePointerCapture(
        dragStateRef.current.pointerId,
      );
    }

    updateScrollState();
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    updateScrollState();

    const handleScroll = () => {
      updateScrollState();
    };

    container.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateScrollState();
      });

      resizeObserver.observe(container);
    } else {
      window.addEventListener(
        "resize",
        updateScrollState,
      );
    }

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll,
      );

      resizeObserver?.disconnect();

      window.removeEventListener(
        "resize",
        updateScrollState,
      );

      if (wheelAnimationRef.current !== null) {
        window.cancelAnimationFrame(
          wheelAnimationRef.current,
        );
      }
    };
  }, [updateScrollState]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const activeLink = activeLinkRef.current;

    if (!container || !activeLink) return;

    const timeout = window.setTimeout(() => {
      const containerRect =
        container.getBoundingClientRect();

      const activeRect =
        activeLink.getBoundingClientRect();

      const activeCenter =
        activeRect.left +
        activeRect.width / 2 -
        containerRect.left;

      const targetScrollLeft =
        container.scrollLeft +
        activeCenter -
        container.clientWidth / 2;

      container.scrollTo({
        left: Math.max(targetScrollLeft, 0),
        behavior: "smooth",
      });
    }, 120);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <>
      <section
        className="category-navbar-section"
        aria-label="Product categories"
      >
        <div className="category-navbar-container">
          <div className="category-navbar-shell">
            <div
              aria-hidden="true"
              className="category-navbar-top-glow"
            />

            {/* Active category information */}
            <div className="category-navbar-current">
              <span className="category-navbar-current-icon">
                {activeCategory?.href === "/" ? (
                  <Home size={17} strokeWidth={1.8} />
                ) : (
                  <Sparkles
                    size={17}
                    strokeWidth={1.8}
                  />
                )}
              </span>

              <span className="category-navbar-current-text">
                <small>Browsing</small>
                <strong>
                  {activeCategory?.label ?? "Categories"}
                </strong>
              </span>
            </div>

            <div className="category-navbar-divider" />

            {/* Left navigation control */}
            <div
              className={`category-navbar-edge category-navbar-edge-left ${
                canScrollLeft ? "is-visible" : ""
              }`}
            >
              <button
                type="button"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                aria-label="Show previous categories"
              >
                <ChevronLeft
                  size={19}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            {/* Scrollable navigation */}
            <div
              ref={scrollContainerRef}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              onPointerLeave={(event) => {
                if (isDragging) {
                  stopDragging(event);
                }
              }}
              className={`category-navbar-scroll ${
                isDragging ? "is-dragging" : ""
              }`}
            >
              <nav
                className="category-navbar-list"
                aria-label="Category navigation"
              >
                {categories.map((category) => {
                  const active = isActive(
                    category.href,
                  );

                  return (
                    <Link
                      key={category.href}
                      ref={(element) => {
                        if (active) {
                          activeLinkRef.current =
                            element;
                        }
                      }}
                      href={category.href}
                      aria-current={
                        active ? "page" : undefined
                      }
                      className={`category-navbar-link ${
                        active ? "is-active" : ""
                      } ${
                        category.featured
                          ? "is-featured"
                          : ""
                      }`}
                      draggable={false}
                    >
                      {category.href === "/" && (
                        <Home
                          size={15}
                          strokeWidth={1.8}
                          className="category-navbar-home-icon"
                        />
                      )}

                      {category.featured && (
                        <Sparkles
                          size={14}
                          strokeWidth={1.8}
                          className="category-navbar-featured-icon"
                        />
                      )}

                      <span>{category.label}</span>

                      {category.featured && (
                        <small>Popular</small>
                      )}

                      <i aria-hidden="true" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right navigation control */}
            <div
              className={`category-navbar-edge category-navbar-edge-right ${
                canScrollRight ? "is-visible" : ""
              }`}
            >
              <button
                type="button"
                onClick={scrollRight}
                disabled={!canScrollRight}
                aria-label="Show more categories"
              >
                <ChevronRight
                  size={19}
                  strokeWidth={1.8}
                />
              </button>
            </div>
          </div>

          {/* Scroll progress */}
          <div
            className={`category-navbar-progress ${
              canScrollLeft || canScrollRight
                ? "is-visible"
                : ""
            }`}
            aria-hidden="true"
          >
            <span
              style={{
                width: `${Math.max(
                  scrollProgress,
                  4,
                )}%`,
              }}
            />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .category-navbar-section {
          --category-primary: #087b75;
          --category-primary-dark: #056b66;
          --category-primary-light: #e9f8f5;
          --category-text: #27303d;
          --category-muted: #7a8594;

          position: relative;
          z-index: 35;
          width: 100%;
          border-bottom: 1px solid
            rgba(15, 23, 42, 0.075);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.99),
              rgba(250, 253, 252, 0.97)
            );
          box-shadow: 0 7px 20px -22px
            rgba(15, 23, 42, 0.45);
        }

        .category-navbar-container {
          width: min(1440px, calc(100% - 32px));
          margin: 0 auto;
          padding: 8px 0 6px;
        }

        .category-navbar-shell {
          position: relative;
          min-width: 0;
          min-height: 52px;
          display: flex;
          align-items: stretch;
          overflow: visible;
          border: 1px solid
            rgba(15, 23, 42, 0.075);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow:
            0 16px 35px -30px
              rgba(15, 23, 42, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(18px);
        }

        .category-navbar-top-glow {
          position: absolute;
          top: -1px;
          left: 16%;
          width: 32%;
          height: 1px;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(8, 123, 117, 0.4),
            transparent
          );
        }

        .category-navbar-current {
          min-width: 158px;
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
          padding: 7px 14px 7px 10px;
        }

        .category-navbar-current-icon {
          width: 35px;
          height: 35px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 11px;
          color: white;
          background: linear-gradient(
            135deg,
            #0b958a,
            var(--category-primary)
          );
          box-shadow: 0 10px 18px -11px
            rgba(8, 123, 117, 0.9);
        }

        .category-navbar-current-text {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .category-navbar-current-text small {
          color: var(--category-muted);
          font-size: 12px;
          font-weight: 650;
          line-height: 1.3;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .category-navbar-current-text strong {
          max-width: 122px;
          overflow: hidden;
          color: #101828;
          font-size: 12px;
          font-weight: 750;
          line-height: 1.35;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .category-navbar-divider {
          width: 1px;
          align-self: center;
          height: 30px;
          flex-shrink: 0;
          background: rgba(15, 23, 42, 0.08);
        }

        .category-navbar-scroll {
          min-width: 0;
          display: flex;
          flex: 1;
          align-items: stretch;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-inline: contain;
          scroll-snap-type: x proximity;
          cursor: grab;
          touch-action: pan-x;
          user-select: none;
          -webkit-overflow-scrolling: touch;
        }

        .category-navbar-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .category-navbar-scroll.is-dragging {
          cursor: grabbing;
          scroll-behavior: auto;
          scroll-snap-type: none;
        }

        .category-navbar-list {
          display: flex;
          min-width: max-content;
          align-items: stretch;
          gap: 5px;
          padding: 6px 56px 6px 8px;
        }

        .category-navbar-link {
          position: relative;
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-shrink: 0;
          scroll-snap-align: center;
          padding: 0 14px;
          border: 1px solid transparent;
          border-radius: 12px;
          color: var(--category-text);
          background: transparent;
          font-size: 12px;
          font-weight: 650;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          transition:
            color 220ms ease,
            border-color 220ms ease,
            background-color 220ms ease,
            box-shadow 220ms ease,
            transform 220ms ease;
        }

        .category-navbar-link:hover {
          color: var(--category-primary);
          border-color: rgba(8, 123, 117, 0.12);
          background: #f1faf8;
          box-shadow: 0 10px 20px -18px
            rgba(8, 123, 117, 0.65);
          transform: translateY(-1px);
        }

        .category-navbar-link.is-active {
          color: white;
          border-color: rgba(8, 123, 117, 0.25);
          background: linear-gradient(
            135deg,
            #0a9187 0%,
            var(--category-primary) 58%,
            var(--category-primary-dark) 100%
          );
          box-shadow:
            0 12px 23px -15px
              rgba(8, 123, 117, 0.95),
            inset 0 1px rgba(255, 255, 255, 0.18);
          transform: translateY(-1px);
        }

        .category-navbar-link.is-featured:not(
            .is-active
          ) {
          color: #80541a;
          border-color: rgba(209, 142, 46, 0.15);
          background: linear-gradient(
            135deg,
            #fffaf0,
            #fff4db
          );
        }

        .category-navbar-link.is-featured:hover:not(
            .is-active
          ) {
          color: #a15b08;
          border-color: rgba(209, 142, 46, 0.28);
          background: #fff4dc;
        }

        .category-navbar-link small {
          padding: 3px 5px;
          border-radius: 999px;
          color: #92570d;
          background: rgba(255, 255, 255, 0.78);
          font-size: 12px;
          font-weight: 800;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .category-navbar-link.is-active small {
          color: var(--category-primary);
          background: rgba(255, 255, 255, 0.94);
        }

        .category-navbar-link i {
          position: absolute;
          right: 12px;
          bottom: 3px;
          left: 12px;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          opacity: 0;
          transform: scaleX(0.25);
          transition:
            opacity 220ms ease,
            transform 240ms
              cubic-bezier(0.22, 1, 0.36, 1);
        }

        .category-navbar-link:hover i {
          opacity: 0.35;
          transform: scaleX(0.65);
        }

        .category-navbar-link.is-active i {
          background: rgba(255, 255, 255, 0.85);
          opacity: 1;
          transform: scaleX(0.7);
        }

        .category-navbar-home-icon,
        .category-navbar-featured-icon {
          flex-shrink: 0;
        }

        .category-navbar-edge {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 12;
          display: flex;
          align-items: center;
          pointer-events: none;
          opacity: 0;
          transition:
            opacity 220ms ease,
            transform 220ms ease;
        }

        .category-navbar-edge.is-visible {
          pointer-events: auto;
          opacity: 1;
          transform: translateX(0);
        }

        .category-navbar-edge-left {
          left: 159px;
          padding: 0 27px 0 9px;
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            rgba(255, 255, 255, 0.98) 58%,
            transparent 100%
          );
          transform: translateX(-8px);
        }

        .category-navbar-edge-right {
          right: 0;
          padding: 0 9px 0 28px;
          background: linear-gradient(
            270deg,
            #ffffff 0%,
            rgba(255, 255, 255, 0.98) 58%,
            transparent 100%
          );
          transform: translateX(8px);
        }

        .category-navbar-edge button {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid
            rgba(15, 23, 42, 0.1);
          border-radius: 11px;
          color: #475467;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 9px 20px -15px
            rgba(15, 23, 42, 0.6);
          cursor: pointer;
          transition:
            color 200ms ease,
            border-color 200ms ease,
            background-color 200ms ease,
            box-shadow 200ms ease,
            transform 200ms ease;
        }

        .category-navbar-edge button:hover {
          color: var(--category-primary);
          border-color: rgba(8, 123, 117, 0.24);
          background: var(--category-primary-light);
          box-shadow: 0 12px 24px -14px
            rgba(8, 123, 117, 0.55);
          transform: scale(1.04);
        }

        .category-navbar-edge button:active {
          transform: scale(0.96);
        }

        .category-navbar-edge button:focus-visible,
        .category-navbar-link:focus-visible {
          outline: 3px solid
            rgba(8, 123, 117, 0.2);
          outline-offset: 2px;
        }

        .category-navbar-progress {
          width: calc(100% - 20px);
          height: 2px;
          overflow: hidden;
          margin: 5px auto 0;
          border-radius: 999px;
          background: rgba(8, 123, 117, 0.07);
          opacity: 0;
          transition: opacity 220ms ease;
        }

        .category-navbar-progress.is-visible {
          opacity: 1;
        }

        .category-navbar-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            var(--category-primary),
            #37b9ab
          );
          box-shadow: 0 0 8px
            rgba(8, 123, 117, 0.45);
          transition: width 120ms linear;
        }

        @media (max-width: 1100px) {
          .category-navbar-current {
            min-width: 136px;
          }

          .category-navbar-current-text strong {
            max-width: 96px;
          }

          .category-navbar-edge-left {
            left: 137px;
          }

          .category-navbar-link {
            padding: 0 13px;
            font-size: 12px;
          }
        }

        @media (max-width: 760px) {
          .category-navbar-container {
            width: 100%;
            padding: 7px 0 5px;
          }

          .category-navbar-shell {
            min-height: 50px;
            border-right: 0;
            border-left: 0;
            border-radius: 0;
          }

          .category-navbar-current,
          .category-navbar-divider {
            display: none;
          }

          .category-navbar-list {
            gap: 7px;
            padding: 5px 52px 5px 12px;
          }

          .category-navbar-link {
            min-height: 39px;
            padding: 0 13px;
            border-color: rgba(15, 23, 42, 0.07);
            background: #f8faf9;
            font-size: 12px;
          }

          .category-navbar-link.is-active {
            border-color: transparent;
          }

          .category-navbar-edge-left {
            left: 0;
          }

          .category-navbar-edge-left,
          .category-navbar-edge-right {
            padding-right: 20px;
            padding-left: 8px;
          }

          .category-navbar-edge-right {
            padding-right: 8px;
            padding-left: 20px;
          }

          .category-navbar-edge button {
            width: 34px;
            height: 34px;
            border-radius: 10px;
          }

          .category-navbar-progress {
            width: calc(100% - 24px);
            margin-top: 4px;
          }
        }

        @media (max-width: 480px) {
          .category-navbar-list {
            gap: 6px;
            padding-left: 9px;
          }

          .category-navbar-link {
            min-height: 37px;
            padding: 0 12px;
            border-radius: 11px;
            font-size: 10.5px;
          }

          .category-navbar-link small {
            display: none;
          }

          .category-navbar-edge button {
            width: 32px;
            height: 32px;
          }
        }

        @media (hover: none) {
          .category-navbar-scroll {
            cursor: auto;
            scroll-snap-type: x mandatory;
          }

          .category-navbar-edge {
            display: none;
          }

          .category-navbar-list {
            padding-right: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-navbar-section *,
          .category-navbar-section *::before,
          .category-navbar-section *::after {
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