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

import { notify } from "@/lib/toast";

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
  login: (phone: string, user?: AuthUser) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthUser | null>;
  openLoginModal: (reason?: string) => void;
  closeLoginModal: () => void;
  requireAuth: (options?: AuthGateOptions) => boolean;
};

const AuthContext = createContext<Value | null>(null);
const KEY = "arogga-auth-user";
const DEFAULT_LOGIN_REASON = "Login to continue with this action.";

function readLocalUser() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    localStorage.removeItem(KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginReason, setLoginReason] = useState(DEFAULT_LOGIN_REASON);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store", credentials: "include" });
      const data = await response.json();
      if (data?.authenticated && data.user) {
        const nextUser = data.user as AuthUser;
        localStorage.setItem(KEY, JSON.stringify(nextUser));
        setUser(nextUser);
        return nextUser;
      }
    } catch {
      // keep guest/local fallback usable in development
    }

    const fallback = readLocalUser();
    setUser(fallback);
    return fallback;
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setReady(true));
  }, [refreshSession]);

  const closeLoginModal = useCallback(() => {
    setLoginModalOpen(false);
    setLoginReason(DEFAULT_LOGIN_REASON);
  }, []);

  const openLoginModal = useCallback((reason?: string) => {
    setLoginReason(reason || DEFAULT_LOGIN_REASON);
    setLoginModalOpen(true);
  }, []);

  const login = useCallback((phone: string, nextUser?: AuthUser) => {
    const authenticatedUser = nextUser || { phone, name: "Arogga User" };
    localStorage.setItem(KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    closeLoginModal();
    notify.success("Logged in successfully");
  }, [closeLoginModal]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // Local cleanup still runs so users are not stuck in an authenticated shell.
    }
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
      refreshSession,
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
      refreshSession,
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
