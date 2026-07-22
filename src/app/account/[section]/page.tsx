"use client";

import { Suspense, type FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { Camera, CheckCircle2, MapPin, Plus, UserRound } from "lucide-react";

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
        <MyOrdersPage embedded />
      </Suspense>
    );
  }

  if (section === "profile") {
    return (
      <div className="account-card">
        <h1>{title}</h1>
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
