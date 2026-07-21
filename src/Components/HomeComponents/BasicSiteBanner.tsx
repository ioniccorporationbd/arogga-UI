"use client";

import Link from "next/link";
import {
  A11y,
  Autoplay,
  EffectCreative,
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/navigation";
import "swiper/css/pagination";

type BannerSlide = {
  id: number;
  desktopImage: string;
  mobileImage: string;
  href: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  offer: string;
  cta: string;
  alt: string;
  tone: "teal" | "rose" | "blue" | "amber" | "violet" | "green" | "slate";
  desktopPosition?: string;
  mobilePosition?: string;
};

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    desktopImage:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1800&h=620&q=92",
    mobileImage:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&h=1100&q=90",
    href: "/skincare",
    eyebrow: "Beauty essentials",
    title: "Glow care for everyday routines",
    subtitle: "Shop trusted skincare, cleanser, serum and moisturizer picks.",
    offer: "Up to 50% off",
    cta: "Shop skincare",
    alt: "Premium skincare products arranged for an ecommerce beauty banner",
    tone: "rose",
    desktopPosition: "center right",
    mobilePosition: "center",
  },
  {
    id: 2,
    desktopImage:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1800&h=620&q=92",
    mobileImage:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&h=1100&q=90",
    href: "/medicine",
    eyebrow: "Pharmacy deals",
    title: "Authentic medicines delivered fast",
    subtitle: "Order pharmacy items and daily health needs from home.",
    offer: "Save on essentials",
    cta: "Order medicine",
    alt: "Medicine bottles and pharmacy products for an ecommerce banner",
    tone: "teal",
    desktopPosition: "center right",
  },
  {
    id: 3,
    desktopImage:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1800&h=620&q=92",
    mobileImage:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&h=1100&q=90",
    href: "/healthcare",
    eyebrow: "Healthcare store",
    title: "Care products for family wellness",
    subtitle: "Find devices, first-aid, hygiene and healthcare products.",
    offer: "Trusted brands",
    cta: "Explore healthcare",
    alt: "Healthcare products displayed on a clean ecommerce banner",
    tone: "blue",
    desktopPosition: "center",
  },
  {
    id: 4,
    desktopImage:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1800&h=620&q=92",
    mobileImage:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&h=1100&q=90",
    href: "/baby-mom-care",
    eyebrow: "Baby & mom",
    title: "Gentle care for little moments",
    subtitle: "Diapers, wipes, feeding care and mother care essentials.",
    offer: "Baby picks live",
    cta: "Shop baby care",
    alt: "Baby care products for an ecommerce promotional banner",
    tone: "amber",
    desktopPosition: "center right",
  },
  {
    id: 5,
    desktopImage:
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1800&h=620&q=92",
    mobileImage:
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&h=1100&q=90",
    href: "/supplement",
    eyebrow: "Nutrition zone",
    title: "Supplements for active days",
    subtitle: "Vitamins, minerals and wellness support in one place.",
    offer: "Top wellness picks",
    cta: "View supplements",
    alt: "Vitamins and supplements product banner for ecommerce",
    tone: "green",
    desktopPosition: "center",
  },
  {
    id: 6,
    desktopImage:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1800&h=620&q=92",
    mobileImage:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&h=1100&q=90",
    href: "/home-care",
    eyebrow: "Home care sale",
    title: "Clean home, smart savings",
    subtitle: "Daily cleaning, hygiene and household essentials delivered.",
    offer: "Bundle offers",
    cta: "Shop home care",
    alt: "Cleaning and home care ecommerce promotional banner",
    tone: "slate",
    desktopPosition: "center right",
  },
  {
    id: 7,
    desktopImage:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&h=620&q=92",
    mobileImage:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&h=1100&q=90",
    href: "/beauty",
    eyebrow: "Makeup collection",
    title: "Fresh beauty drops are here",
    subtitle: "Lip, face, eye and grooming favorites from loved brands.",
    offer: "New arrivals",
    cta: "Explore beauty",
    alt: "Cosmetics and makeup products for a real ecommerce banner",
    tone: "violet",
    desktopPosition: "center",
  },
];

