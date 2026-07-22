"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { useState } from "react";

import MobileLoginModal from "@/Components/auth/MobileLoginModal";
import { AuthProvider, useAuth } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";

function GlobalLoginModal() {
  const { loginModalOpen, closeLoginModal } = useAuth();
  return <MobileLoginModal open={loginModalOpen} onClose={closeLoginModal} />;
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
            <GlobalLoginModal />
            <Toaster
              richColors
              closeButton
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: "18px",
                  border: "1px solid rgba(8, 123, 117, 0.16)",
                  boxShadow: "0 24px 60px -42px rgba(15, 23, 42, 0.7)",
                  fontSize: "13px",
                },
              }}
            />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
