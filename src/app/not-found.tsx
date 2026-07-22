import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Search,
  ShoppingBag,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_15%,rgba(8,123,117,.16),transparent_30%),radial-gradient(circle_at_86%_20%,rgba(255,183,3,.18),transparent_28%),linear-gradient(180deg,#f7fbfa_0%,#fff_46%,#effaf8_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <style>{`
        @keyframes nfFloat { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(1.5deg); } }
        @keyframes nfOrbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes nfPulse { 0%,100% { opacity: .45; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        @keyframes nfEnter { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .nf-enter { animation: nfEnter .72s cubic-bezier(.22,.8,.22,1) both; }
        .nf-float { animation: nfFloat 6s ease-in-out infinite; }
        .nf-orbit { animation: nfOrbit 18s linear infinite; }
        .nf-pulse { animation: nfPulse 3s ease-in-out infinite; }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 opacity-[0.26] [background-image:linear-gradient(rgba(8,123,117,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(8,123,117,0.05)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-44 top-10 -z-10 h-[430px] w-[430px] rounded-full bg-[#dff7f2]/80 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-44 bottom-4 -z-10 h-[430px] w-[430px] rounded-full bg-[#fff1d8]/80 blur-3xl" />

      <section aria-labelledby="not-found-title" className="nf-enter mx-auto grid w-full max-w-[1120px] items-center gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-12">
        <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
          <div className="nf-float relative aspect-square overflow-hidden rounded-[38px] border border-white/85 bg-white/86 p-5 shadow-[0_42px_110px_-64px_rgba(15,23,42,.62)] backdrop-blur-2xl">
            <div className="relative grid h-full place-items-center overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#f0fbf8_48%,#dff5f1_100%)]">
              <div className="nf-orbit absolute h-[78%] w-[78%] rounded-full border border-dashed border-[#9bd8cf]" />
              <div className="nf-orbit absolute h-[60%] w-[60%] rounded-full border border-dashed border-[#ffd28b]" style={{ animationDirection: "reverse", animationDuration: "22s" }} />

              <div className="relative text-center">
                <p className="text-[86px] font-black leading-none tracking-[-0.12em] text-[#087b75] sm:text-[118px]">404</p>
                <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-[#cfeae6] bg-white/88 px-4 py-2 text-[12px] font-extrabold text-[#087b75] shadow-sm">
                  <Search size={15} /> Page route missing
                </div>
              </div>

              <span className="nf-pulse absolute left-8 top-10 grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#087b75] shadow-[0_18px_44px_-28px_rgba(15,23,42,.55)]"><ShoppingBag size={22} /></span>
              <span className="nf-pulse absolute bottom-12 right-10 grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#087b75] shadow-[0_18px_44px_-28px_rgba(15,23,42,.55)]" style={{ animationDelay: ".45s" }}><Stethoscope size={22} /></span>
              <span className="absolute right-11 top-12 rounded-full bg-[#ffb703] p-2 text-white shadow-lg"><Sparkles size={18} /></span>
            </div>
          </div>
        </div>

        <div className="text-center lg:text-left">
          <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#cae7e3] bg-white/82 px-4 text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#087b75] shadow-sm backdrop-blur">
            <Sparkles size={16} /> Better navigation
          </div>

          <h1 id="not-found-title" className="mt-5 text-[34px] font-black leading-[1.08] tracking-[-0.055em] text-[#101828] sm:text-[48px] lg:text-[64px]">
            This page is not available, but your care journey can continue.
          </h1>

          <p className="mx-auto mt-5 max-w-[680px] text-[15px] leading-7 text-[#5f6b78] sm:text-[17px] lg:mx-0">
            The link may be old, moved, or typed incorrectly. Use the improved navigation below to return home, continue shopping, or explore doctor and lab services.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#087b75] px-6 text-[14px] font-extrabold text-white shadow-[0_22px_46px_-30px_rgba(8,123,117,.74)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#066b66] hover:shadow-[0_30px_58px_-34px_rgba(8,123,117,.82)]">
              <Home size={17} /> Go home
            </Link>
            <Link href="/store" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#b9ddd8] bg-white/90 px-6 text-[14px] font-extrabold text-[#087b75] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#087b75] hover:bg-[#f1fbf9]">
              <ShoppingBag size={17} /> Shop products
            </Link>
            <Link href="/doctor" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#dce8e6] bg-white/70 px-6 text-[14px] font-extrabold text-[#344054] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#087b75] hover:text-[#087b75]">
              <ArrowLeft size={17} /> Doctor page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
