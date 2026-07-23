"use client";

import { toast, type ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 2300,
  closeOnClick: true,
  pauseOnHover: true,
};

type ToastFn = (message: string, options?: ToastOptions) => void;
export type AroggaToastType = "success" | "error" | "info" | "warning";
export type AroggaToastDetail = {
  type: AroggaToastType;
  message: string;
  options?: ToastOptions;
};

function emit(type: "success" | "error" | "info" | "warning", message: string, options?: ToastOptions) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("arogga-toast", { detail: { type, message, options } }));
    return;
  }
  toast[type](message, { ...baseOptions, ...options });
}

export function showToast(type: "success" | "error" | "info" | "warning", message: string, options?: ToastOptions) {
  toast[type](message, { ...baseOptions, ...options });
}

export const notify = {
  auth: {
    otpSent: () => emit("success", "OTP sent successfully"),
    loginSuccess: () => emit("success", "Logged in successfully"),
    loginFailed: (message: string) => emit("error", message || "Login failed"),
    logout: () => emit("success", "Logged out successfully"),
  },
  cart: {
    added: (productName: string) => emit("success", `${productName} added to cart`),
    updated: (productName: string) => emit("info", `${productName} quantity updated`),
    removed: (productName: string) => emit("info", `${productName} removed from cart`),
    selectVariant: () => emit("warning", "Please select the required product variant"),
    outOfStock: () => emit("error", "This product is currently out of stock"),
    priceChanged: () => emit("warning", "Product price changed. Please review before checkout"),
  },
  wishlist: {
    added: (productName: string) => emit("success", `${productName} saved to wishlist`),
    removed: (productName: string) => emit("info", `${productName} removed from wishlist`),
  },
  profile: { saved: () => emit("success", "Profile saved successfully") },
  address: { saved: () => emit("success", "Address saved successfully") },
  order: {
    placed: () => emit("success", "Order placed successfully"),
    cancelled: () => emit("info", "Order cancelled successfully"),
    returnRequested: () => emit("success", "Return request submitted"),
  },
  payment: {
    pending: () => emit("info", "Payment is pending"),
    success: () => emit("success", "Payment completed successfully"),
    failed: () => emit("error", "Payment failed. Please try again"),
  },
  networkError: () => emit("error", "Network error. Please check your connection"),
  error: (message: string) => emit("error", message),
  success: emit.bind(null, "success") as ToastFn,
  info: emit.bind(null, "info") as ToastFn,
  warning: emit.bind(null, "warning") as ToastFn,
};

export const toastPromise = toast.promise;
