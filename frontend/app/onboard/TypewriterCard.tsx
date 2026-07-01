"use client";
import { useEffect, useState, useRef } from "react";

interface TypewriterCardProps {
  readonly title: string;
  readonly text: string;
}

export default function TypewriterCard({ title, text }: Readonly<TypewriterCardProps>) {
  const [displayedText, setDisplayedText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 15); // Sophisticated, rapid typing speed

    return () => clearInterval(interval);
  }, [hasStarted, text]);

  return (
    <div 
      ref={containerRef} 
      className="p-8 rounded-xl bg-white/80 border border-[#D4AF37]/30 backdrop-blur-md shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300 transform hover:-translate-y-1"
    >
      <h3 className="text-xl font-bold text-[#0B1C15] mb-4 tracking-wide uppercase">{title}</h3>
      <p className="text-charcoal font-mono text-sm leading-relaxed min-h-[80px]">
        {displayedText}
        <span className="animate-pulse bg-[#D4AF37] h-4 w-1 inline-block ml-1">|</span>
      </p>
    </div>
  );
}