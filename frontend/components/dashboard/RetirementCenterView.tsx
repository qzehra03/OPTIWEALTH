"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, HelpCircle, ArrowRight, CheckCircle, Info, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatCurrency } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

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
        <h2 className="text-3xl font-header font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Coins className="h-7 w-7 text-foreground" />
          Retirement Freedom Center
        </h2>
        <p className="text-base text-foreground/80 font-sans leading-relaxed">
          Plan your financial independence based on the empirical <strong className="font-semibold text-foreground">4% Safe Withdrawal Rule</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Calculations & Target Goal */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          <Card id="retirement-calc-card" className="border border-luxe-copper/20 shadow-luxe-sm font-sans">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-header font-semibold tracking-tight text-foreground">4% Rule Calculator</CardTitle>
              <CardDescription className="text-base text-foreground/80 font-sans leading-relaxed">
                Determine the absolute portfolio size required to live indefinitely off investment dividends.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80 uppercase tracking-wider font-header">Desired Annual Retirement Income (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-foreground/80">₹</span>
                  <input
                    type="number"
                    value={annualIncomeInput}
                    onChange={(e) => setAnnualIncomeInput(e.target.value)}
                    className="w-full text-lg font-bold font-sans bg-luxe-forest/50 border border-luxe-copper/30/60 rounded-xl py-3 pl-8 pr-4 outline-none focus:border-finance-medium text-foreground"
                    placeholder="e.g. 600000"
                  />
                </div>
                <p className="text-sm text-foreground/80 font-sans">
                  Equivalent to <span className="font-semibold">{formatCurrency(desiredIncome / 12)}/month</span> in passive withdrawal.
                </p>
              </div>

              {/* Target Portfolio Metric Box */}
              <div className="p-6 rounded-2xl border border-finance-mint bg-luxe-copper/15/20 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-foreground uppercase tracking-wider font-header">Inverse Freedom Number (Portfolio Goal)</span>
                    <Tooltip 
                      title="Compound Interest" 
                      definition="Earning returns not just on your original savings, but also on the interest you have already accumulated over time." 
                      calculation="We use mathematical growth formulas to project your future balance, reinvesting your earned profits back into the principal amount so your wealth accelerates."
                    />
                    <Tooltip 
                      title="Inflation Adjustment" 
                      definition="Accounting for the steady rise in prices over time, which causes your money to lose its purchasing power." 
                      calculation="We subtract the current yearly inflation rate from your investment growth rate to show you the real value and actual buying power of your future wealth."
                    />
                  </div>
                  <h3 className="text-4xl font-bold font-header tracking-tight text-foreground mt-2">
                    {formatCurrency(targetPortfolio)}
                  </h3>
                </div>
                <p className="text-base text-foreground/80 font-sans leading-relaxed">
                  Formula: Annual Target ({formatCurrency(desiredIncome)}) × 25 = Required Portfolio Nest Egg.
                </p>
              </div>

              {/* Progress Bar Visualizer */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-base">
                  <span className="font-bold text-foreground font-header">Nest Egg Progress Tracker</span>
                  <span className="font-bold text-foreground font-sans">{progressPercent}% Achieved</span>
                </div>
                <div className="h-5 w-full bg-luxe-forest/60 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-luxe-copper rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-base text-foreground/80 font-sans">
                  <span>Current: {formatCurrency(currentSavings)}</span>
                  <span>Target: {formatCurrency(targetPortfolio)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Portfolio Breakdowns & Explainer */}
        <div className="col-span-1 lg:col-span-5 space-y-6">
          {/* Core educational info box */}
          <Card className="border border-luxe-copper/20 bg-luxe-forest/50/30 font-sans">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-header font-semibold tracking-tight text-foreground flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-foreground/80" />
                The Safe Withdrawal Rule
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80 leading-relaxed font-sans space-y-3">
              <p>
                First proven in the landmark <strong>Trinity Study</strong>, the 4% rule states that an investor can withdraw 4% of their initial portfolio balance in the first year of retirement, adjusting subsequent years for inflation, with an extremely high probability of survival over 30 years.
              </p>
              <p>
                By dividing your desired income by 4% (which is mathematically identical to multiplying your annual target expense by <strong>25</strong>), you determine the threshold where your portfolio will compound faster than you withdraw.
              </p>
            </CardContent>
          </Card>

          {/* Current Assets Checklist */}
          <Card id="retirement-portfolio-card" className="border border-luxe-copper/20 shadow-luxe-sm font-sans">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-header font-semibold tracking-tight text-foreground">Your Retirement Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {/* Emergency fund */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-luxe-copper/20 bg-luxe-forest/40">
                  <span className="text-sm font-semibold text-foreground/80 font-header">Emergency Savings Cache</span>
                  <span className="text-base font-bold font-sans text-foreground">{formatCurrency(emergencyBalance)}</span>
                </div>

                {/* Fixed Deposits */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-luxe-copper/20 bg-luxe-forest/40">
                  <span className="text-sm font-semibold text-foreground/80 font-header">Fixed Deposits Principals</span>
                  <span className="text-base font-bold font-sans text-foreground">{formatCurrency(fdBalance)}</span>
                </div>

                {/* Mutual Funds */}
                {mfBalance > 0 && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-luxe-copper/20 bg-luxe-forest/40">
                    <span className="text-sm font-semibold text-foreground/80 font-header">Mutual Funds Valuation</span>
                    <span className="text-base font-bold font-sans text-foreground">{formatCurrency(mfBalance)}</span>
                  </div>
                )}

                {epfBalance > 0 && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-luxe-copper/20 bg-luxe-forest/40">
                    <span className="text-sm font-semibold text-foreground/80 font-header">EPF Pension Balance</span>
                    <span className="text-base font-bold font-sans text-foreground">{formatCurrency(epfBalance)}</span>
                  </div>
                )}
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between border-t border-luxe-copper/20 pt-4 px-1 text-base">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground font-header">Total Accumulated Savings</span>
                  <Tooltip 
                    title="Asset Value" 
                    definition="The total market value of all your money and financial holdings combined." 
                    calculation="We add up the exact current cash value of your bank balances, stock investments, mutual funds, and any other assets tracked in the app."
                  />
                  <Tooltip 
                    title="Diversification" 
                    definition="Spreading your investment money across many different types of financial assets instead of putting everything into one single place." 
                    calculation="We measure the percentage distribution of your funds across various sectors (like equity, fixed deposits, or gold) to ensure a drop in one asset won't severely impact your overall balance."
                  />
                </div>
                <span className="text-2xl font-bold font-sans text-foreground">{formatCurrency(currentSavings)}</span>
              </div>

              {remainingDeficit > 0 ? (
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-50/50 text-amber-700 text-sm space-y-1 mt-2 font-sans leading-relaxed">
                  <div className="font-bold font-header flex items-center gap-1.5 text-foreground">
                    <TrendingUp className="h-4 w-4 text-amber-600" /> Nest Egg Deficit
                  </div>
                  You require <strong className="text-foreground">{formatCurrency(remainingDeficit)}</strong> more in yield-bearing assets to attain absolute financial security under this model.
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 text-emerald-800 text-sm space-y-1 mt-2 font-sans leading-relaxed">
                  <div className="font-bold font-header flex items-center gap-1.5 text-foreground">
                    <CheckCircle className="h-4 w-4 text-emerald-600" /> Freedom Attained!
                  </div>
                  Congratulations! Your current savings exceed your computed Inverse Freedom Number target. You are ready for safe withdrawal.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
