import { redirect } from "next/navigation";

const routeMap: Record<string, string> = {
  profile: "/profile",
  balance: "/profile/balance",
  offers: "/profile/offers",
  orders: "/profile/orders",
  wishlist: "/profile/wishlist",
  prescriptions: "/profile/prescriptions",
  addresses: "/profile/addresses",
  patients: "/profile/patients",
  reviews: "/profile/reviews",
  support: "/profile/reports",
  reports: "/profile/reports",
  inbox: "/profile/inbox",
  blog: "/profile/blog",
  faq: "/profile/faq",
  privacy: "/profile/privacy-policy",
};

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  redirect(routeMap[section] || "/profile");
}
