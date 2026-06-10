"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Activity, 
  PieChart, 
  TrendingDown, 
  Coins, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { PremiumOptiWealthLogo } from "./PremiumOptiWealthLogo";
import { useAuth } from "@/components/providers/AuthProvider";

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  
  // Hydration safety
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatNumber = (num: number) => {
    return mounted ? num.toLocaleString() : num.toString();
  };

  // Interactive Sandbox state
  const [monthlyExpense, setMonthlyExpense] = useState(60000);

  // Dynamic calculations
  const emergencyFund = monthlyExpense * 6;
  const dailySpentLimit = Math.round(monthlyExpense / 30);
  const nestEggGoal = monthlyExpense * 12 * 25; // 25x annual expenses

  // Gauge configurations (micro-scaled 53 score matching mock UI requirements)
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const score = 53;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-900 font-sans flex flex-col justify-between selection:bg-[#E6F7F0] selection:text-[#037A6B]">
      
      {/* 2. Frosted Sticky Navigation Bar */}
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <Link href="/" className="flex items-center gap-2.5 outline-none group">
          <PremiumOptiWealthLogo className="h-8 w-8 text-finance-deep shrink-0 transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-header antialiased tracking-tight text-xl text-slate-900 font-bold">
            OptiWealth
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-650">
          <a href="#features" className="hover:text-[#037A6B] transition-colors">Features</a>
          <a href="#sandbox" className="hover:text-[#037A6B] transition-colors">Interactive Sandbox</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#037A6B] transition-colors">Documentation</a>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="bg-[#037A6B] hover:bg-[#026356] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-[#037A6B]/10 hover:shadow-md flex items-center gap-1.5"
          >
            {isAuthenticated ? "Launch Dashboard" : "Enter App"}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* 3. Typography-Driven Hero Section */}
      <main className="flex-1">
        <section 
          className="relative py-20 md:py-28 overflow-hidden flex flex-col items-center justify-center border-b border-slate-100"
          style={{ 
            backgroundImage: "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)", 
            backgroundSize: "24px 24px" 
          }}
        >
          {/* Subtle Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-finance-mint/20 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-50/30 rounded-full blur-2xl -z-10" />

          {/* Hero Core Content */}
          <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center space-y-6">
            <div className="text-[10px] font-bold tracking-widest text-[#037A6B] bg-[#E6F7F0] px-3 py-1 rounded-full uppercase font-header">
              💸 ADDICTED TO IMPULSE DROPS?
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 font-header max-w-4xl mx-auto leading-none">
              Stop aimlessly draining your wallet. <span className="text-[#037A6B]">Track the fun. Lock the wealth.</span>
            </h1>
            
            <p className="text-sm md:text-base font-medium text-slate-500 max-w-2xl mx-auto mt-4 leading-relaxed font-sans">
              OptiWealth doesn’t tell you to stop spending on weekend concert tickets or late-night food deliveries. We just give you an automated psychological buffer system that protects your true financial freedom runway behind the scenes before you click buy.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link 
                href="/onboard"
                className="bg-[#037A6B] hover:bg-[#026356] text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                Fix My Wallet ➔
              </Link>
              <Link 
                href="/login"
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-6 py-3.5 rounded-xl transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Interactive Mock UI Block */}
          <div className="max-w-4xl w-full mx-auto px-6 mt-16 relative">
            <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-xl rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 max-w-2xl mx-auto">
              
              {/* Left Side: Micro-scaled Score Gauge */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50/50 border border-slate-100 shadow-sm shrink-0 w-full sm:w-auto">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 110 110">
                    <circle
                      cx="55"
                      cy="55"
                      r={radius}
                      className="stroke-slate-100"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />
                    <circle
                      cx="55"
                      cy="55"
                      r={radius}
                      className="stroke-amber-500 transition-all duration-1000 ease-in-out"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold tracking-tight font-sans text-slate-900">53</span>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider font-header mt-0.5">
                      FAIR
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4">
                  Financial Health Index
                </span>
              </div>

              {/* Right Side: 4x1 Stack Frame */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100/80 bg-white/50 shadow-sm whitespace-nowrap">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-header">SAVINGS RATE</span>
                  <span className="text-sm font-bold text-[#037A6B] font-sans">40.37%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100/80 bg-white/50 shadow-sm whitespace-nowrap">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-header">EMERGENCY BUFFER</span>
                  <span className="text-sm font-bold text-slate-700 font-sans">2.01 mo</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100/80 bg-white/50 shadow-sm whitespace-nowrap">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-header">DEBT-TO-INCOME</span>
                  <span className="text-sm font-bold text-slate-700 font-sans">28.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100/80 bg-white/50 shadow-sm whitespace-nowrap">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-header">EXPENSE RATIO</span>
                  <span className="text-sm font-bold text-amber-500 font-sans">59.63%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Core Feature Matrix Grid */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-header max-w-3xl mx-auto text-center">
                Built to protect you from <span className="text-[#037A6B]">your own spending habits</span>.
              </h2>
              <p className="text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto text-center mt-3 font-sans">
                Four rule-based automated frameworks designed to instantly intercept aimless wallet drainage and calculate your true path to freedom.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Card 1: Impulse Control */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left">
                <div className="h-12 w-12 rounded-2xl bg-[#E6F7F0] text-[#037A6B] flex items-center justify-center">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-slate-900 font-bold font-header text-lg mb-2 mt-4">30-Day Impulse Cooling Vault</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed font-sans">
                  Stop blowing cash on late-night impulse drops. Lock your wants inside an automated cooling loop that enforces a psychological delay countdown before you can click buy.
                </p>
              </div>

              {/* Card 2: Compounding Budgeting */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left">
                <div className="h-12 w-12 rounded-2xl bg-[#E6F7F0] text-[#037A6B] flex items-center justify-center">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="text-slate-900 font-bold font-header text-lg mb-2 mt-4">The Guilt-Free 50/30/20 Rule</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed font-sans">
                  No tedious line-item expense tracking. Split your pay instantly to secure your fixed bills and compounding savings baseline, leaving your discretionary cash 100% free to spend.
                </p>
              </div>

              {/* Card 3: Vehicle Affordability */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left">
                <div className="h-12 w-12 rounded-2xl bg-[#E6F7F0] text-[#037A6B] flex items-center justify-center">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <h3 className="text-slate-900 font-bold font-header text-lg mb-2 mt-4">The 20/4/10 Car Check</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed font-sans">
                  Before you commit to a car loan that suffocates your income for years, run our strict multi-variable evaluation engine to check if that premium ride safely matches your cash flow.
                </p>
              </div>

              {/* Card 4: Retirement Target */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left">
                <div className="h-12 w-12 rounded-2xl bg-[#E6F7F0] text-[#037A6B] flex items-center justify-center">
                  <Coins className="h-6 w-6" />
                </div>
                <h3 className="text-slate-900 font-bold font-header text-lg mb-2 mt-4">The 25x True Freedom Multiplier</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed font-sans">
                  Stop guessing. Input your desired monthly lifestyle budget to instantly calculate your precise nest-egg destination number using empirical safe withdrawal rules.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Call-To-Action Sandbox Footer */}
        <section id="sandbox" className="py-20 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-[#E6F7F0]/40 rounded-[32px] p-8 sm:p-12 text-center border border-[#E6F7F0] space-y-8 relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-finance-mint/30 rounded-full blur-2xl -z-10" />
              
              <div className="space-y-3 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold font-header text-slate-900 tracking-tight leading-tight">
                  Ready for absolute liquidity optimization?
                </h2>
                <p className="text-slate-500 text-sm sm:text-base font-sans">
                  Drag the target monthly expense slider below to model your financial metrics in real time.
                </p>
              </div>

              {/* Slider Panel */}
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-500 flex items-center gap-1.5 font-header">
                      <Sliders className="h-4 w-4 text-[#037A6B]" />
                      TARGET MONTHLY BUDGET
                    </span>
                    <span className="text-xl font-bold font-sans text-slate-900">
                      ₹{formatNumber(monthlyExpense)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="300000"
                    step="5000"
                    value={monthlyExpense}
                    onChange={(e) => setMonthlyExpense(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#037A6B]"
                  />
                </div>

                {/* Simulated Outputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="text-left p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-header">
                      6-Mo Emergency Buffer
                    </span>
                    <p className="text-lg font-bold font-sans text-slate-800 mt-1">
                      ₹{formatNumber(emergencyFund)}
                    </p>
                  </div>
                  <div className="text-left p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-header">
                      Daily Velocity Cap
                    </span>
                    <p className="text-lg font-bold font-sans text-slate-800 mt-1">
                      ₹{formatNumber(dailySpentLimit)}
                    </p>
                  </div>
                  <div className="text-left p-4 rounded-xl bg-[#E6F7F0]/30 border border-[#E6F7F0] hover:border-[#037A6B]/30 transition-colors">
                    <span className="text-[10px] font-bold text-[#037A6B] uppercase tracking-wider font-header">
                      Nest-Egg Target (25x)
                    </span>
                    <p className="text-lg font-bold font-sans text-[#037A6B] mt-1">
                      ₹{formatNumber(nestEggGoal)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link 
                  href="/onboard"
                  className="bg-[#037A6B] hover:bg-[#026356] text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all shadow-md shadow-[#037A6B]/15"
                >
                  Optimize My Capital
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <PremiumOptiWealthLogo className="h-6 w-6 text-slate-400" />
            <span className="text-sm font-semibold font-header text-slate-500">OptiWealth © 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Bank-grade encryption</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
