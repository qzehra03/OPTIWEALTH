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
import { onboardUser } from "@/lib/api";
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

      login({
        accessToken: response.access_token,
        user: response.user,
      });

      sessionStorage.setItem("optiwealth_onboarding", JSON.stringify(response));
      sessionStorage.setItem(
        "optiwealth_extended_profile",
        JSON.stringify(extractExtendedProfile(form))
      );

      router.push("/dashboard");
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
    <div className="h-screen w-full bg-gradient-to-tr from-[#E6F7F0]/40 via-[#F0FAF6] to-[#D8F3E5]/50 relative flex items-start justify-center pt-20 pb-4 md:pt-24 md:pb-6 px-4 md:px-8 font-sans antialiased overflow-hidden">
      
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
        <PremiumOptiWealthLogo className="h-7 w-7 text-[#037A6B] shrink-0" />
        <span className="font-header font-bold text-xl tracking-tight text-slate-900">
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
          className="shrink-0 border-slate-200 text-slate-700 bg-white/60 hover:bg-white focus-visible:ring-[#037A6B] shadow-sm rounded-xl h-8 text-xs"
        >
          <FlaskConical className="h-3.5 w-3.5 mr-1" />
          Demo Data
        </Button>
        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-header pointer-events-none hidden md:block">
          OptiWealth Telemetry Workspace
        </div>
      </div>

      {/* Floating Translucent Glass Tile Container */}
      <div className="bg-white/35 backdrop-blur-md border border-white/50 rounded-3xl p-6 md:p-8 shadow-xl w-full max-w-4xl flex flex-col gap-4 z-10 relative select-none max-h-[calc(100vh-100px)] md:max-h-[calc(100vh-130px)]">
        
        {/* Step Indicator & Progress */}
        <div className="space-y-2.5 shrink-0">
          <StepIndicator currentStep={step} />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Step {step} of {TOTAL_STEPS}
              </span>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                {Math.round(progressValue)}%
              </Badge>
            </div>
            <Progress 
              value={progressValue} 
              indicatorClassName="bg-[#037A6B]" 
              className="bg-slate-100 h-1.5"
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

        {/* Scrollable Main Form Content */}
        <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar min-h-0 py-1 space-y-4">
          {/* Active Step Panel */}
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

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 h-9 text-xs rounded-xl font-sans"
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
                "bg-[#037A6B] hover:bg-[#026356] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 outline-none h-9 text-xs",
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
                "bg-[#037A6B] hover:bg-[#026356] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 outline-none h-9 text-xs",
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
