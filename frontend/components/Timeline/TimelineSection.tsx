"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CounterNumber } from "./CounterNumber";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineProgressData {
  rippleSpeed: number;
  copperGlow: number;
}

export function TimelineSection({
  onProgressUpdate,
}: {
  onProgressUpdate: (data: TimelineProgressData) => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const [activeMilestone, setActiveMilestone] = useState(0); // 0 = 1 Year, 1 = 5 Years, 2 = 20 Years
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();

  const onProgressUpdateRef = useRef(onProgressUpdate);
  const scrollTriggerRef = useRef<any>(null);

  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  const milestones = [
    { year: 1, balance: 125000, label: "Initial Accumulation", desc: "Your capital starts building its base layer. Reinvestment kicks off standard savings velocity." },
    { year: 5, balance: 735000, label: "Compounding Lift-off", desc: "Returns start generating their own returns. Wealth acceleration becomes mathematically noticeable." },
    { year: 20, balance: 5930000, label: "Financial Independence", desc: "Your compound returns outpace your annual survival needs. The nest egg achieves true escape velocity." },
  ];

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (reducedMotion || isMobile) {
      // Just set default speed/glow
      onProgressUpdateRef.current({ rippleSpeed: 1.0, copperGlow: 0.0 });
      return;
    }

    const section = sectionRef.current;
    const trigger = triggerRef.current;
    const progressBar = progressBarRef.current;
    if (!section || !trigger || !progressBar) return;

    // Pinning and scrubbing Timeline
    const scrollTween = ScrollTrigger.create({
      trigger: trigger,
      start: "top top",
      end: "+=150%", // Scroll distance for pinning
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress; // 0.0 to 1.0
        setTimelineProgress(progress);
        
        // Update shader uniforms
        onProgressUpdateRef.current({
          rippleSpeed: 1.0 + progress * 2.0, // ripples speed up
          copperGlow: progress,              // copper glow intensifies
        });

        // Set visual progress bar scale
        gsap.set(progressBar, { scaleX: progress });

        // Map progress to milestone active states
        if (progress < 0.35) {
          setActiveMilestone(0);
        } else if (progress < 0.75) {
          setActiveMilestone(1);
        } else {
          setActiveMilestone(2);
        }
      },
      onLeave: () => {
        onProgressUpdateRef.current({ rippleSpeed: 1.0, copperGlow: 0.0 });
      },
      onEnterBack: () => {
        onProgressUpdateRef.current({ rippleSpeed: 3.0, copperGlow: 1.0 });
      },
    });

    scrollTriggerRef.current = scrollTween;

    return () => {
      scrollTween.kill();
      scrollTriggerRef.current = null;
    };
  }, [reducedMotion, isMobile]);

  const handleTabClick = (index: number) => {
    const trigger = scrollTriggerRef.current;
    if (!trigger) return;

    // Target progress for each milestone
    const progressMap = [0.15, 0.55, 0.88];
    const targetProgress = progressMap[index];

    const start = trigger.start;
    const end = trigger.end;
    const totalDist = end - start;
    const targetScrollY = start + targetProgress * totalDist;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  if (isMobile) {
    return (
      <section className="py-16 px-6 bg-bg-base relative z-10 w-full overflow-hidden">
        {/* Static background copper grid-line texture */}
        <div className="absolute inset-0 -z-10 opacity-5 dark:opacity-15 bg-[linear-gradient(to_right,rgba(181,100,46,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(181,100,46,0.08)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="max-w-xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-accent-copper tracking-widest">
              Compound Acceleration
            </span>
            <h2 className="text-3xl font-extrabold font-display text-text-primary">
              Multi-Era Projections
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Time is your primary asset. Reinvesting your returns back into your balance allows your wealth to accelerate automatically.
            </p>
          </div>

          {/* Vertical Timeline Stack */}
          <div className="relative pl-6 border-l-2 border-accent-copper/20 space-y-12">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="relative space-y-3">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-accent-copper bg-bg-base" />
                
                <span className="text-xs font-bold text-accent-copper uppercase tracking-wider">
                  Year {milestone.year} Milestone
                </span>
                
                <div className="text-3xl font-extrabold text-text-primary">
                  <CounterNumber value={milestone.balance} prefix="₹" />
                </div>
                
                <h4 className="text-md font-bold font-display text-text-primary">
                  {milestone.label}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {milestone.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop Pinned Layout
  return (
    <div ref={triggerRef} className="w-full bg-bg-base relative overflow-hidden">
      {/* Background copper grid-line texture with dynamic brightness */}
      <div 
        className="absolute inset-0 -z-10 bg-bg-base transition-all duration-300 pointer-events-none"
        style={{
          filter: `brightness(${1.0 + timelineProgress * 0.25})`,
        }}
      >
        <div className="absolute inset-0 opacity-15 dark:opacity-30 bg-[linear-gradient(to_right,rgba(181,100,46,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(181,100,46,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      <section
        ref={sectionRef}
        className="h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden bg-transparent"
      >
        <div className="max-w-4xl w-full mx-auto space-y-12 text-center z-10">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-accent-copper tracking-widest">
              Compound Projection Timeline
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold font-display text-text-primary">
              Milestone: Year {milestones[activeMilestone].year}
            </h2>
            <p className="text-md text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Time is your primary asset. Reinvesting your returns back into your balance allows your wealth to accelerate automatically. We map your growth over years so you can see your future security build in real-time.
            </p>
          </div>

          {/* Large Dynamic Balance Number */}
          <div className="py-6 min-h-[90px]">
            <span className="text-6xl md:text-8xl font-extrabold text-accent-copper tracking-tighter">
              <CounterNumber value={milestones[activeMilestone].balance} prefix="₹" />
            </span>
          </div>

          {/* Current Milestone Detail */}
          <div className="max-w-md mx-auto space-y-2 h-20 transition-all duration-300">
            <h3 className="text-lg font-bold font-display text-text-primary">
              {milestones[activeMilestone].label}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {milestones[activeMilestone].desc}
            </p>
          </div>

          {/* Centered Timeline Progress Track */}
          <div className="w-full max-w-2xl mx-auto pt-8">
            <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-accent-copper to-silk-highlight origin-left transform scale-x-0"
              />
            </div>

            {/* Labels under progress track */}
            <div className="flex justify-between items-center text-xs font-bold text-text-secondary pt-3">
              <span
                onClick={() => handleTabClick(0)}
                className={`cursor-pointer transition-colors ${
                  activeMilestone === 0 ? "text-accent-copper" : "hover:text-text-primary"
                }`}
              >
                1 Year
              </span>
              <span
                onClick={() => handleTabClick(1)}
                className={`cursor-pointer transition-colors ${
                  activeMilestone === 1 ? "text-accent-copper" : "hover:text-text-primary"
                }`}
              >
                5 Years
              </span>
              <span
                onClick={() => handleTabClick(2)}
                className={`cursor-pointer transition-colors ${
                  activeMilestone === 2 ? "text-accent-copper" : "hover:text-text-primary"
                }`}
              >
                20 Years
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
