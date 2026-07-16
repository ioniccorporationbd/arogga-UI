"use client";

import Image from "next/image";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  href: string;
  image: string;
  imagePosition?: string;
};

const categories: Category[] = [
  {
    id: 1,
    name: "Medicine",
    href: "/medicine",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Beauty",
    href: "/beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Home Lab",
    href: "/lab",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Food & Nutrition",
    href: "/food-and-nutrition",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    name: "Baby & Mom Care",
    href: "/baby-mom-care",
    image:
      "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    name: "Homecare",
    href: "/home-care",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 7,
    name: "Pet Care",
    href: "/pet-care",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 8,
    name: "Healthcare",
    href: "/healthcare",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 9,
    name: "Herbal",
    href: "/herbal",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 10,
    name: "Sexual Wellness",
    href: "/sexual-wellness",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 11,
    name: "Supplement",
    href: "/supplement",
    image:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 12,
    name: "Veterinary",
    href: "/veterinary",
    image:
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 13,
    name: "Homeopathy",
    href: "/homeopathy",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 14,
    name: "Haircare",
    href: "/haircare",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 15,
    name: "Skincare",
    href: "/skincare",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 16,
    name: "Feminine Care",
    href: "/feminine-care",
    image:
      "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 17,
    name: "Medical Devices",
    href: "/medical-devices",
    image:
      "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 18,
    name: "Dermatological Preparations",
    href: "/dermatology",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85",
  },
];

