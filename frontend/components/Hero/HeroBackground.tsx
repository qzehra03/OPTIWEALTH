"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";

interface HeroBackgroundProps {
  positionClassName?: string;
}

export function HeroBackground({
  positionClassName = "absolute inset-0",
}: HeroBackgroundProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bgClass = isDark ? "bg-[#0B120F]" : "bg-[#F9F9F6]";
  const gridClass = isDark 
    ? "bg-[linear-gradient(to_right,#16231E_1px,transparent_1px),linear-gradient(to_bottom,#16231E_1px,transparent_1px)]" 
    : "bg-[linear-gradient(to_right,#EAEAE4_1px,transparent_1px),linear-gradient(to_bottom,#EAEAE4_1px,transparent_1px)]";
  const glowClass = isDark 
    ? "bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_65%)]" 
    : "bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.05)_0%,transparent_65%)]";

  return (
    <div className={`${positionClassName} -z-10 ${bgClass} overflow-hidden transition-colors duration-500`}>
      {/* Subtle radial glow behind the main hero card */}
      <div className={`absolute inset-0 ${glowClass} transition-all duration-500`} />
      
      {/* Sharp Engineering Grid */}
      <div className={`absolute inset-0 ${gridClass} bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 transition-all duration-500`} />
    </div>
  );
}
