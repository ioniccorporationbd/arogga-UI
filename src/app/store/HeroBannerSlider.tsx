"use client";

import Link from "next/link";
import {
  A11y,
  Autoplay,
  EffectFade,
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

type BannerSlide = {
  id: number;
  desktopImage: string;
  mobileImage: string;
  href: string;
  alt: string;
  desktopPosition?: string;
  mobilePosition?: string;
};

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    desktopImage:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&h=520&q=90",
    mobileImage:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&h=1000&q=88",
    href: "/beauty",
    alt: "Beauty and cosmetics promotional collection",
    desktopPosition: "center",
    mobilePosition: "center",
  },
  {
    id: 2,
    desktopImage:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1800&h=520&q=90",
    mobileImage:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&h=1000&q=88",
    href: "/medicine",
    alt: "Medicine and pharmacy products promotional collection",
    desktopPosition: "center",
    mobilePosition: "center",
  },
  {
    id: 3,
    desktopImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&h=520&q=90",
    mobileImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&h=1000&q=88",
    href: "/healthcare",
    alt: "Healthcare and medical service promotional collection",
    desktopPosition: "center",
    mobilePosition: "center",
  },
  {
    id: 4,
    desktopImage:
      "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?auto=format&fit=crop&w=1800&h=520&q=90",
    mobileImage:
      "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?auto=format&fit=crop&w=900&h=1000&q=88",
    href: "/baby-mom-care",
    alt: "Baby and mother care promotional collection",
    desktopPosition: "center",
    mobilePosition: "center",
  },
  {
    id: 5,
    desktopImage:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=1800&h=520&q=90",
    mobileImage:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=900&h=1000&q=88",
    href: "/supplement",
    alt: "Vitamins and supplements promotional collection",
    desktopPosition: "center",
    mobilePosition: "center",
  },
  {
    id: 6,
    desktopImage:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1800&h=520&q=90",
    mobileImage:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&h=1000&q=88",
    href: "/home-care",
    alt: "Home care and cleaning products promotional collection",
    desktopPosition: "center",
    mobilePosition: "center",
  },
  {
    id: 7,
    desktopImage:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&h=520&q=90",
    mobileImage:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&h=1000&q=88",
    href: "/skincare",
    alt: "Skincare and wellness promotional collection",
    desktopPosition: "center",
    mobilePosition: "center",
  },
];

const slideCopy = [
  { eyebrow: "Beauty flash", title: "Real beauty products, real savings", subtitle: "Cosmetics, skin care and grooming picks with fast delivery.", cta: "Shop beauty", offer: "7 live banners" },
  { eyebrow: "Pharmacy", title: "Medicine essentials delivered safely", subtitle: "Order authentic pharmacy items and daily healthcare products.", cta: "Order now", offer: "Trusted care" },
  { eyebrow: "Healthcare", title: "Wellness support for every family", subtitle: "Devices, first-aid, hygiene and doctor-backed essentials.", cta: "Explore care", offer: "Top brands" },
  { eyebrow: "Baby & mom", title: "Gentle care for parents and babies", subtitle: "Diapers, wipes, feeding and mother care in one store.", cta: "Shop baby", offer: "Soft picks" },
  { eyebrow: "Supplements", title: "Build your wellness routine", subtitle: "Vitamins, minerals and nutrition support for active days.", cta: "View wellness", offer: "Fresh stock" },
  { eyebrow: "Home care", title: "Clean home essentials that work", subtitle: "Hygiene, cleaning and household care with bundle savings.", cta: "Shop home", offer: "Bundle deal" },
  { eyebrow: "Skincare", title: "Daily care with trusted products", subtitle: "Hydration, cleanser, serum and sun-care category picks.", cta: "Shop skincare", offer: "New drops" },
];

