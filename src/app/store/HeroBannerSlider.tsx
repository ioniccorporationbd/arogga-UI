"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import Link from "next/link";
import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type BannerSlide = {
  id: number;
  title: string;
  description: string;
  image: string;
  mobileImage?: string;
  href: string;
  alt: string;
};

const slides: BannerSlide[] = [
  {
    id: 1,
    title: "Wellness Essentials",
    description:
      "Explore trusted personal care and wellness products.",
    image: "/images/banners/wellness-banner-01.webp",
    mobileImage:
      "/images/banners/wellness-banner-01-mobile.webp",
    href: "/sexual-wellness",
    alt: "Personal wellness products promotional offer",
  },
  {
    id: 2,
    title: "Beauty & Skincare",
    description:
      "Discover skincare and beauty products for everyday care.",
    image: "/images/banners/beauty-banner-02.webp",
    mobileImage:
      "/images/banners/beauty-banner-02-mobile.webp",
    href: "/beauty",
    alt: "Beauty and skincare products promotional banner",
  },
  {
    id: 3,
    title: "Healthcare Savings",
    description:
      "Shop healthcare products with selected special offers.",
    image: "/images/banners/healthcare-banner-03.webp",
    mobileImage:
      "/images/banners/healthcare-banner-03-mobile.webp",
    href: "/healthcare",
    alt: "Healthcare products promotional banner",
  },
  {
    id: 4,
    title: "Baby & Mom Care",
    description:
      "Find daily care products for mothers and babies.",
    image: "/images/banners/baby-care-banner-04.webp",
    mobileImage:
      "/images/banners/baby-care-banner-04-mobile.webp",
    href: "/baby-mom-care",
    alt: "Baby and mother care promotional banner",
  },
  {
    id: 5,
    title: "Supplement Offers",
    description:
      "Browse vitamins, minerals and nutritional supplements.",
    image: "/images/banners/supplement-banner-05.webp",
    mobileImage:
      "/images/banners/supplement-banner-05-mobile.webp",
    href: "/supplement",
    alt: "Supplement products promotional banner",
  },
  {
    id: 6,
    title: "Home Care Deals",
    description:
      "Shop useful products for a cleaner and healthier home.",
    image: "/images/banners/home-care-banner-06.webp",
    mobileImage:
      "/images/banners/home-care-banner-06-mobile.webp",
    href: "/home-care",
    alt: "Home care products promotional banner",
  },
  {
    id: 7,
    title: "New Arrivals",
    description:
      "See the latest products recently added to Anukov.",
    image: "/images/banners/new-arrival-banner-07.webp",
    mobileImage:
      "/images/banners/new-arrival-banner-07-mobile.webp",
    href: "/new-arrivals",
    alt: "Newly launched products promotional banner",
  },
];

const AUTO_PLAY_DELAY = 5000;
const SWIPE_THRESHOLD = 45;

