"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SecurityChain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chainRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = chainRef.current;
    if (!el) return;

    // Phase 4: Sharp Falling Drop with Recoil Bounce
    const dropTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "top 30%",
        toggleActions: "play none none reverse",
      }
    });

    dropTimeline.fromTo(el,
      { y: -600, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.4, 
        ease: "bounce.out",
        onComplete: () => {
          // Handshake into continuous low-frequency Pendulum Swing
          gsap.to(el, {
            rotation: 3,
            transformOrigin: "top center",
            duration: 3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
          });
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#0B1C15] text-white py-28 overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 w-full flex justify-center z-0">
        {/* Security Chain SVG Asset */}
        <svg ref={chainRef} width="120" height="400" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0">
          <line x1="50" y1="0" x2="50" y2="200" stroke="#D4AF37" strokeWidth="8" strokeDasharray="15 10" />
          <rect x="25" y="180" width="50" height="60" rx="10" stroke="#D4AF37" strokeWidth="6" fill="#102C21" />
          <circle cx="50" cy="210" r="8" fill="#D4AF37" />
        </svg>
      </div>

      <div className="relative z-10 text-center max-w-4xl px-4 mt-40">
        <h2 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-2">Security & Trust</h2>
        <p className="text-xl md:text-3xl font-extrabold uppercase tracking-wide mb-12">
          BECAUSE HANDLING FINANCIAL DATA REQUIRES ABSOLUTE, UNCOMPROMISING TRUST.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 text-left mt-16">
          <div className="p-6 border-l-2 border-[#D4AF37] bg-[#102C21]/50">
            <h4 className="font-bold text-white mb-2 uppercase">Bank-Level Encryption</h4>
            <p className="text-gray-400 text-sm font-mono">Your data is protected by AES-256 encryption at rest and in transit.</p>
          </div>
          <div className="p-6 border-l-2 border-[#D4AF37] bg-[#102C21]/50">
            <h4 className="font-bold text-white mb-2 uppercase">Non-Custodial Architecture</h4>
            <p className="text-gray-400 text-sm font-mono">OptiWealth analyzes and advises, but never holds or moves your funds without explicit authorization.</p>
          </div>
          <div className="p-6 border-l-2 border-[#D4AF37] bg-[#102C21]/50">
            <h4 className="font-bold text-white mb-2 uppercase">Zero-Knowledge Privacy</h4>
            <p className="text-gray-400 text-sm font-mono">Your financial profiles are strictly confidential, containerized, and secure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}