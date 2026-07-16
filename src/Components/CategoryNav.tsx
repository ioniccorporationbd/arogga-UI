"use client";

import {
  Baby,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Home,
  Leaf,
  Package,
  PawPrint,
  Pill,
  ShieldPlus,
  ShoppingBag,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type CategoryItem = {
  id: number;
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
};

const categories: CategoryItem[] = [
  {
    id: 1,
    label: "Home",
    href: "/",
    icon: <Home size={18} strokeWidth={1.8} />,
  },
  {
    id: 2,
    label: "Medicine",
    href: "/medicine",
    icon: <Pill size={18} strokeWidth={1.8} />,
  },
  {
    id: 3,
    label: "Beauty",
    href: "/beauty",
    icon: <Sparkles size={18} strokeWidth={1.8} />,
  },
  {
    id: 4,
    label: "Baby and Mom",
    href: "/baby-mom-care",
    icon: <Baby size={18} strokeWidth={1.8} />,
  },
  {
    id: 5,
    label: "Food & Nutrition",
    href: "/food-and-nutrition",
    icon: <ShoppingBag size={18} strokeWidth={1.8} />,
  },
  {
    id: 6,
    label: "Healthcare",
    href: "/healthcare",
    icon: <HeartPulse size={18} strokeWidth={1.8} />,
  },
  {
    id: 7,
    label: "Homecare",
    href: "/home-care",
    icon: <Package size={18} strokeWidth={1.8} />,
  },
  {
    id: 8,
    label: "Supplements",
    href: "/supplement",
    icon: <ShieldPlus size={18} strokeWidth={1.8} />,
  },
  {
    id: 9,
    label: "Herbal",
    href: "/herbal",
    icon: <Leaf size={18} strokeWidth={1.8} />,
  },
  {
    id: 10,
    label: "Sexual Wellness",
    href: "/sexual-wellness",
    icon: <HeartPulse size={18} strokeWidth={1.8} />,
  },
  {
    id: 11,
    label: "Petcare",
    href: "/pet-care",
    icon: <PawPrint size={18} strokeWidth={1.8} />,
  },
  {
    id: 12,
    label: "Homeopathy",
    href: "/homeopathy",
    icon: <Stethoscope size={18} strokeWidth={1.8} />,
  },
  {
    id: 13,
    label: "Veterinary",
    href: "/veterinary",
    icon: <PawPrint size={18} strokeWidth={1.8} />,
  },
  {
    id: 14,
    label: "Haircare",
    href: "/haircare",
    icon: <Sparkles size={18} strokeWidth={1.8} />,
  },
  {
    id: 15,
    label: "Skincare",
    href: "/skincare",
    icon: <Sparkles size={18} strokeWidth={1.8} />,
    badge: "Popular",
  },
  {
    id: 16,
    label: "Feminine Care",
    href: "/feminine-care",
    icon: <HeartPulse size={18} strokeWidth={1.8} />,
  },
  {
    id: 17,
    label: "Cream & Moisturizer",
    href: "/cream-moisturizer",
    icon: <Sparkles size={18} strokeWidth={1.8} />,
  },
];

export default function CategoryNav() {
  const pathname = usePathname();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  const pointerStateRef = useRef({
    pointerId: 0,
    startX: 0,
    initialScrollLeft: 0,
  });

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const activeCategory = useMemo(() => {
    return categories.find((category) =>
      checkActiveRoute(pathname, category.href),
    );
  }, [pathname]);

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const maximumScroll =
      container.scrollWidth - container.clientWidth;

    const currentScroll = Math.max(
      0,
      Math.min(container.scrollLeft, maximumScroll),
    );

    setCanScrollLeft(currentScroll > 4);
    setCanScrollRight(
      maximumScroll > 4 &&
        currentScroll < maximumScroll - 4,
    );

    setScrollProgress(
      maximumScroll > 0
        ? (currentScroll / maximumScroll) * 100
        : 100,
    );
  }, []);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    updateScrollState();

    container.addEventListener(
      "scroll",
      updateScrollState,
      {
        passive: true,
      },
    );

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(
        updateScrollState,
      );

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
        updateScrollState,
      );

      resizeObserver?.disconnect();

      window.removeEventListener(
        "resize",
        updateScrollState,
      );
    };
  }, [updateScrollState]);

  useEffect(() => {
    const container = scrollRef.current;
    const activeLink = activeLinkRef.current;

    if (!container || !activeLink) {
      return;
    }

    const timer = window.setTimeout(() => {
      const containerRect =
        container.getBoundingClientRect();

      const linkRect =
        activeLink.getBoundingClientRect();

      const currentLinkCenter =
        linkRect.left -
        containerRect.left +
        linkRect.width / 2;

      const targetScroll =
        container.scrollLeft +
        currentLinkCenter -
        container.clientWidth / 2;

      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname]);

  const getScrollDistance = useCallback(() => {
    const container = scrollRef.current;

    if (!container) {
      return 400;
    }

    if (window.innerWidth >= 1280) {
      return Math.max(container.clientWidth * 0.65, 600);
    }

    if (window.innerWidth >= 768) {
      return Math.max(container.clientWidth * 0.7, 420);
    }

    return Math.max(container.clientWidth * 0.82, 280);
  }, []);

  const scrollCategories = useCallback(
    (direction: "left" | "right") => {
      const container = scrollRef.current;

      if (!container) {
        return;
      }

      const distance = getScrollDistance();

      container.scrollBy({
        left: direction === "right" ? distance : -distance,
        behavior: "smooth",
      });
    },
    [getScrollDistance],
  );

  const handleWheel = (
    event: WheelEvent<HTMLDivElement>,
  ) => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const movement =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    if (Math.abs(movement) < 1) {
      return;
    }

    const maximumScroll =
      container.scrollWidth - container.clientWidth;

    const atStart = container.scrollLeft <= 0;
    const atEnd =
      container.scrollLeft >= maximumScroll - 1;

    if (
      (movement < 0 && atStart) ||
      (movement > 0 && atEnd)
    ) {
      return;
    }

    event.preventDefault();

    container.scrollLeft += movement;
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const container = scrollRef.current;

    if (
      !container ||
      event.pointerType === "touch"
    ) {
      return;
    }

    pointerStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      initialScrollLeft: container.scrollLeft,
    };

    container.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const container = scrollRef.current;

    if (!container || !isDragging) {
      return;
    }

    const movement =
      event.clientX - pointerStateRef.current.startX;

    container.scrollLeft =
      pointerStateRef.current.initialScrollLeft -
      movement;
  };

  const stopDragging = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const container = scrollRef.current;

    if (!container || !isDragging) {
      return;
    }

    setIsDragging(false);

    if (
      container.hasPointerCapture(
        pointerStateRef.current.pointerId,
      )
    ) {
      container.releasePointerCapture(
        pointerStateRef.current.pointerId,
      );
    }

    updateScrollState();
  };

  return (
    <>
      <section
        className="store-category-section"
        aria-label="Store product categories"
      >
        <div className="store-category-container">
          <div className="store-category-header">
            <div className="store-category-heading">
              <span className="store-category-heading-icon">
                <ShoppingBag
                  size={20}
                  strokeWidth={1.8}
                />
              </span>

              <div>
                <p className="store-category-eyebrow">
                  Browse products
                </p>

                <h2 className="store-category-title">
                  Shop by Category
                </h2>
              </div>
            </div>

            <div className="store-category-current">
              <span>Currently browsing</span>

              <strong>
                {activeCategory?.label ?? "All Categories"}
              </strong>
            </div>
          </div>

          <div className="store-category-navigation">
            <NavigationArrow
              direction="left"
              visible={canScrollLeft}
              onClick={() =>
                scrollCategories("left")
              }
            />

            <div
              ref={scrollRef}
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
              className={[
                "store-category-scroll",
                isDragging ? "is-dragging" : "",
              ].join(" ")}
            >
              <nav
                className="store-category-list"
                aria-label="Store categories"
              >
                {categories.map((category) => {
                  const active = checkActiveRoute(
                    pathname,
                    category.href,
                  );

                  return (
                    <Link
                      key={category.id}
                      ref={(element) => {
                        if (active) {
                          activeLinkRef.current = element;
                        }
                      }}
                      href={category.href}
                      aria-current={
                        active ? "page" : undefined
                      }
                      draggable={false}
                      className={[
                        "store-category-link",
                        active ? "is-active" : "",
                        category.badge
                          ? "has-badge"
                          : "",
                      ].join(" ")}
                    >
                      <span className="store-category-link-icon">
                        {category.icon}
                      </span>

                      <span className="store-category-link-label">
                        {category.label}
                      </span>

                      {category.badge && (
                        <span className="store-category-badge">
                          {category.badge}
                        </span>
                      )}

                      <span
                        aria-hidden="true"
                        className="store-category-active-line"
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <NavigationArrow
              direction="right"
              visible={canScrollRight}
              onClick={() =>
                scrollCategories("right")
              }
            />
          </div>

          <div
            aria-hidden="true"
            className={[
              "store-category-progress",
              canScrollLeft || canScrollRight
                ? "is-visible"
                : "",
            ].join(" ")}
          >
            <span
              style={{
                width: `${Math.max(
                  scrollProgress,
                  5,
                )}%`,
              }}
            />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .store-category-section {
          --store-category-text-20: 20px;
          --store-category-text-18: 18px;
          --store-category-text-16: 16px;
          --store-category-text-13: 13px;

          position: relative;
          z-index: 35;
          width: 100%;
          overflow: hidden;
          border-bottom: 1px solid
            rgba(15, 23, 42, 0.07);
          background:
            radial-gradient(
              circle at 6% 0%,
              rgba(214, 246, 240, 0.54),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fbfdfd 100%
            );
          padding: 18px 0 14px;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .store-category-container {
          width: min(
            1440px,
            calc(100% - 48px)
          );
          margin-inline: auto;
        }

        .store-category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 14px;
        }

        .store-category-heading {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 12px;
        }

        .store-category-heading-icon {
          display: flex;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid
            rgba(8, 123, 117, 0.13);
          border-radius: 13px;
          color: #087b75;
          background: linear-gradient(
            145deg,
            #f5fffd,
            #e4f7f3
          );
          box-shadow:
            0 12px 26px -19px
              rgba(8, 123, 117, 0.7),
            inset 0 1px
              rgba(255, 255, 255, 0.9);
        }

        .store-category-eyebrow {
          margin: 0;
          color: #087b75;
          font-size: var(
            --store-category-text-13
          );
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .store-category-title {
          margin: 3px 0 0;
          color: #101828;
          font-size: var(
            --store-category-text-20
          );
          font-weight: 850;
          line-height: 1.3;
          letter-spacing: -0.025em;
        }

        .store-category-current {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          padding: 8px 13px;
          border: 1px solid #dfe9e7;
          border-radius: 11px;
          background: rgba(
            255,
            255,
            255,
            0.86
          );
          box-shadow: 0 10px 24px -20px
            rgba(15, 23, 42, 0.4);
        }

        .store-category-current span,
        .store-category-current strong {
          font-size: var(
            --store-category-text-13
          );
        }

        .store-category-current span {
          color: #7a8492;
        }

        .store-category-current strong {
          max-width: 220px;
          overflow: hidden;
          color: #087b75;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .store-category-navigation {
          position: relative;
          overflow: hidden;
          border: 1px solid
            rgba(15, 23, 42, 0.08);
          border-radius: 16px;
          background: rgba(
            255,
            255,
            255,
            0.94
          );
          box-shadow:
            0 18px 42px -35px
              rgba(15, 23, 42, 0.5),
            inset 0 1px
              rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
        }

        .store-category-scroll {
          display: flex;
          min-width: 0;
          overflow-x: auto;
          overflow-y: hidden;
          cursor: grab;
          scroll-behavior: smooth;
          scroll-snap-type: x proximity;
          overscroll-behavior-inline: contain;
          scrollbar-width: none;
          -ms-overflow-style: none;
          touch-action: pan-x;
          user-select: none;
          -webkit-overflow-scrolling: touch;
        }

        .store-category-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .store-category-scroll.is-dragging {
          cursor: grabbing;
          scroll-behavior: auto;
          scroll-snap-type: none;
        }

        .store-category-list {
          display: flex;
          min-width: max-content;
          align-items: stretch;
          gap: 5px;
          padding: 7px 58px;
        }

        .store-category-link {
          position: relative;
          display: inline-flex;
          min-height: 48px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 15px;
          border: 1px solid transparent;
          border-radius: 11px;
          color: #344054;
          background: transparent;
          scroll-snap-align: center;
          text-decoration: none;
          white-space: nowrap;
          transition:
            color 250ms ease,
            border-color 250ms ease,
            background-color 250ms ease,
            box-shadow 250ms ease,
            transform 250ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              );
        }

        .store-category-link:hover {
          border-color: rgba(
            8,
            123,
            117,
            0.13
          );
          color: #087b75;
          background: #f1faf8;
          box-shadow: 0 12px 22px -19px
            rgba(8, 123, 117, 0.65);
          transform: translateY(-1px);
        }

        .store-category-link.is-active {
          border-color: #087b75;
          color: #ffffff;
          background: linear-gradient(
            135deg,
            #0c9187 0%,
            #087b75 54%,
            #06645f 100%
          );
          box-shadow:
            0 14px 26px -17px
              rgba(8, 123, 117, 0.95),
            inset 0 1px
              rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .store-category-link.has-badge:not(
            .is-active
          ) {
          border-color: rgba(
            208,
            134,
            30,
            0.16
          );
          color: #985c0d;
          background: linear-gradient(
            135deg,
            #fffaf0,
            #fff2d7
          );
        }

        .store-category-link-icon {
          display: flex;
          width: 31px;
          height: 31px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: #087b75;
          background: #eaf8f5;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease;
        }

        .store-category-link:hover
          .store-category-link-icon {
          transform: rotate(-4deg)
            scale(1.04);
        }

        .store-category-link.is-active
          .store-category-link-icon {
          color: #087b75;
          background: rgba(
            255,
            255,
            255,
            0.94
          );
        }

        .store-category-link-label {
          font-size: var(
            --store-category-text-13
          );
          font-weight: 700;
          line-height: 1;
        }

        .store-category-badge {
          display: inline-flex;
          min-height: 22px;
          align-items: center;
          padding: 3px 7px;
          border-radius: 999px;
          color: #a55d06;
          background: #ffffff;
          box-shadow: 0 6px 12px -9px
            rgba(113, 68, 12, 0.7);
          font-size: var(
            --store-category-text-13
          );
          font-weight: 800;
          line-height: 1;
        }

        .store-category-link.is-active
          .store-category-badge {
          color: #087b75;
          background: #ffffff;
        }

        .store-category-active-line {
          position: absolute;
          right: 15px;
          bottom: 3px;
          left: 15px;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          opacity: 0;
          transform: scaleX(0.3);
          transition:
            opacity 220ms ease,
            transform 250ms ease;
        }

        .store-category-link:hover
          .store-category-active-line {
          opacity: 0.36;
          transform: scaleX(0.65);
        }

        .store-category-link.is-active
          .store-category-active-line {
          background: rgba(
            255,
            255,
            255,
            0.88
          );
          opacity: 1;
          transform: scaleX(0.72);
        }

        .store-category-arrow {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 15;
          display: flex;
          align-items: center;
          pointer-events: none;
          opacity: 0;
          transition:
            opacity 250ms ease,
            transform 250ms ease;
        }

        .store-category-arrow.is-visible {
          pointer-events: auto;
          opacity: 1;
          transform: translateX(0);
        }

        .store-category-arrow-left {
          left: 0;
          padding: 0 26px 0 9px;
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            rgba(
                255,
                255,
                255,
                0.98
              )
              58%,
            transparent 100%
          );
          transform: translateX(-8px);
        }

        .store-category-arrow-right {
          right: 0;
          padding: 0 9px 0 26px;
          background: linear-gradient(
            270deg,
            #ffffff 0%,
            rgba(
                255,
                255,
                255,
                0.98
              )
              58%,
            transparent 100%
          );
          transform: translateX(8px);
        }

        .store-category-arrow button {
          display: flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border: 1px solid #d8e4e2;
          border-radius: 11px;
          color: #475467;
          background: rgba(
            255,
            255,
            255,
            0.98
          );
          box-shadow: 0 11px 22px -15px
            rgba(15, 23, 42, 0.58);
          cursor: pointer;
          transition:
            color 220ms ease,
            border-color 220ms ease,
            background-color 220ms ease,
            transform 220ms ease,
            box-shadow 220ms ease;
        }

        .store-category-arrow button:hover {
          border-color: rgba(
            8,
            123,
            117,
            0.32
          );
          color: #087b75;
          background: #eaf8f5;
          box-shadow: 0 15px 26px -15px
            rgba(8, 123, 117, 0.56);
          transform: scale(1.05);
        }

        .store-category-arrow button:active {
          transform: scale(0.96);
        }

        .store-category-arrow button:focus-visible,
        .store-category-link:focus-visible {
          outline: 3px solid
            rgba(8, 123, 117, 0.2);
          outline-offset: 2px;
        }

        .store-category-progress {
          width: calc(100% - 22px);
          height: 3px;
          overflow: hidden;
          margin: 7px auto 0;
          border-radius: 999px;
          background: rgba(
            8,
            123,
            117,
            0.07
          );
          opacity: 0;
          transition: opacity 250ms ease;
        }

        .store-category-progress.is-visible {
          opacity: 1;
        }

        .store-category-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #087b75,
            #39bbae
          );
          box-shadow: 0 0 9px
            rgba(8, 123, 117, 0.4);
          transition: width 120ms linear;
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .store-category-container {
            width: min(
              1180px,
              calc(100% - 40px)
            );
          }

          .store-category-list {
            padding-right: 55px;
            padding-left: 55px;
          }

          .store-category-link {
            min-height: 46px;
            padding-inline: 13px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .store-category-section {
            padding: 15px 0 12px;
          }

          .store-category-container {
            width: calc(100% - 32px);
          }

          .store-category-header {
            margin-bottom: 12px;
          }

          .store-category-current {
            max-width: 220px;
          }

          .store-category-list {
            padding: 6px 52px;
          }

          .store-category-link {
            min-height: 45px;
            padding-inline: 13px;
          }

          .store-category-link-icon {
            width: 30px;
            height: 30px;
          }
        }

        @media (max-width: 767px) {
          .store-category-section {
            padding: 13px 0 9px;
          }

          .store-category-container {
            width: 100%;
          }

          .store-category-header {
            padding-inline: 14px;
          }

          .store-category-heading-icon {
            width: 41px;
            height: 41px;
          }

          .store-category-current {
            display: none;
          }

          .store-category-navigation {
            border-right: 0;
            border-left: 0;
            border-radius: 0;
          }

          .store-category-list {
            gap: 7px;
            padding: 6px 14px;
          }

          .store-category-link {
            min-height: 44px;
            padding-inline: 12px;
            border-color: rgba(
              15,
              23,
              42,
              0.07
            );
            background: #f8faf9;
            scroll-snap-align: start;
          }

          .store-category-link.is-active {
            border-color: transparent;
          }

          .store-category-arrow {
            display: none;
          }

          .store-category-progress {
            width: calc(100% - 28px);
            margin-top: 6px;
          }
        }

        @media (max-width: 480px) {
          .store-category-header {
            padding-inline: 11px;
          }

          .store-category-heading {
            gap: 9px;
          }

          .store-category-heading-icon {
            width: 38px;
            height: 38px;
            border-radius: 11px;
          }

          .store-category-list {
            gap: 6px;
            padding-right: 11px;
            padding-left: 11px;
          }

          .store-category-link {
            min-height: 42px;
            gap: 7px;
            padding-inline: 10px;
            border-radius: 10px;
          }

          .store-category-link-icon {
            width: 28px;
            height: 28px;
            border-radius: 8px;
          }

          .store-category-badge {
            display: none;
          }
        }

        @media (hover: none) {
          .store-category-scroll {
            cursor: auto;
            scroll-snap-type: x mandatory;
          }

          .store-category-link:hover,
          .store-category-link:hover
            .store-category-link-icon {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .store-category-section *,
          .store-category-section *::before,
          .store-category-section *::after {
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

function NavigationArrow({
  direction,
  visible,
  onClick,
}: {
  direction: "left" | "right";
  visible: boolean;
  onClick: () => void;
}) {
  const Icon =
    direction === "left"
      ? ChevronLeft
      : ChevronRight;

  return (
    <div
      className={[
        "store-category-arrow",
        direction === "left"
          ? "store-category-arrow-left"
          : "store-category-arrow-right",
        visible ? "is-visible" : "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={!visible}
        aria-label={
          direction === "left"
            ? "Show previous categories"
            : "Show more categories"
        }
      >
        <Icon size={20} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function checkActiveRoute(
  pathname: string,
  href: string,
) {
  if (href === "/") {
    return pathname === "/";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}