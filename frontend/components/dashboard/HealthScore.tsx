"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Percent, AlertCircle } from "lucide-react";
import type { HealthScoreResponse } from "@/lib/types";
import { Tooltip } from "@/components/ui/Tooltip";

interface HealthScoreProps {
  data: HealthScoreResponse;
}

export function HealthScore({ data }: HealthScoreProps) {
  const { health_score, rating, breakdown, metrics } = data;

  // Gauge configurations
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (health_score / 100) * circumference;

  // Determine colors based on overall score
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-500 stroke-emerald-500";
    if (score >= 45) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getStatusBadge = (score: number) => {
    if (score >= 75) {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30">
          Optimized
        </Badge>
      );
    }
    if (score >= 45) {
      return (
        <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/30">
          Warning
        </Badge>
      );
    }
    return (
      <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/30">
        Critical Hazard Risk
      </Badge>
    );
  };

  const getMetricColorClass = (score: number) => {
    if (score >= 75) return "border-emerald-500/20 bg-emerald-500/5 text-emerald-500";
    if (score >= 45) return "border-amber-500/20 bg-amber-500/5 text-amber-500";
    return "border-rose-500/20 bg-rose-500/5 text-rose-500";
  };

  // Safe type-casting helpers for metrics
  const savingsRate = Number(metrics.savings_rate_percent ?? 0);
  const emergencyMonths = Number(metrics.emergency_fund_months ?? 0);
  const dtiRatio = Number(metrics.dti_percent ?? 0);
  const expenseRatio = Number(metrics.expense_ratio_percent ?? 0);

  return (
    <Card className="border border-luxe-copper/30 dark:border-luxe-copper/20 bg-card shadow-sm font-sans text-card-foreground">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-header font-semibold tracking-tight text-foreground">Financial Health Index</CardTitle>
          {getStatusBadge(health_score)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8 mt-4">
          {/* Top Centered circular health gauge */}
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-muted/40 border border-luxe-copper/30 dark:border-luxe-copper/20 shadow-sm max-w-sm mx-auto w-full">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  className="stroke-muted"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  className={`transition-all duration-1000 ease-in-out ${getScoreColor(health_score)}`}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold tracking-tight font-sans text-foreground">{Math.round(health_score)}</span>
                <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider font-header mt-1">
                  {rating}
                </span>
              </div>
            </div>
            <p className="text-sm text-foreground/80 text-center mt-4 max-w-[260px] font-sans leading-relaxed">
              Calculated dynamically by the OptiWealth backend analysis engines.
            </p>
          </div>

          {/* Bottom 1-column vertical list */}
          <div className="grid grid-cols-1 gap-4 w-full mt-4">
            {/* Savings Rate Card */}
            <div id="savings-rate-card" className="p-4 rounded-xl border border-luxe-copper/30 dark:border-luxe-copper/20 bg-card shadow-sm flex flex-col justify-between text-card-foreground">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold tracking-wider text-foreground/80 uppercase font-header">SAVINGS RATE</span>
                    <Tooltip 
                      title="Portfolio Yield / ROI" 
                      definition="The percentage score that shows how much profit or loss your investments made over a specific period." 
                      calculation="We divide your net profit by the original cost of your investment, multiplying it by 100 to show a clear percentage performance card."
                    />
                  </div>
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-sans text-foreground whitespace-nowrap">{savingsRate}%</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-bold font-sans ${getMetricColorClass(breakdown.savings_rate_score)}`}>
                    Score: {Math.round(breakdown.savings_rate_score)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-foreground/80 mt-2 font-sans leading-relaxed">
                Target: 50% or more. Currently saving {savingsRate}% of your gross monthly income.
              </p>
            </div>

            {/* Emergency Fund Card */}
            <div className="p-4 rounded-xl border border-luxe-copper/30 dark:border-luxe-copper/20 bg-card shadow-sm flex flex-col justify-between text-card-foreground">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold tracking-wider text-foreground/80 uppercase font-header">EMERGENCY BUFFER</span>
                    <Tooltip 
                      title="Liquidity" 
                      definition="How quickly and easily you can convert an asset back into spendable cash without losing its value." 
                      calculation="The app categorizes your wealth into immediate funds (like savings accounts) and locked funds (like long-term deposits), showing you exactly how much cash is available for instant withdrawal."
                    />
                  </div>
                  <Shield className="h-5 w-5 text-finance-medium" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-sans text-foreground whitespace-nowrap">{emergencyMonths} mo</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-bold font-sans ${getMetricColorClass(breakdown.emergency_fund_score)}`}>
                    Score: {Math.round(breakdown.emergency_fund_score)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-foreground/80 mt-2 font-sans leading-relaxed">
                Target: 6 months of expenses. You have {emergencyMonths} months covered.
              </p>
            </div>

            {/* DTI Card */}
            <div id="debt-income-card" className="p-4 rounded-xl border border-luxe-copper/30 dark:border-luxe-copper/20 bg-card shadow-sm flex flex-col justify-between text-card-foreground">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold tracking-wider text-foreground/80 uppercase font-header">DEBT-TO-INCOME</span>
                    <Tooltip 
                      title="Debt-To-Income" 
                      definition="The portion of your gross monthly income that goes toward paying off debts." 
                      calculation="Total Monthly Debt Payments divided by Gross Monthly Income."
                    />
                  </div>
                  <Percent className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-sans text-foreground whitespace-nowrap">{dtiRatio}%</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-bold font-sans ${getMetricColorClass(breakdown.dti_score)}`}>
                    Score: {Math.round(breakdown.dti_score)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-foreground/80 mt-2 font-sans leading-relaxed">
                Target: 20% or less. High DTI reduces liquidity and increases financial risk.
              </p>
            </div>

            {/* Spending Discipline Card */}
            <div id="expense-ratio-card" className="p-4 rounded-xl border border-luxe-copper/30 dark:border-luxe-copper/20 bg-card shadow-sm flex flex-col justify-between text-card-foreground">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold tracking-wider text-foreground/80 uppercase font-header">EXPENSE RATIO</span>
                    <Tooltip 
                      title="Expense Ratio" 
                      definition="The annual management fee charged by an investment fund to cover its operational costs." 
                      calculation="It is expressed as a tiny percentage (e.g., 0.5%). We show you exactly how much money is deducted from your investment returns to pay the fund managers."
                    />
                  </div>
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-sans text-foreground whitespace-nowrap">{expenseRatio}%</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-bold font-sans ${getMetricColorClass(breakdown.spending_discipline_score)}`}>
                    Score: {Math.round(breakdown.spending_discipline_score)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-foreground/80 mt-2 font-sans leading-relaxed">
                Target: 50% or less. Your expenses consume {expenseRatio}% of your monthly earnings.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
