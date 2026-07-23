import type { ProfileSection } from "@/types/profile";

export type AccountSection = ProfileSection | "security" | "support" | "settings" | "rewards" | "referrals" | "wallet";

export type PendingAuthAction =
  | { type: "ADD_TO_CART"; payload: { productId: string; variantId: string; quantity: number } }
  | { type: "ADD_TO_WISHLIST"; payload: { productId: string } }
  | { type: "BUY_NOW"; payload: { productId: string; variantId: string; quantity: number } }
  | { type: "OPEN_ACCOUNT_SECTION"; payload: { section: AccountSection } }
  | { type: "CHECKOUT" }
  | { type: "OPEN_ORDERS" }
  | { type: "OPEN_INBOX" };
