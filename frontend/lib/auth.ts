import type { UserResponse } from "@/lib/types";

const TOKEN_KEY = "optiwealth_token";
const USER_KEY = "optiwealth_user";

export interface AuthSession {
  accessToken: string;
  user: UserResponse;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UserResponse | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserResponse;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession): void {
  localStorage.setItem(TOKEN_KEY, session.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem("optiwealth_user_id");
  sessionStorage.removeItem("optiwealth_onboarding");
  sessionStorage.removeItem("optiwealth_extended_profile");
}

export function isAuthenticated(): boolean {
  return !!getStoredToken() && !!getStoredUser();
}
