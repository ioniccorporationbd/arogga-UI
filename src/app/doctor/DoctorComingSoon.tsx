"use client";

import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Stethoscope,
} from "lucide-react";

const DOCTOR_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3209/3209265.png";

export default function DoctorComingSoon() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-gradient-to-b from-[#f7fbff] via-white to-[#f8fbfb] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#dff5ff]/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#e8fff4]/70 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-[1200px] items-center justify-center">
        <div className="w-full max-w-[860px] text-center">
          <div className="mb-7 flex justify-center sm:mb-8">
            <div className="relative flex h-[170px] w-[220px] items-center justify-center sm:h-[210px] sm:w-[270px]">
              <img
                src={DOCTOR_IMAGE}
                alt="Online doctor consultation illustration"
                width={270}
                height={210}
                loading="eager"
                draggable={false}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="mb-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#cfeee6] bg-[#effcf8] px-4 sm:px-5">
            <Stethoscope
              size={18}
              strokeWidth={1.8}
              className="text-[#0a8f78]"
            />

            <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#0a8f78]">
              Online Healthcare Platform
            </span>
          </div>

          <h1 className="text-[20px] font-bold leading-[1.4] tracking-[-0.02em] text-[#1f2937]">
            Doctor Consultation is Coming Soon
          </h1>

          <p className="mx-auto mt-4 max-w-[680px] text-[16px] leading-7 text-[#667085]">
            Get secure online consultations with certified
            doctors from anywhere. Book appointments, receive
            digital prescriptions, and access quality healthcare
            from the comfort of your home.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={
                <CalendarDays
                  size={30}
                  strokeWidth={1.7}
                />
              }
              title="Easy Booking"
              description="Book appointments with experienced doctors in just a few simple steps."
            />

            <FeatureCard
              icon={
                <Clock3
                  size={30}
                  strokeWidth={1.7}
                />
              }
              title="Anytime Access"
              description="Connect with trusted doctors using your mobile, tablet, laptop, or desktop."
            />

            <FeatureCard
              icon={
                <Stethoscope
                  size={30}
                  strokeWidth={1.7}
                />
              }
              title="Digital Care"
              description="Receive prescriptions, follow-up support, and secure consultation records."
            />
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#0a8f78] px-7 text-[16px] font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#087562] hover:shadow-lg sm:w-auto"
            >
              Go to Homepage
            </Link>

            <button
              type="button"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#0a8f78] bg-white px-7 text-[16px] font-semibold text-[#0a8f78] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f3fcfa] sm:w-auto"
            >
              Notify Me
            </button>
          </div>

          <p className="mx-auto mt-8 max-w-[720px] text-[13px] leading-6 text-[#98a2b3]">
            Online doctor consultation, specialist appointments,
            digital prescriptions, and secure health records will
            be available soon.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="group rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#c9e8e2] hover:shadow-xl sm:p-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#effaf8] text-[#0a8f78] transition duration-300 group-hover:scale-105 group-hover:bg-[#e4f7f3]">
        {icon}
      </div>

      <h2 className="mt-4 text-[18px] font-semibold leading-6 text-[#111827]">
        {title}
      </h2>

      <p className="mt-3 text-[13px] leading-6 text-[#667085]">
        {description}
      </p>
    </article>
  );
}