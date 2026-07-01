"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Activity, FileCode, CheckCircle, Server, TableProperties, RefreshCw, XCircle } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { API_BASE } from "@/lib/api";

export function DataPipelineView() {
  const { user } = useAuth();
  const [pingStatus, setPingStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [latency, setLatency] = useState<number | null>(null);
  const [dbStatus, setDbStatus] = useState<"online" | "offline">("online");
  const [activePayloadTab, setActivePayloadTab] = useState<"user" | "health" | "onboard">("user");

  const checkConnection = async () => {
    setPingStatus("connecting");
    const startTime = performance.now();
    try {
      const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
      if (res.ok) {
        const endTime = performance.now();
        setLatency(Math.round(endTime - startTime));
        setPingStatus("connected");
        setDbStatus("online");
      } else {
        setPingStatus("disconnected");
        setDbStatus("offline");
        setLatency(null);
      }
    } catch (err) {
      console.error(err);
      setPingStatus("disconnected");
      setDbStatus("offline");
      setLatency(null);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 10000); // check every 10s
    return () => clearInterval(interval);
  }, []);

  const onboardingPayloadSchema = {
    email: user?.email || "reviewer@optiwealth.io",
    password: "[ENCRYPTED_SHA256]",
    full_name: user?.full_name || "Sandbox Reviewer",
    monthly_income: user?.monthly_income || 120000,
    monthly_expenses: user?.monthly_expenses || 45000,
    emergency_fund_balance: user?.emergency_fund_balance || 150000,
    annual_gross_income: user?.annual_gross_income || 1440000,
    debts: user?.debts || [
      {
        name: "Personal Loan",
        principal: 100000,
        interest_rate: 12.5,
        minimum_payment: 5000,
        remaining_balance: 85000
      }
    ],
    fixed_deposits: user?.fixed_deposits || [
      {
        bank_name: "HDFC Bank",
        principal: 50000,
        interest_rate: 7.1,
        maturity_date: "2027-06-01"
      }
    ]
  };

  const activePayloadCode = () => {
    switch (activePayloadTab) {
      case "user":
        return JSON.stringify(user, null, 2);
      case "onboard":
        return JSON.stringify(onboardingPayloadSchema, null, 2);
      case "health":
        return JSON.stringify({
          user_id: user?.id || 1,
          health_score: 53.0,
          rating: "Fair",
          breakdown: {
            savings_rate_score: 40.37,
            emergency_fund_score: 34.0,
            dti_score: 100.0,
            spending_discipline_score: 28.0
          },
          metrics: {
            savings_rate_percent: 40.37,
            emergency_fund_months: 2.01,
            dti_percent: 15.0,
            expense_ratio_percent: 59.63
          }
        }, null, 2);
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="space-y-1">
        <h2 className="text-2xl font-sans antialiased tracking-tight text-luxe-bronze">Data Pipeline Diagnostics</h2>
        <p className="text-sm text-muted-foreground font-sans">
          Real-time schema telemetry, SQLite engine hooks, and FastAPI contract inspector.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Server Status & Schema Telemetry */}
        <div className="col-span-1 lg:col-span-6 space-y-6">
          {/* Connection Status Card */}
          <Card className="border border-luxe-copper/20 shadow-luxe-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-header flex items-center gap-2">
                  <Server className="h-4 w-4 text-luxe-bronze" />
                  API Gateway Ping
                </CardTitle>
                <button 
                  onClick={checkConnection}
                  className="text-xs text-luxe-bronze hover:text-luxe-bronze/85 flex items-center gap-1 font-semibold outline-none"
                >
                  <RefreshCw className={`h-3 w-3 ${pingStatus === "connecting" ? "animate-spin" : ""}`} />
                  Ping
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl border border-luxe-copper/20 bg-luxe-forest/40">
                <div className="flex items-center gap-3">
                  {pingStatus === "connected" ? (
                    <div className="relative flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                    </div>
                  ) : pingStatus === "connecting" ? (
                    <div className="relative flex h-3.5 w-3.5">
                      <span className="animate-spin absolute inline-flex h-full w-full rounded-full border-2 border-slate-300 border-t-finance-deep"></span>
                    </div>
                  ) : (
                    <div className="relative flex h-3.5 w-3.5">
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-luxe-ivory">
                      {pingStatus === "connected" ? "FastAPI Status: Active" : pingStatus === "connecting" ? "Pinging endpoint..." : "FastAPI Status: Offline"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{API_BASE}</p>
                  </div>
                </div>
                {pingStatus === "connected" && latency !== null && (
                  <Badge className="bg-luxe-copper/15 text-luxe-bronze border-none font-semibold">
                    {latency} ms
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SQLite DB Schema Telemetry */}
          <Card className="border border-luxe-copper/20 shadow-luxe-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-header flex items-center gap-2">
                <Database className="h-4 w-4 text-luxe-bronze" />
                SQLite Table Schema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-luxe-copper/20 pb-2">
                <span>Database Engine: <strong>SQLite 3</strong></span>
                <span>File: <strong className="text-luxe-bronze font-mono">optiwealth.db</strong></span>
                <span>Status: <Badge className={`text-[10px] px-1.5 py-0.5 font-bold ${dbStatus === "online" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"}`}>{dbStatus.toUpperCase()}</Badge></span>
              </div>

              <div className="space-y-3">
                {/* Users Table */}
                <div className="p-3 rounded-xl border border-luxe-copper/20 bg-luxe-forest/30 hover:bg-luxe-forest/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TableProperties className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-bold text-luxe-ivory">users</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-luxe-copper/30">
                      1 Row
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1 px-1 overflow-x-auto whitespace-nowrap">
                    id (PK) | email | password_hash | full_name | monthly_income | monthly_expenses | emergency_fund_balance | annual_gross_income
                  </p>
                </div>

                {/* Debts Table */}
                <div className="p-3 rounded-xl border border-luxe-copper/20 bg-luxe-forest/30 hover:bg-luxe-forest/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TableProperties className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-bold text-luxe-ivory">debts</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-luxe-copper/30">
                      {user?.debts?.length || 0} Rows
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1 px-1 overflow-x-auto whitespace-nowrap">
                    id (PK) | user_id (FK) | name | principal | interest_rate | minimum_payment | remaining_balance
                  </p>
                </div>

                {/* Fixed Deposits Table */}
                <div className="p-3 rounded-xl border border-luxe-copper/20 bg-luxe-forest/30 hover:bg-luxe-forest/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TableProperties className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-bold text-luxe-ivory">fixed_deposits</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-luxe-copper/30">
                      {user?.fixed_deposits?.length || 0} Rows
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1 px-1 overflow-x-auto whitespace-nowrap">
                    id (PK) | user_id (FK) | bank_name | principal | interest_rate | maturity_date
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Payload Contract Inspector */}
        <div className="col-span-1 lg:col-span-6">
          <Card className="border border-luxe-copper/20 shadow-luxe-sm h-full flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3 border-b border-luxe-copper/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-luxe-bronze" />
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-header">
                      Payload Contracts
                    </CardTitle>
                  </div>
                  <div className="flex gap-1.5 bg-luxe-forest/50 p-1 rounded-lg border border-luxe-copper/20">
                    <button
                      onClick={() => setActivePayloadTab("user")}
                      className={`px-2 py-1 text-[10px] font-bold rounded ${activePayloadTab === "user" ? "bg-luxe-emerald/40 text-luxe-bronze shadow-sm" : "text-muted-foreground"}`}
                    >
                      User Schema
                    </button>
                    <button
                      onClick={() => setActivePayloadTab("onboard")}
                      className={`px-2 py-1 text-[10px] font-bold rounded ${activePayloadTab === "onboard" ? "bg-luxe-emerald/40 text-luxe-bronze shadow-sm" : "text-muted-foreground"}`}
                    >
                      Onboard Req
                    </button>
                    <button
                      onClick={() => setActivePayloadTab("health")}
                      className={`px-2 py-1 text-[10px] font-bold rounded ${activePayloadTab === "health" ? "bg-luxe-emerald/40 text-luxe-bronze shadow-sm" : "text-muted-foreground"}`}
                    >
                      Health Res
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-[360px] overflow-y-auto leading-relaxed border border-slate-950">
                  <pre>{activePayloadCode()}</pre>
                </div>
              </CardContent>
            </div>
            <div className="p-4 border-t border-luxe-copper/20 bg-luxe-forest/50/30 rounded-b-xl flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Dynamic validation: <strong className="text-luxe-ivory/90">Strict Pydantic V2</strong></span>
              <span>Authentication: <strong className="text-luxe-ivory/90">JWT OAuth2 Bearer</strong></span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
