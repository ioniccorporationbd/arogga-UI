import Link from "next/link";
import {
  AlertTriangle,
  Ban,
  Hash,
  Home,
  Minus,
  Plus,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5fbfa] blur-3xl sm:h-[620px] sm:w-[620px]"
      />

      <section
        aria-labelledby="not-found-title"
        className="relative z-10 mx-auto flex w-full max-w-[760px] flex-col items-center text-center"
      >
        <NotFoundIllustration />

        <div className="mt-8 sm:mt-10">
          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#087b75]">
            Error 404
          </p>

          <h1
            id="not-found-title"
            className="mt-3 text-[20px] font-extrabold leading-[1.4] tracking-[-0.025em] text-black"
          >
            Page Not Found
          </h1>

          <p className="mx-auto mt-3 max-w-[560px] text-[16px] leading-7 text-[#52606d]">
            We&apos;re sorry, the page you requested could not be found.
            Please return to the Anukov home page.
          </p>

          <Link
            href="/"
            className="group mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-[#087b75] px-6 text-[13px] font-bold text-white shadow-[0_12px_25px_-16px_rgba(8,123,117,0.72)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#066b66] hover:shadow-[0_18px_32px_-18px_rgba(8,123,117,0.78)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087b75] focus-visible:ring-offset-4 active:translate-y-0"
          >
            <Home
              size={18}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:scale-105"
            />

            Home
          </Link>
        </div>
      </section>
    </main>
  );
}

function NotFoundIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[250px] w-full max-w-[620px] sm:h-[300px] lg:h-[340px]"
    >
      <div className="absolute left-1/2 top-1/2 h-[190px] w-[270px] -translate-x-1/2 -translate-y-1/2 sm:h-[220px] sm:w-[330px] lg:h-[250px] lg:w-[380px]">
        <div className="absolute bottom-[26px] left-[22px] h-[112px] w-[180px] rounded-[7px] border-2 border-[#dde6ee] bg-white sm:h-[130px] sm:w-[215px] lg:h-[145px] lg:w-[245px]">
          <div className="flex h-8 items-center gap-2 border-b-2 border-[#e3eaf0] px-3">
            <span className="h-2 w-2 rounded-full border border-[#cad6df]" />
            <span className="h-2 w-2 rounded-full border border-[#cad6df]" />
            <span className="h-2 w-2 rounded-full border border-[#cad6df]" />
          </div>
        </div>

        <div className="absolute right-[5px] top-[8px] min-h-[120px] w-[205px] rounded-[14px] border-2 border-[#dce5ed] bg-white px-4 py-4 shadow-[0_15px_40px_-30px_rgba(15,23,42,0.28)] sm:min-h-[140px] sm:w-[240px] sm:px-5 sm:py-5 lg:min-h-[160px] lg:w-[270px] lg:px-6 lg:py-6">
          <strong className="block text-center text-[20px] font-black leading-none tracking-[-0.04em] text-[#ff6269]">
            404
          </strong>

          <span className="absolute -bottom-[14px] right-4 h-7 w-7 rotate-45 border-b-2 border-r-2 border-[#dce5ed] bg-white" />
        </div>
      </div>

      <span className="absolute left-[9%] top-[44%] h-[3px] w-12 rounded-full bg-[#d8e2ea] sm:left-[12%] sm:w-16" />

      <span className="absolute left-[13%] top-[39%] h-[3px] w-6 rounded-full bg-[#d8e2ea]" />

      <span className="absolute right-[9%] top-[40%] h-[3px] w-14 rounded-full bg-[#d8e2ea] sm:right-[12%] sm:w-20" />

      <span className="absolute right-[13%] top-[45%] h-[3px] w-8 rounded-full bg-[#d8e2ea]" />

      <span className="absolute left-[18%] top-[16%] text-[#d3dee7]">
        <Plus size={16} strokeWidth={1.6} />
      </span>

      <span className="absolute left-[12%] top-[64%] text-[#d3dee7]">
        <Plus size={13} strokeWidth={1.6} />
      </span>

      <span className="absolute left-[40%] top-[24%] text-[#d3dee7]">
        <Plus size={18} strokeWidth={1.6} />
      </span>

      <span className="absolute right-[22%] top-[18%] text-[#d3dee7]">
        <Plus size={15} strokeWidth={1.6} />
      </span>

      <span className="absolute right-[12%] top-[60%] text-[#d3dee7]">
        <Plus size={13} strokeWidth={1.6} />
      </span>

      <span className="absolute left-[24%] top-[28%] flex h-10 w-10 items-center justify-center rounded-[6px] border-2 border-[#dce5ed] text-[#cbd7e0] sm:h-11 sm:w-11">
        <Ban size={20} strokeWidth={1.4} />
      </span>

      <span className="absolute right-[25%] top-[25%] flex h-9 w-9 items-center justify-center rounded-[6px] border-2 border-[#dce5ed] text-[#cbd7e0] sm:h-10 sm:w-10">
        <Hash size={18} strokeWidth={1.5} />
      </span>

      <span className="absolute right-[16%] top-[58%] flex h-11 w-11 items-center justify-center rounded-[7px] border-2 border-[#dce5ed] text-[#cbd7e0]">
        <AlertTriangle size={22} strokeWidth={1.4} />
      </span>

      <span className="absolute left-[7%] top-[53%] text-[#d7e1e9]">
        <Minus size={24} strokeWidth={1.6} />
      </span>

      <span className="absolute right-[34%] top-[29%] text-[#d7e1e9]">
        <Minus size={22} strokeWidth={1.6} />
      </span>

      <span className="absolute left-[14%] top-[33%] h-1.5 w-1.5 rounded-full border border-[#d7e1e9]" />

      <span className="absolute right-[30%] top-[12%] h-1.5 w-1.5 rounded-full border border-[#d7e1e9]" />

      <span className="absolute right-[20%] top-[35%] h-1.5 w-1.5 rounded-full border border-[#d7e1e9]" />

      <span className="absolute right-[38%] bottom-[9%] h-1.5 w-1.5 rounded-full border border-[#d7e1e9]" />
    </div>
  );
}