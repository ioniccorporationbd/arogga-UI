export type ProfileSection = "profile" | "balance" | "offers" | "orders" | "wishlist" | "prescriptions" | "addresses" | "patients" | "reviews" | "reports" | "blog" | "faq" | "privacy-policy";

export type DashboardRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  amount?: number;
  date?: string;
  image?: string;
  meta?: string;
};

export type ProfileDashboardData = {
  user: {
    name: string;
    phone: string;
    email: string;
    avatar: string;
    verified: boolean;
    language: string;
    bloodGroup: string;
    createdAt: string;
    emergencyContact: string;
    defaultAddress: string;
  };
  stats: { label: string; value: string; help: string }[];
  records: Record<ProfileSection, DashboardRecord[]>;
  notifications: { id: string; title: string; body: string; read: boolean; href: string }[];
};
