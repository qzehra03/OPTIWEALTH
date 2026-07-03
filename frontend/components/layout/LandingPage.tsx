"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TypewriterCard } from "@/components/Pillars/TypewriterCard";
import { TriangleWall } from "@/components/Timeline/TriangleWall";
import { ArrowRight, Shield } from "lucide-react";

// ─────────────────────────────────────────────
// The images are stored in public folder and we will use them as backgrounds.
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Decorative gold ribbon separator (thin wavy line)
// ─────────────────────────────────────────────
function GoldRibbonSeparator() {
  return (
    <div className="w-full flex justify-center pointer-events-none" aria-hidden>
      <svg viewBox="0 0 600 60" className="w-full max-w-3xl h-auto opacity-60" fill="none">
        <path
          d="M0 30 Q100 10 200 30 Q300 50 400 30 Q500 10 600 30"
          stroke="url(#sepRib)" strokeWidth="3" strokeLinecap="round"
        />
        <defs>
          <linearGradient id="sepRib" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B6914" />
            <stop offset="0.3" stopColor="#D4AF37" />
            <stop offset="0.5" stopColor="#F0D060" />
            <stop offset="0.7" stopColor="#D4AF37" />
            <stop offset="1" stopColor="#8B6914" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

const SecurityChain = dynamic(
  () => import("../XRayReveal/SecurityChain").then((m) => m.SecurityChain),
  { ssr: false }
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────
// Four Pillars data
// ─────────────────────────────────────────────
const PILLARS = [
  {
    icon: "⚡",
    title: "Agentic Tax Engine",
    description:
      "Scans multi-asset portfolios for real-time tax-loss harvesting and optimal tax allocation. Automated. Unbiased. Always on.",
  },
  {
    icon: "🧠",
    title: "Behavioral Rule Engine",
    description:
      "Analyzes spending, saving, and investing patterns to flag cognitive biases and emotional over-reactions before they cost you.",
  },
  {
    icon: "🏛️",
    title: "Unified Wealth Architecture",
    description:
      "Building a single command center for all your assets across accounts, brokerages, and tax wrappers — connected, optimized, governed.",
  },
  {
    icon: "🔮",
    title: "Predictive Scenario Engine",
    description:
      "Monte Carlo probability simulations run across your portfolio to surface risk-weighted outcomes—so every decision is made from data, not instinct.",
  },
];

// ─────────────────────────────────────────────
// Main Landing Page
// ─────────────────────────────────────────────
export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const heroScreen1Ref = useRef<HTMLDivElement>(null);
  const heroScreen2Ref = useRef<HTMLDivElement>(null);

  const satinBgRef = useRef<HTMLDivElement>(null);

  // GSAP cross-fade: Screen 1 → Screen 2 on scroll
  useEffect(() => {
    const s1 = heroScreen1Ref.current;
    const s2 = heroScreen2Ref.current;
    if (!s1 || !s2) return;

    gsap.set(s2, { autoAlpha: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: s1.closest("section"),
        start: "top top",
        end: "+=800", // Fades over the first 800px of scrolling
        scrub: 0.9,
      },
    });

    tl.to(s1, { autoAlpha: 0, y: -50, ease: "power2.inOut" }, 0)
      .to(s2, { autoAlpha: 1, y: 0, ease: "power2.inOut" }, 0.25);

    // Subtle pan and scale on satin background for "flowing" effect
    if (satinBgRef.current) {
      gsap.to(satinBgRef.current, {
        scale: 1.15,
        x: "-2%",
        y: "2%",
        duration: 20,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    return () => { tl.kill(); };
  }, []);

  // ── Centralised design tokens (dark / light) ──
  const bg = isDark ? "#0B1C15" : "#F5F5F0";
  const sectionBg = isDark ? "#071410" : "#ECEFE9";
  const scriptColor = isDark ? "#D4AF37" : "#B8960E";
  const headingColor = isDark ? "#FFFFFF" : "#1A2E22";
  const subColor = isDark ? "#8FB89A" : "#4F6E56";
  const cardBg = isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)";
  const cardBorder = isDark ? "rgba(212,175,55,0.15)" : "rgba(184,150,14,0.2)";
  const quoteBorder = isDark ? "#D4AF37" : "#B8960E";
  const quoteText = isDark ? "#D4AF37" : "#B8960E";
  const headerBg = isDark ? "rgba(11,28,21,0.85)" : "rgba(245,245,240,0.85)";
  const headerBorder = isDark ? "rgba(212,175,55,0.10)" : "rgba(184,150,14,0.15)";
  const navText = isDark ? "#8FB89A" : "#5A7E64";
  const navHover = isDark ? "#D4AF37" : "#B8960E";
  const vignette = isDark
    ? "radial-gradient(ellipse 70% 70% at 50% 50%,transparent 20%,rgba(11,28,21,0.65) 100%)"
    : "radial-gradient(ellipse 70% 70% at 50% 50%,transparent 20%,rgba(242,239,231,0.45) 100%)";

  return (
    <>
      <style>{`
        @keyframes breathScale {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        @keyframes floatBubble {
          0% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>

      <div className="relative w-full overflow-x-clip font-landing" style={{ backgroundColor: bg }}>

        {/* ══════════════════════════════════════════════ */}
        {/* STICKY NAV                                     */}
        {/* ══════════════════════════════════════════════ */}
        <header
          className="fixed top-0 w-full z-50 backdrop-blur-md border-b"
          style={{ backgroundColor: headerBg, borderColor: headerBorder }}
        >
          <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
                <span className="text-[#D4AF37] text-xs font-bold">OW</span>
              </div>
              <span
                className="text-sm font-bold tracking-widest uppercase"
                style={{ color: headingColor }}
              >
                OptiWealth
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.18em]">
              {[
                ["Problem", "#problem"],
                ["Four Pillars", "#pillars"],
                ["Feature Wall", "#rule-wall"],
                ["Security", "#security"],
                ["About", "#about"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="transition-colors duration-200"
                  style={{ color: navText }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = navHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = navText)}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <ThemeToggle />
              {/* CTA */}
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#D4AF37] hover:bg-[#F0D060] text-[#0B1C15] text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md"
              >
                {isAuthenticated ? "Dashboard" : "Get Started"} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════════ */}
        {/* PHASE 1: HERO — Animated Satin Canvas          */}
        {/* Screen 1 → Screen 2 dissolve on scroll        */}
        {/* ══════════════════════════════════════════════ */}
        <section
          className="relative h-[250vh]"
          style={{ backgroundColor: bg }}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">

            {/* Full-viewport satin background from image */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                ref={satinBgRef}
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
                style={{
                  backgroundImage: `url('${isDark ? '/bg-satin-dark.png' : '/landing-light-p1.png'}')`,
                  transformOrigin: "center center",
                }}
              />
            </div>

            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: vignette }}
            />

            {/* ── Screen 1: Hero CTA ── */}
            <div
              ref={heroScreen1Ref}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pt-16"
            >
              <div className="max-w-4xl mx-auto space-y-6">
                <p
                  className="font-script text-5xl md:text-7xl leading-none drop-shadow-lg"
                  style={{ color: scriptColor }}
                >
                  The Future Of Wealth Intelligence
                </p>

                <h1
                  className="text-2xl md:text-4xl font-serif font-medium leading-tight tracking-tight uppercase"
                  style={{ color: headingColor }}
                >
                  MAXIMIZE NET RETURNS.{" "}
                  <span className="text-[#D4AF37]">MINIMIZE TAX DRAG,</span>{" "}
                  AUTOMATICALLY.
                </h1>

                <p className="text-base max-w-2xl mx-auto leading-relaxed mt-4" style={{ color: subColor }}>
                  OptiWealth combines agentic AI-driven tax optimizations with behavioral
                  finance engines to safeguard and grow your wealth—automatically, on the rails.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
                  <Link
                    href="/dashboard"
                    className="group flex items-center gap-2 px-8 py-3.5 bg-[#D4AF37] hover:bg-[#F0D060] text-[#0B1C15] font-bold rounded-2xl transition-all duration-300 text-sm tracking-wide shadow-lg shadow-[#D4AF37]/25 hover:-translate-y-0.5"
                  >
                    Launch OptiWealth Beta →
                  </Link>
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/login"}
                    className="flex items-center gap-2 px-8 py-3.5 font-semibold rounded-2xl transition-all duration-300 text-sm"
                    style={{
                      border: `1px solid ${isDark ? "rgba(212,175,55,0.30)" : "rgba(184,150,14,0.30)"}`,
                      color: headingColor,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = isDark ? "rgba(212,175,55,0.60)" : "rgba(184,150,14,0.60)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = isDark ? "rgba(212,175,55,0.30)" : "rgba(184,150,14,0.30)")}
                  >
                    Enter the App →
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Screen 2: Problem Statement — Malachite Marble ── */}
            <div
              id="problem"
              ref={heroScreen2Ref}
              className="absolute inset-0 z-10"
            >
              {/* Problem section background from image (marble with branches) */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
                  style={{
                    backgroundImage: `url('${isDark ? '/bg-marble-dark.png' : '/bg-marble-light.png'}')`,
                    animation: "breathScale 15s ease-in-out infinite alternate"
                  }}
                />
              </div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-16">
                <div className="max-w-3xl mx-auto space-y-7">
                  <p
                    className="font-script text-5xl md:text-7xl leading-none drop-shadow-md"
                    style={{ color: scriptColor }}
                  >
                    Problem we solve
                  </p>

                  <h2
                    className="text-2xl md:text-4xl font-serif font-medium leading-tight tracking-tight uppercase"
                    style={{ color: headingColor }}
                  >
                    YOUR WEALTH IS LEAKING.{" "}
                    <span style={{ color: "#D4AF37" }}>TRADITIONAL APPS ONLY TRACK IT</span>
                    —OPTIWEALTH OPTIMIZES IT.
                  </h2>

                  <div
                    className="p-6 rounded-2xl backdrop-blur-sm text-left space-y-5"
                    style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
                  >
                    <blockquote
                      className="border-l-2 pl-4 italic text-sm md:text-base leading-relaxed"
                      style={{ borderColor: quoteBorder, color: quoteText }}
                    >
                      &ldquo;It&rsquo;s not just about how much your portfolio grows. It&rsquo;s
                      about how much you actually keep after inflation, taxes, and behavioral
                      missteps.&rdquo;
                    </blockquote>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: headingColor }}>
                          · The Hidden Cost of Tax Drag
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: subColor }}>
                          Poor tax timing silently erodes 1–2% of portfolio value annually. Over
                          20 years, that gap equals the difference between freedom and falling short.
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: headingColor }}>
                          · The Behavioral Gap
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: subColor }}>
                          Dalbar studies show investors underperform their own funds by 3–4%
                          annually from emotional timing errors alone. The behavioral engine closes
                          this gap.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* PHASE 2: FOUR PILLARS — Single Diagonal Ribbon */}
        {/* ══════════════════════════════════════════════ */}
        <section
          id="pillars"
          className="relative w-full py-10 px-6 overflow-hidden"
          style={{ backgroundColor: sectionBg }}
        >
          {/* Premium Ambient Background Gradient */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 transition-colors duration-700 ease-in-out"
              style={{
                background: isDark
                  ? "radial-gradient(circle at 50% -20%, rgba(212,175,55,0.15) 0%, transparent 60%)"
                  : "radial-gradient(circle at 50% -20%, rgba(184,150,14,0.12) 0%, transparent 60%)",
              }}
            />
            {/* Edge shadows for depth */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: isDark ? "inset 0 0 100px rgba(0,0,0,0.8)" : "inset 0 0 100px rgba(0,0,0,0.05)"
              }}
            />
          </div>

          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right,${isDark ? "#D4AF37" : "#B8960E"} 1px,transparent 1px),linear-gradient(to bottom,${isDark ? "#D4AF37" : "#B8960E"} 1px,transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto space-y-6">
            <div className="text-center mb-4 md:mb-0">
              <p
                className="font-script text-5xl md:text-6xl leading-none drop-shadow-md"
                style={{ color: scriptColor }}
              >
                Four Pillars of Capital Independence
              </p>
              <GoldRibbonSeparator />
              <p className="text-sm max-w-xl mx-auto" style={{ color: subColor }}>
                Each layer runs autonomously, executes decisions on your behalf, and
                communicates with the others—24/7, without friction.
              </p>
            </div>

            <div className="relative mt-3">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                <TypewriterCard
                  index={0}
                  icon={PILLARS[0].icon}
                  title={PILLARS[0].title}
                  description={PILLARS[0].description}
                  darkMode={isDark}
                />
                <TypewriterCard
                  index={1}
                  icon={PILLARS[1].icon}
                  title={PILLARS[1].title}
                  description={PILLARS[1].description}
                  darkMode={isDark}
                />
                <TypewriterCard
                  index={2}
                  icon={PILLARS[2].icon}
                  title={PILLARS[2].title}
                  description={PILLARS[2].description}
                  darkMode={isDark}
                />
                <TypewriterCard
                  index={3}
                  icon={PILLARS[3].icon}
                  title={PILLARS[3].title}
                  description={PILLARS[3].description}
                  darkMode={isDark}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* PHASE 3: TRIANGLE RULE WALL — asymmetric mosaic */}
        {/* ══════════════════════════════════════════════ */}
        <TriangleWall />

        {/* ══════════════════════════════════════════════ */}
        {/* PHASE 4: SECURITY & TRUST                     */}
        {/* ══════════════════════════════════════════════ */}
        <SecurityChain />

        {/* ══════════════════════════════════════════════ */}
        {/* PHASE 5: ABOUT OPTIWEALTH (NEW)               */}
        {/* ══════════════════════════════════════════════ */}
        <section
          id="about"
          className="relative w-full py-28 px-6 overflow-hidden"
          style={{ backgroundColor: bg }}
        >
          {/* Faint marble vein layer for texture continuity using the image */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${isDark ? '/bg-marble-dark.png' : '/bg-marble-light.png'}')`
              }}
            />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <p
                className="font-script text-5xl md:text-6xl leading-none"
                style={{ color: scriptColor }}
              >
                About OptiWealth
              </p>
              <p className="text-sm max-w-xl mx-auto" style={{ color: subColor }}>
                The philosophy, methodology, and principles behind every algorithm we run.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 px-4 md:px-8">
              {[
                {
                  icon: "✦",
                  title: "Engineered Wealth.\nNot Hoped For.",
                  body: "OptiWealth was conceived to bridge the gap between institutional-grade capital management and the everyday investor. We believe wealth is not luck — it is a system.",
                  delay: "0s",
                },
                {
                  icon: "✦",
                  title: "Rules-Based.\nBias-Free.",
                  body: "Every decision OptiWealth makes is governed by strict mathematical models: the same frameworks employed by quant funds, hedge desks, and endowments — now available to you.",
                  delay: "2s",
                },
                {
                  icon: "✦",
                  title: "Transparent\nby Design.",
                  body: "Non-custodial. Zero-knowledge. Fully auditable. We will never hold your funds or obscure our logic. You see everything. You control everything.",
                  delay: "4s",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="relative aspect-square rounded-full flex flex-col items-center justify-center text-center p-8 sm:p-10 backdrop-blur-sm transition-all duration-700 hover:scale-105 hover:z-10 group"
                  style={{
                    border: `1px solid ${cardBorder}`,
                    background: isDark
                      ? "radial-gradient(circle at 30% 30%, rgba(212,175,55,0.1), rgba(13,43,30,0.6) 70%)"
                      : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(245,245,240,0.7) 70%)",
                    boxShadow: isDark
                      ? "inset 0 0 40px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.3)"
                      : "inset 0 0 40px rgba(255,255,255,0.8), 0 20px 40px rgba(0,0,0,0.1)",
                    animation: `floatBubble 8s ease-in-out infinite alternate`,
                    animationDelay: card.delay,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = isDark ? "rgba(212,175,55,0.50)" : "rgba(184,150,14,0.50)";
                    e.currentTarget.style.boxShadow = isDark
                      ? "inset 0 0 40px rgba(0,0,0,0.5), 0 0 60px rgba(212,175,55,0.2)"
                      : "inset 0 0 40px rgba(255,255,255,0.8), 0 0 60px rgba(184,150,14,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = cardBorder;
                    e.currentTarget.style.boxShadow = isDark
                      ? "inset 0 0 40px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.3)"
                      : "inset 0 0 40px rgba(255,255,255,0.8), 0 20px 40px rgba(0,0,0,0.1)";
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="text-3xl transition-transform duration-500 group-hover:rotate-45" style={{ color: scriptColor }}>{card.icon}</div>
                    <h3
                      className="text-[13px] sm:text-[15px] font-black uppercase tracking-widest whitespace-pre-line font-display"
                      style={{ color: headingColor }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs leading-relaxed max-w-[200px]" style={{ color: subColor }}>{card.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* PHASE 6: FOOTER OUTRO                         */}
        {/* ══════════════════════════════════════════════ */}
        <footer
          className="relative w-full overflow-hidden"
          style={{ backgroundColor: isDark ? "#060E0A" : "#E3E6E0" }}
        >
          {/* Re-emerging satin canvas image at low opacity */}
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${isDark ? '/bg-satin-dark.png' : '/bg-satin-light.png'}')`
              }}
            />
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
            style={{
              background: `linear-gradient(to top, ${isDark ? "#060E0A" : "#E3E6E0"}, transparent)`,
            }}
          />

          <div className="relative z-20 max-w-6xl mx-auto px-6 pt-24 pb-16 space-y-14">
            {/* Closing CTA */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <p
                className="font-script text-4xl md:text-5xl leading-none"
                style={{ color: scriptColor }}
              >
                Take Command of Your Wealth Architecture.
              </p>
              <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: subColor }}>
                Join the early access cohort. OptiWealth is built for individuals who understand
                that wealth is engineered, not hoped for.
              </p>
              <Link
                href="/onboard"
                className="inline-flex items-center gap-2 px-10 py-3.5 bg-[#D4AF37] hover:bg-[#F0D060] text-[#0B1C15] font-bold rounded-2xl text-sm tracking-wide transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 hover:-translate-y-0.5"
              >
                Request Early Access <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div
              className="border-t"
              style={{ borderColor: isDark ? "rgba(212,175,55,0.10)" : "rgba(184,150,14,0.15)" }}
            />

            {/* Institutional links */}
            <div
              className="grid grid-cols-2 md:grid-cols-5 gap-8 text-[11px]"
              style={{ color: isDark ? "#3A5E47" : "#5A7A62" }}
            >
              {[
                { label: "Technology", links: ["AI Engine", "Infrastructure", "API Docs", "Open Source"] },
                { label: "Security", links: ["AES-256", "Non-Custodial", "Zero-Knowledge", "Audits"] },
                { label: "Protocols", links: ["50/30/20", "4% Rule", "Rule of 72", "EMI Limits"] },
                { label: "Disclaimers", links: ["Risk Notice", "Simulation Only", "Not Financial Advice", "Regulatory"] },
                { label: "Company", links: ["About", "Careers", "Privacy Charter", "Terms"] },
              ].map((s) => (
                <div key={s.label} className="space-y-3">
                  <h4
                    className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]"
                    style={{ color: isDark ? "#6A9B7A" : "#4A7A5A" }}
                  >
                    {s.label}
                  </h4>
                  <ul className="space-y-2">
                    {s.links.map((l) => (
                      <li key={l}>
                        <a
                          href="#"
                          className="hover:text-[#D4AF37] transition-colors duration-200"
                        >
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Legal bar */}
            <div
              className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px]"
              style={{
                borderColor: isDark ? "rgba(212,175,55,0.05)" : "rgba(184,150,14,0.10)",
                color: isDark ? "#2A4A37" : "#4A6A52",
              }}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-[#D4AF37]/60" />
                <span>OptiWealth Technologies Inc. — Simulation Engine Only</span>
              </div>
              <p>
                © 2026 OptiWealth. All calculations are for educational modeling purposes only.
                Not a registered investment advisor.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
