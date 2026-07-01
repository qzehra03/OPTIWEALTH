"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/hooks/useTheme";
import { ArrowRight } from "lucide-react";

export function HeroText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    if (reducedMotion) {
      // Instantly reveal all elements
      const rect = document.querySelector(".hero-frame-rect") as SVGElement;
      if (rect) rect.style.strokeDashoffset = "0";
      if (headlineRef.current) headlineRef.current.style.opacity = "1";
      if (subheadRef.current) subheadRef.current.style.opacity = "1";
      if (ctaRef.current) ctaRef.current.style.opacity = "1";
      return;
    }

    const rect = document.querySelector(".hero-frame-rect");
    const headline = headlineRef.current;
    const subhead = subheadRef.current;
    const cta = ctaRef.current;

    // Set initial values
    gsap.set(rect, { strokeDashoffset: 100 });
    gsap.set(headline, { opacity: 0, y: 20 });
    gsap.set(subhead, { opacity: 0, y: 20 });
    gsap.set(cta, { opacity: 0, y: 15 });

    // Coordinated GSAP Timeline
    const tl = gsap.timeline();

    tl.to(rect, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: "power3.inOut",
    })
      .to(
        headline,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        0.9 // Start at 0.9s (slight overlap)
      )
      .to(
        subhead,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        1.2 // Start at 1.2s
      )
      .to(
        cta,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        1.45 // Fade in CTA buttons right after subheadline
      );

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="flex flex-col items-center text-center space-y-6">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-accent-copper bg-accent-copper/10 uppercase mb-2">
        <span>⚡ Automated Capital Engine</span>
      </div>

      <h1
        ref={headlineRef}
        className="text-4xl md:text-6xl font-extrabold tracking-tight font-display text-text-primary leading-tight max-w-3xl mx-auto"
      >
        Sophisticated Engineering. <br />
        <span className="text-accent-copper font-serif italic">Transparent Wealth.</span>
      </h1>

      <p
        ref={subheadRef}
        className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed font-sans"
      >
        OptiWealth automates your capital management behind the scenes using strict, logical rules—keeping your assets safe, optimized, and entirely under your control.
      </p>

      <div
        ref={ctaRef}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full"
      >
        <Link
          href="/onboard"
          className="w-full sm:w-auto px-8 py-4 bg-accent-copper hover:bg-accent-copper-glow text-[#F4F1EA] font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-accent-copper/20 flex items-center justify-center gap-2 group text-sm"
        >
          Fix My Wallet
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/login"
          className="w-full sm:w-auto px-8 py-4 border border-accent-copper/30 hover:border-accent-copper/60 text-text-primary hover:bg-accent-copper/5 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center text-sm"
        >
          Access Dashboard
        </Link>
      </div>
    </div>
  );
}
