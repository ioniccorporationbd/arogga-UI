"use client";

import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FlaskConical,
  HeartPulse,
  ImageOff,
  Microscope,
  PackageCheck,
  QrCode,
  ShieldCheck,
  Star,
  TestTube2,
} from "lucide-react";
import Link from "next/link";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type JsonProduct = {
  id: number;
  brand: string;
  title: string;
  category: string;
  image: string;
  price: number;
  currency: string;
  rating: number | null;
  productUrl: string;
};

type HealthPackage = JsonProduct & {
  uniqueId: string;
  href: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  reportHours: number;
  bookingCount: number;
  includedTests: number;
  currencySymbol: string;
};

type ImageCardItem = {
  id: number;
  title: string;
  href: string;
  image: string;
};

type OrganItem = {
  id: number;
  title: string;
  href: string;
  image: string;
  background: string;
};

type ProcessItem = {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
};

const MAX_PACKAGES = 24;

const discounts = [
  0, 19, 21, 14, 18, 12, 25, 10, 16, 20, 8, 15,
  22, 11, 17, 24, 9, 13, 27, 6,
];

const healthConcerns: ImageCardItem[] = [
  {
    id: 1,
    title: "Heart Health",
    href: "/lab/packages?concern=heart-health",
    image:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Covid",
    href: "/lab/packages?concern=covid",
    image:
      "https://images.unsplash.com/photo-1584118624012-df056829fbd0?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "Women",
    href: "/lab/packages?concern=women",
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    title: "Lifestyle",
    href: "/lab/packages?concern=lifestyle",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    title: "Diabetes",
    href: "/lab/packages?concern=diabetes",
    image:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    title: "Liver Health",
    href: "/lab/packages?concern=liver",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=85",
  },
];

const lifestylePackages: ImageCardItem[] = [
  {
    id: 1,
    title: "Skin & Hair",
    href: "/lab/packages?type=skin-hair",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Sedentary",
    href: "/lab/packages?type=sedentary",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "Fitness",
    href: "/lab/packages?type=fitness",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    title: "Alcohol & Smoking",
    href: "/lab/packages?type=alcohol-smoking",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    title: "Stress Management",
    href: "/lab/packages?type=stress",
    image:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=85",
  },
];

const vitalOrgans: OrganItem[] = [
  {
    id: 1,
    title: "Lungs",
    href: "/lab/packages?organ=lungs",
    image:
      "https://cdn-icons-png.flaticon.com/512/2864/2864323.png",
    background: "#fff1ce",
  },
  {
    id: 2,
    title: "Heart",
    href: "/lab/packages?organ=heart",
    image:
      "https://cdn-icons-png.flaticon.com/512/833/833472.png",
    background: "#d9e7ff",
  },
  {
    id: 3,
    title: "Bone",
    href: "/lab/packages?organ=bone",
    image:
      "https://cdn-icons-png.flaticon.com/512/2913/2913465.png",
    background: "#dfe9ff",
  },
  {
    id: 4,
    title: "Joint Pain",
    href: "/lab/packages?organ=joint",
    image:
      "https://cdn-icons-png.flaticon.com/512/2966/2966334.png",
    background: "#edf2ff",
  },
  {
    id: 5,
    title: "Neuro",
    href: "/lab/packages?organ=neuro",
    image:
      "https://cdn-icons-png.flaticon.com/512/3588/3588235.png",
    background: "#ffd2d2",
  },
  {
    id: 6,
    title: "Liver",
    href: "/lab/packages?organ=liver",
    image:
      "https://cdn-icons-png.flaticon.com/512/2864/2864442.png",
    background: "#fff0c5",
  },
  {
    id: 7,
    title: "Kidney",
    href: "/lab/packages?organ=kidney",
    image:
      "https://cdn-icons-png.flaticon.com/512/2864/2864275.png",
    background: "#edf2ff",
  },
];

const menCheckups: ImageCardItem[] = [
  {
    id: 1,
    title: "Under 20 Years",
    href: "/lab/packages?gender=men&age=under-20",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "20 to 40 Years",
    href: "/lab/packages?gender=men&age=20-40",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "40 to 50 Years",
    href: "/lab/packages?gender=men&age=40-50",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    title: "50 Years to Above",
    href: "/lab/packages?gender=men&age=50-plus",
    image:
      "https://images.unsplash.com/photo-1508963493744-76fce69379c0?auto=format&fit=crop&w=900&q=85",
  },
];

