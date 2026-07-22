"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { create } from "zustand";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Home,
  Loader2,
  Package,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ProtectedActionPrompt from "@/Components/auth/ProtectedActionPrompt";
import { useAuth } from "@/context/AuthContext";
import type { Order, OrderListResponse, OrderProduct, OrderStatus } from "@/lib/orders";
import "./orders.css";

type Store = {
  orders: Order[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string;
  fetchOrders: (phone: string, query: URLSearchParams) => Promise<void>;
};

type ProductOrderRow = {
  rowId: string;
  order: Order;
  product: OrderProduct;
};

const ORDERS_PATH = "/account/orders";
const visibleStatuses: (OrderStatus | "all")[] = ["all", "pending", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];
const statusLabels: Record<string, string> = {
  all: "All",
  pending: "Pending",
  confirmed: "Pending",
  processing: "Processing",
  packed: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
};

const useOrdersStore = create<Store>((set) => ({
  orders: [],
  total: 0,
  totalPages: 1,
  loading: true,
  error: "",
  async fetchOrders(phone, query) {
    set({ loading: true, error: "" });
    try {
      const res = await fetch(`/api/orders?${query.toString()}`, { headers: { "x-user-phone": phone } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed order loading");
      const payload = data as OrderListResponse;
      set({ orders: payload.orders, total: payload.total, totalPages: payload.totalPages, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Network error", loading: false });
    }
  },
}));

function money(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Not scheduled";
}

function statusClass(status: string) {
  if (["delivered"].includes(status)) return "delivered";
  if (["pending", "confirmed"].includes(status)) return "pending";
  if (["processing", "packed"].includes(status)) return "processing";
  if (["shipped", "out_for_delivery"].includes(status)) return "shipped";
  if (["cancelled"].includes(status)) return "cancelled";
  return "neutral";
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`order-status ${statusClass(status)}`}><CheckCircle2 size={14} />{statusLabels[status] || status}</span>;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready, openLoginModal } = useAuth();
  const store = useOrdersStore();
  const [queryText, setQueryText] = useState(searchParams.get("search") || "");
  const [details, setDetails] = useState<ProductOrderRow | null>(null);

  const page = Number(searchParams.get("page") || 1);
  const perPage = Number(searchParams.get("perPage") || 10);
  const activeStatus = searchParams.get("status") || "all";
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    if (ready && !user) {
      sessionStorage.setItem("arogga-intended-destination", ORDERS_PATH);
      openLoginModal("Login with mobile number to view your orders.");
    }
  }, [ready, user, openLoginModal]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams.toString());
      if (queryText) next.set("search", queryText); else next.delete("search");
      next.set("page", "1");
      router.replace(`${ORDERS_PATH}?${next.toString()}`, { scroll: false });
    }, 300);
    return () => window.clearTimeout(id);
  }, [queryText]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user?.phone) {
      const apiQuery = new URLSearchParams(searchParams.toString());
      apiQuery.set("page", "1");
      apiQuery.set("perPage", "50");
      store.fetchOrders(user.phone, apiQuery);
    }
  }, [user?.phone, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo<ProductOrderRow[]>(() => store.orders.flatMap((order) => order.products.map((product) => ({ rowId: `${order.id}-${product.id}`, order, product }))), [store.orders]);
  const productTotalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const visibleRows = rows.slice((page - 1) * perPage, page * perPage);
  const counts = useMemo(() => {
    const result: Record<string, number> = { all: store.total };
    store.orders.forEach((order) => {
      const key = ["confirmed"].includes(order.status) ? "pending" : ["packed"].includes(order.status) ? "processing" : order.status;
      result[key] = (result[key] || 0) + 1;
    });
    return result;
  }, [store.orders, store.total]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") next.delete(key); else next.set(key, value);
    if (key !== "page") next.set("page", "1");
    router.push(`${ORDERS_PATH}?${next.toString()}`, { scroll: false });
  }

  function reset() {
    setQueryText("");
    router.push(ORDERS_PATH, { scroll: false });
  }

  if (ready && !user) {
    return <ProtectedActionPrompt title="Login to view My Orders" message="Your order product list is private. Login with mobile number to continue." reason="Login to see your orders." />;
  }

  return (
    <main className="orders-only-page">
      <header className="orders-clean-header">
        <nav><Link href="/"><Home size={14} />Home</Link><span>/</span><Link href="/account/profile">Profile</Link><span>/</span><b>My Orders</b></nav>
        <div>
          <span><Package /> Order Products</span>
          <h1>My Orders</h1>
          <p>Only your ordered products, order date, payment total, and clear product status like pending, shipped, delivered, or cancelled.</p>
        </div>
      </header>

      <section className="orders-control-bar">
        <label className="orders-search"><Search /><input value={queryText} onChange={(event) => setQueryText(event.target.value)} placeholder="Search order ID, product, seller, tracking" />{queryText ? <button type="button" onClick={() => setQueryText("")} aria-label="Clear search"><X /></button> : null}</label>
        <select value={sort} onChange={(event) => setParam("sort", event.target.value)} aria-label="Sort orders">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest amount</option>
          <option value="lowest">Lowest amount</option>
          <option value="updated">Recently updated</option>
        </select>
        <button type="button" onClick={reset}><Filter />Reset</button>
      </section>

      <nav className="orders-status-filter" aria-label="Order status filter">
        {visibleStatuses.map((status) => <button key={status} type="button" className={activeStatus === status || (status === "all" && activeStatus === "all") ? "active" : ""} onClick={() => setParam("status", status)}>{statusLabels[status]}<b>{counts[status] || 0}</b></button>)}
      </nav>

      {store.error ? <section className="orders-error"><AlertCircle /><h2>{store.error}</h2><button type="button" onClick={() => user?.phone && store.fetchOrders(user.phone, new URLSearchParams(searchParams.toString()))}>Retry</button></section> : null}
      {store.loading ? <OrdersTableSkeleton /> : rows.length === 0 ? <section className="orders-empty"><ShoppingBag /><h2>No order products found</h2><p>Try a different status or search keyword.</p><button type="button" onClick={reset}>View all orders</button></section> : <OrdersTable rows={visibleRows} onDetails={setDetails} />}

      <OrdersPagination total={rows.length} page={Math.min(page, productTotalPages)} totalPages={productTotalPages} perPage={perPage} setParam={setParam} />
      {details ? <OrderProductDetails row={details} onClose={() => setDetails(null)} /> : null}
    </main>
  );
}

