"use client";

import Link from "next/link";
import { Suspense, type FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import {
  BadgePercent,
  Banknote,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronRight,
  FileText,
  Heart,
  HelpCircle,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  ShieldCheck,
  Star,
  UserRound,
  Users,
} from "lucide-react";

import MyOrdersPage from "../../orders/MyOrdersPage";
import "./section.css";

const titles: Record<string, string> = {
  profile: "View Profile",
  orders: "My Orders",
  balance: "Balance",
  offers: "Special Offers",
  prescriptions: "Prescriptions",
  addresses: "Delivery Addresses",
  patients: "Patients",
  reviews: "Product Reviews",
  support: "Support & Reports",
  blog: "Health Blog",
  faq: "Frequently Asked Questions",
  privacy: "Privacy Policy",
};

const profileOptions = [
  ["/account/orders", "My Orders", "Track products and delivery status", Package],
  ["/wishlist", "Wishlists", "Saved products for later", Heart],
  ["/account/addresses", "Delivery Address", "Manage saved addresses", MapPin],
  ["/account/reviews", "Product Review", "Review purchased products", Star],
  ["/account/balance", "Balance", "Wallet and refund balance", Banknote],
  ["/account/offers", "Offers", "Coupons and campaigns", BadgePercent],
  ["/account/prescriptions", "Prescriptions", "Upload prescription files", FileText],
  ["/account/patients", "Patients", "Family patient profiles", Users],
  ["/account/support", "Report", "Support and complaint center", MessageSquare],
  ["/account/blog", "Blog", "Helpful health articles", BookOpen],
  ["/account/faq", "FAQ", "Common account questions", HelpCircle],
  ["/account/privacy", "Privacy Policy", "Data and account safety", ShieldCheck],
] as const;

function ProfileOptionCards() {
  return (
    <section className="profile-options" aria-label="Profile quick actions">
      <div className="profile-options-head">
        <span>Account dashboard</span>
        <h2>All profile options</h2>
        <p>Everything from the old left menu is now placed directly on the profile page as interactive cards.</p>
      </div>
      <div className="profile-option-grid">
        {profileOptions.map(([href, title, text, Icon]) => <Link href={href} key={href} className="profile-option-card"><Icon /><div><strong>{title}</strong><small>{text}</small></div><ChevronRight /></Link>)}
      </div>
    </section>
  );
}

export default function Page() {
  const { section } = useParams<{ section: string }>();
  const [done, setDone] = useState(false);
  const title = titles[section] || "Account";

  function submit(event: FormEvent) {
    event.preventDefault();
    setDone(true);
    setTimeout(() => setDone(false), 2200);
  }

  if (section === "orders") {
    return (
      <Suspense fallback={<main className="orders-page"><section>Loading profile orders...</section></main>}>
        <MyOrdersPage />
      </Suspense>
    );
  }

  if (section === "profile") {
    return (
      <div className="profile-dashboard">
        <div className="account-card profile-card-modern">
          <div>
            <span className="profile-eyebrow">My profile</span>
            <h1>{title}</h1>
            <p>Update your account information and quickly access all dashboard options.</p>
          </div>
          <form onSubmit={submit}>
            <div className="profile-avatar"><UserRound /><span><Camera /></span></div>
            <div className="form-grid">
              <label>Full Name<input required placeholder="Your full name" /></label>
              <label>Gender<select><option>Select an option</option><option>Male</option><option>Female</option><option>Other</option></select></label>
              <label>Date of Birth<input type="date" /></label>
              <label>Email Address<input type="email" placeholder="you@example.com" /></label>
              <label>Mobile No<input value="+880****0010" readOnly /></label>
            </div>
            <button className="save">{done ? <><CheckCircle2 />Updated</> : "Update Profile"}</button>
          </form>
        </div>
        <ProfileOptionCards />
      </div>
    );
  }

  if (section === "addresses") {
    return (
      <div className="account-card">
        <h1>{title}</h1>
        <div className="empty-panel"><MapPin /><h2>No address added</h2><p>Add a delivery address for faster checkout.</p><button><Plus />Add New Address</button></div>
      </div>
    );
  }

  return (
    <div className="account-card">
      <h1>{title}</h1>
      <div className="empty-panel"><UserRound /><h2>{title}</h2><p>This section is ready and connected to your account dashboard.</p><button onClick={() => setDone(true)}>{done ? "Saved" : `Manage ${title}`}</button></div>
    </div>
  );
}
