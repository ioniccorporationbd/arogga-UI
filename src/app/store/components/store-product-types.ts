export type JsonProduct = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  brand: { name: string };
  taxonomy: {
    subCategory: { name: string } | null;
    category: { name: string };
  };
  media: { featuredImage: { url: string; alt: string } };
  pricing: {
    currency: string;
    regularPrice: number;
    salePrice: number | null;
    discount: { percentage: number };
  };
  inventory: { availableQuantity: number };
  ratings: { average: number | null; count: number };
  shipping: {
    delivery: {
      estimatedMinimumDays: number;
      estimatedMaximumDays: number;
    };
  };
};

export type StoreProduct = {
  id: string;
  brand: string;
  title: string;
  category: string;
  image: string;
  rating: number | null;
  slug: string;
  href: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  reviewCount: number;
  currencySymbol: string;
  deliveryText: string;
};
