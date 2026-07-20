"use client";

import {
  ArrowRight,
  Building2,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

type LabPartner = {
  id: string;
  name: string;
  slug: string;
  href: string;
  logo: string;
  searchKeyword: string;
};

type PartnerLogoProps = {
  partner: LabPartner;
};

const INITIAL_DESKTOP_ITEMS = 12;
const INITIAL_MOBILE_ITEMS = 6;

const fallbackPartners: LabPartner[] = [
  {
    id: "popular-diagnostic",
    name: "Popular Diagnostic Centre Ltd",
    slug: "popular-diagnostic-centre",
    href: "/lab-tests?partner=popular-diagnostic-centre",
    logo: "https://logo.clearbit.com/populardiagnostic.com?size=256",
    searchKeyword: "Popular Diagnostic Centre",
  },
  {
    id: "ibn-sina",
    name: "The Ibn Sina Trust",
    slug: "the-ibn-sina-trust",
    href: "/lab-tests?partner=the-ibn-sina-trust",
    logo: "https://logo.clearbit.com/ibnsinatrust.com?size=256",
    searchKeyword: "Ibn Sina Trust",
  },
  {
    id: "praava-health",
    name: "Praava Health",
    slug: "praava-health",
    href: "/lab-tests?partner=praava-health",
    logo: "https://logo.clearbit.com/praavahealth.com?size=256",
    searchKeyword: "Praava Health",
  },
  {
    id: "dr-lal-pathlabs",
    name: "Dr Lal PathLabs",
    slug: "dr-lal-pathlabs",
    href: "/lab-tests?partner=dr-lal-pathlabs",
    logo: "https://logo.clearbit.com/lalpathlabs.com?size=256",
    searchKeyword: "Dr Lal PathLabs",
  },
  {
    id: "brac-healthcare",
    name: "BRAC Healthcare",
    slug: "brac-healthcare",
    href: "/lab-tests?partner=brac-healthcare",
    logo: "https://logo.clearbit.com/brachealthcare.com?size=256",
    searchKeyword: "BRAC Healthcare",
  },
  {
    id: "thyrocare",
    name: "Thyrocare Bangladesh Ltd",
    slug: "thyrocare-bangladesh",
    href: "/lab-tests?partner=thyrocare-bangladesh",
    logo: "https://logo.clearbit.com/thyrocare.com?size=256",
    searchKeyword: "Thyrocare",
  },
  {
    id: "omnicare-diagnostic",
    name: "Omnicare Diagnostic Limited",
    slug: "omnicare-diagnostic",
    href: "/lab-tests?partner=omnicare-diagnostic",
    logo: "https://logo.clearbit.com/omnicarebd.com?size=256",
    searchKeyword: "Omnicare Diagnostic",
  },
  {
    id: "ascent-health",
    name: "Ascent Health Limited",
    slug: "ascent-health",
    href: "/lab-tests?partner=ascent-health",
    logo: "https://logo.clearbit.com/ascenthealth.com?size=256",
    searchKeyword: "Ascent Health",
  },
  {
    id: "jg-healthcare",
    name: "JG Healthcare",
    slug: "jg-healthcare",
    href: "/lab-tests?partner=jg-healthcare",
    logo: "https://logo.clearbit.com/jghealthcare.com?size=256",
    searchKeyword: "JG Healthcare",
  },
  {
    id: "probe-bangladesh",
    name: "Probe Bangladesh Limited",
    slug: "probe-bangladesh",
    href: "/lab-tests?partner=probe-bangladesh",
    logo: "https://logo.clearbit.com/probebangladesh.com?size=256",
    searchKeyword: "Probe Bangladesh",
  },
  {
    id: "dna-solution",
    name: "DNA Solution Ltd",
    slug: "dna-solution",
    href: "/lab-tests?partner=dna-solution",
    logo: "https://logo.clearbit.com/dnasolutionbd.com?size=256",
    searchKeyword: "DNA Solution",
  },
  {
    id: "labaid-diagnostic",
    name: "Labaid Diagnostic",
    slug: "labaid-diagnostic",
    href: "/lab-tests?partner=labaid-diagnostic",
    logo: "https://logo.clearbit.com/labaidgroup.com?size=256",
    searchKeyword: "Labaid Diagnostic",
  },
  {
    id: "evercare-hospital",
    name: "Evercare Hospital",
    slug: "evercare-hospital",
    href: "/lab-tests?partner=evercare-hospital",
    logo: "https://logo.clearbit.com/evercarebd.com?size=256",
    searchKeyword: "Evercare Hospital",
  },
  {
    id: "square-hospital",
    name: "Square Hospital",
    slug: "square-hospital",
    href: "/lab-tests?partner=square-hospital",
    logo: "https://logo.clearbit.com/squarehospital.com?size=256",
    searchKeyword: "Square Hospital",
  },
  {
    id: "medinova",
    name: "Medinova Medical Services",
    slug: "medinova",
    href: "/lab-tests?partner=medinova",
    logo: "https://logo.clearbit.com/medinova.com.bd?size=256",
    searchKeyword: "Medinova",
  },
];

export default function TrustedLabPartners() {
  const [jsonProducts, setJsonProducts] = useState<JsonProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPartners() {
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

        const validProducts = result.filter(isValidProduct);

        setJsonProducts(validProducts);
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
            : "Unable to load data.json.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadPartners();

    return () => {
      controller.abort();
    };
  }, []);

  const partners = useMemo(() => {
    const partnersFromJson = createPartnersFromProducts(jsonProducts);

    return mergePartners(
      partnersFromJson,
      fallbackPartners,
    );
  }, [jsonProducts]);

  return (
    <>
      <section
        aria-labelledby="trusted-lab-partners-title"
        className="trusted-lab-section"
      >
        <div
          aria-hidden="true"
          className="trusted-lab-pattern"
        />

        <div
          aria-hidden="true"
          className="trusted-lab-glow trusted-lab-glow-left"
        />

        <div
          aria-hidden="true"
          className="trusted-lab-glow trusted-lab-glow-right"
        />

        <div className="trusted-lab-container">
          <header className="trusted-lab-header">
            <div className="trusted-lab-heading-content">
              <p className="trusted-lab-eyebrow">
                Certified diagnostic providers
              </p>

              <h2
                id="trusted-lab-partners-title"
                className="trusted-lab-title"
              >
                Browse Tests by Trusted Lab Partners
              </h2>

              <p className="trusted-lab-description">
                Choose a trusted diagnostic partner and
                explore available laboratory tests, health
                packages and home sample collection services.
              </p>
            </div>

            <Link
              href="/lab-tests"
              className="trusted-lab-view-all"
            >
              <span>View All Tests</span>

              <ArrowRight
                size={18}
                strokeWidth={1.8}
              />
            </Link>
          </header>

          {loading ? (
            <LabPartnerSkeleton />
          ) : (
            <>
              {loadError && (
                <div className="trusted-lab-warning">
                  <RefreshCw
                    size={18}
                    strokeWidth={1.8}
                  />

                  <p>
                    {loadError} Default laboratory partners
                    are being displayed.
                  </p>
                </div>
              )}

              <div
                className={[
                  "trusted-lab-grid",
                  showAll
                    ? "trusted-lab-grid-expanded"
                    : "",
                ].join(" ")}
              >
                {partners.map((partner, index) => (
                  <div
                    key={partner.id}
                    className={[
                      "trusted-lab-grid-item",
                      index >= INITIAL_DESKTOP_ITEMS
                        ? "trusted-lab-desktop-hidden"
                        : "",
                      index >= INITIAL_MOBILE_ITEMS
                        ? "trusted-lab-mobile-hidden"
                        : "",
                      showAll
                        ? "trusted-lab-item-visible"
                        : "",
                    ].join(" ")}
                  >
                    <LabPartnerCard
                      partner={partner}
                    />
                  </div>
                ))}
              </div>

              {partners.length > INITIAL_MOBILE_ITEMS && (
                <div className="trusted-lab-load-more-wrapper">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAll((current) => !current)
                    }
                    className="trusted-lab-load-more"
                    aria-expanded={showAll}
                  >
                    {showAll ? (
                      <>
                        <span>Show Less</span>

                        <ChevronUp
                          size={18}
                          strokeWidth={1.8}
                        />
                      </>
                    ) : (
                      <>
                        <span>Show More Partners</span>

                        <ChevronDown
                          size={18}
                          strokeWidth={1.8}
                        />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style jsx global>{`
        .trusted-lab-section {
          --trusted-text-20: 20px;
          --trusted-text-18: 18px;
          --trusted-text-16: 16px;
          --trusted-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 56px 0 64px;
          background:
            radial-gradient(
              circle at 4% 8%,
              rgba(213, 242, 238, 0.65),
              transparent 29%
            ),
            radial-gradient(
              circle at 96% 92%,
              rgba(222, 235, 252, 0.65),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #fbfefd 0%,
              #ffffff 52%,
              #f8fbff 100%
            );
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .trusted-lab-pattern {
          position: absolute;
          inset: 0;
          z-index: -3;
          pointer-events: none;
          opacity: 0.2;
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

        .trusted-lab-glow {
          position: absolute;
          z-index: -2;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(120px);
          opacity: 0.45;
        }

        .trusted-lab-glow-left {
          top: -170px;
          left: -260px;
          background: rgba(52, 173, 148, 0.36);
        }

        .trusted-lab-glow-right {
          right: -260px;
          bottom: -170px;
          background: rgba(75, 134, 218, 0.3);
        }

        .trusted-lab-container {
          position: relative;
          width: min(
            1440px,
            calc(100% - 48px)
          );
          margin-inline: auto;
        }

        .trusted-lab-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .trusted-lab-heading-content {
          min-width: 0;
        }

        .trusted-lab-eyebrow {
          margin: 0;
          color: #087b75;
          font-size: var(--trusted-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .trusted-lab-title {
          margin: 5px 0 0;
          color: #101828;
          font-size: var(--trusted-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .trusted-lab-description {
          max-width: 690px;
          margin: 7px 0 0;
          color: #667085;
          font-size: var(--trusted-text-13);
          line-height: 1.7;
        }

        .trusted-lab-view-all {
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
          font-size: var(--trusted-text-13);
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
              ),
            box-shadow 300ms ease;
        }

        .trusted-lab-view-all:hover {
          color: #ffffff;
          background: #087b75;
          box-shadow:
            0 18px 34px -20px
              rgba(8, 123, 117, 0.68);
          transform: translateY(-2px);
        }

        .trusted-lab-view-all svg {
          transition: transform 280ms ease;
        }

        .trusted-lab-view-all:hover svg {
          transform: translateX(3px);
        }

        .trusted-lab-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .trusted-lab-grid-item {
          min-width: 0;
        }

        .trusted-lab-card {
          position: relative;
          display: flex;
          min-height: 126px;
          align-items: center;
          gap: 16px;
          overflow: hidden;
          padding: 14px;
          border: 1px solid
            rgba(15, 23, 42, 0.09);
          border-radius: 16px;
          color: #101828;
          background:
            radial-gradient(
              circle at 10% 50%,
              rgba(234, 248, 245, 0.68),
              transparent 42%
            ),
            rgba(255, 255, 255, 0.96);
          box-shadow:
            0 18px 42px -35px
              rgba(15, 23, 42, 0.5),
            0 2px 8px
              rgba(15, 23, 42, 0.025);
          text-decoration: none;
          outline: none;
          transform: translateZ(0);
          transition:
            border-color 320ms ease,
            transform 420ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            box-shadow 420ms ease;
        }

        .trusted-lab-card::before {
          position: absolute;
          top: -42px;
          right: -42px;
          width: 108px;
          height: 108px;
          border: 18px solid
            rgba(8, 123, 117, 0.035);
          border-radius: 50%;
          pointer-events: none;
          content: "";
          transition:
            transform 500ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              );
        }

        .trusted-lab-card:hover {
          border-color: rgba(
            8,
            123,
            117,
            0.32
          );
          box-shadow:
            0 32px 58px -39px
              rgba(8, 123, 117, 0.4),
            0 14px 30px -27px
              rgba(15, 23, 42, 0.3);
          transform: translateY(-5px);
        }

        .trusted-lab-card:hover::before {
          transform: scale(1.15);
        }

        .trusted-lab-card:focus-visible {
          outline: 3px solid
            rgba(8, 123, 117, 0.2);
          outline-offset: 4px;
        }

        .trusted-lab-logo-shell {
          position: relative;
          display: flex;
          width: 82px;
          height: 82px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid #e2e8ec;
          border-radius: 12px;
          background: #ffffff;
          box-shadow:
            0 12px 26px -22px
              rgba(15, 23, 42, 0.55);
        }

        .trusted-lab-logo {
          display: block;
          max-width: 68px;
          max-height: 68px;
          object-fit: contain;
          filter: saturate(1.02);
          transform: scale(1.001);
          transition:
            transform 500ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            filter 300ms ease;
        }

        .trusted-lab-card:hover
          .trusted-lab-logo {
          filter: saturate(1.08);
          transform: scale(1.07);
        }

        .trusted-lab-logo-fallback {
          display: flex;
          width: 62px;
          height: 62px;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: #087b75;
          background: #eff9f7;
          font-size: var(--trusted-text-20);
          font-weight: 850;
        }

        .trusted-lab-card-content {
          position: relative;
          z-index: 2;
          min-width: 0;
          flex: 1;
        }

        .trusted-lab-partner-name {
          display: -webkit-box;
          overflow: hidden;
          margin: 0;
          color: #101828;
          font-size: var(--trusted-text-16);
          font-weight: 800;
          line-height: 1.45;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          transition: color 250ms ease;
        }

        .trusted-lab-card:hover
          .trusted-lab-partner-name {
          color: #087b75;
        }

        .trusted-lab-test-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 10px;
          color: #087b75;
          font-size: var(--trusted-text-13);
          font-weight: 750;
          line-height: 1.4;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }

        .trusted-lab-test-link svg {
          transition: transform 280ms ease;
        }

        .trusted-lab-card:hover
          .trusted-lab-test-link svg {
          transform: translateX(4px);
        }

        .trusted-lab-card-arrow {
          position: relative;
          z-index: 2;
          display: flex;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid #d1e8e4;
          border-radius: 50%;
          color: #087b75;
          background: #f1faf8;
          opacity: 0;
          transform: translateX(-6px);
          transition:
            opacity 280ms ease,
            transform 320ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            color 250ms ease,
            background-color 250ms ease;
        }

        .trusted-lab-card:hover
          .trusted-lab-card-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .trusted-lab-warning {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-bottom: 18px;
          padding: 12px 14px;
          border: 1px solid #f1d7a6;
          border-radius: 10px;
          color: #8a5a0a;
          background: #fffaf0;
        }

        .trusted-lab-warning p {
          margin: 0;
          font-size: var(--trusted-text-13);
          line-height: 1.6;
        }

        .trusted-lab-load-more-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 26px;
        }

        .trusted-lab-load-more {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 8px 18px;
          border: 1px solid #087b75;
          border-radius: 999px;
          color: #087b75;
          background: #ffffff;
          box-shadow:
            0 13px 26px -20px
              rgba(8, 123, 117, 0.55);
          font-family: inherit;
          font-size: var(--trusted-text-13);
          font-weight: 800;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease;
        }

        .trusted-lab-load-more:hover {
          color: #ffffff;
          background: #087b75;
          transform: translateY(-2px);
        }

        .trusted-lab-skeleton-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .trusted-lab-skeleton-card {
          display: flex;
          min-height: 126px;
          align-items: center;
          gap: 16px;
          padding: 14px;
          border: 1px solid #e4e9ec;
          border-radius: 16px;
          background: #ffffff;
        }

        .trusted-lab-skeleton-logo {
          width: 82px;
          height: 82px;
          flex-shrink: 0;
          border-radius: 12px;
          background:
            linear-gradient(
              90deg,
              #edf1f2 25%,
              #f7f9f9 50%,
              #edf1f2 75%
            );
          background-size: 200% 100%;
          animation:
            trustedLabShimmer
            1.4s linear infinite;
        }

        .trusted-lab-skeleton-content {
          flex: 1;
        }

        .trusted-lab-skeleton-line {
          height: 16px;
          border-radius: 6px;
          background:
            linear-gradient(
              90deg,
              #edf1f2 25%,
              #f7f9f9 50%,
              #edf1f2 75%
            );
          background-size: 200% 100%;
          animation:
            trustedLabShimmer
            1.4s linear infinite;
        }

        .trusted-lab-skeleton-line + .trusted-lab-skeleton-line {
          width: 48%;
          height: 13px;
          margin-top: 12px;
        }

        @keyframes trustedLabShimmer {
          from {
            background-position: 200% 0;
          }

          to {
            background-position: -200% 0;
          }
        }

        .trusted-lab-desktop-hidden {
          display: none;
        }

        .trusted-lab-item-visible {
          display: block;
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .trusted-lab-section {
            padding: 52px 0 60px;
          }

          .trusted-lab-container {
            width: min(
              1180px,
              calc(100% - 40px)
            );
          }

          .trusted-lab-grid,
          .trusted-lab-skeleton-grid {
            gap: 16px;
          }

          .trusted-lab-card {
            min-height: 120px;
            gap: 13px;
          }

          .trusted-lab-logo-shell {
            width: 76px;
            height: 76px;
          }

          .trusted-lab-logo {
            max-width: 62px;
            max-height: 62px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .trusted-lab-section {
            padding: 48px 0 56px;
          }

          .trusted-lab-container {
            width: calc(100% - 32px);
          }

          .trusted-lab-grid,
          .trusted-lab-skeleton-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 15px;
          }

          .trusted-lab-card-arrow {
            opacity: 1;
            transform: none;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .trusted-lab-section {
            padding: 44px 0 50px;
          }

          .trusted-lab-container {
            width: calc(100% - 24px);
          }

          .trusted-lab-header {
            align-items: flex-start;
          }

          .trusted-lab-grid,
          .trusted-lab-skeleton-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 13px;
          }

          .trusted-lab-card {
            align-items: flex-start;
            min-height: 142px;
            flex-direction: column;
          }

          .trusted-lab-logo-shell {
            width: 68px;
            height: 68px;
          }

          .trusted-lab-logo {
            max-width: 56px;
            max-height: 56px;
          }

          .trusted-lab-card-arrow {
            position: absolute;
            right: 12px;
            bottom: 12px;
            opacity: 1;
            transform: none;
          }
        }

        @media (max-width: 639px) {
          .trusted-lab-section {
            padding: 38px 0 46px;
          }

          .trusted-lab-container {
            width: 100%;
          }

          .trusted-lab-header {
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 20px;
            padding-inline: 14px;
          }

          .trusted-lab-description {
            max-width: 340px;
          }

          .trusted-lab-view-all {
            min-height: 40px;
            padding-inline: 13px;
          }

          .trusted-lab-grid,
          .trusted-lab-skeleton-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            padding-inline: 14px;
          }

          .trusted-lab-card {
            min-height: 108px;
            gap: 13px;
            padding: 12px;
            border-radius: 14px;
          }

          .trusted-lab-logo-shell {
            width: 70px;
            height: 70px;
            border-radius: 10px;
          }

          .trusted-lab-logo {
            max-width: 58px;
            max-height: 58px;
          }

          .trusted-lab-card-arrow {
            opacity: 1;
            transform: none;
          }

          .trusted-lab-warning {
            margin-right: 14px;
            margin-left: 14px;
          }

          .trusted-lab-load-more-wrapper {
            padding-inline: 14px;
          }

          .trusted-lab-mobile-hidden {
            display: none;
          }

          .trusted-lab-item-visible {
            display: block;
          }

          .trusted-lab-skeleton-card {
            min-height: 108px;
            padding: 12px;
          }

          .trusted-lab-skeleton-logo {
            width: 70px;
            height: 70px;
          }
        }

        @media (max-width: 420px) {
          .trusted-lab-header {
            padding-inline: 11px;
          }

          .trusted-lab-view-all span {
            display: none;
          }

          .trusted-lab-view-all {
            width: 40px;
            min-width: 40px;
            padding: 0;
          }

          .trusted-lab-grid,
          .trusted-lab-skeleton-grid {
            padding-inline: 11px;
          }

          .trusted-lab-card-arrow {
            width: 34px;
            height: 34px;
          }

          .trusted-lab-warning {
            margin-right: 11px;
            margin-left: 11px;
          }
        }

        @media (max-width: 350px) {
          .trusted-lab-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .trusted-lab-card-arrow {
            position: absolute;
            right: 12px;
            bottom: 12px;
          }
        }

        @media (hover: none) {
          .trusted-lab-card:hover,
          .trusted-lab-card:hover
            .trusted-lab-logo,
          .trusted-lab-view-all:hover,
          .trusted-lab-load-more:hover {
            transform: none;
          }

          .trusted-lab-card-arrow {
            opacity: 1;
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trusted-lab-section *,
          .trusted-lab-section *::before,
          .trusted-lab-section *::after {
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

function LabPartnerCard({
  partner,
}: {
  partner: LabPartner;
}) {
  return (
    <Link
      href={partner.href}
      aria-label={`See all tests from ${partner.name}`}
      className="trusted-lab-card"
    >
      <PartnerLogo partner={partner} />

      <div className="trusted-lab-card-content">
        <h3 className="trusted-lab-partner-name">
          {partner.name}
        </h3>

        <span className="trusted-lab-test-link">
          <span>See all tests</span>

          <ArrowRight
            size={16}
            strokeWidth={1.8}
          />
        </span>
      </div>

      <span
        aria-hidden="true"
        className="trusted-lab-card-arrow"
      >
        <ArrowRight
          size={18}
          strokeWidth={1.8}
        />
      </span>
    </Link>
  );
}

function PartnerLogo({
  partner,
}: PartnerLogoProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <span className="trusted-lab-logo-shell">
      {!logoError ? (
        <img
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={160}
          height={160}
          loading="lazy"
          draggable={false}
          onError={() => setLogoError(true)}
          className="trusted-lab-logo"
        />
      ) : (
        <span className="trusted-lab-logo-fallback">
          {getInitials(partner.name)}
        </span>
      )}
    </span>
  );
}

function LabPartnerSkeleton() {
  return (
    <div className="trusted-lab-skeleton-grid">
      {Array.from({
        length: 9,
      }).map((_, index) => (
        <div
          key={index}
          className="trusted-lab-skeleton-card"
        >
          <div className="trusted-lab-skeleton-logo" />

          <div className="trusted-lab-skeleton-content">
            <div className="trusted-lab-skeleton-line" />

            <div className="trusted-lab-skeleton-line" />
          </div>
        </div>
      ))}
    </div>
  );
}

function createPartnersFromProducts(
  products: JsonProduct[],
): LabPartner[] {
  const uniqueBrands = new Map<string, JsonProduct>();

  products.forEach((product) => {
    const brand = product.brand.trim();

    if (!brand) {
      return;
    }

    const normalizedBrand = brand.toLowerCase();

    if (!uniqueBrands.has(normalizedBrand)) {
      uniqueBrands.set(normalizedBrand, product);
    }
  });

  return Array.from(uniqueBrands.values()).map(
    (product, index) => {
      const name = product.brand.trim();
      const slug = createSlug(name);

      return {
        id: `json-partner-${product.id}-${index}`,
        name,
        slug,
        href: `/lab-tests?partner=${encodeURIComponent(
          slug,
        )}`,
        logo: product.image,
        searchKeyword: name,
      };
    },
  );
}

function mergePartners(
  jsonPartners: LabPartner[],
  defaultPartners: LabPartner[],
): LabPartner[] {
  const mergedPartners: LabPartner[] = [];
  const usedNames = new Set<string>();

  const addPartner = (partner: LabPartner) => {
    const normalizedName = partner.name
      .trim()
      .toLowerCase();

    if (!normalizedName || usedNames.has(normalizedName)) {
      return;
    }

    usedNames.add(normalizedName);
    mergedPartners.push(partner);
  };

  defaultPartners.forEach(addPartner);
  jsonPartners.forEach(addPartner);

  return mergedPartners;
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

  const product = value as Partial<JsonProduct>;

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

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}