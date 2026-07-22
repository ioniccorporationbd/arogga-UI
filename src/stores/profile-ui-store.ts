import { create } from "zustand";
import type { ProfileSection } from "@/types/profile";

type ProfileUiStore = {
  sidebarOpen: boolean;
  collapsed: boolean;
  modal: string;
  selectedTab: ProfileSection;
  draft: Record<string, unknown>;
  notificationCount: number;
  setSidebarOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
  setModal: (modal: string) => void;
  setSelectedTab: (tab: ProfileSection) => void;
  setDraft: (key: string, value: unknown) => void;
  clearSensitive: () => void;
};

export const useProfileUiStore = create<ProfileUiStore>((set) => ({
  sidebarOpen: false,
  collapsed: false,
  modal: "",
  selectedTab: "profile",
  draft: {},
  notificationCount: 2,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
  setModal: (modal) => set({ modal }),
  setSelectedTab: (selectedTab) => set({ selectedTab }),
  setDraft: (key, value) => set((state) => ({ draft: { ...state.draft, [key]: value } })),
  clearSensitive: () => set({ modal: "", draft: {}, notificationCount: 0, sidebarOpen: false }),
}));
