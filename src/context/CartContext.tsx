"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";
import { buildCartKey, calculateCartDisplayTotals, mergeCartLines, normalizeCartItem, validateCartQuantity, type CartItem, type LegacyCartItem } from "@/lib/cart/cart-domain";
import { notify } from "@/lib/notify";

export type { CartItem } from "@/lib/cart/cart-domain";

type CartTotals = ReturnType<typeof calculateCartDisplayTotals>;
type CartContextValue = CartTotals & {
  items: CartItem[];
  count: number;
  loading: boolean;
  error: string;
  addItem: (item: LegacyCartItem, quantity?: number) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  moveToWishlist: (cartKey: string) => CartItem | null;
};

const CartContext = createContext<CartContextValue | null>(null);
const GUEST_KEY = "arogga-cart:guest";
const USER_KEY_PREFIX = "arogga-cart:";

function cartStorageKey(phone?: string) {
  return phone ? `${USER_KEY_PREFIX}${phone}` : GUEST_KEY;
}

function safeRead(key: string): CartItem[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((item) => normalizeCartItem(item)).filter((item): item is CartItem => Boolean(item)) : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}

function persist(key: string, next: CartItem[]) {
  localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new Event("arogga-cart-updated"));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const phone = user?.phone;
  const key = cartStorageKey(phone);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading] = useState(false);
  const [error] = useState("");

  useEffect(() => {
    if (phone) {
      const guest = safeRead(GUEST_KEY);
      const scoped = safeRead(key);
      if (guest.length) {
        const merged = guest.reduce((acc, item) => mergeCartLines(acc, item, item.quantity), scoped);
        persist(key, merged);
        localStorage.removeItem(GUEST_KEY);
        setItems(merged);
        return;
      }
    }
    setItems(safeRead(key));
  }, [key, phone]);

  useEffect(() => {
    const sync = () => setItems(safeRead(key));
    window.addEventListener("storage", sync);
    window.addEventListener("arogga-cart-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("arogga-cart-updated", sync);
    };
  }, [key]);

  const save = useCallback((next: CartItem[]) => {
    const previous = items;
    setItems(next);
    try {
      persist(key, next);
    } catch (err) {
      setItems(previous);
      notify.error(err instanceof Error ? err.message : "Cart update failed");
    }
  }, [items, key]);

  const addItem = useCallback((item: LegacyCartItem, quantity = 1) => {
    const normalized = normalizeCartItem(item);
    if (!normalized) {
      notify.cart.selectVariant();
      return;
    }
    const existed = safeRead(key).some((entry) => entry.cartKey === normalized.cartKey);
    const validation = validateCartQuantity(quantity, normalized.maxQuantity);
    const next = mergeCartLines(safeRead(key), normalized, validation.quantity);
    save(next);
    if (validation.warning) notify.warning(validation.warning);
    if (existed) notify.cart.updated(normalized.name); else notify.cart.added(normalized.name);
  }, [key, save]);

  const removeItem = useCallback((cartKey: string) => {
    const current = safeRead(key);
    const removed = current.find((item) => item.cartKey === cartKey || buildCartKey(item.productId, item.variantId) === cartKey);
    save(current.filter((item) => item.cartKey !== cartKey && buildCartKey(item.productId, item.variantId) !== cartKey));
    if (removed) notify.cart.removed(removed.name);
  }, [key, save]);

  const updateQuantity = useCallback((cartKey: string, quantity: number) => {
    const current = safeRead(key);
    const target = current.find((item) => item.cartKey === cartKey);
    const next = current.map((item) => item.cartKey === cartKey ? { ...item, quantity: validateCartQuantity(quantity, item.maxQuantity).quantity } : item);
    save(next);
    if (target) notify.cart.updated(target.name);
  }, [key, save]);

  const clearCart = useCallback(() => {
    save([]);
    notify.warning("Cart cleared");
  }, [save]);

  const moveToWishlist = useCallback((cartKey: string) => {
    const current = safeRead(key);
    const item = current.find((entry) => entry.cartKey === cartKey) || null;
    if (item) removeItem(cartKey);
    return item;
  }, [key, removeItem]);

  const totals = useMemo(() => calculateCartDisplayTotals(items), [items]);
  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    loading,
    error,
    ...totals,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    moveToWishlist,
  }), [items, loading, error, totals, addItem, removeItem, updateQuantity, clearCart, moveToWishlist]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
