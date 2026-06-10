"use client";

import React, { useEffect, useRef } from "react";

interface OnboardingAnimationPaneProps {
  activeStep: number;
  savingsChangeCount: number;
  arrowTrigger: "idle" | "firing" | "hit";
  onArrowHit?: () => void;
}

export function OnboardingAnimationPane(_props: OnboardingAnimationPaneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Dynamic state parameters
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      scale: number;
      rotation: number;
      rotSpeed: number;
      opacity: number;
      type: "coin" | "bill";
      active: boolean;
      color: string;
    }> = [];

    // Particle generator
    const spawnParticle = () => {
      const useDesktop = window.innerWidth > 1024;
      let spawnX = 0;
      
      if (useDesktop) {
        // Drop on either left 25% or right 25% to avoid centered card
        const isLeft = Math.random() > 0.5;
        if (isLeft) {
          spawnX = Math.random() * window.innerWidth * 0.25;
        } else {
          spawnX = window.innerWidth * 0.75 + Math.random() * window.innerWidth * 0.25;
        }
      } else {
        // Mobile: drop anywhere
        spawnX = Math.random() * window.innerWidth;
      }
      
      const isCoin = Math.random() > 0.5;
      
      particles.push({
        x: spawnX,
        y: -30,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1.5 + Math.random() * 2,
        scale: 0.7 + Math.random() * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        opacity: 0.7 + Math.random() * 0.3,
        type: isCoin ? "coin" : "bill",
        active: true,
        color: isCoin 
          ? `hsl(${40 + Math.random() * 10}, 95%, ${50 + Math.random() * 10}%)` // Golden coin
          : Math.random() > 0.5 ? "#E6F7F0" : "#4EBFA8", // Mint bills
      });
    };

    // Main animation loop
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn falling assets continuously
      if (Math.random() < 0.08) {
        spawnParticle();
      }

      // 1. Draw Workspace Grid Background
      ctx.strokeStyle = "rgba(226, 232, 240, 0.5)"; // light-gray lines
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Update and Draw Falling Particles
      particles.forEach((p, idx) => {
        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Render active particles
        if (p.active && p.y < height + 40) {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scale, p.scale);

          if (p.type === "coin") {
            // Draw 3D gold coin
            ctx.fillStyle = "#D97706";
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 9px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("₹", 0, 0);
          } else {
            // Draw currency bill
            ctx.fillStyle = p.color;
            ctx.strokeStyle = "#037A6B";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(-16, -9, 32, 18, 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "rgba(3, 122, 107, 0.2)";
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        } else {
          particles.splice(idx, 1);
        }
      });

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-10">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
