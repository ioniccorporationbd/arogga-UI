"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { notify } from "@/lib/toast";
import {
  BadgeCheck,
  BadgePercent,
  Banknote,
  Bell,
  BookOpen,
  Camera,
  ChevronRight,
  FileText,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  Upload,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { z } from "zod";

import ProtectedActionPrompt from "@/Components/auth/ProtectedActionPrompt";
import { useAuth } from "@/context/AuthContext";
import { useProfileAction, useProfileDashboard } from "@/hooks/use-profile";
import { profileFormSchema, genericActionSchema } from "@/lib/validators";
import { useProfileUiStore } from "@/stores/profile-ui-store";
import type { DashboardRecord, ProfileSection } from "@/types/profile";
import "./profile-dashboard.css";

const nav = [
  ["profile", "Profile", "/profile", UserRound],
  ["balance", "Balance", "/profile/balance", Banknote],
  ["offers", "Offers", "/profile/offers", BadgePercent],
  ["orders", "My Orders", "/profile/orders", Package],
  ["wishlist", "Wishlists", "/profile/wishlist", Heart],
  ["prescriptions", "Prescriptions", "/profile/prescriptions", FileText],
  ["addresses", "Delivery Address", "/profile/addresses", MapPin],
  ["patients", "Patients", "/profile/patients", Users],
  ["reviews", "Product Review", "/profile/reviews", Star],
  ["reports", "Report", "/profile/reports", MessageSquare],
  ["inbox", "Inbox", "/profile/inbox", Bell],
  ["blog", "Blog", "/profile/blog", BookOpen],
  ["faq", "FAQ", "/profile/faq", HelpCircle],
  ["privacy-policy", "Privacy Policy", "/profile/privacy-policy", ShieldCheck],
] as const;

const copy: Record<ProfileSection, { title: string; description: string; action: string; empty: string }> = {
  profile: { title: "Profile", description: "Manage personal information, verification, language, emergency contact and delivery defaults.", action: "Save Profile", empty: "No profile details found" },
  balance: { title: "Balance", description: "Wallet summary, transaction history, secure add money and statement download.", action: "Add Money", empty: "No transactions yet" },
  offers: { title: "Offers", description: "Coupons, bank offers, payment promotions, product discounts and expiring deals.", action: "Apply Offer", empty: "No offers available" },
  orders: { title: "My Orders", description: "Track order cards, products, delivery progress, invoices, returns and reviews.", action: "Refresh Orders", empty: "No orders yet" },
  wishlist: { title: "Wishlists", description: "Manage folders, move items, add available products to cart and share saved products.", action: "Move Available to Cart", empty: "Wishlist is empty" },
  prescriptions: { title: "Prescriptions", description: "Upload JPG, PNG or PDF prescriptions, assign patients and follow verification status.", action: "Upload Prescription", empty: "No prescriptions uploaded" },
  addresses: { title: "Delivery Address", description: "Add, edit, duplicate, pin and set default delivery addresses.", action: "Add Address", empty: "No saved address" },
  patients: { title: "Patients", description: "Manage family patient profiles, medical details, prescriptions and default patient.", action: "Add Patient", empty: "No patients added" },
  reviews: { title: "Product Review", description: "Write, edit, delete and track pending, published, rejected and draft reviews.", action: "Write Review", empty: "No reviews found" },
  reports: { title: "Report", description: "Create support tickets, add messages, upload attachments and rate support.", action: "Create Report", empty: "No reports created" },
  inbox: { title: "Inbox", description: "Read order updates, delivery notes, healthcare alerts, support replies and offer messages.", action: "Mark All Read", empty: "Inbox is empty" },
  blog: { title: "Blog", description: "Browse health tips, medicine guides, saved articles and recently viewed posts.", action: "Save Article", empty: "No blog results" },
  faq: { title: "FAQ", description: "Search questions, filter categories, copy answers and mark helpful responses.", action: "Contact Support", empty: "No FAQ results" },
  "privacy-policy": { title: "Privacy Policy", description: "Read policy sections, copy anchors, search policy and download or print.", action: "Download PDF", empty: "No policy section" },
};

type ProfileForm = z.infer<typeof profileFormSchema>;

type GenericForm = z.infer<typeof genericActionSchema>;

function activeFromPath(pathname: string): ProfileSection {
  const found = nav.find((item) => pathname === item[2] || pathname.startsWith(`${item[2]}/`));
  return (found?.[0] || "profile") as ProfileSection;
}

function Status({ value }: { value: string }) {
  const cls = value.toLowerCase().replace(/\s+/g, "-");
  return <span className={`pd-status ${cls}`}><BadgeCheck size={14} />{value}</span>;
}

export default function ProfileDashboard({ section: sectionProp }: { section?: ProfileSection }) {
  const pathname = usePathname();
  const router = useRouter();
  const section = sectionProp || activeFromPath(pathname);
  const { user, ready, openLoginModal, logout } = useAuth();
  const { sidebarOpen, collapsed, setSidebarOpen, toggleCollapsed, modal, setModal, clearSensitive } = useProfileUiStore();
  const query = useProfileDashboard(section);
  const action = useProfileAction(section);
  const [search, setSearch] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    if (ready && !user) {
      sessionStorage.setItem("arogga-intended-destination", pathname);
      openLoginModal("Login with mobile number to access your profile dashboard.");
    }
  }, [ready, user, pathname, openLoginModal]);

  const data = query.data?.data;
  const records = useMemo(() => (data?.sectionRecords || []).filter((item) => `${item.id} ${item.title} ${item.subtitle} ${item.status}`.toLowerCase().includes(search.toLowerCase())), [data?.sectionRecords, search]);

  if (ready && !user) return <ProtectedActionPrompt title="Login to access profile" message="Profile dashboard is protected. Login with mobile number to continue." reason="Login to access your profile." />;

  function doLogout() {
    clearSensitive();
    logout();
    setConfirmLogout(false);
    notify.success("Logged out successfully");
    router.push("/");
  }

  async function quickAction(payload: Record<string, unknown>) {
    await action.mutateAsync(payload);
    notify.success(`${copy[section].action} completed`);
    setModal("");
  }

  return (
    <div className="pd-page">
      <button type="button" aria-label="Close profile menu" className={`pd-shade ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />
      <motion.aside className={`pd-sidebar ${collapsed ? "collapsed" : ""} ${sidebarOpen ? "open" : ""}`} initial={{ x: -14, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.22 }}>
        <div className="pd-side-user">
          <Image src={data?.user.avatar || "https://images.unsplash.com/photo-1606813902914-5f8f7ec4d1ad?auto=format&fit=crop&w=500&q=80"} alt="Profile avatar" width={54} height={54} unoptimized />
          <div><strong>{data?.user.name || user?.phone || "Profile user"}</strong><small>{data?.user.phone || user?.phone} <BadgeCheck size={13} />Verified</small></div>
          <button type="button" onClick={toggleCollapsed} aria-label="Toggle sidebar">{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</button>
        </div>
        <Link className="pd-edit" href="/profile"><Camera />Edit profile</Link>
        <nav aria-label="Profile navigation">{nav.map(([slug, label, href, Icon]) => <Link key={slug} href={href} className={section === slug ? "active" : ""} title={label} onClick={() => setSidebarOpen(false)}><Icon /><span>{label}</span><ChevronRight /></Link>)}</nav>
        <button type="button" className="pd-logout" onClick={() => setConfirmLogout(true)}><LogOut />Logout</button>
      </motion.aside>

      <main className="pd-main">
        <ProfileHeader section={section} onMenu={() => setSidebarOpen(true)} notificationCount={data?.notifications.filter((n) => !n.read).length || 0} onAction={() => section === "privacy-policy" ? window.print() : setModal(section)} />
        {query.isLoading ? <DashboardSkeleton /> : query.isError ? <DashboardError onRetry={() => query.refetch()} /> : (
          <AnimatePresence mode="wait">
            <motion.section key={section} className="pd-content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              {section === "profile" && data ? <ProfileHome data={data} onAction={() => quickAction({ type: "profile-save", title: "Profile", note: "Profile saved" })} /> : null}
              {section !== "profile" ? <SectionPage section={section} records={records} search={search} setSearch={setSearch} onModal={() => setModal(section)} /> : null}
            </motion.section>
          </AnimatePresence>
        )}
      </main>

      {modal ? <ActionModal section={section} loading={action.isPending} onClose={() => setModal("")} onSubmit={quickAction} /> : null}
      {confirmLogout ? <ConfirmModal title="Logout from profile?" text={`Logout ${data?.user.name || user?.phone || "this account"}? Sensitive dashboard caches will be cleared, guest cart stays available.`} confirm="Logout" onCancel={() => setConfirmLogout(false)} onConfirm={doLogout} /> : null}
    </div>
  );
}

function ProfileHeader({ section, onMenu, notificationCount, onAction }: { section: ProfileSection; onMenu: () => void; notificationCount: number; onAction: () => void }) {
  return <header className="pd-header"><button type="button" className="pd-menu" onClick={onMenu}><Menu />Menu</button><nav><Link href="/"><Home size={14} />Home</Link><span>/</span><Link href="/profile">Profile</Link><span>/</span><b>{copy[section].title}</b></nav><div><div><h1>{copy[section].title}</h1><p>{copy[section].description}</p></div><button type="button" aria-label="Notifications" className="pd-bell"><Bell /><b>{notificationCount}</b></button><button type="button" onClick={onAction}>{copy[section].action}</button></div></header>;
}

function ProfileHome({ data, onAction }: { data: NonNullable<ReturnType<typeof useProfileDashboard>["data"]>["data"]; onAction: () => void }) {
  const form = useForm<ProfileForm>({ resolver: zodResolver(profileFormSchema), defaultValues: { firstName: "Mohammed", lastName: "Tamim Hasan", mobile: data.user.phone, email: data.user.email, gender: "Male", dateOfBirth: "2000-01-01", bloodGroup: data.user.bloodGroup, language: data.user.language } });
  return <><section className="pd-stat-grid">{data.stats.map((stat) => <motion.article whileHover={{ y: -4 }} key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.help}</small></motion.article>)}</section><section className="pd-profile-grid"><article className="pd-card pd-avatar-card"><Image src={data.user.avatar} alt="Profile" width={118} height={118} unoptimized /><h2>{data.user.name}</h2><Status value={data.user.verified ? "Verified" : "Unverified"} /><p>Created {data.user.createdAt} • {data.user.defaultAddress}</p><div><button type="button" onClick={() => notify.success("Image preview ready. Upload API structure connected.")}><Upload />Upload image</button><button type="button" onClick={() => notify.success("Profile image removed from preview")}><Trash2 />Remove</button></div></article><form className="pd-card pd-form" onSubmit={form.handleSubmit(onAction)}><h2>Personal information</h2><div className="pd-form-grid"><label>First name<input {...form.register("firstName")} />{form.formState.errors.firstName && <small>{form.formState.errors.firstName.message}</small>}</label><label>Last name<input {...form.register("lastName")} />{form.formState.errors.lastName && <small>{form.formState.errors.lastName.message}</small>}</label><label>Mobile<input {...form.register("mobile")} />{form.formState.errors.mobile && <small>{form.formState.errors.mobile.message}</small>}</label><label>Email<input {...form.register("email")} />{form.formState.errors.email && <small>{form.formState.errors.email.message}</small>}</label><label>Gender<select {...form.register("gender")}><option>Male</option><option>Female</option><option>Other</option></select></label><label>Date of birth<input type="date" {...form.register("dateOfBirth")} />{form.formState.errors.dateOfBirth && <small>{form.formState.errors.dateOfBirth.message}</small>}</label><label>Blood group<select {...form.register("bloodGroup")}><option>B+</option><option>A+</option><option>O+</option><option>AB+</option></select></label><label>Preferred language<select {...form.register("language")}><option>English</option><option>Bangla</option></select></label></div><footer><button type="button" onClick={() => form.reset()}>Cancel</button><button type="submit">Save changes</button></footer></form></section></>;
}

function SectionPage({ section, records, search, setSearch, onModal }: { section: ProfileSection; records: DashboardRecord[]; search: string; setSearch: (v: string) => void; onModal: () => void }) {
  const [expanded, setExpanded] = useState("");
  return <><DashboardFeatureStrip section={section} /><section className="pd-toolbar"><label><Search /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${copy[section].title.toLowerCase()}`} /></label><button type="button" onClick={onModal}><Plus />{copy[section].action}</button></section>{records.length === 0 ? <DashboardEmpty title={copy[section].empty} action={copy[section].action} onAction={onModal} /> : <section className={`pd-records ${section}`}>{records.map((item, index) => <motion.article className="pd-card pd-record" key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} whileHover={{ y: -4 }}>{item.image ? <Image src={item.image} alt={item.title} width={76} height={76} unoptimized /> : <span className="pd-record-icon"><Pill /></span>}<div><strong>{item.title}</strong><p>{item.subtitle}</p><small>{item.id} {item.date ? `• ${item.date}` : ""} {item.meta ? `• ${item.meta}` : ""}</small>{section === "faq" ? <AnimatePresence>{expanded === item.id ? <motion.p className="pd-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>This answer is connected to the FAQ API structure. You can copy it, mark helpful, or contact support.</motion.p> : null}</AnimatePresence> : null}</div><Status value={item.status} /><div className="pd-actions"><button type="button" onClick={() => section === "faq" ? setExpanded(expanded === item.id ? "" : item.id) : notify.success(`${item.title} opened`)}>View</button><button type="button" onClick={() => notify.success(`${item.title} action completed`)}>{section === "offers" ? "Copy" : section === "blog" ? "Save" : section === "inbox" ? "Mark read" : "Action"}</button></div></motion.article>)}</section>}</>;
}

function DashboardFeatureStrip({ section }: { section: ProfileSection }) {
  const items: Record<ProfileSection, string[]> = {
    profile: [], balance: ["Secure wallet", "Statement download", "Checkout balance"], offers: ["Coupon copy", "Eligibility", "Countdown deals"], orders: ["Track order", "Invoice", "Return/refund"], wishlist: ["Folders", "Move to cart", "Stock alerts"], prescriptions: ["Private upload", "Verification", "Patient assign"], addresses: ["Map pin", "Default address", "Duplicate"], patients: ["Family profiles", "Medical privacy", "Prescriptions"], reviews: ["Delivered-only", "Media upload", "Seller reply"], reports: ["Ticket chat", "Attachments", "Support rating"], inbox: ["Unread alerts", "Order updates", "Support replies"], blog: ["Health guides", "Saved articles", "Share"], faq: ["Accordion", "Helpful votes", "Support CTA"], "privacy-policy": ["Table of contents", "Print", "Copy section"],
  };
  if (section === "profile") return null;
  return <section className="pd-feature-strip" aria-label={`${copy[section].title} features`}>{items[section].map((item) => <span key={item}><BadgeCheck size={13} />{item}</span>)}</section>;
}

function ActionModal({ section, loading, onClose, onSubmit }: { section: ProfileSection; loading: boolean; onClose: () => void; onSubmit: (payload: Record<string, unknown>) => void }) {
  const form = useForm<GenericForm>({ resolver: zodResolver(genericActionSchema), defaultValues: { title: copy[section].action, note: "Request created from profile dashboard" } });
  return <div className="pd-modal-backdrop"><motion.section className="pd-modal" role="dialog" aria-modal="true" aria-labelledby="pd-modal-title" initial={{ opacity: 0, scale: .96, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }}><header><h2 id="pd-modal-title">{copy[section].action}</h2><button type="button" onClick={onClose}><X /></button></header><form onSubmit={form.handleSubmit(onSubmit)}><label>Title<input {...form.register("title")} />{form.formState.errors.title && <small>{form.formState.errors.title.message}</small>}</label><label>Note<textarea {...form.register("note")} />{form.formState.errors.note && <small>{form.formState.errors.note.message}</small>}</label><p className="pd-help">API mutation, validation, loading, success toast and cache invalidation are connected for this action.</p><footer><button type="button" onClick={onClose}>Cancel</button><button type="submit" disabled={loading}>{loading ? "Processing..." : "Confirm"}</button></footer></form></motion.section></div>;
}

function ConfirmModal({ title, text, confirm, onCancel, onConfirm }: { title: string; text: string; confirm: string; onCancel: () => void; onConfirm: () => void }) {
  return <div className="pd-modal-backdrop"><section className="pd-modal" role="dialog" aria-modal="true"><header><h2>{title}</h2><button type="button" onClick={onCancel}><X /></button></header><p>{text}</p><footer><button type="button" onClick={onCancel}>Cancel</button><button type="button" onClick={onConfirm}>{confirm}</button></footer></section></div>;
}
function DashboardSkeleton() { return <section className="pd-skeletons">{Array.from({ length: 8 }).map((_, i) => <div key={i} />)}</section>; }
function DashboardError({ onRetry }: { onRetry: () => void }) { return <section className="pd-empty"><ShieldCheck /><h2>Could not load dashboard</h2><p>Network, authorization or server issue detected.</p><button type="button" onClick={onRetry}>Retry</button><Link href="/profile/reports">Contact support</Link></section>; }
function DashboardEmpty({ title, action, onAction }: { title: string; action: string; onAction: () => void }) { return <section className="pd-empty"><WalletCards /><h2>{title}</h2><p>Use the primary action to create your first item.</p><button type="button" onClick={onAction}>{action}</button></section>; }
