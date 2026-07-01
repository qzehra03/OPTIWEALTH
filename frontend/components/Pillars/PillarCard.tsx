"use client";

import React from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface PillarData {
  id: number;
  title: string;
  copy: string;
  // A simple static mini SVG representation for mobile
  mobileSvg: React.ReactNode;
}

export const pillars: PillarData[] = [
  {
    id: 1,
    title: "The 50/30/20 Budget Rule",
    copy: "A clear framework dividing net income into three strict paths: 50% for essential living needs, 30% for personal choices, and 20% allocated immediately to secure your savings baseline.",
    mobileSvg: (
      <svg className="w-16 h-16 text-accent-copper" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M 10,50 L 90,50 M 10,35 L 70,35 M 10,65 L 50,65" strokeLinecap="round" />
        <circle cx="90" cy="50" r="3" fill="currentColor" />
        <circle cx="70" cy="35" r="3" fill="currentColor" />
        <circle cx="50" cy="65" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "The Safe Withdrawal 4% Rule",
    copy: "A mathematically proven benchmark stating that withdrawing exactly 4% of your initial portfolio annually keeps your retirement core safe and untouched for over 30 years.",
    mobileSvg: (
      <svg className="w-16 h-16 text-accent-copper" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M 10,80 L 90,80 M 10,80 Q 50,75 90,20" strokeLinecap="round" />
        <circle cx="90" cy="20" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "The 20/4/10 Car Check",
    copy: "A disciplined evaluation engine ensuring your vehicle purchase matches true cash flow: requiring a 20% down payment, a maximum 4-year loan term, and total monthly costs capped at 10% of your income.",
    mobileSvg: (
      <svg className="w-16 h-16 text-accent-copper" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="20" y="20" width="60" height="60" rx="6" />
        <line x1="20" y1="40" x2="80" y2="40" />
        <line x1="20" y1="60" x2="80" y2="60" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "The 25x True Freedom Multiplier",
    copy: "An empirical formula calculating your absolute target nest egg. Multiplying your desired annual expenses by 25 identifies the exact point where your wealth compounds faster than you withdraw.",
    mobileSvg: (
      <svg className="w-16 h-16 text-accent-copper" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M 50,90 L 50,50 M 50,50 L 15,20 M 50,50 L 32,15 M 50,50 L 68,15 M 50,50 L 85,20 M 50,50 L 50,10" strokeLinecap="round" />
        <circle cx="50" cy="50" r="4" fill="currentColor" />
      </svg>
    ),
  },
];

export function PillarCard({ pillar, index }: { pillar: PillarData; index: number }) {
  const reducedMotion = useReducedMotion();

  // If prefers reduced motion, disable transitions and animate with zero offsets
  const cardVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // power4.out equivalent
        delay: reducedMotion ? 0 : 0.05,
      },
    },
  };

  const isLeftAlign = index % 2 === 0;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className={`flex flex-col md:flex-row items-center gap-6 p-8 rounded-2xl bg-bg-base/40 border border-white/5 backdrop-blur-sm shadow-md max-w-2xl w-full mx-auto relative ${
        isLeftAlign ? "md:self-start md:mr-auto" : "md:self-end md:ml-auto"
      }`}
    >
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-accent-copper bg-accent-copper/10 px-2.5 py-1 rounded-md">
            Pillar 0{pillar.id}
          </span>
          <h3 className="text-lg md:text-xl font-bold font-display text-text-primary">
            {pillar.title}
          </h3>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed font-sans">
          {pillar.copy}
        </p>
      </div>

      {/* Mobile-only illustration */}
      <div className="md:hidden shrink-0 p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner">
        {pillar.mobileSvg}
      </div>
    </motion.div>
  );
}
