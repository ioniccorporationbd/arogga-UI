"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { create } from "zustand";
import {
  AlertCircle,
  ArrowDownUp,
  BadgeCheck,
  Ban,
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Copy,
  CreditCard,
  Download,
  Eye,
  Filter,
  Headphones,
  Heart,
  Home,
  Inbox,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Package,
  PackageCheck,
  PanelLeft,
  RefreshCw,
  RotateCcw,
  Search,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
  Undo2,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

import ProtectedActionPrompt from "@/Components/auth/ProtectedActionPrompt";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { Order, OrderListResponse, OrderProduct, OrderStatus, TrackingEvent } from "@/lib/orders";
import "./orders.css";

type Filters = {
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryStatus: string;
  returnStatus: string;
  minAmount: string;
  maxAmount: string;
  from: string;
  to: string;
};

type Store = {
  orders: Order[];
  summary: Record<string, number>;
  statusCounts: Record<string, number>;
  total: number;
  totalPages: number;
  loading: boolean;
  actionLoading: string;
  error: string;
  fetchOrders: (phone: string, query: URLSearchParams) => Promise<void>;
  postAction: (phone: string, orderId: string, action: string, body?: unknown) => Promise<Record<string, unknown>>;
};

const useOrdersStore = create<Store>((set) => ({
  orders: [], summary: {}, statusCounts: {}, total: 0, totalPages: 1, loading: true, actionLoading: "", error: "",
  async fetchOrders(phone, query) {
    set({ loading: true, error: "" });
    try {
      const res = await fetch(`/api/orders?${query.toString()}`, { headers: { "x-user-phone": phone } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed order loading");
      const payload = data as OrderListResponse;
      set({ orders: payload.orders, summary: payload.summary, statusCounts: payload.statusCounts, total: payload.total, totalPages: payload.totalPages, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Network error", loading: false });
    }
  },
  async postAction(phone, orderId, action, body) {
    set({ actionLoading: `${action}:${orderId}` });
    try {
      const res = await fetch(`/api/orders/${orderId}/${action}`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-phone": phone },
        body: JSON.stringify(body || {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `${action} failed`);
      return data;
    } finally {
      set({ actionLoading: "" });
    }
  },
}));

const statusMeta: Record<OrderStatus | "all", { label: string; icon: typeof Package; className: string }> = {
  all: { label: "All Orders", icon: ClipboardList, className: "neutral" },
  pending: { label: "Pending", icon: Clock3, className: "pending" },
  confirmed: { label: "Confirmed", icon: BadgeCheck, className: "confirmed" },
  processing: { label: "Processing", icon: RefreshCw, className: "processing" },
  packed: { label: "Packed", icon: Box, className: "packed" },
  shipped: { label: "Shipped", icon: Truck, className: "shipped" },
  out_for_delivery: { label: "Out for Delivery", icon: MapPin, className: "out" },
  delivered: { label: "Delivered", icon: CheckCircle2, className: "delivered" },
  cancelled: { label: "Cancelled", icon: Ban, className: "cancelled" },
  return_requested: { label: "Return Requested", icon: RotateCcw, className: "returned" },
  returned: { label: "Returned", icon: Undo2, className: "returned" },
  refund_processing: { label: "Refund Processing", icon: WalletCards, className: "refund" },
  refunded: { label: "Refunded", icon: CreditCard, className: "refund" },
};

const tabs: (OrderStatus | "all")[] = ["all", "pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned", "refunded"];
const sortOptions = [
  ["newest", "Newest first"], ["oldest", "Oldest first"], ["highest", "Highest amount"], ["lowest", "Lowest amount"], ["updated", "Recently updated"],
];
const cancellationReasons = ["Ordered by mistake", "Found a better price", "Delivery is too late", "Wrong product selected", "Wrong size or color", "Payment issue", "Changed my mind", "Other"];
const returnReasons = ["Damaged product", "Wrong product received", "Missing parts", "Product does not match description", "Wrong size", "Wrong color", "Quality issue", "Changed my mind", "Other"];

function money(value: number) { return `৳${value.toLocaleString("en-BD")}`; }
function dt(value?: string) { return value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Not scheduled"; }
function tm(value?: string) { return value ? new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "--"; }
function getQuery(searchParams: URLSearchParams) { return new URLSearchParams(searchParams.toString()); }
function canCancel(order: Order) { return ["pending", "confirmed"].includes(order.status); }
function canReturn(order: Order) { return order.status === "delivered" && order.products.some((p) => p.isReturnEligible); }

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return <span className={`order-status ${meta.className}`}><Icon size={14} />{meta.label}</span>;
}

function Timeline({ events }: { events: TrackingEvent[] }) {
  return <ol className="tracking-timeline">{events.map((event) => <li key={event.id} className={event.completed ? "done" : event.active ? "active" : ""}><span>{event.completed ? <CheckCircle2 /> : event.active ? <Clock3 /> : <span />}</span><div><strong>{event.title}</strong><p>{event.description}</p><small>{event.location ? `${event.location} • ` : ""}{event.date} • {event.time}</small></div></li>)}</ol>;
}

function ProductRow({ product, compact = false }: { product: OrderProduct; compact?: boolean }) {
  return <article className="order-product-row"><Link href={`/products/${product.productId}`} className="op-image"><Image src={product.image} alt={product.name} fill sizes={compact ? "60px" : "80px"} unoptimized /></Link><div><Link href={`/products/${product.productId}`}>{product.name}</Link><span>{product.seller}</span><small>{product.size || "Standard"} • {product.color || "Default"} • Qty {product.quantity}</small><em>{product.availability === "out_of_stock" ? "Out of stock now" : product.status}</em></div><div><small>Unit {money(product.unitPrice)}</small><strong>{money(product.finalPrice * product.quantity)}</strong>{product.discount ? <del>{money(product.unitPrice * product.quantity)}</del> : null}</div></article>;
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const id = window.setTimeout(onClose, 2600); return () => window.clearTimeout(id); }, [onClose]);
  return <div className="orders-toast" role="status"><CheckCircle2 />{message}</div>;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready, openLoginModal, logout } = useAuth();
  const { addItem } = useCart();
  const store = useOrdersStore();
  const [queryText, setQueryText] = useState(searchParams.get("search") || "");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [details, setDetails] = useState<Order | null>(null);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [returnOrder, setReturnOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [filters, setFilters] = useState<Filters>({
    status: searchParams.get("status") || "all",
    paymentStatus: searchParams.get("paymentStatus") || "all",
    paymentMethod: searchParams.get("paymentMethod") || "all",
    deliveryStatus: searchParams.get("deliveryStatus") || "all",
    returnStatus: searchParams.get("returnStatus") || "all",
    minAmount: searchParams.get("minAmount") || "",
    maxAmount: searchParams.get("maxAmount") || "",
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
  });

  const page = Number(searchParams.get("page") || 1);
  const perPage = Number(searchParams.get("perPage") || 10);
  const activeStatus = searchParams.get("status") || "all";
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    if (ready && !user) {
      sessionStorage.setItem("arogga-intended-destination", "/orders");
      openLoginModal("Login with mobile number to view My Orders.");
    }
  }, [ready, user, openLoginModal]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = getQuery(searchParams);
      if (queryText) next.set("search", queryText); else next.delete("search");
      next.set("page", "1");
      router.replace(`/orders?${next.toString()}`, { scroll: false });
    }, 350);
    return () => window.clearTimeout(id);
  }, [queryText]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user?.phone) store.fetchOrders(user.phone, getQuery(searchParams));
  }, [user?.phone, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  function setParam(key: string, value: string) {
    const next = getQuery(searchParams);
    if (!value || value === "all") next.delete(key); else next.set(key, value);
    if (key !== "page") next.set("page", "1");
    router.push(`/orders?${next.toString()}`, { scroll: false });
  }

  function applyFilters() {
    const next = getQuery(searchParams);
    Object.entries(filters).forEach(([key, value]) => value && value !== "all" ? next.set(key, value) : next.delete(key));
    next.set("page", "1");
    setFilterOpen(false);
    router.push(`/orders?${next.toString()}`, { scroll: false });
  }

  function resetFilters() {
    setFilters({ status: "all", paymentStatus: "all", paymentMethod: "all", deliveryStatus: "all", returnStatus: "all", minAmount: "", maxAmount: "", from: "", to: "" });
    setQueryText("");
    router.push("/orders", { scroll: false });
  }

  async function refresh() { if (user?.phone) await store.fetchOrders(user.phone, getQuery(searchParams)); }

  async function doCancel(reason: string, comment: string) {
    if (!user?.phone || !cancelOrder) return;
    try { await store.postAction(user.phone, cancelOrder.id, "cancel", { reason, comment }); setCancelOrder(null); setToast("Order cancelled successfully"); await refresh(); }
    catch (e) { setToast(e instanceof Error ? e.message : "Cancellation failure"); }
  }
  async function doReturn(selected: string[], reason: string) {
    if (!user?.phone || !returnOrder) return;
    try { const res = await store.postAction(user.phone, returnOrder.id, "return", { selected, reason }); setReturnOrder(null); setToast(`Return request created: ${res.requestId || "submitted"}`); await refresh(); }
    catch (e) { setToast(e instanceof Error ? e.message : "Return request failure"); }
  }
  async function doReview(selected: string[]) {
    if (!user?.phone || !reviewOrder) return;
    try { await store.postAction(user.phone, reviewOrder.id, "review", { productIds: selected, rating: 5 }); setReviewOrder(null); setToast("Review submitted successfully"); await refresh(); }
    catch (e) { setToast(e instanceof Error ? e.message : "Review submission failure"); }
  }
  async function doBuyAgain(order: Order) {
    if (!user?.phone) return;
    try { const res = await store.postAction(user.phone, order.id, "buy-again"); const added = (res.added || []) as OrderProduct[]; added.forEach((p) => addItem({ id: `${p.productId}:${p.size || "standard"}`, slug: p.productId, name: p.name, image: p.image, price: p.finalPrice, sku: p.size, maxQuantity: 5 }, p.quantity)); setToast(`${added.length} available product${added.length === 1 ? "" : "s"} added to cart. ${((res.unavailable || []) as OrderProduct[]).length} unavailable.`); }
    catch (e) { setToast(e instanceof Error ? e.message : "Buy-again failed"); }
  }
  async function downloadInvoice(order: Order) {
    if (!user?.phone) return;
    try { const res = await fetch(`/api/orders/${order.id}/invoice`, { headers: { "x-user-phone": user.phone } }); if (!res.ok) throw new Error("Invoice download failure"); const blob = await res.blob(); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `invoice-${order.orderNumber}.pdf`; a.click(); URL.revokeObjectURL(url); setToast("Invoice downloaded"); }
    catch (e) { setToast(e instanceof Error ? e.message : "Invoice unavailable"); }
  }

  const activeChips = Array.from(searchParams.entries()).filter(([k, v]) => !["page", "perPage", "sort"].includes(k) && Boolean(v));
  const summaryCards = [
    ["total", "Total Orders", ClipboardList, "All purchases"], ["processing", "Processing Orders", RefreshCw, "Being prepared"], ["shipped", "Shipped Orders", Truck, "On the way"], ["delivered", "Delivered Orders", CheckCircle2, "Completed"], ["cancelled", "Cancelled Orders", Ban, "Stopped"], ["returned", "Returned Orders", Undo2, "Returns/refunds"],
  ] as const;

  if (ready && !user) return <ProtectedActionPrompt title="Login to view orders" message="Your order history and delivery status are private. Login to continue." reason="Login to see your orders." />;

  return <main className="mo-page"><aside className={`account-sidebar ${sidebarOpen ? "open" : ""}`}><div><UserRound /><span>{user?.phone || "Guest"}</span><button type="button" onClick={() => setSidebarOpen(false)}><X /></button></div><nav>{[["/account/profile", "Dashboard", PanelLeft], ["/orders", "My Orders", Package], ["/wishlist", "Wishlist", Heart], ["/inbox", "Inbox", Inbox], ["/account/addresses", "Saved Addresses", MapPin], ["/account/payment", "Payment Methods", CreditCard], ["/account/reviews", "Reviews", Star], ["/account/returns", "Returns and Refunds", RotateCcw], ["/account/settings", "Profile Settings", UserRound]].map(([href, label, Icon]) => { const I = Icon as typeof Package; return <Link key={String(href)} href={String(href)} className={href === "/orders" ? "active" : ""}><I />{String(label)}</Link>; })}<button type="button" onClick={() => { logout(); router.push("/"); }}><LogOut />Logout</button></nav></aside><section className="mo-main"><header className="orders-header"><button type="button" className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu /></button><nav><Link href="/"><Home size={14} />Home</Link><span>/</span><Link href="/account/profile">My Account</Link><span>/</span><b>My Orders</b></nav><div><div><h1>My Orders</h1><p>Track, manage, and review all your orders</p></div><button type="button" onClick={() => setFilterOpen(true)}><Filter />Filter</button></div><div className="orders-tools"><label><Search /><input value={queryText} onChange={(e) => setQueryText(e.target.value)} placeholder="Search by order ID, product, seller, tracking" />{queryText ? <button type="button" onClick={() => setQueryText("")}><X /></button> : null}</label><select value={sort} onChange={(e) => setParam("sort", e.target.value)} aria-label="Sort orders"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="highest">Highest amount</option><option value="lowest">Lowest amount</option><option value="updated">Recently updated</option></select></div></header>

  <section className="summary-grid">{store.loading ? Array.from({ length: 6 }).map((_, i) => <div className="summary-card skeleton" key={i} />) : summaryCards.map(([key, label, Icon, help]) => <button type="button" key={key} className={`summary-card ${activeStatus === key || (key === "total" && activeStatus === "all") ? "active" : ""}`} onClick={() => setParam("status", key === "total" ? "all" : key)}><Icon /><span>{label}</span><strong>{store.summary[key] || 0}</strong><small>{help}</small></button>)}</section>
  <nav className="status-tabs" aria-label="Order status tabs">{tabs.map((tab) => { const meta = statusMeta[tab]; const Icon = meta.icon; return <button type="button" key={tab} onClick={() => setParam("status", tab)} className={activeStatus === tab ? "active" : ""}><Icon size={15} />{meta.label}<b>{store.statusCounts[tab] || 0}</b></button>; })}</nav>
  <div className="filter-chips">{activeChips.map(([key, value]) => <button type="button" key={key} onClick={() => setParam(key, "")}><X />{key}: {value}</button>)}</div>

  {store.error ? <section className="orders-error"><AlertCircle /><h2>{store.error}</h2><button type="button" onClick={refresh}>Retry</button><Link href="/inbox">Contact support</Link></section> : store.loading ? <OrdersSkeleton /> : store.orders.length === 0 ? <EmptyState hasSearch={Boolean(searchParams.get("search"))} hasFilter={activeChips.length > 0} onReset={resetFilters} /> : <section className="orders-list">{store.orders.map((order) => <OrderCard key={order.id} order={order} expanded={expanded === order.id} toggleExpanded={() => setExpanded(expanded === order.id ? null : order.id)} onDetails={() => setDetails(order)} onCancel={() => setCancelOrder(order)} onReturn={() => setReturnOrder(order)} onReview={() => setReviewOrder(order)} onBuyAgain={() => doBuyAgain(order)} onInvoice={() => downloadInvoice(order)} actionLoading={store.actionLoading} />)}</section>}

  <OrdersPagination total={store.total} page={page} totalPages={store.totalPages} perPage={perPage} setParam={setParam} />
  </section>{filterOpen ? <FilterDrawer filters={filters} setFilters={setFilters} onApply={applyFilters} onReset={resetFilters} onClose={() => setFilterOpen(false)} /> : null}{details ? <DetailsDrawer order={details} onClose={() => setDetails(null)} onInvoice={() => downloadInvoice(details)} onBuyAgain={() => doBuyAgain(details)} /> : null}{cancelOrder ? <CancelModal order={cancelOrder} loading={store.actionLoading.includes("cancel")} onClose={() => setCancelOrder(null)} onConfirm={doCancel} /> : null}{returnOrder ? <ReturnModal order={returnOrder} loading={store.actionLoading.includes("return")} onClose={() => setReturnOrder(null)} onConfirm={doReturn} /> : null}{reviewOrder ? <ReviewModal order={reviewOrder} loading={store.actionLoading.includes("review")} onClose={() => setReviewOrder(null)} onConfirm={doReview} /> : null}{toast ? <Toast message={toast} onClose={() => setToast("")} /> : null}</main>;
}

