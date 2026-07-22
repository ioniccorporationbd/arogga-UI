"use client";

import type { ReactNode } from "react";

import MobileLoginModal from "@/Components/auth/MobileLoginModal";
import { AuthProvider, useAuth } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";

function GlobalLoginModal() {
  const { loginModalOpen, closeLoginModal } = useAuth();
  return <MobileLoginModal open={loginModalOpen} onClose={closeLoginModal} />;
}

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
          <GlobalLoginModal />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
