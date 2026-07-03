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
  ChevronDown,
  BookOpen,
  X
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
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const GLOSSARY_TERMS = [
  {
    title: "Asset Value",
    definition: "The total market value of all your money and financial holdings combined.",
    calculation: "We add up the exact current cash value of your bank balances, stock investments, mutual funds, and any other assets tracked in the app."
  },
  {
    title: "Tax Optimization",
    definition: "Legally reducing the amount of money you have to pay the government from your earnings.",
    calculation: "The system scans your income alongside tax laws to find deductions, exemptions, and investment plans that lower your taxable income, letting you keep more of your money."
  },
  {
    title: "Compound Interest",
    definition: "Earning returns not just on your original savings, but also on the interest you have already accumulated over time.",
    calculation: "We use mathematical growth formulas to project your future balance, reinvesting your earned profits back into the principal amount so your wealth accelerates."
  },
  {
    title: "The 50/30/20 Rule",
    definition: "A simple, structured budgeting blueprint used to divide your monthly take-home income into three clear categories.",
    calculation: "The app takes your total monthly net income and splits it mathematically: exactly 50% for essential living needs, 30% for personal wants, and 20% directed straight into savings."
  },
  {
    title: "Diversification",
    definition: "Spreading your investment money across many different types of financial assets instead of putting everything into one single place.",
    calculation: "We measure the percentage distribution of your funds across various sectors (like equity, fixed deposits, or gold) to ensure a drop in one asset won't severely impact your overall balance."
  },
  {
    title: "Inflation Adjustment",
    definition: "Accounting for the steady rise in prices over time, which causes your money to lose its purchasing power.",
    calculation: "We subtract the current yearly inflation rate from your investment growth rate to show you the real value and actual buying power of your future wealth."
  },
  {
    title: "Liquidity",
    definition: "How quickly and easily you can convert an asset back into spendable cash without losing its value.",
    calculation: "The app categorizes your wealth into immediate funds (like savings accounts) and locked funds (like long-term deposits), showing you exactly how much cash is available for instant withdrawal."
  },
  {
    title: "Portfolio Yield / ROI (Return on Investment)",
    definition: "The percentage score that shows how much profit or loss your investments made over a specific period.",
    calculation: "We divide your net profit by the original cost of your investment, multiplying it by 100 to show a clear percentage performance card."
  },
  {
    title: "Volatility",
    definition: "How fast and how drastically the price of an investment moves up and down in the market.",
    calculation: "The system tracks price fluctuations over time to give your portfolio a stability rating, letting you know if your investments are steady or high-risk."
  },
  {
    title: "Expense Ratio",
    definition: "The annual management fee charged by an investment fund to cover its operational costs.",
    calculation: "It is expressed as a tiny percentage (e.g., 0.5%). We show you exactly how much money is deducted from your investment returns to pay the fund managers."
  }
];

const GLOSSARY_MAP: Record<string, { view: string; id: string }> = {
  "Asset Value": { view: "retirement", id: "retirement-portfolio-card" },
  "Tax Optimization": { view: "tax", id: "tax-optimization-card" },
  "Compound Interest": { view: "retirement", id: "retirement-calc-card" },
  "The 50/30/20 Rule": { view: "matrix", id: "monthly-budget-card" },
  "Diversification": { view: "retirement", id: "retirement-portfolio-card" },
  "Inflation Adjustment": { view: "retirement", id: "retirement-calc-card" },
  "Liquidity": { view: "overview", id: "daily-cash-limit-card" },
  "Portfolio Yield / ROI (Return on Investment)": { view: "overview", id: "savings-rate-card" },
  "Volatility": { view: "overview", id: "debt-income-card" },
  "Expense Ratio": { view: "overview", id: "expense-ratio-card" }
};

