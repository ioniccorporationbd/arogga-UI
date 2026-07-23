import type { AddressRepository } from "./interfaces/AddressRepository";
import type { AuthRepository } from "./interfaces/AuthRepository";
import type { CartRepository } from "./interfaces/CartRepository";
import type { NotificationRepository } from "./interfaces/NotificationRepository";
import type { OrderRepository } from "./interfaces/OrderRepository";
import type { ProductRepository } from "./interfaces/ProductRepository";
import type { ProfileRepository } from "./interfaces/ProfileRepository";
import type { WishlistRepository } from "./interfaces/WishlistRepository";

export type DataSource = "local" | "api";

export function getDataSource(): DataSource {
  return (process.env.DATA_SOURCE === "api" ? "api" : "local") as DataSource;
}

export async function getAuthRepository(): Promise<AuthRepository> {
  return getDataSource() === "api"
    ? new (await import("./remote/RemoteAuthRepository")).RemoteAuthRepository()
    : new (await import("./local/LocalAuthRepository")).LocalAuthRepository();
}

export async function getProductRepository(): Promise<ProductRepository> {
  return getDataSource() === "api"
    ? new (await import("./remote/RemoteProductRepository")).RemoteProductRepository()
    : new (await import("./local/JsonProductRepository")).JsonProductRepository();
}

export async function getCartRepository(): Promise<CartRepository> {
  return getDataSource() === "api"
    ? new (await import("./remote/RemoteCartRepository")).RemoteCartRepository()
    : new (await import("./local/LocalCartRepository")).LocalCartRepository();
}

export async function getWishlistRepository(): Promise<WishlistRepository> {
  return getDataSource() === "api"
    ? new (await import("./remote/RemoteWishlistRepository")).RemoteWishlistRepository()
    : new (await import("./local/LocalWishlistRepository")).LocalWishlistRepository();
}

export async function getOrderRepository(): Promise<OrderRepository> {
  return getDataSource() === "api"
    ? new (await import("./remote/RemoteOrderRepository")).RemoteOrderRepository()
    : new (await import("./local/LocalOrderRepository")).LocalOrderRepository();
}

export async function getProfileRepository(): Promise<ProfileRepository> {
  return getDataSource() === "api"
    ? new (await import("./remote/RemoteProfileRepository")).RemoteProfileRepository()
    : new (await import("./local/LocalProfileRepository")).LocalProfileRepository();
}

export async function getAddressRepository(): Promise<AddressRepository> {
  return getDataSource() === "api"
    ? new (await import("./remote/RemoteAddressRepository")).RemoteAddressRepository()
    : new (await import("./local/LocalAddressRepository")).LocalAddressRepository();
}

export async function getNotificationRepository(): Promise<NotificationRepository> {
  return getDataSource() === "api"
    ? new (await import("./remote/RemoteNotificationRepository")).RemoteNotificationRepository()
    : new (await import("./local/LocalNotificationRepository")).LocalNotificationRepository();
}

export type { AddressRepository } from "./interfaces/AddressRepository";
export type { AuthRepository } from "./interfaces/AuthRepository";
export type { CartRepository } from "./interfaces/CartRepository";
export type { NotificationRepository } from "./interfaces/NotificationRepository";
export type { OrderRepository } from "./interfaces/OrderRepository";
export type { ProductRepository, ProductQuery, ProductListResult } from "./interfaces/ProductRepository";
export type { ProfileRepository } from "./interfaces/ProfileRepository";
export type { WishlistRepository } from "./interfaces/WishlistRepository";
