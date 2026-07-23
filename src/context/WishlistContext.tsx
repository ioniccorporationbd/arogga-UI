/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { notify } from "@/lib/notify";

export type WishlistItem = {
  id: string;
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
  has: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
};

const WishlistContext = createContext<Value | null>(null);
const LEGACY_KEY = "arogga-wishlist";
const USER_KEY_PREFIX = "arogga-wishlist:";

function getWishlistKey(phone?: string) {
  return `${USER_KEY_PREFIX}${phone || "guest"}`;
}

function normalizeItem(item: WishlistItem): WishlistItem {
  return {
    ...item,
    slug: item.slug || item.id,
    addedAt: item.addedAt || new Date().toISOString(),
  };
}

function readFromKey(key: string): WishlistItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value)
      ? value.filter((item): item is WishlistItem => Boolean(item && typeof item === "object" && typeof item.id === "string"))
      : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}

function read(phone?: string): WishlistItem[] {
  const scopedKey = getWishlistKey(phone);
  const scopedItems = readFromKey(scopedKey);
  if (scopedItems.length > 0 || !phone) return scopedItems;

  const legacyItems = readFromKey(LEGACY_KEY);
  if (legacyItems.length > 0) {
    localStorage.setItem(scopedKey, JSON.stringify(legacyItems.map(normalizeItem)));
    return legacyItems.map(normalizeItem);
  }

  return [];
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const phone = user?.phone;
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(read(phone));
  }, [phone]);

  const save = useCallback((nextItems: WishlistItem[]) => {
    const normalized = nextItems.map(normalizeItem);
    setItems(normalized);
    localStorage.setItem(getWishlistKey(phone), JSON.stringify(normalized));
  }, [phone]);

  const add = useCallback((item: WishlistItem) => {
    const current = read(phone);
    const normalized = normalizeItem(item);
    const exists = current.some((entry) => entry.id === item.id);
    save(exists
      ? current.map((entry) => entry.id === item.id ? { ...entry, ...normalized } : entry)
      : [normalized, ...current]);
    notify.wishlist.added(item.name);
  }, [phone, save]);

  const toggle = useCallback((item: WishlistItem) => {
    const current = read(phone);
    const exists = current.some((entry) => entry.id === item.id);
    save(exists
      ? current.filter((entry) => entry.id !== item.id)
      : [normalizeItem(item), ...current]);
    if (exists) notify.wishlist.removed(item.name); else notify.wishlist.added(item.name);
  }, [phone, save]);

  const remove = useCallback((id: string) => {
    const current = read(phone);
    const removed = current.find((item) => item.id === id);
    save(current.filter((item) => item.id !== id));
    if (removed) notify.wishlist.removed(removed.name);
  }, [phone, save]);

  const value = useMemo(
    () => ({
      items,
      has: (id: string) => items.some((item) => item.id === id),
      toggle,
      add,
      remove,
    }),
    [items, toggle, add, remove],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used inside WishlistProvider");
  return value;
}
