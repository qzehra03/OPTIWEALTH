"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberField, TextField } from "@/components/onboard/FormField";
import { SliderWithNumericInput } from "@/components/onboard/SliderWithNumericInput";
import type { OnboardingFormData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IncomeObligationsStepProps {
  values: OnboardingFormData;
  errors: Record<string, string>;
  onChange: <K extends keyof OnboardingFormData>(
    key: K,
    value: OnboardingFormData[K]
  ) => void;
  onEmailBlur?: () => void;
}

const EMPTY_DEBT = {
  name: "",
  principal: 0,
  emi: 0,
  apr: 0,
  termMonths: 0,
  remainingBalance: 0,
};

const getPasswordStrength = (pass: string) => {
  if (!pass) return { score: 0, label: "", colorClass: "bg-slate-200" };
  
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  
  let label = "Weak";
  let colorClass = "bg-red-500";
  
  if (score === 2) {
    label = "Moderate";
    colorClass = "bg-yellow-500";
  } else if (score >= 3) {
    label = "Institutional Grade";
    colorClass = "bg-[#037A6B]"; // Premium Deep Emerald
  }
  
  return { score, label, colorClass };
};

export function IncomeObligationsStep({
  values,
  errors,
  onChange,
  onEmailBlur,
}: IncomeObligationsStepProps) {
  const updateDebt = (
    index: number,
    field: keyof OnboardingFormData["debts"][number],
    value: string | number
  ) => {
    const next = [...values.debts];
    next[index] = { ...next[index], [field]: value };
    onChange("debts", next);
  };

  const addDebt = () => onChange("debts", [...values.debts, { ...EMPTY_DEBT }]);

  const removeDebt = (index: number) => {
    onChange(
      "debts",
      values.debts.filter((_, i) => i !== index)
    );
  };

  const isEmailRegistered = values.email.toLowerCase() === "sandbox.reviewer@optiwealth.app";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full mt-2">
      <div className="md:col-span-2">
        <h2 className="text-[#037A6B] font-extrabold text-xl tracking-tight font-header">
          Income & Obligations
        </h2>
        <p className="mt-0.5 text-xs text-slate-500 font-sans">
          Capture credentials, annual earnings, fixed costs, and debt liabilities.
        </p>
      </div>

      {/* Left Column: Credentials & Personal Info */}
      <div className="space-y-4">
        <div className="space-y-1">
          <TextField
            id="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={(v) => onChange("email", v)}
            onBlur={onEmailBlur}
            error={errors.email}
            hint="Used to sign in after onboarding"
          />
          {isEmailRegistered && (
            <p className="text-xs text-amber-600 font-semibold font-sans mt-1 animate-fade-in" role="alert">
              ⚠️ Identity already registered in sandbox allocation pipeline
            </p>
          )}
        </div>

        <TextField
          id="fullName"
          label="Full Name"
          value={values.fullName}
          onChange={(v) => onChange("fullName", v)}
          error={errors.fullName}
        />

        <div className="space-y-1">
          <TextField
            id="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={(v) => onChange("password", v)}
            error={errors.password}
            hint="Minimum 8 characters"
          />
          {values.password && (
            <div className="space-y-1.5 mt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((index) => {
                  const { score, colorClass } = getPasswordStrength(values.password);
                  return (
                    <div
                      key={index}
                      className={cn(
                        "h-1 w-full rounded-full transition-all duration-300",
                        index <= score ? colorClass : "bg-slate-200/50"
                      )}
                    />
                  );
                })}
              </div>
              <span className={cn("text-[10px] font-bold font-sans uppercase tracking-wider block mt-1", 
                getPasswordStrength(values.password).score === 1 && "text-red-500",
                getPasswordStrength(values.password).score === 2 && "text-yellow-600",
                getPasswordStrength(values.password).score >= 3 && "text-[#037A6B]"
              )}>
                Strength: {getPasswordStrength(values.password).label}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <TextField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={values.confirmPassword}
            onChange={(v) => onChange("confirmPassword", v)}
            error={errors.confirmPassword}
          />
          {values.password && values.confirmPassword && values.password !== values.confirmPassword && (
            <p className="text-red-500 font-sans text-xs font-semibold mt-1 flex items-center gap-1" role="alert">
              ⚠️ Passwords do not match
            </p>
          )}
        </div>
      </div>

      {/* Right Column: Financial Sliders & Debts */}
      <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
        <SliderWithNumericInput
          id="annualGrossSalary"
          label="Gross Annual Salary"
          value={values.annualGrossSalary}
          onChange={(v) => onChange("annualGrossSalary", v)}
          error={errors.annualGrossSalary}
          min={0}
          max={20000000} // Max 2Cr
          step={50000}
          hint="Pre-tax CTC for the current financial year"
        />

        <SliderWithNumericInput
          id="fixedMonthlyRent"
          label="Fixed Monthly Rent"
          value={values.fixedMonthlyRent}
          onChange={(v) => onChange("fixedMonthlyRent", v)}
          error={errors.fixedMonthlyRent}
          min={0}
          max={500000} // Max 5L
          step={1000}
        />

        <div className="grid gap-4 grid-cols-2">
          <NumberField
            id="creditCardBalance"
            label="Credit Card Balance"
            prefix="₹"
            value={values.creditCardBalance}
            onChange={(v) => onChange("creditCardBalance", v)}
            error={errors.creditCardBalance}
          />
          <NumberField
            id="creditCardLimit"
            label="Credit Card Limit"
            prefix="₹"
            value={values.creditCardLimit}
            onChange={(v) => onChange("creditCardLimit", v)}
            error={errors.creditCardLimit}
          />
        </div>

        <Card className="border border-slate-100 bg-white/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800 font-header">Active Debts</CardTitle>
              <p className="text-[10px] text-slate-500 font-sans">
                Liabilities list
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addDebt} className="h-7 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 p-3 pt-0">
            {values.debts.length === 0 && (
              <p className="rounded-md border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500 bg-slate-50/20 font-sans">
                No active debts.
              </p>
            )}
            {values.debts.map((debt, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-md border border-slate-100 p-3 bg-white/70"
              >
                <TextField
                  id={`debt-name-${index}`}
                  label="Debt Name"
                  value={debt.name}
                  onChange={(v) => updateDebt(index, "name", v)}
                  error={errors[`debts.${index}.name`]}
                  className="text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <NumberField
                    id={`debt-principal-${index}`}
                    label="Principal"
                    prefix="₹"
                    value={debt.principal}
                    onChange={(v) => updateDebt(index, "principal", v)}
                    error={errors[`debts.${index}.principal`]}
                  />
                  <NumberField
                    id={`debt-emi-${index}`}
                    label="EMI"
                    prefix="₹"
                    value={debt.emi}
                    onChange={(v) => updateDebt(index, "emi", v)}
                    error={errors[`debts.${index}.emi`]}
                  />
                  <NumberField
                    id={`debt-apr-${index}`}
                    label="APR (%)"
                    value={debt.apr}
                    onChange={(v) => updateDebt(index, "apr", v)}
                    error={errors[`debts.${index}.apr`]}
                    step={0.1}
                  />
                  <NumberField
                    id={`debt-term-${index}`}
                    label="Term (mo)"
                    value={debt.termMonths}
                    onChange={(v) => updateDebt(index, "termMonths", v)}
                    error={errors[`debts.${index}.termMonths`]}
                  />
                </div>
                <NumberField
                  id={`debt-balance-${index}`}
                  label="Remaining Balance"
                  prefix="₹"
                  value={debt.remainingBalance}
                  onChange={(v) => updateDebt(index, "remainingBalance", v)}
                  error={errors[`debts.${index}.remainingBalance`]}
                />
                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDebt(index)}
                    className="text-red-500 hover:text-red-600 h-7 text-xs px-2 rounded-lg font-sans"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
