"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video,
} from "lucide-react";

const DOCTOR_IMAGE =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85";
const CONSULT_IMAGE =
  "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=700&q=85";

const features = [
  {
    icon: CalendarDays,
    title: "Easy specialist booking",
    description: "Find trusted doctors by need, choose an available time and confirm your consultation quickly.",
  },
  {
    icon: Video,
    title: "Video consultation",
    description: "Talk to doctors from mobile, tablet or desktop with a clean and secure online experience.",
  },
  {
    icon: HeartPulse,
    title: "Digital follow-up care",
    description: "Get prescription notes, care reminders and follow-up support after each appointment.",
  },
];

const steps = ["Choose specialty", "Book a time", "Consult online", "Get prescription"];

export default function DoctorComingSoon() {
  return (
    <section className="relative isolate min-h-[calc(100vh-80px)] w-full overflow-hidden bg-[radial-gradient(circle_at_12%_12%,rgba(14,165,233,.16),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(8,123,117,.18),transparent_28%),linear-gradient(180deg,#f7fbff_0%,#ffffff_46%,#effbf8_100%)] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-18">
      <style>{`
        @keyframes doctorFloat { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(-1.4deg); } }
        @keyframes doctorPulse { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        @keyframes doctorSlideUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .doctor-animate-in { animation: doctorSlideUp .7s cubic-bezier(.22,.8,.22,1) both; }
        .doctor-float { animation: doctorFloat 6s ease-in-out infinite; }
        .doctor-pulse { animation: doctorPulse 2.8s ease-in-out infinite; }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 -z-10 h-96 w-96 rounded-full bg-[#dff5ff]/80 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-4 -z-10 h-96 w-96 rounded-full bg-[#dff7ee]/80 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 opacity-[0.26] [background-image:linear-gradient(rgba(8,123,117,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(8,123,117,0.05)_1px,transparent_1px)] [background-size:46px_46px]" />

      <div className="mx-auto grid w-full max-w-[1260px] items-center gap-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-12">
        <div className="doctor-animate-in">
          <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#cfeee6] bg-white/80 px-4 text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#087b75] shadow-sm backdrop-blur">
            <Stethoscope size={17} /> Doctor consultation
          </div>

          <h1 className="mt-5 max-w-[720px] text-[32px] font-black leading-[1.08] tracking-[-0.055em] text-[#101828] sm:text-[44px] lg:text-[58px]">
            Online doctor care is getting a more beautiful experience.
          </h1>

          <p className="mt-5 max-w-[660px] text-[15px] leading-7 text-[#5f6b78] sm:text-[17px]">
            We are redesigning Arogga Doctor with specialist profiles, video consultation,
            clear messages, digital prescriptions and safer follow-up care for every device.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/store" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#087b75] px-6 text-[14px] font-extrabold text-white shadow-[0_22px_46px_-30px_rgba(8,123,117,.72)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#066b66] hover:shadow-[0_28px_58px_-34px_rgba(8,123,117,.82)]">
              Continue shopping <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/lab" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#b7ddd8] bg-white/90 px-6 text-[14px] font-extrabold text-[#087b75] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#087b75] hover:bg-[#f2fbfa]">
              Explore lab tests
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-[#d9e8e5] bg-white/78 p-4 shadow-[0_18px_44px_-36px_rgba(15,23,42,.45)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#9ad8cf]">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#e8f8f5] text-[12px] font-black text-[#087b75]">0{index + 1}</span>
                <strong className="mt-3 block text-[13px] leading-5 text-[#101828]">{step}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="doctor-animate-in relative" style={{ animationDelay: ".12s" }}>
          <div className="doctor-float relative overflow-hidden rounded-[34px] border border-white/85 bg-white/85 p-3 shadow-[0_38px_100px_-60px_rgba(15,23,42,.62)] backdrop-blur-2xl">
            <div className="relative min-h-[430px] overflow-hidden rounded-[28px] bg-[#e9f8f5] sm:min-h-[520px]">
              <img src={DOCTOR_IMAGE} alt="Smiling doctor consultation" className="absolute inset-0 h-full w-full object-cover" loading="eager" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#063b38]/86 via-[#063b38]/12 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[24px] border border-white/30 bg-white/88 p-4 shadow-[0_20px_52px_-30px_rgba(0,0,0,.55)] backdrop-blur-xl sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#087b75] text-white"><Video size={22} /></span>
                  <div>
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#087b75]">Coming soon</p>
                    <h2 className="mt-1 text-[18px] font-black leading-6 text-[#101828]">Secure video visit with verified doctors</h2>
                    <p className="mt-2 text-[13px] leading-6 text-[#667085]">Clear status messages, appointment flow and digital health records are being prepared.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="doctor-pulse absolute -left-4 top-8 hidden rounded-2xl border border-[#d9ebe7] bg-white/92 p-4 shadow-[0_24px_56px_-36px_rgba(15,23,42,.5)] backdrop-blur md:block">
            <ShieldCheck className="text-[#087b75]" size={24} />
            <strong className="mt-2 block text-[13px] text-[#101828]">Verified care</strong>
            <span className="text-[11px] text-[#667085]">Trusted specialists</span>
          </div>

          <div className="absolute -right-3 bottom-20 hidden max-w-[220px] rounded-2xl border border-[#d9ebe7] bg-white/92 p-4 shadow-[0_24px_56px_-36px_rgba(15,23,42,.5)] backdrop-blur md:block">
            <MessageCircle className="text-[#087b75]" size={24} />
            <strong className="mt-2 block text-[13px] text-[#101828]">Helpful messages</strong>
            <span className="text-[11px] leading-5 text-[#667085]">Appointment reminders and consultation updates.</span>
          </div>
        </div>
      </div>

      <div className="doctor-animate-in mx-auto mt-10 grid w-full max-w-[1260px] gap-4 md:grid-cols-3" style={{ animationDelay: ".22s" }}>
        {features.map(({ icon: Icon, title, description }) => (
          <article key={title} className="group overflow-hidden rounded-[24px] border border-[#dceae7] bg-white/88 p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,.5)] backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:border-[#9ddad1] hover:shadow-[0_32px_75px_-48px_rgba(8,123,117,.52)]">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#effaf8] text-[#087b75] transition-all duration-300 group-hover:rotate-[-5deg] group-hover:bg-[#087b75] group-hover:text-white"><Icon size={25} /></span>
              <div>
                <h2 className="text-[17px] font-black leading-6 text-[#101828]">{title}</h2>
                <p className="mt-2 text-[13px] leading-6 text-[#667085]">{description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[1260px] items-center gap-3 rounded-[22px] border border-[#dceae7] bg-white/82 p-4 text-[13px] leading-6 text-[#5f6b78] shadow-[0_18px_50px_-40px_rgba(15,23,42,.45)] backdrop-blur sm:p-5">
        <CheckCircle2 className="shrink-0 text-[#087b75]" size={22} />
        <p><strong className="text-[#101828]">Better design in progress:</strong> doctor profiles, service images, booking messages, consultation cards and all-device responsive layout will be available here soon.</p>
      </div>
    </section>
  );
}
