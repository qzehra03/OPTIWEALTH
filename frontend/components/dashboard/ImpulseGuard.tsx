"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { evaluateAutoAffordability } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Car,
  AlertTriangle,
  Loader2,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import type { UserResponse, AutoAffordabilityResponse } from "@/lib/types";

interface CoolingItem {
  id: string;
  name: string;
  price: number;
  addedDate: string; // ISO string
}

interface ImpulseGuardProps {
  user: UserResponse;
  mode?: "cooling" | "car";
}

export function ImpulseGuard({ user, mode }: ImpulseGuardProps) {
  // Cooling off state
  const [items, setItems] = useState<CoolingItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [simulateDays, setSimulateDays] = useState("0"); // Simulate adding in the past

  // Auto calculator state
  const [vehiclePrice, setVehiclePrice] = useState("1200000");
  const [downPayment, setDownPayment] = useState("250000");
  const [interestRate, setInterestRate] = useState("8.5");
  const [termMonths, setTermMonths] = useState("48");
  const [insurance, setInsurance] = useState("4000");
  const [maintenance, setMaintenance] = useState("2000");
  
  const [calcResult, setCalcResult] = useState<AutoAffordabilityResponse | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);

  // Initialize demo cooling items
  useEffect(() => {
    const stored = localStorage.getItem("optiwealth_cooling_items");
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      const today = new Date();
      
      const demoItems: CoolingItem[] = [
        {
          id: "1",
          name: "Apple MacBook Pro 16-inch",
          price: 249900,
          addedDate: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
        },
        {
          id: "2",
          name: "Sony WH-1000XM5 Headphones",
          price: 29900,
          addedDate: new Date(today.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString(), // 32 days ago (cooling period completed)
        },
      ];
      setItems(demoItems);
      localStorage.setItem("optiwealth_cooling_items", JSON.stringify(demoItems));
    }
  }, []);

  // Save cooling items
  const saveItems = (newItems: CoolingItem[]) => {
    setItems(newItems);
    localStorage.setItem("optiwealth_cooling_items", JSON.stringify(newItems));
  };

  // Add Cooling Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const today = new Date();
    const daysOffset = parseInt(simulateDays) || 0;
    const addedDate = new Date(today.getTime() - daysOffset * 24 * 60 * 60 * 1000).toISOString();

    const newItem: CoolingItem = {
      id: Date.now().toString(),
      name: newItemName,
      price: priceNum,
      addedDate,
    };

    const updated = [newItem, ...items];
    saveItems(updated);
    setNewItemName("");
    setNewItemPrice("");
    setSimulateDays("0");
  };

  // Delete Cooling Item
  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    saveItems(updated);
  };

  // Evaluate Auto Affordability
  const handleEvaluateAuto = async () => {
    setCalcLoading(true);
    setCalcError(null);

    const price = parseFloat(vehiclePrice);
    const down = parseFloat(downPayment);
    const rate = parseFloat(interestRate);
    const term = parseInt(termMonths);
    const ins = parseFloat(insurance) || 0;
    const maint = parseFloat(maintenance) || 0;

    if (isNaN(price) || isNaN(down) || isNaN(rate) || isNaN(term)) {
      setCalcError("Please enter valid numeric parameters.");
      setCalcLoading(false);
      return;
    }

    if (down > price) {
      setCalcError("Down payment cannot exceed vehicle price.");
      setCalcLoading(false);
      return;
    }

    try {
      const result = await evaluateAutoAffordability({
        gross_monthly_income: user.monthly_income,
        vehicle_price: price,
        down_payment: down,
        loan_term_months: term,
        annual_interest_rate: rate,
        estimated_monthly_insurance: ins,
        estimated_monthly_maintenance: maint,
      });
      setCalcResult(result);
    } catch (err) {
      console.error(err);
      setCalcError("Failed to calculate vehicle affordability from backend.");
    } finally {
      setCalcLoading(false);
    }
  };

  // Trigger evaluation on mount/user change
  useEffect(() => {
    if (user) {
      handleEvaluateAuto();
    }
  }, [user]);

  // Helper to calculate days remaining
  const getDaysRemaining = (addedDateStr: string) => {
    const addedDate = new Date(addedDateStr);
    const today = new Date();
    const diffTime = today.getTime() - addedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - diffDays);
  };

  if (mode === "cooling") {
    return (
      <div className="w-full font-sans space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
          {/* Left Column: Logger Form */}
          <div className="bg-luxe-emerald/40 border border-luxe-copper/20 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-luxe-bronze" />
              <h3 className="text-xl font-header font-semibold text-luxe-ivory">Impulse Buy Cooling Guard</h3>
            </div>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              Enforce a 30-day delay on discretionary spend items to curb emotional purchasing patterns. Log details of the desired item to start the cooling-off period.
            </p>
            <form onSubmit={handleAddItem} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase font-header">Item Name</label>
                <input
                  type="text"
                  placeholder="Item Name (e.g. iPad Pro)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase font-header">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase font-header">Simulate Days Ago</label>
                  <input
                    type="number"
                    placeholder="Simulate days ago"
                    value={simulateDays}
                    onChange={(e) => setSimulateDays(e.target.value)}
                    className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full font-bold text-sm h-10 flex gap-1 items-center justify-center bg-finance-deep text-white hover:bg-finance-deep/90 border-transparent mt-2">
                <Plus className="h-4 w-4" /> Add Item to Queue
              </Button>
            </form>
          </div>

          {/* Right Column: Cooling Queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-header font-semibold text-luxe-ivory">Cooling Queue Log</h3>
              <Badge variant="outline" className="border-luxe-copper/30 text-muted-foreground font-sans">
                {items.length} {items.length === 1 ? "Item" : "Items"} Active
              </Badge>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12 bg-luxe-emerald/40 border border-luxe-copper/20 rounded-xl shadow-sm">
                  Your cooling queue is empty. Good job staying mindful of discretionary spends!
                </p>
              ) : (
                items.map((item) => {
                  const daysLeft = getDaysRemaining(item.addedDate);
                  const isReady = daysLeft === 0;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-luxe-copper/20 shadow-luxe-sm flex items-center justify-between transition-all hover:bg-luxe-forest/40"
                    >
                      <div className="space-y-1">
                        <h5 className="font-bold text-base font-header text-luxe-ivory">{item.name}</h5>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-luxe-bronze font-sans">{formatCurrency(item.price)}</span>
                          <span className="text-xs text-muted-foreground font-sans">• Added {new Date(item.addedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isReady ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30 flex gap-1 items-center px-4 py-1.5 text-sm font-semibold rounded-full">
                            <CheckCircle2 className="h-4 w-4" /> Safe to Buy
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/30 flex gap-1 items-center px-4 py-1.5 text-sm font-semibold rounded-full">
                            <Clock className="h-4 w-4" /> {daysLeft} Days Left
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                          className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "car") {
    return (
      <div className="w-full font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Left Column: Form Card */}
          <Card className="border border-luxe-copper/20 shadow-luxe-sm flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-luxe-bronze" />
                  <CardTitle className="text-xl font-header font-semibold tracking-tight text-luxe-ivory">20/4/10 Car Affordability Engine</CardTitle>
                </div>
                <CardDescription className="text-base text-muted-foreground mt-1.5 font-sans leading-relaxed">
                  Verify if a vehicle purchase is sound: 20% down payment, 4-year max loan term, 10% max gross monthly income.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase font-header">Vehicle Price (₹)</label>
                    <input
                      type="number"
                      value={vehiclePrice}
                      onChange={(e) => setVehiclePrice(e.target.value)}
                      className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase font-header">Down Payment (₹)</label>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase font-header">APR Interest (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase font-header">Loan Term (Months)</label>
                    <input
                      type="number"
                      value={termMonths}
                      onChange={(e) => setTermMonths(e.target.value)}
                      className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase font-header">Insurance/mo (₹)</label>
                    <input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(e.target.value)}
                      className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase font-header">Maintenance/mo (₹)</label>
                    <input
                      type="number"
                      value={maintenance}
                      onChange={(e) => setMaintenance(e.target.value)}
                      className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleEvaluateAuto}
                  disabled={calcLoading}
                  className="w-full font-bold text-sm h-11 bg-finance-deep text-white hover:bg-finance-deep/90 border-transparent mt-2"
                >
                  {calcLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Evaluating...
                    </>
                  ) : (
                    "Evaluate Car Affordability"
                  )}
                </Button>

                {calcError && (
                  <div className="p-3 text-sm bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg flex items-center gap-2 mt-2">
                    <ShieldAlert className="h-4 w-4" /> {calcError}
                  </div>
                )}
              </CardContent>
            </div>
          </Card>

          {/* Right Column: Verdict Card */}
          <Card className="border border-luxe-copper/20 shadow-luxe-sm flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg font-header font-semibold tracking-tight text-luxe-ivory">Evaluation Verdict</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1.5 font-sans leading-relaxed">
                Checklist evaluation results based on the 20/4/10 budgeting framework.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              {calcResult ? (
                <div className="space-y-6 w-full">
                  <div className="flex items-center justify-between border-b border-luxe-copper/20 pb-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Evaluation Verdict</span>
                    {calcResult.is_affordable ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30 font-bold flex gap-1 items-center text-sm px-4 py-1.5 rounded-full">
                        <CheckCircle2 className="h-4 w-4" /> AFFORDABLE
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/30 font-bold flex gap-1 items-center text-sm px-4 py-1.5 rounded-full">
                        <XCircle className="h-4 w-4" /> NOT AFFORDABLE
                      </Badge>
                    )}
                  </div>

                  {/* Rules Checklist */}
                  {(() => {
                    const rules = calcResult.rules as any;
                    return (
                      <div className="space-y-3">
                        {/* Down Payment Rule */}
                        <div className="flex items-start gap-2.5 text-sm">
                          {rules.down_payment_20_percent.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-luxe-ivory/90 font-header">Down Payment &ge; 20%</span>
                            <p className="text-xs text-muted-foreground mt-0.5 font-sans leading-relaxed">
                              Required: 20% (₹{(parseFloat(vehiclePrice) * 0.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}). Actual: {rules.down_payment_20_percent.actual_percent}% (₹{parseFloat(downPayment).toLocaleString()}).
                            </p>
                          </div>
                        </div>

                        {/* Loan Term Rule */}
                        <div className="flex items-start gap-2.5 text-sm">
                          {rules.loan_term_4_years.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-luxe-ivory/90 font-header">Loan Term &le; 48 Months (4 Years)</span>
                            <p className="text-xs text-muted-foreground mt-0.5 font-sans leading-relaxed">
                              Max allowed: 48 months. Actual term: {rules.loan_term_4_years.actual_months} months.
                            </p>
                          </div>
                        </div>

                        {/* Cost vs Income Rule */}
                        <div className="flex items-start gap-2.5 text-sm">
                          {rules.total_cost_10_percent_income.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-luxe-ivory/90 font-header">Total Auto Cost &le; 10% Gross Income</span>
                            <p className="text-xs text-muted-foreground mt-0.5 font-sans leading-relaxed">
                              Max Allowed: {formatCurrency(calcResult.max_allowed_monthly_auto_cost)}/mo. Actual Cost: {formatCurrency(calcResult.total_monthly_auto_cost)}/mo (EMI: {formatCurrency(calcResult.monthly_payment)} + ins + maint).
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {calcResult.recommendations.length > 0 && (
                    <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm space-y-1.5 mt-2">
                      <span className="font-bold flex items-center gap-1.5 text-amber-600 font-header">
                        <AlertTriangle className="h-4 w-4" /> Optimization Recommendations
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs font-sans leading-relaxed">
                        {calcResult.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center space-y-3">
                  <Car className="h-12 w-12 text-muted-foreground/45" />
                  <p className="text-sm font-semibold">Awaiting calculation input</p>
                  <p className="text-xs max-w-[240px]">Enter vehicle financing details in the left panel and click evaluate to review affordability metrics.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 30-Day Cooling Off List */}
      <Card className="col-span-1 lg:col-span-6 border border-luxe-copper/20 shadow-luxe-sm flex flex-col justify-between font-sans">
        <div>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-luxe-bronze" />
              <CardTitle className="text-xl font-header font-semibold tracking-tight text-luxe-ivory">Impulse Buy Cooling Guard</CardTitle>
            </div>
            <CardDescription className="text-base text-muted-foreground mt-1.5 font-sans leading-relaxed">
              Enforce a 30-day delay on discretionary spend items to curb emotional purchasing patterns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-2">
                <input
                  type="text"
                  placeholder="Item Name (e.g. iPad Pro)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-1/2 text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Simulate days ago"
                    value={simulateDays}
                    onChange={(e) => setSimulateDays(e.target.value)}
                    className="w-1/2 text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2.5 outline-none focus:border-finance-medium"
                  />
                </div>
              </div>
              <Button type="submit" className="sm:col-span-1 h-full font-bold text-sm flex gap-1 items-center self-end bg-finance-deep text-white hover:bg-finance-deep/90 border-transparent">
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </form>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Your cooling queue is empty. Good job staying mindful of discretionary spends!
                </p>
              ) :
                items.map((item) => {
                  const daysLeft = getDaysRemaining(item.addedDate);
                  const isReady = daysLeft === 0;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-luxe-copper/20 bg-luxe-forest/40 flex items-center justify-between transition-all hover:bg-luxe-forest/50"
                    >
                      <div className="space-y-1">
                        <h5 className="font-bold text-base font-header text-luxe-ivory">{item.name}</h5>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-luxe-bronze font-sans">{formatCurrency(item.price)}</span>
                          <span className="text-xs text-muted-foreground font-sans">• Added {new Date(item.addedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isReady ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30 flex gap-1 items-center text-xs px-2.5 py-1 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Safe to Buy
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/30 flex gap-1 items-center text-xs px-2.5 py-1 font-semibold">
                            <Clock className="h-3.5 w-3.5" /> {daysLeft} Days Left
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                          className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </CardContent>
        </div>
      </Card>

      {/* 20/4/10 Auto Financing Rule Calculator */}
      <Card className="col-span-1 lg:col-span-6 border border-luxe-copper/20 shadow-luxe-sm flex flex-col justify-between font-sans">
        <div>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-luxe-bronze" />
              <CardTitle className="text-xl font-header font-semibold tracking-tight text-luxe-ivory">20/4/10 Car Affordability Engine</CardTitle>
            </div>
            <CardDescription className="text-base text-muted-foreground mt-1.5 font-sans leading-relaxed">
              Verify if a vehicle purchase is sound: 20% down payment, 4-year max loan term, 10% max gross monthly income.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase font-header">Vehicle Price (₹)</label>
                <input
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(e.target.value)}
                  className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase font-header">Down Payment (₹)</label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase font-header">APR Interest (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase font-header">Loan Term (Months)</label>
                <input
                  type="number"
                  value={termMonths}
                  onChange={(e) => setTermMonths(e.target.value)}
                  className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase font-header">Insurance/mo (₹)</label>
                <input
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase font-header">Maintenance/mo (₹)</label>
                <input
                  type="number"
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value)}
                  className="w-full text-sm bg-luxe-forest/50 rounded-lg border border-luxe-copper/30/60 p-2 outline-none focus:border-finance-medium font-semibold font-sans text-luxe-ivory/90"
                />
              </div>
            </div>

            <Button
              onClick={handleEvaluateAuto}
              disabled={calcLoading}
              className="w-full font-bold text-sm h-10 bg-finance-deep text-white hover:bg-finance-deep/90 border-transparent"
            >
              {calcLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Evaluating...
                </>
              ) : (
                "Evaluate Car Affordability"
              )}
            </Button>

            {calcError && (
              <div className="p-3 text-sm bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" /> {calcError}
              </div>
            )}

            {calcResult && (
              <div className="space-y-4 pt-4 border-t border-luxe-copper/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Evaluation Verdict</span>
                  {calcResult.is_affordable ? (
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30 font-bold flex gap-1 items-center text-sm px-2.5 py-1">
                      <CheckCircle2 className="h-4 w-4" /> AFFORDABLE
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/30 font-bold flex gap-1 items-center text-sm px-2.5 py-1">
                      <XCircle className="h-4 w-4" /> NOT AFFORDABLE
                    </Badge>
                  )}
                </div>

                {/* Rules Checklist */}
                {(() => {
                  const rules = calcResult.rules as any;
                  return (
                    <div className="space-y-3">
                      {/* Down Payment Rule */}
                      <div className="flex items-start gap-2.5 text-sm">
                        {rules.down_payment_20_percent.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-semibold text-luxe-ivory/90 font-header">Down Payment &ge; 20%</span>
                          <p className="text-xs text-muted-foreground mt-0.5 font-sans leading-relaxed">
                            Required: 20% (₹{(parseFloat(vehiclePrice) * 0.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}). Actual: {rules.down_payment_20_percent.actual_percent}% (₹{parseFloat(downPayment).toLocaleString()}).
                          </p>
                        </div>
                      </div>

                      {/* Loan Term Rule */}
                      <div className="flex items-start gap-2.5 text-sm">
                        {rules.loan_term_4_years.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-semibold text-luxe-ivory/90 font-header">Loan Term &le; 48 Months (4 Years)</span>
                          <p className="text-xs text-muted-foreground mt-0.5 font-sans leading-relaxed">
                            Max allowed: 48 months. Actual term: {rules.loan_term_4_years.actual_months} months.
                          </p>
                        </div>
                      </div>

                      {/* Cost vs Income Rule */}
                      <div className="flex items-start gap-2.5 text-sm">
                        {rules.total_cost_10_percent_income.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-semibold text-luxe-ivory/90 font-header">Total Auto Cost &le; 10% Gross Income</span>
                          <p className="text-xs text-muted-foreground mt-0.5 font-sans leading-relaxed">
                            Max Allowed: {formatCurrency(calcResult.max_allowed_monthly_auto_cost)}/mo. Actual Cost: {formatCurrency(calcResult.total_monthly_auto_cost)}/mo (EMI: {formatCurrency(calcResult.monthly_payment)} + ins + maint).
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {calcResult.recommendations.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm space-y-1.5 mt-2">
                    <span className="font-bold flex items-center gap-1.5 text-amber-600 font-header">
                      <AlertTriangle className="h-4 w-4" /> Optimization Recommendations
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs font-sans leading-relaxed">
                      {calcResult.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}