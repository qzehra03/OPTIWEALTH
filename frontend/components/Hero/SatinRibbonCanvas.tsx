"use client";

import React, { useEffect, useRef } from "react";

interface SatinRibbonCanvasProps {
  className?: string;
  copperIntensity?: number; // 0.0 - 1.0, for scroll-linked ripple
  theme?: "dark" | "light";
}

export function SatinRibbonCanvas({
  className = "absolute inset-0",
  copperIntensity = 0,
  theme = "dark",
}: SatinRibbonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize to fill parent
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Ribbon config
    const RIBBON_COUNT = 6;
    const ribbons = Array.from({ length: RIBBON_COUNT }, (_, i) => ({
      seed: i * 1.3,
      speed: 0.00018 + i * 0.00004,
      width: 60 + i * 22,
      alpha: 0.08 + i * 0.03,
      yOffset: (i / RIBBON_COUNT) * 0.9,
    }));

    const draw = (ts: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      timeRef.current = ts * 0.001;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Base fill — dark emerald or light champagne
      ctx.fillStyle = theme === "light" ? "#F2EFE7" : "#0B1C15";
      ctx.fillRect(0, 0, w, h);

      // Draw each ribbon stripe
      for (const r of ribbons) {
        ctx.save();
        ctx.globalAlpha = r.alpha + copperIntensity * 0.08;

        const gradient = ctx.createLinearGradient(0, 0, w, h);
        if (theme === "light") {
          // Champagne / silver satin ribbons for light mode
          gradient.addColorStop(0,    "rgba(220,215,200,0.5)");
          gradient.addColorStop(0.3,  "rgba(240,235,220,0.7)");
          gradient.addColorStop(0.55, "rgba(212,175,55,0.4)");
          gradient.addColorStop(0.75, "rgba(230,225,210,0.6)");
          gradient.addColorStop(1,    "rgba(210,205,190,0.5)");
        } else {
          // Dark emerald → gold ribbons for dark mode
          gradient.addColorStop(0,    "#0D3B2A");
          gradient.addColorStop(0.3,  "#1A6644");
          gradient.addColorStop(0.55, "#D4AF37");
          gradient.addColorStop(0.75, "#1A6644");
          gradient.addColorStop(1,    "#0D3B2A");
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = r.width;
        ctx.lineCap = "round";

        // Build a smooth Bezier ribbon path
        const cp1x = w * 0.25 + Math.sin(t * r.speed * 3000 + r.seed) * w * 0.18;
        const cp1y = h * (r.yOffset + 0.05 * Math.sin(t * r.speed * 2700 + r.seed + 1));
        const cp2x = w * 0.75 + Math.cos(t * r.speed * 3200 + r.seed + 2) * w * 0.14;
        const cp2y = h * (r.yOffset + 0.12 + 0.07 * Math.cos(t * r.speed * 2900 + r.seed + 3));

        ctx.beginPath();
        ctx.moveTo(-r.width, h * r.yOffset);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, w + r.width, h * (r.yOffset + 0.15));
        ctx.stroke();
        ctx.restore();
      }

      // Ambient shimmer overlay
      const shimmer = ctx.createRadialGradient(
        w * (0.5 + 0.12 * Math.sin(t * 0.18)),
        h * (0.45 + 0.08 * Math.cos(t * 0.14)),
        0,
        w * 0.5,
        h * 0.5,
        w * 0.6
      );
      if (theme === "light") {
        shimmer.addColorStop(0, "rgba(212,175,55,0.04)");
        shimmer.addColorStop(0.5, "rgba(212,175,55,0.01)");
        shimmer.addColorStop(1, "rgba(0,0,0,0)");
      } else {
        shimmer.addColorStop(0, "rgba(212,175,55,0.06)");
        shimmer.addColorStop(0.5, "rgba(212,175,55,0.02)");
        shimmer.addColorStop(1, "rgba(0,0,0,0)");
      }
      ctx.fillStyle = shimmer;
      ctx.fillRect(0, 0, w, h);

      // Copper overlay when timeline scrolls
      if (copperIntensity > 0) {
        ctx.globalAlpha = copperIntensity * 0.12;
        const cg = ctx.createLinearGradient(0, 0, w, h);
        cg.addColorStop(0, "rgba(180,90,30,0)");
        cg.addColorStop(0.5, "rgba(220,130,60,1)");
        cg.addColorStop(1, "rgba(180,90,30,0)");
        ctx.fillStyle = cg;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [copperIntensity, theme]);

  return (
    <div className={`${className} overflow-hidden`} aria-hidden>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
