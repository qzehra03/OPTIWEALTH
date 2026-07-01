"use client";

import { NumberField } from "@/components/onboard/FormField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderWithNumericInput } from "@/components/onboard/SliderWithNumericInput";
import type { OnboardingFormData } from "@/lib/types";

interface GoalsTaxStepProps {
  values: OnboardingFormData;
  errors: Record<string, string>;
  onChange: <K extends keyof OnboardingFormData>(
    key: K,
    value: OnboardingFormData[K]
  ) => void;
}

interface TaxFormattedFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  maxLimit: number;
  capLabel: string;
}

function TaxFormattedField({
  id,
  label,
  value,
  onChange,
  error,
  maxLimit,
  capLabel,
}: TaxFormattedFieldProps) {
  // Display standard Indian comma grouping dynamically as user types.
  // 0 displays as empty string for smooth editing/backspacing.
  const displayValue = value === 0 ? "" : new Intl.NumberFormat("en-IN").format(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    let num = rawDigits ? parseInt(rawDigits, 10) : 0;

    // Clamp state value to the standard legal threshold
    if (num > maxLimit) {
      num = maxLimit;
    }

    onChange(num);
  };

  const isMaxed = value >= maxLimit;
  const remaining = maxLimit - value;

  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="font-sans font-semibold text-luxe-ivory/90 text-sm block tracking-wide"
      >
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-extrabold text-luxe-bronze">
          ₹
        </span>
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          className="pl-8 bg-luxe-forest/50 border-luxe-copper/30 text-luxe-bronze font-extrabold text-xl placeholder-slate-400 focus:border-luxe-copper focus:ring-1 focus:ring-luxe-bronze focus-visible:ring-luxe-bronze focus-visible:border-luxe-copper focus-visible:ring-offset-0 outline-none h-10 rounded-lg font-sans"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="0"
        />
      </div>

      {isMaxed ? (
        <div className="mt-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-sans">
            ✨ Maxed out under {capLabel} cap
          </span>
        </div>
      ) : (
        !error && (
          <p className="text-[10px] text-muted-foreground mt-1 font-sans">
            ₹{remaining.toLocaleString("en-IN")} remaining under {capLabel} cap
          </p>
        )
      )}

      {error && (
        <p className="text-red-500 font-sans text-xs font-semibold mt-1 flex items-center gap-1" role="alert" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export function GoalsTaxStep({ values, errors, onChange }: GoalsTaxStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full mt-2">
      <div className="md:col-span-2">
        <h2 className="text-luxe-bronze font-extrabold text-xl tracking-tight font-header">
          Goals & Tax Parameters
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground font-sans">
          Retirement targets and year-to-date deduction entries for regime simulation.
        </p>
      </div>

      {/* Left Column: Retirement Age & Expense Sliders */}
      <div className="space-y-4">
        <SliderWithNumericInput
          id="targetRetirementAge"
          label="Target Retirement Age"
          value={values.targetRetirementAge}
          onChange={(v) => onChange("targetRetirementAge", v)}
          error={errors.targetRetirementAge}
          min={30}
          max={70}
          isCurrency={false}
        />
        <SliderWithNumericInput
          id="expectedMonthlyRetirementExpenses"
          label="Expected Monthly Retirement Expenses"
          value={values.expectedMonthlyRetirementExpenses}
          onChange={(v) => onChange("expectedMonthlyRetirementExpenses", v)}
          error={errors.expectedMonthlyRetirementExpenses}
          min={0}
          max={1000000} // Max ₹10L
          step={1000}
        />
      </div>

      {/* Right Column: Tax Fields & summary note */}
      <div className="space-y-4 font-sans">
        <TaxFormattedField
          id="ytdSection80C"
          label="Year-to-Date Section 80C"
          value={values.ytdSection80C}
          onChange={(v) => onChange("ytdSection80C", v)}
          error={errors.ytdSection80C}
          maxLimit={150000}
          capLabel="₹1.5L"
        />
        <TaxFormattedField
          id="ytdSection80D"
          label="Year-to-Date Section 80D"
          value={values.ytdSection80D}
          onChange={(v) => onChange("ytdSection80D", v)}
          error={errors.ytdSection80D}
          maxLimit={100000}
          capLabel="₹1L"
        />

        <div className="rounded-lg border border-luxe-copper/20 bg-luxe-forest/40 p-3 text-[11px] text-muted-foreground leading-normal font-sans">
          <p>
            Tax regime comparison, health scoring, and debt optimization are computed
            server-side after submission. No financial logic runs in the browser.
          </p>
        </div>
      </div>
    </div>
  );
}
