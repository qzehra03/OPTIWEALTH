"use client";
import { useEffect, useRef } from "react";

export default function SatinRibbonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.003;

      // Premium Emerald-to-Gold Gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(11, 28, 21, 0.4)");
      gradient.addColorStop(0.5, "rgba(212, 175, 55, 0.15)");
      gradient.addColorStop(1, "rgba(16, 44, 33, 0.4)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      
      // Generating flowing fluid paths using overlapping sine coordinates
      ctx.moveTo(0, canvas.height * 0.3);
      for (let x = 0; x <= canvas.width; x += 10) {
        const y1 = Math.sin(x * 0.002 + time) * 80;
        const y2 = Math.cos(x * 0.0015 - time * 0.8) * 40;
        ctx.lineTo(x, canvas.height * 0.4 + y1 + y2);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Secondary highlight ribbon layer
      ctx.strokeStyle = "rgba(212, 175, 55, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.4);
      for (let x = 0; x <= canvas.width; x += 15) {
        const y1 = Math.cos(x * 0.0025 + time * 1.2) * 60;
        ctx.lineTo(x, canvas.height * 0.45 + y1);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}