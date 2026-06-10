"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Percent, AlertCircle } from "lucide-react";
import type { HealthScoreResponse } from "@/lib/types";

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
    <Card className="border border-slate-100 bg-white shadow-sm font-sans">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-header font-semibold tracking-tight text-slate-900">Financial Health Index</CardTitle>
          {getStatusBadge(health_score)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8 mt-4">
          {/* Top Centered circular health gauge */}
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-50/50 border border-slate-100 shadow-sm max-w-sm mx-auto w-full">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  className="stroke-slate-200/30"
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
                <span className="text-4xl font-extrabold tracking-tight font-sans text-slate-900">{Math.round(health_score)}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-header mt-1">
                  {rating}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 text-center mt-4 max-w-[260px] font-sans leading-relaxed">
              Calculated dynamically by the OptiWealth backend analysis engines.
            </p>
          </div>

          {/* Bottom 1-column vertical list */}
          <div className="grid grid-cols-1 gap-4 w-full mt-4">
            {/* Savings Rate Card */}
            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase font-header">SAVINGS RATE</span>
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-sans text-slate-900 whitespace-nowrap">{savingsRate}%</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-bold font-sans ${getMetricColorClass(breakdown.savings_rate_score)}`}>
                    Score: {Math.round(breakdown.savings_rate_score)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-sans leading-relaxed">
                Target: 50% or more. Currently saving {savingsRate}% of your gross monthly income.
              </p>
            </div>

            {/* Emergency Fund Card */}
            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase font-header">EMERGENCY BUFFER</span>
                  <Shield className="h-5 w-5 text-finance-medium" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-sans text-slate-900 whitespace-nowrap">{emergencyMonths} mo</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-bold font-sans ${getMetricColorClass(breakdown.emergency_fund_score)}`}>
                    Score: {Math.round(breakdown.emergency_fund_score)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-sans leading-relaxed">
                Target: 6 months of expenses. You have {emergencyMonths} months covered.
              </p>
            </div>

            {/* DTI Card */}
            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold tracking-wider text-slate-450 uppercase font-header">DEBT-TO-INCOME</span>
                  <Percent className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-sans text-slate-900 whitespace-nowrap">{dtiRatio}%</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-bold font-sans ${getMetricColorClass(breakdown.dti_score)}`}>
                    Score: {Math.round(breakdown.dti_score)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-sans leading-relaxed">
                Target: 20% or less. High DTI reduces liquidity and increases financial risk.
              </p>
            </div>

            {/* Spending Discipline Card */}
            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase font-header">EXPENSE RATIO</span>
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-sans text-slate-900 whitespace-nowrap">{expenseRatio}%</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-bold font-sans ${getMetricColorClass(breakdown.spending_discipline_score)}`}>
                    Score: {Math.round(breakdown.spending_discipline_score)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-sans leading-relaxed">
                Target: 50% or less. Your expenses consume {expenseRatio}% of your monthly earnings.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}