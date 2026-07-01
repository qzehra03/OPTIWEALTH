"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertTriangle, ArrowRight, HelpCircle, Activity, PiggyBank } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatCurrency } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

interface CalendarEvent {
  id: string;
  name: string;
  amount: number;
  dateStr: string; // ISO or date format
  daysRemaining: number;
}

export function DailyCashLimitWidget() {
  const { user } = useAuth();

  // Dynamic calculations based on user free income
  const income = user?.monthly_income || 120000;
  const expenses = user?.monthly_expenses || 45000;
  const freeIncome = income - expenses; // e.g. 75,000
  
  // Standard daily limit (free cash flow divided by 30)
  const standardDailyLimit = Math.round(freeIncome / 30); // e.g. 2500

  // Simulated calendar events
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      name: "Sister's Birthday Gift",
      amount: 4000,
      dateStr: "June 12",
      daysRemaining: 4,
    },
    {
      id: "2",
      name: "Car Insurance Premium",
      amount: 8000,
      dateStr: "June 15",
      daysRemaining: 7,
    },
    {
      id: "3",
      name: "Annual Gym Membership",
      amount: 15000,
      dateStr: "June 25",
      daysRemaining: 17,
    }
  ]);

  // Predictive Event Runway algorithm:
  // If an event occurs within 7 days, we plan down the daily limit.
  // We compute total runway commitment of events in the next 7 days and amortize it.
  const activeRunwayEvents = events.filter(e => e.daysRemaining <= 7);
  const totalRunwayCommitment = activeRunwayEvents.reduce((sum, e) => sum + e.amount, 0); // e.g. 12,000
  
  // Amortized deduction per day
  const dailyRunwayReduction = totalRunwayCommitment > 0 ? Math.round(totalRunwayCommitment / 10) : 0; // e.g. 1200
  
  // Adjusted Daily Limit
  const adjustedDailyLimit = Math.max(800, standardDailyLimit - dailyRunwayReduction); // e.g. 2500 - 1200 = 1300
  
  // Spent today (simulated with state for interactivity)
  const [spentToday, setSpentToday] = useState(100);
  const remainingToday = Math.max(0, adjustedDailyLimit - spentToday); // e.g. 1200

  // Ring configurations
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const fillPercent = adjustedDailyLimit > 0 ? (remainingToday / adjustedDailyLimit) : 0;
  const strokeDashoffset = circumference - fillPercent * circumference;

  return (
    <Card id="daily-cash-limit-card" className="border border-border bg-card shadow-sm font-sans flex flex-col justify-between text-card-foreground">
      <div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-header font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Daily Cash Velocity</span>
              <Tooltip 
                title="Liquidity" 
                definition="How quickly and easily you can convert an asset back into spendable cash without losing its value." 
                calculation="The app categorizes your wealth into immediate funds (like savings accounts) and locked funds (like long-term deposits), showing you exactly how much cash is available for instant withdrawal."
              />
            </CardTitle>
            {dailyRunwayReduction > 0 ? (
              <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/30 font-bold text-xs">
                Runway Active (-₹{dailyRunwayReduction}/d)
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/30 font-bold text-xs">
                Optimal Cashflow
              </Badge>
            )}
          </div>
          <CardDescription className="text-sm text-muted-foreground font-sans mt-1">
            Predictive liquidity guard adjusts limits to prevent end-of-month cash dips.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-muted/50 border border-border shadow-sm">
            {/* Ring gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 150 150">
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  className="stroke-muted"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  className="stroke-primary transition-all duration-1000 ease-in-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold font-sans text-foreground">₹{remainingToday}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-header mt-0.5">
                  Remaining
                </span>
              </div>
            </div>

            {/* Metrics column */}
            <div className="flex-1 space-y-2 text-base">
              <div className="flex justify-between text-muted-foreground font-sans">
                <span>Standard Limit:</span>
                <span className="font-semibold text-foreground">₹{standardDailyLimit}</span>
              </div>
              <div className="flex justify-between text-muted-foreground font-sans">
                <span>Runway Discount:</span>
                <span className="font-semibold text-amber-600">-₹{dailyRunwayReduction}</span>
              </div>
              <div className="flex justify-between text-muted-foreground font-sans border-t border-border pt-2 font-bold">
                <span>Adjusted Limit:</span>
                <span className="text-foreground">₹{adjustedDailyLimit}</span>
              </div>
              <div className="flex justify-between text-muted-foreground font-sans text-sm mt-1">
                <span>Spent today:</span>
                <span className="text-foreground font-medium">₹{spentToday}</span>
              </div>
            </div>
          </div>

          {/* Behavioral Reward Shortcuts */}
          <div className="pt-4 border-t border-border mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase font-header">Behavioral Rewards</h5>
              {spentToday !== 100 && (
                <button 
                  onClick={() => setSpentToday(100)} 
                  className="text-[10px] font-bold text-primary hover:underline outline-none"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSpentToday(prev => prev - 150)}
                className="bg-muted text-foreground text-xs py-1.5 px-3 rounded-full border border-border hover:bg-accent hover:text-accent-foreground font-medium transition-all outline-none"
              >
                ☕ Skipped Coffee (+₹150)
              </button>
              <button
                onClick={() => setSpentToday(prev => prev - 300)}
                className="bg-muted text-foreground text-xs py-1.5 px-3 rounded-full border border-border hover:bg-accent hover:text-accent-foreground font-medium transition-all outline-none"
              >
                🚗 Took Metro (+₹300)
              </button>
            </div>
          </div>

          {/* Runway event timeline */}
          <div className="pt-4 border-t border-border mt-4 space-y-3">
            <h4 className="text-base font-sans antialiased tracking-tight text-foreground flex items-center gap-1.5">
              <Calendar className="h-4.5 w-4.5 text-primary" />
              Predictive Event Runway
            </h4>
            <div className="space-y-2">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:bg-accent transition-colors">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-foreground font-header">{event.name}</p>
                    <p className="text-xs text-muted-foreground font-sans">{event.dateStr} ({event.daysRemaining} days left)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-sans text-foreground">₹{event.amount}</span>
                    <p className="text-[10px] text-amber-600 font-bold font-sans uppercase mt-0.5">
                      {event.daysRemaining <= 7 ? "Impact active" : "Monitored"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
