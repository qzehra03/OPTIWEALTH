/** Backend-aligned API contracts — never compute scores locally. */

export interface DebtCreatePayload {
  name: string;
  principal: number;
  interest_rate: number;
  minimum_payment: number;
  remaining_balance: number;
}

export interface FixedDepositCreatePayload {
  bank_name: string;
  principal: number;
  interest_rate: number;
  maturity_date: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface UserOnboardingRequest {
  email: string;
  password: string;
  full_name: string;
  monthly_income: number;
  monthly_expenses: number;
  emergency_fund_balance: number;
  annual_gross_income: number;
  debts: DebtCreatePayload[];
  fixed_deposits: FixedDepositCreatePayload[];
}

export interface DebtResponse {
  id: number;
  name: string;
  principal: number;
  interest_rate: number;
  minimum_payment: number;
  remaining_balance: number;
}

export interface FixedDepositResponse {
  id: number;
  bank_name: string;
  principal: number;
  interest_rate: number;
  maturity_date: string;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  monthly_income: number;
  monthly_expenses: number;
  emergency_fund_balance: number;
  annual_gross_income: number;
  debts: DebtResponse[];
  fixed_deposits: FixedDepositResponse[];
}

export interface OnboardingResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
  tax_summary: Record<string, unknown>;
  debt_optimization: Record<string, unknown>;
}

export interface HealthScoreBreakdown {
  savings_rate_score: number;
  emergency_fund_score: number;
  dti_score: number;
  spending_discipline_score: number;
}

export interface HealthScoreResponse {
  user_id: number;
  health_score: number;
  rating: string;
  breakdown: HealthScoreBreakdown;
  metrics: Record<string, unknown>;
}

export interface DebtOptimizationResponse {
  user_id: number;
  strategy: string;
  optimized_order: Array<Record<string, unknown>>;
  total_debt: number;
  total_minimum_payment: number;
}

export interface AutoAffordabilityRequest {
  gross_monthly_income: number;
  vehicle_price: number;
  down_payment: number;
  loan_term_months: number;
  annual_interest_rate: number;
  estimated_monthly_insurance?: number;
  estimated_monthly_maintenance?: number;
}

export interface AutoAffordabilityResponse {
  is_affordable: boolean;
  rules: Record<string, unknown>;
  monthly_payment: number;
  total_monthly_auto_cost: number;
  max_allowed_monthly_auto_cost: number;
  recommendations: string[];
}

/** Wizard-only form shapes (15 architectural capture fields). */

export interface DebtFormEntry {
  name: string;
  principal: number;
  emi: number;
  apr: number;
  termMonths: number;
  remainingBalance: number;
}

export interface FixedDepositFormEntry {
  bankName: string;
  principal: number;
  interestRate: number;
  maturityDate: string;
}

export interface OnboardingFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  annualGrossSalary: number;
  fixedMonthlyRent: number;
  debts: DebtFormEntry[];
  creditCardBalance: number;
  creditCardLimit: number;
  liquidSavings: number;
  fixedDeposits: FixedDepositFormEntry[];
  monthlySip: number;
  mutualFundValuation: number;
  epfBalance: number;
  epfMonthlyContribution: number;
  targetRetirementAge: number;
  expectedMonthlyRetirementExpenses: number;
  ytdSection80C: number;
  ytdSection80D: number;
}

export interface ExtendedProfileSnapshot {
  monthlySip: number;
  mutualFundValuation: number;
  epfBalance: number;
  epfMonthlyContribution: number;
  targetRetirementAge: number;
  expectedMonthlyRetirementExpenses: number;
  ytdSection80C: number;
  ytdSection80D: number;
  creditCardLimit: number;
}

export type ApiError = {
  message: string;
  status: number;
  details?: unknown;
};
