"use client";

import React, { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchDebtOptimization, fetchTaxSummary } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  AlertTriangle,
  Loader2,
  Calendar,
  Layers,
  FileText,
  CheckCircle,
  TrendingUp,
  Percent,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import type { DebtOptimizationResponse, UserResponse } from "@/lib/types";

interface StrategyOptimizerProps {
  user: UserResponse;
  defaultTab?: "debts" | "tax";
  hideTabs?: boolean;
}

export function StrategyOptimizer({ user, defaultTab = "debts", hideTabs = false }: StrategyOptimizerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [strategy, setStrategy] = useState<"snowball" | "avalanche">("avalanche");
  const [debtData, setDebtData] = useState<DebtOptimizationResponse | null>(null);
  const [taxData, setTaxData] = useState<any>(null);
  const [debtLoading, setDebtLoading] = useState(false);
  const [taxLoading, setTaxLoading] = useState(false);
  const [extendedProfile, setExtendedProfile] = useState<any>(null);

  // Sync activeTab with defaultTab
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Load extended profile from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("optiwealth_extended_profile");
      if (stored) {
        setExtendedProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Could not load extended profile", e);
    }
  }, []);

  // Fetch Debt Optimization data when strategy or user changes
  useEffect(() => {
    if (!user || user.debts.length === 0) return;
    setDebtLoading(true);
    fetchDebtOptimization(user.id, strategy)
      .then(setDebtData)
      .catch((err) => console.error("Error fetching debts", err))
      .finally(() => setDebtLoading(false));
  }, [user, strategy]);

  // Fetch Tax data when user changes
  useEffect(() => {
    if (!user) return;
    setTaxLoading(true);
    fetchTaxSummary(user.id)
      .then(setTaxData)
      .catch((err) => console.error("Error fetching tax", err))
      .finally(() => setTaxLoading(false));
  }, [user]);

  // Old Regime Deduction Calculations
  const standardDeductionOld = 50000;
  const section80CValue = extendedProfile?.ytdSection80C ?? 0;
  const section80DValue = extendedProfile?.ytdSection80D ?? 0;
  const allowed80C = Math.min(section80CValue, 150000);
  const allowed80D = Math.min(section80DValue, 25000);
  const totalOldDeductions = standardDeductionOld + allowed80C + allowed80D;
  const totalNewDeductions = taxData?.standard_deduction ?? 75000;

  // Render Debt Tab
  const renderDebts = () => {
    if (user.debts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-emerald-500/5 rounded-xl border border-emerald-500/10">
          <CheckCircle className="h-10 w-10 text-emerald-500 mb-2" />
          <h4 className="font-bold text-lg text-emerald-500">You are Debt-Free!</h4>
          <p className="text-xs text-foreground/80 mt-1 max-w-[280px]">
            No outstanding debts found in your profile. Keep up the excellent financial discipline!
          </p>
        </div>
      );
    }

    if (debtLoading && !debtData) {
      return (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-luxe-forest/5 p-4 rounded-xl border border-luxe-copper/15">
          <div className="space-y-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/80">Prioritization Strategy</h4>
            <p className="text-xs text-foreground/80">Toggle payoff models configured dynamically by the engines.</p>
          </div>
          <div className="bg-luxe-forest/60 p-1 rounded-xl inline-flex items-center gap-1 self-start sm:self-center">
            <button
              onClick={() => setStrategy("avalanche")}
              disabled={debtLoading}
              className={strategy === "avalanche"
                ? "bg-luxe-emerald/40 text-foreground font-semibold shadow-sm px-4 py-2 rounded-lg text-base transition-all"
                : "text-foreground/80 hover:text-foreground font-medium px-4 py-2 rounded-lg text-base transition-all"
              }
            >
              Avalanche (High APR)
            </button>
            <button
              onClick={() => setStrategy("snowball")}
              disabled={debtLoading}
              className={strategy === "snowball"
                ? "bg-luxe-emerald/40 text-foreground font-semibold shadow-sm px-4 py-2 rounded-lg text-base transition-all"
                : "text-foreground/80 hover:text-foreground font-medium px-4 py-2 rounded-lg text-base transition-all"
              }
            >
              Snowball (Low Balance)
            </button>
          </div>
        </div>

        {debtData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left side: stats */}
            <div className="space-y-4 md:col-span-1">
              <Card className="border border-luxe-copper/20 shadow-luxe-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground/80 uppercase tracking-wider font-header">
                    Total Debt Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-bold font-header tracking-tight text-foreground">{formatCurrency(debtData.total_debt)}</p>
                </CardContent>
              </Card>

              <Card className="border border-luxe-copper/20 shadow-luxe-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground/80 uppercase tracking-wider font-header">
                    Total Min Monthly Pay
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold font-header tracking-tight text-foreground">{formatCurrency(debtData.total_minimum_payment)}</p>
                </CardContent>
              </Card>

              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-600 text-base flex gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <div>
                  <span className="font-bold font-header">Payoff Recommendation:</span> Under{" "}
                  {strategy === "avalanche" ? "Avalanche" : "Snowball"}, focus all surplus funds on your highest priority
                  debt while keeping minimum payments on the rest.
                </div>
              </div>
            </div>

            {/* Right side: debt list */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-lg font-bold font-header text-foreground">Priority Payoff Order</h4>
              {debtData.optimized_order.map((debt: any) => (
                <div
                  key={debt.id || debt.name}
                  className="p-4 rounded-xl border border-luxe-copper/20 shadow-luxe-sm flex items-center justify-between transition-all hover:bg-luxe-copper/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-luxe-copper/15 text-foreground font-bold font-header tracking-tight text-base">
                      {debt.priority}
                    </span>
                    <div>
                      <h5 className="font-bold text-base font-header text-foreground">{debt.name}</h5>
                      <div className="flex gap-4 mt-1 text-sm text-foreground/80 font-sans">
                        <span>APR: <strong className="text-foreground font-semibold">{debt.interest_rate}%</strong></span>
                        <span>Min Pay: <strong className="text-foreground font-semibold">{formatCurrency(debt.minimum_payment)}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-header tracking-tight text-foreground">{formatCurrency(debt.remaining_balance)}</span>
                    <p className="text-[10px] text-foreground/80 mt-0.5 font-sans">Remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Tax Tab
  const renderTax = () => {
    if (taxLoading && !taxData) {
      return (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      );
    }

    if (!taxData) return null;

    return (
      <div className="space-y-6 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Slabs and Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-luxe-copper/20 bg-card shadow-luxe-sm">
                <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider font-header">Gross Income</span>
                <p className="text-lg font-bold mt-1 font-sans text-foreground">{formatCurrency(taxData.annual_gross_income)}</p>
              </div>
              <div className="p-4 rounded-xl border border-luxe-copper/20 bg-card shadow-luxe-sm">
                <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider font-header">Standard Ded.</span>
                <p className="text-lg font-bold mt-1 font-sans text-foreground">{formatCurrency(taxData.standard_deduction)}</p>
              </div>
              <div className="p-4 rounded-xl border border-luxe-copper/20 bg-card shadow-luxe-sm">
                <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider font-header">Taxable Income</span>
                <p className="text-lg font-bold mt-1 font-sans text-foreground">{formatCurrency(taxData.taxable_income)}</p>
              </div>
              <div className="p-4 rounded-xl border border-luxe-copper/20 bg-card shadow-luxe-sm">
                <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider font-header">Effective Rate</span>
                <p className="text-lg font-bold mt-1 text-emerald-600 font-sans">{taxData.effective_tax_rate_percent}%</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold font-header text-foreground">New Regime Slab Breakdown (FY 2026-27)</h4>
              <div className="border border-luxe-copper/20 bg-card rounded-xl overflow-hidden shadow-luxe-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-luxe-copper/20 bg-luxe-forest/10 font-bold text-foreground font-header">
                      <th className="p-3">Slab Range</th>
                      <th className="p-3 text-center">Rate</th>
                      <th className="p-3 text-right">Taxable Amount</th>
                      <th className="p-3 text-right">Slab Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxData.slab_breakdown.map((slab: any, idx: number) => (
                      <tr key={idx} className="border-b border-luxe-copper/20 last:border-0 hover:bg-luxe-forest/10 font-sans">
                        <td className="p-3 text-foreground/80">
                          {slab.upper
                            ? `₹${(slab.lower / 100000).toFixed(1)}L - ₹${(slab.upper / 100000).toFixed(1)}L`
                            : `Above ₹${(slab.lower / 100000).toFixed(1)}L`}
                        </td>
                        <td className="p-3 text-center font-bold text-foreground">{slab.rate_percent}%</td>
                        <td className="p-3 text-right text-foreground/80">{formatCurrency(slab.taxable_amount)}</td>
                        <td className="p-3 text-right font-semibold text-foreground">{formatCurrency(slab.tax)}</td>
                      </tr>
                    ))}
                    <tr className="bg-luxe-forest/40 font-bold text-sm border-t border-luxe-copper/20">
                      <td className="p-3 text-foreground font-header" colSpan={3}>Total Net Tax (Before Health & Edu Cess)</td>
                      <td className="p-3 text-right text-foreground font-sans">{formatCurrency(taxData.final_tax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Column 3: Comparison & Intelligence */}
          <div className="space-y-6">
            <h4 className="text-sm font-semibold font-header text-foreground">Regime Deductions Simulator</h4>
            <div className="space-y-4">
              {/* New Regime Card */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider font-header">New Regime (Active)</span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/30">
                      Standard Default
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold font-header tracking-tight text-foreground">{formatCurrency(totalNewDeductions)}</div>
                  <p className="text-[10px] text-foreground/80 mt-1">Flat deductions without declaring investments.</p>
                </div>
                <div className="border-t border-luxe-copper/30/10 pt-3 mt-4 text-xs">
                  <div className="flex justify-between text-foreground/80">
                    <span>Standard Deduction</span>
                    <span>{formatCurrency(totalNewDeductions)}</span>
                  </div>
                </div>
              </div>

              {/* Old Regime Card */}
              <div className="p-4 rounded-xl border border-luxe-copper/20 bg-card shadow-luxe-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider font-header">Old Regime (Simulated)</span>
                    <Badge variant="outline" className="border-luxe-copper/30/30 text-foreground/80">
                      Declaration Required
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold font-header tracking-tight text-foreground">{formatCurrency(totalOldDeductions)}</div>
                  <p className="text-[10px] text-foreground/80 mt-1 font-sans">Requires proof submission for Section 80C & 80D.</p>
                </div>
                <div className="border-t border-luxe-copper/20 pt-3 mt-4 text-xs space-y-1">
                  <div className="flex justify-between text-foreground/80">
                    <span>Standard Deduction</span>
                    <span>{formatCurrency(standardDeductionOld)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/80">
                    <span>Section 80C Investments</span>
                    <span>{formatCurrency(allowed80C)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/80">
                    <span>Section 80D Health Ins.</span>
                    <span>{formatCurrency(allowed80D)}</span>
                  </div>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="p-4 rounded-xl border border-luxe-copper/20 bg-card shadow-luxe-sm text-xs space-y-2">
                <span className="font-bold flex items-center gap-1.5 text-foreground font-header">
                  <TrendingUp className="h-4 w-4" /> Recommendation
                </span>
                <p className="text-foreground/80 leading-relaxed">
                  {totalOldDeductions > totalNewDeductions
                    ? `Your simulated old regime deductions (₹${(totalOldDeductions / 100000).toFixed(2)}L) are higher than the new regime deduction (₹${(totalNewDeductions / 100000).toFixed(2)}L). However, due to the significantly lower tax rates of the New Regime, it is likely still more beneficial unless gross income is high and total old deductions exceed ₹3.75 Lakhs.`
                    : "The New Regime is highly recommended. Your current declared investments do not exceed the ₹75,000 threshold required to make the Old Regime competitive."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (hideTabs) {
    return (
      <div 
        id={activeTab === "tax" ? "tax-optimization-card" : "debt-optimization-card"}
        className="space-y-4 font-sans animate-fade-in"
      >
        <div className="pb-2 border-b border-luxe-copper/20 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-header tracking-tight text-foreground flex items-center gap-2">
              {activeTab === "debts" ? (
                <>
                  <Layers className="h-6 w-6 text-foreground" />
                  Debt Payoff Optimizer
                </>
              ) : (
                <>
                  <FileText className="h-6 w-6 text-foreground" />
                  Tax Slabs & Regimes
                </>
              )}
            </h2>
            <p className="text-sm text-foreground/80 mt-1">
              {activeTab === "debts" 
                ? "Compare Avalanche vs. Snowball payoff sequences computed live by the core optimization engine."
                : "Review direct FY 2026-27 slab rates and compare Old vs. New taxation regimes."}
            </p>
          </div>
        </div>
        <div className="pt-4">
          {activeTab === "debts" ? renderDebts() : renderTax()}
        </div>
      </div>
    );
  }

  return (
    <Card className="border border-luxe-copper/20 shadow-luxe-sm font-sans">
      <CardHeader className="pb-4">
        <Tabs.Root value={activeTab} onValueChange={(val) => setActiveTab(val as "debts" | "tax")}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-bold font-header flex items-center gap-2 text-foreground">
              {activeTab === "debts" ? (
                <>
                  <Layers className="h-5 w-5 text-foreground" />
                  Debt Payoff & Strategy
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 text-foreground" />
                  Tax Optimization Simulator
                </>
              )}
            </CardTitle>
            <Tabs.List className="flex gap-2 bg-luxe-forest/50 p-1 rounded-lg border border-luxe-copper/20 self-start">
              <Tabs.Trigger
                value="debts"
                className="px-3 py-1.5 text-sm font-playful font-medium tracking-wide text-foreground/80 rounded-md data-[state=active]:bg-luxe-emerald/40 data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Debt Payoffs
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tax"
                className="px-3 py-1.5 text-sm font-playful font-medium tracking-wide text-foreground/80 rounded-md data-[state=active]:bg-luxe-emerald/40 data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Tax Slabs
              </Tabs.Trigger>
            </Tabs.List>
          </div>

          <div className="mt-4">
            <Tabs.Content value="debts" className="outline-none">
              <div className="pt-2">{renderDebts()}</div>
            </Tabs.Content>
            <Tabs.Content value="tax" className="outline-none">
              <div className="pt-2">{renderTax()}</div>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </CardHeader>
    </Card>
  );
}
