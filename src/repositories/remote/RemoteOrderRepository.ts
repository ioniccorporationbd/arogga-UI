import type { Order } from "@/types";
import type { OrderRepository } from "../interfaces/OrderRepository";
import { NotConfiguredError } from "./NotConfiguredError";
const reject = <T>(name: string): Promise<T> => Promise.reject(new NotConfiguredError(name));
export class RemoteOrderRepository implements OrderRepository {
  list(_userId?: string): Promise<Order[]> { return reject("RemoteOrderRepository.list"); }
  getById(_orderId: string): Promise<Order | null> { return reject("RemoteOrderRepository.getById"); }
  createDraft(_order: Omit<Order, "id" | "createdAt">): Promise<Order> { return reject("RemoteOrderRepository.createDraft"); }
  cancel(_orderId: string, _reason?: string): Promise<Order> { return reject("RemoteOrderRepository.cancel"); }
}
