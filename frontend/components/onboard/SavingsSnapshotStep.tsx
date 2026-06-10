"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberField } from "@/components/onboard/FormField";
import { SliderWithNumericInput } from "@/components/onboard/SliderWithNumericInput";
import type { OnboardingFormData } from "@/lib/types";

interface SavingsSnapshotStepProps {
  values: OnboardingFormData;
  errors: Record<string, string>;
  onChange: <K extends keyof OnboardingFormData>(
    key: K,
    value: OnboardingFormData[K]
  ) => void;
  onSavingsChange?: () => void;
}

const EMPTY_FD = {
  bankName: "",
  principal: 0,
  interestRate: 0,
  maturityDate: "",
};

export function SavingsSnapshotStep({
  values,
  errors,
  onChange,
  onSavingsChange,
}: SavingsSnapshotStepProps) {
  const updateFd = (
    index: number,
    field: keyof OnboardingFormData["fixedDeposits"][number],
    value: string | number
  ) => {
    const next = [...values.fixedDeposits];
    next[index] = { ...next[index], [field]: value };
    onChange("fixedDeposits", next);
  };

  const addFd = () =>
    onChange("fixedDeposits", [...values.fixedDeposits, { ...EMPTY_FD }]);

  const removeFd = (index: number) => {
    onChange(
      "fixedDeposits",
      values.fixedDeposits.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full mt-2">
      <div className="md:col-span-2">
        <h2 className="text-[#037A6B] font-extrabold text-xl tracking-tight font-header">
          Savings Snapshot
        </h2>
        <p className="mt-0.5 text-xs text-slate-500 font-sans">
          Liquid reserves, fixed deposits, SIP flows, and retirement-linked assets.
        </p>
      </div>

      {/* Left Column: Liquid Reserves and Mutual Funds */}
      <div className="space-y-4">
        <SliderWithNumericInput
          id="liquidSavings"
          label="Liquid Savings"
          value={values.liquidSavings}
          onChange={(v) => {
            onChange("liquidSavings", v);
            onSavingsChange?.();
          }}
          error={errors.liquidSavings}
          min={0}
          max={10000000} // Max 1Cr
          step={10000}
          hint="Cash + savings accounts available within 24 hours"
        />

        <SliderWithNumericInput
          id="mutualFundValuation"
          label="Mutual Fund Portfolio Valuation"
          value={values.mutualFundValuation}
          onChange={(v) => {
            onChange("mutualFundValuation", v);
            onSavingsChange?.();
          }}
          error={errors.mutualFundValuation}
          min={0}
          max={100000000} // Max 10Cr
          step={100000}
        />
      </div>

      {/* Right Column: SIP, EPF, and FDs */}
      <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
        <NumberField
          id="monthlySip"
          label="Monthly SIP"
          prefix="₹"
          value={values.monthlySip}
          onChange={(v) => {
            onChange("monthlySip", v);
            onSavingsChange?.();
          }}
          error={errors.monthlySip}
        />

        <div className="grid gap-4 grid-cols-2">
          <NumberField
            id="epfBalance"
            label="EPF Balance"
            prefix="₹"
            value={values.epfBalance}
            onChange={(v) => {
              onChange("epfBalance", v);
              onSavingsChange?.();
            }}
            error={errors.epfBalance}
          />

          <NumberField
            id="epfMonthlyContribution"
            label="EPF Monthly Contribution"
            prefix="₹"
            value={values.epfMonthlyContribution}
            onChange={(v) => {
              onChange("epfMonthlyContribution", v);
              onSavingsChange?.();
            }}
            error={errors.epfMonthlyContribution}
          />
        </div>

        <Card className="border border-slate-100 bg-white/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800 font-header">Fixed Deposits</CardTitle>
              <p className="text-[10px] text-slate-500 font-sans">
                FD ledger list
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addFd} className="h-7 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 p-3 pt-0">
            {values.fixedDeposits.length === 0 && (
              <p className="rounded-md border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500 bg-slate-50/20 font-sans">
                No fixed deposits recorded.
              </p>
            )}
            {values.fixedDeposits.map((fd, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-md border border-slate-100 p-3 bg-white/70"
              >
                <div className="space-y-1.5">
                  <Label htmlFor={`fd-bank-${index}`} className="text-xs font-semibold text-slate-700 font-sans">Bank Name</Label>
                  <Input
                    id={`fd-bank-${index}`}
                    value={fd.bankName}
                    onChange={(e) => updateFd(index, "bankName", e.target.value)}
                    className="h-8 text-xs bg-white/50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#037A6B] focus:ring-1 focus:ring-[#037A6B] focus-visible:ring-[#037A6B] focus-visible:border-[#037A6B] focus-visible:ring-offset-0 outline-none rounded-lg font-sans"
                    aria-invalid={!!errors[`fixedDeposits.${index}.bankName`]}
                  />
                  {errors[`fixedDeposits.${index}.bankName`] && (
                    <p className="text-[10px] text-red-500 font-semibold font-sans" role="alert">
                      {errors[`fixedDeposits.${index}.bankName`]}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <NumberField
                    id={`fd-principal-${index}`}
                    label="Principal"
                    prefix="₹"
                    value={fd.principal}
                    onChange={(v) => updateFd(index, "principal", v)}
                    error={errors[`fixedDeposits.${index}.principal`]}
                  />
                  <NumberField
                    id={`fd-rate-${index}`}
                    label="Rate (%)"
                    value={fd.interestRate}
                    onChange={(v) => updateFd(index, "interestRate", v)}
                    error={errors[`fixedDeposits.${index}.interestRate`]}
                    step={0.1}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`fd-maturity-${index}`} className="text-xs font-semibold text-slate-700 font-sans">Maturity Date</Label>
                  <Input
                    id={`fd-maturity-${index}`}
                    type="date"
                    value={fd.maturityDate}
                    onChange={(e) => updateFd(index, "maturityDate", e.target.value)}
                    className="h-8 text-xs bg-white/50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#037A6B] focus:ring-1 focus:ring-[#037A6B] focus-visible:ring-[#037A6B] focus-visible:border-[#037A6B] focus-visible:ring-offset-0 outline-none rounded-lg font-sans"
                    aria-invalid={!!errors[`fixedDeposits.${index}.maturityDate`]}
                  />
                  {errors[`fixedDeposits.${index}.maturityDate`] && (
                    <p className="text-[10px] text-red-500 font-semibold font-sans" role="alert">
                      {errors[`fixedDeposits.${index}.maturityDate`]}
                    </p>
                  )}
                </div>
                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFd(index)}
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
