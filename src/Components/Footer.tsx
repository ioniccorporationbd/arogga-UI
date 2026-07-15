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
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const [email, setEmail] = useState("");

  const [status, setStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const [openSection, setOpenSection] =
    useState<string | null>("Quick Links");

  const submitNewsletter = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalized = email.trim().toLowerCase();

    const isValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);

    if (!isValid) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
  };

  return (
    <footer className="relative isolate overflow-hidden border-t border-[#e4ebe9] bg-[#f8fbfa] text-[#111827]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-12 -z-10 h-96 w-96 rounded-full bg-[#dff7f2] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-10 -z-10 h-96 w-96 rounded-full bg-[#fff0dc] blur-3xl"
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <section className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_26px_70px_-48px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.85fr] lg:items-center">
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
                  className="h-[58px] w-auto object-contain"
                />
              </Link>

              <p className="mt-4 max-w-[470px] text-[15px] leading-7 text-[#5f6b78]">
                Bangladesh&apos;s primary healthcare
                platform for authentic medicines, doctor
                consultation, lab tests and wellness
                support.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <QuickContact
                  href="tel:09610016778"
                  icon={<Phone size={17} />}
                  title="Hotline"
                  value="09610016778"
                />

                <QuickContact
                  href="https://wa.me/8801810117100"
                  icon={<MessageCircle size={17} />}
                  title="WhatsApp"
                  value="01810117100"
                  external
                />
              </div>
            </div>

            <div className="rounded-[22px] border border-[#dcebe8] bg-gradient-to-br from-[#effaf8] to-white p-5 sm:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#087b75] shadow-sm">
                    <Sparkles size={14} />
                    Health updates and offers
                  </div>

                  <h2 className="mt-3 text-[24px] font-bold tracking-[-0.03em] text-[#101828] sm:text-[28px]">
                    Get useful healthcare updates in your
                    inbox
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    Subscribe for health tips, service
                    updates and exclusive offers.
                  </p>
                </div>

                <form
                  onSubmit={submitNewsletter}
                  className="w-full md:max-w-[430px]"
                  noValidate
                >
                  <div
                    className={`flex min-h-12 overflow-hidden rounded-xl border bg-white shadow-sm transition ${
                      status === "error"
                        ? "border-[#f04438] ring-4 ring-[#f04438]/10"
                        : "border-[#d6e1df] focus-within:border-[#087b75] focus-within:ring-4 focus-within:ring-[#087b75]/10"
                    }`}
                  >
                    <span className="flex items-center pl-4 text-[#667085]">
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
                      className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#98a2b3]"
                    />

                    <button
                      type="submit"
                      className="m-1 inline-flex min-w-[110px] items-center justify-center gap-2 rounded-lg bg-[#087b75] px-4 text-sm font-semibold text-white transition hover:bg-[#066b66] active:scale-[0.98]"
                    >
                      Subscribe
                      <Send size={15} />
                    </button>
                  </div>

                  <div className="mt-2 min-h-5 text-xs">
                    {status === "success" && (
                      <p className="flex items-center gap-1.5 text-[#087b75]">
                        <Check size={14} />
                        Subscribed successfully.
                      </p>
                    )}

                    {status === "error" && (
                      <p className="text-[#d92d20]">
                        Please enter a valid email address.
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <TrustCard
            image={IMAGE_URLS.authenticity}
            title="Authentic Products"
            description="Products sourced from verified manufacturers, importers and distributors."
          />

          <TrustCard
            image={IMAGE_URLS.customerCentric}
            title="Customer First"
            description="Our customers remain at the heart of every service and decision."
          />

          <TrustCard
            image={IMAGE_URLS.techDriven}
            title="Technology Driven"
            description="Modern technology powers faster, safer and more reliable healthcare."
          />

          <TrustCard
            icon={<Truck size={26} />}
            title="Nationwide Delivery"
            description="Secure delivery support across Bangladesh through trusted logistics partners."
          />
        </section>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr_1fr_1.15fr] lg:gap-8">
          {footerSections.map((section) => (
            <FooterColumn
              key={section.title}
              section={section}
              open={openSection === section.title}
              onToggle={() =>
                setOpenSection((current) =>
                  current === section.title
                    ? null
                    : section.title,
                )
              }
            />
          ))}

          <ContactInfo />
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1.8fr_1fr]">
          <PartnerPanel
            title="Online Payment Partners"
            subtitle="Secure payments verified by"
            verifier={
              <img
                src={IMAGE_URLS.sslCommerz}
                alt="SSLCommerz"
                width={100}
                height={22}
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

        <section className="mt-10 grid gap-6 rounded-[24px] border border-[#e0e9e7] bg-white/85 p-5 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.4)] sm:p-6 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <FooterHeading icon={<Smartphone size={18} />}>
              Download Our App
            </FooterHeading>

            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Order medicines, book doctors and track
              services from your phone.
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
            <FooterHeading icon={<HeartPulse size={18} />}>
              Connect With Us
            </FooterHeading>

            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Follow Arogga for updates, health tips and
              community stories.
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

          <div>
            <FooterHeading icon={<ShieldCheck size={18} />}>
              Business Verification
            </FooterHeading>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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

        <div className="mt-8 flex flex-col gap-4 border-t border-[#dfe7e5] pt-6 text-sm text-[#667085] md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} Arogga Limited. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy-policy"
              className="transition hover:text-[#087b75]"
            >
              Privacy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="transition hover:text-[#087b75]"
            >
              Terms
            </Link>

            <Link
              href="/faq"
              className="transition hover:text-[#087b75]"
            >
              Help
            </Link>

            <span className="inline-flex items-center gap-1.5">
              Made with
              <HeartPulse
                size={14}
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
      rel={external ? "noopener noreferrer" : undefined}
      className="group inline-flex items-center gap-3 rounded-xl border border-[#dbe7e4] bg-white px-3 py-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#087b75]/30 hover:shadow-md"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf8f5] text-[#087b75] transition group-hover:bg-[#087b75] group-hover:text-white">
        {icon}
      </span>

      <span className="leading-tight">
        <small className="block text-[11px] text-[#667085]">
          {title}
        </small>

        <strong className="text-sm text-[#101828]">
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
    <article className="group rounded-[20px] border border-[#e2ebe9] bg-white/85 p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-[#087b75]/20 hover:shadow-[0_24px_50px_-34px_rgba(8,123,117,0.35)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eef9f7] text-[#087b75] transition duration-300 group-hover:scale-105 group-hover:bg-[#087b75] group-hover:text-white">
        {image ? (
          <img
            src={image}
            alt=""
            width={48}
            height={48}
            loading="lazy"
            className="h-10 w-10 object-contain"
          />
        ) : (
          icon
        )}
      </div>

      <h3 className="mt-4 text-[16px] font-semibold text-[#101828]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#667085]">
        {description}
      </p>
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
        className="flex w-full items-center justify-between gap-3 border-b border-[#e4eae8] pb-3 text-left lg:pointer-events-none lg:border-0 lg:pb-0"
        aria-expanded={open}
      >
        <span className="text-[17px] font-semibold text-[#101828]">
          {section.title}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform lg:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <nav
        className={`grid overflow-hidden transition-all duration-300 lg:mt-4 lg:grid-rows-[1fr] ${
          open
            ? "mt-3 grid-rows-[1fr]"
            : "grid-rows-[0fr] lg:grid-rows-[1fr]"
        }`}
        aria-label={section.title}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-3">
            {section.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="w-fit text-sm leading-6 text-[#5f6b78] transition hover:translate-x-1 hover:text-[#087b75]"
              >
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
      <h3 className="text-[17px] font-semibold text-[#101828]">
        Contact Info
      </h3>

      <div className="mt-4 flex flex-col gap-3">
        <ContactCard
          icon={<Phone size={17} />}
          label="Hotline"
          value="09610016778"
          href="tel:09610016778"
          onCopy={() =>
            copyText("09610016778", "phone")
          }
          copied={copied === "phone"}
        />

        <ContactCard
          icon={<MessageCircle size={17} />}
          label="WhatsApp"
          value="01810117100"
          href="https://wa.me/8801810117100"
          external
          onCopy={() =>
            copyText("01810117100", "whatsapp")
          }
          copied={copied === "whatsapp"}
        />

        <div className="flex gap-3 rounded-xl border border-[#e1e8e6] bg-white/80 p-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef8f6] text-[#087b75]">
            <MapPin size={17} />
          </span>

          <div>
            <span className="block text-xs font-medium text-[#667085]">
              Head Office
            </span>

            <p className="mt-1 text-sm leading-6 text-[#344054]">
              D/15-1, Road-36, Block-D, Section-10,
              Mirpur, Dhaka-1216
            </p>
          </div>
        </div>

        <a
          href="mailto:support@arogga.com"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#087b75] hover:underline"
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
    <div className="flex items-center gap-3 rounded-xl border border-[#e1e8e6] bg-white/80 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef8f6] text-[#087b75]">
        {icon}
      </span>

      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="min-w-0 flex-1"
      >
        <small className="block text-[11px] text-[#667085]">
          {label}
        </small>

        <strong className="text-sm text-[#101828]">
          {value}
        </strong>
      </a>

      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#667085] transition hover:bg-[#eef8f6] hover:text-[#087b75]"
      >
        {copied ? (
          <Check size={15} />
        ) : (
          <Copy size={15} />
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
    <div className="rounded-[22px] border border-[#e0e8e6] bg-white/85 p-5 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.4)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-semibold text-[#101828]">
            {title}
          </h3>

          <p className="mt-1 text-xs text-[#667085]">
            {subtitle}
          </p>
        </div>

        {verifier}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
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
    <div className="group flex h-[42px] min-w-[70px] items-center justify-center rounded-xl border border-[#dde5e3] bg-white px-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[#087b75]/25 hover:shadow-md">
      <img
        src={partner.src}
        alt={partner.name}
        width={58}
        height={26}
        loading="lazy"
        className="max-h-[24px] max-w-[62px] object-contain transition group-hover:scale-105"
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
    <h3 className="flex items-center gap-2 text-[16px] font-semibold text-[#101828]">
      <span className="text-[#087b75]">
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
      className="inline-flex rounded-lg transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <img
        src={src}
        alt={alt}
        width={118}
        height={36}
        className="h-9 w-auto object-contain"
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
      className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#dfe7e5] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#087b75]/25 hover:shadow-md"
    >
      <img
        src={src}
        alt=""
        width={24}
        height={24}
        loading="lazy"
        className="h-6 w-6 object-contain transition duration-300 group-hover:scale-110"
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
    <div className="rounded-xl border border-[#e2e9e7] bg-[#f8fbfa] p-3">
      <span className="block text-[11px] font-medium text-[#667085]">
        {title}
      </span>

      <strong className="mt-1 block break-words text-sm text-[#101828]">
        {value}
      </strong>
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;

      const total =
        document.documentElement.scrollHeight -
        window.innerHeight;

      setVisible(scrollTop > 350);

      setProgress(
        total > 0
          ? Math.min((scrollTop / total) * 100, 100)
          : 0,
      );
    };

    update();

    window.addEventListener("scroll", update, {
      passive: true,
    });

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      aria-label="Back to top"
      className={`fixed bottom-6 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_14px_30px_-14px_rgba(8,123,117,0.85)] transition-all duration-300 hover:-translate-y-1 md:bottom-8 md:right-8 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{
        backgroundImage: `conic-gradient(
          #43d4c2 ${progress}%,
          #087b75 ${progress}%
        )`,
      }}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#087b75]">
        <ArrowUp size={20} />
      </span>
    </button>
  );
}