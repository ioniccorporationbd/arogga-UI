export type WishlistDomainItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  addedAt?: string;
};

export function shouldRequireWishlistLogin(user: { phone?: string } | null | undefined) {
  return !user?.phone;
}

export function wishlistKey(phone?: string) {
  return `arogga-wishlist:${phone || "guest"}`;
}

export function normalizeWishlistItem(item: WishlistDomainItem): WishlistDomainItem {
  return { ...item, addedAt: item.addedAt || new Date().toISOString() };
}

export function mergeGuestWishlist(guest: WishlistDomainItem[], user: WishlistDomainItem[]) {
  const byId = new Map<string, WishlistDomainItem>();
  [...user, ...guest].forEach((item) => byId.set(item.productId, normalizeWishlistItem(item)));
  return Array.from(byId.values());
}