export default function HeroBannerSlider() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);

  const pointerStartRef = useRef({
    x: 0,
    y: 0,
    active: false,
  });

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [isPlaying, setIsPlaying] =
    useState(true);

  const [isHovered, setIsHovered] =
    useState(false);

  const [imageErrors, setImageErrors] =
    useState<number[]>([]);

  const totalSlides = slides.length;

  const goToSlide = useCallback(
    (index: number) => {
      const normalizedIndex =
        (index + totalSlides) % totalSlides;

      setActiveIndex(normalizedIndex);
    },
    [totalSlides],
  );

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0
        ? totalSlides - 1
        : current - 1,
    );
  }, [totalSlides]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === totalSlides - 1
        ? 0
        : current + 1,
    );
  }, [totalSlides]);

  useEffect(() => {
    if (
      !isPlaying ||
      isHovered ||
      totalSlides <= 1
    ) {
      return;
    }

    timerRef.current = setInterval(() => {
      showNext();
    }, AUTO_PLAY_DELAY);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [
    isPlaying,
    isHovered,
    showNext,
    totalSlides,
  ]);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsHovered(true);
          return;
        }

        setIsHovered(false);
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(slider);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleKeyboard = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }

    if (event.key === " ") {
      event.preventDefault();
      setIsPlaying((current) => !current);
    }
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      active: true,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  };

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (!pointerStartRef.current.active) {
      return;
    }

    const movementX =
      event.clientX -
      pointerStartRef.current.x;

    const movementY =
      event.clientY -
      pointerStartRef.current.y;

    pointerStartRef.current.active = false;

    if (
      Math.abs(movementX) <
        SWIPE_THRESHOLD ||
      Math.abs(movementX) <
        Math.abs(movementY)
    ) {
      return;
    }

    if (movementX > 0) {
      showPrevious();
    } else {
      showNext();
    }
  };

  const handlePointerCancel = () => {
    pointerStartRef.current.active = false;
  };

  const markImageError = (
    slideId: number,
  ) => {
    setImageErrors((current) => {
      if (current.includes(slideId)) {
        return current;
      }

      return [...current, slideId];
    });
  };

  return (
    <>
      <section
        aria-label="Anukov promotional offers"
        className="anukov-banner-section"
      >
        <div className="anukov-banner-container">
          <div
            ref={sliderRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Promotional banner carousel"
            tabIndex={0}
            onKeyDown={handleKeyboard}
            onMouseEnter={() =>
              setIsHovered(true)
            }
            onMouseLeave={() =>
              setIsHovered(false)
            }
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={
              handlePointerCancel
            }
            className="anukov-banner-slider"
          >
            <div
              className="anukov-banner-track"
              style={{
                transform: `translate3d(-${
                  activeIndex * 100
                }%, 0, 0)`,
              }}
            >
              {slides.map((slide, index) => {
                const failed =
                  imageErrors.includes(slide.id);

                return (
                  <article
                    key={slide.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${totalSlides}`}
                    aria-hidden={
                      activeIndex !== index
                    }
                    className="anukov-banner-slide"
                  >
                    <Link
                      href={slide.href}
                      aria-label={`${slide.title}: ${slide.description}`}
                      tabIndex={
                        activeIndex === index
                          ? 0
                          : -1
                      }
                      className="anukov-banner-link"
                    >
                      {!failed ? (
                        <picture>
                          {slide.mobileImage && (
                            <source
                              media="(max-width: 639px)"
                              srcSet={
                                slide.mobileImage
                              }
                            />
                          )}

                          <img
                            src={slide.image}
                            alt={slide.alt}
                            width={1440}
                            height={340}
                            draggable={false}
                            loading={
                              index === 0
                                ? "eager"
                                : "lazy"
                            }
                            fetchPriority={
                              index === 0
                                ? "high"
                                : "auto"
                            }
                            onError={() =>
                              markImageError(
                                slide.id,
                              )
                            }
                            className="anukov-banner-image"
                          />
                        </picture>
                      ) : (
                        <div className="anukov-banner-fallback">
                          <span>
                            Anukov Offers
                          </span>

                          <strong>
                            {slide.title}
                          </strong>

                          <p>
                            {
                              slide.description
                            }
                          </p>
                        </div>
                      )}

                      <span
                        aria-hidden="true"
                        className="anukov-banner-overlay"
                      />
                    </Link>
                  </article>
                );
              })}
            </div>

            {totalSlides > 1 && (
              <>
                <SliderButton
                  direction="left"
                  onClick={showPrevious}
                />

                <SliderButton
                  direction="right"
                  onClick={showNext}
                />
              </>
            )}

            <button
              type="button"
              onClick={() =>
                setIsPlaying(
                  (current) => !current,
                )
              }
              aria-label={
                isPlaying
                  ? "Pause automatic slideshow"
                  : "Start automatic slideshow"
              }
              className="anukov-banner-play-button"
            >
              {isPlaying ? (
                <Pause
                  size={16}
                  fill="currentColor"
                />
              ) : (
                <Play
                  size={16}
                  fill="currentColor"
                />
              )}
            </button>
          </div>

          {totalSlides > 1 && (
            <div
              role="tablist"
              aria-label="Choose banner"
              className="anukov-banner-dots"
            >
              {slides.map((slide, index) => {
                const active =
                  index === activeIndex;

                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Show slide ${
                      index + 1
                    }: ${slide.title}`}
                    onClick={() =>
                      goToSlide(index)
                    }
                    className={
                      active
                        ? "anukov-banner-dot is-active"
                        : "anukov-banner-dot"
                    }
                  >
                    <span />
                  </button>
                );
              })}
            </div>
          )}

          <div
            aria-live="polite"
            className="anukov-banner-screen-reader"
          >
            Slide {activeIndex + 1} of{" "}
            {totalSlides}:{" "}
            {slides[activeIndex]?.title}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .anukov-banner-section {
          --banner-text-20: 20px;
          --banner-text-18: 18px;
          --banner-text-16: 16px;
          --banner-text-13: 13px;

          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 24px 0 12px;
          background: #ffffff;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .anukov-banner-container {
          width: min(
            1440px,
            calc(100% - 48px)
          );
          margin-inline: auto;
        }

        .anukov-banner-slider {
          position: relative;
          overflow: hidden;
          border: 1px solid
            rgba(15, 23, 42, 0.08);
          border-radius: 14px;
          background: #eef2f5;
          box-shadow:
            0 22px 50px -38px
              rgba(15, 23, 42, 0.48),
            0 5px 16px -12px
              rgba(15, 23, 42, 0.2);
          outline: none;
          touch-action: pan-y;
          user-select: none;
          transform: translateZ(0);
        }

        .anukov-banner-slider:focus-visible {
          box-shadow:
            0 0 0 4px
              rgba(8, 123, 117, 0.14),
            0 22px 50px -38px
              rgba(15, 23, 42, 0.48);
        }

        .anukov-banner-track {
          display: flex;
          width: 100%;
          transition: transform 650ms
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            );
          will-change: transform;
        }

        .anukov-banner-slide {
          position: relative;
          width: 100%;
          min-width: 100%;
          flex: 0 0 100%;
        }

        .anukov-banner-link {
          position: relative;
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }

        .anukov-banner-image {
          display: block;
          width: 100%;
          height: clamp(
            190px,
            22.5vw,
            340px
          );
          object-fit: cover;
          object-position: center;
          background: #eef2f5;
          transform: scale(1.001);
          transition:
            transform 900ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            filter 500ms ease;
          will-change: transform;
        }

        .anukov-banner-slide[aria-hidden="false"]
          .anukov-banner-image {
          animation: anukovBannerZoom
            6s ease-out both;
        }

        .anukov-banner-link:hover
          .anukov-banner-image {
          filter: saturate(1.035)
            contrast(1.015);
          transform: scale(1.012);
        }

        .anukov-banner-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.025),
              transparent 25%,
              transparent 75%,
              rgba(0, 0, 0, 0.025)
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.02),
              rgba(0, 0, 0, 0.025)
            );
        }

        .anukov-banner-fallback {
          display: flex;
          height: clamp(
            190px,
            22.5vw,
            340px
          );
          width: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 15% 40%,
              rgba(255, 122, 68, 0.42),
              transparent 28%
            ),
            radial-gradient(
              circle at 85% 40%,
              rgba(206, 70, 180, 0.38),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #130c35,
              #29105b 54%,
              #40156f
            );
          text-align: center;
        }

        .anukov-banner-fallback span {
          font-size: var(
            --banner-text-13
          );
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .anukov-banner-fallback strong {
          margin-top: 9px;
          font-size: var(
            --banner-text-20
          );
          font-weight: 850;
          line-height: 1.4;
        }

        .anukov-banner-fallback p {
          max-width: 500px;
          margin: 8px 0 0;
          font-size: var(
            --banner-text-16
          );
          line-height: 1.6;
        }

        .anukov-banner-arrow {
          position: absolute;
          top: 50%;
          z-index: 20;
          display: flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border: 1px solid
            rgba(15, 23, 42, 0.1);
          border-radius: 8px;
          color: #475467;
          background: rgba(
            255,
            255,
            255,
            0.96
          );
          box-shadow: 0 12px 28px -18px
            rgba(15, 23, 42, 0.52);
          backdrop-filter: blur(10px);
          cursor: pointer;
          transform: translateY(-50%);
          transition:
            color 250ms ease,
            border-color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .anukov-banner-arrow-left {
          left: 5px;
        }

        .anukov-banner-arrow-right {
          right: 5px;
        }

        .anukov-banner-arrow:hover {
          border-color: rgba(
            8,
            123,
            117,
            0.4
          );
          color: #087b75;
          background: #ffffff;
          box-shadow: 0 16px 32px -18px
            rgba(8, 123, 117, 0.55);
          transform: translateY(-50%)
            scale(1.06);
        }

        .anukov-banner-arrow:active {
          transform: translateY(-50%)
            scale(0.96);
        }

        .anukov-banner-arrow:focus-visible,
        .anukov-banner-play-button:focus-visible,
        .anukov-banner-dot:focus-visible {
          outline: 3px solid
            rgba(8, 123, 117, 0.22);
          outline-offset: 3px;
        }

        .anukov-banner-play-button {
          position: absolute;
          right: 12px;
          bottom: 12px;
          z-index: 20;
          display: flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border: 1px solid
            rgba(255, 255, 255, 0.55);
          border-radius: 50%;
          color: #ffffff;
          background: rgba(
            15,
            23,
            42,
            0.58
          );
          box-shadow: 0 12px 24px -14px
            rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(10px);
          cursor: pointer;
          opacity: 0;
          transform: translateY(5px);
          transition:
            opacity 250ms ease,
            transform 250ms ease,
            background-color 250ms ease;
        }

        .anukov-banner-slider:hover
          .anukov-banner-play-button,
        .anukov-banner-slider:focus-within
          .anukov-banner-play-button {
          opacity: 1;
          transform: translateY(0);
        }

        .anukov-banner-play-button:hover {
          background: rgba(
            8,
            123,
            117,
            0.9
          );
        }

        .anukov-banner-dots {
          display: flex;
          min-height: 34px;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 9px;
        }

        .anukov-banner-dot {
          display: flex;
          width: 18px;
          height: 18px;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 0;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
        }

        .anukov-banner-dot > span {
          display: block;
          width: 12px;
          height: 12px;
          border: 1.5px solid #15948c;
          border-radius: 50%;
          background: #ffffff;
          transition:
            width 250ms ease,
            height 250ms ease,
            border-color 250ms ease,
            background-color 250ms ease,
            box-shadow 250ms ease,
            transform 250ms ease;
        }

        .anukov-banner-dot:hover
          > span {
          transform: scale(1.12);
        }

        .anukov-banner-dot.is-active
          > span {
          width: 14px;
          height: 14px;
          border-color: #087b75;
          background: #087b75;
          box-shadow: 0 0 0 5px
            rgba(8, 123, 117, 0.14);
        }

        .anukov-banner-screen-reader {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          margin: -1px;
          padding: 0;
          border: 0;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
        }

        @keyframes anukovBannerZoom {
          from {
            transform: scale(1.02);
          }

          to {
            transform: scale(1.001);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .anukov-banner-section {
            padding-top: 20px;
          }

          .anukov-banner-container {
            width: min(
              1180px,
              calc(100% - 40px)
            );
          }

          .anukov-banner-image,
          .anukov-banner-fallback {
            height: clamp(
              210px,
              23vw,
              295px
            );
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .anukov-banner-section {
            padding: 18px 0 10px;
          }

          .anukov-banner-container {
            width: calc(100% - 32px);
          }

          .anukov-banner-slider {
            border-radius: 12px;
          }

          .anukov-banner-image,
          .anukov-banner-fallback {
            height: clamp(
              205px,
              30vw,
              275px
            );
          }

          .anukov-banner-arrow {
            width: 36px;
            height: 36px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .anukov-banner-section {
            padding: 14px 0 8px;
          }

          .anukov-banner-container {
            width: calc(100% - 24px);
          }

          .anukov-banner-slider {
            border-radius: 11px;
          }

          .anukov-banner-image,
          .anukov-banner-fallback {
            height: 230px;
          }

          .anukov-banner-arrow {
            width: 36px;
            height: 36px;
          }
        }

        @media (max-width: 639px) {
          .anukov-banner-section {
            padding: 10px 0 6px;
          }

          .anukov-banner-container {
            width: 100%;
          }

          .anukov-banner-slider {
            border-right: 0;
            border-left: 0;
            border-radius: 0;
            box-shadow: 0 15px 35px -30px
              rgba(15, 23, 42, 0.5);
          }

          .anukov-banner-image,
          .anukov-banner-fallback {
            height: clamp(
              205px,
              67vw,
              285px
            );
          }

          .anukov-banner-image {
            object-position: center;
          }

          .anukov-banner-arrow {
            width: 34px;
            height: 34px;
            border-radius: 8px;
          }

          .anukov-banner-arrow-left {
            left: 6px;
          }

          .anukov-banner-arrow-right {
            right: 6px;
          }

          .anukov-banner-play-button {
            right: 9px;
            bottom: 9px;
            width: 36px;
            height: 36px;
            opacity: 1;
            transform: none;
          }

          .anukov-banner-dots {
            gap: 8px;
            margin-top: 6px;
          }

          .anukov-banner-dot {
            width: 17px;
            height: 17px;
          }

          .anukov-banner-dot > span {
            width: 10px;
            height: 10px;
          }

          .anukov-banner-dot.is-active
            > span {
            width: 13px;
            height: 13px;
          }
        }

        @media (max-width: 380px) {
          .anukov-banner-image,
          .anukov-banner-fallback {
            height: 220px;
          }

          .anukov-banner-arrow {
            width: 32px;
            height: 32px;
          }

          .anukov-banner-fallback {
            padding: 22px;
          }
        }

        @media (hover: none) {
          .anukov-banner-link:hover
            .anukov-banner-image,
          .anukov-banner-arrow:hover {
            transform: none;
          }

          .anukov-banner-play-button {
            opacity: 1;
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .anukov-banner-section *,
          .anukov-banner-section
            *::before,
          .anukov-banner-section
            *::after {
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

function SliderButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon =
    direction === "left"
      ? ChevronLeft
      : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        direction === "left"
          ? "Show previous banner"
          : "Show next banner"
      }
      className={[
        "anukov-banner-arrow",
        direction === "left"
          ? "anukov-banner-arrow-left"
          : "anukov-banner-arrow-right",
      ].join(" ")}
    >
      <Icon size={20} strokeWidth={1.8} />
    </button>
  );
}