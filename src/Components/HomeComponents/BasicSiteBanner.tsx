"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Feature = {
  value: string;
  label: string;
};

type DashboardCardProps = {
  title: string;
  value: string;
  increase: string;
  icon: "users" | "revenue";
};

const features: Feature[] = [
  {
    value: "10K+",
    label: "Happy customers",
  },
  {
    value: "99.9%",
    label: "Reliable service",
  },
  {
    value: "24/7",
    label: "Customer support",
  },
];

const chartValues = [42, 58, 49, 73, 65, 88, 78, 96];

export default function BasicSiteBanner() {
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
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="basic-banner-section"
        aria-labelledby="basic-banner-title"
      >
        <div
          aria-hidden="true"
          className="basic-banner-grid-pattern"
        />

        <div
          aria-hidden="true"
          className="basic-banner-pattern basic-banner-pattern-one"
        />

        <div
          aria-hidden="true"
          className="basic-banner-pattern basic-banner-pattern-two"
        />

        <div
          aria-hidden="true"
          className="basic-banner-glow basic-banner-glow-left"
        />

        <div
          aria-hidden="true"
          className="basic-banner-glow basic-banner-glow-right"
        />

        <div
          className={`basic-banner-container ${
            isVisible ? "is-visible" : ""
          }`}
        >
          <div className="basic-banner-content">
            <div className="basic-banner-badge">
              <span className="basic-banner-badge-icon">
                <SparkleIcon />
              </span>

              <span>Everything you need in one place</span>
            </div>

            <h1
              id="basic-banner-title"
              className="basic-banner-title"
            >
              Build a better digital
              <span> experience for everyone.</span>
            </h1>

            <p className="basic-banner-description">
              A flexible, modern platform designed to help customers discover
              your services, connect with your business and take action with
              confidence.
            </p>

            <div className="basic-banner-actions">
              <Link
                href="/get-started"
                className="basic-banner-primary-button"
              >
                <span>Get Started</span>

                <span className="basic-button-arrow">
                  <ArrowIcon />
                </span>
              </Link>

              <Link
                href="/about"
                className="basic-banner-secondary-button"
              >
                <PlayIcon />
                <span>Learn More</span>
              </Link>
            </div>

            <div className="basic-banner-trust">
              <div
                className="basic-trust-avatars"
                aria-label="Trusted customer avatars"
              >
                <span>JM</span>
                <span>AR</span>
                <span>SH</span>
                <span>+</span>
              </div>

              <div className="basic-trust-content">
                <div
                  className="basic-trust-stars"
                  aria-label="5 out of 5 stars"
                >
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                </div>

                <p>Trusted by growing businesses worldwide</p>
              </div>
            </div>

            <div className="basic-banner-features">
              {features.map((feature, index) => (
                <div
                  key={feature.label}
                  className="basic-banner-feature"
                  style={{
                    transitionDelay: isVisible
                      ? `${450 + index * 110}ms`
                      : "0ms",
                  }}
                >
                  <strong>{feature.value}</strong>
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="basic-banner-visual">
            <div
              aria-hidden="true"
              className="basic-visual-orbit basic-visual-orbit-one"
            />

            <div
              aria-hidden="true"
              className="basic-visual-orbit basic-visual-orbit-two"
            />

            <div className="basic-banner-dashboard">
              <div
                aria-hidden="true"
                className="basic-dashboard-shine"
              />

              <div className="basic-dashboard-header">
                <div
                  className="basic-dashboard-dots"
                  aria-hidden="true"
                >
                  <span />
                  <span />
                  <span />
                </div>

                <div className="basic-dashboard-address">
                  <LockIcon />
                  <span>dashboard.example.com</span>
                </div>

                <div
                  className="basic-dashboard-header-action"
                  aria-hidden="true"
                >
                  <span />
                </div>
              </div>

              <div className="basic-dashboard-body">
                <aside className="basic-dashboard-sidebar">
                  <div className="basic-dashboard-logo">
                    <LogoMarkIcon />
                  </div>

                  <nav aria-label="Dashboard preview navigation">
                    <span className="active">
                      <HomeIcon />
                    </span>

                    <span>
                      <ChartIcon />
                    </span>

                    <span>
                      <UsersIcon />
                    </span>

                    <span>
                      <FolderIcon />
                    </span>

                    <span>
                      <SettingsIcon />
                    </span>
                  </nav>

                  <div className="basic-sidebar-bottom">
                    <span>
                      <HelpIcon />
                    </span>
                  </div>
                </aside>

                <div className="basic-dashboard-main">
                  <div className="basic-dashboard-welcome">
                    <div>
                      <span>Welcome back, Alex</span>
                      <strong>Your business overview</strong>
                    </div>

                    <div className="basic-dashboard-avatar">
                      <PersonIcon />
                      <span className="basic-avatar-status" />
                    </div>
                  </div>

                  <div className="basic-dashboard-cards">
                    <DashboardCard
                      title="Total customers"
                      value="10,240"
                      increase="+18.4%"
                      icon="users"
                    />

                    <DashboardCard
                      title="Total revenue"
                      value="$48,620"
                      increase="+12.8%"
                      icon="revenue"
                    />
                  </div>

                  <div className="basic-dashboard-chart">
                    <div className="basic-chart-header">
                      <div>
                        <span>Performance</span>
                        <strong>Monthly growth</strong>
                      </div>

                      <button
                        type="button"
                        className="basic-chart-period"
                        aria-label="Selected chart period: Last 30 days"
                      >
                        Last 30 days
                        <ChevronDownIcon />
                      </button>
                    </div>

                    <div className="basic-chart-area">
                      <div
                        className="basic-chart-guides"
                        aria-hidden="true"
                      >
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>

                      <div className="basic-chart-bars">
                        {chartValues.map((height, index) => (
                          <span
                            key={`${height}-${index}`}
                            className="basic-chart-bar"
                            style={{
                              height: `${height}%`,
                              animationDelay: `${800 + index * 75}ms`,
                            }}
                          >
                            <i />
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className="basic-chart-labels"
                      aria-hidden="true"
                    >
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                      <span>Now</span>
                    </div>
                  </div>

                  <div className="basic-dashboard-progress">
                    <div>
                      <span>Monthly target</span>
                      <strong>82%</strong>
                    </div>

                    <div className="basic-progress-track">
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="basic-floating-card basic-floating-card-top">
              <span className="basic-floating-icon">
                <CheckIcon />
              </span>

              <div>
                <strong>Project completed</strong>
                <span>Your website is ready</span>
              </div>
            </div>

            <div className="basic-floating-card basic-floating-card-bottom">
              <div className="basic-user-stack">
                <span>JM</span>
                <span>AR</span>
                <span>SH</span>
              </div>

              <div>
                <strong>1,250 new users</strong>
                <span>Joined this month</span>
              </div>
            </div>

            <div className="basic-floating-notification">
              <span>
                <BellIcon />
              </span>

              <i />
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .basic-banner-section {
          --banner-primary: #087b75;
          --banner-primary-dark: #055f5a;
          --banner-heading: #101828;
          --banner-text: #5f6c7b;

          --text-large: 20px;
          --text-medium: 18px;
          --text-normal: 16px;
          --text-small: 13px;

          position: relative;
          isolation: isolate;
          display: flex;
          width: 100%;
          min-height: 680px;
          align-items: center;
          overflow: hidden;
          padding: clamp(64px, 7vw, 94px) 0;
          background:
            radial-gradient(
              circle at 10% 20%,
              rgba(116, 220, 201, 0.15),
              transparent 31%
            ),
            radial-gradient(
              circle at 93% 80%,
              rgba(250, 192, 113, 0.13),
              transparent 30%
            ),
            linear-gradient(145deg, #f9fffe 0%, #ffffff 49%, #f7fbff 100%);
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .basic-banner-grid-pattern {
          position: absolute;
          inset: 0;
          z-index: -5;
          pointer-events: none;
          opacity: 0.5;
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
            rgba(0, 0, 0, 0.9),
            transparent 92%
          );
        }

        .basic-banner-pattern,
        .basic-banner-glow {
          position: absolute;
          z-index: -3;
          pointer-events: none;
        }

        .basic-banner-pattern {
          border: 1px solid rgba(8, 123, 117, 0.1);
          border-radius: 50%;
        }

        .basic-banner-pattern::before,
        .basic-banner-pattern::after {
          content: "";
          position: absolute;
          border: inherit;
          border-radius: inherit;
        }

        .basic-banner-pattern::before {
          inset: 22px;
        }

        .basic-banner-pattern::after {
          inset: 48px;
        }

        .basic-banner-pattern-one {
          top: -170px;
          left: -120px;
          width: 360px;
          height: 360px;
          animation: basicPatternRotate 22s linear infinite;
        }

        .basic-banner-pattern-two {
          right: -210px;
          bottom: -250px;
          width: 440px;
          height: 440px;
          border-color: rgba(241, 163, 77, 0.12);
          animation: basicPatternRotate 28s linear infinite reverse;
        }

        .basic-banner-glow {
          width: 360px;
          height: 360px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.48;
        }

        .basic-banner-glow-left {
          top: 22%;
          left: -190px;
          background: rgba(54, 198, 174, 0.22);
          animation: basicGlowFloat 8s ease-in-out infinite;
        }

        .basic-banner-glow-right {
          right: -170px;
          bottom: -80px;
          background: rgba(255, 182, 102, 0.19);
          animation: basicGlowFloat 10s ease-in-out infinite reverse;
        }

        .basic-banner-container {
          display: grid;
          width: min(1440px, calc(100% - 48px));
          margin: 0 auto;
          grid-template-columns: minmax(0, 0.92fr) minmax(520px, 1.08fr);
          align-items: center;
          gap: clamp(48px, 6vw, 94px);
        }

        .basic-banner-content {
          position: relative;
          z-index: 5;
          max-width: 660px;
          opacity: 0;
          transform: translate3d(-40px, 22px, 0);
          transition:
            opacity 750ms ease,
            transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        .basic-banner-container.is-visible .basic-banner-content {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .basic-banner-badge {
          display: inline-flex;
          width: fit-content;
          min-height: 40px;
          align-items: center;
          gap: 9px;
          padding: 7px 14px 7px 8px;
          border: 1px solid rgba(8, 123, 117, 0.14);
          border-radius: 999px;
          color: var(--banner-primary-dark);
          background: rgba(255, 255, 255, 0.84);
          box-shadow: 0 10px 30px -20px rgba(8, 123, 117, 0.6);
          backdrop-filter: blur(12px);
          font-size: var(--text-small);
          font-weight: 700;
          line-height: 1.4;
          letter-spacing: 0.02em;
        }

        .basic-banner-badge-icon {
          display: inline-flex;
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffffff;
          background: linear-gradient(135deg, #0d9488, #087b75);
          box-shadow: 0 6px 14px -6px rgba(8, 123, 117, 0.9);
        }

        .basic-banner-title {
          max-width: 640px;
          margin: 24px 0 0;
          color: var(--banner-heading);
          font-size: var(--text-large);
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .basic-banner-title span {
          color: transparent;
          background: linear-gradient(
            115deg,
            #087b75 6%,
            #12a594 53%,
            #087b75 96%
          );
          background-clip: text;
          -webkit-background-clip: text;
        }

        .basic-banner-description {
          max-width: 590px;
          margin: 20px 0 0;
          color: var(--banner-text);
          font-size: var(--text-normal);
          line-height: 1.75;
          letter-spacing: -0.005em;
        }

        .basic-banner-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 30px;
        }

        .basic-banner-primary-button,
        .basic-banner-secondary-button {
          display: inline-flex;
          min-height: 52px;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          text-decoration: none;
          font-size: var(--text-normal);
          font-weight: 700;
          line-height: 1;
          transition:
            transform 350ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 350ms ease,
            border-color 350ms ease,
            background-color 350ms ease,
            color 350ms ease;
          will-change: transform;
          backface-visibility: hidden;
        }

        .basic-banner-primary-button {
          gap: 16px;
          padding: 6px 7px 6px 23px;
          color: #ffffff;
          background: linear-gradient(
            135deg,
            #0d9488 0%,
            #087b75 58%,
            #05645f 100%
          );
          box-shadow:
            0 18px 36px -18px rgba(8, 123, 117, 0.8),
            inset 0 1px rgba(255, 255, 255, 0.2);
        }

        .basic-button-arrow {
          display: inline-flex;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          color: var(--banner-primary-dark);
          background: rgba(255, 255, 255, 0.96);
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .basic-banner-primary-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 24px 45px -18px rgba(8, 123, 117, 0.85),
            inset 0 1px rgba(255, 255, 255, 0.25);
        }

        .basic-banner-primary-button:hover .basic-button-arrow {
          transform: translateX(3px);
        }

        .basic-banner-secondary-button {
          gap: 10px;
          padding: 0 22px;
          border: 1px solid rgba(16, 24, 40, 0.1);
          color: #344054;
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 14px 30px -24px rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
        }

        .basic-banner-secondary-button:hover {
          transform: translateY(-3px);
          border-color: rgba(8, 123, 117, 0.25);
          color: var(--banner-primary);
          background: #ffffff;
          box-shadow: 0 18px 34px -22px rgba(8, 123, 117, 0.45);
        }

        .basic-banner-primary-button:focus-visible,
        .basic-banner-secondary-button:focus-visible {
          outline: 3px solid rgba(8, 123, 117, 0.24);
          outline-offset: 4px;
        }

        .basic-banner-trust {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 28px;
        }

        .basic-trust-avatars {
          display: flex;
          align-items: center;
          padding-left: 7px;
        }

        .basic-trust-avatars span {
          display: inline-flex;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          margin-left: -7px;
          border: 3px solid #ffffff;
          border-radius: 50%;
          color: #ffffff;
          background: linear-gradient(135deg, #0d9488, #116b68);
          box-shadow: 0 7px 15px -8px rgba(15, 23, 42, 0.7);
          font-size: var(--text-small);
          font-weight: 800;
        }

        .basic-trust-avatars span:nth-child(2) {
          background: linear-gradient(135deg, #805ad5, #6240aa);
        }

        .basic-trust-avatars span:nth-child(3) {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .basic-trust-avatars span:last-child {
          color: var(--banner-primary);
          background: #ebfaf7;
        }

        .basic-trust-content {
          min-width: 0;
        }

        .basic-trust-stars {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #f6a51c;
        }

        .basic-trust-content p {
          margin: 4px 0 0;
          color: #667085;
          font-size: var(--text-small);
          font-weight: 600;
          line-height: 1.5;
        }

        .basic-banner-features {
          display: grid;
          max-width: 570px;
          margin-top: 34px;
          padding-top: 25px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-top: 1px solid rgba(8, 123, 117, 0.11);
        }

        .basic-banner-feature {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 22px;
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity 600ms ease,
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }

        .basic-banner-container.is-visible .basic-banner-feature {
          opacity: 1;
          transform: translateY(0);
        }

        .basic-banner-feature:first-child {
          padding-left: 0;
        }

        .basic-banner-feature:last-child {
          padding-right: 0;
        }

        .basic-banner-feature:not(:last-child)::after {
          content: "";
          position: absolute;
          top: 3px;
          right: 0;
          width: 1px;
          height: 42px;
          background: rgba(8, 123, 117, 0.12);
        }

        .basic-banner-feature strong {
          color: #101828;
          font-size: var(--text-large);
          line-height: 1.15;
          letter-spacing: -0.03em;
        }

        .basic-banner-feature span {
          color: #778292;
          font-size: var(--text-small);
          font-weight: 600;
          line-height: 1.5;
        }

        .basic-banner-visual {
          position: relative;
          z-index: 4;
          width: 100%;
          min-width: 0;
          padding: 36px 20px 38px;
          opacity: 0;
          transform: translate3d(50px, 24px, 0) scale(0.97);
          transition:
            opacity 850ms ease 100ms,
            transform 1000ms cubic-bezier(0.22, 1, 0.36, 1) 100ms;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        .basic-banner-container.is-visible .basic-banner-visual {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }

        .basic-visual-orbit {
          position: absolute;
          z-index: -2;
          border: 1px dashed rgba(8, 123, 117, 0.18);
          border-radius: 50%;
          pointer-events: none;
        }

        .basic-visual-orbit-one {
          top: -28px;
          right: 0;
          width: 520px;
          height: 520px;
          animation: basicPatternRotate 34s linear infinite;
        }

        .basic-visual-orbit-two {
          top: 38px;
          right: 65px;
          width: 390px;
          height: 390px;
          border-style: solid;
          border-color: rgba(8, 123, 117, 0.08);
          animation: basicPatternRotate 25s linear infinite reverse;
        }

        .basic-banner-dashboard {
          position: relative;
          width: 100%;
          min-height: 500px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.95);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow:
            0 46px 95px -46px rgba(15, 64, 61, 0.5),
            0 20px 45px -32px rgba(15, 23, 42, 0.28),
            inset 0 0 0 1px rgba(8, 123, 117, 0.06);
          backdrop-filter: blur(22px);
          transform: translateZ(0);
          transition:
            transform 500ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 500ms ease;
          will-change: transform;
        }

        .basic-banner-visual:hover .basic-banner-dashboard {
          transform: translate3d(0, -7px, 0);
          box-shadow:
            0 58px 110px -48px rgba(15, 64, 61, 0.56),
            0 24px 55px -32px rgba(15, 23, 42, 0.32),
            inset 0 0 0 1px rgba(8, 123, 117, 0.08);
        }

        .basic-dashboard-shine {
          position: absolute;
          inset: 0 auto 0 -70%;
          z-index: 20;
          width: 38%;
          pointer-events: none;
          transform: skewX(-18deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.34),
            transparent
          );
          transition: left 900ms ease;
        }

        .basic-banner-visual:hover .basic-dashboard-shine {
          left: 140%;
        }

        .basic-dashboard-header {
          display: grid;
          height: 54px;
          grid-template-columns: 90px 1fr 90px;
          align-items: center;
          padding: 0 18px;
          border-bottom: 1px solid rgba(16, 24, 40, 0.075);
          background: rgba(248, 251, 251, 0.9);
        }

        .basic-dashboard-dots {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .basic-dashboard-dots span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #ff7567;
        }

        .basic-dashboard-dots span:nth-child(2) {
          background: #ffc14d;
        }

        .basic-dashboard-dots span:nth-child(3) {
          background: #54c978;
        }

        .basic-dashboard-address {
          display: flex;
          width: min(270px, 100%);
          height: 30px;
          align-items: center;
          justify-content: center;
          justify-self: center;
          gap: 7px;
          overflow: hidden;
          border: 1px solid rgba(16, 24, 40, 0.06);
          border-radius: 8px;
          color: #8b96a5;
          background: #ffffff;
          font-size: var(--text-small);
          font-weight: 600;
        }

        .basic-dashboard-address span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .basic-dashboard-header-action {
          justify-self: end;
        }

        .basic-dashboard-header-action span {
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 6px;
          background:
            linear-gradient(#98a2b3, #98a2b3) center 6px / 10px 1px
              no-repeat,
            linear-gradient(#98a2b3, #98a2b3) center 10px / 10px 1px
              no-repeat,
            linear-gradient(#98a2b3, #98a2b3) center 14px / 10px 1px
              no-repeat;
        }

        .basic-dashboard-body {
          display: grid;
          min-height: 446px;
          grid-template-columns: 68px minmax(0, 1fr);
        }

        .basic-dashboard-sidebar {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 17px 10px 15px;
          border-right: 1px solid rgba(16, 24, 40, 0.07);
          background: rgba(248, 251, 251, 0.76);
        }

        .basic-dashboard-logo {
          display: flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border-radius: 12px;
          color: #ffffff;
          background: linear-gradient(135deg, #0f9f92, #087b75);
          box-shadow: 0 10px 22px -10px rgba(8, 123, 117, 0.78);
        }

        .basic-dashboard-sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .basic-dashboard-sidebar nav span,
        .basic-sidebar-bottom span {
          display: flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          color: #98a2b3;
          transition:
            transform 250ms ease,
            color 250ms ease,
            background-color 250ms ease;
        }

        .basic-dashboard-sidebar nav span.active {
          color: var(--banner-primary);
          background: #e4f7f3;
        }

        .basic-dashboard-sidebar nav span:hover {
          transform: translateX(2px);
          color: var(--banner-primary);
          background: rgba(228, 247, 243, 0.7);
        }

        .basic-sidebar-bottom {
          margin-top: auto;
        }

        .basic-dashboard-main {
          min-width: 0;
          padding: 22px;
          background: linear-gradient(
            135deg,
            rgba(248, 252, 251, 0.65),
            rgba(255, 255, 255, 0.92)
          );
        }

        .basic-dashboard-welcome {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .basic-dashboard-welcome > div:first-child {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .basic-dashboard-welcome span {
          color: #8a94a3;
          font-size: var(--text-small);
          font-weight: 600;
        }

        .basic-dashboard-welcome strong {
          overflow: hidden;
          color: #1d2939;
          font-size: var(--text-medium);
          line-height: 1.35;
          letter-spacing: -0.02em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .basic-dashboard-avatar {
          position: relative;
          display: flex;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 3px solid #ffffff;
          border-radius: 14px;
          color: var(--banner-primary);
          background: linear-gradient(145deg, #e1f8f4, #f7fffd);
          box-shadow: 0 10px 20px -12px rgba(8, 123, 117, 0.5);
        }

        .basic-avatar-status {
          position: absolute;
          right: -2px;
          bottom: -2px;
          width: 10px;
          height: 10px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          background: #35c66f;
        }

        .basic-dashboard-cards {
          display: grid;
          margin-top: 20px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .basic-dashboard-stat-card {
          position: relative;
          min-width: 0;
          overflow: hidden;
          padding: 15px;
          border: 1px solid rgba(8, 123, 117, 0.085);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.88);
          box-shadow: 0 16px 30px -26px rgba(15, 23, 42, 0.45);
          transition:
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 320ms ease,
            border-color 320ms ease;
          will-change: transform;
        }

        .basic-dashboard-stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(8, 123, 117, 0.2);
          box-shadow: 0 20px 34px -24px rgba(8, 123, 117, 0.36);
        }

        .basic-dashboard-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .basic-dashboard-stat-top > span:first-child {
          overflow: hidden;
          color: #7d8998;
          font-size: var(--text-small);
          font-weight: 650;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .basic-stat-icon {
          display: inline-flex;
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: var(--banner-primary);
          background: #e8f9f6;
        }

        .basic-dashboard-stat-card > div:last-child {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 8px;
          margin-top: 14px;
        }

        .basic-dashboard-stat-card strong {
          overflow: hidden;
          color: #1d2939;
          font-size: var(--text-medium);
          line-height: 1.2;
          letter-spacing: -0.03em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .basic-dashboard-stat-card small {
          flex-shrink: 0;
          padding: 4px 6px;
          border-radius: 6px;
          color: #198754;
          background: #e9f9ef;
          font-size: var(--text-small);
          font-weight: 800;
        }

        .basic-dashboard-chart {
          margin-top: 14px;
          padding: 16px;
          border: 1px solid rgba(8, 123, 117, 0.085);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 18px 34px -28px rgba(15, 23, 42, 0.42);
        }

        .basic-chart-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .basic-chart-header > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .basic-chart-header span {
          color: #8994a3;
          font-size: var(--text-small);
          font-weight: 650;
        }

        .basic-chart-header strong {
          color: #253142;
          font-size: var(--text-small);
          line-height: 1.4;
          letter-spacing: -0.01em;
        }

        .basic-chart-period {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 8px;
          border: 1px solid rgba(16, 24, 40, 0.07);
          border-radius: 7px;
          color: #667085;
          background: #f9fbfb;
          font-family: inherit;
          font-size: var(--text-small);
          font-weight: 650;
          cursor: default;
        }

        .basic-chart-area {
          position: relative;
          height: 112px;
          margin-top: 18px;
        }

        .basic-chart-guides {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          pointer-events: none;
        }

        .basic-chart-guides span {
          width: 100%;
          border-top: 1px dashed rgba(16, 24, 40, 0.07);
        }

        .basic-chart-bars {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          gap: 8px;
          padding: 0 6px;
        }

        .basic-chart-bar {
          position: relative;
          width: min(24px, 9%);
          min-height: 8px;
          overflow: hidden;
          border-radius: 7px 7px 3px 3px;
          background: linear-gradient(
            to top,
            #087b75 0%,
            #12a594 58%,
            #71d6c7 100%
          );
          box-shadow: 0 9px 14px -10px rgba(8, 123, 117, 0.72);
          transform: scaleY(0);
          transform-origin: bottom;
        }

        .basic-banner-container.is-visible .basic-chart-bar {
          animation: basicBarGrow 750ms cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .basic-chart-bar i {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
        }

        .basic-chart-labels {
          display: flex;
          justify-content: space-around;
          gap: 8px;
          margin-top: 8px;
          padding: 0 5px;
        }

        .basic-chart-labels span {
          width: min(24px, 9%);
          color: #a1aab6;
          font-size: var(--text-small);
          text-align: center;
        }

        .basic-dashboard-progress {
          margin-top: 14px;
          padding: 13px 15px;
          border: 1px solid rgba(8, 123, 117, 0.08);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.82);
        }

        .basic-dashboard-progress > div:first-child {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .basic-dashboard-progress span {
          color: #7b8796;
          font-size: var(--text-small);
          font-weight: 650;
        }

        .basic-dashboard-progress strong {
          color: var(--banner-primary);
          font-size: var(--text-small);
        }

        .basic-progress-track {
          height: 6px;
          overflow: hidden;
          margin-top: 9px;
          border-radius: 999px;
          background: #e8eeee;
        }

        .basic-progress-track span {
          display: block;
          width: 82%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #087b75, #3bc6b3);
          transform: scaleX(0);
          transform-origin: left;
        }

        .basic-banner-container.is-visible .basic-progress-track span {
          animation: basicProgressGrow 900ms ease 1.2s forwards;
        }

        .basic-floating-card {
          position: absolute;
          z-index: 30;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          border: 1px solid rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 22px 45px -24px rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(16px);
          will-change: transform;
          backface-visibility: hidden;
        }

        .basic-floating-card-top {
          top: 4px;
          right: -12px;
          animation: basicFloatingTop 5.4s ease-in-out infinite;
        }

        .basic-floating-card-bottom {
          bottom: 2px;
          left: -18px;
          animation: basicFloatingBottom 6.2s ease-in-out infinite;
        }

        .basic-floating-icon {
          display: flex;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #ffffff;
          background: linear-gradient(135deg, #13b981, #087b75);
          box-shadow: 0 10px 20px -10px rgba(8, 123, 117, 0.8);
        }

        .basic-floating-card > div:last-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .basic-floating-card strong {
          color: #253142;
          font-size: var(--text-normal);
          line-height: 1.3;
          white-space: nowrap;
        }

        .basic-floating-card > div:last-child > span {
          color: #8a94a3;
          font-size: var(--text-small);
          line-height: 1.4;
          white-space: nowrap;
        }

        .basic-user-stack {
          display: flex !important;
          flex-direction: row !important;
          align-items: center;
          gap: 0 !important;
          padding-left: 6px;
        }

        .basic-user-stack span {
          display: flex;
          width: 30px;
          height: 30px;
          align-items: center;
          justify-content: center;
          margin-left: -6px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          color: #ffffff;
          background: linear-gradient(135deg, #0d9488, #05645f);
          font-size: var(--text-small);
          font-weight: 800;
        }

        .basic-user-stack span:nth-child(2) {
          background: linear-gradient(135deg, #805ad5, #553c9a);
        }

        .basic-user-stack span:nth-child(3) {
          background: linear-gradient(135deg, #f59e0b, #c76e09);
        }

        .basic-floating-notification {
          position: absolute;
          top: 31%;
          right: -5px;
          z-index: 29;
          display: flex;
          width: 46px;
          height: 46px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          color: #7d4cd1;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 18px 34px -22px rgba(65, 45, 110, 0.5);
          backdrop-filter: blur(12px);
          animation: basicNotificationFloat 4.6s ease-in-out infinite;
        }

        .basic-floating-notification i {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          background: #f04438;
        }

        @keyframes basicPatternRotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes basicGlowFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(28px, -22px, 0) scale(1.08);
          }
        }

        @keyframes basicFloatingTop {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-4px, -10px, 0);
          }
        }

        @keyframes basicFloatingBottom {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(5px, -9px, 0);
          }
        }

        @keyframes basicNotificationFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-8px) rotate(4deg);
          }
        }

        @keyframes basicBarGrow {
          from {
            transform: scaleY(0);
          }

          to {
            transform: scaleY(1);
          }
        }

        @keyframes basicProgressGrow {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        @media (min-width: 1440px) {
          .basic-banner-container {
            width: min(1440px, calc(100% - 80px));
            grid-template-columns: minmax(0, 0.94fr) minmax(560px, 1.06fr);
          }
        }

        @media (min-width: 1024px) and (max-width: 1439px) {
          .basic-banner-section {
            min-height: 640px;
            padding: 72px 0;
          }

          .basic-banner-container {
            width: min(1180px, calc(100% - 48px));
            grid-template-columns: minmax(0, 0.92fr) minmax(470px, 1.08fr);
            gap: 42px;
          }

          .basic-dashboard-main {
            padding: 18px;
          }

          .basic-floating-card-top {
            right: 0;
          }

          .basic-floating-card-bottom {
            left: 0;
          }

          .basic-floating-notification {
            right: 4px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .basic-banner-section {
            min-height: auto;
            padding: 64px 0 72px;
          }

          .basic-banner-container {
            width: min(760px, calc(100% - 40px));
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .basic-banner-content {
            max-width: 700px;
            margin: 0 auto;
            text-align: center;
          }

          .basic-banner-badge,
          .basic-banner-actions,
          .basic-banner-trust,
          .basic-banner-description,
          .basic-banner-features {
            margin-right: auto;
            margin-left: auto;
          }

          .basic-banner-actions {
            justify-content: center;
          }

          .basic-banner-visual {
            max-width: 720px;
            margin: 0 auto;
            padding-right: 12px;
            padding-left: 12px;
          }

          .basic-visual-orbit-one,
          .basic-visual-orbit-two {
            right: 50%;
            transform: translateX(50%);
          }
        }

        @media (min-width: 480px) and (max-width: 767px) {
          .basic-banner-section {
            min-height: auto;
            padding: 52px 0 62px;
          }

          .basic-banner-container {
            width: min(100% - 32px, 620px);
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .basic-banner-content {
            text-align: center;
          }

          .basic-banner-badge,
          .basic-banner-description,
          .basic-banner-trust,
          .basic-banner-features {
            margin-right: auto;
            margin-left: auto;
          }

          .basic-banner-actions {
            display: grid;
            width: 100%;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            margin-top: 26px;
          }

          .basic-banner-primary-button,
          .basic-banner-secondary-button {
            width: 100%;
          }

          .basic-banner-primary-button {
            justify-content: space-between;
          }

          .basic-banner-feature {
            padding: 0 10px;
          }

          .basic-banner-feature strong {
            font-size: var(--text-medium);
          }

          .basic-banner-visual {
            padding: 18px 0 30px;
          }

          .basic-banner-dashboard {
            min-height: 430px;
            border-radius: 20px;
          }

          .basic-dashboard-header {
            grid-template-columns: 62px 1fr 40px;
            padding: 0 12px;
          }

          .basic-dashboard-address {
            max-width: 180px;
          }

          .basic-dashboard-body {
            min-height: 376px;
            grid-template-columns: 48px minmax(0, 1fr);
          }

          .basic-dashboard-sidebar {
            padding: 14px 5px 12px;
          }

          .basic-dashboard-logo {
            width: 32px;
            height: 32px;
            margin-bottom: 18px;
            border-radius: 10px;
          }

          .basic-dashboard-sidebar nav {
            gap: 8px;
          }

          .basic-dashboard-sidebar nav span,
          .basic-sidebar-bottom span {
            width: 32px;
            height: 32px;
          }

          .basic-dashboard-main {
            padding: 14px 12px;
          }

          .basic-dashboard-welcome strong {
            font-size: var(--text-normal);
          }

          .basic-dashboard-avatar {
            width: 36px;
            height: 36px;
          }

          .basic-dashboard-cards {
            gap: 8px;
            margin-top: 15px;
          }

          .basic-dashboard-stat-card {
            padding: 11px;
            border-radius: 12px;
          }

          .basic-dashboard-stat-card strong {
            font-size: var(--text-normal);
          }

          .basic-dashboard-stat-card small {
            display: none;
          }

          .basic-dashboard-chart {
            margin-top: 9px;
            padding: 12px;
            border-radius: 13px;
          }

          .basic-chart-area {
            height: 92px;
            margin-top: 13px;
          }

          .basic-dashboard-progress {
            margin-top: 9px;
            padding: 10px 12px;
          }

          .basic-floating-card {
            padding: 9px 11px;
          }

          .basic-floating-card strong {
            font-size: var(--text-small);
          }

          .basic-floating-notification,
          .basic-visual-orbit {
            display: none;
          }
        }

        @media (max-width: 479px) {
          .basic-banner-section {
            min-height: auto;
            padding: 46px 0 56px;
          }

          .basic-banner-container {
            width: calc(100% - 24px);
            grid-template-columns: minmax(0, 1fr);
            gap: 34px;
          }

          .basic-banner-content {
            width: 100%;
            text-align: center;
          }

          .basic-banner-badge {
            max-width: 100%;
            margin-right: auto;
            margin-left: auto;
          }

          .basic-banner-title {
            margin-top: 18px;
          }

          .basic-banner-description {
            margin-top: 16px;
          }

          .basic-banner-actions {
            display: grid;
            width: 100%;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 24px;
          }

          .basic-banner-primary-button,
          .basic-banner-secondary-button {
            width: 100%;
            min-height: 50px;
          }

          .basic-banner-primary-button {
            justify-content: space-between;
          }

          .basic-banner-trust {
            justify-content: center;
            gap: 10px;
            margin-top: 22px;
          }

          .basic-trust-content {
            text-align: left;
          }

          .basic-banner-features {
            margin-top: 26px;
            padding-top: 20px;
          }

          .basic-banner-feature {
            padding: 0 7px;
          }

          .basic-banner-feature strong {
            font-size: var(--text-medium);
          }

          .basic-banner-visual {
            padding: 12px 0 26px;
          }

          .basic-banner-dashboard {
            min-height: 410px;
            border-radius: 18px;
          }

          .basic-dashboard-header {
            height: 48px;
            grid-template-columns: 48px 1fr 28px;
            padding: 0 10px;
          }

          .basic-dashboard-address {
            max-width: 150px;
            height: 28px;
          }

          .basic-dashboard-body {
            min-height: 362px;
            grid-template-columns: 42px minmax(0, 1fr);
          }

          .basic-dashboard-sidebar {
            padding: 12px 4px 10px;
          }

          .basic-dashboard-logo {
            width: 30px;
            height: 30px;
            margin-bottom: 16px;
          }

          .basic-dashboard-sidebar nav span,
          .basic-sidebar-bottom span {
            width: 29px;
            height: 29px;
          }

          .basic-dashboard-main {
            padding: 11px 8px;
          }

          .basic-dashboard-welcome > div:first-child > span {
            display: none;
          }

          .basic-dashboard-welcome strong {
            font-size: var(--text-normal);
          }

          .basic-dashboard-cards {
            gap: 7px;
            margin-top: 13px;
          }

          .basic-dashboard-stat-card {
            padding: 9px;
          }

          .basic-dashboard-stat-card strong {
            font-size: var(--text-normal);
          }

          .basic-dashboard-stat-card small {
            display: none;
          }

          .basic-dashboard-chart {
            padding: 10px;
          }

          .basic-chart-period {
            display: none;
          }

          .basic-chart-area {
            height: 88px;
            margin-top: 12px;
          }

          .basic-floating-card {
            padding: 8px 10px;
          }

          .basic-floating-card strong,
          .basic-floating-card > div:last-child > span {
            font-size: var(--text-small);
          }

          .basic-floating-card-top {
            top: -8px;
            right: -2px;
            transform: scale(0.84);
            transform-origin: top right;
          }

          .basic-floating-card-bottom {
            bottom: -6px;
            left: -2px;
            transform: scale(0.84);
            transform-origin: bottom left;
          }

          .basic-floating-notification,
          .basic-visual-orbit {
            display: none;
          }
        }

        @media (max-width: 370px) {
          .basic-banner-section {
            padding-top: 40px;
          }

          .basic-banner-container {
            width: calc(100% - 18px);
          }

          .basic-banner-trust {
            align-items: flex-start;
          }

          .basic-trust-avatars span {
            width: 32px;
            height: 32px;
          }

          .basic-dashboard-header {
            grid-template-columns: 44px 1fr 24px;
          }

          .basic-dashboard-address {
            max-width: 130px;
          }

          .basic-dashboard-body {
            grid-template-columns: 38px minmax(0, 1fr);
          }

          .basic-dashboard-main {
            padding: 9px 6px;
          }

          .basic-chart-labels span:nth-child(even) {
            visibility: hidden;
          }

          .basic-floating-card {
            display: none;
          }
        }

        @media (hover: none) {
          .basic-banner-visual:hover .basic-banner-dashboard,
          .basic-dashboard-stat-card:hover,
          .basic-banner-primary-button:hover,
          .basic-banner-secondary-button:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .basic-banner-section *,
          .basic-banner-section *::before,
          .basic-banner-section *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .basic-banner-content,
          .basic-banner-visual,
          .basic-banner-feature,
          .basic-chart-bar,
          .basic-progress-track span {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}

function DashboardCard({
  title,
  value,
  increase,
  icon,
}: DashboardCardProps) {
  return (
    <div className="basic-dashboard-stat-card">
      <div className="basic-dashboard-stat-top">
        <span>{title}</span>

        <span className="basic-stat-icon">
          {icon === "users" ? <UsersIcon /> : <RevenueIcon />}
        </span>
      </div>

      <div>
        <strong>{value}</strong>
        <small>{increase}</small>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4V8Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m12 2.6 2.8 5.7 6.3.9-4.5 4.4 1 6.2-5.6-3-5.6 3 1-6.2-4.5-4.4 6.3-.9L12 2.6Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="10"
      height="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function LogoMarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 16 12 4l7 12" />
      <path d="M8 16h8" />
      <path d="M7 20h10" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19V3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" />
      <path d="M12 6v12" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h6l2 2h10v11H3V6Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9A1.7 1.7 0 0 0 21 10h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4.1 1.9c-1 .8-1.6 1.2-1.6 2.6" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="10"
      height="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}