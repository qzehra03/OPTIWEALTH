"use client";

import React, { useState, useEffect, useRef } from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  title: string;
  definition: string;
  calculation: string;
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export function Tooltip({
  title,
  definition,
  calculation,
  children,
  align = "center",
  className,
}: TooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<"top" | "bottom">("top");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && popoverRef.current) {
      const rect = popoverRef.current.getBoundingClientRect();
      // If the tooltip's top edge overflows the top of the viewport, flip to bottom
      if (rect.top < 0) {
        setPos("bottom");
      }
    } else if (!show) {
      setPos("top");
    }
  }, [show]);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children ? (
        children
      ) : (
        <button
          type="button"
          className={cn(
            "p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-luxe-copper focus:outline-none transition-colors",
            className
          )}
          aria-label={`About ${title}`}
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      )}

      {show && (
        <div
          ref={popoverRef}
          className={cn(
            "absolute z-[100] w-72 rounded-2xl border border-luxe-copper/40 bg-card p-4 shadow-xl text-foreground animate-in fade-in duration-150 pointer-events-none select-none",
            pos === "top" ? "bottom-full mb-2 slide-in-from-bottom-1" : "top-full mt-2 slide-in-from-top-1",
            align === "center" && "left-1/2 -translate-x-1/2",
            align === "left" && "left-0",
            align === "right" && "right-0"
          )}
        >
          <div className="space-y-3">
            <h4 className="font-header font-bold text-xs uppercase tracking-wider text-luxe-bronze">
              {title}
            </h4>
            <div className="space-y-2 text-xs font-sans leading-relaxed">
              <div>
                <p className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">What it means</p>
                <p className="mt-0.5 text-foreground">{definition}</p>
              </div>
              <div>
                <p className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">How it's calculated</p>
                <p className="mt-0.5 text-foreground">{calculation}</p>
              </div>
            </div>
          </div>
          {/* Arrow */}
          <div
            className={cn(
              "absolute border-4 border-transparent",
              pos === "top" 
                ? "top-full border-t-luxe-copper/40" 
                : "bottom-full border-b-luxe-copper/40",
              align === "center" && "left-1/2 -translate-x-1/2",
              align === "left" && "left-4",
              align === "right" && "right-4"
            )}
          />
          <div
            className={cn(
              "absolute border-4 border-transparent",
              pos === "top" 
                ? "top-full border-t-card mt-[-1px]" 
                : "bottom-full border-b-card mb-[-1px]",
              align === "center" && "left-1/2 -translate-x-1/2",
              align === "left" && "left-4",
              align === "right" && "right-4"
            )}
          />
        </div>
      )}
    </div>
  );
}
