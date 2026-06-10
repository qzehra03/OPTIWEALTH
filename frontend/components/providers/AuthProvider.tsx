"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  setAuthSession,
  type AuthSession,
} from "@/lib/auth";
import { fetchCurrentUser } from "@/lib/api";
import type { UserResponse } from "@/lib/types";

interface AuthContextValue {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((session: AuthSession) => {
    setAuthSession(session);
    setToken(session.accessToken);
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    const storedToken = getStoredToken();
    if (!storedToken) return;

    try {
      const profile = await fetchCurrentUser(storedToken);
      setUser(profile);
      localStorage.setItem("optiwealth_user", JSON.stringify(profile));
    } catch {
      clearAuthSession();
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      fetchCurrentUser(storedToken)
        .then((profile) => {
          setUser(profile);
          localStorage.setItem("optiwealth_user", JSON.stringify(profile));
        })
        .catch(() => {
          clearAuthSession();
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token && !!user,
      login,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, login, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
