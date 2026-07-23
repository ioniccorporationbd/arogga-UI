import type { Notification } from "@/types";

export interface NotificationRepository {
  list(userId?: string): Promise<Notification[]>;
  unreadCount(userId?: string): Promise<number>;
  markRead(id: string): Promise<Notification[]>;
  archive(id: string): Promise<Notification[]>;
  remove(id: string): Promise<Notification[]>;
}
