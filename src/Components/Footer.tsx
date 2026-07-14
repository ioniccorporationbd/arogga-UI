"use client";

import Link from "next/link";
import {
  ArrowUp,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type FooterLink = {
  label: string;
  href: string;
};

type PartnerLogo = {
  name: string;
  src: string;
  imageClassName?: string;
};

const IMAGE_URLS = {
  logo: "https://www.arogga.com/assets/arogga-logo.svg",

  authenticity:
    "https://www.arogga.com/assets/svg/icon-v2/footer/authenticity.svg",

  customerCentric:
    "https://www.arogga.com/assets/svg/icon-v2/footer/customer-centric.svg",

  techDriven:
    "https://www.arogga.com/assets/svg/icon-v2/footer/tech-driven.svg",

  sslCommerz:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2Fsslcommerz.png&w=256",

  bkash:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2Fpayments%2Fbkash.png&w=128",

  nagad:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2Fpayments%2Fnagad.png&w=128",

  rocket:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2Fpayments%2Frocket.png&w=128",

  sureCash:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2Fpayments%2Fsure-cash.png&w=128",

  upay:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2Fpayments%2Fupay.png&w=128",

  mCash:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2Fpayments%2Fm-cash.png&w=128",

  visa:
    "https://www.arogga.com/assets/svg/icon-v2/footer/payments/visa.svg",

  mastercard:
    "https://www.arogga.com/assets/svg/icon-v2/footer/payments/mastercard.svg",

  americanExpress:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2Fpayments%2Famerican-express.png&w=128",

  steadfast:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2F3pl%2Fsteadfast.png&w=128",

  pathao:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2F3pl%2Fpathao.png&w=128",

  paperfly:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2F3pl%2Fxmld.png&w=128",

  redx:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fsvg%2Ficon-v2%2Ffooter%2F3pl%2Fredx.png&w=128",

  googlePlay:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fimg%2Fgoogle_play.webp&w=256",

  appStore:
    "https://www.arogga.com/_next/image?q=75&url=%2Fassets%2Fimg%2Fapple_store.webp&w=256",

  linkedin:
    "https://cdn.simpleicons.org/linkedin/0A66C2",

  facebook:
    "https://cdn.simpleicons.org/facebook/0866FF",

  instagram:
    "https://cdn.simpleicons.org/instagram/E4405F",

  youtube:
    "https://cdn.simpleicons.org/youtube/FF0000",
} as const;

const quickLinks: FooterLink[] = [
  {
    label: "Careers",
    href: "/careers",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms and Conditions",
    href: "/terms-and-conditions",
  },
  {
    label: "Return and Refund Policy",
    href: "/return-and-refund-policy",
  },
];

const serviceLinks: FooterLink[] = [
  {
    label: "Online Doctor Consultation",
    href: "/doctor",
  },
  {
    label: "Lab Test - Home Sample Collection",
    href: "/lab",
  },
  {
    label: "Doorstep Medicine Delivery",
    href: "/store",
  },
  {
    label: "Healthcare and Beauty Products",
    href: "/store",
  },
];

const usefulLinks: FooterLink[] = [
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Account",
    href: "/account",
  },
  {
    label: "Register Your Pharmacy",
    href: "/register-your-pharmacy",
  },
  {
    label: "Special Offers",
    href: "/special-offers",
  },
];

const paymentPartners: PartnerLogo[] = [
  {
    name: "bKash",
    src: IMAGE_URLS.bkash,
  },
  {
    name: "Nagad",
    src: IMAGE_URLS.nagad,
  },
  {
    name: "Rocket",
    src: IMAGE_URLS.rocket,
  },
  {
    name: "SureCash",
    src: IMAGE_URLS.sureCash,
  },
  {
    name: "Upay",
    src: IMAGE_URLS.upay,
  },
  {
    name: "MCash",
    src: IMAGE_URLS.mCash,
  },
  {
    name: "Visa",
    src: IMAGE_URLS.visa,
  },
  {
    name: "Mastercard",
    src: IMAGE_URLS.mastercard,
  },
  {
    name: "American Express",
    src: IMAGE_URLS.americanExpress,
  },
  {
    name: "bKash",
    src: IMAGE_URLS.bkash,
  },
  {
    name: "Nagad",
    src: IMAGE_URLS.nagad,
  },
  {
    name: "Rocket",
    src: IMAGE_URLS.rocket,
  },
  {
    name: "SureCash",
    src: IMAGE_URLS.sureCash,
  },
];

