"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/components/providers/ThemeProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────
// Chain image will be used instead of SVG
// ─────────────────────────────────────────────

export function SecurityChain() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionRef = useRef<HTMLDivElement>(null);

  // Theme-aware colours
  const sectionBg   = isDark ? "#071410"            : "#ECEFE9";
  const dotColor    = isDark ? "#D4AF37"             : "#B8960E";
  const glowColor   = isDark ? "rgba(212,175,55,0.05)" : "rgba(184,150,14,0.06)";
  const scriptColor = isDark ? "#D4AF37"             : "#B8960E";
  const subColor    = isDark ? "#8FB89A"             : "#4F6E56";
  const cardBorder  = isDark ? "rgba(212,175,55,0.15)" : "rgba(184,150,14,0.25)";
  const cardBg      = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)";
  const cardHover   = isDark ? "rgba(212,175,55,0.4)"  : "rgba(184,150,14,0.4)";
  const titleColor  = isDark ? "#D4AF37"             : "#B8960E";
  const descColor   = isDark ? "#8FB89A"             : "#4F6E56";

  return (
    <section
      ref={sectionRef}
      id="security"
      className="relative w-full overflow-hidden py-24 px-6"
      style={{ backgroundColor: sectionBg }}
    >
      {/* Background Image (Dark mode only) */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: "url('/bg-security-dark.png')" }}
          />
        </div>
      )}

      {/* Ambient dot grid (Light mode only) */}
      {!isDark && (
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
            backgroundSize: "38px 38px",
          }}
        />
      )}

      {/* Gold radial glow (Light mode only) */}
      {!isDark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ backgroundColor: glowColor }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">

        {/* Heading */}
        <div className="space-y-4">
          <p
            className="font-script text-5xl md:text-6xl leading-none"
            style={{ color: scriptColor }}
          >
            Security &amp; Trust
          </p>
          <p className="text-sm max-w-lg mx-auto" style={{ color: subColor }}>
            Because handling financial data requires absolute, uncompromising trust.
          </p>
        </div>

        {/* Trust pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {[
            {
              icon: "🔐",
              title: "AES-256 Encryption",
              desc: "Institutional-grade encryption for every data atom at rest and in transit. Identical to global banking infrastructure.",
            },
            {
              icon: "🏛️",
              title: "Non-Custodial Architecture",
              desc: "We never hold your funds. OptiWealth is a read-and-compute layer only. Capital stays exactly where you placed it.",
            },
            {
              icon: "🫥",
              title: "Zero-Knowledge Privacy",
              desc: "Mathematical proofs verify computation without revealing underlying data. Your financial profile is yours, only.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-2xl backdrop-blur-sm space-y-3 transition-all duration-300 group"
              style={{
                border: `1px solid ${cardBorder}`,
                backgroundColor: cardBg,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = cardHover)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = cardBorder)}
            >
              <span className="text-2xl">{item.icon}</span>
              <h3
                className="text-sm font-bold uppercase tracking-wide"
                style={{ color: titleColor }}
              >
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: descColor }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
