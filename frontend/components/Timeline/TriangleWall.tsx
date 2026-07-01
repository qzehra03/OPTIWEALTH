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

// Extracted from the perfect black and white image mapping!
const POLYGONS: PolyDef[] = [
  // User 1 (Poly 2)
  { pts: "0.60% 32.42%, 0.60% 0.74%, 3.48% 9.96%, 4.14% 7.52%, 5.76% 12.08%, 6.54% 8.90%, 9.60% 13.03%, 6.66% 8.90%, 8.10% 5.30%, 1.56% 0.85%, 8.82% 0.64%, 17.89% 16.00%", tx: 7.0, ty: 15.0, type: "quote", idx: 0, scale: 0.65 },
  // User 2 (Poly 0)
  { pts: "9.06% 0.74%, 36.85% 0.85%, 25.75% 28.39%", tx: 23.9, ty: 10.1, type: "rule", idx: 0 },
  // User 3 (Poly 3)
  { pts: "27.13% 27.01%, 37.09% 0.64%, 55.64% 0.85%, 56.12% 16.95%", tx: 43.0, ty: 12.1, type: "quote", idx: 1, scale: 0.8 },
  // User 4 (Poly 1)
  { pts: "56.30% 16.63%, 55.82% 0.64%, 91.66% 0.74%", tx: 68.2, ty: 6.0, type: "rule", idx: 1 },
  // User 5 (Poly 4)
  { pts: "99.34% 0.74%, 99.04% 4.34%, 78.99% 31.46%, 73.05% 10.28%, 92.38% 0.64%", tx: 84.9, ty: 13.0, type: "quote", idx: 2, scale: 0.8 },
  // User 6 (Poly 5)
  { pts: "25.57% 28.39%, 15.97% 43.64%, 0.60% 35.70%, 0.66% 32.73%, 17.95% 16.21%", tx: 13.8, ty: 30.7, type: "quote", idx: 3, scale: 0.7 },
  // User 7 (Poly 6)
  { pts: "55.40% 17.48%, 41.48% 43.11%, 27.25% 27.44%", tx: 41.3, ty: 29.1, type: "rule", idx: 2 },
  // User 8 (Poly 7)
  { pts: "72.69% 10.38%, 62.18% 42.06%, 51.02% 25.64%, 55.70% 17.27%", tx: 61.6, ty: 24.5, type: "quote", idx: 4, scale: 0.75 },
  // User 9 (Poly 9)
  { pts: "99.28% 4.24%, 99.34% 30.83%, 81.63% 41.53%, 78.99% 31.78%", tx: 90.9, ty: 25.6, type: "quote", idx: 5, scale: 0.7 },
  // User 10 (Poly 10)
  { pts: "18.19% 40.25%, 27.01% 27.44%, 41.30% 43.43%, 36.31% 52.12%", tx: 30.0, ty: 40.1, type: "quote", idx: 6, scale: 0.8 },
  // User 11 (Poly 13)
  { pts: "50.78% 26.17%, 54.14% 59.85%, 35.23% 54.77%", tx: 46.7, ty: 46.9, type: "rule", idx: 3 },
  // User 12 (Poly 8)
  { pts: "72.93% 10.28%, 81.33% 41.10%, 62.55% 41.84%", tx: 72.2, ty: 30.9, type: "rule", idx: 4 },
  // User 13 (Poly 11)
  { pts: "15.73% 43.64%, 0.66% 72.03%, 0.60% 36.12%", tx: 5.6, ty: 50.5, type: "quote", idx: 7, scale: 0.6 },
  // User 14 & 19 (Poly 19)
  { pts: "17.95% 40.68%, 28.09% 89.09%, 0.60% 77.12%, 0.60% 72.46%", tx: 15.2, ty: 68.5, type: "rule", idx: 5 },
  // User 15 (Poly 18)
  { pts: "18.19% 40.78%, 36.25% 52.44%, 24.07% 67.16%", tx: 26.2, ty: 53.3, type: "quote", idx: 8, scale: 0.65 },
  // User 16 (Poly 15)
  { pts: "50.96% 26.06%, 69.03% 53.60%, 57.20% 61.02%, 54.26% 60.06%", tx: 58.2, ty: 46.9, type: "quote", idx: 9, scale: 0.8 },
  // User 17 (Poly 16)
  { pts: "62.30% 42.16%, 81.39% 41.42%, 99.34% 61.02%, 69.45% 54.03%", tx: 79.5, ty: 50.0, type: "quote", idx: 10, scale: 0.8 },
  // User 18 (Poly 17)
  { pts: "99.34% 59.85%, 81.87% 41.63%, 99.28% 31.14%", tx: 93.5, ty: 44.2, type: "quote", idx: 11, scale: 0.7 },
  // User 20 (Poly 20)
  { pts: "34.81% 54.98%, 30.19% 86.02%, 28.81% 88.14%, 24.07% 67.48%", tx: 29.5, ty: 70.7, type: "quote", idx: 12, scale: 0.65 },
  // User 21 (Poly 21)
  { pts: "30.25% 86.12%, 35.05% 54.87%, 56.84% 61.12%", tx: 40.7, ty: 67.4, type: "rule", idx: 6 },
  // User 22 (Poly 22)
  { pts: "69.03% 54.03%, 59.18% 92.80%, 40.34% 76.91%, 57.02% 61.23%", tx: 56.1, ty: 73.7, type: "rule", idx: 7 },
  // User 23 (Poly 24)
  { pts: "69.27% 53.92%, 82.29% 81.36%, 59.48% 92.48%", tx: 70.3, ty: 75.8, type: "rule", idx: 8 },
  // User 24 (Poly 23)
  { pts: "69.63% 54.34%, 98.92% 61.33%, 81.63% 79.66%", tx: 83.4, ty: 64.9, type: "quote", idx: 13, scale: 0.8 },
  // User 25 (Poly 25)
  { pts: "99.22% 61.23%, 99.28% 99.26%, 81.75% 79.98%", tx: 93.3, ty: 80.1, type: "quote", idx: 14, scale: 0.7 },
  // User 26 (Poly 26)
  { pts: "0.60% 77.54%, 27.85% 89.41%, 20.83% 99.26%, 0.66% 99.15%", tx: 11.4, ty: 90.4, type: "quote", idx: 15, scale: 0.65 },
  // User 27 (Poly 27)
  { pts: "21.19% 99.05%, 40.16% 77.01%, 64.05% 99.15%", tx: 41.8, ty: 91.5, type: "quote", idx: 16, scale: 0.8 },
  // User 28 (Poly 30)
  { pts: "98.92% 99.15%, 64.41% 99.26%, 59.36% 92.90%, 82.47% 81.57%", tx: 78.6, ty: 92.8, type: "quote", idx: 17, scale: 0.8 },
];