export default function AllYouNeed() {
  return (
    <>
      <section
        className="all-you-need-section"
        aria-labelledby="all-you-need-title"
      >
        <div
          aria-hidden="true"
          className="all-you-need-grid-pattern"
        />

        <div
          aria-hidden="true"
          className="all-you-need-glow all-you-need-glow-left"
        />

        <div
          aria-hidden="true"
          className="all-you-need-glow all-you-need-glow-right"
        />

        <div className="all-you-need-container">
          <header className="all-you-need-header">
            <div className="all-you-need-heading-group">
              <p className="all-you-need-eyebrow">
                Shop by category
              </p>

              <h2
                id="all-you-need-title"
                className="all-you-need-title"
              >
                All You Need
              </h2>

              <p className="all-you-need-description">
                Discover healthcare, wellness, beauty and everyday essentials in
                one convenient place.
              </p>
            </div>

            <Link
              href="/categories"
              className="all-you-need-view-all all-you-need-view-all-desktop"
            >
              <span>View all categories</span>
              <ArrowIcon />
            </Link>
          </header>

          <div className="all-you-need-grid">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                priority={index < 6}
              />
            ))}
          </div>

          <div className="all-you-need-mobile-action">
            <Link
              href="/categories"
              className="all-you-need-view-all all-you-need-view-all-mobile"
            >
              <span>View all categories</span>
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .all-you-need-section {
          --ayn-text-20: 20px;
          --ayn-text-18: 18px;
          --ayn-text-16: 16px;
          --ayn-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 72px 0;
          background:
            radial-gradient(
              circle at 5% 20%,
              rgba(208, 249, 242, 0.66),
              transparent 26%
            ),
            radial-gradient(
              circle at 95% 86%,
              rgba(255, 244, 203, 0.75),
              transparent 27%
            ),
            #ffffff;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .all-you-need-grid-pattern {
          position: absolute;
          inset: 0;
          z-index: -4;
          pointer-events: none;
          opacity: 0.28;
          background-image:
            linear-gradient(
              rgba(8, 123, 117, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(8, 123, 117, 0.035) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.8),
            transparent 94%
          );
        }

        .all-you-need-glow {
          position: absolute;
          z-index: -3;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(92px);
          opacity: 0.62;
          will-change: transform;
        }

        .all-you-need-glow-left {
          top: 40px;
          left: -180px;
          background: rgba(159, 235, 222, 0.5);
          animation: aynGlowLeft 10s ease-in-out infinite;
        }

        .all-you-need-glow-right {
          right: -180px;
          bottom: -80px;
          background: rgba(255, 220, 132, 0.38);
          animation: aynGlowRight 12s ease-in-out infinite;
        }

        .all-you-need-container {
          position: relative;
          width: min(1440px, calc(100% - 64px));
          margin: 0 auto;
        }

        .all-you-need-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 34px;
        }

        .all-you-need-heading-group {
          max-width: 700px;
        }

        .all-you-need-eyebrow {
          margin: 0 0 9px;
          color: #087b75;
          font-size: var(--ayn-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .all-you-need-title {
          margin: 0;
          color: #111827;
          font-size: var(--ayn-text-20);
          font-weight: 850;
          line-height: 1.3;
          letter-spacing: -0.025em;
        }

        .all-you-need-description {
          max-width: 620px;
          margin: 11px 0 0;
          color: #667085;
          font-size: var(--ayn-text-16);
          line-height: 1.7;
        }

        .all-you-need-view-all {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 999px;
          color: #087b75;
          font-size: var(--ayn-text-13);
          font-weight: 800;
          line-height: 1;
          text-decoration: none;
          transition:
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
            color 300ms ease,
            border-color 300ms ease,
            background-color 300ms ease,
            box-shadow 300ms ease;
        }

        .all-you-need-view-all-desktop {
          flex-shrink: 0;
          padding: 0 4px;
        }

        .all-you-need-view-all:hover {
          color: #055f5a;
          transform: translateY(-2px);
        }

        .all-you-need-view-all svg {
          width: 16px;
          height: 16px;
          transition: transform 300ms ease;
        }

        .all-you-need-view-all:hover svg {
          transform: translateX(4px);
        }

        .all-you-need-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 22px 16px;
        }

        .all-you-need-link {
          display: block;
          min-width: 0;
          height: 100%;
          border-radius: 22px;
          color: inherit;
          text-decoration: none;
          outline: none;
        }

        .all-you-need-link:focus-visible {
          box-shadow:
            0 0 0 3px rgba(8, 123, 117, 0.28),
            0 0 0 7px #ffffff;
        }

        .all-you-need-card {
          display: flex;
          height: 100%;
          flex-direction: column;
        }

        .all-you-need-card-frame {
          position: relative;
          overflow: hidden;
          padding: 7px;
          border: 1px solid #e7eeec;
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 10px 28px -24px rgba(15, 23, 42, 0.48);
          transform: translateZ(0);
          transition:
            transform 480ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 420ms ease,
            box-shadow 480ms ease;
          will-change: transform;
          backface-visibility: hidden;
        }

        .all-you-need-link:hover .all-you-need-card-frame {
          border-color: #bfe3df;
          transform: translate3d(0, -7px, 0);
          box-shadow:
            0 27px 55px -30px rgba(8, 123, 117, 0.42),
            0 12px 30px -24px rgba(15, 23, 42, 0.36);
        }

        .all-you-need-image-wrap {
          position: relative;
          aspect-ratio: 1 / 1.03;
          overflow: hidden;
          border-radius: 15px;
          background: #f2f6f5;
        }

        .all-you-need-image {
          object-fit: cover;
          transform: scale(1.001);
          transition:
            transform 750ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 600ms ease;
          will-change: transform;
        }

        .all-you-need-link:hover .all-you-need-image {
          transform: scale(1.075);
          filter: saturate(1.03) contrast(1.02);
        }

        .all-you-need-image-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              to top,
              rgba(16, 24, 40, 0.16),
              transparent 44%
            ),
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.12),
              transparent 40%
            );
          opacity: 0.65;
          transition: opacity 420ms ease;
        }

        .all-you-need-link:hover .all-you-need-image-overlay {
          opacity: 0.38;
        }

        .all-you-need-image-shine {
          position: absolute;
          inset: 0 auto 0 -85%;
          width: 42%;
          pointer-events: none;
          transform: rotate(17deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.42),
            transparent
          );
          transition: left 760ms ease;
        }

        .all-you-need-link:hover .all-you-need-image-shine {
          left: 135%;
        }

        .all-you-need-arrow {
          position: absolute;
          right: 12px;
          bottom: 12px;
          display: flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.86);
          border-radius: 50%;
          color: #087b75;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 10px 22px -12px rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(12px);
          opacity: 0;
          transform: translate3d(0, 10px, 0) scale(0.92);
          transition:
            opacity 350ms ease,
            transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .all-you-need-link:hover .all-you-need-arrow {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }

        .all-you-need-arrow svg {
          width: 16px;
          height: 16px;
          transition: transform 300ms ease;
        }

        .all-you-need-link:hover .all-you-need-arrow svg {
          transform: translateX(2px);
        }

        .all-you-need-card-title {
          display: flex;
          min-height: 48px;
          align-items: flex-start;
          justify-content: center;
          margin: 13px 0 0;
          padding: 0 6px;
          color: #1f2937;
          font-size: var(--ayn-text-13);
          font-weight: 750;
          line-height: 1.5;
          text-align: center;
          transition:
            color 300ms ease,
            transform 350ms ease;
        }

        .all-you-need-link:hover .all-you-need-card-title {
          color: #087b75;
          transform: translateY(-1px);
        }

        .all-you-need-mobile-action {
          display: none;
          justify-content: center;
          margin-top: 30px;
        }

        .all-you-need-view-all-mobile {
          min-width: 210px;
          padding: 0 22px;
          border: 1px solid #cde9e6;
          background: #ffffff;
          box-shadow: 0 11px 25px -19px rgba(15, 23, 42, 0.5);
        }

        .all-you-need-view-all-mobile:hover {
          border-color: #087b75;
          background: #f2fbfa;
          box-shadow: 0 15px 30px -20px rgba(8, 123, 117, 0.42);
        }

        @keyframes aynGlowLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(30px, -18px, 0) scale(1.07);
          }
        }

        @keyframes aynGlowRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-26px, -20px, 0) scale(1.08);
          }
        }

        @media (min-width: 1280px) and (max-width: 1499px) {
          .all-you-need-container {
            width: min(1320px, calc(100% - 48px));
          }

          .all-you-need-grid {
            gap: 20px 14px;
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .all-you-need-section {
            padding: 64px 0;
          }

          .all-you-need-container {
            width: min(980px, calc(100% - 48px));
          }

          .all-you-need-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 20px 14px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .all-you-need-section {
            padding: 58px 0;
          }

          .all-you-need-container {
            width: min(760px, calc(100% - 40px));
          }

          .all-you-need-header {
            align-items: center;
            margin-bottom: 30px;
          }

          .all-you-need-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 20px 14px;
          }

          .all-you-need-card-frame {
            border-radius: 18px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .all-you-need-section {
            padding: 52px 0;
          }

          .all-you-need-container {
            width: calc(100% - 32px);
          }

          .all-you-need-header {
            align-items: center;
            margin-bottom: 28px;
          }

          .all-you-need-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px 13px;
          }
        }

        @media (max-width: 639px) {
          .all-you-need-section {
            padding: 46px 0 50px;
          }

          .all-you-need-container {
            width: calc(100% - 28px);
          }

          .all-you-need-header {
            display: block;
            margin-bottom: 24px;
            text-align: center;
          }

          .all-you-need-heading-group {
            max-width: 560px;
            margin: 0 auto;
          }

          .all-you-need-description {
            margin-right: auto;
            margin-left: auto;
          }

          .all-you-need-view-all-desktop {
            display: none;
          }

          .all-you-need-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 17px 12px;
          }

          .all-you-need-card-frame {
            padding: 5px;
            border-radius: 17px;
          }

          .all-you-need-image-wrap {
            border-radius: 12px;
          }

          .all-you-need-card-title {
            min-height: 42px;
            margin-top: 10px;
            padding: 0 3px;
          }

          .all-you-need-arrow {
            display: none;
          }

          .all-you-need-mobile-action {
            display: flex;
          }
        }

        @media (max-width: 399px) {
          .all-you-need-container {
            width: calc(100% - 22px);
          }

          .all-you-need-grid {
            gap: 15px 10px;
          }

          .all-you-need-card-frame {
            padding: 4px;
            border-radius: 15px;
          }

          .all-you-need-image-wrap {
            border-radius: 11px;
          }

          .all-you-need-card-title {
            min-height: 40px;
            margin-top: 9px;
          }
        }

        @media (hover: none) {
          .all-you-need-link:hover .all-you-need-card-frame,
          .all-you-need-link:hover .all-you-need-image,
          .all-you-need-link:hover .all-you-need-card-title {
            transform: none;
          }

          .all-you-need-link:hover .all-you-need-arrow {
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .all-you-need-section *,
          .all-you-need-section *::before,
          .all-you-need-section *::after {
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

function CategoryCard({
  category,
  priority,
}: {
  category: Category;
  priority: boolean;
}) {
  return (
    <Link
      href={category.href}
      aria-label={`Browse ${category.name}`}
      className="all-you-need-link"
    >
      <article className="all-you-need-card">
        <div className="all-you-need-card-frame">
          <div className="all-you-need-image-wrap">
            <Image
              src={category.image}
              alt={category.name}
              fill
              priority={priority}
              sizes="
                (max-width: 639px) 46vw,
                (max-width: 767px) 31vw,
                (max-width: 1023px) 23vw,
                (max-width: 1279px) 18vw,
                15vw
              "
              className="all-you-need-image"
              style={{
                objectPosition: category.imagePosition ?? "center",
              }}
            />

            <div
              aria-hidden="true"
              className="all-you-need-image-overlay"
            />

            <div
              aria-hidden="true"
              className="all-you-need-image-shine"
            />

            <div
              aria-hidden="true"
              className="all-you-need-arrow"
            >
              <ArrowIcon />
            </div>
          </div>
        </div>

        <h3 className="all-you-need-card-title">
          {category.name}
        </h3>
      </article>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
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