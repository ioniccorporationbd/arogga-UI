"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";

type CartProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  sku: string;
};

type CartItem = CartProduct & { quantity: number };

function readCart(): CartItem[] {
  try {
    const value = localStorage.getItem("arogga-cart");
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    localStorage.removeItem("arogga-cart");
    return [];
  }
}

export default function ProductDetailActions({
  product,
  maxQuantity,
  disabled,
}: {
  product: CartProduct;
  maxQuantity: number;
  disabled: boolean;
}) {
  const safeMaximum = Math.max(1, maxQuantity);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function addToCart() {
    if (disabled) return;

    const stored = readCart();
    const found = stored.find((item) => item.id === product.id);
    const next = found
      ? stored.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(safeMaximum, item.quantity + quantity) }
            : item,
        )
      : [...stored, { ...product, quantity: Math.min(quantity, safeMaximum) }];

    localStorage.setItem("arogga-cart", JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("arogga-cart-updated", { detail: next }));
    setAdded(true);
  }

  return (
    <div className="pd-actions">
      <div className="pd-quantity" aria-label="Product quantity">
        <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity">−</button>
        <span>{quantity}</span>
        <button type="button" onClick={() => setQuantity((current) => Math.min(safeMaximum, current + 1))} aria-label="Increase quantity">+</button>
      </div>
      <button type="button" className="pd-cart-button" onClick={addToCart} disabled={disabled}>
        {added ? <Check size={20} /> : <ShoppingCart size={20} />}
        {disabled ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}
