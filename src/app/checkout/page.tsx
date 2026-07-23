"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import ProtectedActionPrompt from "@/Components/auth/ProtectedActionPrompt";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { addressSchema, type LocalAddress } from "@/lib/account/address-domain";
import { createInboxMessage } from "@/lib/account/account-summary";
import { createLocalOrder, type LocalOrder } from "@/lib/orders/local-order-repository";
import { LocalPaymentSimulator } from "@/lib/payments/local-payment-simulator";
import { notify } from "@/lib/notify";

const paymentMethods = ["Cash on Delivery", "bKash Demo", "Nagad Demo", "Card Demo"];
const deliveryMethods = ["Standard", "Express", "Store pickup"];
const storagePhone = "local";
const input = { width: "100%", padding: "13px 14px", border: "1px solid #d0d5dd", borderRadius: 10, font: "inherit" } as const;

function readJson<T>(key: string, fallback: T): T { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }
function writeJson<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event("arogga-account-updated")); }

export default function CheckoutPage() {
  const { user, ready } = useAuth();
  const cart = useCart();
  const [done, setDone] = useState<LocalOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [deliveryMethod, setDeliveryMethod] = useState("Standard");
  const [couponCode, setCouponCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState<LocalAddress>({ type: "Home", recipientName: "", phone: "", division: "Dhaka", district: "Dhaka", area: "", postalCode: "", streetAddress: "", apartment: "", floor: "", landmark: "", deliveryInstructions: "", isDefault: true });
  const simulatedNotice = paymentMethod !== "Cash on Delivery";
  const itemPayload = useMemo(() => cart.items.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity })), [cart.items]);

  if (ready && !user) return <ProtectedActionPrompt title="Login to checkout" message="Checkout is protected. Login first to select address, confirm delivery, and place orders." reason="Login to continue checkout." />;
  if (done) return <main style={{ display: "grid", placeItems: "center", minHeight: "60vh", padding: 24, textAlign: "center" }}><div><CheckCircle2 size={70} color="#087b75" /><h1 style={{ marginTop: 16 }}>Order placed successfully</h1><p style={{ marginTop: 8, color: "#667085" }}>{done.orderNumber} is visible in Account Drawer and /account/orders.</p></div></main>;

  async function placeOrder(event: FormEvent) {
    event.preventDefault();
    if (!cart.items.length) return;
    const parsedAddress = addressSchema.safeParse(address);
    if (!parsedAddress.success) { notify.error("Please complete a valid delivery address"); return; }
    setSubmitting(true);
    try {
      const recalcResponse = await fetch("/api/cart/recalculate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: itemPayload, couponCode, deliveryMethod }) });
      const recalc = await recalcResponse.json();
      if (!recalcResponse.ok || !recalc.ok) throw new Error(recalc.error || "Cart total validation failed");
      if (!recalc.lines?.length || recalc.lines.some((line: { quantity: number; warnings: string[] }) => line.quantity <= 0 || line.warnings.length)) throw new Error("Cart has stock or variant warnings. Please review cart.");
      const payment = await new LocalPaymentSimulator().charge({ amount: recalc.summary.grandTotal, method: paymentMethod, orderId: "pending" });
      if (!payment.ok) throw new Error("Payment failed");
      const existing = readJson<LocalOrder[]>(`arogga-orders:${storagePhone}`, []);
      const result = createLocalOrder(existing, { ownerPhone: user?.phone || storagePhone, address: parsedAddress.data, items: recalc.lines, totals: recalc.summary, paymentMethod, deliveryMethod, idempotencyKey: `${user?.phone || storagePhone}:${itemPayload.map((i) => `${i.productId}-${i.variantId}-${i.quantity}`).join("|")}:${recalc.summary.grandTotal}` });
      writeJson(`arogga-orders:${storagePhone}`, result.orders);
      const inbox = readJson(`arogga-inbox:${storagePhone}`, []);
      writeJson(`arogga-inbox:${storagePhone}`, [createInboxMessage(storagePhone, "order", `Order ${result.order.orderNumber} placed`, result.order.id), ...inbox]);
      cart.clearCart();
      notify.order.placed();
      setDone(result.order);
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Checkout failed");
    } finally { setSubmitting(false); }
  }

  return <main style={{ maxWidth: 980, margin: "0 auto", padding: "36px 20px 90px" }}><h1>Checkout</h1><p style={{ color: "#667085", marginTop: 7 }}>Trusted totals are recalculated locally before the order is created.</p><form onSubmit={placeOrder} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 330px", gap: 22, marginTop: 24 }}><section style={{ display: "grid", gap: 14, padding: 22, border: "1px solid #e4e7ec", borderRadius: 16, background: "#fff" }}><h2>Delivery address</h2><input required placeholder="Recipient name" value={address.recipientName} onChange={(e)=>setAddress({...address,recipientName:e.target.value})} style={input}/><input required placeholder="Phone number" value={address.phone} onChange={(e)=>setAddress({...address,phone:e.target.value})} style={input}/><input required placeholder="Area" value={address.area} onChange={(e)=>setAddress({...address,area:e.target.value})} style={input}/><input required placeholder="Postal code" value={address.postalCode} onChange={(e)=>setAddress({...address,postalCode:e.target.value})} style={input}/><textarea required placeholder="Street address" rows={4} value={address.streetAddress} onChange={(e)=>setAddress({...address,streetAddress:e.target.value})} style={input}/><select value={deliveryMethod} onChange={(e)=>setDeliveryMethod(e.target.value)} style={input}>{deliveryMethods.map((m)=><option key={m}>{m}</option>)}</select><select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)} style={input}>{paymentMethods.map((m)=><option key={m}>{m}</option>)}</select>{simulatedNotice?<p style={{ color: "#b54708", fontWeight: 800 }}>Simulated local payment — no real money will be transferred.</p>:null}<input placeholder="Coupon code" value={couponCode} onChange={(e)=>setCouponCode(e.target.value)} style={input}/></section><aside style={{ padding: 20, border: "1px solid #e4e7ec", borderRadius: 16, background: "#fff", height: "fit-content" }}><h2>Review</h2>{cart.items.map((item)=><p key={item.cartKey} style={{display:"flex",justifyContent:"space-between",gap:10}}><span>{item.name} × {item.quantity}</span><b>৳{Math.round((item.salePrice ?? item.regularPrice ?? 0)*item.quantity)}</b></p>)}<div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: "1px solid #e4e7ec" }}><span>Estimated local total</span><strong>৳{cart.grandTotal.toFixed(2)}</strong></div><button disabled={!cart.items.length || submitting} style={{ minHeight: 48, width: "100%", marginTop: 20, border: 0, borderRadius: 11, color: "#fff", background: "#087b75", fontWeight: 850, opacity: cart.items.length ? 1 : .5 }}>{submitting ? "Validating..." : "Place local order"}</button></aside></form></main>;
}
