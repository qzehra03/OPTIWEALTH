"use client";

import { useEffect, useRef } from "react";

export function useMousePosition(ease = 0.05) {
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize values between -1 and 1
      const targetX = (event.clientX / window.innerWidth) * 2 - 1;
      const targetY = -(event.clientY / window.innerHeight) * 2 + 1;

      mouseRef.current.targetX = targetX;
      mouseRef.current.targetY = targetY;
    };

    // Use requestAnimationFrame throttling or simple passive listener
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    const updateMouse = () => {
      const m = mouseRef.current;
      // Lerp logic
      m.x += (m.targetX - m.x) * ease;
      m.y += (m.targetY - m.y) * ease;

      animationFrameId = requestAnimationFrame(updateMouse);
    };

    animationFrameId = requestAnimationFrame(updateMouse);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [ease]);

  return mouseRef;
}
