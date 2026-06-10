import type {
  ExtendedProfileSnapshot,
  OnboardingFormData,
  UserOnboardingRequest,
} from "@/lib/types";

const CREDIT_CARD_APR = 42;

function buildCreditCardDebt(
  balance: number,
  limit: number
): UserOnboardingRequest["debts"][number] | null {
  if (balance <= 0) return null;

  return {
    name: "Credit Card (Revolving)",
    principal: limit > 0 ? limit : balance,
    interest_rate: CREDIT_CARD_APR,
    minimum_payment: Math.max(Math.round(balance * 0.05), 500),
    remaining_balance: balance,
  };
}

export function mapFormToOnboardingRequest(
  form: OnboardingFormData
): UserOnboardingRequest {
  const monthlyIncome = form.annualGrossSalary / 12;
  const debtEmiTotal = form.debts.reduce((sum, debt) => sum + debt.emi, 0);
  const creditCardMin = form.creditCardBalance > 0
    ? Math.max(Math.round(form.creditCardBalance * 0.05), 500)
    : 0;
  const monthlyExpenses = form.fixedMonthlyRent + debtEmiTotal + creditCardMin;

  const mappedDebts = form.debts.map((debt) => ({
    name: debt.name,
    principal: debt.principal,
    interest_rate: debt.apr,
    minimum_payment: debt.emi,
    remaining_balance: debt.remainingBalance,
  }));

  const creditCardDebt = buildCreditCardDebt(
    form.creditCardBalance,
    form.creditCardLimit
  );
  if (creditCardDebt) mappedDebts.push(creditCardDebt);

  return {
    email: form.email,
    password: form.password,
    full_name: form.fullName,
    monthly_income: monthlyIncome,
    monthly_expenses: monthlyExpenses,
    emergency_fund_balance: form.liquidSavings,
    annual_gross_income: form.annualGrossSalary,
    debts: mappedDebts,
    fixed_deposits: form.fixedDeposits.map((fd) => ({
      bank_name: fd.bankName,
      principal: fd.principal,
      interest_rate: fd.interestRate,
      maturity_date: fd.maturityDate,
    })),
  };
}

export function extractExtendedProfile(
  form: OnboardingFormData
): ExtendedProfileSnapshot {
  return {
    monthlySip: form.monthlySip,
    mutualFundValuation: form.mutualFundValuation,
    epfBalance: form.epfBalance,
    epfMonthlyContribution: form.epfMonthlyContribution,
    targetRetirementAge: form.targetRetirementAge,
    expectedMonthlyRetirementExpenses: form.expectedMonthlyRetirementExpenses,
    ytdSection80C: form.ytdSection80C,
    ytdSection80D: form.ytdSection80D,
    creditCardLimit: form.creditCardLimit,
  };
}
