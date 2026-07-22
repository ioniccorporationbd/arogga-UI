"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  src: string;
  alt: string;
};

type Props = {
  images: Slide[];
  discount?: number;
  freeShipping?: boolean;
  productName: string;
};

const SLIDE_INTERVAL = 5000;

export default function ProductImageSlider({
  images,
  discount = 0,
  freeShipping = false,
  productName,
}: Props) {
  const slides = useMemo(() => {
    const unique = new Map<string, Slide>();
    images.forEach((image) => {
      if (image.src) unique.set(image.src, image);
    });
    return Array.from(unique.values()).slice(0, 5);
  }, [images]);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasMultiple = slides.length > 1;

  useEffect(() => {
    if (!hasMultiple || paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => window.clearInterval(timer);
  }, [hasMultiple, paused, slides.length]);

  if (slides.length === 0) return null;

  const previous = () => setActive((current) => (current - 1 + slides.length) % slides.length);
  const next = () => setActive((current) => (current + 1) % slides.length);

  return (
    <div className="pd-gallery-column pd-slider-shell">
      <div className="pd-thumbnails" aria-label={`${productName} image thumbnails`}>
        {slides.map((slide, index) => (
          <button
            type="button"
            className={`pd-thumb ${index === active ? "active" : ""}`}
            key={`${slide.src}-${index}`}
            onClick={() => setActive(index)}
            aria-label={`Show ${productName} image ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
          >
            <Image src={slide.src} alt={slide.alt} fill sizes="72px" className="pd-thumb-image" unoptimized />
          </button>
        ))}
      </div>

      <div
        className="pd-media"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="pd-media-badges">
          {discount > 0 && <span className="pd-discount">{discount}% OFF</span>}
          {freeShipping ? <span className="pd-free">Free delivery</span> : null}
        </div>

        <div className="pd-slider-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {slides.map((slide, index) => (
            <div className="pd-slide" key={`${slide.src}-slide-${index}`} aria-hidden={index !== active}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 900px) 100vw, 48vw"
                priority={index === 0}
                className="pd-image"
                unoptimized
              />
            </div>
          ))}
        </div>

        {hasMultiple ? (
          <>
            <button type="button" className="pd-slider-arrow pd-slider-prev" onClick={previous} aria-label="Previous product image">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="pd-slider-arrow pd-slider-next" onClick={next} aria-label="Next product image">
              <ChevronRight size={18} />
            </button>
            <button type="button" className="pd-slider-pause" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play product image slider" : "Pause product image slider"}>
              {paused ? <Play size={14} /> : <Pause size={14} />}
              <span>{paused ? "Play" : "Auto 5s"}</span>
            </button>
            <div className="pd-slider-dots" aria-label="Product image slider pagination">
              {slides.map((slide, index) => (
                <button
                  type="button"
                  key={`${slide.src}-dot`}
                  className={index === active ? "active" : ""}
                  onClick={() => setActive(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