const womenCheckups: ImageCardItem[] = [
  {
    id: 1,
    title: "Below 20 Years",
    href: "/lab/packages?gender=women&age=under-20",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "20 - 40 Years",
    href: "/lab/packages?gender=women&age=20-40",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "40 - 50 Years",
    href: "/lab/packages?gender=women&age=40-50",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    title: "50 Years & Above",
    href: "/lab/packages?gender=women&age=50-plus",
    image:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=900&q=85",
  },
];

const processItems: ProcessItem[] = [
  {
    id: 1,
    title: "Sample Collect",
    description:
      "Our trained professionals visit your location and collect samples safely.",
    icon: <TestTube2 size={30} strokeWidth={1.7} />,
  },
  {
    id: 2,
    title: "Sample Storage",
    description:
      "Samples are stored securely while maintaining proper temperature and integrity.",
    icon: <PackageCheck size={30} strokeWidth={1.7} />,
  },
  {
    id: 3,
    title: "High Tech Lab Facility",
    description:
      "Modern laboratory equipment helps provide accurate and reliable analysis.",
    icon: <Microscope size={30} strokeWidth={1.7} />,
  },
  {
    id: 4,
    title: "Accurate Digital Reports",
    description:
      "Reports are delivered digitally so you can access them anytime.",
    icon: <ShieldCheck size={30} strokeWidth={1.7} />,
  },
];

const playStoreQr =
  "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fplay.google.com";
const appStoreQr =
  "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fapps.apple.com";