export function DashboardView() {
  const { user, logout } = useAuth();
  const [healthScore, setHealthScore] = useState<HealthScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  const isExpanded = !isCollapsed || isHovered;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
  };

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

  const handleGlossaryTermClick = (title: string) => {
    const target = GLOSSARY_MAP[title];
    if (!target) return;

    // Set the view
    setActiveView(target.view);
    setIsGlossaryOpen(false);

    // Scroll and highlight
    setTimeout(() => {
      const element = document.getElementById(target.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Add highlight classes
        element.classList.add("ring-4", "ring-luxe-copper", "scale-[1.02]", "transition-all", "duration-500");
        
        // Remove highlight classes after 2 seconds
        setTimeout(() => {
          element.classList.remove("ring-4", "ring-luxe-copper", "scale-[1.02]");
        }, 2000);
      }
    }, 200);
  };

  return (
    <AuthGuard>
      <div className={`relative flex min-h-screen bg-background font-sans transition-all duration-300 ${isExpanded ? "pl-64" : "pl-16"}`}>
        {/* Left fixed sidebar */}
        <aside 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`fixed left-0 top-0 h-screen z-40 bg-card border-r border-luxe-copper/30 dark:border-luxe-copper/20 flex flex-col justify-between transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-16"}`}
        >
          <div className="flex flex-col flex-1 min-h-0">
            {/* Header logo & menu toggle */}
            <div className={`flex items-center justify-between py-5 border-b border-luxe-copper/30 dark:border-luxe-copper/20 ${isExpanded ? "px-6" : "px-2 justify-center"}`}>
              {isExpanded ? (
                <div className="flex items-center gap-3 overflow-hidden">
                  <PremiumOptiWealthLogo className="h-8 w-8 text-finance-deep shrink-0" />
                  <span className="font-sans tracking-tight text-xl text-finance-deep font-bold">OptiWealth</span>
                </div>
              ) : (
                <div className="flex items-center justify-center shrink-0">
                  <PremiumOptiWealthLogo className="h-8 w-8 text-finance-deep shrink-0" />
                </div>
              )}
              {isExpanded && (
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="text-foreground/80 hover:text-foreground focus:outline-none p-1 rounded hover:bg-accent transition-colors shrink-0"
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
                className={`w-full flex items-center rounded-lg text-[15px] font-playful font-medium tracking-wide transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "overview"
                    ? "bg-accent text-accent-foreground border-l-4 border-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Overview</span>
              </button>

              {/* 50/30/20 Matrix */}
              <button
                onClick={() => setActiveView("matrix")}
                className={`w-full flex items-center rounded-lg text-[15px] font-playful font-medium tracking-wide transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "matrix"
                    ? "bg-accent text-accent-foreground border-l-4 border-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent"
                }`}
              >
                <PieChart className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>50/30/20 Matrix</span>
              </button>

              {/* Tax Engine */}
              <button
                onClick={() => setActiveView("tax")}
                className={`w-full flex items-center rounded-lg text-[15px] font-playful font-medium tracking-wide transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "tax"
                    ? "bg-accent text-accent-foreground border-l-4 border-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent"
                }`}
              >
                <Percent className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Tax Engine</span>
              </button>

              {/* Debt Router */}
              <button
                onClick={() => setActiveView("debt")}
                className={`w-full flex items-center rounded-lg text-[15px] font-playful font-medium tracking-wide transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "debt"
                    ? "bg-accent text-accent-foreground border-l-4 border-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent"
                }`}
              >
                <TrendingDown className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Debt Router</span>
              </button>

              {/* Retirement Center */}
              <button
                onClick={() => setActiveView("retirement")}
                className={`w-full flex items-center rounded-lg text-[15px] font-playful font-medium tracking-wide transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "retirement"
                    ? "bg-accent text-accent-foreground border-l-4 border-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent"
                }`}
              >
                <Coins className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Retirement Center</span>
              </button>

              {/* Impulse Guard */}
              <button
                onClick={() => setActiveView("impulse")}
                className={`w-full flex items-center rounded-lg text-[15px] font-playful font-medium tracking-wide transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "impulse"
                    ? "bg-accent text-accent-foreground border-l-4 border-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent"
                }`}
              >
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Impulse Guard</span>
              </button>

              {/* Car Affordability */}
              <button
                onClick={() => setActiveView("car_affordability")}
                className={`w-full flex items-center rounded-lg text-[15px] font-playful font-medium tracking-wide transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "car_affordability"
                    ? "bg-accent text-accent-foreground border-l-4 border-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent"
                }`}
              >
                <Car className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Car Affordability</span>
              </button>

              {/* Data Pipeline */}
              <button
                onClick={() => setActiveView("pipeline")}
                className={`w-full flex items-center rounded-lg text-[15px] font-playful font-medium tracking-wide transition-all outline-none ${
                  isExpanded ? "gap-3 px-4 py-2.5" : "justify-center px-2 py-2.5"
                } ${
                  activeView === "pipeline"
                    ? "bg-accent text-accent-foreground border-l-4 border-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent"
                }`}
              >
                <Database className="h-4 w-4 shrink-0" />
                <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>Data Pipeline</span>
              </button>
            </nav>
          </div>

          {/* Footer reviewer card & logout button */}
          <div className={`p-4 border-t border-luxe-copper/30 dark:border-luxe-copper/20 bg-muted/30 transition-all duration-300 ${isExpanded ? "" : "px-2"}`}>
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold font-header text-sm shrink-0">
                SR
              </div>
              <div className={`min-w-0 flex-1 transition-all duration-300 overflow-hidden whitespace-nowrap ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                <p className="text-xs font-bold text-foreground truncate leading-none">Sandbox Reviewer</p>
                <p className="text-[10px] text-foreground/80 truncate mt-1">reviewer@optiwealth.io</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className={`flex items-center text-rose-600 border-luxe-copper/30 dark:border-luxe-copper/20 bg-card hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:hover:bg-rose-950/20 transition-colors ${
                isExpanded ? "w-full justify-start gap-2 h-9 text-[15px] font-playful font-medium tracking-wide" : "w-full justify-center p-0 h-9"
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
          <header className="sticky top-0 bg-card/85 backdrop-blur-md border-b border-luxe-copper/30 dark:border-luxe-copper/20 px-8 py-4 flex items-center justify-between z-10 shrink-0">
            <div>
              <h1 className="text-xs font-header font-semibold tracking-wider text-foreground/80 uppercase">
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
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsGlossaryOpen(true)}
                className="flex items-center gap-1.5 h-8 text-[15px] font-playful font-medium tracking-wide border-luxe-copper/40 bg-card hover:bg-muted text-foreground transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-luxe-copper animate-pulse" />
                Glossary
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
                disabled={loading}
                className="flex items-center gap-1.5 h-8 text-[15px] font-playful font-medium tracking-wide border-luxe-copper/30 dark:border-luxe-copper/20 bg-card hover:bg-accent text-foreground transition-colors"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                Sync Data
              </Button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 h-8 px-2.5 rounded-lg border border-luxe-copper/30 dark:border-luxe-copper/20 bg-card hover:bg-accent transition-colors text-[15px] font-playful font-medium tracking-wide text-foreground outline-none font-sans"
                >
                  <div className="h-5.5 w-5.5 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-[10px] shrink-0 font-sans">
                    SR
                  </div>
                  <span className="hidden sm:inline font-sans">Sandbox Reviewer</span>
                  <ChevronDown className={`h-3 w-3 text-foreground/80 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-luxe-copper/30 dark:border-luxe-copper/20 rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="px-3 py-2 border-b border-luxe-copper/30 dark:border-luxe-copper/20 mb-1">
                        <p className="text-xs font-bold text-foreground font-sans">Sandbox Reviewer</p>
                        <p className="text-[10px] text-foreground/80 mt-0.5 font-sans">reviewer@optiwealth.io</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          alert("Account settings config paths trigger");
                        }}
                        className="w-full text-left px-3 py-2 text-[15px] font-playful font-medium tracking-wide text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors font-sans"
                      >
                        Account Settings
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          alert("API pipeline key configuration");
                        }}
                        className="w-full text-left px-3 py-2 text-[15px] font-playful font-medium tracking-wide text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors font-sans"
                      >
                        API Pipeline Keys
                      </button>
                      <div className="border-t border-luxe-copper/30 dark:border-luxe-copper/20 my-1" />
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-[15px] font-playful font-medium tracking-wide text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 font-sans"
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
          <main 
            className="flex-1 overflow-y-auto fintech-topography p-8 relative group"
            onMouseMove={handleMouseMove}
          >
            {/* Interactive Spotlight Overlay */}
            <div 
              className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
              style={{
                background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(200, 159, 73, 0.08), transparent 40%)`
              }}
            />
            <div className="relative z-10">
            {error && (
              <div className="mb-6 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div>{error}</div>
              </div>
            )}

            {loading && !healthScore ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-finance-deep" />
                <p className="text-sm text-foreground/80 font-semibold">Orchestrating financial metrics...</p>
              </div>
            ) : (
              <div className="w-full space-y-8 animate-fade-in">
                {activeView === "overview" && healthScore && (
                  <div className="space-y-8">
                    {/* Welcome Hero Banner */}
                    <div className="bg-card border border-luxe-copper/30 dark:border-luxe-copper/20 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm text-foreground">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-header font-bold tracking-tight text-foreground">
                          Welcome back, Reviewer! 👋
                        </h2>
                        <p className="text-base text-foreground/80 font-sans">
                          Your cash runway is secured for the next <strong className="text-primary font-semibold">18 days</strong>.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-3 py-1.5 text-[15px] font-playful font-medium tracking-wide border border-accent/20">
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
            </div>
          </main>
        </div>
      </div>

      {/* Expandable Side Glossary Drawer */}
      {isGlossaryOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={() => setIsGlossaryOpen(false)}
            role="presentation"
          />
          
          {/* Drawer Panel */}
          <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-card border-l border-luxe-copper/30 dark:border-luxe-copper/20 shadow-2xl z-50 flex flex-col justify-between animate-in slide-in-from-right duration-300 text-foreground">
            {/* Header */}
            <div className="p-5 border-b border-luxe-copper/30 dark:border-luxe-copper/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-luxe-copper" />
                <h3 className="font-header font-bold text-base text-foreground">Financial Glossary</h3>
              </div>
              <button 
                onClick={() => setIsGlossaryOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors outline-none"
                aria-label="Close glossary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Glossary List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              <p className="text-xs text-foreground/80 leading-normal mb-2">
                Literal, simplified definitions of complex financial metrics. Defined cleanly without analogies.
              </p>
              
              {GLOSSARY_TERMS.map((term, index) => (
                <div 
                  key={index} 
                  onClick={() => handleGlossaryTermClick(term.title)}
                  className="p-4 rounded-xl border border-luxe-copper/25 bg-muted/5 space-y-2.5 hover:border-luxe-copper/60 hover:bg-luxe-copper/5 cursor-pointer transition-all duration-300"
                >
                  <h4 className="font-header font-bold text-xs uppercase tracking-wider text-foreground">
                    {term.title}
                  </h4>
                  <div className="space-y-2 text-xs leading-normal">
                    <div>
                      <span className="font-semibold text-[10px] text-foreground/80 uppercase tracking-wider block">What it means</span>
                      <p className="mt-0.5 text-foreground font-medium">{term.definition}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-[10px] text-foreground/80 uppercase tracking-wider block">How it's calculated</span>
                      <p className="mt-0.5 text-foreground font-medium">{term.calculation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-luxe-copper/30 dark:border-luxe-copper/20 bg-muted/10 text-center text-[10px] text-foreground/80 font-semibold">
              OptiWealth Financial Intelligence Workspace
            </div>
          </div>
        </>
      )}
    </AuthGuard>
  );
}
