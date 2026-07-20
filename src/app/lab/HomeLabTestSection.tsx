"use client";

import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FlaskConical,
  ImageOff,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";
import {
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

type LabTest = JsonProduct & {
  uniqueId: string;
  href: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  reportHours: number;
  bookingCount: number;
  includedTests: number;
  currencySymbol: string;
  providerLogos: string[];
};

type ContactItem = {
  id: number;
  title: string;
  value: string;
  href: string;
  type: "whatsapp" | "phone";
};

const CONTACT_ITEMS: ContactItem[] = [
  {
    id: 1,
    title: "WhatsApp",
    value: "+8801810117100",
    href: "https://wa.me/8801810117100",
    type: "whatsapp",
  },
  {
    id: 2,
    title: "Call",
    value: "16778",
    href: "tel:16778",
    type: "phone",
  },
];

const DISCOUNTS = [
  0, 20, 20, 20, 12, 18, 15, 10, 25, 8,
  14, 30, 16, 22, 9, 17, 5, 24, 11, 19,
];

const PROVIDER_LOGOS = [
  "https://logo.clearbit.com/labaidgroup.com?size=96",
  "https://logo.clearbit.com/populardiagnostic.com?size=96",
  "https://logo.clearbit.com/ibnsinatrust.com?size=96",
  "https://logo.clearbit.com/squarehospital.com?size=96",
  "https://logo.clearbit.com/evercarebd.com?size=96",
  "https://logo.clearbit.com/medinova.com.bd?size=96",
];

const MAX_TESTS = 24;

export default function HomeLabTestSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [bookedTests, setBookedTests] = useState<string[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTests() {
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

        const normalizedTests = result
          .filter(isValidProduct)
          .slice(0, MAX_TESTS)
          .map(normalizeLabTest);

        setTests(normalizedTests);
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
            : "Unable to load lab-test data.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTests();

    return () => {
      controller.abort();
    };
  }, []);

  const displayedTests = useMemo(() => tests, [tests]);

  const updateScrollButtons = useCallback(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const maximumScroll =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 4);

    setCanScrollRight(
      maximumScroll > 4 &&
        container.scrollLeft < maximumScroll - 4,
    );
  }, []);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    updateScrollButtons();

    container.addEventListener(
      "scroll",
      updateScrollButtons,
      {
        passive: true,
      },
    );

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrollButtons)
        : null;

    resizeObserver?.observe(container);

    if (!resizeObserver) {
      window.addEventListener(
        "resize",
        updateScrollButtons,
      );
    }

    return () => {
      container.removeEventListener(
        "scroll",
        updateScrollButtons,
      );

      resizeObserver?.disconnect();

      window.removeEventListener(
        "resize",
        updateScrollButtons,
      );
    };
  }, [displayedTests.length, updateScrollButtons]);

  const scrollTests = (
    direction: "left" | "right",
  ) => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-lab-test-card]",
      );

    if (!firstCard) {
      return;
    }

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

    const visibleCards =
      window.innerWidth >= 1280
        ? 4
        : window.innerWidth >= 1024
          ? 3
          : window.innerWidth >= 768
            ? 2
            : 1;

    const distance =
      (cardWidth + gap) * visibleCards;

    container.scrollBy({
      left:
        direction === "right"
          ? distance
          : -distance,
      behavior: "smooth",
    });
  };

  const toggleBooking = (uniqueId: string) => {
    setBookedTests((currentTests) =>
      currentTests.includes(uniqueId)
        ? currentTests.filter(
            (id) => id !== uniqueId,
          )
        : [...currentTests, uniqueId],
    );
  };

  if (!loading && loadError) {
    return <LabTestError message={loadError} />;
  }

  return (
    <>
      <section
        aria-labelledby="home-lab-tests-title"
        className="home-lab-section"
      >
        <div
          aria-hidden="true"
          className="home-lab-pattern"
        />

        <div
          aria-hidden="true"
          className="home-lab-glow home-lab-glow-left"
        />

        <div
          aria-hidden="true"
          className="home-lab-glow home-lab-glow-right"
        />

        <div className="home-lab-container">
          <OrderViaSection />

          <section className="lab-tests-panel">
            <span
              aria-hidden="true"
              className="lab-tests-decoration"
            />

            <header className="lab-tests-header">
              <div className="lab-tests-heading">
                <p className="lab-tests-eyebrow">
                  Home sample collection
                </p>

                <h2
                  id="home-lab-tests-title"
                  className="lab-tests-title"
                >
                  Most Booked Tests from Home
                </h2>

                <p className="lab-tests-description">
                  Book laboratory tests with convenient
                  home sample collection and fast report
                  delivery.
                </p>
              </div>

              <Link
                href="/lab-tests"
                className="lab-tests-see-all"
              >
                <span>See All</span>

                <ChevronRight
                  size={18}
                  strokeWidth={1.8}
                />
              </Link>
            </header>

            <div className="lab-tests-slider">
              <SliderButton
                direction="left"
                visible={canScrollLeft}
                onClick={() => scrollTests("left")}
              />

              <div
                ref={scrollRef}
                className="lab-tests-scroll"
              >
                {loading &&
                  Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <LabTestSkeleton key={index} />
                  ))}

                {!loading &&
                  displayedTests.map((test) => (
                    <LabTestCard
                      key={test.uniqueId}
                      test={test}
                      booked={bookedTests.includes(
                        test.uniqueId,
                      )}
                      onToggleBooking={() =>
                        toggleBooking(test.uniqueId)
                      }
                    />
                  ))}

                {!loading &&
                  displayedTests.length === 0 && (
                    <EmptyLabTests />
                  )}
              </div>

              <SliderButton
                direction="right"
                visible={canScrollRight}
                onClick={() => scrollTests("right")}
              />
            </div>
          </section>
        </div>
      </section>

      <style jsx global>{`
        .home-lab-section {
          --lab-text-20: 20px;
          --lab-text-18: 18px;
          --lab-text-16: 16px;
          --lab-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 48px 0 60px;
          background:
            radial-gradient(
              circle at 5% 8%,
              rgba(209, 241, 237, 0.7),
              transparent 28%
            ),
            radial-gradient(
              circle at 95% 92%,
              rgba(221, 234, 253, 0.66),
              transparent 29%
            ),
            linear-gradient(
              145deg,
              #fbfefd 0%,
              #ffffff 50%,
              #f8fbff 100%
            );
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .home-lab-pattern {
          position: absolute;
          inset: 0;
          z-index: -3;
          pointer-events: none;
          opacity: 0.21;
          background-image:
            linear-gradient(
              rgba(8, 123, 117, 0.034) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(8, 123, 117, 0.034) 1px,
              transparent 1px
            );
          background-size: 46px 46px;
        }

        .home-lab-glow {
          position: absolute;
          z-index: -2;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(115px);
          opacity: 0.46;
        }

        .home-lab-glow-left {
          top: -150px;
          left: -240px;
          background: rgba(55, 180, 157, 0.36);
        }

        .home-lab-glow-right {
          right: -250px;
          bottom: -150px;
          background: rgba(65, 120, 214, 0.3);
        }

        .home-lab-container {
          position: relative;
          width: min(
            1440px,
            calc(100% - 48px)
          );
          margin-inline: auto;
        }

        .order-via-section {
          margin-bottom: 38px;
        }

        .order-via-heading {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .order-via-line {
          height: 1px;
          flex: 1;
          background: linear-gradient(
            90deg,
            transparent,
            #667085
          );
        }

        .order-via-line:last-child {
          background: linear-gradient(
            90deg,
            #667085,
            transparent
          );
        }

        .order-via-title {
          margin: 0;
          color: #667085;
          font-size: var(--lab-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.02em;
          text-align: center;
          text-transform: uppercase;
        }

        .order-via-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .order-via-card {
          display: flex;
          min-height: 104px;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border: 1px solid
            rgba(15, 23, 42, 0.1);
          border-radius: 16px;
          color: #101828;
          background: rgba(
            255,
            255,
            255,
            0.91
          );
          box-shadow:
            0 18px 40px -32px
              rgba(15, 23, 42, 0.5);
          text-decoration: none;
          backdrop-filter: blur(12px);
          transition:
            border-color 300ms ease,
            transform 360ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            box-shadow 360ms ease;
        }

        .order-via-card:hover {
          border-color: rgba(
            8,
            123,
            117,
            0.35
          );
          box-shadow:
            0 28px 52px -34px
              rgba(8, 123, 117, 0.42);
          transform: translateY(-4px);
        }

        .order-via-card:focus-visible {
          outline: 3px solid
            rgba(8, 123, 117, 0.2);
          outline-offset: 4px;
        }

        .order-via-icon {
          display: flex;
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #ffffff;
          box-shadow:
            0 10px 24px -18px
              rgba(15, 23, 42, 0.48);
        }

        .order-via-icon.is-whatsapp {
          color: #22c55e;
        }

        .order-via-icon.is-phone {
          color: #101828;
        }

        .order-via-content {
          min-width: 0;
          flex: 1;
        }

        .order-via-label {
          margin: 0;
          color: #101828;
          font-size: var(--lab-text-16);
          font-weight: 800;
          line-height: 1.4;
        }

        .order-via-value {
          margin: 5px 0 0;
          color: #475467;
          font-size: var(--lab-text-13);
          line-height: 1.5;
        }

        .order-via-arrow {
          display: flex;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #087b75;
          background: #eff9f7;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 280ms ease;
        }

        .order-via-card:hover
          .order-via-arrow {
          color: #ffffff;
          background: #087b75;
          transform: translateX(3px);
        }

        .lab-tests-panel {
          position: relative;
          overflow: hidden;
          padding: 28px;
          border: 1px solid
            rgba(15, 23, 42, 0.07);
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              #f4fcfa 0%,
              #ffffff 50%,
              #f1f8f7 100%
            );
          box-shadow:
            0 28px 65px -50px
              rgba(15, 23, 42, 0.46),
            inset 0 1px
              rgba(255, 255, 255, 0.94);
        }

        .lab-tests-decoration {
          position: absolute;
          top: -115px;
          right: -105px;
          width: 260px;
          height: 260px;
          border: 38px solid
            rgba(255, 255, 255, 0.54);
          border-radius: 50%;
          pointer-events: none;
        }

        .lab-tests-header {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
        }

        .lab-tests-heading {
          min-width: 0;
        }

        .lab-tests-eyebrow {
          margin: 0;
          color: #087b75;
          font-size: var(--lab-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .lab-tests-title {
          margin: 4px 0 0;
          color: #101828;
          font-size: var(--lab-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .lab-tests-description {
          max-width: 650px;
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--lab-text-13);
          line-height: 1.7;
        }

        .lab-tests-see-all {
          display: inline-flex;
          min-height: 42px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 8px 15px;
          border: 1px solid #087b75;
          border-radius: 999px;
          color: #087b75;
          background: rgba(
            255,
            255,
            255,
            0.9
          );
          box-shadow:
            0 13px 28px -21px
              rgba(8, 123, 117, 0.55);
          font-size: var(--lab-text-13);
          font-weight: 800;
          text-decoration: none;
          backdrop-filter: blur(12px);
          transition:
            color 280ms ease,
            background-color 280ms ease,
            transform 300ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              );
        }

        .lab-tests-see-all:hover {
          color: #ffffff;
          background: #087b75;
          transform: translateY(-2px);
        }

        .lab-tests-see-all svg {
          transition: transform 280ms ease;
        }

        .lab-tests-see-all:hover svg {
          transform: translateX(3px);
        }

        .lab-tests-slider {
          position: relative;
          z-index: 4;
        }

        .lab-tests-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          overflow-y: visible;
          padding: 8px 2px 18px;
          scroll-padding-inline: 8px;
          scroll-snap-type: x mandatory;
          overscroll-behavior-inline: contain;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }

        .lab-tests-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .lab-test-wrapper {
          width: min(88vw, 350px);
          flex: 0 0 min(88vw, 350px);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .lab-test-card {
          display: flex;
          height: 100%;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid
            rgba(15, 23, 42, 0.09);
          border-radius: 15px;
          background: rgba(
            255,
            255,
            255,
            0.98
          );
          box-shadow:
            0 13px 34px -28px
              rgba(15, 23, 42, 0.46),
            0 2px 7px
              rgba(15, 23, 42, 0.03);
          transform: translateZ(0);
          transition:
            transform 440ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            border-color 350ms ease,
            box-shadow 440ms ease;
        }

        .lab-test-card:hover {
          border-color: rgba(
            8,
            123,
            117,
            0.36
          );
          box-shadow:
            0 34px 68px -37px
              rgba(8, 123, 117, 0.42);
          transform: translateY(-6px);
        }

        .lab-test-top {
          display: grid;
          grid-template-columns:
            116px minmax(0, 1fr);
          gap: 13px;
          padding: 13px;
        }

        .lab-test-image-link {
          position: relative;
          display: block;
          overflow: hidden;
          min-height: 116px;
          border-radius: 10px;
          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #edf8f7 100%
            );
        }

        .lab-test-image {
          display: block;
          width: 100%;
          height: 116px;
          padding: 9px;
          object-fit: contain;
          transition:
            transform 600ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              );
        }

        .lab-test-card:hover
          .lab-test-image {
          transform: scale(1.06);
        }

        .lab-test-image-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #98a2b3;
          font-size: var(--lab-text-13);
          font-weight: 700;
        }

        .lab-test-information {
          min-width: 0;
        }

        .lab-test-name {
          display: -webkit-box;
          overflow: hidden;
          margin: 0;
          color: #101828;
          font-size: var(--lab-text-16);
          font-weight: 800;
          line-height: 1.45;
          text-decoration: none;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .lab-test-card:hover
          .lab-test-name {
          color: #087b75;
        }

        .lab-test-included {
          margin: 5px 0 0;
          color: #087b75;
          font-size: var(--lab-text-13);
          font-weight: 700;
          line-height: 1.5;
        }

        .lab-provider-list {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 9px;
        }

        .lab-provider-logo-shell {
          position: relative;
          display: flex;
          width: 30px;
          height: 30px;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid #e2e8ec;
          border-radius: 6px;
          background: #ffffff;
        }

        .lab-provider-logo {
          display: block;
          max-width: 24px;
          max-height: 24px;
          object-fit: contain;
        }

        .lab-provider-fallback {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: #087b75;
          background: #eff9f7;
          font-size: var(--lab-text-13);
          font-weight: 850;
        }

        .lab-more-providers {
          display: flex;
          min-width: 30px;
          height: 30px;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8ec;
          border-radius: 6px;
          color: #667085;
          background: #ffffff;
          font-size: var(--lab-text-13);
          font-weight: 800;
        }

        .lab-test-price-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 7px;
          margin-top: 9px;
        }

        .lab-test-price {
          margin: 0;
          color: #101828;
          font-size: var(--lab-text-18);
          font-weight: 850;
          line-height: 1.2;
        }

        .lab-test-original-price {
          margin: 0;
          color: #667085;
          font-size: var(--lab-text-13);
          line-height: 1.4;
          text-decoration: line-through;
        }

        .lab-test-discount {
          display: inline-flex;
          min-height: 26px;
          align-items: center;
          justify-content: center;
          padding: 4px 9px;
          border-radius: 5px;
          color: #ffffff;
          background: #e43145;
          font-size: var(--lab-text-13);
          font-weight: 850;
          line-height: 1;
        }

        .lab-test-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding: 12px 13px;
          border-top: 1px solid #e7ecef;
          background:
            linear-gradient(
              180deg,
              #ffffff,
              #fbfdfd
            );
        }

        .lab-test-meta {
          display: grid;
          gap: 7px;
          min-width: 0;
        }

        .lab-test-meta-item {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #101828;
          font-size: var(--lab-text-13);
          line-height: 1.4;
        }

        .lab-test-meta-item.is-booking {
          color: #475467;
        }

        .lab-test-meta-item.is-booking svg {
          color: #e67a00;
          fill: #e67a00;
        }

        .lab-book-button {
          display: inline-flex;
          min-width: 100px;
          min-height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 13px;
          border: 1px solid #087b75;
          border-radius: 8px;
          color: #ffffff;
          background: #087b75;
          font-family: inherit;
          font-size: var(--lab-text-13);
          font-weight: 850;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .lab-book-button:hover {
          box-shadow:
            0 12px 25px -14px
              rgba(8, 123, 117, 0.72);
          transform: translateY(-2px);
        }

        .lab-book-button.is-booked {
          color: #087b75;
          background: #eff9f7;
        }

        .lab-slider-button {
          position: absolute;
          top: 50%;
          z-index: 30;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid #087b75;
          border-radius: 50%;
          color: #087b75;
          background: rgba(
            255,
            255,
            255,
            0.97
          );
          box-shadow:
            0 12px 27px -14px
              rgba(15, 23, 42, 0.45);
          cursor: pointer;
          backdrop-filter: blur(10px);
          transform: translateY(-50%);
          transition:
            opacity 260ms ease,
            color 250ms ease,
            background-color 250ms ease;
        }

        .lab-slider-button-left {
          left: 0;
          transform: translate(
            -50%,
            -50%
          );
        }

        .lab-slider-button-right {
          right: 0;
          transform: translate(
            50%,
            -50%
          );
        }

        .lab-slider-button:hover {
          color: #ffffff;
          background: #087b75;
        }

        .lab-slider-button.is-hidden {
          pointer-events: none;
          opacity: 0;
        }

        .lab-empty {
          display: flex;
          min-height: 270px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid #dce5e6;
          border-radius: 15px;
          background: rgba(
            255,
            255,
            255,
            0.9
          );
          padding: 24px;
          text-align: center;
        }

        .lab-empty-title {
          margin: 12px 0 0;
          color: #344054;
          font-size: var(--lab-text-16);
          font-weight: 800;
        }

        .lab-empty-description {
          margin: 6px 0 0;
          color: #667085;
          font-size: var(--lab-text-13);
          line-height: 1.6;
        }

        @media (min-width: 1280px) {
          .lab-test-wrapper {
            width: calc(
              (100% - 48px) / 4
            );
            flex-basis: calc(
              (100% - 48px) / 4
            );
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .home-lab-section {
            padding: 46px 0 56px;
          }

          .home-lab-container {
            width: min(
              1180px,
              calc(100% - 40px)
            );
          }

          .lab-tests-panel {
            padding: 25px;
          }

          .lab-test-wrapper {
            width: calc(
              (100% - 32px) / 3
            );
            flex-basis: calc(
              (100% - 32px) / 3
            );
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .home-lab-section {
            padding: 42px 0 52px;
          }

          .home-lab-container {
            width: calc(100% - 32px);
          }

          .lab-tests-panel {
            padding: 22px;
          }

          .lab-test-wrapper {
            width: calc(
              (100% - 16px) / 2
            );
            flex-basis: calc(
              (100% - 16px) / 2
            );
          }

          .order-via-card {
            min-height: 96px;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .home-lab-section {
            padding: 38px 0 48px;
          }

          .home-lab-container {
            width: calc(100% - 24px);
          }

          .order-via-grid {
            grid-template-columns: 1fr;
          }

          .lab-tests-panel {
            padding: 20px;
          }

          .lab-test-wrapper {
            width: calc(100% - 44px);
            flex-basis: calc(100% - 44px);
          }

          .lab-slider-button {
            display: none;
          }
        }

        @media (max-width: 639px) {
          .home-lab-section {
            padding: 32px 0 42px;
          }

          .home-lab-container {
            width: 100%;
          }

          .order-via-section {
            margin-bottom: 30px;
            padding-inline: 14px;
          }

          .order-via-heading {
            gap: 9px;
          }

          .order-via-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .order-via-card {
            min-height: 90px;
            padding: 15px;
            border-radius: 13px;
          }

          .order-via-icon {
            width: 46px;
            height: 46px;
          }

          .lab-tests-panel {
            padding: 20px 0;
            border-right: 0;
            border-left: 0;
            border-radius: 0;
          }

          .lab-tests-header {
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
            padding-inline: 14px;
          }

          .lab-tests-description {
            max-width: 330px;
          }

          .lab-tests-see-all {
            min-height: 40px;
            padding-inline: 13px;
          }

          .lab-tests-scroll {
            gap: 12px;
            padding: 8px 14px 18px;
            scroll-padding-inline: 14px;
          }

          .lab-test-wrapper {
            width: min(89vw, 350px);
            flex-basis: min(89vw, 350px);
          }

          .lab-slider-button {
            display: none;
          }
        }

        @media (max-width: 440px) {
          .order-via-section {
            padding-inline: 11px;
          }

          .order-via-title {
            white-space: nowrap;
          }

          .lab-tests-header {
            padding-inline: 11px;
          }

          .lab-tests-see-all span {
            display: none;
          }

          .lab-tests-see-all {
            width: 40px;
            min-width: 40px;
            padding: 0;
          }

          .lab-tests-scroll {
            padding-right: 11px;
            padding-left: 11px;
            scroll-padding-inline: 11px;
          }

          .lab-test-top {
            grid-template-columns:
              96px minmax(0, 1fr);
          }

          .lab-test-image-link,
          .lab-test-image {
            min-height: 102px;
            height: 102px;
          }

          .lab-test-bottom {
            align-items: stretch;
            flex-direction: column;
          }

          .lab-book-button {
            width: 100%;
          }
        }

        @media (max-width: 350px) {
          .lab-test-wrapper {
            width: calc(100vw - 32px);
            flex-basis: calc(
              100vw - 32px
            );
          }

          .lab-test-top {
            grid-template-columns: 1fr;
          }

          .lab-test-image-link,
          .lab-test-image {
            min-height: 150px;
            height: 150px;
          }
        }

        @media (hover: none) {
          .order-via-card:hover,
          .lab-test-card:hover,
          .lab-test-card:hover
            .lab-test-image,
          .lab-book-button:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-lab-section *,
          .home-lab-section *::before,
          .home-lab-section *::after {
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

function OrderViaSection() {
  return (
    <section
      aria-labelledby="order-via-title"
      className="order-via-section"
    >
      <div className="order-via-heading">
        <span
          aria-hidden="true"
          className="order-via-line"
        />

        <h2
          id="order-via-title"
          className="order-via-title"
        >
          You Can Order Via
        </h2>

        <span
          aria-hidden="true"
          className="order-via-line"
        />
      </div>

      <div className="order-via-grid">
        {CONTACT_ITEMS.map((item) => {
          const isWhatsApp =
            item.type === "whatsapp";

          return (
            <a
              key={item.id}
              href={item.href}
              target={
                isWhatsApp
                  ? "_blank"
                  : undefined
              }
              rel={
                isWhatsApp
                  ? "noreferrer"
                  : undefined
              }
              className="order-via-card"
            >
              <span
                className={[
                  "order-via-icon",
                  isWhatsApp
                    ? "is-whatsapp"
                    : "is-phone",
                ].join(" ")}
              >
                {isWhatsApp ? (
                  <MessageCircle
                    size={22}
                    fill="currentColor"
                    strokeWidth={1.7}
                  />
                ) : (
                  <Phone
                    size={22}
                    fill="currentColor"
                    strokeWidth={1.7}
                  />
                )}
              </span>

              <span className="order-via-content">
                <span className="order-via-label">
                  {item.title}
                </span>

                <span className="order-via-value">
                  {item.value}
                </span>
              </span>

              <span className="order-via-arrow">
                <ChevronRight
                  size={18}
                  strokeWidth={1.8}
                />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function LabTestCard({
  test,
  booked,
  onToggleBooking,
}: {
  test: LabTest;
  booked: boolean;
  onToggleBooking: () => void;
}) {
  const [imageError, setImageError] =
    useState(false);

  return (
    <article
      data-lab-test-card
      className="lab-test-wrapper lab-test-card"
    >
      <div className="lab-test-top">
        <Link
          href={test.href}
          aria-label={test.title}
          className="lab-test-image-link"
        >
          {!imageError ? (
            <img
              src={test.image}
              alt={test.title}
              width={300}
              height={300}
              loading="lazy"
              draggable={false}
              onError={() =>
                setImageError(true)
              }
              className="lab-test-image"
            />
          ) : (
            <div className="lab-test-image-fallback">
              <ImageOff
                size={20}
                strokeWidth={1.7}
              />

              <span>Image unavailable</span>
            </div>
          )}
        </Link>

        <div className="lab-test-information">
          <Link
            href={test.href}
            className="lab-test-name"
          >
            {test.title}
          </Link>

          <p className="lab-test-included">
            Includes {test.includedTests}{" "}
            {test.includedTests === 1
              ? "test"
              : "tests"}
          </p>

          <ProviderLogos
            logos={test.providerLogos}
            extraCount={
              (test.id % 5) + 2
            }
          />

          <div className="lab-test-price-row">
            <p className="lab-test-price">
              {test.currencySymbol}
              {formatPrice(test.salePrice)}
            </p>

            {test.discount > 0 && (
              <>
                <p className="lab-test-original-price">
                  {test.currencySymbol}
                  {formatPrice(
                    test.originalPrice,
                  )}
                </p>

                <span className="lab-test-discount">
                  {test.discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="lab-test-bottom">
        <div className="lab-test-meta">
          <div className="lab-test-meta-item">
            <Clock3
              size={18}
              strokeWidth={1.8}
            />

            <span>
              Report in {test.reportHours} hours
            </span>
          </div>

          <div className="lab-test-meta-item is-booking">
            <Star
              size={18}
              strokeWidth={1.7}
            />

            <span>
              Booked {test.bookingCount} times
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleBooking}
          aria-label={
            booked
              ? `Cancel booking for ${test.title}`
              : `Book ${test.title}`
          }
          className={[
            "lab-book-button",
            booked ? "is-booked" : "",
          ].join(" ")}
        >
          {booked ? (
            <>
              <Check
                size={16}
                strokeWidth={2}
              />
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

function ProviderLogos({
  logos,
  extraCount,
}: {
  logos: string[];
  extraCount: number;
}) {
  return (
    <div className="lab-provider-list">
      {logos.slice(0, 4).map((logo, index) => (
        <ProviderLogo
          key={`${logo}-${index}`}
          logo={logo}
        />
      ))}

      <span className="lab-more-providers">
        +{extraCount}
      </span>
    </div>
  );
}

function ProviderLogo({
  logo,
}: {
  logo: string;
}) {
  const [logoError, setLogoError] =
    useState(false);

  return (
    <span className="lab-provider-logo-shell">
      {!logoError ? (
        <img
          src={logo}
          alt="Diagnostic provider logo"
          width={48}
          height={48}
          loading="lazy"
          onError={() =>
            setLogoError(true)
          }
          className="lab-provider-logo"
        />
      ) : (
        <span className="lab-provider-fallback">
          L
        </span>
      )}
    </span>
  );
}

function SliderButton({
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
      aria-label={
        direction === "left"
          ? "Show previous lab tests"
          : "Show more lab tests"
      }
      className={[
        "lab-slider-button",
        direction === "left"
          ? "lab-slider-button-left"
          : "lab-slider-button-right",
        visible ? "" : "is-hidden",
      ].join(" ")}
    >
      <Icon
        size={20}
        strokeWidth={1.8}
      />
    </button>
  );
}

function normalizeLabTest(
  product: JsonProduct,
  index: number,
): LabTest {
  const salePrice = Number(product.price);

  const discount =
    DISCOUNTS[index % DISCOUNTS.length];

  const originalPrice =
    discount > 0
      ? salePrice / (1 - discount / 100)
      : salePrice;

  const providerStart =
    index % PROVIDER_LOGOS.length;

  const providerLogos = Array.from({
    length: 4,
  }).map(
    (_, providerIndex) =>
      PROVIDER_LOGOS[
        (providerStart + providerIndex) %
          PROVIDER_LOGOS.length
      ],
  );

  return {
    ...product,
    uniqueId: `lab-test-${product.id}-${index}`,
    href: `/lab-tests/${createSlug(
      product.title,
    )}`,
    salePrice,
    originalPrice,
    discount,
    reportHours:
      [12, 16, 20, 24][
        index % 4
      ],
    bookingCount:
      ((product.id * 37) % 8000) + 300,
    includedTests:
      Math.max(
        1,
        ((product.id + index) % 5) + 1,
      ),
    currencySymbol: getCurrencySymbol(
      product.currency,
    ),
    providerLogos,
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
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2);
}

function LabTestSkeleton() {
  return (
    <div className="lab-test-wrapper lab-test-card">
      <div className="lab-test-top">
        <div className="h-[116px] animate-pulse rounded-[10px] bg-[#e7efee]" />

        <div>
          <div className="h-5 animate-pulse rounded bg-[#e7efee]" />

          <div className="mt-3 h-4 w-24 animate-pulse rounded bg-[#e7efee]" />

          <div className="mt-3 flex gap-2">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-[30px] w-[30px] animate-pulse rounded bg-[#e7efee]"
              />
            ))}
          </div>

          <div className="mt-3 h-5 w-28 animate-pulse rounded bg-[#e7efee]" />
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-[#e7ecef] p-3">
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-[#e7efee]" />

          <div className="h-4 w-36 animate-pulse rounded bg-[#e7efee]" />
        </div>

        <div className="h-11 w-24 animate-pulse rounded bg-[#e7efee]" />
      </div>
    </div>
  );
}

function EmptyLabTests() {
  return (
    <div className="lab-empty">
      <div>
        <FlaskConical
          size={34}
          className="mx-auto text-[#98a2b3]"
        />

        <p className="lab-empty-title">
          No laboratory tests available
        </p>

        <p className="lab-empty-description">
          Tests will appear here when product data is
          available.
        </p>
      </div>
    </div>
  );
}

function LabTestError({
  message,
}: {
  message: string;
}) {
  return (
    <section className="flex min-h-[320px] items-center justify-center bg-[#f7fbfa] px-5 py-12 text-center">
      <div>
        <FlaskConical
          size={36}
          className="mx-auto text-[#b42318]"
        />

        <p className="mt-3 text-[16px] font-extrabold text-[#b42318]">
          Lab-test data could not be loaded
        </p>

        <p className="mt-2 text-[13px] leading-6 text-[#667085]">
          {message}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="mt-4 min-h-[42px] rounded-[9px] bg-[#087b75] px-5 text-[13px] font-bold text-white"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}