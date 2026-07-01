"use client";

import React from "react";

export function HeroFrame({
  children,
  rectClassName = "hero-frame-rect",
}: {
  children: React.ReactNode;
  rectClassName?: string;
}) {
  return (
    <div className="relative p-8 md:p-16 max-w-4xl w-full mx-auto bg-bg-base/35 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/5">
      {/* SVG drawing frame around the content */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          className={rectClassName}
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          rx="16"
          fill="none"
          stroke="var(--accent-copper)"
          strokeWidth="1.5"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset="100"
          style={{ transformOrigin: "center" }}
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
