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
            {children}
            <GlobalLoginModal />
            <Toaster richColors position="top-right" />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