const logisticsPartners: PartnerLogo[] = [
  {
    name: "Steadfast",
    src: IMAGE_URLS.steadfast,
  },
  {
    name: "Pathao",
    src: IMAGE_URLS.pathao,
  },
  {
    name: "Paperfly",
    src: IMAGE_URLS.paperfly,
  },
  {
    name: "REDX",
    src: IMAGE_URLS.redx,
  },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="border-t border-[#e3e7eb] pt-[32px]">
          {/* Top feature row */}
          <section className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-[72px]">
            <div>
              <Link
                href="/"
                aria-label="Arogga home"
                className="inline-flex"
              >
                <img
                  src={IMAGE_URLS.logo}
                  alt="Arogga"
                  width={184}
                  height={64}
                  className="h-[64px] w-[184px] object-contain object-left"
                />
              </Link>

              <p className="mt-[27px] max-w-[270px] text-[15px] leading-[23px] text-[#111827]">
                The Primary Healthcare Platform for Bangladesh
              </p>
            </div>

            <FeatureBlock
              image={IMAGE_URLS.authenticity}
              alt="Authentic products"
            >
              Authentic products sourced from manufacturers, distributors and
              importers
            </FeatureBlock>

            <FeatureBlock
              image={IMAGE_URLS.customerCentric}
              alt="Customer centric service"
            >
              Our customers are at the heart of everything we do
            </FeatureBlock>

            <FeatureBlock
              image={IMAGE_URLS.techDriven}
              alt="Technology driven service"
            >
              We innovate with cutting-edge technology to deliver the highest
              standards of performance and quality
            </FeatureBlock>
          </section>

          {/* Link row */}
          <section className="mt-[66px] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-[72px]">
            <FooterColumn
              title="Quick Links"
              links={quickLinks}
            />

            <FooterColumn
              title="Our Services"
              links={serviceLinks}
            />

            <FooterColumn
              title="Useful Links"
              links={usefulLinks}
            />

            <ContactInfo />
          </section>

          {/* Payment and delivery partners */}
          <section className="mt-[58px] grid grid-cols-1 gap-12 lg:grid-cols-[3fr_1fr] lg:gap-x-[70px]">
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 className="text-[16px] font-semibold text-[#111827]">
                  Online Payment Partners
                </h3>

                <span className="text-[14px] text-[#374151]">
                  Verified by
                </span>

                <img
                  src={IMAGE_URLS.sslCommerz}
                  alt="SSLCommerz"
                  width={90}
                  height={18}
                  className="h-[18px] w-auto object-contain"
                />
              </div>

              <div className="mt-[25px] flex flex-wrap gap-x-[20px] gap-y-3">
                {paymentPartners.map((partner, index) => (
                  <PartnerImage
                    key={`${partner.name}-${index}`}
                    partner={partner}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[16px] font-semibold text-[#111827]">
                3PL Partners
              </h3>

              <div className="mt-[25px] flex flex-wrap gap-x-[20px] gap-y-3">
                {logisticsPartners.map((partner) => (
                  <PartnerImage
                    key={partner.name}
                    partner={partner}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Bottom details row */}
          <section className="mt-[55px] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-[72px]">
            <div>
              <FooterHeading>Download Our App</FooterHeading>

              <div className="mt-[24px] flex flex-wrap items-center gap-5">
                <a
                  href="#"
                  aria-label="Download from Google Play"
                  className="inline-flex transition-opacity hover:opacity-85"
                >
                  <img
                    src={IMAGE_URLS.googlePlay}
                    alt="Get it on Google Play"
                    width={97}
                    height={30}
                    className="h-[30px] w-auto object-contain"
                  />
                </a>

                <a
                  href="#"
                  aria-label="Download from the App Store"
                  className="inline-flex transition-opacity hover:opacity-85"
                >
                  <img
                    src={IMAGE_URLS.appStore}
                    alt="Download on the App Store"
                    width={97}
                    height={30}
                    className="h-[30px] w-auto object-contain"
                  />
                </a>
              </div>
            </div>

            <div>
              <FooterHeading>Connect in Social</FooterHeading>

              <div className="mt-[24px] flex items-center gap-[13px]">
                <SocialImage
                  href="https://www.linkedin.com"
                  label="LinkedIn"
                  src={IMAGE_URLS.linkedin}
                />

                <SocialImage
                  href="https://www.facebook.com"
                  label="Facebook"
                  src={IMAGE_URLS.facebook}
                />

                <SocialImage
                  href="https://www.instagram.com"
                  label="Instagram"
                  src={IMAGE_URLS.instagram}
                />

                <SocialImage
                  href="https://www.youtube.com"
                  label="YouTube"
                  src={IMAGE_URLS.youtube}
                />
              </div>
            </div>

            <div>
              <FooterHeading>Trade License Number</FooterHeading>

              <p className="mt-[25px] text-[15px] text-[#111827]">
                TRAD/DNCC/057602/2022
              </p>
            </div>

            <div>
              <FooterHeading>DBID</FooterHeading>

              <p className="mt-[25px] text-[15px] text-[#111827]">
                915741315
              </p>
            </div>
          </section>

          {/* Copyright */}
          <div className="mt-[34px] border-t border-[#e3e7eb] py-[32px] text-center">
            <p className="text-[14px] text-[#111827]">
              © 2026 Arogga Limited. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}

function FeatureBlock({
  image,
  alt,
  children,
}: {
  image: string;
  alt: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex min-h-[65px] items-start">
        <img
          src={image}
          alt={alt}
          width={63}
          height={63}
          loading="lazy"
          className="h-[62px] w-[62px] object-contain object-left"
        />
      </div>

      <p className="mt-[18px] max-w-[296px] text-[15px] leading-[23px] text-[#111827]">
        {children}
      </p>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h3 className="text-[21px] font-semibold leading-7 text-[#111827]">
        {title}
      </h3>

      <nav className="mt-[22px] flex flex-col items-start gap-[11px]">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[15px] leading-[21px] text-[#111827] transition-colors duration-200 hover:text-[#087b75]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function ContactInfo() {
  return (
    <div>
      <h3 className="text-[21px] font-semibold leading-7 text-[#111827]">
        Contact Info
      </h3>

      <div className="mt-[22px] flex flex-col gap-[11px]">
        <ContactRow
          icon={<Phone size={17} strokeWidth={1.5} />}
          label="Hotline:"
        >
          <a
            href="tel:09610016778"
            className="text-[#007b75] underline underline-offset-[3px]"
          >
            09610016778
          </a>
        </ContactRow>

        <ContactRow
          icon={
            <MessageCircle
              size={17}
              strokeWidth={1.5}
            />
          }
          label="Whatsapp:"
        >
          <a
            href="https://wa.me/8801810117100"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007b75] underline underline-offset-[3px]"
          >
            01810117100
          </a>
        </ContactRow>

        <div className="flex items-start gap-[9px] text-[15px] leading-[21px] text-[#111827]">
          <MapPin
            size={17}
            strokeWidth={1.5}
            className="mt-[2px] shrink-0 text-[#374151]"
          />

          <p className="max-w-[280px]">
            Address: D/15-1, Road-36, Block-D, Section-10, Mirpur, Dhaka-1216
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-[9px] text-[15px] leading-[21px] text-[#111827]">
      <span className="shrink-0 text-[#374151]">
        {icon}
      </span>

      <span>{label}</span>

      {children}
    </div>
  );
}

function PartnerImage({
  partner,
}: {
  partner: PartnerLogo;
}) {
  return (
    <div className="flex h-[31px] min-w-[56px] items-center justify-center rounded-[5px] border border-[#dde2e7] bg-white px-[7px]">
      <img
        src={partner.src}
        alt={partner.name}
        width={48}
        height={21}
        loading="lazy"
        className={`max-h-[21px] max-w-[52px] object-contain ${
          partner.imageClassName ?? ""
        }`}
      />
    </div>
  );
}

function FooterHeading({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <h3 className="text-[17px] font-semibold text-[#111827]">
      {children}
    </h3>
  );
}

function SocialImage({
  href,
  label,
  src,
}: {
  href: string;
  label: string;
  src: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-[30px] w-[30px] items-center justify-center transition-transform duration-200 hover:-translate-y-[2px]"
    >
      <img
        src={src}
        alt={label}
        width={30}
        height={30}
        loading="lazy"
        className="h-[30px] w-[30px] object-contain"
      />
    </a>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    updateVisibility();

    window.addEventListener("scroll", updateVisibility, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-7 right-5 z-50 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#d5d9dd] bg-[#f8f9fa] text-[#111827] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#087b75] hover:text-[#087b75] md:bottom-[104px] md:right-[38px] ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={24} strokeWidth={1.8} />
    </button>
  );
}