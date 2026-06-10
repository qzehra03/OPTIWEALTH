"use client";

import { useEffect, useState } from "react";
import { PremiumOptiWealthLogo } from "@/components/layout/PremiumOptiWealthLogo";
import { 
  Loader2, 
  LogOut, 
  RefreshCw, 
  AlertCircle,
  LayoutDashboard,
  Percent,
  TrendingDown,
  ShieldAlert,
  Database,
  PieChart,
  Coins,
  Car,
  Menu,
  ChevronDown
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { fetchHealthScore } from "@/lib/api";
import type { HealthScoreResponse } from "@/lib/types";
import { HealthScore } from "./HealthScore";
import { StrategyOptimizer } from "./StrategyOptimizer";
import { ImpulseGuard } from "./ImpulseGuard";
import { DataPipelineView } from "./DataPipelineView";
import { Matrix503020View } from "./Matrix503020View";
import { RetirementCenterView } from "./RetirementCenterView";
import { DailyCashLimitWidget } from "./DailyCashLimitWidget";

export function DashboardView() {
  const { user, logout } = useAuth();
  const [healthScore, setHealthScore] = useState<HealthScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isExpanded = !isCollapsed || isHovered;

  const loadDashboardData = () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    fetchHealthScore(user.id)
      .then(setHealthScore)
      .catch((err) => {
        console.error(err);
        setError("Could not load financial health score from backend.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  return (
    <AuthGuard>
      <div className={`relative flex min-h-screen bg-slate-50/50 font-sans transition-all duration-300 ${isExpanded ? "pl-64" : "pl-16"}`}>
        {/* Left fixed sidebar */}
        <aside 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`fixed left-0 top-0 h-screen z-40 bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-16"}`}
        >
          <div className="flex flex-col flex-1 min-h-0">
            {/* Header logo & menu toggle */}
            <div className={`flex items-center justify-between py-5 border-b border-slate-100 ${isExpanded ? "px-6" : "px-2 justify-center"}`}>
              {isExpanded ? (
                <div className="flex items-center gap-3 overflow-hidden">
                  <PremiumOptiWealthLogo className="h-8 w-8 text-finance-deep shrink-0" />
                  <span className="font-sans antialiased tracking-tight text-xl text-finance-deep font-bold">OptiWealth</span>
                </div>
              ) : (
                <div className="flex items-center justify-center shrink-0">
                  <PremiumOptiWealthLogo className="h-8 w-8 text-finance-deep shrink-0" />
                </div>
              )}
              {isExpanded && (
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="text-slate-500 hover:text-slate-800 focus:outline-none p-1 rounded hover:bg-slate-50 transition-colors shrink-0"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Menu options */}
            <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
              {/* Overview */}
              <button
                onClick={() => setActiveView("overview")}
                className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "overview"
                    ? "bg-finance-mint text-finance-deep border-l-4 border-finance-deep"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Overview</span>
              </button>

              {/* 50/30/20 Matrix */}
              <button
                onClick={() => setActiveView("matrix")}
                className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "matrix"
                    ? "bg-finance-mint text-finance-deep border-l-4 border-finance-deep"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <PieChart className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>50/30/20 Matrix</span>
              </button>

              {/* Tax Engine */}
              <button
                onClick={() => setActiveView("tax")}
                className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "tax"
                    ? "bg-finance-mint text-finance-deep border-l-4 border-finance-deep"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Percent className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Tax Engine</span>
              </button>

              {/* Debt Router */}
              <button
                onClick={() => setActiveView("debt")}
                className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "debt"
                    ? "bg-finance-mint text-finance-deep border-l-4 border-finance-deep"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <TrendingDown className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Debt Router</span>
              </button>

              {/* Retirement Center */}
              <button
                onClick={() => setActiveView("retirement")}
                className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "retirement"
                    ? "bg-finance-mint text-finance-deep border-l-4 border-finance-deep"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Coins className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Retirement Center</span>
              </button>

              {/* Impulse Guard */}
              <button
                onClick={() => setActiveView("impulse")}
                className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "impulse"
                    ? "bg-finance-mint text-finance-deep border-l-4 border-finance-deep"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Impulse Guard</span>
              </button>

              {/* Car Affordability */}
              <button
                onClick={() => setActiveView("car_affordability")}
                className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "car_affordability"
                    ? "bg-finance-mint text-finance-deep border-l-4 border-finance-deep"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Car className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Car Affordability</span>
              </button>

              {/* Data Pipeline */}
              <button
                onClick={() => setActiveView("pipeline")}
                className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "pipeline"
                    ? "bg-finance-mint text-finance-deep border-l-4 border-finance-deep"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Database className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Data Pipeline</span>
              </button>
            </nav>
          </div>

          {/* Footer reviewer card & logout button */}
          <div className={`p-4 border-t border-slate-100 bg-slate-50/50 transition-all duration-300 ${isExpanded ? "" : "px-2"}`}>
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-9 w-9 rounded-full bg-finance-mint flex items-center justify-center text-finance-deep font-bold font-header text-sm shrink-0">
                SR
              </div>
              <div className={`min-w-0 flex-1 transition-all duration-300 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                <p className="text-xs font-bold text-slate-800 truncate leading-none">Sandbox Reviewer</p>
                <p className="text-[10px] text-muted-foreground truncate mt-1">reviewer@optiwealth.io</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className={`flex items-center text-rose-600 border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors ${
                isExpanded ? "w-full justify-start gap-2 h-9 text-xs font-semibold" : "w-full justify-center p-0 h-9"
              }`}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}>Sign Out</span>
            </Button>
          </div>
        </aside>

        {/* Right content workspace */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top navigation header */}
          <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between z-10 shrink-0">
            <div>
              <h1 className="text-xs font-header font-semibold tracking-wider text-slate-400 uppercase">
                {activeView === "overview" && "Dashboard"}
                {activeView === "matrix" && "50/30/20 Budget Matrix"}
                {activeView === "tax" && "Tax Engine FY 2026-27"}
                {activeView === "debt" && "Debt Payoff Router"}
                {activeView === "retirement" && "Retirement Freedom Center"}
                {activeView === "impulse" && "Impulse Buy Cooling Guard"}
                {activeView === "car_affordability" && "20/4/10 Car Affordability Engine"}
                {activeView === "pipeline" && "Data Telemetry Pipeline"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
                disabled={loading}
                className="flex items-center gap-1.5 h-8 text-xs font-semibold border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                Sync Data
              </Button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 h-8 px-2.5 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 outline-none font-sans"
                >
                  <div className="h-5.5 w-5.5 rounded-full bg-finance-mint flex items-center justify-center text-finance-deep font-bold text-[10px] shrink-0 font-sans">
                    SR
                  </div>
                  <span className="hidden sm:inline font-sans">Sandbox Reviewer</span>
                  <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="px-3 py-2 border-b border-slate-50 mb-1">
                        <p className="text-xs font-bold text-slate-800 font-sans">Sandbox Reviewer</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-sans">reviewer@optiwealth.io</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          alert("Account settings config paths trigger");
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors font-sans"
                      >
                        Account Settings
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          alert("API pipeline key configuration");
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors font-sans"
                      >
                        API Pipeline Keys
                      </button>
                      <div className="border-t border-slate-50 my-1" />
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 font-sans"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main workspace layout */}
          <main className="flex-1 overflow-y-auto fintech-grid p-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div>{error}</div>
              </div>
            )}

            {loading && !healthScore ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-finance-deep" />
                <p className="text-sm text-muted-foreground font-semibold">Orchestrating financial metrics...</p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                {activeView === "overview" && healthScore && (
                  <div className="space-y-8">
                    {/* Welcome Hero Banner */}
                    <div className="bg-white border border-slate-100 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-header font-bold tracking-tight text-slate-900">
                          Welcome back, Reviewer! 👋
                        </h2>
                        <p className="text-base text-slate-650 font-sans">
                          Your cash runway is secured for the next <strong className="text-[#037A6B] font-semibold">18 days</strong>.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-finance-mint text-finance-deep px-3 py-1.5 text-xs font-semibold border border-finance-mint/20">
                          💡 Optimization Nudge: Maintain savings buffer above 3 months to boost health rating.
                        </span>
                      </div>
                    </div>

                    {/* Gauge + metric cards and Daily Allowance widget side-by-side */}
                    <div className="grid grid-cols-12 gap-6 w-full items-start">
                      <div className="col-span-12 lg:col-span-5">
                        <HealthScore data={healthScore} />
                      </div>
                      <div className="col-span-12 lg:col-span-7">
                        <DailyCashLimitWidget />
                      </div>
                    </div>
                  </div>
                )}

                {activeView === "matrix" && (
                  <Matrix503020View />
                )}

                {activeView === "tax" && user && (
                  <StrategyOptimizer user={user} defaultTab="tax" hideTabs={true} />
                )}

                {activeView === "debt" && user && (
                  <StrategyOptimizer user={user} defaultTab="debts" hideTabs={true} />
                )}

                {activeView === "retirement" && (
                  <RetirementCenterView />
                )}

                {activeView === "impulse" && user && (
                  <ImpulseGuard user={user} mode="cooling" />
                )}

                {activeView === "car_affordability" && user && (
                  <ImpulseGuard user={user} mode="car" />
                )}

                {activeView === "pipeline" && (
                  <DataPipelineView />
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}