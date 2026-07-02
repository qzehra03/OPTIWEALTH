"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

const RULES = [
  { title: "50/30/20\nRULE", detail: "Split take-home pay: 50% needs, 30% wants, 20% savings & debt paydown. Non-negotiable capital hygiene." },
  { title: "THE 4%\nWITHDRAWAL RULE", detail: "Withdraw ≤4% of portfolio per year in retirement (inflation-adjusted). Mathematically survives 30+ years." },
  { title: "PAY YOURSELF FIRST\nRULE", detail: "Auto-transfer your savings the moment income arrives. Discipline by design — not willpower." },
  { title: "3X TO 6X\nEMERGENCY RULE", detail: "Keep 3–6 months of expenses in a liquid account at all times. Your financial shock absorber." },
  { title: "10-5-3 EXPECTED\nRETURN PARADIGM", detail: "Equities ~10%, bonds ~5%, cash ~3% long-run. Calibrate your risk allocation accordingly." },
  { title: "\"100 MINUS AGE\"\nASSET ALLOCATION", detail: "100 − your age = recommended equity %. At 30: 70% equities. Rebalance yearly." },
  { title: "40% EMI/DEBT\nLIMIT", detail: "Monthly EMIs must never exceed 40% of gross income. Beyond this, cash flow becomes structurally fragile." },
  { title: "THE RULE OF 72", detail: "72 ÷ return rate = years to double your money." },
  { title: "THE RULE OF 70", detail: "70 ÷ inflation rate = years until purchasing power halves. Inflation is a silent wealth tax." },
];

