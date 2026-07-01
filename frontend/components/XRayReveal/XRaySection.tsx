"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";

export function XRaySection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme-specific styling classes
  const sectionBg = isDark ? "bg-[#0B120F]" : "bg-[#F9F9F6]";
  const badgeText = isDark ? "text-[#E07A5F]" : "text-[#A66238]";
  const headerText = isDark ? "text-white font-serif" : "text-[#001610] font-sans";
  const descText = isDark ? "text-gray-400" : "text-[#5B6A63]";
  const cardBorder = isDark 
    ? "border-[#16231E] hover:border-emerald-800" 
    : "border-[#EAEAE4] hover:border-emerald-600";
  const cardBg = isDark ? "bg-[#0E1714]" : "bg-white shadow-sm";
  const cardNumBg = isDark ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-100/50 text-emerald-700";
  const cardTitle = isDark ? "text-white" : "text-[#001610]";

  return (
    <section 
      id="xray" 
      className={`relative min-h-screen w-full ${sectionBg} py-24 px-6 flex flex-col justify-center items-center transition-colors duration-500`}
    >
      <div className="max-w-5xl w-full mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className={`text-xs uppercase tracking-widest ${badgeText} font-semibold transition-colors duration-500`}>
            System Architecture
          </span>
          <h2 className={`text-4xl ${headerText} transition-colors duration-500`}>
            The OptiWealth Rule Engine
          </h2>
          <p className={`${descText} max-w-xl mx-auto text-sm leading-relaxed transition-colors duration-500`}>
            Behind the scenes of our automated tax optimization and behavioral rule execution pathways.
          </p>
        </div>

        {/* 3-Tier Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          
          {/* Card 1: Ingestion */}
          <div className={`border ${cardBorder} ${cardBg} p-8 rounded-xl space-y-4 transition-all duration-300`}>
            <div className={`w-10 h-10 rounded-lg ${cardNumBg} flex items-center justify-center font-mono text-sm transition-colors duration-500`}>
              01
            </div>
            <h3 className={`text-lg font-medium ${cardTitle} transition-colors duration-500`}>
              Data Ingestion Layer
            </h3>
            <p className={`${descText} text-sm leading-relaxed transition-colors duration-500`}>
              Secure ingestion channels aggregating data streams, financial wallets, and live asset tracking securely via tokenized endpoints.
            </p>
          </div>

          {/* Card 2: Engine */}
          <div className={`border ${cardBorder} ${cardBg} p-8 rounded-xl space-y-4 transition-all duration-300`}>
            <div className={`w-10 h-10 rounded-lg ${cardNumBg} flex items-center justify-center font-mono text-sm transition-colors duration-500`}>
              02
            </div>
            <h3 className={`text-lg font-medium ${cardTitle} transition-colors duration-500`}>
              Behavioral Rule Core
            </h3>
            <p className={`${descText} text-sm leading-relaxed transition-colors duration-500`}>
              Deterministic compliance state machines calculating thresholds like the 50/30/20 balance and real-time tax optimization paths.
            </p>
          </div>

          {/* Card 3: Execution */}
          <div className={`border ${cardBorder} ${cardBg} p-8 rounded-xl space-y-4 transition-all duration-300`}>
            <div className={`w-10 h-10 rounded-lg ${cardNumBg} flex items-center justify-center font-mono text-sm transition-colors duration-500`}>
              03
            </div>
            <h3 className={`text-lg font-medium ${cardTitle} transition-colors duration-500`}>
              Automated Capital Engine
            </h3>
            <p className={`${descText} text-sm leading-relaxed transition-colors duration-500`}>
              Triggers optimized ledger distribution and rebalancing routines across active portfolios without manual friction.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
