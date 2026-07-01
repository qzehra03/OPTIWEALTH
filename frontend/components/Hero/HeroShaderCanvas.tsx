"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useWebGLShader } from "@/hooks/useWebGLShader";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useTheme } from "@/hooks/useTheme";
import { vertexShaderSource } from "@/lib/shaders/heroSilk.vert";
import { fragmentShaderSource } from "@/lib/shaders/heroSilk.frag";

function hexToRgb(hex: string): [number, number, number] {
  const num = parseInt(hex.replace("#", ""), 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

export function HeroShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useMousePosition(0.08); // Lerped mouse hook
  const { theme } = useTheme();
  
  const [inViewport, setInViewport] = useState(true);
  const [isTouchOrMobile, setIsTouchOrMobile] = useState(true);

  // Check device parameters for pointer coarse / touch/ mobile size
  useEffect(() => {
    const checkInteractive = () => {
      const isMobileSize = window.innerWidth < 768;
      const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;
      setIsTouchOrMobile(isMobileSize || isTouchDevice);
    };

    checkInteractive();
    window.addEventListener("resize", checkInteractive);
    return () => window.removeEventListener("resize", checkInteractive);
  }, []);

  // IntersectionObserver to pause requestAnimationFrame rendering when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  // Flat target object to tween color values cleanly with GSAP
  const colorTargetRef = useRef({
    // Initial colors depending on current theme on mount
    baseR: isDark ? 0.0235 : 0.9686, baseG: isDark ? 0.0510 : 0.9647, baseB: isDark ? 0.0392 : 0.9451,
    shadowR: isDark ? 0.0471 : 0.8510, shadowG: isDark ? 0.2314 : 0.8627, shadowB: isDark ? 0.1490 : 0.8275,
    midR: isDark ? 0.1686 : 0.4353, midG: isDark ? 0.7882 : 0.7451, midB: isDark ? 0.4784 : 0.6078,
    glowR: isDark ? 0.9490 : 0.9608, glowG: isDark ? 1.0000 : 1.0000, glowB: isDark ? 0.9804 : 0.9804,
  });

  // Tween color states on theme switch (550ms cross-dissolve)
  useEffect(() => {
    const base = hexToRgb(isDark ? "#060D0A" : "#F7F6F1");
    const shadow = hexToRgb(isDark ? "#0C3B26" : "#D9DCD3");
    const mid = hexToRgb(isDark ? "#2BC97A" : "#6FBE9B");
    const glow = hexToRgb(isDark ? "#F2FFFA" : "#F5FFFA");

    const tween = gsap.to(colorTargetRef.current, {
      baseR: base[0], baseG: base[1], baseB: base[2],
      shadowR: shadow[0], shadowG: shadow[1], shadowB: shadow[2],
      midR: mid[0], midG: mid[1], midB: mid[2],
      glowR: glow[0], glowG: glow[1], glowB: glow[2],
      duration: 0.55,
      ease: "power2.out",
    });

    return () => {
      tween.kill();
    };
  }, [isDark]);

  // Hook handles compile/link and render loop trigger
  const glSupported = useWebGLShader({
    canvasRef,
    vertexShaderSource,
    fragmentShaderSource,
    paused: !inViewport,
    onRender: (gl, program, locs, time) => {
      // Pass uResolution
      if (locs.uResolution) {
        gl.uniform2f(locs.uResolution, gl.canvas.width, gl.canvas.height);
      }

      // Pass uTime
      if (locs.uTime) {
        gl.uniform1f(locs.uTime, time);
      }

      // Pass uMouse (perturbation disabled on touch or mobile viewports)
      if (locs.uMouse) {
        const m = mouseRef.current;
        gl.uniform2f(
          locs.uMouse,
          isTouchOrMobile ? 0.0 : m.x,
          isTouchOrMobile ? 0.0 : m.y
        );
      }

      // Pass color uniforms (tweened)
      const c = colorTargetRef.current;
      if (locs.uColorBase) gl.uniform3f(locs.uColorBase, c.baseR, c.baseG, c.baseB);
      if (locs.uColorShadow) gl.uniform3f(locs.uColorShadow, c.shadowR, c.shadowG, c.shadowB);
      if (locs.uColorMid) gl.uniform3f(locs.uColorMid, c.midR, c.midG, c.midB);
      if (locs.uColorGlow) gl.uniform3f(locs.uColorGlow, c.glowR, c.glowG, c.glowB);
      if (locs.uCopperGlow) gl.uniform1f(locs.uCopperGlow, 0.0); // Kept base in Hero
    },
  });

  if (glSupported === false) {
    // If WebGL2 creation failed, render fallback image directly
    const { HeroFallbackImage } = require("./HeroFallbackImage");
    return <HeroFallbackImage />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full -z-10 bg-bg-base overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
