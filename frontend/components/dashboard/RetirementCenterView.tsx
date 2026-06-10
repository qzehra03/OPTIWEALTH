"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, HelpCircle, ArrowRight, CheckCircle, Info, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatCurrency } from "@/lib/utils";

export function RetirementCenterView() {
  const { user } = useAuth();
  const [annualIncomeInput, setAnnualIncomeInput] = useState("600000");
  const [extendedProfile, setExtendedProfile] = useState<any>(null);

  // Load extended onboarding profile details from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("optiwealth_extended_profile");
      if (stored) {
        setExtendedProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Could not load extended profile snapshot", e);
    }
  }, []);

  // Calculate current retirement assets
  const emergencyBalance = user?.emergency_fund_balance || 0;
  const fdBalance = user?.fixed_deposits?.reduce((sum, fd) => sum + fd.principal, 0) || 0;
  const mfBalance = Number(extendedProfile?.mutualFundValuation ?? 0);
  const epfBalance = Number(extendedProfile?.epfBalance ?? 0);
  
  const currentSavings = emergencyBalance + fdBalance + mfBalance + epfBalance;

  // Desired annual retirement income
  const desiredIncome = parseFloat(annualIncomeInput) || 0;

  // Inverse Freedom Number (Annual Income * 25)
  const targetPortfolio = desiredIncome * 25;

  // Progress percentage
  const progressPercent = targetPortfolio > 0 
    ? Math.min(100, Math.round((currentSavings / targetPortfolio) * 100))
    : 0;

  const remainingDeficit = Math.max(0, targetPortfolio - currentSavings);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Title section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-header font-bold tracking-tight text-finance-deep flex items-center gap-2.5">
          <Coins className="h-7 w-7 text-finance-deep" />
          Retirement Freedom Center
        </h2>
        <p className="text-base text-slate-500 font-sans leading-relaxed">
          Plan your financial independence based on the empirical <strong className="font-semibold text-[#037A6B]">4% Safe Withdrawal Rule</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Calculations & Target Goal */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          <Card className="border border-slate-100 bg-white shadow-sm font-sans">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-header font-semibold tracking-tight text-slate-900">4% Rule Calculator</CardTitle>
              <CardDescription className="text-base text-slate-500 font-sans leading-relaxed">
                Determine the absolute portfolio size required to live indefinitely off investment dividends.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider font-header">Desired Annual Retirement Income (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={annualIncomeInput}
                    onChange={(e) => setAnnualIncomeInput(e.target.value)}
                    className="w-full text-lg font-bold font-sans bg-slate-50 border border-slate-200/60 rounded-xl py-3 pl-8 pr-4 outline-none focus:border-finance-medium text-slate-700"
                    placeholder="e.g. 600000"
                  />
                </div>
                <p className="text-sm text-slate-500 font-sans">
                  Equivalent to <span className="font-semibold">{formatCurrency(desiredIncome / 12)}/month</span> in passive withdrawal.
                </p>
              </div>

              {/* Target Portfolio Metric Box */}
              <div className="p-6 rounded-2xl border border-finance-mint bg-finance-mint/20 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-sm font-bold text-finance-deep uppercase tracking-wider font-header">Inverse Freedom Number (Portfolio Goal)</span>
                  <h3 className="text-4xl font-extrabold font-sans text-finance-deep mt-2">
                    {formatCurrency(targetPortfolio)}
                  </h3>
                </div>
                <p className="text-base text-finance-deep/80 font-sans leading-relaxed">
                  Formula: Annual Target ({formatCurrency(desiredIncome)}) × 25 = Required Portfolio Nest Egg.
                </p>
              </div>

              {/* Progress Bar Visualizer */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-base">
                  <span className="font-bold text-slate-700 font-header">Nest Egg Progress Tracker</span>
                  <span className="font-bold text-finance-deep font-sans">{progressPercent}% Achieved</span>
                </div>
                <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-[#037A6B] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-base text-slate-500 font-sans">
                  <span>Current: {formatCurrency(currentSavings)}</span>
                  <span>Target: {formatCurrency(targetPortfolio)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Portfolio Breakdowns & Explainer */}
        <div className="col-span-1 lg:col-span-5 space-y-6">
          {/* Current Assets Checklist */}
          <Card className="border border-slate-100 bg-white shadow-sm font-sans">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-header font-semibold tracking-tight text-slate-900">Your Retirement Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {/* Emergency fund */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <span className="text-sm font-semibold text-slate-600 font-header">Emergency Savings Cache</span>
                  <span className="text-base font-bold font-sans text-slate-800">{formatCurrency(emergencyBalance)}</span>
                </div>

                {/* Fixed Deposits */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <span className="text-sm font-semibold text-slate-600 font-header">Fixed Deposits Principals</span>
                  <span className="text-base font-bold font-sans text-slate-800">{formatCurrency(fdBalance)}</span>
                </div>

                {/* Mutual Funds */}
                {mfBalance > 0 && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <span className="text-sm font-semibold text-slate-600 font-header">Mutual Funds Valuation</span>
                    <span className="text-base font-bold font-sans text-slate-800">{formatCurrency(mfBalance)}</span>
                  </div>
                )}

                {epfBalance > 0 && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <span className="text-sm font-semibold text-slate-600 font-header">EPF Pension Balance</span>
                    <span className="text-base font-bold font-sans text-slate-800">{formatCurrency(epfBalance)}</span>
                  </div>
                )}
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 px-1 text-base">
                <span className="font-bold text-slate-850 font-header">Total Accumulated Savings</span>
                <span className="text-2xl font-bold font-sans text-finance-deep">{formatCurrency(currentSavings)}</span>
              </div>

              {remainingDeficit > 0 ? (
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-50/50 text-amber-700 text-sm space-y-1 mt-2 font-sans leading-relaxed">
                  <div className="font-bold font-header flex items-center gap-1.5 text-slate-800">
                    <TrendingUp className="h-4 w-4 text-amber-600" /> Nest Egg Deficit
                  </div>
                  You require <strong className="text-slate-800">{formatCurrency(remainingDeficit)}</strong> more in yield-bearing assets to attain absolute financial security under this model.
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 text-emerald-800 text-sm space-y-1 mt-2 font-sans leading-relaxed">
                  <div className="font-bold font-header flex items-center gap-1.5 text-slate-800">
                    <CheckCircle className="h-4 w-4 text-emerald-600" /> Freedom Attained!
                  </div>
                  Congratulations! Your current savings exceed your computed Inverse Freedom Number target. You are ready for safe withdrawal.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Core educational info box */}
          <Card className="border border-slate-100 bg-slate-50/30 font-sans">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-header font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-slate-500" />
                The Safe Withdrawal Rule
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 leading-relaxed font-sans space-y-3">
              <p>
                First proven in the landmark <strong>Trinity Study</strong>, the 4% rule states that an investor can withdraw 4% of their initial portfolio balance in the first year of retirement, adjusting subsequent years for inflation, with an extremely high probability of survival over 30 years.
              </p>
              <p>
                By dividing your desired income by 4% (which is mathematically identical to multiplying your annual target expense by <strong>25</strong>), you determine the threshold where your portfolio will compound faster than you withdraw.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
