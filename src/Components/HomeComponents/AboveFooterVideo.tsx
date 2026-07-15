"use client";

import {
  Box,
  MapPinned,
  Timer,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";

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
    icon: <UsersRound size={22} strokeWidth={1.8} />,
  },
  {
    id: 2,
    value: "50K+",
    label: "Products available",
    icon: <Box size={22} strokeWidth={1.8} />,
  },
  {
    id: 3,
    value: "64",
    label: "Districts covered",
    icon: <MapPinned size={22} strokeWidth={1.8} />,
  },
  {
    id: 4,
    value: "4",
    label: "Hour express delivery",
    icon: <Timer size={22} strokeWidth={1.8} />,
  },
];

const VIDEO_URL =
  "https://product-video.arogga.com/misc/videos/web-above-footer.mp4";

export default function TrustStatsVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const replayVideo = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      video.currentTime = 0;
      await video.play();
      setVideoError(false);
    } catch {
      setVideoError(true);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-10 sm:py-12 lg:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#dff5f2]/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#eef7ff]/70 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[18px] bg-[#117f7a] shadow-[0_20px_50px_-30px_rgba(8,89,85,0.65)]">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.id}
                stat={stat}
                showBorder={index !== stats.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-7 overflow-hidden rounded-[18px] border border-[#d6ebe8] bg-[#dff6f7] shadow-[0_24px_55px_-35px_rgba(15,23,42,0.38)] sm:mt-8">
          {!videoLoaded && !videoError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#dff6f7]">
              <div className="flex flex-col items-center gap-3">
                <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#087b75]/20 border-t-[#087b75]" />

                <p className="text-sm font-medium text-[#087b75]">
                  Loading video...
                </p>
              </div>
            </div>
          )}

          {videoError && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#dff6f7] px-6 text-center">
              <div>
                <p className="text-base font-semibold text-[#344054]">
                  Video could not be loaded
                </p>

                <button
                  type="button"
                  onClick={replayVideo}
                  className="mt-4 rounded-lg bg-[#087b75] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066b66]"
                >
                  Try Again
                </button>
              </div>
            </div>
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
            }}
            onError={() => {
              setVideoLoaded(false);
              setVideoError(true);
            }}
            className="block aspect-[4/1] min-h-[190px] w-full bg-[#dff6f7] object-cover sm:min-h-[230px] lg:min-h-[280px]"
          >
            <source
              src={VIDEO_URL}
              type="video/mp4"
            />

            Your browser does not support the video tag.
          </video>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.03]"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  showBorder,
}: {
  stat: StatItem;
  showBorder: boolean;
}) {
  return (
    <article
      className={[
        "group relative min-h-[138px] px-5 py-6 sm:min-h-[150px] sm:px-7 sm:py-7 lg:min-h-[142px]",
        showBorder
          ? "border-white/10 lg:border-r"
          : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <strong className="block text-[31px] font-extrabold leading-none tracking-[-0.04em] text-white sm:text-[36px]">
            {stat.value}
          </strong>

          <p className="mt-4 text-[13px] font-medium leading-5 text-white/95 sm:text-[15px]">
            {stat.label}
          </p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/90 transition duration-300 group-hover:scale-105 group-hover:bg-white/20">
          {stat.icon}
        </span>
      </div>

      <span className="absolute bottom-0 left-0 h-[3px] w-0 rounded-r-full bg-white/70 transition-all duration-500 group-hover:w-full" />
    </article>
  );
}