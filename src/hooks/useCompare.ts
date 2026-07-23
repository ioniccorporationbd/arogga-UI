"use client";

import { useCallback, useMemo, useState } from "react";

export type CompareItem = { id: string; slug: string; name: string; image?: string; price?: number; brand?: string; category?: string };
const KEY = "arogga-compare";
const LIMIT = 4;

function read(): CompareItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is CompareItem => Boolean(item && typeof item === "object" && typeof (item as CompareItem).id === "string")) : [];
  } catch {
    localStorage.removeItem(KEY);
    return [];
  }
}

export function useCompare() {
  const [items, setItems] = useState<CompareItem[]>(() => read());
  const save = useCallback((next: CompareItem[]) => {
    const limited = next.slice(0, LIMIT);
    setItems(limited);
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(limited));
  }, []);
  const add = useCallback((item: CompareItem) => save([item, ...read().filter((entry) => entry.id !== item.id)]), [save]);
  const remove = useCallback((id: string) => save(read().filter((entry) => entry.id !== id)), [save]);
  const clear = useCallback(() => save([]), [save]);
  const has = useCallback((id: string) => items.some((item) => item.id === id), [items]);
  return useMemo(() => ({ items, add, remove, clear, has, limit: LIMIT }), [items, add, remove, clear, has]);
}
