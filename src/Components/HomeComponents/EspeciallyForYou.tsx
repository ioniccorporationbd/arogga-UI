"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type OfferCard = {
  id: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  phone?: string;
  buttonText: string;
  href: string;
  background: string;
  buttonColor: string;
  iconBackground: string;
  iconUrl: string;
  iconAlt: string;
  external?: boolean;
  accent: string;
};

const cards: OfferCard[] = [
  {
    id: 1,
    eyebrow: "Easy Ordering",
    title: "Via WhatsApp",
    phone: "01810117100",
    buttonText: "Order Now",
    href: "https://wa.me/8801810117100",
    background:
      "linear-gradient(145deg, #f7fff5 0%, #d9f7d4 48%, #91e396 100%)",
    buttonColor: "#159447",
    iconBackground: "#25d366",
    iconUrl: "https://cdn.simpleicons.org/whatsapp/ffffff",
    iconAlt: "WhatsApp",
    external: true,
    accent: "#159447",
  },
  {
    id: 2,
    eyebrow: "Save Up To",
    title: "10% OFF",
    subtitle: "+ Cashback",
    buttonText: "Upload Prescription",
    href: "/upload-prescription",
    background:
      "linear-gradient(145deg, #f4ffff 0%, #d5f6f7 48%, #7ddde2 100%)",
    buttonColor: "#087f8c",
    iconBackground: "#0caebd",
    iconUrl:
      "https://img.icons8.com/fluency-systems-filled/96/ffffff/prescription-pill-bottle.png",
    iconAlt: "Prescription",
    accent: "#087f8c",
  },
  {
    id: 3,
    eyebrow: "Save Up To",
    title: "14% OFF",
    subtitle: "+ Cashback",
    buttonText: "Register Pharmacy",
    href: "/register-pharmacy",
    background:
      "linear-gradient(145deg, #fffff5 0%, #eef8c8 48%, #b8dc55 100%)",
    buttonColor: "#5f9000",
    iconBackground: "#78b700",
    iconUrl: "https://img.icons8.com/ios-filled/96/ffffff/shop.png",
    iconAlt: "Pharmacy",
    accent: "#5f9000",
  },
  {
    id: 4,
    eyebrow: "Save Up To",
    title: "60% OFF",
    subtitle: "+ Cashback",
    buttonText: "Explore Healthcare",
    href: "/healthcare",
    background:
      "linear-gradient(145deg, #fffaff 0%, #eadffd 48%, #c7a6fb 100%)",
    buttonColor: "#7d4cd1",
    iconBackground: "#8e5be8",
    iconUrl:
      "https://img.icons8.com/ios-filled/96/ffffff/medical-doctor.png",
    iconAlt: "Healthcare",
    accent: "#7d4cd1",
  },
  {
    id: 5,
    eyebrow: "Call To Order",
    title: "10% OFF",
    phone: "16778",
    buttonText: "Call Now",
    href: "tel:16778",
    background:
      "linear-gradient(145deg, #fffaf5 0%, #ffe3c8 48%, #ffb073 100%)",
    buttonColor: "#d85c1f",
    iconBackground: "#ff7a32",
    iconUrl: "https://img.icons8.com/ios-filled/96/ffffff/headset.png",
    iconAlt: "Call center",
    external: true,
    accent: "#d85c1f",
  },
  {
    id: 6,
    eyebrow: "Save Up To",
    title: "25% OFF",
    subtitle: "On Lab Tests",
    buttonText: "Book Lab Test",
    href: "/lab",
    background:
      "linear-gradient(145deg, #fff8f8 0%, #ffd9d7 48%, #ff9b9f 100%)",
    buttonColor: "#dc3f47",
    iconBackground: "#f8565e",
    iconUrl: "https://img.icons8.com/ios-filled/96/ffffff/test-tube.png",
    iconAlt: "Lab test",
    accent: "#dc3f47",
  },
];

