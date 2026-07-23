"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { buildAccountSummary, type InboxMessage } from "@/lib/account/account-summary";
import type { LocalOrder } from "@/lib/orders/local-order-repository";

function readJson<T>(key: string, fallback: T): T { if (typeof window === "undefined") return fallback; try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }

export function useAccountSummary() {
  const cart = useCart();
  const wishlist = useWishlist();
  const [tick, setTick] = useState(0);
  useEffect(() => { const sync = () => setTick((v) => v + 1); window.addEventListener("arogga-account-updated", sync); window.addEventListener("arogga-wishlist-updated", sync); window.addEventListener("arogga-cart-updated", sync); return () => { window.removeEventListener("arogga-account-updated", sync); window.removeEventListener("arogga-wishlist-updated", sync); window.removeEventListener("arogga-cart-updated", sync); }; }, []);
  return useMemo(() => buildAccountSummary({ orders: readJson<LocalOrder[]>("arogga-orders:local", []), inbox: readJson<InboxMessage[]>("arogga-inbox:local", []), wishlistCount: wishlist.count, cartCount: cart.count }), [cart.count, wishlist.count, tick]);
}
