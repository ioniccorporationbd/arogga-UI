"use client";

import {
  Box,
  MapPinned,
  Pause,
  Play,
  RefreshCw,
  Timer,
  UsersRound,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type StatItem = {
  id: number;
  value: string;
  label: string;
  icon: ReactNode;
};

const stats: StatItem[] = [
  {
    id: 1,
    value: "3M+",
    label: "Customers trust us",
    icon: <UsersRound size={20} strokeWidth={1.8} />,
  },
  {
    id: 2,
    value: "50K+",
    label: "Products available",
    icon: <Box size={20} strokeWidth={1.8} />,
  },
  {
    id: 3,
    value: "64",
    label: "Districts covered",
    icon: <MapPinned size={20} strokeWidth={1.8} />,
  },
  {
    id: 4,
    value: "4",
    label: "Hour express delivery",
    icon: <Timer size={20} strokeWidth={1.8} />,
  },
];

const VIDEO_URL =
  "https://product-video.arogga.com/misc/videos/web-above-footer.mp4";

export default function TrustStatsVideo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  const replayVideo = useCallback(async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    try {
      setVideoError(false);
      video.currentTime = 0;
      await video.play();
      setIsPlaying(true);
    } catch {
      setVideoError(true);
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch {
      setVideoError(true);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        aria-labelledby="trust-stats-title"
        className="trust-video-section"
      >
        <div
          aria-hidden="true"
          className="trust-video-pattern"
        />

        <div
          aria-hidden="true"
          className="trust-video-glow trust-video-glow-left"
        />

        <div
          aria-hidden="true"
          className="trust-video-glow trust-video-glow-right"
        />

        <div className="trust-video-container">
          <header
            className={[
              "trust-video-heading",
              isVisible ? "is-visible" : "",
            ].join(" ")}
          >
            <div>
              <p className="trust-video-eyebrow">
                Trusted healthcare platform
              </p>

              <h2
                id="trust-stats-title"
                className="trust-video-title"
              >
                Healthcare support trusted across Bangladesh
              </h2>

              <p className="trust-video-description">
                Millions of customers rely on Arogga for authentic products,
                nationwide delivery and dependable healthcare support.
              </p>
            </div>

            <div className="trust-video-status">
              <span className="trust-video-status-dot" />

              <span>Serving customers every day</span>
            </div>
          </header>

          <div
            className={[
              "trust-stats-wrapper",
              isVisible ? "is-visible" : "",
            ].join(" ")}
          >
            <div className="trust-stats-grid">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.id}
                  stat={stat}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </div>

          <div
            className={[
              "trust-video-wrapper",
              isVisible ? "is-visible" : "",
            ].join(" ")}
          >
            <div className="trust-video-media">
              {!videoLoaded && !videoError && (
                <VideoLoadingState />
              )}

              {videoError && (
                <VideoErrorState onRetry={replayVideo} />
              )}

              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                controls={false}
                disablePictureInPicture
                controlsList="nodownload noplaybackrate noremoteplayback"
                aria-label="Arogga healthcare service promotional video"
                onLoadedData={() => {
                  setVideoLoaded(true);
                  setVideoError(false);
                }}
                onCanPlay={() => {
                  setVideoLoaded(true);
                  setVideoError(false);
                }}
                onPlay={() => {
                  setIsPlaying(true);
                }}
                onPause={() => {
                  setIsPlaying(false);
                }}
                onVolumeChange={(event) => {
                  setIsMuted(event.currentTarget.muted);
                }}
                onError={() => {
                  setVideoLoaded(false);
                  setVideoError(true);
                  setIsPlaying(false);
                }}
                className="trust-video-element"
              >
                <source src={VIDEO_URL} type="video/mp4" />

                Your browser does not support the video tag.
              </video>

              <div
                aria-hidden="true"
                className="trust-video-overlay"
              />

              <div
                aria-hidden="true"
                className="trust-video-shine"
              />

              {videoLoaded && !videoError && (
                <>
                  <div className="trust-video-label">
                    <span className="trust-video-label-dot" />

                    Arogga healthcare experience
                  </div>

                  <div className="trust-video-controls">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={
                        isPlaying
                          ? "Pause promotional video"
                          : "Play promotional video"
                      }
                      className="trust-video-control-button"
                    >
                      {isPlaying ? (
                        <Pause size={18} fill="currentColor" />
                      ) : (
                        <Play size={18} fill="currentColor" />
                      )}

                      <span>{isPlaying ? "Pause" : "Play"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={
                        isMuted
                          ? "Turn on video sound"
                          : "Mute promotional video"
                      }
                      className="trust-video-control-button"
                    >
                      {isMuted ? (
                        <VolumeX size={18} />
                      ) : (
                        <Volume2 size={18} />
                      )}

                      <span>{isMuted ? "Sound on" : "Mute"}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .trust-video-section {
          --trust-text-20: 20px;
          --trust-text-18: 18px;
          --trust-text-16: 16px;
          --trust-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 64px 0;
          background:
            radial-gradient(
              circle at 5% 10%,
              rgba(199, 239, 232, 0.58),
              transparent 28%
            ),
            radial-gradient(
              circle at 95% 88%,
              rgba(218, 236, 255, 0.7),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #ffffff 0%,
              #f9fdfc 52%,
              #f7fbff 100%
            );
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .trust-video-pattern {
          position: absolute;
          inset: 0;
          z-index: -4;
          pointer-events: none;
          opacity: 0.24;
          background-image:
            linear-gradient(
              rgba(8, 123, 117, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(8, 123, 117, 0.04) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.8),
            transparent 98%
          );
        }

        .trust-video-glow {
          position: absolute;
          z-index: -3;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(110px);
          opacity: 0.54;
          will-change: transform;
        }

        .trust-video-glow-left {
          top: 10px;
          left: -230px;
          background: rgba(141, 221, 207, 0.55);
          animation: trustVideoGlowLeft 12s ease-in-out infinite;
        }

        .trust-video-glow-right {
          right: -230px;
          bottom: -110px;
          background: rgba(175, 213, 255, 0.56);
          animation: trustVideoGlowRight 14s ease-in-out infinite;
        }

        .trust-video-container {
          position: relative;
          width: min(1440px, calc(100% - 64px));
          margin-inline: auto;
        }

        .trust-video-heading {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end;
          gap: 32px;
          margin-bottom: 28px;
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 700ms ease,
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .trust-video-heading.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .trust-video-eyebrow {
          margin: 0;
          color: #087b75;
          font-size: var(--trust-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .trust-video-title {
          max-width: 760px;
          margin: 7px 0 0;
          color: #101828;
          font-size: var(--trust-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .trust-video-description {
          max-width: 720px;
          margin: 8px 0 0;
          color: #667085;
          font-size: var(--trust-text-13);
          line-height: 1.7;
        }

        .trust-video-status {
          display: inline-flex;
          min-height: 42px;
          flex-shrink: 0;
          align-items: center;
          gap: 9px;
          padding: 8px 14px;
          border: 1px solid #cee6e2;
          border-radius: 999px;
          color: #087b75;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 12px 28px -22px rgba(8, 123, 117, 0.45);
          backdrop-filter: blur(12px);
          font-size: var(--trust-text-13);
          font-weight: 750;
          line-height: 1;
        }

        .trust-video-status-dot {
          width: 9px;
          height: 9px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #23b47e;
          box-shadow: 0 0 0 5px rgba(35, 180, 126, 0.12);
          animation: trustStatusPulse 2s ease-in-out infinite;
        }

        .trust-stats-wrapper {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 20px;
          background:
            linear-gradient(
              135deg,
              rgba(17, 127, 122, 0.98),
              rgba(7, 100, 97, 0.98)
            );
          box-shadow:
            0 30px 65px -40px rgba(8, 89, 85, 0.75),
            inset 0 1px rgba(255, 255, 255, 0.2);
          opacity: 0;
          transform: translateY(30px);
          transition:
            opacity 750ms ease 100ms,
            transform 750ms cubic-bezier(0.22, 1, 0.36, 1) 100ms;
        }

        .trust-stats-wrapper.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .trust-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .trust-stat-card {
          position: relative;
          min-width: 0;
          min-height: 154px;
          overflow: hidden;
          padding: 25px;
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 620ms ease,
            transform 620ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 350ms ease;
        }

        .trust-stat-card.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .trust-stat-card:not(:last-child) {
          border-right: 1px solid rgba(255, 255, 255, 0.12);
        }

        .trust-stat-card:hover {
          background: rgba(255, 255, 255, 0.065);
        }

        .trust-stat-card::before {
          position: absolute;
          right: -42px;
          bottom: -48px;
          width: 130px;
          height: 130px;
          border: 18px solid rgba(255, 255, 255, 0.055);
          border-radius: 50%;
          content: "";
          transition:
            transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 400ms ease;
        }

        .trust-stat-card:hover::before {
          opacity: 1;
          transform: scale(1.18) translate(-8px, -8px);
        }

        .trust-stat-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .trust-stat-value {
          display: block;
          color: #ffffff;
          font-size: var(--trust-text-20);
          font-weight: 850;
          line-height: 1.2;
          letter-spacing: -0.03em;
        }

        .trust-stat-label {
          max-width: 145px;
          margin: 13px 0 0;
          color: rgba(255, 255, 255, 0.88);
          font-size: var(--trust-text-13);
          font-weight: 600;
          line-height: 1.6;
        }

        .trust-stat-icon {
          display: flex;
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 14px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          transition:
            transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 350ms ease;
        }

        .trust-stat-card:hover .trust-stat-icon {
          background: rgba(255, 255, 255, 0.18);
          transform: rotate(-6deg) scale(1.08);
        }

        .trust-stat-progress {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 3px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.06);
        }

        .trust-stat-progress::after {
          display: block;
          width: 0;
          height: 100%;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.85);
          content: "";
          transition: width 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .trust-stat-card:hover .trust-stat-progress::after {
          width: 100%;
        }

        .trust-video-wrapper {
          margin-top: 28px;
          opacity: 0;
          transform: translateY(34px);
          transition:
            opacity 800ms ease 220ms,
            transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 220ms;
        }

        .trust-video-wrapper.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .trust-video-media {
          position: relative;
          overflow: hidden;
          border: 1px solid #cfe6e3;
          border-radius: 20px;
          background: #dff6f7;
          box-shadow:
            0 32px 72px -44px rgba(15, 23, 42, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.8);
          transform: translateZ(0);
        }

        .trust-video-element {
          display: block;
          width: 100%;
          min-height: 220px;
          aspect-ratio: 4 / 1;
          object-fit: cover;
          background: #dff6f7;
          transition:
            transform 900ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 500ms ease;
        }

        .trust-video-media:hover .trust-video-element {
          filter: saturate(1.025) contrast(1.015);
          transform: scale(1.012);
        }

        .trust-video-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              to top,
              rgba(6, 36, 45, 0.28),
              transparent 38%
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.04),
              transparent 30%,
              transparent 70%,
              rgba(255, 255, 255, 0.04)
            );
        }

        .trust-video-shine {
          position: absolute;
          inset: 0 auto 0 -30%;
          width: 18%;
          pointer-events: none;
          transform: skewX(-18deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.16),
            transparent
          );
          animation: trustVideoShine 7s ease-in-out infinite;
        }

        .trust-video-label {
          position: absolute;
          top: 16px;
          left: 16px;
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          gap: 9px;
          padding: 7px 13px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 999px;
          color: #ffffff;
          background: rgba(11, 92, 89, 0.68);
          box-shadow: 0 12px 30px -20px rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(12px);
          font-size: var(--trust-text-13);
          font-weight: 750;
          line-height: 1;
        }

        .trust-video-label-dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.18);
        }

        .trust-video-controls {
          position: absolute;
          right: 16px;
          bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .trust-video-control-button {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 14px;
          border: 1px solid rgba(255, 255, 255, 0.52);
          border-radius: 999px;
          color: #ffffff;
          background: rgba(8, 74, 72, 0.72);
          box-shadow: 0 12px 28px -18px rgba(15, 23, 42, 0.52);
          backdrop-filter: blur(12px);
          font-family: inherit;
          font-size: var(--trust-text-13);
          font-weight: 750;
          cursor: pointer;
          transition:
            background-color 280ms ease,
            transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 280ms ease;
        }

        .trust-video-control-button:hover {
          border-color: rgba(255, 255, 255, 0.78);
          background: rgba(8, 123, 117, 0.92);
          transform: translateY(-2px);
        }

        .trust-video-control-button:active {
          transform: scale(0.97);
        }

        .trust-video-loading,
        .trust-video-error {
          position: absolute;
          inset: 0;
          z-index: 20;
          display: flex;
          min-height: 220px;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.92),
              rgba(223, 246, 247, 0.96)
            );
          text-align: center;
        }

        .trust-video-loader {
          width: 42px;
          height: 42px;
          margin-inline: auto;
          border: 3px solid rgba(8, 123, 117, 0.15);
          border-top-color: #087b75;
          border-radius: 50%;
          animation: trustLoaderSpin 850ms linear infinite;
        }

        .trust-video-loading-title,
        .trust-video-error-title {
          margin: 14px 0 0;
          color: #344054;
          font-size: var(--trust-text-16);
          font-weight: 800;
          line-height: 1.5;
        }

        .trust-video-loading-text,
        .trust-video-error-text {
          max-width: 360px;
          margin: 7px auto 0;
          color: #667085;
          font-size: var(--trust-text-13);
          line-height: 1.65;
        }

        .trust-video-retry-button {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          padding: 8px 17px;
          border: 0;
          border-radius: 10px;
          color: #ffffff;
          background: #087b75;
          box-shadow: 0 14px 28px -18px rgba(8, 123, 117, 0.65);
          font-family: inherit;
          font-size: var(--trust-text-13);
          font-weight: 800;
          cursor: pointer;
          transition:
            background-color 250ms ease,
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .trust-video-retry-button:hover {
          background: #066b66;
          box-shadow: 0 18px 34px -18px rgba(8, 123, 117, 0.7);
          transform: translateY(-2px);
        }

        @keyframes trustVideoGlowLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(34px, -20px, 0) scale(1.08);
          }
        }

        @keyframes trustVideoGlowRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-32px, -18px, 0) scale(1.07);
          }
        }

        @keyframes trustStatusPulse {
          0%,
          100% {
            box-shadow: 0 0 0 5px rgba(35, 180, 126, 0.12);
          }

          50% {
            box-shadow: 0 0 0 9px rgba(35, 180, 126, 0.04);
          }
        }

        @keyframes trustVideoShine {
          0%,
          42% {
            left: -30%;
          }

          62%,
          100% {
            left: 118%;
          }
        }

        @keyframes trustLoaderSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .trust-video-section {
            padding: 58px 0;
          }

          .trust-video-container {
            width: min(980px, calc(100% - 48px));
          }

          .trust-stat-card {
            min-height: 148px;
            padding: 22px;
          }

          .trust-video-element,
          .trust-video-loading,
          .trust-video-error {
            min-height: 240px;
            aspect-ratio: 3.6 / 1;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .trust-video-section {
            padding: 54px 0;
          }

          .trust-video-container {
            width: min(760px, calc(100% - 40px));
          }

          .trust-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .trust-stat-card {
            min-height: 146px;
          }

          .trust-stat-card:nth-child(2) {
            border-right: 0;
          }

          .trust-stat-card:nth-child(-n + 2) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          }

          .trust-video-element,
          .trust-video-loading,
          .trust-video-error {
            min-height: 260px;
            aspect-ratio: 2.7 / 1;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .trust-video-section {
            padding: 50px 0;
          }

          .trust-video-container {
            width: calc(100% - 32px);
          }

          .trust-video-heading {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .trust-video-status {
            width: fit-content;
          }

          .trust-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .trust-stat-card {
            min-height: 142px;
            padding: 21px;
          }

          .trust-stat-card:nth-child(2) {
            border-right: 0;
          }

          .trust-stat-card:nth-child(-n + 2) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          }

          .trust-video-element,
          .trust-video-loading,
          .trust-video-error {
            min-height: 250px;
            aspect-ratio: 2.3 / 1;
          }
        }

        @media (max-width: 639px) {
          .trust-video-section {
            padding: 44px 0 48px;
          }

          .trust-video-container {
            width: 100%;
          }

          .trust-video-heading {
            grid-template-columns: 1fr;
            gap: 16px;
            padding-inline: 14px;
          }

          .trust-video-title,
          .trust-video-description {
            max-width: 340px;
          }

          .trust-video-status {
            width: fit-content;
            min-height: 40px;
          }

          .trust-stats-wrapper {
            margin-inline: 14px;
            border-radius: 17px;
          }

          .trust-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .trust-stat-card {
            min-height: 145px;
            padding: 18px;
          }

          .trust-stat-card:nth-child(2) {
            border-right: 0;
          }

          .trust-stat-card:nth-child(-n + 2) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          }

          .trust-stat-label {
            max-width: 110px;
          }

          .trust-stat-icon {
            width: 40px;
            height: 40px;
            border-radius: 12px;
          }

          .trust-video-wrapper {
            margin-top: 20px;
            padding-inline: 14px;
          }

          .trust-video-media {
            border-radius: 17px;
          }

          .trust-video-element,
          .trust-video-loading,
          .trust-video-error {
            min-height: 260px;
            aspect-ratio: 1.55 / 1;
          }

          .trust-video-label {
            top: 12px;
            left: 12px;
            min-height: 38px;
          }

          .trust-video-controls {
            right: 12px;
            bottom: 12px;
            left: 12px;
            justify-content: flex-end;
          }

          .trust-video-control-button span {
            display: none;
          }

          .trust-video-control-button {
            width: 42px;
            min-width: 42px;
            padding: 0;
          }
        }

        @media (max-width: 380px) {
          .trust-video-heading {
            padding-inline: 11px;
          }

          .trust-stats-wrapper {
            margin-inline: 11px;
          }

          .trust-stat-card {
            min-height: 138px;
            padding: 15px;
          }

          .trust-stat-content {
            gap: 8px;
          }

          .trust-stat-label {
            max-width: 96px;
          }

          .trust-stat-icon {
            width: 38px;
            height: 38px;
          }

          .trust-video-wrapper {
            padding-inline: 11px;
          }

          .trust-video-element,
          .trust-video-loading,
          .trust-video-error {
            min-height: 240px;
          }

          .trust-video-label {
            max-width: calc(100% - 24px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        @media (hover: none) {
          .trust-stat-card:hover .trust-stat-icon,
          .trust-video-media:hover .trust-video-element,
          .trust-video-control-button:hover,
          .trust-video-retry-button:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trust-video-section *,
          .trust-video-section *::before,
          .trust-video-section *::after {
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

function StatCard({
  stat,
  index,
  isVisible,
}: {
  stat: StatItem;
  index: number;
  isVisible: boolean;
}) {
  return (
    <article
      className={[
        "trust-stat-card",
        isVisible ? "is-visible" : "",
      ].join(" ")}
      style={{
        transitionDelay: isVisible
          ? `${180 + index * 100}ms`
          : "0ms",
      }}
    >
      <div className="trust-stat-content">
        <div>
          <strong className="trust-stat-value">
            {stat.value}
          </strong>

          <p className="trust-stat-label">
            {stat.label}
          </p>
        </div>

        <span className="trust-stat-icon">
          {stat.icon}
        </span>
      </div>

      <span
        aria-hidden="true"
        className="trust-stat-progress"
      />
    </article>
  );
}

function VideoLoadingState() {
  return (
    <div className="trust-video-loading">
      <div>
        <span className="trust-video-loader" />

        <p className="trust-video-loading-title">
          Loading video
        </p>

        <p className="trust-video-loading-text">
          Please wait while the healthcare experience is prepared.
        </p>
      </div>
    </div>
  );
}

function VideoErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="trust-video-error">
      <div>
        <RefreshCw
          size={20}
          className="mx-auto text-[#087b75]"
        />

        <p className="trust-video-error-title">
          Video could not be loaded
        </p>

        <p className="trust-video-error-text">
          Check your internet connection and try loading the video again.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="trust-video-retry-button"
        >
          <RefreshCw size={16} />

          Try Again
        </button>
      </div>
    </div>
  );
}