export default function HeroBannerSlider() {
  return (
    <>
      <section
        aria-label="Anukov promotional banners"
        className="anukov-hero-section"
      >
        <div className="anukov-hero-container">
          <div className="anukov-hero-shell">
            <Swiper
              modules={[
                Navigation,
                Pagination,
                Autoplay,
                Keyboard,
                A11y,
                EffectFade,
              ]}
              effect="fade"
              fadeEffect={{
                crossFade: true,
              }}
              slidesPerView={1}
              spaceBetween={0}
              loop
              speed={1100}
              grabCursor
              watchSlidesProgress
              resistance
              resistanceRatio={0.7}
              threshold={8}
              touchRatio={1}
              followFinger
              longSwipes
              shortSwipes
              keyboard={{
                enabled: true,
                onlyInViewport: true,
              }}
              autoplay={{
                delay: 5200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                waitForTransition: true,
              }}
              navigation={{
                prevEl: ".anukov-hero-prev",
                nextEl: ".anukov-hero-next",
              }}
              pagination={{
                el: ".anukov-hero-pagination",
                clickable: true,
                renderBullet: (index, className) =>
                  `<button type="button" class="${className}" aria-label="Go to banner ${
                    index + 1
                  }"><span></span></button>`,
              }}
              a11y={{
                enabled: true,
                prevSlideMessage: "Previous promotional banner",
                nextSlideMessage: "Next promotional banner",
                firstSlideMessage: "First promotional banner",
                lastSlideMessage: "Last promotional banner",
                paginationBulletMessage: "Go to promotional banner {{index}}",
              }}
              className="anukov-hero-swiper"
            >
              {bannerSlides.map((slide, index) => (
                <SwiperSlide key={slide.id}>
                  {({ isActive }) => (
                    <article
                      className={[
                        "anukov-hero-slide",
                        isActive ? "is-active" : "",
                      ].join(" ")}
                    >
                      <Link
                        href={slide.href}
                        aria-label={slide.alt}
                        className="anukov-hero-link"
                      >
                        <picture>
                          <source
                            media="(max-width: 639px)"
                            srcSet={slide.mobileImage}
                          />

                          <img
                            src={slide.desktopImage}
                            alt={slide.alt}
                            width={1800}
                            height={520}
                            draggable={false}
                            loading={index === 0 ? "eager" : "lazy"}
                            fetchPriority={index === 0 ? "high" : "auto"}
                            className="anukov-hero-image"
                            style={{
                              objectPosition:
                                slide.desktopPosition ?? "center",
                            }}
                          />
                        </picture>

                        <span
                          aria-hidden="true"
                          className="anukov-hero-overlay"
                        />

                        <span className="anukov-hero-copy">
                          <span>{slideCopy[index].eyebrow}</span>
                          <strong>{slideCopy[index].title}</strong>
                          <small>{slideCopy[index].subtitle}</small>
                          <em><b>{slideCopy[index].cta}</b>{slideCopy[index].offer}</em>
                        </span>

                        <span
                          aria-hidden="true"
                          className="anukov-hero-shine"
                        />
                      </Link>
                    </article>
                  )}
                </SwiperSlide>
              ))}

              <button
                type="button"
                aria-label="Previous banner"
                className="anukov-hero-arrow anukov-hero-prev"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M14.5 5 7.5 12l7 7"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                aria-label="Next banner"
                className="anukov-hero-arrow anukov-hero-next"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m9.5 5 7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                className="anukov-hero-pagination"
                aria-label="Banner pagination"
              />
            </Swiper>
          </div>
        </div>
      </section>

      <style>{`
        .anukov-hero-section {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 22px 0 14px;
          background:
            radial-gradient(
              circle at 5% 10%,
              rgba(222, 246, 241, 0.48),
              transparent 26%
            ),
            radial-gradient(
              circle at 95% 90%,
              rgba(238, 232, 255, 0.44),
              transparent 27%
            ),
            #ffffff;
        }

        .anukov-hero-container {
          width: min(1440px, calc(100% - 48px));
          margin-inline: auto;
        }

        .anukov-hero-shell {
          position: relative;
          padding: 5px;
          border-radius: 22px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.98),
              rgba(224, 243, 239, 0.7),
              rgba(255, 255, 255, 0.98)
            );
          box-shadow:
            0 30px 75px -50px rgba(15, 23, 42, 0.5),
            inset 0 1px rgba(255, 255, 255, 0.9);
        }

        .anukov-hero-swiper {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.07);
          border-radius: 17px;
          background: #eef2f3;
          box-shadow:
            0 20px 45px -36px rgba(15, 23, 42, 0.48),
            0 6px 18px -15px rgba(15, 23, 42, 0.22);
          transform: translateZ(0);
          isolation: isolate;
        }

        .anukov-hero-swiper .swiper-wrapper {
          align-items: stretch;
        }

        .anukov-hero-swiper .swiper-slide {
          height: auto;
          overflow: hidden;
          background: #edf2f3;
        }

        .anukov-hero-slide,
        .anukov-hero-link,
        .anukov-hero-link picture {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .anukov-hero-link {
          text-decoration: none;
          background: #edf2f3;
          transform: translateZ(0);
        }

        .anukov-hero-image {
          display: block;
          width: 100%;
          height: clamp(210px, 23vw, 350px);
          object-fit: cover;
          background: #edf2f3;
          transform: scale(1.055);
          filter: saturate(0.96) contrast(0.99);
          transition:
            transform 6200ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 900ms ease,
            opacity 650ms ease;
          will-change: transform;
          backface-visibility: hidden;
        }

        .anukov-hero-slide.is-active .anukov-hero-image {
          transform: scale(1.001);
          filter: saturate(1.035) contrast(1.015);
        }

        .anukov-hero-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              90deg,
              rgba(7, 16, 38, 0.06),
              transparent 20%,
              transparent 80%,
              rgba(7, 16, 38, 0.06)
            ),
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.015),
              transparent 58%,
              rgba(6, 20, 35, 0.1)
            );
          opacity: 0.72;
        }


        .anukov-hero-copy {
          position: absolute;
          z-index: 25;
          left: clamp(22px, 6vw, 84px);
          top: 50%;
          display: grid;
          max-width: 470px;
          gap: 10px;
          color: #ffffff;
          transform: translateY(-50%);
          pointer-events: none;
          text-shadow: 0 14px 34px rgba(0, 0, 0, 0.45);
        }

        .anukov-hero-copy > span {
          width: max-content;
          border: 1px solid rgba(255, 255, 255, 0.36);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 11px;
          font-size: 12px;
          font-weight: 950;
          backdrop-filter: blur(12px);
        }

        .anukov-hero-copy strong {
          max-width: 560px;
          font-size: clamp(30px, 4vw, 58px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .anukov-hero-copy small {
          max-width: 420px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          line-height: 1.55;
        }

        .anukov-hero-copy em {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          width: max-content;
          font-size: 12px;
          font-style: normal;
          font-weight: 900;
        }

        .anukov-hero-copy em b {
          border-radius: 13px;
          background: #ffffff;
          color: #087b75;
          padding: 10px 13px;
        }

        .anukov-hero-shine {
          position: absolute;
          inset: 0 auto 0 -28%;
          width: 14%;
          pointer-events: none;
          transform: skewX(-18deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.16),
            transparent
          );
          opacity: 0;
        }

        .anukov-hero-slide.is-active .anukov-hero-shine {
          animation: anukovHeroShine 5.4s ease-in-out 800ms both;
        }

        .anukov-hero-arrow {
          position: absolute;
          top: 50%;
          z-index: 30;
          display: flex;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 13px;
          color: #087b75;
          background: rgba(255, 255, 255, 0.92);
          box-shadow:
            0 16px 36px -20px rgba(15, 23, 42, 0.58),
            inset 0 1px rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(14px);
          cursor: pointer;
          transform: translateY(-50%);
          opacity: 0;
          transition:
            opacity 300ms ease,
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
            color 250ms ease,
            background-color 250ms ease,
            border-color 250ms ease,
            box-shadow 300ms ease;
        }

        .anukov-hero-arrow svg {
          width: 20px;
          height: 20px;
          transition: transform 250ms ease;
        }

        .anukov-hero-prev {
          left: 18px;
          transform: translate(-8px, -50%);
        }

        .anukov-hero-next {
          right: 18px;
          transform: translate(8px, -50%);
        }

        .anukov-hero-swiper:hover .anukov-hero-arrow,
        .anukov-hero-swiper:focus-within .anukov-hero-arrow {
          opacity: 1;
        }

        .anukov-hero-swiper:hover .anukov-hero-prev,
        .anukov-hero-swiper:focus-within .anukov-hero-prev {
          transform: translate(0, -50%);
        }

        .anukov-hero-swiper:hover .anukov-hero-next,
        .anukov-hero-swiper:focus-within .anukov-hero-next {
          transform: translate(0, -50%);
        }

        .anukov-hero-arrow:hover {
          border-color: rgba(8, 123, 117, 0.28);
          color: #ffffff;
          background: rgba(8, 123, 117, 0.94);
          box-shadow:
            0 20px 42px -20px rgba(8, 123, 117, 0.68),
            inset 0 1px rgba(255, 255, 255, 0.22);
        }

        .anukov-hero-prev:hover svg {
          transform: translateX(-2px);
        }

        .anukov-hero-next:hover svg {
          transform: translateX(2px);
        }

        .anukov-hero-arrow:active {
          scale: 0.94;
        }

        .anukov-hero-arrow:focus-visible {
          outline: 3px solid rgba(8, 123, 117, 0.2);
          outline-offset: 3px;
        }

        .anukov-hero-pagination {
          position: absolute;
          bottom: 14px;
          left: 50%;
          z-index: 35;
          display: flex;
          width: auto !important;
          min-height: 34px;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 10px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.74);
          box-shadow:
            0 14px 32px -20px rgba(15, 23, 42, 0.5),
            inset 0 1px rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(14px);
          transform: translateX(-50%);
        }

        .anukov-hero-pagination .swiper-pagination-bullet {
          position: relative;
          display: flex;
          width: 24px;
          height: 8px;
          align-items: center;
          justify-content: center;
          margin: 0 !important;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: rgba(8, 123, 117, 0.16);
          opacity: 1;
          overflow: hidden;
          cursor: pointer;
          transition:
            width 350ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 300ms ease,
            transform 250ms ease;
        }

        .anukov-hero-pagination .swiper-pagination-bullet span {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          background: transparent;
        }

        .anukov-hero-pagination
          .swiper-pagination-bullet:hover {
          transform: scaleY(1.2);
          background: rgba(8, 123, 117, 0.28);
        }

        .anukov-hero-pagination
          .swiper-pagination-bullet-active {
          width: 48px;
          background: rgba(8, 123, 117, 0.14);
        }

        .anukov-hero-pagination
          .swiper-pagination-bullet-active
          span {
          transform-origin: left center;
          background: #087b75;
          animation: anukovHeroProgress 5.2s linear both;
        }

        .anukov-hero-pagination
          .swiper-pagination-bullet:focus-visible {
          outline: 3px solid rgba(8, 123, 117, 0.22);
          outline-offset: 3px;
        }

        .anukov-hero-swiper .swiper-notification {
          font-size: 13px;
        }

        @keyframes anukovHeroShine {
          0%,
          20% {
            left: -28%;
            opacity: 0;
          }

          35% {
            opacity: 1;
          }

          70%,
          100% {
            left: 118%;
            opacity: 0;
          }
        }

        @keyframes anukovHeroProgress {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .anukov-hero-section {
            padding: 20px 0 12px;
          }

          .anukov-hero-container {
            width: min(1180px, calc(100% - 40px));
          }

          .anukov-hero-image {
            height: clamp(220px, 24vw, 310px);
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .anukov-hero-section {
            padding: 17px 0 10px;
          }

          .anukov-hero-container {
            width: calc(100% - 32px);
          }

          .anukov-hero-shell {
            border-radius: 18px;
          }

          .anukov-hero-swiper {
            border-radius: 14px;
          }

          .anukov-hero-image {
            height: clamp(220px, 31vw, 285px);
          }

          .anukov-hero-arrow {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            opacity: 1;
          }

          .anukov-hero-prev {
            left: 14px;
            transform: translate(0, -50%);
          }

          .anukov-hero-next {
            right: 14px;
            transform: translate(0, -50%);
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .anukov-hero-section {
            padding: 14px 0 8px;
          }

          .anukov-hero-container {
            width: calc(100% - 24px);
          }

          .anukov-hero-shell {
            padding: 4px;
            border-radius: 17px;
          }

          .anukov-hero-swiper {
            border-radius: 13px;
          }

          .anukov-hero-image {
            height: 235px;
          }

          .anukov-hero-arrow {
            width: 38px;
            height: 38px;
            border-radius: 11px;
            opacity: 1;
          }

          .anukov-hero-prev {
            left: 12px;
            transform: translate(0, -50%);
          }

          .anukov-hero-next {
            right: 12px;
            transform: translate(0, -50%);
          }
        }

        @media (max-width: 639px) {
          .anukov-hero-section {
            padding: 10px 0 7px;
          }

          .anukov-hero-container {
            width: 100%;
          }

          .anukov-hero-shell {
            padding: 0;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
          }

          .anukov-hero-swiper {
            border-right: 0;
            border-left: 0;
            border-radius: 0;
            box-shadow: 0 18px 38px -32px rgba(15, 23, 42, 0.55);
          }

          .anukov-hero-image {
            height: clamp(220px, 68vw, 300px);
          }

          .anukov-hero-arrow {
            width: 36px;
            height: 36px;
            border-radius: 11px;
            opacity: 1;
          }

          .anukov-hero-arrow svg {
            width: 18px;
            height: 18px;
          }

          .anukov-hero-prev {
            left: 10px;
            transform: translate(0, -50%);
          }

          .anukov-hero-next {
            right: 10px;
            transform: translate(0, -50%);
          }

          .anukov-hero-pagination {
            bottom: 10px;
            min-height: 30px;
            gap: 5px;
            padding: 6px 8px;
          }

          .anukov-hero-pagination .swiper-pagination-bullet {
            width: 18px;
            height: 7px;
          }

          .anukov-hero-pagination
            .swiper-pagination-bullet-active {
            width: 38px;
          }
        }

        @media (max-width: 380px) {
          .anukov-hero-image {
            height: 225px;
          }

          .anukov-hero-arrow {
            width: 34px;
            height: 34px;
          }

          .anukov-hero-prev {
            left: 7px;
          }

          .anukov-hero-next {
            right: 7px;
          }
        }

        @media (hover: none) {
          .anukov-hero-arrow {
            opacity: 1;
          }

          .anukov-hero-prev,
          .anukov-hero-next {
            transform: translate(0, -50%);
          }

          .anukov-hero-arrow:hover {
            color: #087b75;
            background: rgba(255, 255, 255, 0.92);
            scale: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .anukov-hero-section *,
          .anukov-hero-section *::before,
          .anukov-hero-section *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .anukov-hero-pagination
            .swiper-pagination-bullet-active
            span {
            transform: scaleX(1);
          }
        }
      `}</style>
    </>
  );
}