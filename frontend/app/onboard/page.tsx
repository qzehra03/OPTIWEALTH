"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SatinRibbonCanvas from "./SatinRibbonCanvas";

// Local lightweight placeholders to avoid missing-module errors during build.
function SecurityChain() {
  return (
    <section className="min-h-[320px] w-full flex items-center justify-center bg-transparent z-10">
      <div className="text-gray-400 text-sm">Security & Guardrail Infrastructure (placeholder)</div>
    </section>
  );
}

function TriangleWall() {
  return (
    <section className="min-h-[320px] w-full flex items-center justify-center bg-transparent z-10">
      <div className="text-gray-400 text-sm">Mosaic Interactive Rules Matrix (placeholder)</div>
    </section>
  );
}

type TypewriterCardProps = {
  readonly title: string;
  readonly text: string;
};

function TypewriterCard({ title, text }: Readonly<TypewriterCardProps>) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm min-h-[240px] flex flex-col justify-between">
      <h3 className="text-white font-bold uppercase tracking-widest mb-4 text-sm">
        {title}
      </h3>
      <p className="text-gray-300 text-sm leading-6">
        {text}
      </p>
    </div>
  );
}

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Phase 1 ScrollTrigger: Complete Opacity Dissolve Cross-Fade
    gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
      }
    })
    .to(heroRef.current, { opacity: 0, ease: "none" });

    // Phase 2 ScrollTrigger: High-Performance Global Background Theme Morph
    ScrollTrigger.create({
      trigger: pillarsRef.current,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => gsap.to(mainRef.current, { backgroundColor: "#F7F9F9", duration: 0.8 }),
      onLeaveBack: () => gsap.to(mainRef.current, { backgroundColor: "#0B1C15", duration: 0.8 }),
      onLeave: () => gsap.to(mainRef.current, { backgroundColor: "#0B1C15", duration: 0.8 }),
      onEnterBack: () => gsap.to(mainRef.current, { backgroundColor: "#F7F9F9", duration: 0.8 }),
    });
  }, []);

  return (
    <div ref={mainRef} className="bg-[#0B1C15] transition-colors duration-700 min-h-screen text-white font-sans overflow-x-hidden relative">
      
      {/* Dynamic Background Botanical Leaves for Phase 2 */}
      <div className="absolute inset-x-0 top-[200vh] h-[100vh] pointer-events-none z-0 opacity-20 overflow-hidden hidden md:block">
        <svg className="absolute left-4 top-20 animate-sway origin-bottom" width="100" height="200" viewBox="0 0 100 200" fill="none">
          <path d="M10,190 Q30,100 90,20" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="90" cy="20" r="8" fill="#D4AF37" />
          <circle cx="70" cy="60" r="6" fill="#D4AF37" />
        </svg>
        <svg className="absolute right-4 bottom-20 animate-sway origin-bottom" width="100" height="200" viewBox="0 0 100 200" fill="none">
          <path d="M90,190 Q70,100 10,20" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="10" cy="20" r="8" fill="#D4AF37" />
          <circle cx="30" cy="60" r="6" fill="#D4AF37" />
        </svg>
      </div>

      {/* P-1: Hero Block */}
      <section ref={heroRef} className="h-screen w-full relative flex flex-col justify-center items-center text-center px-4 z-10">
        <SatinRibbonCanvas />
        <h4 className="text-xs font-bold font-mono text-[#D4AF37] uppercase tracking-widest mb-4 z-10">The Future Of Wealth Intelligence</h4>
        <h1 className="text-3xl md:text-6xl font-black max-w-5xl tracking-tight leading-none mb-6 z-10 uppercase">
          MAXIMIZE NET RETURNS. <br />MINIMIZE TAX DRAG, AUTOMATICALLY.
        </h1>
        <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mb-8 z-10">
          OptiWealth combines agentic AI-driven tax optimization with behavioral finance engines to build, shield, and scale your wealth. Stop leaving money on the table.
        </p>
        <button className="z-10 px-8 py-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-bold text-sm tracking-wider uppercase rounded hover:bg-[#D4AF37] hover:text-[#0B1C15] transition-all duration-300">
          Launch OptiWealth Beta &rarr;
        </button>
      </section>

      {/* P-1 Part 2: Problem Statement Section */}
      <section ref={problemRef} className="min-h-screen w-full flex flex-col justify-center max-w-5xl mx-auto px-4 py-24 z-10 relative">
        <h3 className="text-xs font-bold font-mono text-[#D4AF37] uppercase tracking-widest mb-2">Problem we solve</h3>
        <h2 className="text-2xl md:text-4xl font-extrabold uppercase mb-8 leading-tight">
          YOUR WEALTH IS LEAKING. TRADITIONAL APPS ONLY TRACK IT—OPTIWEALTH OPTIMIZES IT.
        </h2>
        <blockquote className="border-l-4 border-[#D4AF37] pl-6 font-mono text-lg md:text-xl text-gray-300 italic mb-12 max-w-3xl">
          "It’s not just about how much your portfolio grows. It’s about how much you actually keep after inflation, and behavioral missteps."
        </blockquote>
        <div className="grid md:grid-cols-2 gap-12 font-mono text-sm text-gray-400">
          <div>
            <h5 className="text-white font-bold mb-3 uppercase">The Hidden Cost of Tax Drag</h5>
            <p>Passive portfolios lose significant annual returns to inefficient asset location, mistimed liquidations, and overlooked deductions.</p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-3 uppercase">The Behavioral Gap</h5>
            <p>Emotional market timing and impulsive rebalancing cost the average investor substantial percentage points in long-term yield.</p>
          </div>
        </div>
      </section>

      {/* P-2: Light Mode Four Pillars Section */}
      <section ref={pillarsRef} className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-24 z-10 relative">
        <h2 className="text-xs font-bold font-mono text-[#0B1C15] uppercase tracking-widest mb-16 z-10">
          Four Pillars of Capital Independence
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full z-10">
          <TypewriterCard title="Agentic Tax Engine" text="SCANS MULTI-ASSET PORTFOLIOS FOR REAL-TIME TAX-LOSS HARVESTING AND OPTIMAL TAX-BRACKET UTILIZATION." />
          <TypewriterCard title="Behavioral Rule Engine" text="ANALYZES SPENDING, SAVING, AND INVESTING PATTERNS TO FLAG COGNITIVE BIASES AND EMOTIONAL OVERREACTIONS." />
          <TypewriterCard title="Unified Wealth Architecture" text="ANALYZES SPENDING, SAVING, AND INVESTING PATTERNS TO FLAG COGNITIVE BIASES AND EMOTIONAL OVERREACTIONS." />
        </div>
      </section>

      {/* P-3: Mosaic Interactive Rules Matrix */}
      <TriangleWall />

      {/* P-4: Kinetic Security & Guardrail Infrastructure */}
      <SecurityChain />

      {/* P-5: Minimalist Outro Block */}
      <footer className="w-full bg-[#050D0A] text-white py-16 px-4 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
          <div>
            <h3 className="font-black text-xl tracking-widest uppercase text-white mb-2">OptiWealth</h3>
            <p className="text-xs text-gray-500 max-w-xs font-mono">A next-generation financial engineering platform blending advanced agentic AI models with behavioral finance principles.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase text-gray-400">
            <button type="button" className="hover:text-[#D4AF37]">Technology</button>
            <button type="button" className="hover:text-[#D4AF37]">Security</button>
            <button type="button" className="hover:text-[#D4AF37]">Protocols</button>
            <button type="button" className="hover:text-[#D4AF37]">Disclaimers</button>
          </div>
        </div>
        <p className="text-[10px] text-gray-600 font-mono text-center mt-12 max-w-6xl mx-auto border-t border-white/5 pt-6">
          All investment strategies carry baseline market risk. OptiWealth provides automated computational optimization models and tools for informational wealth management purposes. Data is aggregated securely via verified banking endpoints.
        </p>
      </footer>

    </div>
  );
}