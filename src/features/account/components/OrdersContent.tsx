"use client";
import { useLocalOrders } from "./account-data";
export default function OrdersContent(){const orders=useLocalOrders();return <section className="account-content"><h2>Orders</h2>{orders.length===0?<p className="muted">No local orders yet.</p>:orders.map(o=><article className="account-card" key={o.id}><strong>{o.orderNumber}</strong><span>{o.status} · {o.paymentMethod}</span><b>৳{Math.round(o.totals.grandTotal).toLocaleString()}</b></article>)}</section>}