function OrderCard({ order, expanded, toggleExpanded, onDetails, onCancel, onReturn, onReview, onBuyAgain, onInvoice, actionLoading }: { order: Order; expanded: boolean; toggleExpanded: () => void; onDetails: () => void; onCancel: () => void; onReturn: () => void; onReview: () => void; onBuyAgain: () => void; onInvoice: () => void; actionLoading: string }) {
  const first = order.products[0];
  const productsCount = order.products.reduce((s, p) => s + p.quantity, 0);
  return <article className="order-card"><header><div><span>Order ID</span><h2>{order.orderNumber}</h2><small>{dt(order.createdAt)} • {tm(order.createdAt)}</small></div><StatusBadge status={order.status} /><button type="button" className="expand-mobile" onClick={toggleExpanded}><ChevronDown /></button></header><div className="mobile-order-preview"><Image src={first.image} alt={first.name} width={58} height={58} unoptimized /><span>{productsCount} products</span><strong>{money(order.grandTotal)}</strong></div><div className={`order-expanded ${expanded ? "show" : ""}`}><section className="order-facts"><span>Estimated delivery <b>{dt(order.estimatedDelivery)}</b></span><span>Payment <b>{order.paymentMethod}</b></span><span>Payment status <b>{order.paymentStatus}</b></span><span>Shipping <b>{order.shippingAddress.city}, {order.shippingAddress.area}</b></span><span>Products <b>{productsCount}</b></span><span>Tracking <b>{order.trackingNumber}</b></span></section><div className="order-products">{order.products.map((product) => <ProductRow key={product.id} product={product} />)}</div><section className="price-box"><div><span>Subtotal</span><b>{money(order.subtotal)}</b></div><div><span>Delivery charge</span><b>{money(order.deliveryCharge)}</b></div><div><span>Discount</span><b>-{money(order.discount)}</b></div><div><span>Tax</span><b>{money(order.tax)}</b></div><strong><span>Grand total</span><b>{money(order.grandTotal)}</b></strong></section><Timeline events={order.trackingEvents} /><ActionBar order={order} actionLoading={actionLoading} onDetails={onDetails} onCancel={onCancel} onReturn={onReturn} onReview={onReview} onBuyAgain={onBuyAgain} onInvoice={onInvoice} /></div></article>;
}

