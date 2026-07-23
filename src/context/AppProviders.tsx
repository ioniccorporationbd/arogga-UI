"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import LoginModal from "@/components/auth/LoginModal";
import PendingAuthActionExecutor from "@/components/auth/PendingAuthActionExecutor";
import { showToast, type AroggaToastDetail } from "@/lib/notify";
import { AuthProvider, useAuth } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";

function GlobalLoginModal() {
  const { loginModalOpen, closeLoginModal } = useAuth();
  return <LoginModal open={loginModalOpen} onClose={closeLoginModal} />;
}

function ToastEventBridge() {
  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<AroggaToastDetail>).detail;
      if (!detail?.message) return;
      showToast(detail.type, detail.message, detail.options as ToastOptions | undefined);
    };

    window.addEventListener("arogga-toast", handleToast);
    return () => window.removeEventListener("arogga-toast", handleToast);
  }, []);

  return null;
}

export default function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1 },
      mutations: { retry: 0 },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="arogga-app-shell">{children}</div>
            <PendingAuthActionExecutor />
            <ToastEventBridge />
            <GlobalLoginModal />
            <ToastContainer
              position="top-right"
              autoClose={2300}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover
              theme="light"
              toastClassName="arogga-toastify-toast"
            />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
