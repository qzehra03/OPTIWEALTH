"use client";

import React, { useEffect, useRef, useState } from "react";

interface TypewriterCardProps {
  index: number;
  icon: string;
  title: string;
  description: string;
  accentColor?: string;
  darkMode?: boolean;
}

export function TypewriterCard({
  index,
  icon,
  title,
  description,
  accentColor = "#D4AF37",
  darkMode = false,
}: TypewriterCardProps) {
  const [typed, setTyped] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setIsVisible(true);
          setHasStarted(true);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!isVisible) return;
    const delay = index * 160;
    charIndexRef.current = 0;
    setTyped("");

    const startTimeout = setTimeout(() => {
      const tick = () => {
        charIndexRef.current++;
        setTyped(description.slice(0, charIndexRef.current));
        if (charIndexRef.current < description.length) {
          typingRef.current = setTimeout(tick, 20);
        }
      };
      tick();
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [isVisible, description, index]);

  const dark = darkMode;

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col gap-4 p-5 pb-4 rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
        dark
          ? "border-[#D4AF37]/18 bg-[#0B1C15]/60 backdrop-blur-sm hover:border-[#D4AF37]/40 hover:shadow-xl hover:shadow-[#D4AF37]/10"
          : "border-[#D4AF37]/20 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/10"
      }`}
      style={{ transitionDelay: `${index * 55}ms` }}
    >
      {/* Ambient hover glow */}
      <div
        className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none"
        style={{ background: `${accentColor}1A` }}
      />

      {/* Header (Icon + Title) */}
      <div className="flex flex-row items-center gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}28` }}
        >
          {icon}
        </div>

        {/* Title */}
        <h3
          className={`text-base font-bold tracking-widest uppercase ${
            dark ? "text-[#D4AF37]" : "text-[#0B1C15]"
          }`}
        >
          {title}
        </h3>
      </div>

      {/* Typewriter body */}
      <p
        className={`text-sm leading-loose font-medium font-sans min-h-[72px] pt-1 ${
          dark ? "text-[#A3C8AF]" : "text-[#2A4032]"
        }`}
      >
        {typed}
        {typed.length < description.length && isVisible && (
          <span
            className="inline-block w-[1.5px] h-[0.9em] ml-[1px] align-middle animate-pulse"
            style={{ background: accentColor }}
          />
        )}
      </p>

      {/* Bottom accent line on hover */}
      <div
        className="absolute bottom-0 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-700 ease-out"
        style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
      />
    </div>
  );
}
