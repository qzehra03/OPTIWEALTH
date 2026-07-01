"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/hooks/useTheme";

export function HeroFallbackImage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden">
      {/* Dark Version */}
      <div
        className={`absolute inset-0 transition-opacity duration-600 ease-in-out ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          src="/images/silk-dark.jpg"
          alt="Silk Emerald Background (Dark)"
          fill
          priority
          sizes="100vw"
          className="object-cover transition-[object-position] duration-300"
          style={{
            // Overrides based on layout specs (35% center on wide viewports to keep glowing strand visible)
            objectPosition: "var(--object-pos-dark, center)",
          }}
        />
      </div>

      {/* Light Version */}
      <div
        className={`absolute inset-0 transition-opacity duration-600 ease-in-out ${
          !isDark ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          src="/images/silk-light.jpg"
          alt="Silk Alabaster Background (Light)"
          fill
          priority
          sizes="100vw"
          className="object-cover transition-[object-position] duration-300"
          style={{
            // Overrides based on layout specs (65% center on wide viewports to keep glowing strand visible)
            objectPosition: "var(--object-pos-light, center)",
          }}
        />
      </div>

      {/* CSS overrides for object position breakpoints */}
      <style jsx global>{`
        :root {
          --object-pos-dark: center;
          --object-pos-light: center;
        }
        @media (min-width: 1024px) {
          :root {
            --object-pos-dark: 35% center;
            --object-pos-light: 65% center;
          }
        }
      `}</style>
      
      {/* Subtle Vignette layer to ground visual frame */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(6,13,10,0.15)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_30%,rgba(6,13,10,0.45)_100%)]" />
    </div>
  );
}
