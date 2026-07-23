"use client";

import { create } from "zustand";
import type { PendingAuthAction } from "@/types";

type PendingAuthActionState = {
  pendingAction: PendingAuthAction | null;
  setPendingAction: (action: PendingAuthAction) => void;
  clearPendingAction: () => void;
};

export const usePendingAuthActionStore = create<PendingAuthActionState>((set) => ({
  pendingAction: null,
  setPendingAction: (pendingAction) => set({ pendingAction }),
  clearPendingAction: () => set({ pendingAction: null }),
}));

export function getPendingAuthAction() {
  return usePendingAuthActionStore.getState().pendingAction;
}

export function setPendingAuthAction(action: PendingAuthAction) {
  usePendingAuthActionStore.getState().setPendingAction(action);
}

export function clearPendingAuthAction() {
  usePendingAuthActionStore.getState().clearPendingAction();
}
