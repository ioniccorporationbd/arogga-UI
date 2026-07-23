export type User = {
  id?: string;
  phone: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  verified?: boolean;
};

export type AccountSummary = {
  user: User | null;
  orderCount: number;
  wishlistCount: number;
  unreadNotifications: number;
  savedAddressCount: number;
  walletBalance: number;
  rewardPoints: number;
};
