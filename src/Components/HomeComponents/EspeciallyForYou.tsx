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

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="especially-section"
        aria-labelledby="especially-section-title"
      >
        <div
          aria-hidden="true"
          className="especially-background-grid"
        />

        <div
          aria-hidden="true"
          className="especially-background-glow especially-background-glow-left"
        />

        <div
          aria-hidden="true"
          className="especially-background-glow especially-background-glow-right"
        />

        <div className="especially-container">
          <header
            className={`especially-header ${
              isVisible ? "especially-visible" : ""
            }`}
          >
            <div className="especially-heading-content">
              <p className="especially-eyebrow">
                Exclusive Services
              </p>

              <h2
                id="especially-section-title"
                className="especially-title"
              >
                Especially For You
              </h2>

              <p className="especially-description">
                Discover healthcare offers, pharmacy support and quick ordering
                services designed for your everyday needs.
              </p>
            </div>

            <Link
              href="/offers"
              className="especially-view-all especially-view-all-desktop"
            >
              <span>View all offers</span>

              <ArrowIcon className="especially-view-all-icon" />
            </Link>
          </header>

          <div className="especially-card-area">
            <div className="especially-card-list">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className={`especially-card-wrapper ${
                    isVisible
                      ? "especially-card-visible"
                      : index % 2 === 0
                        ? "especially-card-hidden-left"
                        : "especially-card-hidden-right"
                  }`}
                  style={{
                    transitionDelay: isVisible
                      ? `${index * 90}ms`
                      : "0ms",
                  }}
                >
                  <OfferCardItem card={card} />
                </div>
              ))}
            </div>
          </div>

          <div
            className={`especially-mobile-action ${
              isVisible
                ? "especially-mobile-action-visible"
                : ""
            }`}
          >
            <Link
              href="/offers"
              className="especially-view-all especially-view-all-mobile"
            >
              <span>View all offers</span>

              <ArrowIcon className="especially-view-all-icon" />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .especially-section {
          --especially-text-20: 20px;
          --especially-text-18: 18px;
          --especially-text-16: 16px;
          --especially-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 72px 0;
          background:
            radial-gradient(
              circle at 5% 15%,
              rgba(164, 235, 224, 0.18),
              transparent 28%
            ),
            radial-gradient(
              circle at 95% 90%,
              rgba(255, 211, 158, 0.17),
              transparent 28%
            ),
            #fbfdfd;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .especially-background-grid {
          position: absolute;
          inset: 0;
          z-index: -4;
          pointer-events: none;
          opacity: 0.34;
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
          background-size: 42px 42px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.7),
            transparent
          );
        }

        .especially-background-glow {
          position: absolute;
          z-index: -3;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          filter: blur(88px);
          opacity: 0.58;
          pointer-events: none;
          will-change: transform;
        }

        .especially-background-glow-left {
          top: 60px;
          left: -180px;
          background: rgba(108, 225, 204, 0.42);
          animation: especiallyGlowLeft 9s ease-in-out infinite;
        }

        .especially-background-glow-right {
          right: -180px;
          bottom: -80px;
          background: rgba(255, 203, 132, 0.4);
          animation: especiallyGlowRight 11s ease-in-out infinite;
        }

        .especially-container {
          position: relative;
          width: min(1440px, calc(100% - 64px));
          margin: 0 auto;
        }

        .especially-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 34px;
          opacity: 0;
          transform: translate3d(0, 28px, 0);
          transition:
            opacity 700ms ease,
            transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }

        .especially-header.especially-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .especially-heading-content {
          max-width: 760px;
        }

        .especially-eyebrow {
          margin: 0 0 10px;
          color: #087b75;
          font-size: var(--especially-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .especially-title {
          margin: 0;
          color: #111827;
          font-size: var(--especially-text-20);
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: -0.025em;
        }

        .especially-description {
          max-width: 680px;
          margin: 12px 0 0;
          color: #667085;
          font-size: var(--especially-text-16);
          line-height: 1.7;
        }

        .especially-view-all {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 999px;
          color: #087b75;
          font-size: var(--especially-text-13);
          font-weight: 750;
          line-height: 1;
          text-decoration: none;
          transition:
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
            color 300ms ease,
            border-color 300ms ease,
            background-color 300ms ease,
            box-shadow 300ms ease;
        }

        .especially-view-all-desktop {
          flex-shrink: 0;
          padding: 0 5px;
        }

        .especially-view-all:hover {
          color: #055f5a;
          transform: translateY(-2px);
        }

        .especially-view-all-icon {
          width: 16px;
          height: 16px;
          transition: transform 300ms ease;
        }

        .especially-view-all:hover .especially-view-all-icon {
          transform: translateX(4px);
        }

        .especially-card-area {
          margin: 0 -10px;
          padding: 0 10px;
        }

        .especially-card-list {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          align-items: stretch;
          gap: 10px;
          padding: 20px 0 32px;
        }

        .especially-card-wrapper {
          min-width: 0;
          height: 100%;
          transition:
            opacity 700ms ease,
            transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        .especially-card-hidden-left {
          opacity: 0;
          transform: translate3d(-44px, 30px, 0);
        }

        .especially-card-hidden-right {
          opacity: 0;
          transform: translate3d(44px, 30px, 0);
        }

        .especially-card-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .especially-card-link {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 28px;
          outline: none;
        }

        .especially-card-link:focus-visible {
          box-shadow:
            0 0 0 3px rgba(8, 123, 117, 0.3),
            0 0 0 7px #ffffff;
        }

        .especially-card-shell {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .especially-card-glow {
          position: absolute;
          inset: -8px;
          z-index: 0;
          border-radius: 34px;
          opacity: 0;
          filter: blur(22px);
          pointer-events: none;
          transition:
            opacity 500ms ease,
            transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .especially-card-shell:hover .especially-card-glow {
          opacity: 0.34;
          transform: scale(1.05);
        }

        .especially-card {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          height: 302px;
          flex-direction: column;
          overflow: hidden;
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.82);
          border-radius: 27px;
          box-shadow: 0 16px 38px -25px rgba(15, 23, 42, 0.42);
          transform: translateZ(0);
          transition:
            transform 480ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 480ms ease,
            border-color 480ms ease;
          will-change: transform;
          backface-visibility: hidden;
        }

        .especially-card-shell:hover .especially-card {
          z-index: 5;
          border-color: rgba(255, 255, 255, 0.98);
          transform: translate3d(0, -9px, 0) scale(1.025);
          box-shadow: 0 32px 65px -27px rgba(15, 23, 42, 0.5);
        }

        .especially-card-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.31),
            transparent 52%,
            rgba(0, 0, 0, 0.045)
          );
        }

        .especially-card-ring {
          position: absolute;
          top: -52px;
          right: -50px;
          width: 142px;
          height: 142px;
          border: 20px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          pointer-events: none;
          transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .especially-card-shell:hover .especially-card-ring {
          transform: translate3d(-12px, 12px, 0) rotate(12deg) scale(1.1);
        }

        .especially-card-circle {
          position: absolute;
          bottom: -85px;
          left: -70px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          pointer-events: none;
          transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .especially-card-shell:hover .especially-card-circle {
          transform: translate3d(24px, -18px, 0) scale(1.18);
        }

        .especially-card-shine {
          position: absolute;
          inset: 0 auto 0 -90%;
          z-index: 4;
          width: 46%;
          transform: rotate(18deg);
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.42),
            transparent
          );
          transition: left 750ms ease;
        }

        .especially-card-shell:hover .especially-card-shine {
          left: 135%;
        }

        .especially-card-top {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 22px;
        }

        .especially-card-eyebrow {
          display: inline-flex;
          min-height: 30px;
          align-items: center;
          padding: 6px 11px;
          border: 1px solid rgba(255, 255, 255, 0.72);
          border-radius: 999px;
          color: rgba(0, 0, 0, 0.66);
          background: rgba(255, 255, 255, 0.62);
          box-shadow: 0 7px 18px -13px rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(12px);
          font-size: var(--especially-text-13);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition:
            transform 400ms ease,
            background-color 400ms ease,
            box-shadow 400ms ease;
        }

        .especially-card-shell:hover .especially-card-eyebrow {
          background: rgba(255, 255, 255, 0.88);
          transform: translateY(-2px);
          box-shadow: 0 10px 22px -13px rgba(15, 23, 42, 0.5);
        }

        .especially-icon-box {
          position: relative;
          display: flex;
          width: 60px;
          height: 60px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 19px;
          box-shadow: 0 13px 26px -13px rgba(15, 23, 42, 0.46);
          transition:
            transform 480ms cubic-bezier(0.22, 1, 0.36, 1),
            border-radius 480ms ease,
            box-shadow 480ms ease;
        }

        .especially-card-shell:hover .especially-icon-box {
          border-radius: 22px;
          transform: rotate(-6deg) scale(1.09);
          box-shadow: 0 19px 34px -14px rgba(15, 23, 42, 0.52);
        }

        .especially-icon-overlay {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.34),
            transparent
          );
          transition: opacity 400ms ease;
        }

        .especially-card-shell:hover .especially-icon-overlay {
          opacity: 1;
        }

        .especially-card-icon {
          position: relative;
          z-index: 1;
          width: 33px;
          height: 33px;
          object-fit: contain;
          transition: transform 450ms ease;
        }

        .especially-card-shell:hover .especially-card-icon {
          transform: rotate(6deg) scale(1.08);
        }

        .especially-card-main {
          position: relative;
          z-index: 5;
          display: flex;
          min-height: 0;
          flex: 1;
          flex-direction: column;
        }

        .especially-card-title {
          max-width: 178px;
          margin: 0;
          color: #101828;
          font-size: var(--especially-text-20);
          font-weight: 850;
          line-height: 1.2;
          letter-spacing: -0.025em;
          transition: transform 400ms ease;
        }

        .especially-card-shell:hover .especially-card-title {
          transform: translateY(-2px);
        }

        .especially-card-support {
          min-height: 52px;
        }

        .especially-card-subtitle {
          margin: 8px 0 0;
          color: #344054;
          font-size: var(--especially-text-16);
          font-weight: 650;
          line-height: 1.4;
          transition: transform 400ms ease;
        }

        .especially-card-shell:hover .especially-card-subtitle {
          transform: translateY(-2px);
        }

        .especially-phone-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
          transition: transform 400ms ease;
        }

        .especially-card-shell:hover .especially-phone-row {
          transform: translateX(4px);
        }

        .especially-phone-icon {
          display: flex;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 7px 16px -11px rgba(15, 23, 42, 0.45);
          transition:
            transform 400ms ease,
            background-color 400ms ease;
        }

        .especially-card-shell:hover .especially-phone-icon {
          background: #ffffff;
          transform: scale(1.08);
        }

        .especially-phone-number {
          margin: 0;
          color: #1d2939;
          font-size: var(--especially-text-16);
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .especially-card-button {
          position: relative;
          z-index: 5;
          display: flex;
          width: 100%;
          min-height: 48px;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          overflow: hidden;
          margin-top: auto;
          padding: 0 14px;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.91);
          box-shadow: 0 9px 20px -14px rgba(15, 23, 42, 0.42);
          backdrop-filter: blur(12px);
          font-size: var(--especially-text-13);
          font-weight: 800;
          line-height: 1.2;
          transition:
            transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 420ms ease,
            box-shadow 420ms ease;
        }

        .especially-card-shell:hover .especially-card-button {
          background: #ffffff;
          transform: scale(1.015);
          box-shadow: 0 15px 29px -14px rgba(15, 23, 42, 0.46);
        }

        .especially-button-label {
          position: relative;
          z-index: 2;
          overflow: hidden;
          padding-right: 4px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .especially-button-icon {
          position: relative;
          z-index: 2;
          display: flex;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: transform 400ms ease;
        }

        .especially-card-shell:hover .especially-button-icon {
          transform: translateX(3px) scale(1.07);
        }

        .especially-mobile-action {
          display: none;
          margin-top: 4px;
          justify-content: center;
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity 650ms ease,
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .especially-mobile-action-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .especially-view-all-mobile {
          min-width: 180px;
          padding: 0 22px;
          border: 1px solid #cce8e5;
          background: #ffffff;
          box-shadow: 0 10px 22px -18px rgba(15, 23, 42, 0.5);
        }

        .especially-view-all-mobile:hover {
          border-color: #087b75;
          background: #f2fbfa;
          box-shadow: 0 14px 26px -17px rgba(8, 123, 117, 0.42);
        }

        @keyframes especiallyGlowLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(32px, -22px, 0) scale(1.08);
          }
        }

        @keyframes especiallyGlowRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-28px, -18px, 0) scale(1.06);
          }
        }

        @media (min-width: 1280px) and (max-width: 1499px) {
          .especially-container {
            width: min(1320px, calc(100% - 48px));
          }

          .especially-card {
            height: 300px;
            padding: 17px;
          }

          .especially-card-top {
            margin-bottom: 19px;
          }

          .especially-icon-box {
            width: 56px;
            height: 56px;
          }

          .especially-card-icon {
            width: 31px;
            height: 31px;
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .especially-section {
            padding: 64px 0;
          }

          .especially-container {
            width: min(980px, calc(100% - 48px));
          }

          .especially-card-list {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }

          .especially-card {
            height: 290px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .especially-section {
            padding: 58px 0;
          }

          .especially-container {
            width: min(760px, calc(100% - 40px));
          }

          .especially-header {
            align-items: center;
            margin-bottom: 28px;
          }

          .especially-card-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .especially-card {
            height: 286px;
          }
        }

        @media (max-width: 767px) {
          .especially-section {
            padding: 48px 0 54px;
          }

          .especially-container {
            width: 100%;
          }

          .especially-header {
            display: block;
            margin-bottom: 18px;
            padding: 0 16px;
            text-align: center;
          }

          .especially-heading-content {
            max-width: 620px;
            margin: 0 auto;
          }

          .especially-eyebrow {
            margin-bottom: 8px;
          }

          .especially-description {
            margin-top: 10px;
          }

          .especially-view-all-desktop {
            display: none;
          }

          .especially-card-area {
            margin: 0;
            padding: 0;
          }

          .especially-card-list {
            display: flex;
            grid-template-columns: none;
            align-items: stretch;
            gap: 10px;
            overflow-x: auto;
            overflow-y: visible;
            padding: 20px 16px 32px;
            scroll-padding-inline: 16px;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -ms-overflow-style: none;
            overscroll-behavior-inline: contain;
            -webkit-overflow-scrolling: touch;
          }

          .especially-card-list::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }

          .especially-card-wrapper {
            width: min(76vw, 270px);
            min-width: min(76vw, 270px);
            flex: 0 0 min(76vw, 270px);
            scroll-snap-align: start;
          }

          .especially-card {
            height: 286px;
            padding: 18px;
          }

          .especially-card-shell:hover .especially-card {
            transform: translate3d(0, -5px, 0) scale(1.012);
          }

          .especially-mobile-action {
            display: flex;
          }
        }

        @media (max-width: 479px) {
          .especially-section {
            padding: 44px 0 50px;
          }

          .especially-header {
            padding: 0 14px;
          }

          .especially-card-list {
            padding-right: 14px;
            padding-left: 14px;
            scroll-padding-inline: 14px;
          }

          .especially-card-wrapper {
            width: min(82vw, 268px);
            min-width: min(82vw, 268px);
            flex-basis: min(82vw, 268px);
          }

          .especially-card {
            height: 282px;
            padding: 17px;
            border-radius: 25px;
          }

          .especially-card-top {
            margin-bottom: 20px;
          }

          .especially-icon-box {
            width: 56px;
            height: 56px;
          }

          .especially-card-icon {
            width: 31px;
            height: 31px;
          }

          .especially-card-title {
            max-width: 170px;
          }

          .especially-card-button {
            min-height: 46px;
            padding: 0 13px;
          }
        }

        @media (max-width: 359px) {
          .especially-card-wrapper {
            width: calc(100vw - 38px);
            min-width: calc(100vw - 38px);
            flex-basis: calc(100vw - 38px);
          }

          .especially-card {
            padding: 15px;
          }

          .especially-card-eyebrow {
            padding-right: 9px;
            padding-left: 9px;
            letter-spacing: 0.05em;
          }
        }

        @media (hover: none) {
          .especially-card-shell:hover .especially-card,
          .especially-card-shell:hover .especially-card-glow,
          .especially-card-shell:hover .especially-card-ring,
          .especially-card-shell:hover .especially-card-circle,
          .especially-card-shell:hover .especially-card-title,
          .especially-card-shell:hover .especially-card-subtitle,
          .especially-card-shell:hover .especially-phone-row,
          .especially-card-shell:hover .especially-icon-box,
          .especially-card-shell:hover .especially-card-icon,
          .especially-card-shell:hover .especially-card-button,
          .especially-card-shell:hover .especially-button-icon {
            transform: none;
          }

          .especially-card-shell:hover .especially-card-glow {
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .especially-section *,
          .especially-section *::before,
          .especially-section *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .especially-header,
          .especially-card-wrapper,
          .especially-mobile-action {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}

function OfferCardItem({ card }: { card: OfferCard }) {
  const cardContent = (
    <div className="especially-card-shell">
      <div
        aria-hidden="true"
        className="especially-card-glow"
        style={{
          backgroundColor: card.iconBackground,
        }}
      />

      <article
        className="especially-card"
        style={{
          background: card.background,
        }}
      >
        <div
          aria-hidden="true"
          className="especially-card-overlay"
        />

        <div
          aria-hidden="true"
          className="especially-card-ring"
        />

        <div
          aria-hidden="true"
          className="especially-card-circle"
        />

        <div
          aria-hidden="true"
          className="especially-card-shine"
        />

        <div className="especially-card-top">
          <span className="especially-card-eyebrow">
            {card.eyebrow}
          </span>

          <span
            className="especially-icon-box"
            style={{
              backgroundColor: card.iconBackground,
            }}
          >
            <span
              aria-hidden="true"
              className="especially-icon-overlay"
            />

            <img
              src={card.iconUrl}
              alt={card.iconAlt}
              width={34}
              height={34}
              loading="lazy"
              draggable={false}
              className="especially-card-icon"
            />
          </span>
        </div>

        <div className="especially-card-main">
          <h3 className="especially-card-title">
            {card.title}
          </h3>

          <div className="especially-card-support">
            {card.subtitle && (
              <p className="especially-card-subtitle">
                {card.subtitle}
              </p>
            )}

            {card.phone && (
              <div className="especially-phone-row">
                <span
                  className="especially-phone-icon"
                  style={{
                    color: card.accent,
                  }}
                >
                  <PhoneIcon className="h-4 w-4" />
                </span>

                <p className="especially-phone-number">
                  {card.phone}
                </p>
              </div>
            )}
          </div>
        </div>

        <span
          className="especially-card-button"
          style={{
            color: card.buttonColor,
          }}
        >
          <span className="especially-button-label">
            {card.buttonText}
          </span>

          <span
            className="especially-button-icon"
            style={{
              backgroundColor: `${card.buttonColor}18`,
            }}
          >
            <ArrowIcon className="h-4 w-4" />
          </span>
        </span>
      </article>
    </div>
  );

  const linkClassName = "especially-card-link";

  if (card.external) {
    return (
      <a
        href={card.href}
        target={card.href.startsWith("http") ? "_blank" : undefined}
        rel={
          card.href.startsWith("http")
            ? "noopener noreferrer"
            : undefined
        }
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

function ArrowIcon({
  className = "",
}: {
  className?: string;
}) {
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

function PhoneIcon({
  className = "",
}: {
  className?: string;
}) {
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