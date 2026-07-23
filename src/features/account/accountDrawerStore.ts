"use client";

import { create } from "zustand";

export type AccountTab = "overview" | "orders" | "inbox" | "wishlist" | "addresses" | "patients" | "prescriptions" | "reviews" | "wallet" | "offers" | "support";

type State = { open: boolean; tab: AccountTab; openDrawer: (tab?: AccountTab) => void; closeDrawer: () => void; setTab: (tab: AccountTab) => void };
export const useAccountDrawerStore = create<State>((set) => ({ open: false, tab: "overview", openDrawer: (tab = "overview") => set({ open: true, tab }), closeDrawer: () => set({ open: false }), setTab: (tab) => set({ tab }) }));
export function openAccountDrawer(tab: AccountTab = "overview") { useAccountDrawerStore.getState().openDrawer(tab); }
