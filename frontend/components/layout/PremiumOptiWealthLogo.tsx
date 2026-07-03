import React from "react";

export function PremiumOptiWealthLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <img 
      src="/logo.png" 
      alt="OptiWealth Logo"
      className={className} 
    />
  );
}
