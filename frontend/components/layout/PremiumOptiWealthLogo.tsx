import React from "react";

export function PremiumOptiWealthLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Background Aura Accent - Pure Minimalist Depth */}
      <circle cx="50" cy="50" r="42" fill="#F0FDF4" />
      
      {/* The Optimization Ribbon (Left Node: Capital Security) */}
      <path 
        d="M35 62C45 62 55 38 65 38C72 38 78 43 78 50C78 57 72 62 65 62C55 62 45 38 35 38C28 38 22 43 22 50C22 57 28 62 35 62Z" 
        stroke="#037A6B" 
        strokeWidth="6.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Interlocking Dynamic Ascent Line (Right Node: Compounding Flow Accent) */}
      <path 
        d="M48 54C51 50 54 44 58 41M64 35L72 35M72 35V43" 
        stroke="#4EBFA8" 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
