/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = { phone: string; name: string };

type AuthGateOptions = {
  reason?: string;
};

type Value = {
  user: AuthUser | null;
  ready: boolean;
  isAuthenticated: boolean;
  loginModalOpen: boolean;
  loginReason: string;
  login: (phone: string) => void;
  logout: () => void;
  openLoginModal: (reason?: string) => void;
  closeLoginModal: () => void;
  requireAuth: (options?: AuthGateOptions) => boolean;
};

const AuthContext = createContext<Value | null>(null);
const KEY = "arogga-auth-user";
const DEFAULT_LOGIN_REASON = "Login to continue with this action.";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginReason, setLoginReason] = useState(DEFAULT_LOGIN_REASON);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      localStorage.removeItem(KEY);
    }
    setReady(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setLoginModalOpen(false);
    setLoginReason(DEFAULT_LOGIN_REASON);
  }, []);

  const openLoginModal = useCallback((reason?: string) => {
    setLoginReason(reason || DEFAULT_LOGIN_REASON);
    setLoginModalOpen(true);
  }, []);

  const login = useCallback((phone: string) => {
    const next = { phone, name: "Arogga User" };
    localStorage.setItem(KEY, JSON.stringify(next));
    setUser(next);
    closeLoginModal();
  }, [closeLoginModal]);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setUser(null);
  }, []);

  const requireAuth = useCallback((options?: AuthGateOptions) => {
    if (user) return true;
    openLoginModal(options?.reason);
    return false;
  }, [openLoginModal, user]);

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: Boolean(user),
      loginModalOpen,
      loginReason,
      login,
      logout,
      openLoginModal,
      closeLoginModal,
      requireAuth,
    }),
    [
      user,
      ready,
      loginModalOpen,
      loginReason,
      login,
      logout,
      openLoginModal,
      closeLoginModal,
      requireAuth,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