const QUOTES = [
  { text: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" },
  { text: "Doing well with money has a little to do with how smart you are and a lot to do with how you behave.", author: "Morgan Housel" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "In investing, what is comfortable is rarely profitable.", author: "Robert Arnott" },
  { text: "Every time you borrow money, you're robbing your future self.", author: "Nathan W. Morris" },
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "The four most dangerous words in investing are: 'this time it's different'.", author: "Sir John Templeton" },
  { text: "Compound interest is the eighth wonder of the world.", author: "Albert Einstein" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Time is the friend of the wonderful company, the enemy of the mediocre.", author: "Warren Buffett" },
  { text: "Risk comes from not knowing what you're doing.", author: "Warren Buffett" },
  { text: "The most important quality for an investor is temperament, not intellect.", author: "Warren Buffett" },
  { text: "It's not how much money you make, but how much money you keep.", author: "Robert Kiyosaki" },
  { text: "Wealth is what you don't see.", author: "Morgan Housel" },
  { text: "Money is a terrible master but an excellent servant.", author: "P.T. Barnum" },
  { text: "Never depend on single income. Make investment to create a second source.", author: "Warren Buffett" },
  { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
  { text: "If you buy things you do not need, soon you will have to sell things you need.", author: "Warren Buffett" },
];

type PolyDef = {
  pts: string;       // CSS clip-path polygon points
  tx: number;        // text center X %
  ty: number;        // text center Y %
  type: "rule" | "quote";
  idx: number;       // index into RULES or QUOTES
  scale?: number;    // optional text scale
};

// Centers exactly computed from the dark background image gold line regions
const REGIONS = [
  { tx: 25.95, ty: 9.55, type: "rule", idx: 0, scale: 0.95 },  // 50/30/20
  { tx: 46.06, ty: 12.88, type: "quote", idx: 0, scale: 0.8 },
  { tx: 70.88, ty: 6.00, type: "rule", idx: 1, scale: 0.95 },   // 4% Rule
  // Moved from top-left (7.72, 7.61) to new empty region on the top-right
  { tx: 85.00, ty: 18.00, type: "quote", idx: 1, scale: 0.7 },
  { tx: 6.55, ty: 25.46, type: "quote", idx: 2, scale: 0.7 },
  { tx: 73.51, ty: 25.40, type: "rule", idx: 2, scale: 0.95 },  // Pay Yourself
  { tx: 91.97, ty: 28.25, type: "quote", idx: 3, scale: 0.7 },
  { tx: 21.50, ty: 37.14, type: "quote", idx: 4, scale: 0.8 },
  { tx: 40.86, ty: 34.16, type: "rule", idx: 4, scale: 0.95 },  // 10-5-3
  { tx: 8.07, ty: 58.29, type: "quote", idx: 5, scale: 0.7 },
  { tx: 44.96, ty: 55.12, type: "rule", idx: 3, scale: 0.95 },  // 3X to 6X
  { tx: 87.41, ty: 49.20, type: "quote", idx: 6, scale: 0.8 },
  { tx: 58.73, ty: 60.21, type: "rule", idx: 6, scale: 0.95 },  // EMI
  { tx: 80.95, ty: 64.38, type: "quote", idx: 8, scale: 0.8 },
  { tx: 18.56, ty: 78.03, type: "rule", idx: 5, scale: 0.95 },  // 100 Minus Age
  { tx: 41.37, ty: 78.28, type: "rule", idx: 7, scale: 0.95 },  // Rule 72
  { tx: 63.25, ty: 84.61, type: "rule", idx: 8, scale: 0.95 },  // Rule 70
  { tx: 81.17, ty: 88.64, type: "quote", idx: 9, scale: 0.7 },
  { tx: 47.57, ty: 94.84, type: "quote", idx: 12, scale: 0.8 },
];

function Tile({ r, isDark }: { r: any; isDark: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isRule = r.type === "rule";
  const rule = isRule ? RULES[r.idx] : null;
  const quote = !isRule ? QUOTES[r.idx] : null;

  const gold = isDark ? "#D4AF37" : "#B8960E";
  const backText = isDark ? "#E2E8F0" : "#1A2E22";
  const shadow = isDark ? "0 2px 6px rgba(0,0,0,0.8)" : "0 1px 4px rgba(0,0,0,0.3)";

  return (
    <div
      className="absolute cursor-pointer group"
      style={{
        left: `${r.tx}%`,
        top: `${r.ty}%`,
        width: isRule ? "130px" : "120px",
        height: "120px",
        transform: `translate(-50%, -50%) scale(${r.scale ?? 1})`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(f => !f)}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Front */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-1 transition-opacity duration-500 ${hovered ? 'opacity-0' : 'opacity-100'}`}
        >
          {isRule && rule && (
            <h3 className="text-[12px] md:text-[14px] font-black tracking-widest uppercase leading-tight whitespace-pre-line font-display"
              style={{ color: gold, textShadow: shadow }}>
              {rule.title}
            </h3>
          )}
          {!isRule && quote && (
            <p className="text-[10px] md:text-[12px] font-serif italic leading-relaxed font-semibold drop-shadow-md"
              style={{ color: gold, maxWidth: "150px", textShadow: shadow }}>
              &ldquo;{quote.text}&rdquo;
            </p>
          )}
        </div>
        {/* Back (Details) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-2 transition-opacity duration-500 rounded-xl backdrop-blur-md ${hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ backgroundColor: isDark ? "rgba(11,28,21,0.85)" : "rgba(245,245,240,0.85)" }}
        >
          {isRule && rule && (
            <p className="text-[11px] md:text-[13px] font-medium leading-relaxed drop-shadow-md" style={{ color: backText }}>
              {rule.detail}
            </p>
          )}
          {!isRule && quote && (
            <p className="text-[10px] md:text-[12px] font-bold tracking-widest uppercase drop-shadow-md font-sans" style={{ color: gold }}>
              &mdash; {quote.author}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TriangleWall() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section id="rules" className="relative w-full py-20 px-4 md:px-12 flex justify-center"
      style={{ backgroundColor: isDark ? "#0B1C15" : "#F5F5F0" }}>
      <div className="max-w-7xl w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-3 z-10 relative">
          <p className="font-script text-4xl md:text-6xl drop-shadow-lg"
            style={{ color: isDark ? "#D4AF37" : "#B8960E" }}>
            The Architecture of Capital
          </p>
          <p className="text-xs md:text-sm max-w-lg mx-auto font-medium tracking-wide"
            style={{ color: isDark ? "#8FB89A" : "#4F6E56" }}>
            Hover over each rule to reveal the mathematical blueprints of wealth preservation.
          </p>
        </div>

        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/30 ring-1 ring-[#D4AF37]/10">
          {/* Background Image */}
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${isDark ? "/bg-triangle-dark.png" : "/bg-triangle-light-final.png"}')` }} />

          {/* All Precise Center Tiles */}
          {REGIONS.map((r, i) => (
            <Tile key={i} r={r} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}
