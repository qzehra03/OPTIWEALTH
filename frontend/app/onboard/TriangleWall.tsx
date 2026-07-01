"use client";
import React from "react";

interface TriangleItem {
  id: number;
  label?: string; // If left undefined, surfaces an institutional quote[cite: 1]
  backText: string;
  clipClass: string;
}

const mosaicItems: TriangleItem[] = [
  {
    id: 1,
    label: "50/30/20 Rule", //[cite: 1]
    backText: "Allocation Blueprint: Dynamically partitions monthly cash flow into 50% Vital Needs, 30% Lifestyle Wants, and 20% Financial Growth.",
    clipClass: "polygon(0 0, 100% 0, 50% 100%)"
  },
  {
    id: 2,
    backText: '"The individual investor should act consistently as an investor and not as a speculator." — Benjamin Graham, The Intelligent Investor',
    clipClass: "polygon(50% 0, 100% 100%, 0 100%)"
  },
  {
    id: 3,
    label: "Pay Yourself First Rule", //[cite: 1]
    backText: "Growth Catalyst: Automated wealth-building logic that routes 10-20% of incoming income to investments before calculating variable spending allowances.",
    clipClass: "polygon(0 0, 100% 0, 0 100%)"
  },
  {
    id: 4,
    label: "3X to 6X Emergency Rule", //[cite: 1]
    backText: "Defensive Shield: Calculates and ring-fences 3 to 6 months of absolute baseline survival liquidity before optimizing for aggressive asset growth.",
    clipClass: "polygon(100% 0, 100% 100%, 0 50%)"
  },
  {
    id: 5,
    backText: '"The most powerful weapon on earth is the human soul on fire. The second most powerful is compound interest." — Morgan Housel, The Psychology of Money',
    clipClass: "polygon(0 0, 100% 100%, 0 100%)"
  },
  {
    id: 6,
    label: "10-5-3 Expected Return Paradigm", //[cite: 1]
    backText: "Sober Modeling: Constrains platform growth forecasting to institutional realities: 10% Equities, 5% Debt Instruments, and 3% Cash Stagnation.",
    clipClass: "polygon(50% 0, 100% 100%, 0 100%)"
  },
  {
    id: 7,
    label: "The Rule of 72, 114, and 144", //[cite: 1]
    backText: "Compounding Velocity: Displays the exact timeline for your portfolio to Double (72), Triple (114), or Quadruple (144) based on real-time net yield.",
    clipClass: "polygon(0 0, 100% 0, 50% 100%)"
  },
  {
    id: 8,
    label: "The Rule of 70 (Inflation Decay)", //[cite: 1]
    backText: "Erosion Monitor: A continuous decay metric showing how quickly idle funds lose half their purchasing power to macro inflation.",
    clipClass: "polygon(100% 0, 0 100%, 100% 100%)"
  },
  {
    id: 9,
    label: "40% EMI/Debt Limit", //[cite: 1]
    backText: "Leverage Cap: Systemic boundary that triggers structural warnings if fixed liabilities exceed 40% of net monthly take-home pay.",
    clipClass: "polygon(0 0, 100% 50%, 0 100%)"
  },
  {
    id: 10,
    label: '"100 Minus Age" Asset Allocation Rule', //[cite: 1]
    backText: "Lifecycle Balancing: Calculates your baseline market risk capacity (100 - Age = Equity %) to automate lifetime portfolio rebalancing.",
    clipClass: "polygon(50% 0, 100% 100%, 0 100%)"
  },
  {
    id: 11,
    backText: '"Do not save what is left after spending, but spend what is left after saving." — Warren Buffett',
    clipClass: "polygon(0 0, 100% 0, 50% 100%)"
  },
  {
    id: 12,
    label: "The 4% Withdrawal Rule", //[cite: 1]
    backText: "Harvest Sustainability: Back-calculates your target financial freedom corpus (25 x annual expenses) to enable safe, lifetime 4% asset drawdown.",
    clipClass: "polygon(50% 0, 100% 100%, 0 100%)"
  }
];

export default function TriangleWall() {
  return (
    <div className="w-full bg-[#0B1C15] py-24 px-4 flex flex-col items-center">
      <h2 className="text-3xl font-extrabold text-white uppercase tracking-widest mb-16 border-b border-[#D4AF37]/30 pb-4">
        Features & Rules[cite: 1]
      </h2>

      {/* Responsive Interlocking Matrix Frame */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {mosaicItems.map((item) => (
          <div
            key={item.id}
            className="group h-64 relative cursor-pointer"
            style={{ perspective: "1000px" }}
          >
            {/* Inner Flip Container */}
            <div className="w-full h-full duration-700 transition-transform transform style-3d group-hover:rotate-y-180">
              
              {/* Front Face */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-[#102C21] to-[#0B1C15] border border-[#D4AF37]/40 flex flex-col justify-center items-center p-6 backface-hidden"
                style={{ clipPath: item.clipClass }}
              >
                {item.label ? (
                  <p className="text-[#D4AF37] font-bold tracking-wider text-center text-sm md:text-base uppercase">
                    {item.label}[cite: 1]
                  </p>
                ) : (
                  <div className="w-6 h-6 border border-[#D4AF37]/40 rounded-full animate-pulse" />
                )}
              </div>

              {/* Back Face */}
              <div 
                className="absolute inset-0 bg-[#D4AF37] text-[#0B1C15] flex flex-col justify-center items-center p-6 rotate-y-180 backface-hidden shadow-2xl"
                style={{ clipPath: item.clipClass }}
              >
                <p className="text-xs md:text-sm font-semibold font-mono text-center leading-tight">
                  {item.backText}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}