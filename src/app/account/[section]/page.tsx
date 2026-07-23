import { AccountTabContent, type AccountTab } from "@/features/account/components/AccountDrawer";

const routeMap: Record<string, AccountTab> = {
  profile: "overview",
  overview: "overview",
  orders: "orders",
  inbox: "inbox",
  wishlist: "wishlist",
  addresses: "addresses",
  patients: "patients",
  prescriptions: "prescriptions",
  reviews: "reviews",
  wallet: "wallet",
  balance: "wallet",
  offers: "offers",
  support: "support",
  reports: "support",
};

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <AccountTabContent tab={routeMap[section] || "overview"} />;
}
