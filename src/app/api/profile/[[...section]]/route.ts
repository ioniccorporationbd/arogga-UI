import { NextRequest, NextResponse } from "next/server";
import type { ProfileDashboardData, ProfileSection } from "@/types/profile";

const image = "https://images.unsplash.com/photo-1606813902914-5f8f7ec4d1ad?auto=format&fit=crop&w=500&q=80";
const product = "https://i.dummyjson.com/data/products/1/thumbnail.jpg";
const medicine = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80";
const delivery = "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=500&q=80";
const doctor = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80";
const support = "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=500&q=80";

function buildData(phone = "01711111111"): ProfileDashboardData {
  const records = {
    profile: [],
    balance: ["Balance added", "Order payment", "Refund", "Cashback", "Promotional credit", "Withdrawal"].map((title, index) => ({ id: `TXN-${index + 1}`, title, subtitle: index % 2 ? "bKash wallet transaction" : "Arogga balance update", status: index % 3 ? "Completed" : "Pending", amount: [1200, -450, 220, 90, 150, -300][index], date: `2026-07-${20 - index}`, image: index % 2 ? support : delivery })),
    offers: ["Health saver coupon", "Bank card discount", "Payment cashback", "Baby care deal", "Expiring wellness offer"].map((title, index) => ({ id: `OFFER-${index + 1}`, title, subtitle: "Copy, save, apply, or view eligible products", status: index === 4 ? "Expiring Soon" : "Eligible", amount: 100 + index * 50, date: `2026-08-${10 + index}`, image: index % 2 ? product : medicine })),
    orders: [],
    wishlist: ["Sports Sneakers", "Perfume", "Vitamin C", "Baby Lotion"].map((title, index) => ({ id: `WISH-${index + 1}`, title, subtitle: "Brand product saved for later", status: index === 2 ? "Out of stock" : "In stock", image: product, amount: 450 + index * 110, meta: "Rating 4.6 • Delivery 2 days" })),
    prescriptions: ["Prescription for fever", "Cardiology follow-up", "Child care medicine"].map((title, index) => ({ id: `RX-${index + 1}`, title, subtitle: "Dr. Rahman • Popular Diagnostic", status: index === 1 ? "Verified" : index === 2 ? "Rejected" : "Pending verification", image, date: `2026-07-${18 - index}` })),
    addresses: ["Home address", "Office address", "Hospital delivery"].map((title, index) => ({ id: `ADDR-${index + 1}`, title, subtitle: "Mirpur, Dhaka, Bangladesh", status: index === 0 ? "Default" : "Saved", meta: "Detect location and pin map ready", image: delivery })),
    patients: ["Mohammed Tamim Hasan", "Mother", "Father"].map((title, index) => ({ id: `PAT-${index + 1}`, title, subtitle: index ? "Family patient profile" : "Default patient", status: index ? "Private" : "Default", meta: "Blood group, allergies, conditions, prescriptions", image: index ? doctor : image })),
    reviews: ["Review Sports Sneakers", "Published perfume review", "Draft healthcare review"].map((title, index) => ({ id: `REV-${index + 1}`, title, subtitle: "Product, delivery and seller rating", status: ["Pending", "Published", "Draft"][index], image: product, date: `2026-07-${12 + index}` })),
    reports: ["Order delivery problem", "Payment refund issue", "Prescription support"].map((title, index) => ({ id: `RPT-${index + 1}`, title, subtitle: "Ticket conversation with support", status: ["Open", "In Progress", "Resolved"][index], date: `2026-07-${10 + index}`, image: support })),
    inbox: [
      { id: "INBOX-1", title: "Order ARG-20260701 is out for delivery", subtitle: "Rider assigned. Keep your mobile active for medicine delivery confirmation.", status: "Unread", date: "2026-07-22", image: delivery, meta: "Order update • High priority" },
      { id: "INBOX-2", title: "Prescription RX-1 needs clearer image", subtitle: "Upload a brighter photo or PDF so the pharmacy team can verify quickly.", status: "Action Needed", date: "2026-07-21", image: medicine, meta: "Healthcare alert" },
      { id: "INBOX-3", title: "Support replied to refund ticket", subtitle: "Your bKash refund is under review and expected within 24 hours.", status: "Support Reply", date: "2026-07-20", image: support, meta: "Ticket RPT-2" },
      { id: "INBOX-4", title: "Exclusive wellness coupon unlocked", subtitle: "Use HEALTH120 on eligible healthcare products before midnight.", status: "Offer", date: "2026-07-19", image: product, meta: "Coupon • Expiring soon" },
    ],
    blog: ["Medicine safety guide", "Healthy lifestyle tips", "How to read prescriptions", "Product care guide"].map((title, index) => ({ id: `BLOG-${index + 1}`, title, subtitle: "Featured healthcare article with save/share/read actions", status: index ? "Latest" : "Featured", image, date: `2026-07-${8 + index}`, meta: "5 min read" })),
    faq: ["How do I track an order?", "How do refunds work?", "Can I upload prescription PDF?", "How to delete account?"].map((title, index) => ({ id: `FAQ-${index + 1}`, title, subtitle: "Helpful account answer with copy/helpful actions", status: index < 2 ? "Popular" : "Account", meta: "Expandable answer" })),
    "privacy-policy": ["Information collected", "Health information", "Payment data", "User rights", "Account deletion", "Security"].map((title, index) => ({ id: `POL-${index + 1}`, title, subtitle: "Readable privacy policy section", status: "Updated", date: `2026-07-${1 + index}` })),
  } satisfies ProfileDashboardData["records"];
  return {
    user: { name: "Mohammed Tamim Hasan", phone, email: "tamim@example.com", avatar: image, verified: true, language: "English", bloodGroup: "B+", createdAt: "2026-01-10", emergencyContact: "+8801700000000", defaultAddress: "Mirpur, Dhaka" },
    stats: [
      { label: "Total Orders", value: "12", help: "3 active deliveries" },
      { label: "Wallet Balance", value: "৳2,430", help: "৳420 pending" },
      { label: "Saved Items", value: "24", help: "18 available" },
      { label: "Support Tickets", value: "3", help: "1 open" },
    ],
    records,
    notifications: [
      { id: "N-1", title: "Order update", body: "ARG-20260701 is processing", read: false, href: "/profile/orders" },
      { id: "N-2", title: "Offer", body: "Healthcare coupon expires soon", read: false, href: "/profile/offers" },
      { id: "N-3", title: "Prescription", body: "RX-1 verification pending", read: true, href: "/profile/prescriptions" },
    ],
  };
}

function auth(request: NextRequest) {
  return request.headers.get("x-user-phone") || request.nextUrl.searchParams.get("phone");
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ section?: string[] }> }) {
  const phone = auth(request);
  const section = ((await params).section?.[0] || "profile") as ProfileSection;
  const data = buildData(phone || "01711111111");
  return NextResponse.json({ section, data: { ...data, sectionRecords: data.records[section] || [] } });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ section?: string[] }> }) {
  const body = await request.json().catch(() => ({}));
  const section = ((await params).section?.[0] || "profile") as ProfileSection;
  return NextResponse.json({ ok: true, section, id: `${section.toUpperCase()}-${Date.now()}`, message: "Action completed", body });
}
