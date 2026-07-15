import Link from "next/link";
import Image from "next/image";

type Category = {
  id: number;
  name: string;
  href: string;
  image: string;
  imagePosition?: string;
};

const categories: Category[] = [
  {
    id: 1,
    name: "Medicine",
    href: "/medicine",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Beauty",
    href: "/beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Home Lab",
    href: "/lab",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Food & Nutrition",
    href: "/food-and-nutrition",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    name: "Baby & Mom Care",
    href: "/baby-mom-care",
    image:
      "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    name: "Homecare",
    href: "/home-care",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 7,
    name: "Pet Care",
    href: "/pet-care",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 8,
    name: "Healthcare",
    href: "/healthcare",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 9,
    name: "Herbal",
    href: "/herbal",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 10,
    name: "Sexual Wellness",
    href: "/sexual-wellness",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 11,
    name: "Supplement",
    href: "/supplement",
    image:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 12,
    name: "Veterinary",
    href: "/veterinary",
    image:
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 13,
    name: "Homeopathy",
    href: "/homeopathy",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 14,
    name: "Haircare",
    href: "/haircare",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 15,
    name: "Skincare",
    href: "/skincare",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 16,
    name: "Feminine Care",
    href: "/feminine-care",
    image:
      "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 17,
    name: "Medical Devices",
    href: "/medical-devices",
    image:
      "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 18,
    name: "Dermatological Preparations",
    href: "/dermatology",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85",
  },
];

export default function AllYouNeed() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-10 sm:py-12 lg:py-14">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#e9fbf8] blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-[#fff5d8] blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-7 flex flex-col gap-2 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#087b75] sm:text-sm">
              Shop by category
            </p>

            <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#111827] sm:text-3xl lg:text-[34px]">
              All You Need
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#667085] sm:text-base">
              Discover healthcare, wellness, beauty and everyday essentials in
              one convenient place.
            </p>
          </div>

          <Link
            href="/categories"
            className="group hidden items-center gap-2 text-sm font-semibold text-[#087b75] transition-colors hover:text-[#055f5a] sm:flex"
          >
            View all categories

            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M4.167 10h11.666M10.833 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/categories"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#cde9e6] bg-white px-6 text-sm font-semibold text-[#087b75] shadow-sm transition hover:border-[#087b75] hover:bg-[#f2fbfa]"
          >
            View all categories

            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <path
                d="M4.167 10h11.666M10.833 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={category.href}
      aria-label={`Browse ${category.name}`}
      className="group block min-w-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087b75] focus-visible:ring-offset-4"
    >
      <article className="h-full">
        <div className="relative overflow-hidden rounded-2xl border border-[#e8eeed] bg-white p-1.5 shadow-[0_8px_24px_-22px_rgba(15,23,42,0.4)] transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-[#cce8e5] group-hover:shadow-[0_18px_45px_-20px_rgba(8,123,117,0.35)] sm:p-2">
          <div className="relative aspect-[1/1.03] overflow-hidden rounded-[13px] bg-[#f4f7f6]">
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 17vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
              style={{
                objectPosition: category.imagePosition ?? "center",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 transition-opacity duration-300 group-hover:opacity-60" />

            <div className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/95 text-[#087b75] opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path
                  d="M4.167 10h11.666M10.833 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <h3 className="mt-3 line-clamp-2 min-h-10 px-1 text-center font-body text-[14px] font-semibold leading-5 sm:text-[15px] text-[#1f2937] transition-colors duration-300 group-hover:text-[#087b75]">
          {category.name}
        </h3>
      </article>
    </Link>
  );
}