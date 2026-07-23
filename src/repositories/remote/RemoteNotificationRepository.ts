import type { Notification } from "@/types";
import type { NotificationRepository } from "../interfaces/NotificationRepository";
import { NotConfiguredError } from "./NotConfiguredError";
const reject = <T>(name: string): Promise<T> => Promise.reject(new NotConfiguredError(name));
export class RemoteNotificationRepository implements NotificationRepository {
  list(_userId?: string): Promise<Notification[]> { return reject("RemoteNotificationRepository.list"); }
  unreadCount(_userId?: string): Promise<number> { return reject("RemoteNotificationRepository.unreadCount"); }
  markRead(_id: string): Promise<Notification[]> { return reject("RemoteNotificationRepository.markRead"); }
  archive(_id: string): Promise<Notification[]> { return reject("RemoteNotificationRepository.archive"); }
  remove(_id: string): Promise<Notification[]> { return reject("RemoteNotificationRepository.remove"); }
}
