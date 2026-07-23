export type NotificationType = "order" | "delivery" | "payment" | "refund" | "promotion" | "price_drop" | "back_in_stock" | "prescription" | "support";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  archived?: boolean;
  href?: string;
  createdAt: string;
};
