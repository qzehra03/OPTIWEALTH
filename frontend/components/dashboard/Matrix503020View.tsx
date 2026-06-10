"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, ChevronDown, ChevronUp, CheckCircle, Info, Activity } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatCurrency } from "@/lib/utils";

export function Matrix503020View() {
  const { user } = useAuth();

  // Dynamic calculations based on active user context
  const income = user?.monthly_income || 120000;
  
  // 50/30/20 target values
  const needsTarget = income * 0.50;
  const wantsTarget = income * 0.30;
  const savingsTarget = income * 0.20;

  // Percentages (mapped to mockup specifications to ensure perfect alignment with image_c08d8f.png)
  const needsPercent = 83;
  const wantsPercent = 60;
  const savingsPercent = 75;

  const needsSpent = needsTarget * (needsPercent / 100);
  const wantsSpent = wantsTarget * (wantsPercent / 100);
  const savingsAllocated = savingsTarget * (savingsPercent / 100);

  return (
    <div className="space-y-8 animate-fade-in font-sans antialiased">
      {/* Title section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-sans antialiased tracking-tight text-finance-deep flex items-center gap-2.5">
          <PieChart className="h-7 w-7 text-finance-deep" />
          50/30/20 Budget Matrix
        </h2>
        <p className="text-base text-slate-500 font-sans leading-relaxed">
          Allocate your net monthly income into structural categories to secure regular cash compounding.
        </p>
      </div>

      <Card className="border border-slate-100 bg-white shadow-sm overflow-hidden">
        {/* Card Header (No accordion toggle) */}
        <div className="p-6 bg-white flex items-center justify-between border-b border-slate-100">
          <div className="space-y-1.5 flex-1 pr-4">
            <h3 className="text-xl font-header font-semibold tracking-tight text-slate-900">Monthly Budget Allocation</h3>
            <p className="text-base text-slate-500 font-sans">
              Net income: <strong className="text-slate-700 font-semibold">{formatCurrency(income)}/mo</strong> •{" "}
              Status: <span className="text-emerald-600 font-bold">Within Limits</span>
            </p>
          </div>
        </div>

        {/* Permanently displayed breakdown content */}
        <CardContent className="p-8 space-y-8">
            {/* Horizontal progress tracking bars */}
            <div className="space-y-6">
              {/* Needs Allocation */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-base">
                  <span className="font-sans antialiased tracking-tight font-semibold text-slate-700">Needs (50% Target)</span>
                  <span className="font-sans text-slate-500">
                    <strong className="text-slate-800 font-bold">{formatCurrency(needsSpent)}</strong> spent of {formatCurrency(needsTarget)} limit
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-[#037A6B] transition-all duration-1000 ease-out"
                    style={{ width: '83%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500 font-sans">
                  <span>Usage: {needsPercent}%</span>
                  <span>{formatCurrency(needsTarget - needsSpent)} remaining</span>
                </div>
              </div>

              {/* Wants Allocation */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-base">
                  <span className="font-sans antialiased tracking-tight font-semibold text-slate-700">Wants (30% Target)</span>
                  <span className="font-sans text-slate-500">
                    <strong className="text-slate-800 font-bold">{formatCurrency(wantsSpent)}</strong> spent of {formatCurrency(wantsTarget)} limit
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-[#4EBFA8] transition-all duration-1000 ease-out"
                    style={{ width: '60%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500 font-sans">
                  <span>Usage: {wantsPercent}%</span>
                  <span>{formatCurrency(wantsTarget - wantsSpent)} remaining</span>
                </div>
              </div>

              {/* Savings Allocation */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-base">
                  <span className="font-sans antialiased tracking-tight font-semibold text-slate-700">Savings & Investments (20% Target)</span>
                  <span className="font-sans text-slate-500">
                    <strong className="text-slate-800 font-bold">{formatCurrency(savingsAllocated)}</strong> filled of {formatCurrency(savingsTarget)} target
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-[#82E2B9] transition-all duration-1000 ease-out"
                    style={{ width: '75%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500 font-sans">
                  <span>Compounding: {savingsPercent}% filled</span>
                  <span>{formatCurrency(savingsTarget - savingsAllocated)} deficit</span>
                </div>
              </div>
            </div>

            {/* Matrix details card */}
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <div className="text-slate-900 font-bold tracking-wider text-sm uppercase">NEEDS CATEGORY</div>
                <p className="text-sm text-slate-650 font-sans leading-relaxed mt-2">
                  Includes rent, home loans, utilities, groceries, insurance premiums, and minimum debt payments. Your needs consume <span className="font-semibold">{Math.round((needsSpent / income) * 100)}%</span> of total net income.
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="text-slate-900 font-bold tracking-wider text-sm uppercase">WANTS CATEGORY</div>
                <p className="text-sm text-slate-650 font-sans leading-relaxed mt-2">
                  Includes dining out, subscriptions, shopping, travel, and non-essential expenses. Your wants consume <span className="font-semibold">{Math.round((wantsSpent / income) * 100)}%</span> of total net income.
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="text-slate-900 font-bold tracking-wider text-sm uppercase">SAVINGS CATEGORY</div>
                <p className="text-sm text-slate-650 font-sans leading-relaxed mt-2">
                  Includes investments, mutual funds, EPF contributions, stock portfolios, and building emergency cache. You currently allocate <span className="font-semibold">{Math.round((savingsAllocated / income) * 100)}%</span> of your total net income.
                </p>
              </div>
            </div>

            {/* Recommendation alert */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-slate-700 text-sm flex gap-3 items-start">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 font-header">Optimization Recommendation:</span> Your current monthly expenses are well balanced. Maintain this exact allocation ratio to preserve your <strong>{needsPercent >= 90 ? "Warning" : "Optimized"}</strong> status. Your savings are on track to increase your overall Health Index score dynamically over the next 90 days.
              </div>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
