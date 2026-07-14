"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import {
  A11y,
  Autoplay,
  Pagination,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

type Banner = {
  id: number;
  image: string;
  href: string;
  alt: string;
};

const banners: Banner[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=90",
    href: "/healthcare",
    alt: "Healthcare services",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1800&q=90",
    href: "/lab",
    alt: "Home medical checkup",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1800&q=90",
    href: "/medicine",
    alt: "Medicine and healthcare",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1800&q=90",
    href: "/doctor",
    alt: "Doctor consultation",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1800&q=90",
    href: "/healthcare",
    alt: "Hospital healthcare",
  },
];

export default function HeroBanner() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="simple-hero-section">
      <div className="simple-hero-container">
        <div className="simple-hero-wrapper">
          <Swiper
            modules={[Autoplay, Pagination, A11y]}
            slidesPerView={1}
            loop
            speed={750}
            grabCursor
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="simple-hero-swiper"
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={banner.id}>
                <Link
                  href={banner.href}
                  aria-label={banner.alt}
                  className="simple-hero-slide"
                >
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    width={1800}
                    height={430}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="simple-hero-image"
                  />

                  <span className="simple-hero-shade" />

                  <div className="simple-hero-content">
                    <p>Quality Healthcare</p>
                    <h2>Care delivered to your home</h2>
                    <span>Shop Now</span>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Previous banner"
            onClick={() => swiperRef.current?.slidePrev()}
            className="simple-hero-arrow simple-hero-arrow-left"
          >
            <ChevronLeft size={20} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            aria-label="Next banner"
            onClick={() => swiperRef.current?.slideNext()}
            className="simple-hero-arrow simple-hero-arrow-right"
          >
            <ChevronRight size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </section>
  );
}