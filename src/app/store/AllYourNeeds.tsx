"use client";

import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import { useState } from "react";

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
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 2,
    name: "Beauty",
    href: "/beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 3,
    name: "Baby and Mom",
    href: "/baby-mom-care",
    image:
      "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=700&q=90",
    imagePosition: "center 35%",
  },
  {
    id: 4,
    name: "Food & Nutrition",
    href: "/food-and-nutrition",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 5,
    name: "Healthcare",
    href: "/healthcare",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 6,
    name: "Homecare",
    href: "/home-care",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 7,
    name: "Supplements",
    href: "/supplement",
    image:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 8,
    name: "Herbal",
    href: "/herbal",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 9,
    name: "Sexual Wellness",
    href: "/sexual-wellness",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 10,
    name: "Petcare",
    href: "/pet-care",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 11,
    name: "Homeopathy",
    href: "/homeopathy",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 12,
    name: "Veterinary",
    href: "/veterinary",
    image:
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 13,
    name: "Haircare",
    href: "/haircare",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 14,
    name: "Skincare",
    href: "/skincare",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 15,
    name: "Feminine Care",
    href: "/feminine-care",
    image:
      "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=700&q=90",
  },
  {
    id: 16,
    name: "Cream & Moisturizer",
    href: "/cream-moisturizer",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=90",
  },
];

