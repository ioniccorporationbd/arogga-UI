export type WishlistItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image?: string;
  brand?: string;
  price: number;
  salePrice?: number;
  stockStatus?: string;
  collectionId?: string;
  createdAt: string;
};
