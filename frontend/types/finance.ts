/**
 * Global TypeScript interfaces for OptiWealth.
 * Defines both the frontend representations and API contracts.
 */

export interface Debt {
  debt_id: number;
  name: string;
  debt_type: "home" | "car" | "personal" | "education" | "credit_card";
  outstanding_principal: number;
  monthly_emi: number;
  interest_rate_apr: number;
  months_remaining: number;
  remaining_balance?: number; // Backend compatibility
}

export interface FixedDeposit {
  fd_id: number;
  bank_name: string;
  principal_amount: number;
  interest_rate: number;
  maturity_date: string;
}

export interface TaxAnalysis {
  gross_salary: number;
  new_regime_tax: number;
  old_regime_tax: number;
  savings_delta: number;
  actionable_insight: string;
  new_regime_details: Record<string, any>;
  old_regime_details: Record<string, any>;
}

export interface HealthScoreData {
  overall_score: number;
  rating: string;
  metrics: {
    savings_rate: number;
    emergency_fund_months: number;
    dti_ratio: number;
    spending_discipline: number;
    expense_ratio: number;
  };
  breakdown: {
    savings_rate_score: number;
    emergency_fund_score: number;
    dti_score: number;
    spending_discipline_score: number;
  };
}

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  monthly_income: number;
  monthly_expenses: number;
  emergency_fund_balance: number;
  annual_gross_income: number;
  debts: Debt[];
  fixed_deposits: FixedDeposit[];
}
