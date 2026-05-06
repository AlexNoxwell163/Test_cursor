"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser } from "@/types";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "@/lib/auth";

interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  initialized: boolean;
  register: (input: RegisterInput) => { ok: true } | { ok: false; error: string };
  login: (input: LoginInput) => { ok: true } | { ok: false; error: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setInitialized(true);
  }, []);

  const register = useCallback((input: RegisterInput) => {
    const result = registerUser(input);
    if (!result.ok) return result;
    setUser(result.user);
    return { ok: true as const };
  }, []);

  const login = useCallback((input: LoginInput) => {
    const result = loginUser(input);
    if (!result.ok) return result;
    setUser(result.user);
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initialized,
      register,
      login,
      logout,
    }),
    [initialized, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
