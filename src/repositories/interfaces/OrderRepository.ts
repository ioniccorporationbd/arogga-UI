import type { Order } from "@/types";

export interface OrderRepository {
  list(userId?: string): Promise<Order[]>;
  getById(orderId: string): Promise<Order | null>;
  createDraft(order: Omit<Order, "id" | "createdAt">): Promise<Order>;
  cancel(orderId: string, reason?: string): Promise<Order>;
}
