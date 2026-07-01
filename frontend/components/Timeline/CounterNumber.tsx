"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CounterNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    if (reducedMotion) {
      el.textContent = prefix + value.toLocaleString() + suffix;
      prevValueRef.current = value;
      return;
    }

    const obj = { val: prevValueRef.current };

    const tween = gsap.to(obj, {
      val: value,
      duration: 1.0,
      ease: "power2.out",
      onUpdate: () => {
        if (el) {
          el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
        }
      },
    });

    prevValueRef.current = value;

    return () => {
      tween.kill();
    };
  }, [value, prefix, suffix, reducedMotion]);

  return (
    <span
      ref={elementRef}
      className="font-display font-extrabold tracking-tight text-accent-copper tabular-nums"
    />
  );
}
