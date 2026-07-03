"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  FlaskConical,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StepIndicator } from "@/components/onboard/StepIndicator";
import { IncomeObligationsStep } from "@/components/onboard/IncomeObligationsStep";
import { SavingsSnapshotStep } from "@/components/onboard/SavingsSnapshotStep";
import { GoalsTaxStep } from "@/components/onboard/GoalsTaxStep";
import { useAuth } from "@/components/providers/AuthProvider";
import { onboardUser, loginUser } from "@/lib/api";
import {
  extractExtendedProfile,
  mapFormToOnboardingRequest,
} from "@/lib/mappers/onboarding";
import { SANDBOX_PROFILE } from "@/lib/sandbox-profile";
import type { ApiError, OnboardingFormData } from "@/lib/types";
import {
  step1Schema,
  step2Schema,
  step3Schema,
} from "@/lib/validations/onboarding";
import type { ZodError } from "zod";
import { cn } from "@/lib/utils";
import { PremiumOptiWealthLogo } from "@/components/layout/PremiumOptiWealthLogo";
import { OnboardingAnimationPane } from "@/components/onboard/OnboardingAnimationPane";

const INITIAL_FORM: OnboardingFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  annualGrossSalary: 0,
  fixedMonthlyRent: 0,
  debts: [],
  creditCardBalance: 0,
  creditCardLimit: 0,
  liquidSavings: 0,
  fixedDeposits: [],
  monthlySip: 0,
  mutualFundValuation: 0,
  epfBalance: 0,
  epfMonthlyContribution: 0,
  targetRetirementAge: 60,
  expectedMonthlyRetirementExpenses: 0,
  ytdSection80C: 0,
  ytdSection80D: 0,
};

const STEP_SCHEMAS = [step1Schema, step2Schema, step3Schema] as const;
const TOTAL_STEPS = 3;

function flattenZodErrors(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!result[path]) result[path] = issue.message;
  }
  return result;
}

