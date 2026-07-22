"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  A11y,
  Autoplay,
  EffectFade,
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

type BannerVariant = "home" | "store" | "lab";

type BannerSlide = {
  id: number;
  image: string;
  href: string;
  alt: string;
  position: string;
};

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    image: "/banners/ecommerce-banner-01.webp",
    href: "/medicine",
    alt: "Pharmacy ecommerce promotional banner",
    position: "center",
  },
  {
    id: 2,
    image: "/banners/ecommerce-banner-02.webp",
    href: "/beauty",
    alt: "Beauty ecommerce promotional banner",
    position: "center",
  },
  {
    id: 3,
    image: "/banners/ecommerce-banner-03.webp",
    href: "/healthcare",
    alt: "Healthcare ecommerce promotional banner",
    position: "center",
  },
  {
    id: 4,
    image: "/banners/ecommerce-banner-04.webp",
    href: "/supplement",
    alt: "Supplement ecommerce promotional banner",
    position: "center",
  },
  {
    id: 5,
    image: "/banners/ecommerce-banner-05.webp",
    href: "/baby-mom-care",
    alt: "Baby care ecommerce promotional banner",
    position: "center",
  },
  {
    id: 6,
    image: "/banners/ecommerce-banner-06.webp",
    href: "/home-care",
    alt: "Home care ecommerce promotional banner",
    position: "center",
  },
  {
    id: 7,
    image: "/banners/ecommerce-banner-07.webp",
    href: "/lab",
    alt: "Lab test ecommerce promotional banner",
    position: "center",
  },
];

const variantAria: Record<BannerVariant, string> = {
  home: "Homepage image-only ecommerce banner carousel",
  store: "Store image-only ecommerce banner carousel",
  lab: "Lab image-only ecommerce banner carousel",
};

export default function SharedEcommerceBanner({
  variant = "home",
}: {
  variant?: BannerVariant;
}) {
  const navClass = `seb-${variant}`;

  return (
    <section className={`seb-section is-${variant}`} aria-label={variantAria[variant]}>
      <div className="seb-shell">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, Keyboard, A11y, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={950}
          keyboard={{ enabled: true, onlyInViewport: true }}
          autoplay={{
            delay: 4300,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: `.seb-prev.${navClass}`,
            nextEl: `.seb-next.${navClass}`,
          }}
          pagination={{
            el: `.seb-pagination.${navClass}`,
            clickable: true,
            renderBullet: (index, className) =>
              `<button type="button" class="${className}" aria-label="Go to banner ${index + 1}"><span></span></button>`,
          }}
          a11y={{
            enabled: true,
            prevSlideMessage: "Previous ecommerce banner",
            nextSlideMessage: "Next ecommerce banner",
            paginationBulletMessage: "Go to ecommerce banner {{index}}",
          }}
          className="seb-swiper"
        >
          {bannerSlides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              {({ isActive }) => (
                <article className={`seb-slide ${isActive ? "active" : ""}`}>
                  <Link href={slide.href} className="seb-link" aria-label={slide.alt}>
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      width={1536}
                      height={1024}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      draggable={false}
                      style={{ objectPosition: slide.position }}
                    />
                  </Link>
                </article>
              )}
            </SwiperSlide>
          ))}

          <button
            type="button"
            aria-label="Previous banner"
            className={`seb-arrow seb-prev ${navClass}`}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next banner"
            className={`seb-arrow seb-next ${navClass}`}
          >
            <ChevronRight />
          </button>
          <div className={`seb-pagination ${navClass}`} aria-label="Banner pagination" />
        </Swiper>
      </div>

      <style>{`
        .seb-section{padding:14px 0 20px;background:linear-gradient(180deg,#ffffff 0%,#f7fffd 100%);overflow:hidden}.seb-shell{width:min(1480px,calc(100% - 40px));margin:0 auto}.seb-swiper{position:relative;overflow:hidden;border:1px solid rgba(8,123,117,.16);border-radius:32px;background:#eef7f4;box-shadow:0 34px 90px -62px rgba(15,23,42,.8)}.seb-slide,.seb-link{display:block;position:relative;width:100%;height:100%;overflow:hidden}.seb-link{background:#e8f4f1;text-decoration:none}.seb-link img{display:block;width:100%;height:clamp(280px,34vw,700px);max-height:700px;object-fit:cover;transform:scale(1.035);filter:saturate(1.05) contrast(1.03);transition:transform 5.8s cubic-bezier(.16,1,.3,1),filter .3s ease}.seb-slide.active img{transform:scale(1)}.seb-link::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(2,44,44,.06),transparent 30%,rgba(2,44,44,.05)),linear-gradient(180deg,rgba(255,255,255,.06),transparent 42%,rgba(1,20,28,.12));pointer-events:none}.seb-arrow{position:absolute;top:50%;z-index:5;display:grid;width:44px;height:44px;place-items:center;border:1px solid rgba(255,255,255,.72);border-radius:16px;background:rgba(255,255,255,.82);color:#087b75;box-shadow:0 18px 38px -25px rgba(15,23,42,.85);transform:translateY(-50%);cursor:pointer;backdrop-filter:blur(12px);transition:.18s ease}.seb-arrow svg{width:19px}.seb-arrow:hover{background:#087b75;color:#fff}.seb-prev{left:16px}.seb-next{right:16px}.seb-pagination{position:absolute;left:50%;bottom:16px;z-index:6;display:flex;width:auto!important;gap:6px;border:1px solid rgba(255,255,255,.58);border-radius:999px;background:rgba(255,255,255,.74);padding:8px 10px;transform:translateX(-50%);backdrop-filter:blur(12px)}.seb-pagination .swiper-pagination-bullet{width:22px;height:8px;margin:0!important;border:0;border-radius:999px;background:rgba(8,123,117,.22);opacity:1;overflow:hidden;transition:.25s ease}.seb-pagination .swiper-pagination-bullet span{display:block;width:100%;height:100%;border-radius:inherit}.seb-pagination .swiper-pagination-bullet-active{width:46px;background:rgba(8,123,117,.14)}.seb-pagination .swiper-pagination-bullet-active span{background:#087b75;animation:sebProgress 4.2s linear both}.is-store{padding-top:12px}.is-store .seb-shell{width:min(1500px,calc(100% - 38px))}.is-store .seb-swiper{border-radius:30px}.is-store .seb-link img{height:clamp(300px,36vw,700px);max-height:700px}.is-lab .seb-link img{height:clamp(290px,35vw,700px);max-height:700px}@keyframes sebProgress{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}@media(max-width:760px){.seb-section{padding:14px 0 20px}.seb-shell{width:calc(100% - 20px)}.seb-swiper{border-radius:22px}.seb-link img,.is-store .seb-link img,.is-lab .seb-link img{height:360px}.seb-arrow{display:none}.seb-pagination{bottom:10px}.seb-pagination .swiper-pagination-bullet{width:18px;height:7px}.seb-pagination .swiper-pagination-bullet-active{width:36px}}@media(max-width:420px){.seb-link img,.is-store .seb-link img,.is-lab .seb-link img{height:300px}}
      `}</style>
    </section>
  );
}
