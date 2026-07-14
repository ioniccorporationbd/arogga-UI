"use client";

import Link from "next/link";

type OfferCard = {
  id: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  phone?: string;
  buttonText: string;
  href: string;
  background: string;
  buttonColor: string;
  iconBackground: string;
  iconUrl: string;
  iconAlt: string;
  external?: boolean;
};

const cards: OfferCard[] = [
  {
    id: 1,
    eyebrow: "Order",
    title: "Via WhatsApp",
    phone: "01810117100",
    buttonText: "Call Now",
    href: "https://wa.me/8801810117100",
    background:
      "linear-gradient(135deg, #f4fff1 0%, #c5f0be 55%, #71d979 100%)",
    buttonColor: "#2fbd4e",
    iconBackground: "#3dc45b",
    iconUrl: "https://cdn.simpleicons.org/whatsapp/ffffff",
    iconAlt: "WhatsApp",
    external: true,
  },
  {
    id: 2,
    eyebrow: "UPTO",
    title: "10% OFF",
    subtitle: "+ Cashback",
    buttonText: "Upload Prescription",
    href: "/upload-prescription",
    background:
      "linear-gradient(135deg, #f0ffff 0%, #c4eff0 52%, #49c4ca 100%)",
    buttonColor: "#08a9bb",
    iconBackground: "#1eb5c5",
    iconUrl:
      "https://img.icons8.com/fluency-systems-filled/96/ffffff/prescription-pill-bottle.png",
    iconAlt: "Prescription",
  },
  {
    id: 3,
    eyebrow: "UPTO",
    title: "14% OFF",
    subtitle: "+ Cashback",
    buttonText: "Register Pharmacy",
    href: "/register-pharmacy",
    background:
      "linear-gradient(135deg, #fffdea 0%, #dff19b 52%, #91ca00 100%)",
    buttonColor: "#75b900",
    iconBackground: "#82c300",
    iconUrl:
      "https://img.icons8.com/ios-filled/96/ffffff/shop.png",
    iconAlt: "Pharmacy",
  },
  {
    id: 4,
    eyebrow: "UPTO",
    title: "60% OFF",
    subtitle: "+ Cashback",
    buttonText: "HealthCare",
    href: "/healthcare",
    background:
      "linear-gradient(135deg, #fffaff 0%, #dfcdfb 52%, #b28af7 100%)",
    buttonColor: "#a87df5",
    iconBackground: "#8d5cf3",
    iconUrl:
      "https://img.icons8.com/ios-filled/96/ffffff/medical-doctor.png",
    iconAlt: "Healthcare",
  },
  {
    id: 5,
    eyebrow: "UPTO",
    title: "10% OFF",
    phone: "16778",
    buttonText: "Call To Order",
    href: "tel:16778",
    background:
      "linear-gradient(135deg, #fff9ef 0%, #ffd5ae 52%, #ff9b58 100%)",
    buttonColor: "#ff7737",
    iconBackground: "#ff9142",
    iconUrl:
      "https://img.icons8.com/ios-filled/96/ffffff/headset.png",
    iconAlt: "Call center",
    external: true,
  },
  {
    id: 6,
    eyebrow: "UPTO",
    title: "25% OFF",
    buttonText: "Lab Test",
    href: "/lab",
    background:
      "linear-gradient(135deg, #fff7f5 0%, #ffc8c5 52%, #ff858b 100%)",
    buttonColor: "#ff5d63",
    iconBackground: "#ff6066",
    iconUrl:
      "https://img.icons8.com/ios-filled/96/ffffff/test-tube.png",
    iconAlt: "Lab test",
  },
];

export default function EspeciallyForYou() {
  return (
    <section className="w-full bg-white pb-8 pt-4">
      <div className="mx-auto w-full max-w-[1420px] px-3 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-[21px] font-semibold text-black">
          Especially For You
        </h2>

        <div className="offer-scroll flex gap-4 overflow-x-auto pb-1 lg:grid lg:grid-cols-6 lg:overflow-visible">
          {cards.map((card) => (
            <OfferCardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferCardItem({ card }: { card: OfferCard }) {
  const content = (
    <article
      className="group relative flex min-h-[198px] w-[195px] shrink-0 flex-col overflow-hidden rounded-[14px] px-4 pb-[9px] pt-8 transition duration-200 hover:-translate-y-1 hover:shadow-xl lg:w-full"
      style={{
        background: card.background,
      }}
    >
      <span
        className="absolute right-[3px] top-[3px] flex h-[65px] w-[65px] items-center justify-center rounded-full border-[5px] border-white/20 shadow-sm"
        style={{
          backgroundColor: card.iconBackground,
        }}
      >
        <img
          src={card.iconUrl}
          alt={card.iconAlt}
          width={38}
          height={38}
          loading="lazy"
          className="h-[36px] w-[36px] object-contain"
        />
      </span>

      <div className="flex flex-1 flex-col">
        <p className="mb-[18px] text-[18px] font-semibold leading-none text-black">
          {card.eyebrow}
        </p>

        <h3 className="text-[19px] font-bold leading-tight text-black">
          {card.title}
        </h3>

        {card.subtitle && (
          <p className="mt-1 text-[17px] leading-tight text-black">
            {card.subtitle}
          </p>
        )}

        {card.phone && (
          <p className="mt-1 flex items-center gap-2 text-[17px] text-black">
            {card.id === 5 && (
              <img
                src="https://img.icons8.com/ios-filled/40/bb1111/phone.png"
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px]"
              />
            )}

            {card.phone}
          </p>
        )}
      </div>

      <span
        className="mt-4 flex min-h-[41px] w-full items-center justify-center rounded-[9px] bg-white px-2 text-center text-[15px] font-semibold shadow-sm transition group-hover:shadow-md"
        style={{
          color: card.buttonColor,
        }}
      >
        {card.buttonText}
      </span>
    </article>
  );

  if (card.external) {
    return (
      <a
        href={card.href}
        target={card.href.startsWith("http") ? "_blank" : undefined}
        rel={
          card.href.startsWith("http")
            ? "noopener noreferrer"
            : undefined
        }
        className="block shrink-0"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={card.href} className="block shrink-0">
      {content}
    </Link>
  );
}