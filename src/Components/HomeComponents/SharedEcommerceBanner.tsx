"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

type BannerVariant = "home" | "store" | "lab";

type SharedSlide = {
  id: number;
  image: string;
  mobileImage: string;
  href: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  offer: string;
  cta: string;
  alt: string;
};

const ecommerceSlides: SharedSlide[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1900&h=680&q=92", mobileImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&h=1100&q=90", href: "/medicine", eyebrow: "Pharmacy sale", title: "Authentic medicines delivered safely", subtitle: "Order pharmacy products, OTC care and family health essentials from trusted sources.", offer: "Same-day support", cta: "Order medicine", alt: "Medicine and pharmacy ecommerce banner" },
  { id: 2, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1900&h=680&q=92", mobileImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&h=1100&q=90", href: "/beauty", eyebrow: "Beauty store", title: "Beauty routines with real product images", subtitle: "Skincare, makeup, fragrance and personal-care picks with smooth shopping flow.", offer: "Fresh drops", cta: "Shop beauty", alt: "Beauty products ecommerce banner" },
  { id: 3, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1900&h=680&q=92", mobileImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&h=1100&q=90", href: "/healthcare", eyebrow: "Healthcare", title: "Family healthcare products in one panel", subtitle: "Devices, hygiene, first aid, monitoring tools and wellness support for daily care.", offer: "Verified brands", cta: "Explore healthcare", alt: "Healthcare products ecommerce banner" },
  { id: 4, image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1900&h=680&q=92", mobileImage: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&h=1100&q=90", href: "/supplement", eyebrow: "Wellness", title: "Supplements for active and healthy days", subtitle: "Vitamins, minerals, nutrition and immunity support with clear product cards.", offer: "Top picks", cta: "View supplements", alt: "Vitamins and supplements ecommerce banner" },
  { id: 5, image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1900&h=680&q=92", mobileImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&h=1100&q=90", href: "/baby-mom-care", eyebrow: "Baby & mom", title: "Gentle baby care with trusted essentials", subtitle: "Diapers, wipes, feeding, mother care and family-first shopping interactions.", offer: "Soft care", cta: "Shop baby care", alt: "Baby and mother ecommerce banner" },
  { id: 6, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1900&h=680&q=92", mobileImage: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&h=1100&q=90", href: "/home-care", eyebrow: "Home care", title: "Hygiene and home essentials that feel real", subtitle: "Cleaning, sanitizing, household and everyday care products with bundle-style panels.", offer: "Bundle deals", cta: "Shop home care", alt: "Home care ecommerce banner" },
  { id: 7, image: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=1900&h=680&q=92", mobileImage: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=900&h=1100&q=90", href: "/lab", eyebrow: "Lab tests", title: "Book lab tests from the same trusted dashboard", subtitle: "Home sample collection, health packages, digital reports and diagnostic partner panels.", offer: "Healthcare service", cta: "Book lab test", alt: "Laboratory and diagnostic ecommerce healthcare banner" },
];

const variantCopy: Record<BannerVariant, { label: string; title: string; description: string }> = {
  home: { label: "Homepage banner", title: "A real ecommerce healthcare home", description: "Seven real image banners plus category panels for shopping, lab tests and healthcare services." },
  store: { label: "Store banner", title: "Shop the store with premium ecommerce panels", description: "The store banner now uses the same seven-image system with polished product-led copy." },
  lab: { label: "Lab banner", title: "Lab tests, reports and healthcare products together", description: "Lab pages now share the same ecommerce visual language with diagnostic-specific messaging." },
};