export function OnboardingWizard() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [form, setForm] = useState<OnboardingFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sandboxLoaded, setSandboxLoaded] = useState(false);
  
  // Animation states
  const progressValue = (step / TOTAL_STEPS) * 100;

  const triggerSavingsChange = useCallback(() => {
    // No-op: money rain runs continuously across all steps
  }, []);

  const [isCurrentStepValid, setIsCurrentStepValid] = useState(true);

  // Validate active step fields in real-time as state/step mutates
  useEffect(() => {
    const schema = STEP_SCHEMAS[step - 1];
    const result = schema.safeParse(form);

    let isUnique = true;
    if (step === 1 && form.email.toLowerCase() === "sandbox.reviewer@optiwealth.app") {
      isUnique = false;
    }

    let passwordsMatch = true;
    if (step === 1 && form.password !== form.confirmPassword) {
      passwordsMatch = false;
    }

    setIsCurrentStepValid(result.success && isUnique && passwordsMatch);
  }, [form, step]);

  const handleEmailBlur = useCallback(() => {
    if (form.email.toLowerCase() === "sandbox.reviewer@optiwealth.app") {
      setErrors((prev) => ({
        ...prev,
        email: "A user with this email already exists."
      }));
    } else {
      const result = step1Schema.safeParse(form);
      const newErrors = result.success ? {} : flattenZodErrors(result.error);
      if (newErrors.email) {
        setErrors((prev) => ({
          ...prev,
          email: newErrors.email
        }));
      }
    }
  }, [form]);

  const updateField = useCallback(
    <K extends keyof OnboardingFormData>(
      key: K,
      value: OnboardingFormData[K]
    ) => {
      setForm((prev) => {
        const updated = { ...prev, [key]: value };
        
        // Inline field validation on keystroke
        const schema = STEP_SCHEMAS[step - 1];
        const result = schema.safeParse(updated);
        
        setErrors((prevErrors) => {
          const next = { ...prevErrors };
          const newErrors = result.success ? {} : flattenZodErrors(result.error);
          
          if (newErrors[key as string]) {
            next[key as string] = newErrors[key as string];
          } else {
            delete next[key as string];
          }
          
          if (key === "password" || key === "confirmPassword") {
            if (updated.password !== updated.confirmPassword && updated.confirmPassword) {
              next.confirmPassword = "Passwords do not match";
            } else {
              delete next.confirmPassword;
            }
          }

          if (key === "email") {
            if (updated.email.toLowerCase() === "sandbox.reviewer@optiwealth.app") {
              next.email = "A user with this email already exists.";
            } else {
              const emailErr = newErrors.email;
              if (emailErr) {
                next.email = emailErr;
              } else {
                delete next.email;
              }
            }
          }

          return next;
        });

        return updated;
      });
    },
    [step]
  );

  const validateStep = (stepIndex: number): boolean => {
    const schema = STEP_SCHEMAS[stepIndex - 1];
    const result = schema.safeParse(form);

    if (!result.success) {
      setErrors(flattenZodErrors(result.error));
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setDirection("forward");
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setDirection("back");
    setStep((s) => Math.max(s - 1, 1));
    setErrors({});
  };

  const loadSandbox = () => {
    setForm(SANDBOX_PROFILE);
    setErrors({});
    setSubmitError(null);
    setSandboxLoaded(true);
  };

  const executeSubmission = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = mapFormToOnboardingRequest(form);
      const response = await onboardUser(payload);

      let accessToken = response.access_token;
      let user = response.user;

      if (!accessToken) {
        const authResponse = await loginUser({
          email: form.email,
          password: form.password,
        });
        accessToken = authResponse.access_token;
        user = authResponse.user;
      }

      login({
        accessToken,
        user,
      });

      sessionStorage.setItem("optiwealth_onboarding", JSON.stringify(response));
      sessionStorage.setItem(
        "optiwealth_extended_profile",
        JSON.stringify(extractExtendedProfile(form))
      );

      router.replace("/dashboard");
    } catch (err) {
      const apiErr = err as ApiError;
      setSubmitError(
        apiErr.message ??
          "Onboarding failed. Please verify your inputs and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(step)) return;
    executeSubmission();
  };

  return (
    <div className="h-screen w-full bg-background text-foreground relative flex items-start justify-center pt-20 pb-4 md:pt-24 md:pb-6 px-4 md:px-8 font-sans antialiased overflow-hidden fintech-grid">
      
      {/* Background Canvas Animation Layer */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <OnboardingAnimationPane 
          activeStep={step}
          savingsChangeCount={0}
          arrowTrigger="idle"
        />
      </div>

      {/* Brand Logo in the top left corner */}
      <div className="absolute top-4 left-4 md:top-6 md:left-8 z-20 flex items-center gap-2.5 select-none pointer-events-auto">
        <PremiumOptiWealthLogo className="h-7 w-7 text-primary shrink-0" />
        <span className="font-header font-bold text-xl tracking-tight text-foreground">
          OptiWealth
        </span>
      </div>

      {/* Top right control panel */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 z-20 flex items-center gap-4 pointer-events-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={loadSandbox}
          className="shrink-0 border-border text-foreground bg-card/60 hover:bg-card focus-visible:ring-primary shadow-sm rounded-xl h-8 text-xs"
        >
          <FlaskConical className="h-3.5 w-3.5 mr-1 text-primary" />
          Demo Data
        </Button>
        <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase font-header pointer-events-none hidden md:block">
          OptiWealth Telemetry Workspace
        </div>
      </div>

      {/* Floating Translucent Glass Tile Container */}
      <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 shadow-xl w-full max-w-[calc(100vw-8rem)] flex flex-col gap-4 z-10 relative select-none max-h-[calc(100vh-100px)] md:max-h-[calc(100vh-130px)]">
        
        {/* Step Indicator & Progress */}
        <div className="space-y-2.5 shrink-0">
          <StepIndicator currentStep={step} />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Step {step} of {TOTAL_STEPS}
              </span>
              <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border font-semibold">
                {Math.round(progressValue)}%
              </Badge>
            </div>
            <Progress 
              value={progressValue} 
              indicatorClassName="bg-primary" 
              className="bg-muted h-1.5"
              aria-label="Onboarding progress" 
            />
          </div>
        </div>

        {/* Sandbox Loaded Banner */}
        {sandboxLoaded && (
          <div
            className="rounded-md border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs text-warning shrink-0"
            role="status"
          >
            Sandbox profile loaded — review each step or submit directly.
          </div>
        )}

        {/* Scrollable Main Form Content with Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
          {/* Left Column: Form Content */}
          <div className="flex-1 overflow-y-auto pr-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-0 py-1 space-y-4">
            <div
              key={`${step}-${direction}`}
              className={cn(
                "flex-1",
                direction === "forward"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
              )}
            >
              {step === 1 && (
                <IncomeObligationsStep
                  values={form}
                  errors={errors}
                  onChange={updateField}
                  onEmailBlur={handleEmailBlur}
                />
              )}
              {step === 2 && (
                <SavingsSnapshotStep
                  values={form}
                  errors={errors}
                  onChange={updateField}
                  onSavingsChange={triggerSavingsChange}
                />
              )}
              {step === 3 && (
                <GoalsTaxStep
                  values={form}
                  errors={errors}
                  onChange={updateField}
                />
              )}
            </div>

            {submitError && (
              <div
                className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {submitError}
              </div>
            )}
          </div>

          {/* Right Column: Live Preview Card Sidebar */}
          <div className="w-full md:w-80 shrink-0 border-t md:border-t-0 md:border-l border-border/80 pt-4 md:pt-0 md:pl-6 flex flex-col gap-4 justify-between overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5">
                <h4 className="font-header font-bold text-xs uppercase tracking-wider text-luxe-bronze">
                  Live Plan Preview
                </h4>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h5 className="font-header font-bold text-xs text-foreground">
                      The 50/30/20 Rule
                    </h5>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-normal font-sans">
                      What it means: A simple, structured budgeting blueprint used to divide your monthly take-home income into three clear categories.
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-normal font-sans">
                      How it's calculated: The app takes your total monthly net income and splits it mathematically: exactly 50% for essential living needs, 30% for personal wants, and 20% directed straight into savings.
                    </p>
                  </div>

                  <div className="border-t border-border/60 pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Estimated Monthly Split
                    </span>
                    {form.annualGrossSalary > 0 ? (
                      (() => {
                        const monthlyIncome = Math.round(form.annualGrossSalary / 12);
                        const needs = Math.round(monthlyIncome * 0.5);
                        const wants = Math.round(monthlyIncome * 0.3);
                        const savings = Math.round(monthlyIncome * 0.2);
                        return (
                          <div className="space-y-2">
                            <div className="flex justify-between items-baseline text-xs font-semibold">
                              <span className="text-muted-foreground">Monthly Share:</span>
                              <span className="text-foreground font-bold">₹{monthlyIncome.toLocaleString("en-IN")}</span>
                            </div>
                            
                            {/* Stacked Progress Bar */}
                            <div className="h-3 w-full rounded-full overflow-hidden flex bg-muted">
                              <div className="h-full bg-luxe-copper" style={{ width: "50%" }} title="Needs 50%" />
                              <div className="h-full bg-luxe-bronze opacity-80" style={{ width: "30%" }} title="Wants 30%" />
                              <div className="h-full bg-emerald-500" style={{ width: "20%" }} title="Savings 20%" />
                            </div>

                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-[10px] leading-none">
                                <span className="text-luxe-copper font-bold">Needs (50%):</span>
                                <span className="text-foreground font-semibold">₹{needs.toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex justify-between text-[10px] leading-none">
                                <span className="text-luxe-bronze font-bold">Wants (30%):</span>
                                <span className="text-foreground font-semibold">₹{wants.toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex justify-between text-[10px] leading-none">
                                <span className="text-emerald-600 font-bold">Savings (20%):</span>
                                <span className="text-foreground font-semibold">₹{savings.toLocaleString("en-IN")}</span>
                              </div>
                            </div>

                            <p className="text-[9px] text-muted-foreground leading-normal mt-2 italic">
                              *Rent commitment: ₹{(form.fixedMonthlyRent || 0).toLocaleString("en-IN")}/mo is categorized under Needs.
                            </p>
                          </div>
                        );
                      })()
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        Input salary on the left to view split metrics.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h5 className="font-header font-bold text-xs text-foreground">
                      Liquidity
                    </h5>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-normal font-sans">
                      What it means: How quickly and easily you can convert an asset back into spendable cash without losing its value.
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-normal font-sans">
                      How it's calculated: The app categorizes your wealth into immediate funds (like savings accounts) and locked funds (like long-term deposits), showing you exactly how much cash is available for instant withdrawal.
                    </p>
                  </div>

                  <div className="border-t border-border/60 pt-3 space-y-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Reserves Breakdown
                    </span>
                    {(() => {
                      const liquid = form.liquidSavings || 0;
                      const locked = (form.fixedDeposits?.reduce((sum, fd) => sum + (fd.principal || 0), 0) || 0) + (form.epfBalance || 0);
                      const total = liquid + locked + (form.mutualFundValuation || 0);
                      
                      const liquidPercent = total > 0 ? Math.round((liquid / total) * 100) : 0;
                      const lockedPercent = total > 0 ? Math.round((locked / total) * 100) : 0;
                      const mfPercent = total > 0 ? Math.round(((form.mutualFundValuation || 0) / total) * 100) : 0;

                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between items-baseline text-xs font-semibold">
                            <span className="text-muted-foreground">Total Tracker Reserves:</span>
                            <span className="text-foreground font-bold">₹{total.toLocaleString("en-IN")}</span>
                          </div>

                          <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-muted">
                            <div className="h-full bg-emerald-500" style={{ width: `${liquidPercent}%` }} title="Immediate Cash" />
                            <div className="h-full bg-luxe-copper" style={{ width: `${mfPercent}%` }} title="Mutual Funds" />
                            <div className="h-full bg-luxe-bronze" style={{ width: `${lockedPercent}%` }} title="Locked Funds" />
                          </div>

                          <div className="space-y-1.5 pt-1 text-[10px]">
                            <div className="flex justify-between items-center">
                              <span className="text-emerald-600 font-bold">Immediate Cash (Liquid):</span>
                              <span className="text-foreground font-semibold">₹{liquid.toLocaleString("en-IN")} ({liquidPercent}%)</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-luxe-copper font-bold">Mutual Funds (Market):</span>
                              <span className="text-foreground font-semibold">₹{(form.mutualFundValuation || 0).toLocaleString("en-IN")} ({mfPercent}%)</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-luxe-bronze font-bold">Locked Funds (EPF + FD):</span>
                              <span className="text-foreground font-semibold">₹{locked.toLocaleString("en-IN")} ({lockedPercent}%)</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h5 className="font-header font-bold text-xs text-foreground">
                      Asset Value & Tax Optimization
                    </h5>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-normal font-sans">
                      We will use your retirement targets and Section 80C/80D investments to calculate your future wealth growth.
                    </p>
                  </div>
                  
                  <div className="border-t border-border/60 pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Computed Indicators
                    </span>
                    <div className="rounded-xl border border-border bg-card p-3 space-y-2 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Retirement Goal:</span>
                        <span className="text-foreground font-bold">₹{(form.expectedMonthlyRetirementExpenses * 12 * 25).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax Deductions Declared:</span>
                        <span className="text-foreground font-bold">₹{((form.ytdSection80C || 0) + (form.ytdSection80D || 0)).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[9px] text-muted-foreground leading-snug border-t border-border/40 pt-2 font-sans select-none">
              This real-time tracker uses literal financial modeling rules to ensure complete transparency.
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-border pt-4 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="border-border text-foreground hover:bg-muted h-9 text-xs rounded-xl font-sans"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < TOTAL_STEPS ? (
            <Button 
              type="button" 
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              className={cn(
                "bg-primary hover:opacity-90 text-primary-foreground font-bold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 outline-none h-9 text-xs",
                !isCurrentStepValid && "opacity-50 pointer-events-none cursor-not-allowed"
              )}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting || !isCurrentStepValid}
              className={cn(
                "bg-primary hover:opacity-90 text-primary-foreground font-bold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 outline-none h-9 text-xs",
                (!isCurrentStepValid || isSubmitting) && "opacity-50 pointer-events-none cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Complete Onboarding
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>

      </div>

    </div>
  );
}
