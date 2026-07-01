"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getStoredToken, getStoredUser } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasStoredSession =
    typeof window !== "undefined" &&
    !!getStoredToken() &&
    !!getStoredUser();
  const authed = isAuthenticated || hasStoredSession;

  useEffect(() => {
    if (!isLoading && !authed) {
      router.replace("/login");
    }
  }, [authed, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authed) {
    return null;
  }

  return <>{children}</>;
}
