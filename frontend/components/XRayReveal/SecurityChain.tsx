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
      <style>{`
        @keyframes scanline {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {/* Dynamic Background Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDark && (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 mix-blend-overlay opacity-40"
            style={{ backgroundImage: "url('/bg-security-dark.png')" }}
          />
        )}
        {/* Animated grid overlay for tech feel */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(to right, ${dotColor} 1px, transparent 1px), linear-gradient(to bottom, ${dotColor} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Center glowing orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-[800px] h-[800px] rounded-full blur-[120px] transition-opacity duration-1000"
            style={{ backgroundColor: glowColor, opacity: isDark ? 0.8 : 1 }}
          />
        </div>
        {/* Top/bottom vignette gradients */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${sectionBg} 0%, transparent 20%, transparent 80%, ${sectionBg} 100%)`
          }}
        />
      </div>

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
              className="relative p-8 rounded-2xl backdrop-blur-md space-y-6 overflow-hidden transition-all duration-500 group cursor-default"
              style={{
                border: `1px solid ${cardBorder}`,
                backgroundColor: isDark ? "rgba(13,43,30,0.5)" : "rgba(255,255,255,0.7)",
                boxShadow: isDark 
                  ? "inset 0 0 30px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.4)" 
                  : "inset 0 0 30px rgba(255,255,255,0.8), 0 10px 30px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isDark ? "rgba(212,175,55,0.8)" : "rgba(184,150,14,0.8)";
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = isDark 
                  ? "inset 0 0 30px rgba(212,175,55,0.1), 0 20px 40px rgba(212,175,55,0.15)" 
                  : "inset 0 0 30px rgba(255,255,255,1), 0 20px 40px rgba(184,150,14,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = cardBorder;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isDark 
                  ? "inset 0 0 30px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.4)" 
                  : "inset 0 0 30px rgba(255,255,255,0.8), 0 10px 30px rgba(0,0,0,0.05)";
              }}
            >
              {/* Animated Scanline */}
              <div 
                className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 z-20 pointer-events-none" 
                style={{ animation: "scanline 2s linear infinite" }}
              />
              
              {/* Glowing Orb Behind Icon */}
              <div 
                className="absolute top-6 left-6 w-16 h-16 rounded-full blur-2xl transition-colors duration-700 pointer-events-none"
                style={{ backgroundColor: isDark ? "rgba(212,175,55,0.15)" : "rgba(184,150,14,0.2)" }}
              />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-4xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500">{item.icon}</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-70" style={{ color: titleColor }}>Active</span>
                </div>
              </div>
              
              <div className="relative z-10 space-y-3">
                <h3
                  className="text-base font-black uppercase tracking-widest font-sans"
                  style={{ color: titleColor }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium" style={{ color: descColor }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