export default function BasicSiteBanner() {
  return (
    <>
      <section aria-label="Arogga ecommerce promotional banners" className="basic-banner-section">
        <div className="basic-banner-container">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, Keyboard, A11y, EffectCreative]}
            effect="creative"
            creativeEffect={{
              prev: { translate: ["-8%", 0, -120], opacity: 0.55 },
              next: { translate: ["8%", 0, -120], opacity: 0.55 },
            }}
            slidesPerView={1}
            loop
            speed={850}
            grabCursor
            keyboard={{ enabled: true, onlyInViewport: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: ".basic-banner-prev", nextEl: ".basic-banner-next" }}
            pagination={{
              el: ".basic-banner-pagination",
              clickable: true,
              renderBullet: (index, className) =>
                `<button type="button" class="${className}" aria-label="Go to banner ${index + 1}"><span></span></button>`,
            }}
            a11y={{
              enabled: true,
              prevSlideMessage: "Previous banner",
              nextSlideMessage: "Next banner",
              paginationBulletMessage: "Go to banner {{index}}",
            }}
            className="basic-banner-swiper"
          >
            {bannerSlides.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                {({ isActive }) => (
                  <article className={`basic-banner-slide is-${slide.tone} ${isActive ? "is-active" : ""}`}>
                    <Link href={slide.href} className="basic-banner-link" aria-label={slide.alt}>
                      <picture>
                        <source media="(max-width: 639px)" srcSet={slide.mobileImage} />
                        <img
                          src={slide.desktopImage}
                          alt={slide.alt}
                          width={1800}
                          height={620}
                          draggable={false}
                          loading={index === 0 ? "eager" : "lazy"}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          className="basic-banner-image"
                          style={{ objectPosition: slide.desktopPosition ?? "center" }}
                        />
                      </picture>

                      <span className="basic-banner-dim" aria-hidden="true" />
                      <span className="basic-banner-product-card" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>

                      <span className="basic-banner-copy">
                        <span className="basic-banner-eyebrow">{slide.eyebrow}</span>
                        <strong>{slide.title}</strong>
                        <small>{slide.subtitle}</small>
                        <span className="basic-banner-actions">
                          <em>{slide.cta}</em>
                          <b>{slide.offer}</b>
                        </span>
                      </span>
                    </Link>
                  </article>
                )}
              </SwiperSlide>
            ))}

            <button type="button" aria-label="Previous banner" className="basic-banner-arrow basic-banner-prev">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M14.5 5 7.5 12l7 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button type="button" aria-label="Next banner" className="basic-banner-arrow basic-banner-next">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m9.5 5 7 7-7 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="basic-banner-pagination" aria-label="Banner pagination" />
          </Swiper>
        </div>
      </section>

      <style>{`
        .basic-banner-section {
          width: 100%;
          padding: 18px 0 12px;
          overflow: hidden;
          background:
            radial-gradient(circle at 8% 5%, rgba(8, 123, 117, 0.08), transparent 24%),
            radial-gradient(circle at 92% 92%, rgba(255, 145, 77, 0.1), transparent 26%),
            #ffffff;
        }

        .basic-banner-container {
          width: min(1440px, calc(100% - 48px));
          margin-inline: auto;
        }

        .basic-banner-swiper {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 22px;
          background: #eef2f3;
          box-shadow: 0 28px 70px -52px rgba(15, 23, 42, 0.72);
          isolation: isolate;
        }

        .basic-banner-link,
        .basic-banner-link picture {
          position: relative;
          display: block;
          width: 100%;
          min-height: clamp(245px, 26vw, 372px);
          overflow: hidden;
          color: inherit;
          text-decoration: none;
        }

        .basic-banner-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.045);
          filter: saturate(1.04) contrast(1.03);
          transition: transform 5200ms cubic-bezier(0.16, 1, 0.3, 1), filter 700ms ease;
        }

        .basic-banner-slide.is-active .basic-banner-image {
          transform: scale(1.005);
          filter: saturate(1.1) contrast(1.04);
        }

        .basic-banner-dim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(7, 16, 38, 0.72) 0%, rgba(7, 16, 38, 0.48) 35%, rgba(7, 16, 38, 0.08) 68%, rgba(7, 16, 38, 0.2) 100%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(7, 16, 38, 0.18));
        }

        .basic-banner-copy {
          position: absolute;
          top: 50%;
          left: clamp(24px, 5vw, 72px);
          z-index: 2;
          display: flex;
          width: min(520px, 52%);
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          color: #fff;
          transform: translateY(-50%);
        }

        .basic-banner-eyebrow {
          display: inline-flex;
          min-height: 28px;
          align-items: center;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(12px);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .basic-banner-copy strong {
          max-width: 12ch;
          font-size: clamp(30px, 4.1vw, 58px);
          font-weight: 950;
          line-height: 0.94;
          letter-spacing: -0.06em;
          text-wrap: balance;
        }

        .basic-banner-copy small {
          max-width: 430px;
          color: rgba(255, 255, 255, 0.86);
          font-size: clamp(13px, 1.2vw, 16px);
          font-weight: 550;
          line-height: 1.5;
        }

        .basic-banner-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          padding-top: 4px;
        }

        .basic-banner-actions em,
        .basic-banner-actions b {
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-style: normal;
          font-size: 13px;
          font-weight: 900;
        }

        .basic-banner-actions em {
          padding: 0 18px;
          color: #0b817a;
          background: #fff;
          box-shadow: 0 16px 32px -22px rgba(15, 23, 42, 0.8);
        }

        .basic-banner-actions b {
          padding: 0 14px;
          color: #fff;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.26);
          backdrop-filter: blur(12px);
        }

        .basic-banner-product-card {
          position: absolute;
          right: clamp(18px, 4.2vw, 62px);
          bottom: clamp(20px, 3.4vw, 48px);
          z-index: 2;
          display: grid;
          width: clamp(140px, 15vw, 218px);
          gap: 8px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.36);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.18);
          box-shadow: 0 22px 52px -32px rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(18px);
        }

        .basic-banner-product-card span {
          display: block;
          height: 9px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.82);
        }

        .basic-banner-product-card span:first-child {
          width: 62%;
          height: 34px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.45));
        }

        .basic-banner-product-card span:nth-child(2) {
          width: 82%;
        }

        .basic-banner-product-card span:nth-child(3) {
          width: 48%;
          background: rgba(255, 255, 255, 0.58);
        }

        .is-teal { --banner-accent: #087b75; }
        .is-rose { --banner-accent: #e04f7f; }
        .is-blue { --banner-accent: #2563eb; }
        .is-amber { --banner-accent: #d97706; }
        .is-violet { --banner-accent: #7c3aed; }
        .is-green { --banner-accent: #16a34a; }
        .is-slate { --banner-accent: #334155; }

        .basic-banner-slide .basic-banner-actions em {
          color: var(--banner-accent);
        }

        .basic-banner-slide::after {
          position: absolute;
          top: -28%;
          right: -10%;
          width: 42%;
          height: 76%;
          border-radius: 999px;
          background: color-mix(in srgb, var(--banner-accent) 46%, transparent);
          filter: blur(58px);
          opacity: 0.62;
          pointer-events: none;
          content: "";
        }

        .basic-banner-arrow {
          position: absolute;
          top: 50%;
          z-index: 20;
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 14px;
          color: #087b75;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 18px 34px -24px rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(14px);
          cursor: pointer;
          opacity: 0;
          transform: translateY(-50%);
          transition: opacity 220ms ease, transform 220ms ease, background 220ms ease, color 220ms ease;
        }

        .basic-banner-swiper:hover .basic-banner-arrow,
        .basic-banner-swiper:focus-within .basic-banner-arrow {
          opacity: 1;
        }

        .basic-banner-prev { left: 16px; transform: translate(-8px, -50%); }
        .basic-banner-next { right: 16px; transform: translate(8px, -50%); }
        .basic-banner-swiper:hover .basic-banner-prev,
        .basic-banner-swiper:focus-within .basic-banner-prev,
        .basic-banner-swiper:hover .basic-banner-next,
        .basic-banner-swiper:focus-within .basic-banner-next { transform: translate(0, -50%); }

        .basic-banner-arrow:hover {
          color: #fff;
          background: #087b75;
        }

        .basic-banner-arrow svg {
          width: 20px;
          height: 20px;
        }

        .basic-banner-pagination {
          position: absolute;
          right: 24px;
          bottom: 18px;
          left: auto !important;
          z-index: 25;
          display: flex;
          width: auto !important;
          gap: 6px;
          padding: 7px 10px;
          border: 1px solid rgba(255, 255, 255, 0.34);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(14px);
        }

        .basic-banner-pagination .swiper-pagination-bullet {
          position: relative;
          display: block;
          width: 22px;
          height: 7px;
          margin: 0 !important;
          padding: 0;
          overflow: hidden;
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.44);
          opacity: 1;
          cursor: pointer;
          transition: width 240ms ease, background 240ms ease;
        }

        .basic-banner-pagination .swiper-pagination-bullet-active {
          width: 46px;
          background: rgba(255, 255, 255, 0.34);
        }

        .basic-banner-pagination .swiper-pagination-bullet span {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: inherit;
        }

        .basic-banner-pagination .swiper-pagination-bullet-active span {
          transform-origin: left center;
          background: #ffffff;
          animation: basicBannerProgress 4.5s linear both;
        }

        @keyframes basicBannerProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @media (max-width: 900px) {
          .basic-banner-container { width: calc(100% - 28px); }
          .basic-banner-copy { width: min(500px, 64%); }
          .basic-banner-product-card { display: none; }
        }

        @media (max-width: 639px) {
          .basic-banner-section { padding: 10px 0 8px; }
          .basic-banner-container { width: 100%; }
          .basic-banner-swiper { border-right: 0; border-left: 0; border-radius: 0; }
          .basic-banner-link,
          .basic-banner-link picture { min-height: clamp(310px, 82vw, 430px); }
          .basic-banner-image { object-position: center !important; }
          .basic-banner-dim {
            background: linear-gradient(180deg, rgba(7, 16, 38, 0.3), rgba(7, 16, 38, 0.76));
          }
          .basic-banner-copy {
            top: auto;
            bottom: 56px;
            left: 18px;
            width: calc(100% - 36px);
            gap: 9px;
            transform: none;
          }
          .basic-banner-copy strong { max-width: 12ch; }
          .basic-banner-copy small { max-width: 92%; font-size: 13px; }
          .basic-banner-actions em,
          .basic-banner-actions b { min-height: 36px; font-size: 12px; }
          .basic-banner-arrow { width: 36px; height: 36px; border-radius: 12px; opacity: 1; }
          .basic-banner-prev { left: 10px; transform: translate(0, -50%); }
          .basic-banner-next { right: 10px; transform: translate(0, -50%); }
          .basic-banner-pagination { right: 50%; bottom: 14px; transform: translateX(50%); }
        }

        @media (hover: none) {
          .basic-banner-arrow { opacity: 1; }
          .basic-banner-prev,
          .basic-banner-next { transform: translate(0, -50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .basic-banner-section *,
          .basic-banner-section *::before,
          .basic-banner-section *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
