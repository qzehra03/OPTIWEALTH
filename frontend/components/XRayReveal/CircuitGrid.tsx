"use client";

import React from "react";

export function CircuitGrid() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#06140F] overflow-hidden -z-20 select-none">
      {/* High-tech tech grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(181,100,46,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(181,100,46,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Math formulas & structural layouts */}
      <div className="absolute inset-0 flex flex-col justify-between p-12 text-[10px] font-mono text-accent-copper/45">
        <div className="flex justify-between w-full">
          <div className="space-y-1">
            <p className="font-bold text-accent-copper/80">// MODEL_ENGINE: BUDGETING_SYSTEM_INIT</p>
            <p>50% Needs = NetIncome * 0.50 [CAP]</p>
            <p>30% Wants = NetIncome * 0.30 [CAP]</p>
            <p>20% Savings = NetIncome * 0.20 [FLOOR]</p>
          </div>
          <div className="text-right space-y-1">
            <p className="font-bold text-accent-copper/80">// RETIREMENT_SAFE_WITHDRAWAL</p>
            <p>SWR = Portfolio * 0.04</p>
            <p>TargetNestEgg = Expenses * 12 * 25</p>
            <p>d[NestEgg]/dt &gt; WithdrawRate</p>
          </div>
        </div>

        <div className="flex justify-between w-full items-end">
          <div className="space-y-1">
            <p className="font-bold text-accent-copper/80">// VEHICLE_AFFORDABILITY_ENGINE</p>
            <p>DownPayment &gt;= VehiclePrice * 0.20</p>
            <p>TenureMonths &lt;= 48 [4 Years]</p>
            <p>TotalMonthlyTransit &lt;= GrossIncome * 0.10</p>
          </div>
          <div className="text-right space-y-1">
            <p className="font-bold text-accent-copper/80">// SYSTEM_STATUS</p>
            <p>INTEGRITY: SECURE</p>
            <p>ALGORITHM: RULE_BASED</p>
            <p>ESTABLISHED: FY_2026_27</p>
          </div>
        </div>
      </div>

      {/* SVG Circuits & Nodes */}
      <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
        <g stroke="var(--accent-copper)" strokeWidth="0.75" fill="none">
          {/* Top Left Circuit */}
          <path d="M 50,50 L 150,50 L 200,100 L 200,250 L 150,300" />
          <circle cx="50" cy="50" r="3" fill="var(--accent-copper)" />
          
          {/* Top Right Circuit */}
          <path d="M 900,80 L 800,80 L 750,130 L 750,220 L 780,250" />
          <circle cx="900" cy="80" r="3" fill="var(--accent-copper)" />

          {/* Bottom Left Circuit */}
          <path d="M 120,550 L 220,550 L 280,490 L 280,380" />
          <circle cx="120" cy="550" r="3" fill="var(--accent-copper)" />

          {/* Center Blueprint Circles */}
          <circle cx="50%" cy="50%" r="80" strokeDasharray="5 5" />
          <circle cx="50%" cy="50%" r="150" strokeDasharray="10 5" />
          <line x1="50%" y1="20%" x2="50%" y2="80%" strokeDasharray="3 3" />
          <line x1="20%" y1="50%" x2="80%" y2="50%" strokeDasharray="3 3" />
        </g>
      </svg>
    </div>
  );
}
