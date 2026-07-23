"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useAccountDrawerStore, type AccountTab } from "../accountDrawerStore";
export type { AccountTab } from "../accountDrawerStore";
import AccountOverviewContent from "./AccountOverviewContent";
import OrdersContent from "./OrdersContent";
import InboxContent from "./InboxContent";
import WishlistContent from "./WishlistContent";
import AddressesContent from "./AddressesContent";
import PatientsContent from "./PatientsContent";
import PrescriptionsContent from "./PrescriptionsContent";
import ReviewsContent from "./ReviewsContent";
import WalletContent from "./WalletContent";
import OffersContent from "./OffersContent";
import SupportContent from "./SupportContent";

const tabs: Array<[AccountTab, string]> = [["overview","Overview"],["orders","Orders"],["inbox","Inbox"],["wishlist","Wishlist"],["addresses","Addresses"],["patients","Patients"],["prescriptions","Prescriptions"],["reviews","Reviews"],["wallet","Wallet"],["offers","Offers"],["support","Support"]];

export function AccountTabContent({ tab }: { tab: AccountTab }) {
  if (tab === "orders") return <OrdersContent />;
  if (tab === "inbox") return <InboxContent />;
  if (tab === "wishlist") return <WishlistContent />;
  if (tab === "addresses") return <AddressesContent />;
  if (tab === "patients") return <PatientsContent />;
  if (tab === "prescriptions") return <PrescriptionsContent />;
  if (tab === "reviews") return <ReviewsContent />;
  if (tab === "wallet") return <WalletContent />;
  if (tab === "offers") return <OffersContent />;
  if (tab === "support") return <SupportContent />;
  return <AccountOverviewContent />;
}

export default function AccountDrawer() {
  const { open, tab, closeDrawer, setTab } = useAccountDrawerStore();
  const ref = useRef<HTMLElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => ref.current?.focus(), 50);
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
      if (e.key === "Tab" && ref.current) {
        const focusable = ref.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", key);
    return () => { window.clearTimeout(timer); document.body.style.overflow = overflow; document.removeEventListener("keydown", key); lastFocus.current?.focus?.(); };
  }, [closeDrawer, open]);

  return <>
    <button aria-label="Close account drawer" className={`account-drawer-backdrop ${open ? "open" : ""}`} onClick={closeDrawer} type="button" />
    <aside ref={ref} tabIndex={-1} className={`account-drawer ${open ? "open" : ""}`} aria-hidden={!open} aria-label="Account drawer">
      <header><div><span>Arogga Account</span><h2>{tabs.find(([id])=>id===tab)?.[1]}</h2></div><button onClick={closeDrawer} aria-label="Close account"><X /></button></header>
      <nav>{tabs.map(([id,label]) => <button key={id} onClick={() => setTab(id)} className={tab===id ? "active" : ""}>{label}</button>)}</nav>
      <div className="account-drawer-body"><AccountTabContent tab={tab} /></div>
    </aside>
  </>;
}