export default function HealthPackageExplorer() {
  const packageScrollRef = useRef<HTMLDivElement | null>(null);

  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [bookedPackages, setBookedPackages] = useState<string[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPackages() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch("/tara.json", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load /tara.json. Status: ${response.status}`,
          );
        }

        const result = (await response.json()) as unknown;

        if (!Array.isArray(result)) {
          throw new Error(
            "public/tara.json must contain a JSON array.",
          );
        }

        const normalizedPackages = result
          .filter(isValidProduct)
          .slice(0, MAX_PACKAGES)
          .map(normalizePackage);

        setPackages(normalizedPackages);
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
            : "Unable to load health packages.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadPackages();

    return () => controller.abort();
  }, []);

  const updateScrollState = useCallback(() => {
    const container = packageScrollRef.current;

    if (!container) return;

    const maxScroll =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(
      maxScroll > 4 &&
        container.scrollLeft < maxScroll - 4,
    );
  }, []);

  useEffect(() => {
    const container = packageScrollRef.current;

    if (!container) return;

    updateScrollState();

    container.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrollState)
        : null;

    resizeObserver?.observe(container);

    if (!resizeObserver) {
      window.addEventListener("resize", updateScrollState);
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
  }, [packages.length, updateScrollState]);

  const scrollPackages = (
    direction: "left" | "right",
  ) => {
    const container = packageScrollRef.current;

    if (!container) return;

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-health-package-card]",
      );

    if (!firstCard) return;

    const computedStyle =
      window.getComputedStyle(container);

    const gap =
      Number.parseFloat(
        computedStyle.columnGap ||
          computedStyle.gap ||
          "16",
      ) || 16;

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const visibleCount =
      window.innerWidth >= 1280
        ? 4
        : window.innerWidth >= 1024
          ? 3
          : window.innerWidth >= 768
            ? 2
            : 1;

    container.scrollBy({
      left:
        direction === "right"
          ? (cardWidth + gap) * visibleCount
          : -(cardWidth + gap) * visibleCount,
      behavior: "smooth",
    });
  };

  const toggleBooking = (uniqueId: string) => {
    setBookedPackages((current) =>
      current.includes(uniqueId)
        ? current.filter((id) => id !== uniqueId)
        : [...current, uniqueId],
    );
  };

  return (
    <>
      <section className="health-explorer-section">
        <div
          aria-hidden="true"
          className="health-explorer-pattern"
        />

        <div className="health-explorer-container">
          <section
            aria-labelledby="affordable-packages-title"
            className="health-content-block"
          >
            <SectionHeading
              id="affordable-packages-title"
              title="Affordable Health Packages"
              description="Explore useful health packages with home sample collection and digital reports."
              href="/lab/packages"
            />

            {loadError && (
              <div className="health-data-warning">
                {loadError}
              </div>
            )}

            <div className="health-package-slider">
              <SliderArrow
                direction="left"
                visible={canScrollLeft}
                onClick={() => scrollPackages("left")}
              />

              <div
                ref={packageScrollRef}
                className="health-package-scroll"
              >
                {loading &&
                  Array.from({ length: 4 }).map(
                    (_, index) => (
                      <PackageSkeleton key={index} />
                    ),
                  )}

                {!loading &&
                  packages.map((healthPackage) => (
                    <HealthPackageCard
                      key={healthPackage.uniqueId}
                      healthPackage={healthPackage}
                      booked={bookedPackages.includes(
                        healthPackage.uniqueId,
                      )}
                      onToggleBooking={() =>
                        toggleBooking(
                          healthPackage.uniqueId,
                        )
                      }
                    />
                  ))}

                {!loading && packages.length === 0 && (
                  <EmptyPackages />
                )}
              </div>

              <SliderArrow
                direction="right"
                visible={canScrollRight}
                onClick={() => scrollPackages("right")}
              />
            </div>
          </section>

          <ImageCardSection
            title="Browse by Health Concern"
            items={healthConcerns}
            columns={5}
          />

          <ImageCardSection
            title="Life Style Packages"
            items={lifestylePackages}
            columns={4}
          />

          <OrganSection />

          <ImageCardSection
            title="Recommended Checkups for Men"
            items={menCheckups}
            columns={4}
            variant="men"
          />

          <ImageCardSection
            title="Recommended Checkups for Women"
            items={womenCheckups}
            columns={4}
            variant="women"
          />

          <HowWeWorkSection />

          <AppDownloadSection />
        </div>
      </section>

      <style jsx global>{`
        .health-explorer-section {
          --health-text-20: 20px;
          --health-text-18: 18px;
          --health-text-16: 16px;
          --health-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 54px 0 64px;
          background:
            radial-gradient(
              circle at 5% 8%,
              rgba(216, 242, 238, 0.62),
              transparent 28%
            ),
            radial-gradient(
              circle at 96% 92%,
              rgba(226, 236, 252, 0.7),
              transparent 29%
            ),
            #ffffff;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .health-explorer-pattern {
          position: absolute;
          inset: 0;
          z-index: -2;
          pointer-events: none;
          opacity: 0.18;
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
          background-size: 46px 46px;
        }

        .health-explorer-container {
          width: min(1440px, calc(100% - 48px));
          margin-inline: auto;
        }

        .health-content-block + .health-content-block {
          margin-top: 42px;
        }

        .health-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .health-section-heading-content {
          min-width: 0;
        }

        .health-section-title {
          margin: 0;
          color: #101828;
          font-size: var(--health-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .health-section-description {
          max-width: 680px;
          margin: 6px 0 0;
          color: #667085;
          font-size: var(--health-text-13);
          line-height: 1.7;
        }

        .health-section-link {
          display: inline-flex;
          min-height: 40px;
          flex-shrink: 0;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border: 1px solid #087b75;
          border-radius: 999px;
          color: #087b75;
          background: #ffffff;
          font-size: var(--health-text-13);
          font-weight: 800;
          text-decoration: none;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease;
        }

        .health-section-link:hover {
          color: #ffffff;
          background: #087b75;
          transform: translateY(-2px);
        }

        .health-package-slider,
        .horizontal-cards-wrapper {
          position: relative;
        }

        .health-package-scroll,
        .horizontal-cards-scroll,
        .organ-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 7px 2px 17px;
          scroll-padding-inline: 8px;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }

        .health-package-scroll::-webkit-scrollbar,
        .horizontal-cards-scroll::-webkit-scrollbar,
        .organ-scroll::-webkit-scrollbar {
          display: none;
        }

        .health-package-wrapper {
          width: min(88vw, 348px);
          flex: 0 0 min(88vw, 348px);
          scroll-snap-align: start;
        }

        .health-package-card {
          display: flex;
          height: 100%;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e3e8eb;
          border-radius: 14px;
          background: #ffffff;
          box-shadow:
            0 17px 38px -32px
              rgba(15, 23, 42, 0.48);
          transition:
            transform 350ms ease,
            border-color 300ms ease,
            box-shadow 350ms ease;
        }

        .health-package-card:hover {
          border-color: rgba(8, 123, 117, 0.3);
          box-shadow:
            0 30px 58px -40px
              rgba(8, 123, 117, 0.42);
          transform: translateY(-5px);
        }

        .health-package-top {
          display: grid;
          grid-template-columns:
            112px minmax(0, 1fr);
          gap: 12px;
          padding: 12px;
        }

        .health-package-image-link {
          position: relative;
          display: block;
          overflow: hidden;
          min-height: 112px;
          border-radius: 9px;
          background: #eff8f7;
        }

        .health-package-image {
          width: 100%;
          height: 112px;
          padding: 7px;
          object-fit: contain;
          transition: transform 500ms ease;
        }

        .health-package-card:hover
          .health-package-image {
          transform: scale(1.06);
        }

        .health-package-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #98a2b3;
          font-size: var(--health-text-13);
        }

        .health-package-info {
          min-width: 0;
        }

        .health-package-name {
          display: -webkit-box;
          overflow: hidden;
          color: #101828;
          font-size: var(--health-text-16);
          font-weight: 800;
          line-height: 1.45;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .health-package-included {
          margin: 5px 0 0;
          color: #087b75;
          font-size: var(--health-text-13);
          font-weight: 700;
        }

        .health-package-icons {
          display: flex;
          gap: 5px;
          margin-top: 8px;
        }

        .health-package-small-icon {
          display: flex;
          width: 29px;
          height: 29px;
          align-items: center;
          justify-content: center;
          border: 1px solid #e3e8eb;
          border-radius: 6px;
          color: #087b75;
          background: #ffffff;
        }

        .health-package-more {
          display: flex;
          min-width: 29px;
          height: 29px;
          align-items: center;
          justify-content: center;
          border: 1px solid #e3e8eb;
          border-radius: 6px;
          color: #667085;
          font-size: var(--health-text-13);
          font-weight: 800;
        }

        .health-package-price-line {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
        }

        .health-package-price {
          margin: 0;
          color: #101828;
          font-size: var(--health-text-18);
          font-weight: 850;
        }

        .health-package-old-price {
          color: #667085;
          font-size: var(--health-text-13);
          text-decoration: line-through;
        }

        .health-package-discount {
          padding: 4px 7px;
          border-radius: 5px;
          color: #ffffff;
          background: #e43246;
          font-size: var(--health-text-13);
          font-weight: 850;
        }

        .health-package-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding: 11px 12px;
          border-top: 1px solid #e7ecef;
        }

        .health-package-meta {
          display: grid;
          gap: 6px;
        }

        .health-package-meta-row {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #344054;
          font-size: var(--health-text-13);
        }

        .health-package-meta-row.is-booked svg {
          color: #e77600;
          fill: #e77600;
        }

        .health-package-button {
          display: inline-flex;
          min-width: 96px;
          min-height: 42px;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1px solid #087b75;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: var(--health-text-13);
          font-weight: 850;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease;
        }

        .health-package-button:hover {
          transform: translateY(-2px);
        }

        .health-package-button.is-booked {
          color: #087b75;
          background: #eff9f7;
        }

        .health-slider-arrow {
          position: absolute;
          top: 50%;
          z-index: 20;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid #087b75;
          border-radius: 50%;
          color: #087b75;
          background: #ffffff;
          box-shadow:
            0 12px 26px -15px
              rgba(15, 23, 42, 0.46);
          cursor: pointer;
          transform: translateY(-50%);
          transition:
            opacity 250ms ease,
            color 250ms ease,
            background-color 250ms ease;
        }

        .health-slider-arrow-left {
          left: 0;
          transform: translate(-50%, -50%);
        }

        .health-slider-arrow-right {
          right: 0;
          transform: translate(50%, -50%);
        }

        .health-slider-arrow:hover {
          color: #ffffff;
          background: #087b75;
        }

        .health-slider-arrow.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .image-category-wrapper {
          width: min(76vw, 280px);
          flex: 0 0 min(76vw, 280px);
          scroll-snap-align: start;
        }

        .image-category-card {
          display: block;
          overflow: hidden;
          border: 1px solid #e3e8eb;
          border-radius: 13px;
          color: #101828;
          background: #ffffff;
          text-decoration: none;
          transition:
            transform 350ms ease,
            border-color 300ms ease,
            box-shadow 350ms ease;
        }

        .image-category-card:hover {
          border-color: rgba(8, 123, 117, 0.3);
          box-shadow:
            0 27px 52px -39px
              rgba(8, 123, 117, 0.4);
          transform: translateY(-5px);
        }

        .image-category-media {
          position: relative;
          overflow: hidden;
          aspect-ratio: 1.85 / 1;
          background: #f3f6f7;
        }

        .image-category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 600ms ease;
        }

        .image-category-card:hover
          .image-category-image {
          transform: scale(1.05);
        }

        .image-category-card.is-men
          .image-category-media {
          background: #eee9ff;
        }

        .image-category-card.is-women
          .image-category-media {
          background: #ffe9ee;
        }

        .image-category-content {
          padding: 13px;
        }

        .image-category-title {
          margin: 0;
          color: #101828;
          font-size: var(--health-text-16);
          font-weight: 800;
          line-height: 1.4;
        }

        .image-category-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          color: #087b75;
          font-size: var(--health-text-13);
          font-weight: 750;
        }

        .organ-wrapper {
          width: 154px;
          flex: 0 0 154px;
          scroll-snap-align: start;
        }

        .organ-card {
          display: flex;
          min-height: 150px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 1px solid
            rgba(15, 23, 42, 0.04);
          border-radius: 12px;
          color: #101828;
          text-decoration: none;
          transition:
            transform 320ms ease,
            box-shadow 320ms ease;
        }

        .organ-card:hover {
          box-shadow:
            0 24px 46px -35px
              rgba(15, 23, 42, 0.42);
          transform: translateY(-5px);
        }

        .organ-image-shell {
          display: flex;
          width: 70px;
          height: 70px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
        }

        .organ-image {
          max-width: 50px;
          max-height: 50px;
          object-fit: contain;
        }

        .organ-title {
          margin: 0;
          font-size: var(--health-text-13);
          font-weight: 800;
        }

        .how-work-block {
          margin-top: 46px;
        }

        .how-work-title {
          margin: 0 0 25px;
          color: #101828;
          font-size: var(--health-text-20);
          font-weight: 850;
          text-align: center;
        }

        .how-work-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 22px;
        }

        .how-work-item {
          position: relative;
          text-align: center;
        }

        .how-work-icon-shell {
          position: relative;
          display: flex;
          width: 104px;
          height: 104px;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border-radius: 50%;
          color: #087b75;
          background: #e9faf7;
        }

        .how-work-item:nth-child(2)
          .how-work-icon-shell {
          color: #f28b49;
          background: #fff0ea;
        }

        .how-work-item:nth-child(3)
          .how-work-icon-shell {
          color: #e95462;
          background: #ffebee;
        }

        .how-work-item:nth-child(4)
          .how-work-icon-shell {
          color: #087b75;
          background: #e8f8f7;
        }

        .how-work-number {
          position: absolute;
          top: 0;
          right: 0;
          display: flex;
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffffff;
          background: #087b75;
          font-size: var(--health-text-13);
          font-weight: 850;
        }

        .how-work-item-title {
          margin: 14px 0 0;
          color: #101828;
          font-size: var(--health-text-16);
          font-weight: 800;
        }

        .how-work-description {
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--health-text-13);
          line-height: 1.65;
        }

        .app-download-section {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) minmax(360px, 0.9fr);
          gap: 36px;
          align-items: center;
          margin-top: 50px;
          overflow: hidden;
          padding: 32px;
          border: 1px solid #e1e7ea;
          border-radius: 20px;
          background:
            linear-gradient(
              135deg,
              #f4fbfa,
              #ffffff 55%,
              #eef5ff
            );
        }

        .app-download-title {
          margin: 0;
          color: #101828;
          font-size: var(--health-text-20);
          font-weight: 850;
          line-height: 1.4;
        }

        .app-download-description {
          max-width: 560px;
          margin: 9px 0 0;
          color: #667085;
          font-size: var(--health-text-13);
          line-height: 1.7;
        }

        .qr-code-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 22px;
        }

        .qr-card {
          overflow: hidden;
          padding: 10px;
          border: 1px solid #e1e7ea;
          border-radius: 12px;
          background: #ffffff;
          text-align: center;
        }

        .qr-image {
          width: 126px;
          height: 126px;
          object-fit: contain;
        }

        .qr-label {
          margin: 7px 0 0;
          color: #344054;
          font-size: var(--health-text-13);
          font-weight: 800;
        }

        .app-phone-preview {
          display: flex;
          min-height: 360px;
          align-items: flex-end;
          justify-content: center;
        }

        .app-phone-image {
          display: block;
          width: min(100%, 420px);
          max-height: 390px;
          object-fit: contain;
          object-position: bottom;
        }

        .health-data-warning {
          margin-bottom: 16px;
          padding: 11px 13px;
          border: 1px solid #f0d69e;
          border-radius: 9px;
          color: #875a0a;
          background: #fffaf0;
          font-size: var(--health-text-13);
          line-height: 1.6;
        }

        .health-empty {
          display: flex;
          min-height: 260px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #e1e7ea;
          border-radius: 14px;
          background: #ffffff;
          text-align: center;
        }

        .health-empty-title {
          margin: 10px 0 0;
          color: #344054;
          font-size: var(--health-text-16);
          font-weight: 800;
        }

        .health-empty-description {
          margin: 6px 0 0;
          color: #667085;
          font-size: var(--health-text-13);
        }

        @media (min-width: 1280px) {
          .health-package-wrapper {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }

          .image-card-columns-5
            .image-category-wrapper {
            width: calc((100% - 64px) / 5);
            flex-basis: calc((100% - 64px) / 5);
          }

          .image-card-columns-4
            .image-category-wrapper {
            width: calc((100% - 48px) / 4);
            flex-basis: calc((100% - 48px) / 4);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .health-explorer-container {
            width: min(1180px, calc(100% - 40px));
          }

          .health-package-wrapper {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }

          .image-category-wrapper {
            width: calc((100% - 32px) / 3);
            flex-basis: calc((100% - 32px) / 3);
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .health-explorer-container {
            width: calc(100% - 32px);
          }

          .health-package-wrapper {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .image-category-wrapper {
            width: calc((100% - 16px) / 2);
            flex-basis: calc((100% - 16px) / 2);
          }

          .how-work-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .app-download-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767px) {
          .health-explorer-section {
            padding: 38px 0 46px;
          }

          .health-explorer-container {
            width: 100%;
          }

          .health-content-block {
            padding-inline: 14px;
          }

          .health-content-block + .health-content-block {
            margin-top: 34px;
          }

          .health-section-heading {
            align-items: flex-start;
          }

          .health-section-description {
            max-width: 330px;
          }

          .health-package-scroll,
          .horizontal-cards-scroll,
          .organ-scroll {
            margin-right: -14px;
            margin-left: -14px;
            padding-right: 14px;
            padding-left: 14px;
            scroll-padding-inline: 14px;
          }

          .health-slider-arrow {
            display: none;
          }

          .health-package-wrapper {
            width: min(88vw, 350px);
            flex-basis: min(88vw, 350px);
          }

          .image-category-wrapper {
            width: min(76vw, 280px);
            flex-basis: min(76vw, 280px);
          }

          .how-work-block,
          .app-download-section {
            margin-right: 14px;
            margin-left: 14px;
          }

          .how-work-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 26px 14px;
          }

          .app-download-section {
            grid-template-columns: 1fr;
            padding: 22px;
          }

          .app-phone-preview {
            min-height: 260px;
          }
        }

        @media (max-width: 480px) {
          .health-content-block {
            padding-inline: 11px;
          }

          .health-section-link span {
            display: none;
          }

          .health-section-link {
            width: 40px;
            min-width: 40px;
            padding: 0;
          }

          .health-package-scroll,
          .horizontal-cards-scroll,
          .organ-scroll {
            margin-right: -11px;
            margin-left: -11px;
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .health-package-top {
            grid-template-columns:
              96px minmax(0, 1fr);
          }

          .health-package-image-link,
          .health-package-image {
            min-height: 100px;
            height: 100px;
          }

          .health-package-bottom {
            align-items: stretch;
            flex-direction: column;
          }

          .health-package-button {
            width: 100%;
          }

          .how-work-grid {
            grid-template-columns: 1fr;
          }

          .how-work-block,
          .app-download-section {
            margin-right: 11px;
            margin-left: 11px;
          }

          .qr-code-grid {
            justify-content: center;
          }

          .app-phone-preview {
            min-height: 220px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .health-explorer-section *,
          .health-explorer-section *::before,
          .health-explorer-section *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}

function SectionHeading({
  id,
  title,
  description,
  href,
}: {
  id: string;
  title: string;
  description?: string;
  href?: string;
}) {
  return (
    <header className="health-section-heading">
      <div className="health-section-heading-content">
        <h2
          id={id}
          className="health-section-title"
        >
          {title}
        </h2>

        {description && (
          <p className="health-section-description">
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="health-section-link"
        >
          <span>See All</span>
          <ArrowRight size={18} />
        </Link>
      )}
    </header>
  );
}

function HealthPackageCard({
  healthPackage,
  booked,
  onToggleBooking,
}: {
  healthPackage: HealthPackage;
  booked: boolean;
  onToggleBooking: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      data-health-package-card
      className="health-package-wrapper health-package-card"
    >
      <div className="health-package-top">
        <Link
          href={healthPackage.href}
          className="health-package-image-link"
        >
          {!imageError ? (
            <img
              src={healthPackage.image}
              alt={healthPackage.title}
              width={320}
              height={320}
              loading="lazy"
              onError={() => setImageError(true)}
              className="health-package-image"
            />
          ) : (
            <div className="health-package-fallback">
              <ImageOff size={20} />
              <span>Image unavailable</span>
            </div>
          )}
        </Link>

        <div className="health-package-info">
          <Link
            href={healthPackage.href}
            className="health-package-name"
          >
            {healthPackage.title}
          </Link>

          <p className="health-package-included">
            Includes {healthPackage.includedTests} tests
          </p>

          <div className="health-package-icons">
            <span className="health-package-small-icon">
              <FlaskConical size={14} />
            </span>

            <span className="health-package-small-icon">
              <HeartPulse size={14} />
            </span>

            <span className="health-package-small-icon">
              <TestTube2 size={14} />
            </span>

            <span className="health-package-more">
              +{(healthPackage.id % 6) + 2}
            </span>
          </div>

          <div className="health-package-price-line">
            <p className="health-package-price">
              {healthPackage.currencySymbol}
              {formatPrice(healthPackage.salePrice)}
            </p>

            {healthPackage.discount > 0 && (
              <>
                <span className="health-package-old-price">
                  {healthPackage.currencySymbol}
                  {formatPrice(
                    healthPackage.originalPrice,
                  )}
                </span>

                <span className="health-package-discount">
                  {healthPackage.discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="health-package-bottom">
        <div className="health-package-meta">
          <div className="health-package-meta-row">
            <Clock3 size={17} />
            Report in {healthPackage.reportHours} hours
          </div>

          <div className="health-package-meta-row is-booked">
            <Star size={17} />
            Booked {healthPackage.bookingCount} times
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleBooking}
          className={[
            "health-package-button",
            booked ? "is-booked" : "",
          ].join(" ")}
        >
          {booked ? (
            <>
              <Check size={15} />
              Booked
            </>
          ) : (
            "Book Test"
          )}
        </button>
      </div>
    </article>
  );
}

function ImageCardSection({
  title,
  items,
  columns,
  variant,
}: {
  title: string;
  items: ImageCardItem[];
  columns: 4 | 5;
  variant?: "men" | "women";
}) {
  const id = createSlug(title);

  return (
    <section
      aria-labelledby={id}
      className="health-content-block"
    >
      <SectionHeading id={id} title={title} />

      <div className="horizontal-cards-wrapper">
        <div
          className={[
            "horizontal-cards-scroll",
            `image-card-columns-${columns}`,
          ].join(" ")}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="image-category-wrapper"
            >
              <Link
                href={item.href}
                className={[
                  "image-category-card",
                  variant === "men" ? "is-men" : "",
                  variant === "women"
                    ? "is-women"
                    : "",
                ].join(" ")}
              >
                <div className="image-category-media">
                  <img
                    src={item.image}
                    alt={item.title}
                    width={700}
                    height={400}
                    loading="lazy"
                    className="image-category-image"
                  />
                </div>

                <div className="image-category-content">
                  <h3 className="image-category-title">
                    {item.title}
                  </h3>

                  <span className="image-category-link">
                    See Package
                    <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrganSection() {
  return (
    <section
      aria-labelledby="vital-organ-title"
      className="health-content-block"
    >
      <SectionHeading
        id="vital-organ-title"
        title="Checkups Base on Vital Organs"
      />

      <div className="organ-scroll">
        {vitalOrgans.map((organ) => (
          <div
            key={organ.id}
            className="organ-wrapper"
          >
            <Link
              href={organ.href}
              className="organ-card"
              style={{
                background: organ.background,
              }}
            >
              <span className="organ-image-shell">
                <img
                  src={organ.image}
                  alt={organ.title}
                  width={70}
                  height={70}
                  loading="lazy"
                  className="organ-image"
                />
              </span>

              <p className="organ-title">
                {organ.title}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowWeWorkSection() {
  return (
    <section
      aria-labelledby="how-we-work-title"
      className="how-work-block"
    >
      <h2
        id="how-we-work-title"
        className="how-work-title"
      >
        How We Work
      </h2>

      <div className="how-work-grid">
        {processItems.map((item, index) => (
          <article
            key={item.id}
            className="how-work-item"
          >
            <div className="how-work-icon-shell">
              {item.icon}

              <span className="how-work-number">
                {index + 1}
              </span>
            </div>

            <h3 className="how-work-item-title">
              {item.title}
            </h3>

            <p className="how-work-description">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AppDownloadSection() {
  return (
    <section
      aria-labelledby="download-app-title"
      className="app-download-section"
    >
      <div>
        <h2
          id="download-app-title"
          className="app-download-title"
        >
          Scan the QR Code to Download our App
        </h2>

        <p className="app-download-description">
          Manage your wellness, orders, laboratory
          bookings and reports from one convenient mobile
          application.
        </p>

        <div className="qr-code-grid">
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noreferrer"
            className="qr-card"
          >
            <img
              src={playStoreQr}
              alt="Google Play download QR code"
              width={150}
              height={150}
              className="qr-image"
            />

            <p className="qr-label">
              Google Play
            </p>
          </a>

          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noreferrer"
            className="qr-card"
          >
            <img
              src={appStoreQr}
              alt="Apple App Store download QR code"
              width={150}
              height={150}
              className="qr-image"
            />

            <p className="qr-label">
              App Store
            </p>
          </a>
        </div>
      </div>

      <div className="app-phone-preview">
        <img
          src="https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=85"
          alt="Healthcare mobile application preview"
          width={600}
          height={500}
          loading="lazy"
          className="app-phone-image"
        />
      </div>
    </section>
  );
}

function SliderArrow({
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
    <button
      type="button"
      onClick={onClick}
      disabled={!visible}
      className={[
        "health-slider-arrow",
        direction === "left"
          ? "health-slider-arrow-left"
          : "health-slider-arrow-right",
        visible ? "" : "is-hidden",
      ].join(" ")}
      aria-label={
        direction === "left"
          ? "Show previous packages"
          : "Show more packages"
      }
    >
      <Icon size={20} />
    </button>
  );
}

function normalizePackage(
  product: JsonProduct,
  index: number,
): HealthPackage {
  const salePrice = Number(product.price);
  const discount =
    discounts[index % discounts.length];

  return {
    ...product,
    uniqueId: `health-package-${product.id}-${index}`,
    href: `/lab/packages/${createSlug(
      product.title,
    )}`,
    salePrice,
    originalPrice:
      discount > 0
        ? salePrice / (1 - discount / 100)
        : salePrice,
    discount,
    reportHours: [12, 24, 48, 120][index % 4],
    bookingCount:
      ((product.id * 37) % 1500) + 30,
    includedTests:
      ((product.id + index) % 15) + 3,
    currencySymbol: getCurrencySymbol(
      product.currency,
    ),
  };
}

function isValidProduct(
  value: unknown,
): value is JsonProduct {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const product =
    value as Partial<JsonProduct>;

  return (
    typeof product.id === "number" &&
    typeof product.brand === "string" &&
    typeof product.title === "string" &&
    typeof product.category === "string" &&
    typeof product.image === "string" &&
    typeof product.price === "number" &&
    typeof product.currency === "string" &&
    (typeof product.rating === "number" ||
      product.rating === null) &&
    typeof product.productUrl === "string"
  );
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCurrencySymbol(currency: string) {
  switch (currency.toUpperCase()) {
    case "BDT":
      return "৳";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "INR":
      return "₹";
    default:
      return `${currency} `;
  }
}

function formatPrice(value: number) {
  if (!Number.isFinite(value)) return "0";

  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2);
}

function PackageSkeleton() {
  return (
    <div className="health-package-wrapper health-package-card">
      <div className="health-package-top">
        <div className="h-[112px] animate-pulse rounded-[9px] bg-[#e7eeee]" />

        <div className="space-y-3">
          <div className="h-5 animate-pulse rounded bg-[#e7eeee]" />
          <div className="h-4 w-28 animate-pulse rounded bg-[#e7eeee]" />
          <div className="h-8 w-40 animate-pulse rounded bg-[#e7eeee]" />
          <div className="h-5 w-32 animate-pulse rounded bg-[#e7eeee]" />
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-[#e7ecef] p-3">
        <div className="space-y-2">
          <div className="h-4 w-36 animate-pulse rounded bg-[#e7eeee]" />
          <div className="h-4 w-32 animate-pulse rounded bg-[#e7eeee]" />
        </div>

        <div className="h-10 w-24 animate-pulse rounded bg-[#e7eeee]" />
      </div>
    </div>
  );
}

function EmptyPackages() {
  return (
    <div className="health-empty">
      <div>
        <QrCode
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="health-empty-title">
          No health packages available
        </p>

        <p className="health-empty-description">
          Packages will appear when data is available.
        </p>
      </div>
    </div>
  );
}