function ActionBar({ order, actionLoading, onDetails, onCancel, onReturn, onReview, onBuyAgain, onInvoice }: { order: Order; actionLoading: string; onDetails: () => void; onCancel: () => void; onReturn: () => void; onReview: () => void; onBuyAgain: () => void; onInvoice: () => void; }) {
  const loading = actionLoading.endsWith(order.id);
  return <div className="order-actions"><button type="button" onClick={onDetails}><Eye />View Details</button>{canCancel(order) ? <button type="button" onClick={onCancel}><Ban />Cancel Order</button> : null}{["processing", "shipped", "out_for_delivery"].includes(order.status) ? <button type="button" onClick={onDetails}><Truck />Track Order</button> : null}{["pending", "confirmed"].includes(order.status) ? <button type="button" onClick={onDetails}><MapPin />Change Delivery Address</button> : null}{order.status === "delivered" ? <button type="button" onClick={onReview}><Star />Write a Review</button> : null}{canReturn(order) ? <button type="button" onClick={onReturn}><RotateCcw />Request Return</button> : null}{["delivered", "cancelled", "returned", "refunded"].includes(order.status) ? <button type="button" onClick={onBuyAgain} disabled={loading}>{loading ? <Loader2 className="spin" /> : <ShoppingCart />}Buy Again</button> : null}{["shipped", "out_for_delivery", "delivered"].includes(order.status) ? <button type="button" onClick={onInvoice}><Download />Download Invoice</button> : null}<button type="button"><Headphones />Contact Support</button></div>;
}