export default function SharedEcommerceBanner({ variant = "home" }: { variant?: BannerVariant }) {
  const copy = variantCopy[variant];
  const navClass = `seb-${variant}`;

  return (
    <section className={`seb-section is-${variant}`} aria-label={`${copy.label} carousel`}>
      <div className="seb-shell">
        <div className="seb-intro">
          <span><Sparkles size={14} />{copy.label}</span>
          <strong>{copy.title}</strong>
          <p>{copy.description}</p>
        </div>
        <div className="seb-trust-row" aria-label="Dashboard service highlights">
          <span><CheckCircle2 size={14} /> Authentic products</span>
          <span><ShieldCheck size={14} /> Secure checkout</span>
          <span><Sparkles size={14} /> Smooth shopping</span>
          <span><ArrowRight size={14} /> Fast delivery</span>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, Keyboard, A11y, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={900}
          keyboard={{ enabled: true, onlyInViewport: true }}
          autoplay={{ delay: 4800, disableOnInteraction: false, pauseOnMouseEnter: true }}
          navigation={{ prevEl: `.seb-prev.${navClass}`, nextEl: `.seb-next.${navClass}` }}
          pagination={{ el: `.seb-pagination.${navClass}`, clickable: true, renderBullet: (index, className) => `<button type="button" class="${className}" aria-label="Go to ecommerce banner ${index + 1}"><span></span></button>` }}
          a11y={{ enabled: true, prevSlideMessage: "Previous ecommerce banner", nextSlideMessage: "Next ecommerce banner", paginationBulletMessage: "Go to ecommerce banner {{index}}" }}
          className="seb-swiper"
        >
          {ecommerceSlides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              {({ isActive }) => (
                <article className={`seb-slide ${isActive ? "active" : ""}`}>
                  <Link href={slide.href} className="seb-link" aria-label={slide.alt}>
                    <picture>
                      <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
                      <img src={slide.image} alt={slide.alt} width={1900} height={680} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} draggable={false} />
                    </picture>
                    <span className="seb-overlay" />
                    <span className="seb-panel">
                      <span className="seb-eyebrow"><ShieldCheck size={14} />{slide.eyebrow}</span>
                      <strong>{slide.title}</strong>
                      <small>{slide.subtitle}</small>
                      <span className="seb-actions"><b>{slide.cta}<ArrowRight size={14} /></b><em><CheckCircle2 size={14} />{slide.offer}</em></span>
                    </span>
                  </Link>
                </article>
              )}
            </SwiperSlide>
          ))}
          <button type="button" aria-label="Previous banner" className={`seb-arrow seb-prev ${navClass}`}><ChevronLeft /></button>
          <button type="button" aria-label="Next banner" className={`seb-arrow seb-next ${navClass}`}><ChevronRight /></button>
          <div className={`seb-pagination ${navClass}`} aria-label="Ecommerce banner pagination" />
        </Swiper>
      </div>
      <style>{`
        .seb-section{padding:24px 0 24px;background:radial-gradient(circle at 8% 10%,rgba(8,123,117,.13),transparent 28%),radial-gradient(circle at 92% 88%,rgba(255,189,89,.14),transparent 30%),linear-gradient(180deg,#ffffff 0%,#f7fffd 100%);overflow:hidden}.seb-shell{width:min(1440px,calc(100% - 48px));margin:0 auto}.seb-intro{display:grid;grid-template-columns:minmax(0,1fr) minmax(250px,520px);gap:12px;align-items:end;margin-bottom:12px}.seb-intro span{display:inline-flex;align-items:center;gap:7px;width:max-content;border:1px solid #bde8e2;border-radius:999px;background:#ecfaf7;color:#087b75;padding:7px 10px;font-size:11px;font-weight:950}.seb-intro strong{font-size:clamp(28px,4vw,46px);line-height:1;letter-spacing:-.055em}.seb-intro p{margin:0;color:#667085;font-size:13px;line-height:1.6}.seb-trust-row{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}.seb-trust-row span{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(8,123,117,.14);border-radius:999px;background:rgba(255,255,255,.78);box-shadow:0 12px 35px -30px rgba(15,23,42,.75);color:#087b75;padding:8px 10px;font-size:11px;font-weight:950}.seb-swiper{position:relative;overflow:hidden;border:1px solid rgba(8,123,117,.16);border-radius:34px;background:#edf5f3;box-shadow:0 38px 96px -62px rgba(15,23,42,.82)}.seb-slide,.seb-link,.seb-link picture{display:block;position:relative;width:100%;height:100%;overflow:hidden}.seb-link{text-decoration:none;background:#101828}.seb-link img{display:block;width:100%;height:clamp(340px,40vw,590px);object-fit:cover;transform:scale(1.045);transition:transform 5.8s cubic-bezier(.16,1,.3,1),filter .35s ease;filter:saturate(1.08) contrast(1.04)}.seb-slide.active img{transform:scale(1)}.seb-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(3,11,20,.72),rgba(3,11,20,.28) 48%,rgba(3,11,20,.07)),linear-gradient(180deg,transparent 45%,rgba(3,11,20,.34));z-index:1}.seb-panel{position:absolute;z-index:2;left:clamp(22px,6vw,86px);top:50%;display:grid;gap:11px;max-width:570px;color:#fff;transform:translateY(-50%);text-shadow:0 18px 40px rgba(0,0,0,.42)}.seb-eyebrow{display:inline-flex;align-items:center;gap:7px;width:max-content;border:1px solid rgba(255,255,255,.35);border-radius:999px;background:rgba(255,255,255,.18);padding:8px 11px;font-size:12px;font-weight:950;backdrop-filter:blur(12px)}.seb-panel strong{font-size:clamp(34px,5vw,68px);line-height:.96;letter-spacing:-.07em}.seb-panel small{max-width:500px;color:rgba(255,255,255,.9);font-size:15px;line-height:1.6}.seb-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.seb-actions b,.seb-actions em{display:inline-flex;align-items:center;gap:7px;border-radius:15px;padding:11px 14px;font-size:13px;font-style:normal;font-weight:950}.seb-actions b{background:#fff;color:#087b75}.seb-actions em{border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.18);color:#fff;backdrop-filter:blur(12px)}.seb-arrow{position:absolute;top:50%;z-index:5;display:grid;width:44px;height:44px;place-items:center;border:1px solid rgba(255,255,255,.55);border-radius:15px;background:rgba(255,255,255,.86);color:#087b75;box-shadow:0 18px 38px -25px rgba(15,23,42,.8);transform:translateY(-50%);cursor:pointer;transition:.18s ease}.seb-arrow svg{width:19px}.seb-arrow:hover{background:#087b75;color:#fff}.seb-prev{left:16px}.seb-next{right:16px}.seb-pagination{position:absolute;left:50%;bottom:16px;z-index:6;display:flex;width:auto!important;gap:6px;border:1px solid rgba(255,255,255,.45);border-radius:999px;background:rgba(255,255,255,.65);padding:8px 10px;transform:translateX(-50%);backdrop-filter:blur(12px)}.seb-pagination .swiper-pagination-bullet{width:24px;height:8px;margin:0!important;border:0;border-radius:999px;background:rgba(8,123,117,.22);opacity:1;overflow:hidden;transition:.25s ease}.seb-pagination .swiper-pagination-bullet span{display:block;width:100%;height:100%;border-radius:inherit}.seb-pagination .swiper-pagination-bullet-active{width:46px;background:rgba(8,123,117,.14)}.seb-pagination .swiper-pagination-bullet-active span{background:#087b75;animation:sebProgress 4.7s linear both}.is-lab .seb-overlay{background:linear-gradient(90deg,rgba(5,30,48,.76),rgba(5,30,48,.28) 52%,rgba(5,30,48,.08)),linear-gradient(180deg,transparent 45%,rgba(5,30,48,.34))}.is-store .seb-swiper{border-radius:24px}.is-home .seb-section,.is-home{background:#fff}@keyframes sebProgress{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}@media(max-width:900px){.seb-intro{grid-template-columns:1fr}.seb-panel{left:24px;right:24px}.seb-panel strong{font-size:42px}}@media(max-width:640px){.seb-shell{width:calc(100% - 22px)}.seb-intro strong{font-size:29px}.seb-link img{height:520px}.seb-panel{top:auto;bottom:66px;transform:none}.seb-panel strong{font-size:32px}.seb-panel small{font-size:12px}.seb-arrow{display:none}.seb-pagination{bottom:12px}}
      `}</style>
    </section>
  );
}