export default function AllYourNeeds() {
  return (
    <>
      <section
        aria-labelledby="all-your-needs-title"
        className="all-needs-section"
      >
        <div
          aria-hidden="true"
          className="all-needs-glow all-needs-glow-left"
        />

        <div
          aria-hidden="true"
          className="all-needs-glow all-needs-glow-right"
        />

        <div className="all-needs-container">
          <header className="all-needs-header">
            <div>
              <p className="all-needs-eyebrow">
                Browse Categories
              </p>

              <h2
                id="all-your-needs-title"
                className="all-needs-title"
              >
                All Your Needs
              </h2>

              <p className="all-needs-description">
                Discover everyday health, wellness, beauty and home essentials
                in one convenient place.
              </p>
            </div>

            <Link
              href="/categories"
              className="all-needs-view-all"
            >
              <span>View All</span>
              <ArrowRight size={18} strokeWidth={1.8} />
            </Link>
          </header>

          <div className="all-needs-grid">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>

          <div className="all-needs-mobile-footer">
            <Link
              href="/categories"
              className="all-needs-mobile-button"
            >
              <span>View All Categories</span>
              <ArrowRight size={18} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .all-needs-section {
          --all-needs-text-20: 20px;
          --all-needs-text-18: 18px;
          --all-needs-text-16: 16px;
          --all-needs-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 50px 0 56px;
          background:
            radial-gradient(
              circle at 4% 12%,
              rgba(225, 247, 242, 0.7),
              transparent 27%
            ),
            radial-gradient(
              circle at 96% 88%,
              rgba(255, 240, 205, 0.62),
              transparent 28%
            ),
            #ffffff;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .all-needs-glow {
          position: absolute;
          z-index: -2;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(110px);
          opacity: 0.45;
        }

        .all-needs-glow-left {
          top: -120px;
          left: -210px;
          background: rgba(89, 211, 191, 0.38);
        }

        .all-needs-glow-right {
          right: -210px;
          bottom: -140px;
          background: rgba(255, 193, 94, 0.35);
        }

        .all-needs-container {
          position: relative;
          width: min(1440px, calc(100% - 48px));
          margin-inline: auto;
        }

        .all-needs-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }

        .all-needs-eyebrow {
          margin: 0;
          color: #087b75;
          font-size: var(--all-needs-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .all-needs-title {
          margin: 5px 0 0;
          color: #111827;
          font-size: var(--all-needs-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .all-needs-description {
          max-width: 620px;
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--all-needs-text-13);
          line-height: 1.7;
        }

        .all-needs-view-all {
          display: inline-flex;
          min-height: 42px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 8px 15px;
          border: 1px solid #cae2de;
          border-radius: 999px;
          color: #087b75;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 12px 25px -20px rgba(8, 123, 117, 0.6);
          font-size: var(--all-needs-text-13);
          font-weight: 800;
          text-decoration: none;
          transition:
            color 280ms ease,
            background-color 280ms ease,
            border-color 280ms ease,
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 300ms ease;
        }

        .all-needs-view-all:hover {
          border-color: #087b75;
          color: #ffffff;
          background: #087b75;
          box-shadow: 0 17px 30px -18px rgba(8, 123, 117, 0.72);
          transform: translateY(-2px);
        }

        .all-needs-view-all svg {
          transition: transform 280ms ease;
        }

        .all-needs-view-all:hover svg {
          transform: translateX(3px);
        }

        .all-needs-grid {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 22px 18px;
        }

        .all-needs-card-link {
          display: block;
          min-width: 0;
          border-radius: 16px;
          color: inherit;
          text-decoration: none;
          outline: none;
        }

        .all-needs-card-link:focus-visible {
          outline: 3px solid rgba(8, 123, 117, 0.2);
          outline-offset: 4px;
        }

        .all-needs-card {
          min-width: 0;
          height: 100%;
          text-align: center;
        }

        .all-needs-image-shell {
          position: relative;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          border: 1px solid rgba(147, 118, 42, 0.08);
          border-radius: 14px;
          background:
            radial-gradient(
              circle at 50% 43%,
              rgba(255, 255, 255, 0.82),
              transparent 45%
            ),
            linear-gradient(
              145deg,
              #fff9e8 0%,
              #fff5d9 52%,
              #fff9e8 100%
            );
          box-shadow:
            0 14px 34px -30px rgba(15, 23, 42, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.92);
          transform: translateZ(0);
          transition:
            border-color 350ms ease,
            transform 440ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 440ms ease;
        }

        .all-needs-card-link:hover .all-needs-image-shell {
          border-color: rgba(8, 123, 117, 0.22);
          box-shadow:
            0 28px 55px -34px rgba(8, 123, 117, 0.38),
            inset 0 1px rgba(255, 255, 255, 0.98);
          transform: translateY(-7px);
        }

        .all-needs-image-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 50% 72%,
              rgba(178, 141, 48, 0.09),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.2),
              transparent
            );
        }

        .all-needs-image-wrapper {
          position: absolute;
          inset: 13%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .all-needs-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
          filter:
            saturate(1.04)
            contrast(1.02);
          transform: scale(1.001);
          transition:
            transform 650ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 400ms ease;
          will-change: transform;
        }

        .all-needs-card-link:hover .all-needs-image {
          filter:
            saturate(1.12)
            contrast(1.04);
          transform: scale(1.09);
        }

        .all-needs-shine {
          position: absolute;
          inset: 0 auto 0 -70%;
          width: 35%;
          pointer-events: none;
          transform: skewX(-17deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent
          );
          transition: left 750ms ease;
        }

        .all-needs-card-link:hover .all-needs-shine {
          left: 130%;
        }

        .all-needs-arrow {
          position: absolute;
          right: 10px;
          bottom: 10px;
          display: flex;
          width: 34px;
          height: 34px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(8, 123, 117, 0.15);
          border-radius: 50%;
          color: #087b75;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 10px 22px -15px rgba(15, 23, 42, 0.48);
          opacity: 0;
          transform: translateY(6px) scale(0.9);
          transition:
            opacity 300ms ease,
            transform 350ms cubic-bezier(0.22, 1, 0.36, 1),
            color 250ms ease,
            background-color 250ms ease;
        }

        .all-needs-card-link:hover .all-needs-arrow {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .all-needs-card-link:hover .all-needs-arrow:hover {
          color: #ffffff;
          background: #087b75;
        }

        .all-needs-name {
          display: -webkit-box;
          min-height: 42px;
          overflow: hidden;
          margin: 10px 0 0;
          padding-inline: 4px;
          color: #101828;
          font-size: var(--all-needs-text-13);
          font-weight: 700;
          line-height: 1.6;
          text-align: center;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition:
            color 250ms ease,
            transform 300ms ease;
        }

        .all-needs-card-link:hover .all-needs-name {
          color: #087b75;
          transform: translateY(-2px);
        }

        .all-needs-mobile-footer {
          display: none;
        }

        .all-needs-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #98a2b3;
          background:
            radial-gradient(
              circle,
              rgba(255, 255, 255, 0.9),
              rgba(255, 247, 222, 0.94)
            );
        }

        .all-needs-fallback span {
          font-size: var(--all-needs-text-13);
          font-weight: 700;
        }

        @media (min-width: 1280px) and (max-width: 1450px) {
          .all-needs-container {
            width: min(1320px, calc(100% - 48px));
          }

          .all-needs-grid {
            gap: 20px 16px;
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .all-needs-section {
            padding: 46px 0 50px;
          }

          .all-needs-container {
            width: min(1180px, calc(100% - 40px));
          }

          .all-needs-grid {
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 20px 16px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .all-needs-section {
            padding: 42px 0 46px;
          }

          .all-needs-container {
            width: calc(100% - 32px);
          }

          .all-needs-header {
            margin-bottom: 21px;
          }

          .all-needs-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 19px 15px;
          }

          .all-needs-image-shell {
            border-radius: 13px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .all-needs-section {
            padding: 38px 0 42px;
          }

          .all-needs-container {
            width: calc(100% - 24px);
          }

          .all-needs-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px 13px;
          }

          .all-needs-view-all {
            display: none;
          }
        }

        @media (max-width: 639px) {
          .all-needs-section {
            padding: 34px 0 38px;
          }

          .all-needs-container {
            width: 100%;
          }

          .all-needs-header {
            margin-bottom: 18px;
            padding-inline: 14px;
          }

          .all-needs-description {
            max-width: 330px;
          }

          .all-needs-view-all {
            display: none;
          }

          .all-needs-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 17px 10px;
            padding-inline: 14px;
          }

          .all-needs-image-shell {
            border-radius: 12px;
          }

          .all-needs-image-wrapper {
            inset: 11%;
          }

          .all-needs-arrow {
            display: none;
          }

          .all-needs-name {
            min-height: 40px;
            margin-top: 8px;
            padding-inline: 2px;
          }

          .all-needs-mobile-footer {
            display: flex;
            justify-content: center;
            margin-top: 24px;
            padding-inline: 14px;
          }

          .all-needs-mobile-button {
            display: inline-flex;
            min-height: 44px;
            align-items: center;
            justify-content: center;
            gap: 7px;
            padding: 8px 18px;
            border: 1px solid #c9e2de;
            border-radius: 999px;
            color: #087b75;
            background: #ffffff;
            box-shadow: 0 12px 24px -18px rgba(8, 123, 117, 0.55);
            font-size: var(--all-needs-text-13);
            font-weight: 800;
            text-decoration: none;
          }
        }

        @media (max-width: 420px) {
          .all-needs-header {
            padding-inline: 11px;
          }

          .all-needs-grid {
            gap: 15px 8px;
            padding-inline: 11px;
          }

          .all-needs-name {
            line-height: 1.5;
          }

          .all-needs-mobile-footer {
            padding-inline: 11px;
          }
        }

        @media (max-width: 340px) {
          .all-needs-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px 10px;
          }
        }

        @media (hover: none) {
          .all-needs-card-link:hover .all-needs-image-shell,
          .all-needs-card-link:hover .all-needs-image,
          .all-needs-card-link:hover .all-needs-name {
            transform: none;
          }

          .all-needs-arrow {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .all-needs-section *,
          .all-needs-section *::before,
          .all-needs-section *::after {
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
  index,
}: {
  category: Category;
  index: number;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={category.href}
      aria-label={`Browse ${category.name}`}
      className="all-needs-card-link"
    >
      <article className="all-needs-card">
        <div className="all-needs-image-shell">
          <div
            aria-hidden="true"
            className="all-needs-image-background"
          />

          {!imageError ? (
            <div className="all-needs-image-wrapper">
              <img
                src={category.image}
                alt={category.name}
                width={500}
                height={500}
                loading={index < 8 ? "eager" : "lazy"}
                fetchPriority={index < 4 ? "high" : "auto"}
                draggable={false}
                onError={() => setImageError(true)}
                className="all-needs-image"
                style={{
                  objectPosition:
                    category.imagePosition ?? "center",
                }}
              />
            </div>
          ) : (
            <div className="all-needs-fallback">
              <ImageOff size={20} strokeWidth={1.7} />
              <span>{category.name}</span>
            </div>
          )}

          <span
            aria-hidden="true"
            className="all-needs-shine"
          />

          <span
            aria-hidden="true"
            className="all-needs-arrow"
          >
            <ArrowRight size={16} strokeWidth={1.9} />
          </span>
        </div>

        <h3 className="all-needs-name">
          {category.name}
        </h3>
      </article>
    </Link>
  );
}