function FilterDrawer({ filters, setFilters, onApply, onReset, onClose }: { filters: Filters; setFilters: (f: Filters) => void; onApply: () => void; onReset: () => void; onClose: () => void }) {
  function change(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) { setFilters({ ...filters, [e.target.name]: e.target.value }); }
  return <div className="drawer-backdrop"><aside className="filter-drawer"><header><h2>Filter Orders</h2><button type="button" onClick={onClose}><X /></button></header><label>Status<select name="status" value={filters.status} onChange={change}><option value="all">All statuses</option>{Object.entries(statusMeta).filter(([k]) => k !== "all").map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></label><label>Payment status<select name="paymentStatus" value={filters.paymentStatus} onChange={change}><option value="all">All</option><option value="paid">Paid</option><option value="unpaid">Unpaid</option><option value="refunded">Refunded</option></select></label><label>Payment method<select name="paymentMethod" value={filters.paymentMethod} onChange={change}><option value="all">All methods</option>{["bKash", "Nagad", "Rocket", "Visa", "Mastercard", "Bank Transfer", "Cash on Delivery"].map((m) => <option key={m}>{m}</option>)}</select></label><label>Delivery status<select name="deliveryStatus" value={filters.deliveryStatus} onChange={change}><option value="all">All</option><option value="active">In delivery</option></select></label><label>Return status<select name="returnStatus" value={filters.returnStatus} onChange={change}><option value="all">All</option><option value="active">Return/refund orders</option></select></label><div className="two"><label>From<input name="from" type="date" value={filters.from} onChange={change} /></label><label>To<input name="to" type="date" value={filters.to} onChange={change} /></label></div><div className="two"><label>Min amount<input name="minAmount" inputMode="numeric" value={filters.minAmount} onChange={change} /></label><label>Max amount<input name="maxAmount" inputMode="numeric" value={filters.maxAmount} onChange={change} /></label></div><footer><button type="button" onClick={onReset}>Reset Filters</button><button type="button" onClick={onApply}>Apply Filters</button></footer></aside></div>;
}

function DetailsDrawer({ order, onClose, onInvoice, onBuyAgain }: { order: Order; onClose: () => void; onInvoice: () => void; onBuyAgain: () => void }) {
  return <div className="drawer-backdrop"><aside className="details-drawer"><header><div><span>Order details</span><h2>{order.orderNumber}</h2></div><button type="button" onClick={onClose}><X /></button></header><div className="details-grid"><section><h3>Order information</h3><p>Status: <StatusBadge status={order.status} /></p><p>Date: {dt(order.createdAt)} {tm(order.createdAt)}</p><p>Estimated delivery: {dt(order.estimatedDelivery)}</p></section><section><h3>Customer information</h3><p>{order.customer.name}</p><p>{order.customer.phone}</p></section><section><h3>Shipping address</h3><p>{order.shippingAddress.line1}, {order.shippingAddress.area}, {order.shippingAddress.city}, {order.shippingAddress.country}</p></section><section><h3>Payment details</h3><p>{order.paymentMethod} • {order.paymentStatus}</p><p>Coupon: {order.coupon?.code || "No coupon"}</p></section></div><div className="order-products">{order.products.map((p) => <ProductRow key={p.id} product={p} compact />)}</div><section className="tracking-card"><h3>Track order</h3><p>Courier: {order.courierName} • Tracking: {order.trackingNumber}</p><p>Current location: {order.currentLocation}</p><div><button type="button" onClick={() => navigator.clipboard?.writeText(order.trackingNumber || "")}><Copy />Copy tracking number</button><a href="https://steadfast.com.bd/t" target="_blank"><Truck />Open courier page</a>{order.deliveryAgent ? <a href={`tel:${order.deliveryAgent.phone}`}>Call {order.deliveryAgent.name}</a> : null}</div><Timeline events={order.trackingEvents} /></section><section className="price-box"><strong><span>Grand total</span><b>{money(order.grandTotal)}</b></strong></section><footer><button type="button" onClick={onInvoice}><Download />Invoice Download</button><button type="button" onClick={onBuyAgain}><ShoppingCart />Buy Again</button></footer></aside></div>;
}

function CancelModal({ order, loading, onClose, onConfirm }: { order: Order; loading: boolean; onClose: () => void; onConfirm: (reason: string, comment: string) => void }) { const [reason, setReason] = useState(cancellationReasons[0]); const [comment, setComment] = useState(""); return <Modal title="Cancel order?" onClose={onClose}><p>Order ID: <strong>{order.orderNumber}</strong></p><div className="modal-products">{order.products.map((p) => <ProductRow key={p.id} product={p} compact />)}</div><p className="warning">Cancellation may trigger refund processing based on the payment method. Shipped or delivered orders cannot be cancelled.</p><label>Cancellation reason<select value={reason} onChange={(e) => setReason(e.target.value)}>{cancellationReasons.map((r) => <option key={r}>{r}</option>)}</select></label><label>Additional comment<textarea value={comment} onChange={(e) => setComment(e.target.value)} /></label><p>Refund method: original payment method / Arogga wallet where applicable.</p><footer><button type="button" onClick={onClose}>Keep order</button><button type="button" onClick={() => onConfirm(reason, comment)} disabled={loading}>{loading ? <Loader2 className="spin" /> : null}Confirm cancellation</button></footer></Modal>; }
function ReturnModal({ order, loading, onClose, onConfirm }: { order: Order; loading: boolean; onClose: () => void; onConfirm: (ids: string[], reason: string) => void }) { const eligible = order.products.filter((p) => p.isReturnEligible); const [selected, setSelected] = useState(eligible.map((p) => p.id)); const [reason, setReason] = useState(returnReasons[0]); const deadline = useMemo(() => { const value = new Date(order.deliveredAt || order.createdAt); value.setDate(value.getDate() + 7); return value.toISOString(); }, [order.createdAt, order.deliveredAt]); return <Modal title="Request return" onClose={onClose}><p>Return eligibility deadline: {dt(deadline)}</p>{eligible.map((p) => <label key={p.id} className="check-row"><input type="checkbox" checked={selected.includes(p.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, p.id] : selected.filter((id) => id !== p.id))} />{p.name} • Qty up to {p.quantity}</label>)}<label>Return reason<select value={reason} onChange={(e) => setReason(e.target.value)}>{returnReasons.map((r) => <option key={r}>{r}</option>)}</select></label><label>Additional explanation<textarea placeholder="Explain the return issue" /></label><label>Upload product images<input type="file" multiple accept="image/*" /></label><label>Refund method<select><option>Original payment method</option><option>Arogga wallet</option><option>Bank transfer</option></select></label><label>Pickup address<select><option>{order.shippingAddress.line1}</option></select></label><footer><button type="button" onClick={onClose}>Cancel</button><button type="button" onClick={() => onConfirm(selected, reason)} disabled={loading || selected.length === 0}>{loading ? <Loader2 className="spin" /> : null}Confirm return request</button></footer></Modal>; }
function ReviewModal({ order, loading, onClose, onConfirm }: { order: Order; loading: boolean; onClose: () => void; onConfirm: (ids: string[]) => void }) { const products = order.products.filter((p) => !p.isReviewed); const [selected, setSelected] = useState(products.map((p) => p.id)); return <Modal title="Write a review" onClose={onClose}><div className="stars">★★★★★</div>{products.length ? products.map((p) => <label key={p.id} className="check-row"><input type="checkbox" checked={selected.includes(p.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, p.id] : selected.filter((id) => id !== p.id))} />{p.name}</label>) : <p>All products are already reviewed. You can view or edit reviews later.</p>}<label>Review title<input placeholder="Great product" /></label><label>Review text<textarea placeholder="Share your experience" /></label><div className="three"><label>Product quality<select><option>5</option><option>4</option><option>3</option></select></label><label>Delivery<select><option>5</option><option>4</option><option>3</option></select></label><label>Seller<select><option>5</option><option>4</option><option>3</option></select></label></div><label>Upload images<input type="file" multiple accept="image/*" /></label><footer><button type="button" onClick={onClose}>Cancel</button><button type="button" onClick={() => onConfirm(selected)} disabled={loading || selected.length === 0}>{loading ? <Loader2 className="spin" /> : null}Submit review</button></footer></Modal>; }
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) { return <div className="modal-backdrop"><section className="orders-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header><h2 id="modal-title">{title}</h2><button type="button" onClick={onClose}><X /></button></header>{children}</section></div>; }
function OrdersPagination({ total, page, totalPages, perPage, setParam }: { total: number; page: number; totalPages: number; perPage: number; setParam: (k: string, v: string) => void }) { return <footer className="orders-pagination"><span>{total} results</span><select value={perPage} onChange={(e) => setParam("perPage", e.target.value)}><option>10</option><option>20</option><option>50</option></select><button type="button" disabled={page <= 1} onClick={() => setParam("page", String(page - 1))}><ChevronLeft />Previous</button>{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => <button key={n} type="button" className={n === page ? "active" : ""} onClick={() => setParam("page", String(n))}>{n}</button>)}<button type="button" disabled={page >= totalPages} onClick={() => setParam("page", String(page + 1))}>Next<ChevronRight /></button></footer>; }
function EmptyState({ hasSearch, hasFilter, onReset }: { hasSearch: boolean; hasFilter: boolean; onReset: () => void }) { return <section className="orders-empty"><ShoppingBag /><h2>{hasSearch ? "No matching orders found" : hasFilter ? "No orders found for this status" : "You have not placed any orders yet"}</h2><p>{hasSearch ? "Try another order ID, product, seller or tracking number." : hasFilter ? "Remove filters or view all orders." : "Start shopping and your orders will appear here."}</p>{hasSearch || hasFilter ? <button type="button" onClick={onReset}>Reset search/filter</button> : <Link href="/store">Start Shopping</Link>}</section>; }
function OrdersSkeleton() { return <section className="orders-list">{Array.from({ length: 4 }).map((_, i) => <article key={i} className="order-card skeleton"><header /><div /><section /></article>)}</section>; }
