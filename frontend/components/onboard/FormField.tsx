"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children?: React.ReactNode;
}

export function FormField({
  id,
  label,
  hint,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-foreground font-semibold text-sm tracking-wide font-sans">
        {label}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-muted-foreground font-sans">{hint}</p>
      )}
      {error && (
        <p className="text-red-500 font-sans text-xs font-semibold mt-1 flex items-center gap-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  className?: string;
}

export function NumberField({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  className,
}: NumberFieldProps) {
  return (
    <FormField id={id} label={label} hint={hint} error={error} className={className}>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-extrabold text-[#037A6B]">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={min ?? 0}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const isDecimal = step && step % 1 !== 0;
            const cleanVal = isDecimal 
              ? e.target.value.replace(/[^0-9.]/g, "") 
              : e.target.value.replace(/\D/g, "");
            let num = cleanVal ? parseFloat(cleanVal) : 0;
            if (isNaN(num) || num < 0) {
              num = 0;
            }
            if (max !== undefined && num > max) {
              num = max;
            }
            onChange(num);
          }}
          className={cn(
            prefix && "pl-8",
            "bg-white/50 border-slate-200 text-[#037A6B] font-extrabold text-xl placeholder-slate-400 focus:border-[#037A6B] focus:ring-1 focus:ring-[#037A6B] focus-visible:ring-[#037A6B] focus-visible:border-[#037A6B] focus-visible:ring-offset-0 outline-none h-10 rounded-lg font-sans"
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
    </FormField>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function TextField({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  type = "text",
  className,
  onBlur,
}: TextFieldProps) {
  return (
    <FormField id={id} label={label} hint={hint} error={error} className={className}>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#037A6B] focus:ring-1 focus:ring-[#037A6B] focus-visible:ring-[#037A6B] focus-visible:border-[#037A6B] focus-visible:ring-offset-0 outline-none h-10 text-sm rounded-lg font-sans"
        aria-invalid={!!error}
      />
    </FormField>
  );
}
