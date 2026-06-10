import { z } from "zod";

export const debtEntrySchema = z.object({
  name: z.string().min(1, "Debt name is required").max(120),
  principal: z.coerce.number().positive("Principal must be greater than 0"),
  emi: z.coerce.number().positive("EMI must be greater than 0"),
  apr: z.coerce
    .number()
    .min(0, "APR cannot be negative")
    .max(100, "APR cannot exceed 100%"),
  termMonths: z.coerce
    .number()
    .int("Term must be a whole number")
    .positive("Term must be at least 1 month"),
  remainingBalance: z.coerce
    .number()
    .positive("Remaining balance must be greater than 0"),
}).refine((data) => data.remainingBalance <= data.principal, {
  message: "Remaining balance cannot exceed principal",
  path: ["remainingBalance"],
});

export const fixedDepositEntrySchema = z.object({
  bankName: z.string().min(1, "Bank name is required").max(120),
  principal: z.coerce.number().positive("Principal must be greater than 0"),
  interestRate: z.coerce
    .number()
    .min(0, "Rate cannot be negative")
    .max(100, "Rate cannot exceed 100%"),
  maturityDate: z.string().min(1, "Maturity date is required"),
});

const step1BaseSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  fullName: z.string().min(1, "Full name is required").max(120),
  annualGrossSalary: z.coerce
    .number()
    .positive("Annual gross salary must be greater than 0"),
  fixedMonthlyRent: z.coerce
    .number()
    .min(0, "Rent cannot be negative"),
  debts: z.array(debtEntrySchema),
  creditCardBalance: z.coerce
    .number()
    .min(0, "Balance cannot be negative"),
  creditCardLimit: z.coerce
    .number()
    .min(0, "Limit cannot be negative"),
});

export const step1Schema = step1BaseSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.creditCardLimit === 0 ||
      data.creditCardBalance <= data.creditCardLimit,
    {
      message: "Balance cannot exceed credit limit",
      path: ["creditCardBalance"],
    }
  );

export const step2Schema = z.object({
  liquidSavings: z.coerce
    .number()
    .min(0, "Liquid savings cannot be negative"),
  fixedDeposits: z.array(fixedDepositEntrySchema),
  monthlySip: z.coerce.number().min(0, "SIP cannot be negative"),
  mutualFundValuation: z.coerce
    .number()
    .min(0, "Portfolio value cannot be negative"),
  epfBalance: z.coerce.number().min(0, "EPF balance cannot be negative"),
  epfMonthlyContribution: z.coerce
    .number()
    .min(0, "EPF contribution cannot be negative"),
});

export const step3Schema = z.object({
  targetRetirementAge: z.coerce
    .number()
    .int("Retirement age must be a whole number")
    .min(40, "Retirement age must be at least 40")
    .max(80, "Retirement age cannot exceed 80"),
  expectedMonthlyRetirementExpenses: z.coerce
    .number()
    .positive("Expected expenses must be greater than 0"),
  ytdSection80C: z.coerce
    .number()
    .min(0, "80C entries cannot be negative")
    .max(150000, "80C cap is ₹1,50,000"),
  ytdSection80D: z.coerce
    .number()
    .min(0, "80D entries cannot be negative")
    .max(100000, "80D cap is ₹1,00,000"),
});

export const onboardingFormSchema = step1BaseSchema
  .merge(step2Schema)
  .merge(step3Schema)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.creditCardLimit === 0 ||
      data.creditCardBalance <= data.creditCardLimit,
    {
      message: "Balance cannot exceed credit limit",
      path: ["creditCardBalance"],
    }
  );

export type Step1FormValues = z.infer<typeof step1Schema>;
export type Step2FormValues = z.infer<typeof step2Schema>;
export type Step3FormValues = z.infer<typeof step3Schema>;
export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
