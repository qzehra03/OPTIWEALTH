"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
      aria-label="Toggle theme"
    >
      <div className="relative h-4 w-4">
        {theme === "light" ? (
          <Moon className="absolute inset-0 h-4 w-4 rotate-0 scale-100 transition-all duration-350 ease-out text-primary" />
        ) : (
          <Sun className="absolute inset-0 h-4 w-4 rotate-0 scale-100 transition-all duration-350 ease-out text-amber-500" />
        )}
      </div>
    </button>
  );
}