export default function EspeciallyForYou() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative isolate w-full bg-[#fbfdfd] py-12 sm:py-14 lg:py-16 xl:py-20"
      >
        {/* Background decoration */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-16 -z-10 h-80 w-80 rounded-full bg-[#dff8f4]/70 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#fff0d9]/70 blur-3xl"
        />

        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Section heading */}

          <div
            className={[
              "mb-8 flex flex-col gap-3 transition-all duration-700",
              "sm:mb-10 sm:flex-row sm:items-end sm:justify-between",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            ].join(" ")}
          >
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#087b75] sm:text-sm">
                Exclusive Services
              </p>

              <h2 className="text-[28px] font-bold leading-tight tracking-[-0.035em] text-[#111827] sm:text-3xl lg:text-[36px]">
                Especially For You
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">
                Discover healthcare offers, pharmacy support and quick ordering
                services designed for your everyday needs.
              </p>
            </div>

            <Link
              href="/offers"
              className="group hidden shrink-0 items-center gap-2 rounded-full px-1 py-2 text-sm font-semibold text-[#087b75] transition-colors hover:text-[#055f5a] sm:flex"
            >
              View all offers

              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Cards */}

          <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <div
              className="
                offer-scroll-local
                flex snap-x snap-mandatory items-stretch gap-[10px]
                overflow-x-auto overflow-y-visible px-[10px] pb-12 pt-6

                lg:grid
                lg:grid-cols-3
                lg:overflow-visible
                lg:px-[10px]
                lg:pb-10
                lg:pt-7

                xl:grid-cols-6
              "
            >
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className={[
                    "flex h-full min-w-0 transition-all",
                    "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isVisible
                      ? "translate-x-0 translate-y-0 opacity-100"
                      : index % 2 === 0
                        ? "-translate-x-12 translate-y-8 opacity-0"
                        : "translate-x-12 translate-y-8 opacity-0",
                  ].join(" ")}
                  style={{
                    transitionDelay: isVisible
                      ? `${index * 100}ms`
                      : "0ms",
                  }}
                >
                  <OfferCardItem card={card} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile view all button */}

          <div
            className={[
              "mt-1 flex justify-center transition-all duration-700 sm:hidden",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0",
            ].join(" ")}
            style={{
              transitionDelay: isVisible ? "700ms" : "0ms",
            }}
          >
            <Link
              href="/offers"
              className="
                inline-flex min-h-11 items-center justify-center gap-2
                rounded-full border border-[#cce8e5] bg-white px-6
                text-sm font-semibold text-[#087b75] shadow-sm
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-[#087b75]
                hover:bg-[#f2fbfa]
                hover:shadow-md
              "
            >
              View all offers

              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* All additional CSS remains inside this component */}

      <style jsx global>{`
        .offer-scroll-local {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-padding-inline: 10px;
          overscroll-behavior-inline: contain;
          -webkit-overflow-scrolling: touch;
        }

        .offer-scroll-local::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .offer-scroll-local,
          .offer-scroll-local *,
          .offer-scroll-local *::before,
          .offer-scroll-local *::after {
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

function OfferCardItem({ card }: { card: OfferCard }) {
  const cardContent = (
    <div
      className="
        group/card relative flex h-full w-[250px]
        shrink-0 snap-start

        sm:w-[272px]
        lg:w-full
      "
    >
      {/* Outside glow */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -inset-2
          rounded-[34px] opacity-0 blur-xl

          transition-all duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover/card:scale-105
          group-hover/card:opacity-35
        "
        style={{
          backgroundColor: card.iconBackground,
        }}
      />

      <article
        className="
          relative z-10 flex h-[286px] w-full flex-col
          overflow-hidden rounded-[28px]
          border border-white/80 p-5

          shadow-[0_16px_40px_-25px_rgba(15,23,42,0.42)]

          transition-[transform,box-shadow,border-color]
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover/card:z-30
          group-hover/card:-translate-y-2
          group-hover/card:scale-[1.025]
          group-hover/card:border-white
          group-hover/card:shadow-[0_30px_60px_-24px_rgba(15,23,42,0.48)]

          group-active/card:scale-[1.01]

          motion-reduce:transform-none

          sm:h-[294px]
          lg:h-[302px]
        "
        style={{
          background: card.background,
        }}
      >
        {/* Inner overlay */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-br
            from-white/30
            via-transparent
            to-black/[0.04]
          "
        />

        {/* Top decorative ring */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute -right-12 -top-12
            h-36 w-36 rounded-full
            border-[20px] border-white/20

            transition-all duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover/card:-translate-x-3
            group-hover/card:translate-y-3
            group-hover/card:scale-110
            group-hover/card:rotate-12
          "
        />

        {/* Bottom decorative circle */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute -bottom-20 -left-16
            h-44 w-44 rounded-full bg-white/20 blur-sm

            transition-all duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover/card:translate-x-6
            group-hover/card:-translate-y-5
            group-hover/card:scale-125
          "
        />

        {/* Small decorative dot */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute bottom-[76px] right-5
            h-3 w-3 rounded-full bg-white/55

            transition-all duration-500

            group-hover/card:-translate-x-3
            group-hover/card:-translate-y-2
            group-hover/card:scale-150
          "
        />

        {/* Shine animation */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-y-0 -left-[85%]
            z-20 w-[45%] rotate-[18deg]

            bg-gradient-to-r
            from-transparent
            via-white/40
            to-transparent

            transition-[left] duration-700 ease-out

            group-hover/card:left-[135%]
          "
        />

        {/* Card top */}

        <div className="relative z-10 mb-7 flex items-start justify-between gap-3">
          <span
            className="
              inline-flex min-h-7 items-center
              rounded-full border border-white/70
              bg-white/60 px-3 py-1.5

              text-[10px] font-bold uppercase
              tracking-[0.14em] text-black/65

              shadow-sm backdrop-blur-md

              transition-all duration-500

              group-hover/card:-translate-y-0.5
              group-hover/card:bg-white/85
              group-hover/card:shadow-md
            "
          >
            {card.eyebrow}
          </span>

          <span
            className="
              relative flex h-[62px] w-[62px] shrink-0
              items-center justify-center overflow-hidden

              rounded-[20px] border border-white/75

              shadow-[0_12px_26px_-12px_rgba(15,23,42,0.45)]

              transition-all duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]

              group-hover/card:-rotate-6
              group-hover/card:scale-110
              group-hover/card:rounded-[23px]
              group-hover/card:shadow-[0_18px_35px_-12px_rgba(15,23,42,0.5)]
            "
            style={{
              backgroundColor: card.iconBackground,
            }}
          >
            <span
              aria-hidden="true"
              className="
                absolute inset-0
                bg-gradient-to-br
                from-white/30
                to-transparent

                opacity-0
                transition-opacity duration-500

                group-hover/card:opacity-100
              "
            />

            <img
              src={card.iconUrl}
              alt={card.iconAlt}
              width={34}
              height={34}
              loading="lazy"
              draggable={false}
              className="
                relative z-10 h-[34px] w-[34px]
                object-contain

                transition-transform duration-500

                group-hover/card:rotate-6
                group-hover/card:scale-110
              "
            />
          </span>
        </div>

        {/* Main content */}

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <h3
            className="
              max-w-[178px]
              text-[25px] font-extrabold
              leading-[1.08]
              tracking-[-0.035em]
              text-[#101828]

              transition-all duration-500

              group-hover/card:-translate-y-1
            "
          >
            {card.title}
          </h3>

          <div className="min-h-[52px]">
            {card.subtitle && (
              <p
                className="
                  mt-2 text-[16px] font-semibold
                  leading-5 text-[#344054]

                  transition-transform duration-500

                  group-hover/card:-translate-y-1
                "
              >
                {card.subtitle}
              </p>
            )}

            {card.phone && (
              <div
                className="
                  mt-3 flex items-center gap-2

                  transition-transform duration-500

                  group-hover/card:translate-x-1
                "
              >
                <span
                  className="
                    flex h-7 w-7 items-center justify-center
                    rounded-full bg-white/80 shadow-sm

                    transition-all duration-500

                    group-hover/card:scale-110
                    group-hover/card:bg-white
                    group-hover/card:shadow-md
                  "
                  style={{
                    color: card.accent,
                  }}
                >
                  <PhoneIcon className="h-3.5 w-3.5" />
                </span>

                <p className="text-[17px] font-bold tracking-[-0.02em] text-[#1d2939]">
                  {card.phone}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA button */}

        <span
          className="
            relative z-10 mt-auto flex min-h-12 w-full
            items-center justify-between overflow-hidden

            rounded-[15px]
            border border-white/75
            bg-white/90 px-4

            text-sm font-bold

            shadow-[0_8px_18px_-12px_rgba(15,23,42,0.4)]
            backdrop-blur-md

            transition-all duration-500

            group-hover/card:scale-[1.015]
            group-hover/card:bg-white
            group-hover/card:shadow-[0_15px_28px_-12px_rgba(15,23,42,0.45)]
          "
          style={{
            color: card.buttonColor,
          }}
        >
          <span
            aria-hidden="true"
            className="
              absolute inset-y-0 -left-full w-1/2

              bg-gradient-to-r
              from-transparent
              via-black/[0.04]
              to-transparent

              transition-[left] duration-700

              group-hover/card:left-[125%]
            "
          />

          <span className="relative z-10 line-clamp-1 pr-2">
            {card.buttonText}
          </span>

          <span
            className="
              relative z-10 flex h-7 w-7 shrink-0
              items-center justify-center rounded-full

              transition-all duration-500

              group-hover/card:translate-x-1
              group-hover/card:scale-110
            "
            style={{
              backgroundColor: `${card.buttonColor}18`,
            }}
          >
            <ArrowIcon className="h-3.5 w-3.5" />
          </span>
        </span>
      </article>
    </div>
  );

  const linkClassName = `
    block h-full shrink-0 rounded-[30px]
    outline-none

    focus-visible:ring-2
    focus-visible:ring-[#087b75]
    focus-visible:ring-offset-4
  `;

  if (card.external) {
    return (
      <a
        href={card.href}
        target={card.href.startsWith("http") ? "_blank" : undefined}
        rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
        aria-label={`${card.buttonText}: ${card.title}`}
        className={linkClassName}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link
      href={card.href}
      aria-label={`${card.buttonText}: ${card.title}`}
      className={linkClassName}
    >
      {cardContent}
    </Link>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4.167 10h11.666M10.833 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6.4 2.5H4.7c-.8 0-1.5.7-1.4 1.5.5 6.6 5.8 11.9 12.4 12.4.8.1 1.5-.6 1.5-1.4v-1.7c0-.7-.5-1.3-1.2-1.4l-2.2-.5c-.6-.1-1.2.1-1.6.6l-.5.7a12 12 0 0 1-4.5-4.5l.7-.5c.5-.4.7-1 .6-1.6L8 3.7c-.2-.7-.8-1.2-1.6-1.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}