"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import ProtectedActionPrompt from "@/Components/auth/ProtectedActionPrompt";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { user, ready } = useAuth();
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  if (ready && !user) {
    return (
      <ProtectedActionPrompt
        title="Login to view cart"
        message="Cart actions are protected. Login first to add products, update quantity, and checkout."
        reason="Login to view and manage your cart."
      />
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 90px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 30 }}>Shopping Cart</h1>
          <p style={{ color: "#667085", marginTop: 6 }}>{items.length} different products</p>
        </div>
        {items.length > 0 && (
          <button onClick={clearCart} style={{ border: 0, background: "transparent", color: "#d92d20", fontWeight: 700, cursor: "pointer" }}>
            Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <section style={{ display: "grid", placeItems: "center", minHeight: 380, textAlign: "center" }}>
          <div>
            <ShoppingBag size={54} color="#98a2b3" />
            <h2 style={{ marginTop: 14 }}>Your cart is empty</h2>
            <p style={{ color: "#667085", marginTop: 8 }}>Browse products and add your favourites.</p>
            <Link href="/store" style={{ display: "inline-grid", placeItems: "center", minHeight: 44, padding: "0 24px", marginTop: 18, borderRadius: 10, color: "#fff", background: "#087b75", textDecoration: "none", fontWeight: 700 }}>Continue shopping</Link>
          </div>
        </section>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 330px", gap: 24, marginTop: 26 }}>
          <section style={{ display: "grid", gap: 12 }}>
            {items.map((item) => (
              <article key={item.id} style={{ display: "grid", gridTemplateColumns: "92px 1fr auto", gap: 16, alignItems: "center", padding: 16, border: "1px solid #e4e7ec", borderRadius: 15, background: "#fff" }}>
                <div style={{ position: "relative", height: 92, borderRadius: 12, background: "#f8faf9", overflow: "hidden" }}>
                  {item.image && <Image src={item.image} alt={item.name} fill sizes="92px" style={{ objectFit: "contain" }} unoptimized />}
                </div>
                <div>
                  <Link href={`/products/${item.slug}`} style={{ color: "#101828", fontWeight: 750, textDecoration: "none" }}>{item.name}</Link>
                  <strong style={{ display: "block", marginTop: 8, color: "#087b75" }}>৳{item.price.toFixed(2)}</strong>
                  <div style={{ display: "inline-flex", alignItems: "center", marginTop: 10, border: "1px solid #d0d5dd", borderRadius: 9 }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={qtyButton}><Minus size={13} /></button>
                    <span style={{ minWidth: 34, textAlign: "center", fontWeight: 800 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={qtyButton}><Plus size={13} /></button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} style={{ border: 0, background: "#fff1f2", color: "#e11d48", width: 38, height: 38, borderRadius: 11, cursor: "pointer" }} aria-label={`Remove ${item.name}`}>
                  <Trash2 size={17} />
                </button>
              </article>
            ))}
          </section>
          <aside style={{ padding: 20, border: "1px solid #e4e7ec", borderRadius: 16, background: "#fff", height: "fit-content" }}>
            <h2>Order summary</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}><span>Subtotal</span><strong>৳{subtotal.toFixed(2)}</strong></div>
            <Link href="/checkout" style={{ display: "grid", placeItems: "center", minHeight: 46, marginTop: 20, borderRadius: 11, color: "#fff", background: "#087b75", textDecoration: "none", fontWeight: 850 }}>Checkout</Link>
          </aside>
        </div>
      )}
    </main>
  );
}

const qtyButton = { width: 34, height: 34, border: 0, background: "transparent", cursor: "pointer", color: "#087b75" } as const;
