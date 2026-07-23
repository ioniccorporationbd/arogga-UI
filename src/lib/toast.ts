"use client";

import { toast, type ToastOptions } from "react-toastify";

export type AroggaToastType = "success" | "error" | "info" | "warning";

export type AroggaToastDetail = {
  type: AroggaToastType;
  message: string;
  options?: ToastOptions;
};

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 2300,
  closeOnClick: true,
  pauseOnHover: true,
};

export function showToast(type: AroggaToastType, message: string, options?: ToastOptions) {
  toast[type](message, { ...baseOptions, ...options });
}

function emit(type: AroggaToastType, message: string, options?: ToastOptions) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<AroggaToastDetail>("arogga-toast", {
      detail: { type, message, options },
    }));
    return;
  }

  showToast(type, message, options);
}

export const notify = {
  success(message: string, options?: ToastOptions) {
    emit("success", message, options);
  },
  error(message: string, options?: ToastOptions) {
    emit("error", message, options);
  },
  info(message: string, options?: ToastOptions) {
    emit("info", message, options);
  },
  warning(message: string, options?: ToastOptions) {
    emit("warning", message, options);
  },
};
