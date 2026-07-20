"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type Props = {
  item: Omit<CartItem, "quantity">;
  availableQuantity: number;
  maximumQuantity?: number | null;
};

const STORAGE_KEY = "arogga-cart";

function readCart(): CartItem[] {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("arogga-cart-updated", { detail: items }));
}

export default function AddToCartControl({ item, availableQuantity, maximumQuantity }: Props) {
  const [quantity, setQuantity] = useState(0);
  const limit = Math.max(0, Math.min(availableQuantity, maximumQuantity ?? availableQuantity));

  useEffect(() => {
    const sync = () => {
      const current = readCart().find((entry) => entry.id === item.id);
      setQuantity(current?.quantity ?? 0);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("arogga-cart-updated", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("arogga-cart-updated", sync as EventListener);
    };
  }, [item.id]);

  function update(nextQuantity: number) {
    const safeQuantity = Math.max(0, Math.min(nextQuantity, limit));
    const cart = readCart();
    const exists = cart.some((entry) => entry.id === item.id);
    const next = safeQuantity === 0
      ? cart.filter((entry) => entry.id !== item.id)
      : exists
        ? cart.map((entry) => entry.id === item.id ? { ...entry, ...item, quantity: safeQuantity } : entry)
        : [...cart, { ...item, quantity: safeQuantity }];
    writeCart(next);
    setQuantity(safeQuantity);
  }

  if (limit <= 0) {
    return <button type="button" className="category-add is-disabled" disabled>Sold out</button>;
  }

  if (quantity > 0) {
    return (
      <div className="category-quantity-control" aria-label={`${item.name} quantity`}>
        <button type="button" onClick={() => update(quantity - 1)} aria-label="Decrease quantity"><Minus size={14} /></button>
        <span aria-live="polite">{quantity}</span>
        <button type="button" onClick={() => update(quantity + 1)} disabled={quantity >= limit} aria-label="Increase quantity"><Plus size={14} /></button>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => update(1)} className="category-add">
      <ShoppingCart size={15} /> Add
    </button>
  );
}
