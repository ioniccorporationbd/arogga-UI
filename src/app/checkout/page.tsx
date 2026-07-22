"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import ProtectedActionPrompt from "@/Components/auth/ProtectedActionPrompt";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { user, ready } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [done, setDone] = useState(false);

  if (ready && !user) {
    return (
      <ProtectedActionPrompt
        title="Login to checkout"
        message="Checkout is protected. Login first to select address, confirm delivery, and place orders."
        reason="Login to continue checkout."
      />
    );
  }

  if (done) {
    return (
      <main style={{ display: "grid", placeItems: "center", minHeight: "60vh", padding: 24, textAlign: "center" }}>
        <div><CheckCircle2 size={70} color="#087b75" /><h1 style={{ marginTop: 16 }}>Order placed successfully</h1><p style={{ marginTop: 8, color: "#667085" }}>Your demo order has been received.</p></div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "36px 20px 90px" }}>
      <h1>Checkout</h1>
      <p style={{ color: "#667085", marginTop: 7 }}>Complete the delivery information below.</p>
      <form onSubmit={(event) => { event.preventDefault(); if (items.length) { clearCart(); setDone(true); } }} style={{ display: "grid", gap: 14, marginTop: 24, padding: 22, border: "1px solid #e4e7ec", borderRadius: 16, background: "#fff" }}>
        <input required placeholder="Full name" style={input} />
        <input required placeholder="Phone number" pattern="01[3-9][0-9]{8}" style={input} />
        <textarea required placeholder="Delivery address" rows={4} style={input} />
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #eaecf0" }}><span>Total</span><strong>৳{subtotal.toFixed(2)}</strong></div>
        <button disabled={!items.length} style={{ minHeight: 48, border: 0, borderRadius: 11, color: "#fff", background: "#087b75", fontWeight: 800, opacity: items.length ? 1 : .5 }}>Place order</button>
      </form>
    </main>
  );
}

const input = { width: "100%", padding: "13px 14px", border: "1px solid #d0d5dd", borderRadius: 10, font: "inherit" } as const;
