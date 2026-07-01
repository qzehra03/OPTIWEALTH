"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { PremiumOptiWealthLogo } from "./PremiumOptiWealthLogo";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5">
          <PremiumOptiWealthLogo className="h-7 w-7 shrink-0" />
          <span className="font-sans antialiased tracking-tight text-base text-finance-deep">OptiWealth</span>
        </Link>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {!isLoading && isAuthenticated && user ? (
            <>
              <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <User className="h-3.5 w-3.5" />
                {user.full_name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : !isLoading ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/onboard">Get Started</Link>
              </Button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
