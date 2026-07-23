/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";
import { notify } from "@/lib/notify";
import { mergeGuestWishlist, shouldRequireWishlistLogin, wishlistKey } from "@/lib/wishlist/wishlist-domain";

export type WishlistItem = {
  id: string;
  productId?: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  sku?: string;
  brand?: string;
  category?: string;
  rating?: number;
  stock?: number;
  addedAt?: string;
};

type Value = {
  items: WishlistItem[];
  count: number;
  loading: boolean;
  error: string;
  has: (id: string) => boolean;
  add: (item: WishlistItem) => void;
  addWithAuth: (item: WishlistItem) => boolean;
  toggle: (item: WishlistItem) => void;
  toggleWithAuth: (item: WishlistItem) => boolean;
  remove: (id: string) => void;
  moveToCart: (id: string) => WishlistItem | null;
  mergeGuestWishlist: () => void;
  clear: () => void;
};

const WishlistContext = createContext<Value | null>(null);
const GUEST_KEY = wishlistKey();

function idOf(item: WishlistItem) { return item.productId || item.id; }
function normalizeItem(item: WishlistItem): WishlistItem { return { ...item, productId: idOf(item), id: idOf(item), slug: item.slug || idOf(item), addedAt: item.addedAt || new Date().toISOString() }; }
function readFromKey(key: string): WishlistItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.filter((item): item is WishlistItem => Boolean(item && typeof item === "object" && typeof item.id === "string")).map(normalizeItem) : [];
  } catch { localStorage.removeItem(key); return []; }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, requireAuth } = useAuth();
  const key = wishlistKey(user?.phone);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading] = useState(false);
  const [error] = useState("");

  const save = useCallback((nextItems: WishlistItem[]) => {
    const normalized = nextItems.map(normalizeItem);
    setItems(normalized);
    localStorage.setItem(key, JSON.stringify(normalized));
    window.dispatchEvent(new Event("arogga-wishlist-updated"));
  }, [key]);

  const mergeGuest = useCallback(() => {
    if (!user?.phone) return;
    const merged = mergeGuestWishlist(readFromKey(GUEST_KEY).map((item) => ({ productId: idOf(item), slug: item.slug, name: item.name, image: item.image, addedAt: item.addedAt })), readFromKey(key).map((item) => ({ productId: idOf(item), slug: item.slug, name: item.name, image: item.image, addedAt: item.addedAt })));
    const next = merged.map((item) => ({ ...item, id: item.productId, price: 0 }));
    localStorage.removeItem(GUEST_KEY);
    save(next);
  }, [key, save, user?.phone]);

  useEffect(() => {
    if (user?.phone && readFromKey(GUEST_KEY).length > 0) mergeGuest();
    else setItems(readFromKey(key));
  }, [key, mergeGuest, user?.phone]);

  const add = useCallback((item: WishlistItem) => {
    const current = readFromKey(key);
    const normalized = normalizeItem(item);
    const exists = current.some((entry) => idOf(entry) === idOf(normalized));
    save(exists ? current.map((entry) => idOf(entry) === idOf(normalized) ? { ...entry, ...normalized } : entry) : [normalized, ...current]);
    notify.wishlist.added(item.name);
  }, [key, save]);

  const addWithAuth = useCallback((item: WishlistItem) => {
    if (shouldRequireWishlistLogin(user)) {
      requireAuth({ reason: "Login to save products to wishlist.", pendingAction: { type: "ADD_TO_WISHLIST", payload: { productId: idOf(item) } } });
      return false;
    }
    add(item);
    return true;
  }, [add, requireAuth, user]);

  const toggle = useCallback((item: WishlistItem) => {
    const current = readFromKey(key);
    const exists = current.some((entry) => idOf(entry) === idOf(item));
    save(exists ? current.filter((entry) => idOf(entry) !== idOf(item)) : [normalizeItem(item), ...current]);
    if (exists) notify.wishlist.removed(item.name); else notify.wishlist.added(item.name);
  }, [key, save]);

  const toggleWithAuth = useCallback((item: WishlistItem) => {
    if (shouldRequireWishlistLogin(user)) {
      requireAuth({ reason: "Login to save products to wishlist.", pendingAction: { type: "ADD_TO_WISHLIST", payload: { productId: idOf(item) } } });
      return false;
    }
    toggle(item);
    return true;
  }, [requireAuth, toggle, user]);

  const remove = useCallback((id: string) => {
    const current = readFromKey(key);
    const removed = current.find((item) => idOf(item) === id);
    save(current.filter((item) => idOf(item) !== id));
    if (removed) notify.wishlist.removed(removed.name);
  }, [key, save]);

  const moveToCart = useCallback((id: string) => {
    const current = readFromKey(key);
    const item = current.find((entry) => idOf(entry) === id) || null;
    if (item) remove(id);
    return item;
  }, [key, remove]);

  const clear = useCallback(() => save([]), [save]);

  const value = useMemo(() => ({
    items,
    count: items.length,
    loading,
    error,
    has: (id: string) => items.some((item) => idOf(item) === id),
    add,
    addWithAuth,
    toggle,
    toggleWithAuth,
    remove,
    moveToCart,
    mergeGuestWishlist: mergeGuest,
    clear,
  }), [items, loading, error, add, addWithAuth, toggle, toggleWithAuth, remove, moveToCart, mergeGuest, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used inside WishlistProvider");
  return value;
}
