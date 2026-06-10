"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Income & Obligations" },
  { id: 2, label: "Savings Snapshot" },
  { id: 3, label: "Goals & Tax" },
] as const;

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Onboarding progress" className="w-full">
      <ol className="flex items-center gap-2">
        {STEPS.map((step, index) => {
          const isComplete = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                      isComplete && "bg-[#037A6B] text-white border-[#037A6B]",
                      isCurrent && "bg-[#037A6B] text-white border-[#037A6B]",
                      !isComplete && !isCurrent && "border-slate-200 text-slate-500 bg-white"
                    )}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isComplete ? <Check className="h-3.5 w-3.5" /> : step.id}
                  </span>
                  <span
                    className={cn(
                      "truncate text-xs font-semibold sm:text-sm",
                      isCurrent ? "text-slate-900" : "text-slate-500"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                <div
                  className={cn(
                    "h-0.5 rounded-full transition-colors",
                    index < STEPS.length - 1 ? "block" : "hidden sm:block sm:opacity-0",
                    isComplete ? "bg-[#037A6B]" : "bg-slate-200"
                  )}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
