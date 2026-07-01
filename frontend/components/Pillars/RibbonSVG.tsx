"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as flubber from "flubber";
import { pillarPaths } from "./pillarPaths";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function RibbonSVG({
  cardsContainerRef,
}: {
  cardsContainerRef: React.RefObject<HTMLDivElement>;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (reducedMotion || isMobile) return;

    const cardsContainer = cardsContainerRef.current;
    const path = pathRef.current;
    if (!cardsContainer || !path) return;

    // Create flubber interpolators on mount
    const interpolators = [
      flubber.interpolate(pillarPaths[0], pillarPaths[1], { maxSegmentLength: 2 }),
      flubber.interpolate(pillarPaths[1], pillarPaths[2], { maxSegmentLength: 2 }),
      flubber.interpolate(pillarPaths[2], pillarPaths[3], { maxSegmentLength: 2 }),
    ];

    // Set initial path state
    path.setAttribute("d", pillarPaths[0]);

    // Create a dummy object to animate its "progress" value
    const animObj = { progress: 0 };

    // GSAP ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: cardsContainer,
      start: "top center",
      end: "bottom center",
      scrub: 0.5,
      animation: gsap.to(animObj, {
        progress: 3.0,
        ease: "none",
        onUpdate: () => {
          const progress = animObj.progress;
          let currentD = "";

          if (progress <= 0) {
            currentD = pillarPaths[0];
          } else if (progress >= 3) {
            currentD = pillarPaths[3];
          } else {
            const idx = Math.floor(progress);
            const t = progress - idx;
            try {
              currentD = interpolators[idx](t);
            } catch (err) {
              // Fail-safe in case of rare interpolation error
              currentD = pillarPaths[idx];
            }
          }

          if (path && currentD) {
            path.setAttribute("d", currentD);
          }
        },
      }),
    });

    return () => {
      trigger.kill();
    };
  }, [cardsContainerRef, reducedMotion, isMobile]);

  // If reduced motion or mobile, hide this global flowing ribbon
  if (reducedMotion || isMobile) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[240px] pointer-events-none -z-10 opacity-30 select-none"
    >
      <svg
        className="sticky top-[10%] w-full h-[80vh]"
        viewBox="0 0 200 600"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-copper)" />
            <stop offset="50%" stopColor="var(--silk-highlight)" />
            <stop offset="100%" stopColor="var(--accent-copper-glow)" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          fill="url(#ribbonGrad)"
          className="transition-all duration-300 ease-out"
          style={{ filter: "drop-shadow(0px 4px 10px rgba(181, 100, 46, 0.25))" }}
        />
      </svg>
    </div>
  );
}
