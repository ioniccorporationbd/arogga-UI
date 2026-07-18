"use client";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

type CartProduct = { id: string; slug: string; name: string; price: number; image: string; sku: string };

export default function ProductDetailActions({ product, maxQuantity, disabled }: { product: CartProduct; maxQuantity: number; disabled: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function addToCart() {
    const stored = JSON.parse(localStorage.getItem("arogga-cart") || "[]") as Array<CartProduct & { quantity: number }>;
    const found = stored.find((item) => item.id === product.id);
    const next = found
      ? stored.map((item) => item.id === product.id ? { ...item, quantity: Math.min(maxQuantity, item.quantity + quantity) } : item)
      : [...stored, { ...product, quantity }];
    localStorage.setItem("arogga-cart", JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("arogga-cart-updated", { detail: next }));
    setAdded(true);
  }

  return <div className="pd-actions">
    <div className="pd-quantity">
      <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
      <span>{quantity}</span>
      <button onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))} aria-label="Increase quantity">+</button>
    </div>
    <button className="pd-cart-button" onClick={addToCart} disabled={disabled}><ShoppingCart size={20} />{added ? "Added to cart" : "Add to cart"}</button>
  </div>;
}
