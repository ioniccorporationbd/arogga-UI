"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calculateLabCartSummary, createLabBookingLine, type DiagnosticCenter, type LabBookingLine, type LabQuery, type LabTest } from "./domain";
import { notify } from "@/lib/notify";

export type LabApiResponse = { ok: boolean; items: LabTest[]; meta: { page: number; limit: number; total: number; pageCount: number; hasNextPage: boolean; hasPreviousPage: boolean }; facets: { centers: { label: string; value: string }[]; organs: { label: string; total: number }[]; healthConcerns: { label: string; total: number }[]; packageGroups: { label: string; total: number }[]; sampleTypes: { label: string; total: number }[] } };

export function useLabTests(query: LabQuery) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); });
  return useQuery<LabApiResponse>({ queryKey: ["lab-tests", query], queryFn: async () => { const response = await fetch(`/api/lab/tests?${params.toString()}`); if (!response.ok) throw new Error("Lab tests could not be loaded"); return response.json(); }, staleTime: 120_000 });
}

export function useDiagnosticCenters() {
  return useQuery<{ ok: boolean; items: DiagnosticCenter[] }>({ queryKey: ["diagnostic-centers"], queryFn: async () => { const response = await fetch("/api/lab/diagnostics"); if (!response.ok) throw new Error("Diagnostic centers could not be loaded"); return response.json(); }, staleTime: 300_000 });
}

type LabCartState = { items: LabBookingLine[]; wishlistIds: string[]; add: (test: LabTest, center: DiagnosticCenter) => void; remove: (cartKey: string) => void; clear: () => void; toggleWishlist: (testId: string) => void };
export const useLabCartStore = create<LabCartState>()(persist((set, get) => ({
  items: [], wishlistIds: [],
  add(test, center) { const line = createLabBookingLine(test, center); set({ items: get().items.some((item) => item.cartKey === line.cartKey) ? get().items.map((item) => item.cartKey === line.cartKey ? { ...item, quantity: item.quantity + 1 } : item) : [...get().items, line] }); notify.success("Lab test added to booking cart"); },
  remove(cartKey) { set({ items: get().items.filter((item) => item.cartKey !== cartKey) }); notify.info("Lab test removed from booking cart"); },
  clear() { set({ items: [] }); notify.success("Lab booking cart cleared"); },
  toggleWishlist(testId) { const exists = get().wishlistIds.includes(testId); set({ wishlistIds: exists ? get().wishlistIds.filter((id) => id !== testId) : [...get().wishlistIds, testId] }); notify.success(exists ? "Removed from lab wishlist" : "Saved lab test"); },
}), { name: "arogga-lab-cart" }));

export function useLabCartSummary() { const items = useLabCartStore((state) => state.items); return useMemo(() => calculateLabCartSummary(items), [items]); }

export function useLabFilters() { return useState<LabQuery>({ page: 1, limit: 20, sort: "popular" }); }