function OrdersTable({ rows, onDetails }: { rows: ProductOrderRow[]; onDetails: (row: ProductOrderRow) => void }) {
  return <section className="orders-table-card"><div className="orders-table-scroll"><table className="orders-table"><thead><tr><th>Product</th><th>Order ID</th><th>Date</th><th>Qty</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row.rowId}><td><div className="table-product"><Link href={`/products/${row.product.productId}`}><Image src={row.product.image} alt={row.product.name} width={62} height={62} unoptimized /></Link><div><Link href={`/products/${row.product.productId}`}>{row.product.name}</Link><span>{row.product.seller}</span><small>{row.product.size || "Standard"} • {row.product.color || "Default"}</small></div></div></td><td><strong>{row.order.orderNumber}</strong><small>{row.order.trackingNumber}</small></td><td>{formatDate(row.order.createdAt)}<small>ETA {formatDate(row.order.estimatedDelivery)}</small></td><td>{row.product.quantity}</td><td><strong>{money(row.product.finalPrice * row.product.quantity)}</strong><small>Order {money(row.order.grandTotal)}</small></td><td><StatusBadge status={row.order.status} /></td><td><button type="button" onClick={() => onDetails(row)}><Eye />View</button></td></tr>)}</tbody></table></div></section>;
}

function OrderProductDetails({ row, onClose }: { row: ProductOrderRow; onClose: () => void }) {
  return <div className="orders-modal-backdrop"><aside className="order-product-modal" role="dialog" aria-modal="true" aria-labelledby="order-product-title"><header><div><span>Product order details</span><h2 id="order-product-title">{row.product.name}</h2></div><button type="button" onClick={onClose}><X /></button></header><div className="modal-product-hero"><Image src={row.product.image} alt={row.product.name} width={110} height={110} unoptimized /><div><StatusBadge status={row.order.status} /><p>{row.product.seller}</p><strong>{money(row.product.finalPrice * row.product.quantity)}</strong></div></div><dl><div><dt>Order ID</dt><dd>{row.order.orderNumber}</dd></div><div><dt>Order date</dt><dd>{formatDate(row.order.createdAt)}</dd></div><div><dt>Quantity</dt><dd>{row.product.quantity}</dd></div><div><dt>Payment</dt><dd>{row.order.paymentMethod} • {row.order.paymentStatus}</dd></div><div><dt>Delivery</dt><dd>{row.order.shippingAddress.line1}, {row.order.shippingAddress.city}</dd></div><div><dt>Estimated delivery</dt><dd>{formatDate(row.order.estimatedDelivery)}</dd></div></dl><footer><Link href={`/products/${row.product.productId}`}>Open Product</Link><button type="button" onClick={onClose}>Close</button></footer></aside></div>;
}

function OrdersPagination({ total, page, totalPages, perPage, setParam }: { total: number; page: number; totalPages: number; perPage: number; setParam: (key: string, value: string) => void }) {
  return <footer className="orders-pagination"><span>{total} orders</span><label>Show<select value={perPage} onChange={(event) => setParam("perPage", event.target.value)}><option>10</option><option>20</option><option>50</option></select></label><button type="button" disabled={page <= 1} onClick={() => setParam("page", String(page - 1))}><ChevronLeft />Previous</button>{Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1).map((value) => <button key={value} type="button" className={value === page ? "active" : ""} onClick={() => setParam("page", String(value))}>{value}</button>)}<button type="button" disabled={page >= totalPages} onClick={() => setParam("page", String(page + 1))}>Next<ChevronRight /></button></footer>;
}

function OrdersTableSkeleton() {
  return <section className="orders-table-card"><div className="orders-loading"><Loader2 className="spin" /><span>Loading order products...</span></div>{Array.from({ length: 7 }).map((_, index) => <div className="orders-row-skeleton" key={index} />)}</section>;
}
