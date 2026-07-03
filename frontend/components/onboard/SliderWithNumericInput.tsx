"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SliderWithNumericInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  error?: string;
  hint?: string;
  isCurrency?: boolean;
}

export function SliderWithNumericInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  error,
  hint,
  isCurrency = true,
}: SliderWithNumericInputProps) {
  // Temporary string state for active manual typing
  const [inputValue, setInputValue] = useState("");

  // Update text input whenever underlying value state changes
  useEffect(() => {
    if (value === 0) {
      setInputValue("");
    } else {
      setInputValue(
        isCurrency
          ? new Intl.NumberFormat("en-IN").format(value)
          : String(value)
      );
    }
  }, [value, isCurrency]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawString = e.target.value;
    setInputValue(rawString);

    const cleanStr = rawString.replace(/\D/g, "");
    let num = cleanStr ? parseInt(cleanStr, 10) : 0;

    if (num > max) {
      num = max;
    }
    onChange(num);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    if (isNaN(num) || num < 0) {
      num = 0;
    }
    onChange(num);
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-foreground font-semibold text-sm tracking-wide font-sans block"
      >
        {label}
      </Label>
      
      <div className="flex items-center gap-4 w-full">
        {/* Tactile Range Slider */}
        <div className="flex-1 relative flex items-center h-10">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-luxe-bronze"
            style={{
              background: `linear-gradient(to right, #037A6B 0%, #037A6B ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)`
            }}
          />
        </div>

        {/* Dynamic formatted input */}
        <div className="relative w-32 sm:w-40 shrink-0">
          {isCurrency && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-extrabold text-foreground/70">
              ₹
            </span>
          )}
          <Input
            id={`${id}-input`}
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={handleInputChange}
            className={cn(
              "text-right font-sans font-extrabold text-xl text-foreground h-10 bg-background/50 border-border focus:border-primary focus:ring-1 focus:ring-primary focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-offset-0 outline-none rounded-lg",
              isCurrency ? "pl-7 pr-2.5" : "px-2.5"
            )}
            placeholder="0"
          />
        </div>
      </div>

      {hint && !error && (
        <p className="text-[11px] text-muted-foreground leading-normal font-sans mt-0.5">{hint}</p>
      )}
      {error && (
        <p className="text-red-500 font-sans text-xs font-semibold mt-1 flex items-center gap-1" role="alert" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
