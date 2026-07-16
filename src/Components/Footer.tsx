"use client";

import Link from "next/link";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  HeartPulse,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type FooterLink = {
  label: string;
  href: string;
};

type PartnerLogo = {
  name: string;
  src: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

type NewsletterStatus = "idle" | "success" | "error";

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

  linkedin: "https://cdn.simpleicons.org/linkedin/0A66C2",
  facebook: "https://cdn.simpleicons.org/facebook/0866FF",
  instagram: "https://cdn.simpleicons.org/instagram/E4405F",
  youtube: "https://cdn.simpleicons.org/youtube/FF0000",
} as const;

const footerSections: FooterSection[] = [
  {
    title: "Quick Links",
    links: [
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
    ],
  },
  {
    title: "Our Services",
    links: [
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
    ],
  },
  {
    title: "Useful Links",
    links: [
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
    ],
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
  const currentYear = useMemo(
    () => new Date().getFullYear(),
    [],
  );

  const [email, setEmail] = useState("");
  const [status, setStatus] =
    useState<NewsletterStatus>("idle");

  const [openSection, setOpenSection] =
    useState<string | null>("Quick Links");

  const submitNewsletter = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const validEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail,
      );

    if (!validEmail) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
  };

  return (
    <footer className="relative isolate overflow-hidden border-t border-[#e0e9e7] bg-[#f7fbfa] text-[#111827]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 top-12 -z-10 h-[420px] w-[420px] rounded-full bg-[#d9f5ef]/80 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-8 -z-10 h-[420px] w-[420px] rounded-full bg-[#fff0dc]/80 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.28] [background-image:linear-gradient(rgba(8,123,117,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(8,123,117,0.04)_1px,transparent_1px)] [background-size:44px_44px]"
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14 xl:px-10 xl:py-16">
        <section className="overflow-hidden rounded-[22px] border border-white/90 bg-white/90 p-5 shadow-[0_28px_75px_-50px_rgba(15,23,42,0.48)] backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.75fr] lg:items-center lg:gap-10">
            <div>
              <Link
                href="/"
                aria-label="Arogga home"
                className="inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#087b75] focus-visible:ring-offset-4"
              >
                <img
                  src={IMAGE_URLS.logo}
                  alt="Arogga"
                  width={184}
                  height={64}
                  draggable={false}
                  className="h-[52px] w-auto object-contain sm:h-[58px]"
                />
              </Link>

              <p className="mt-4 max-w-[470px] text-[16px] leading-7 text-[#5f6b78]">
                Bangladesh&apos;s trusted healthcare
                platform for authentic medicines, doctor
                consultation, lab tests and everyday
                wellness support.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <QuickContact
                  href="tel:09610016778"
                  icon={<Phone size={18} />}
                  title="Hotline"
                  value="09610016778"
                />

                <QuickContact
                  href="https://wa.me/8801810117100"
                  icon={<MessageCircle size={18} />}
                  title="WhatsApp"
                  value="01810117100"
                  external
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[20px] border border-[#d8eae7] bg-gradient-to-br from-[#edf9f7] via-white to-[#fffaf3] p-5 sm:p-6 lg:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full border-[24px] border-white/60"
              />

              <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-xl">
                  <div className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#d5eae6] bg-white/90 px-3 text-[13px] font-bold text-[#087b75] shadow-sm">
                    <Sparkles size={16} />

                    Health updates and offers
                  </div>

                  <h2 className="mt-4 max-w-[620px] text-[20px] font-extrabold leading-[1.4] tracking-[-0.025em] text-[#101828]">
                    Get useful healthcare updates in your
                    inbox
                  </h2>

                  <p className="mt-3 max-w-[600px] text-[13px] leading-6 text-[#667085]">
                    Subscribe for health tips, product
                    updates, service news and selected
                    offers.
                  </p>
                </div>

                <form
                  onSubmit={submitNewsletter}
                  className="w-full xl:max-w-[480px]"
                  noValidate
                >
                  <div
                    className={[
                      "flex min-h-[50px] overflow-hidden rounded-[12px] border bg-white shadow-sm transition-all duration-300",
                      status === "error"
                        ? "border-[#f04438] ring-4 ring-[#f04438]/10"
                        : "border-[#d3e0de] focus-within:border-[#087b75] focus-within:ring-4 focus-within:ring-[#087b75]/10",
                    ].join(" ")}
                  >
                    <span className="flex shrink-0 items-center pl-4 text-[#667085]">
                      <Mail size={18} />
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);

                        if (status !== "idle") {
                          setStatus("idle");
                        }
                      }}
                      placeholder="Enter your email address"
                      aria-label="Email address"
                      aria-invalid={
                        status === "error"
                      }
                      className="min-w-0 flex-1 bg-transparent px-3 text-[13px] text-[#101828] outline-none placeholder:text-[#98a2b3]"
                    />

                    <button
                      type="submit"
                      className="m-1 inline-flex min-w-[112px] shrink-0 items-center justify-center gap-2 rounded-[9px] bg-[#087b75] px-4 text-[13px] font-bold text-white transition-all duration-300 hover:bg-[#066b66] hover:shadow-md active:scale-[0.98]"
                    >
                      <span className="hidden sm:inline">
                        Subscribe
                      </span>

                      <Send size={16} />
                    </button>
                  </div>

                  <div
                    aria-live="polite"
                    className="mt-2 min-h-5 text-[13px]"
                  >
                    {status === "success" && (
                      <p className="flex items-center gap-2 font-medium text-[#087b75]">
                        <Check size={16} />
                        Subscribed successfully.
                      </p>
                    )}

                    {status === "error" && (
                      <p className="font-medium text-[#d92d20]">
                        Please enter a valid email address.
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="Why customers trust Arogga"
          className="mt-7 grid gap-4 sm:grid-cols-2 lg:mt-8 xl:grid-cols-4"
        >
          <TrustCard
            image={IMAGE_URLS.authenticity}
            title="Authentic Products"
            description="Products sourced from verified manufacturers, importers and distributors."
          />

          <TrustCard
            image={IMAGE_URLS.customerCentric}
            title="Customer First"
            description="Our customers remain at the heart of every healthcare service and decision."
          />

          <TrustCard
            image={IMAGE_URLS.techDriven}
            title="Technology Driven"
            description="Modern technology powers faster, safer and more dependable healthcare."
          />

          <TrustCard
            icon={<Truck size={26} />}
            title="Nationwide Delivery"
            description="Secure delivery support across Bangladesh through trusted logistics partners."
          />
        </section>

        <section className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-7 xl:gap-10">
          {footerSections.map((section) => (
            <FooterColumn
              key={section.title}
              section={section}
              open={openSection === section.title}
              onToggle={() => {
                setOpenSection((current) =>
                  current === section.title
                    ? null
                    : section.title,
                );
              }}
            />
          ))}

          <ContactInfo />
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[1.7fr_1fr]">
          <PartnerPanel
            title="Online Payment Partners"
            subtitle="Secure payments verified by"
            verifier={
              <img
                src={IMAGE_URLS.sslCommerz}
                alt="SSLCommerz"
                width={100}
                height={22}
                loading="lazy"
                draggable={false}
                className="h-[20px] w-auto object-contain"
              />
            }
            partners={paymentPartners}
          />

          <PartnerPanel
            title="Delivery Partners"
            subtitle="Trusted logistics network"
            partners={logisticsPartners}
          />
        </section>

        <section className="mt-10 grid gap-7 rounded-[22px] border border-[#dde8e6] bg-white/90 p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.38)] backdrop-blur-lg sm:p-6 md:grid-cols-2 xl:grid-cols-[1.1fr_1fr_1fr] xl:gap-8">
          <div>
            <FooterHeading
              icon={<Smartphone size={18} />}
            >
              Download Our App
            </FooterHeading>

            <p className="mt-3 max-w-md text-[13px] leading-6 text-[#667085]">
              Order medicines, book doctors and track
              healthcare services directly from your
              phone.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <StoreBadge
                href="#"
                src={IMAGE_URLS.googlePlay}
                alt="Get it on Google Play"
              />

              <StoreBadge
                href="#"
                src={IMAGE_URLS.appStore}
                alt="Download on the App Store"
              />
            </div>
          </div>

          <div>
            <FooterHeading
              icon={<HeartPulse size={18} />}
            >
              Connect With Us
            </FooterHeading>

            <p className="mt-3 max-w-md text-[13px] leading-6 text-[#667085]">
              Follow Arogga for healthcare updates,
              wellness tips and community stories.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
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

          <div className="md:col-span-2 xl:col-span-1">
            <FooterHeading
              icon={<ShieldCheck size={18} />}
            >
              Business Verification
            </FooterHeading>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoCard
                title="Trade License"
                value="TRAD/DNCC/057602/2022"
              />

              <InfoCard
                title="DBID"
                value="915741315"
              />
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-4 border-t border-[#dce6e4] pt-6 text-[13px] leading-6 text-[#667085] lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {currentYear} Arogga Limited. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy-policy"
              className="font-medium transition-colors hover:text-[#087b75]"
            >
              Privacy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="font-medium transition-colors hover:text-[#087b75]"
            >
              Terms
            </Link>

            <Link
              href="/faq"
              className="font-medium transition-colors hover:text-[#087b75]"
            >
              Help
            </Link>

            <span className="inline-flex items-center gap-2">
              Made with
              <HeartPulse
                size={16}
                className="text-[#ef4545]"
              />
              in Bangladesh
            </span>
          </div>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}

function QuickContact({
  href,
  icon,
  title,
  value,
  external = false,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  value: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={
        external
          ? "noopener noreferrer"
          : undefined
      }
      className="group inline-flex min-h-[58px] min-w-0 items-center gap-3 rounded-[12px] border border-[#d9e6e3] bg-white px-3 py-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#087b75]/35 hover:shadow-[0_14px_28px_-18px_rgba(8,123,117,0.45)] sm:min-w-[190px]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#eaf8f5] text-[#087b75] transition-all duration-300 group-hover:rotate-[-4deg] group-hover:scale-105 group-hover:bg-[#087b75] group-hover:text-white">
        {icon}
      </span>

      <span className="min-w-0 leading-tight">
        <span className="block text-[13px] text-[#667085]">
          {title}
        </span>

        <strong className="mt-1 block truncate text-[16px] font-bold text-[#101828]">
          {value}
        </strong>
      </span>
    </a>
  );
}

function TrustCard({
  image,
  icon,
  title,
  description,
}: {
  image?: string;
  icon?: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[18px] border border-[#dfeae7] bg-white/90 p-5 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.42)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#aedad4] hover:shadow-[0_26px_56px_-34px_rgba(8,123,117,0.34)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[#edf9f7] transition-transform duration-500 group-hover:scale-125"
      />

      <div className="relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-[#edf9f7] text-[#087b75] transition-all duration-300 group-hover:rotate-[-5deg] group-hover:scale-105 group-hover:bg-[#087b75] group-hover:text-white">
          {image ? (
            <img
              src={image}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              draggable={false}
              className="h-10 w-10 object-contain"
            />
          ) : (
            icon
          )}
        </div>

        <h3 className="mt-4 text-[16px] font-bold leading-6 text-[#101828]">
          {title}
        </h3>

        <p className="mt-2 text-[13px] leading-6 text-[#667085]">
          {description}
        </p>
      </div>
    </article>
  );
}

function FooterColumn({
  section,
  open,
  onToggle,
}: {
  section: FooterSection;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-h-12 w-full items-center justify-between gap-3 border-b border-[#dfe7e5] pb-3 text-left outline-none focus-visible:text-[#087b75] lg:pointer-events-none lg:min-h-0 lg:border-0 lg:pb-0"
      >
        <span className="text-[18px] font-bold leading-6 text-[#101828]">
          {section.title}
        </span>

        <ChevronDown
          size={18}
          className={[
            "shrink-0 text-[#667085] transition-transform duration-300 lg:hidden",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      <nav
        aria-label={section.title}
        className={[
          "grid overflow-hidden transition-[grid-template-rows,margin] duration-300 lg:mt-4 lg:grid-rows-[1fr]",
          open
            ? "mt-3 grid-rows-[1fr]"
            : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-2.5">
            {section.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group inline-flex w-fit items-center gap-2 py-1 text-[13px] leading-6 text-[#5f6b78] transition-all duration-300 hover:translate-x-1 hover:text-[#087b75]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#c8d8d5] transition-colors group-hover:bg-[#087b75]" />

                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

function ContactInfo() {
  const [copied, setCopied] =
    useState<string | null>(null);

  const copyText = async (
    value: string,
    key: string,
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);

      window.setTimeout(() => {
        setCopied(null);
      }, 1500);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div>
      <h3 className="text-[18px] font-bold leading-6 text-[#101828]">
        Contact Info
      </h3>

      <div className="mt-4 flex flex-col gap-3">
        <ContactCard
          icon={<Phone size={18} />}
          label="Hotline"
          value="09610016778"
          href="tel:09610016778"
          onCopy={() => {
            void copyText(
              "09610016778",
              "phone",
            );
          }}
          copied={copied === "phone"}
        />

        <ContactCard
          icon={<MessageCircle size={18} />}
          label="WhatsApp"
          value="01810117100"
          href="https://wa.me/8801810117100"
          external
          onCopy={() => {
            void copyText(
              "01810117100",
              "whatsapp",
            );
          }}
          copied={copied === "whatsapp"}
        />

        <div className="flex gap-3 rounded-[12px] border border-[#dfe8e6] bg-white/85 p-3 shadow-sm">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#edf9f7] text-[#087b75]">
            <MapPin size={18} />
          </span>

          <div className="min-w-0">
            <span className="block text-[13px] font-medium text-[#667085]">
              Head Office
            </span>

            <p className="mt-1 text-[13px] leading-6 text-[#344054]">
              D/15-1, Road-36, Block-D, Section-10,
              Mirpur, Dhaka-1216
            </p>
          </div>
        </div>

        <a
          href="mailto:support@arogga.com"
          className="inline-flex w-fit items-center gap-2 rounded-lg text-[13px] font-bold text-[#087b75] transition hover:text-[#055f5a] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087b75]"
        >
          <Mail size={16} />
          support@arogga.com
        </a>
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  external = false,
  onCopy,
  copied,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-[12px] border border-[#dfe8e6] bg-white/85 p-3 shadow-sm transition-all duration-300 hover:border-[#b8d9d4] hover:shadow-md">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#edf9f7] text-[#087b75] transition-all duration-300 group-hover:bg-[#087b75] group-hover:text-white">
        {icon}
      </span>

      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={
          external
            ? "noopener noreferrer"
            : undefined
        }
        className="min-w-0 flex-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#087b75]"
      >
        <span className="block text-[13px] text-[#667085]">
          {label}
        </span>

        <strong className="mt-1 block truncate text-[16px] font-bold text-[#101828]">
          {value}
        </strong>
      </a>

      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] transition-all duration-300",
          copied
            ? "bg-[#087b75] text-white"
            : "text-[#667085] hover:bg-[#edf9f7] hover:text-[#087b75]",
        ].join(" ")}
      >
        {copied ? (
          <Check size={16} />
        ) : (
          <Copy size={16} />
        )}
      </button>
    </div>
  );
}

function PartnerPanel({
  title,
  subtitle,
  verifier,
  partners,
}: {
  title: string;
  subtitle: string;
  verifier?: ReactNode;
  partners: PartnerLogo[];
}) {
  return (
    <div className="rounded-[20px] border border-[#dfe8e6] bg-white/90 p-5 shadow-[0_20px_46px_-38px_rgba(15,23,42,0.4)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-[18px] font-bold leading-6 text-[#101828]">
            {title}
          </h3>

          <p className="mt-1 text-[13px] leading-5 text-[#667085]">
            {subtitle}
          </p>
        </div>

        {verifier}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 xl:flex xl:flex-wrap">
        {partners.map((partner) => (
          <PartnerImage
            key={partner.name}
            partner={partner}
          />
        ))}
      </div>
    </div>
  );
}

function PartnerImage({
  partner,
}: {
  partner: PartnerLogo;
}) {
  return (
    <div
      title={partner.name}
      className="group flex h-[46px] min-w-0 items-center justify-center rounded-[11px] border border-[#dce5e3] bg-white px-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#aedad4] hover:shadow-md xl:min-w-[74px] xl:px-3"
    >
      <img
        src={partner.src}
        alt={partner.name}
        width={64}
        height={28}
        loading="lazy"
        draggable={false}
        onError={(event) => {
          event.currentTarget.style.display =
            "none";
        }}
        className="max-h-[25px] max-w-full object-contain transition-transform duration-300 group-hover:scale-105 xl:max-w-[64px]"
      />
    </div>
  );
}

function FooterHeading({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 text-[18px] font-bold leading-6 text-[#101828]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-[#edf9f7] text-[#087b75]">
        {icon}
      </span>

      {children}
    </h3>
  );
}

function StoreBadge({
  href,
  src,
  alt,
}: {
  href: string;
  src: string;
  alt: string;
}) {
  return (
    <a
      href={href}
      aria-label={alt}
      className="inline-flex rounded-[9px] outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#087b75] focus-visible:ring-offset-2"
    >
      <img
        src={src}
        alt={alt}
        width={124}
        height={38}
        draggable={false}
        className="h-9 w-auto object-contain sm:h-[38px]"
      />
    </a>
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
      className="group inline-flex h-11 w-11 items-center justify-center rounded-[11px] border border-[#dce6e4] bg-white shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:border-[#aedad4] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#087b75] focus-visible:ring-offset-2"
    >
      <img
        src={src}
        alt=""
        width={24}
        height={24}
        loading="lazy"
        draggable={false}
        className="h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-110"
      />
    </a>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[12px] border border-[#dfe8e6] bg-[#f7fbfa] p-4 transition-all duration-300 hover:border-[#b9dad5] hover:bg-white hover:shadow-sm">
      <span className="block text-[13px] font-medium text-[#667085]">
        {title}
      </span>

      <strong className="mt-1 block break-words text-[16px] font-bold leading-6 text-[#101828]">
        {value}
      </strong>
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      window.cancelAnimationFrame(frameId);

      frameId = window.requestAnimationFrame(
        () => {
          const scrollTop = window.scrollY;

          const totalScroll =
            document.documentElement.scrollHeight -
            window.innerHeight;

          setVisible(scrollTop > 350);

          setProgress(
            totalScroll > 0
              ? Math.min(
                  (scrollTop / totalScroll) * 100,
                  100,
                )
              : 0,
          );
        },
      );
    };

    update();

    window.addEventListener("scroll", update, {
      passive: true,
    });

    window.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener(
        "scroll",
        update,
      );
      window.removeEventListener(
        "resize",
        update,
      );
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
      aria-label="Back to top"
      className={[
        "fixed bottom-5 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_16px_34px_-15px_rgba(8,123,117,0.88)] transition-all duration-300 hover:-translate-y-1 md:bottom-8 md:right-8",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
      style={{
        backgroundImage: `conic-gradient(
          #43d4c2 ${progress}%,
          #087b75 ${progress}%
        )`,
      }}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#087b75] transition-transform duration-300 hover:scale-105">
        <ArrowUp size={20} />
      </span>
    </button>
  );
}