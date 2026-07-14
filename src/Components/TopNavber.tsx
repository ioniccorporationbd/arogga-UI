"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ClipboardList,
  Inbox,
  MapPin,
  Search,
  ShoppingCart,
  UserRound,
  Zap,
} from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";

const navigationItems = [
  { label: "All", href: "/" },
  { label: "Store", href: "/store" },
  { label: "Lab", href: "/lab" },
  { label: "Doctor", href: "/doctor" },
] as const;

export default function TopNavber() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchText, setSearchText] = useState("");
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Bangladesh");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchText.trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const isActiveRoute = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-y border-[#e6e8eb] bg-white">
      <div className="mx-auto w-full max-w-[1420px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center gap-4 lg:gap-5">
          <Link href="/" aria-label="Arogga home" className="shrink-0">
            <Logo size="small" />
          </Link>

          <div className="relative hidden w-[255px] shrink-0 lg:block">
            <button
              type="button"
              onClick={() => setDeliveryOpen((value) => !value)}
              className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left hover:bg-[#f7f8f9]"
            >
              <span className="flex items-center gap-3">
                <MapPin size={27} strokeWidth={1.5} className="text-[#374151]" />
                <span className="leading-[18px]">
                  <span className="block text-[13px] text-[#111827]">Delivery To</span>
                  <span className="block text-[14px] font-semibold text-black">{selectedLocation}</span>
                </span>
              </span>
              <ChevronDown size={17} className={`transition-transform ${deliveryOpen ? "rotate-180" : ""}`} />
            </button>

            {deliveryOpen && (
              <div className="absolute left-0 top-[57px] z-50 w-full rounded-xl border border-[#e1e5e9] bg-white p-2 shadow-xl">
                {["Bangladesh", "Dhaka", "Chattogram", "Sylhet"].map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(location);
                      setDeliveryOpen(false);
                    }}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#303640] hover:bg-[#f5f7f8]"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSearch} className="flex min-w-0 flex-1">
            <div className="flex h-[46px] min-w-0 flex-1 items-center rounded-l-[13px] border border-r-0 border-[#dfe3e8] bg-white pl-3 focus-within:border-[#087b75]">
              <Search size={22} strokeWidth={1.6} className="mr-2 shrink-0 text-[#4b5563]" />
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder='Search "Products"'
                className="h-full min-w-0 flex-1 bg-transparent pr-4 text-[15px] outline-none"
              />
            </div>
            <button type="submit" className="h-[46px] shrink-0 rounded-r-[11px] bg-[#087b75] px-5 text-[15px] font-semibold text-white hover:bg-[#066b66]">
              Search
            </button>
          </form>

          <div className="hidden shrink-0 items-center xl:flex">
            <HeaderAction icon={<UserRound size={27} strokeWidth={1.45} />} title="Account" value="Login" href="/login" />
            <HeaderAction icon={<ClipboardList size={27} strokeWidth={1.45} />} title="Orders" value="0" href="/orders" />
            <HeaderAction icon={<Inbox size={27} strokeWidth={1.45} />} title="Inbox" value="0" href="/inbox" />
            <HeaderAction icon={<ShoppingCart size={29} strokeWidth={1.45} />} value="Cart" href="/cart" />
          </div>
        </div>

        <div className="relative hidden min-h-[45px] items-end md:flex">
          <Link href="/flash-sale" className="mb-[13px] flex items-center text-[14px] font-medium text-[#111827]">
            <Zap size={18} fill="#f5b52e" strokeWidth={0} className="mr-1" />
            Flash Sale&nbsp;<span className="font-normal">(Save upto 72%)</span>
          </Link>

          <nav className="absolute bottom-0 left-1/2 flex h-[45px] -translate-x-1/2 items-end gap-9 lg:gap-[54px]">
            {navigationItems.map((item) => {
              const active = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex h-full min-w-[42px] items-center justify-center px-1 pb-[13px] text-[14px] font-medium ${active ? "text-[#087b75]" : "text-[#111827]"}`}
                >
                  {item.label}
                  {active && <span className="navbar-active-line" />}
                </Link>
              );
            })}
          </nav>

          <button type="button" className="mb-[7px] ml-auto flex items-center gap-2 rounded-lg px-2 py-2 text-[14px] hover:bg-[#f5f7f8]">
            Order By <ChevronDown size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}

function HeaderAction({ icon, title, value, href }: { icon: ReactNode; title?: string; value: string; href: string }) {
  return (
    <Link href={href} className="flex min-w-[103px] items-center justify-center gap-3 rounded-xl px-3 py-2 hover:bg-[#f5f7f8]">
      <span className="shrink-0 text-[#343b46]">{icon}</span>
      <span className="leading-[17px]">
        {title && <span className="block text-[12px] text-[#3f4752]">{title}</span>}
        <span className="block text-[14px] font-medium text-[#111827]">{value}</span>
      </span>
    </Link>
  );
}

export function Logo({ size = "large" }: { size?: "small" | "large" }) {
  const large = size === "large";
  return (
    <div className={`flex items-center font-extrabold leading-none text-[#087b75] ${large ? "text-[49px] tracking-[-4px]" : "text-[35px] tracking-[-2.6px]"}`}>
      <span>ar</span>
      <span className={`relative mx-[1px] inline-flex shrink-0 items-center justify-center rounded-full border-[#087b75] ${large ? "h-[54px] w-[54px] border-[6px]" : "h-[35px] w-[35px] border-[4px]"}`}>
        <span className={`absolute rounded-full bg-[#ef4545] ${large ? "h-[38px] w-[38px]" : "h-[23px] w-[23px]"}`} />
        <span className={`absolute z-10 bg-white ${large ? "h-[26px] w-[7px]" : "h-[16px] w-[5px]"}`} />
        <span className={`absolute z-10 bg-white ${large ? "h-[7px] w-[26px]" : "h-[5px] w-[16px]"}`} />
      </span>
      <span>gga</span>
    </div>
  );
}