function Tile({ p, isDark }: { p: PolyDef; isDark: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const isRule = p.type === "rule";
  const rule = isRule ? RULES[p.idx] : null;
  const quote = !isRule ? QUOTES[p.idx] : null;

  const gold = isDark ? "#D4AF37" : "#B8960E";
  const backBg = isDark ? "rgba(11,28,21,0.95)" : "rgba(245,245,240,0.95)";
  const backText = isDark ? "#E2E8F0" : "#1A2E22";
  const shadow = isDark ? "0 2px 6px rgba(0,0,0,0.8)" : "0 1px 4px rgba(0,0,0,0.3)";

  return (
    <div
      className="absolute inset-0 cursor-pointer group"
      style={{
        clipPath: `polygon(${p.pts})`,
        backgroundColor: flipped ? backBg : "transparent",
        transition: "background-color 0.45s ease",
      }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        className="absolute"
        style={{
          left: `${p.tx}%`,
          top: `${p.ty}%`,
          width: isRule ? "160px" : "150px",
          height: "130px",
          transform: `translate(-50%, -50%) scale(${p.scale ?? 1})`,
          perspective: "600px",
        }}
      >
        <div
          style={{
            width: "100%", height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-1"
          >
            {isRule && rule && (
              <h3 className="text-[11px] md:text-[13px] font-bold tracking-widest uppercase leading-snug whitespace-pre-line group-hover:scale-105 transition-transform duration-300"
                style={{ color: gold, textShadow: shadow }}>
                {rule.title}
              </h3>
            )}
            {!isRule && quote && (
              <p className="text-[9px] md:text-[11px] font-serif italic leading-relaxed group-hover:scale-105 transition-transform duration-300"
                style={{ color: gold, maxWidth: "130px", textShadow: shadow }}>
                &ldquo;{quote.text}&rdquo;
              </p>
            )}
          </div>
          {/* Back */}
          <div
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-2 bg-transparent"
          >
            {isRule && rule && (
              <p className="text-[9px] md:text-[11px] font-medium leading-relaxed drop-shadow-md" style={{ color: backText }}>
                {rule.detail}
              </p>
            )}
            {!isRule && quote && (
              <p className="text-[9px] md:text-[11px] font-bold tracking-widest uppercase drop-shadow-md" style={{ color: gold }}>
                &mdash; {quote.author}
              </p>
            )}
          </div>
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
            style={{ backgroundImage: `url('${isDark ? "/bg-triangle-dark.png" : "/bg-triangle-light.png"}')` }} />

          {/* All 27 Perfect Tiles */}
          {POLYGONS.map((p, i) => (
            <Tile key={i} p={p} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}
