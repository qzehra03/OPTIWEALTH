"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { loginUser } from "@/lib/api";
import { loginSchema } from "@/lib/validations/auth";
import { PremiumOptiWealthLogo } from "@/components/layout/PremiumOptiWealthLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { ApiError } from "@/lib/types";
import type { ZodError } from "zod";

function flattenZodErrors(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!result[path]) result[path] = issue.message;
  }
  return result;
}

const QUOTES = [
  {
    text: "The individual investor should act consistently as an investor and not as a speculator.",
    author: "Benjamin Graham",
    source: "The Intelligent Investor"
  },
  {
    text: "Rule No. 1 is never lose money. Rule No. 2 is never forget Rule No. 1.",
    author: "Warren Buffett",
    source: "Lessons for Corporate America"
  },
  {
    text: "The four most dangerous words in investing are: 'This time it's different.'",
    author: "Sir John Templeton",
    source: "The Templeton Touch"
  },
  {
    text: "In investing, what is comfortable is rarely profitable.",
    author: "Robert Arnott",
    source: "Journal of Portfolio Management"
  }
];

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Set default reviewer email for testing
  const [email, setEmail] = useState("sandbox.reviewer1@optiwealth.app");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const symbols = ['₹', '$', '€', '£', '¥', '₿'];
    const colors = ["#037A6B", "#4EBFA8"];
    const particleCount = 45;
    
    const particles = Array.from({ length: particleCount }).map(() => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        char: symbols[Math.floor(Math.random() * symbols.length)],
        speed: 0.3 + Math.random() * 0.9, // Gentle, non-distracting scroll speed
        opacity: 0.15 + Math.random() * 0.20, // Opacities ranging from 0.15 to 0.35
        color: colors[Math.floor(Math.random() * colors.length)],
        fontSize: 16 + Math.floor(Math.random() * 24), // Variable sizing (16px to 40px)
        weight: Math.random() > 0.6 ? "600" : Math.random() > 0.3 ? "500" : "400", // Mixed weights
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.weight} ${p.fontSize}px font-sans, Inter, sans-serif`;
        ctx.fillText(p.char, p.x, p.y);

        // Gently drift down
        p.y += p.speed;

        // Recycle coordinates back to top once they cross viewport
        if (p.y > height + p.fontSize) {
          p.y = -p.fontSize;
          p.x = Math.random() * width;
          p.char = symbols[Math.floor(Math.random() * symbols.length)];
          p.speed = 0.3 + Math.random() * 0.9;
          p.opacity = 0.15 + Math.random() * 0.20;
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors(flattenZodErrors(result.error));
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await loginUser({ email, password });
      login({
        accessToken: response.access_token,
        user: response.user,
      });
      router.push("/dashboard");
    } catch (err) {
      const apiErr = err as ApiError;
      setSubmitError(
        apiErr.message ?? "Sign in failed. Please verify your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-background via-background/95 to-luxe-copper/10 dark:to-luxe-emerald/5 relative overflow-hidden flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      
      {/* Dynamic Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block z-10" 
      />
      
      {/* Subtle classic workspace grid matrix lines overlay */}
      <div className="fintech-grid opacity-20 pointer-events-none absolute inset-0 z-10" />

      {/* Centered Interlocking Dual-Pane Container */}
      <div className="z-20 flex flex-col md:flex-row max-w-4xl w-full rounded-3xl overflow-hidden animate-fade-in-up border border-border shadow-xl bg-card text-foreground">
        
        {/* Left Control Panel (Sign-In Fields) */}
        <div className="w-full md:w-1/2 bg-card p-8 md:p-10 flex flex-col justify-between">
          
          {/* Brand Header Row */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <PremiumOptiWealthLogo className="h-7 w-7 text-luxe-copper dark:text-luxe-emerald shrink-0" />
              <span className="font-header font-bold text-xl tracking-tight text-foreground">
                OptiWealth
              </span>
            </div>
            <ThemeToggle />
          </div>

          {/* Center Login Form Wrapper */}
          <div className="my-auto py-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground font-header mb-1">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground font-sans mb-6">
                Sign in to your OptiWealth dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-header">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:bg-card focus:border-luxe-copper dark:focus:border-luxe-emerald focus:ring-1 focus:ring-luxe-copper dark:focus:ring-luxe-emerald transition-all text-sm font-sans text-foreground outline-none"
                  required
                  placeholder="e.g. sandbox.reviewer1@optiwealth.app"
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 font-sans mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-header">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:bg-card focus:border-luxe-copper dark:focus:border-luxe-emerald focus:ring-1 focus:ring-luxe-copper dark:focus:ring-luxe-emerald transition-all text-sm font-sans text-foreground pr-10 outline-none"
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 font-sans mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit Error alert */}
              {submitError && (
                <div
                  className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive font-sans font-medium"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              {/* Action Button CTA */}
              <button 
                type="submit" 
                className="w-full py-3 bg-luxe-copper hover:bg-luxe-copper/90 dark:bg-luxe-emerald dark:hover:bg-luxe-emerald/90 text-white rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-md mt-4 font-sans outline-none disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Onboarding Link */}
            <p className="text-center text-sm text-muted-foreground font-sans mt-4">
              New to OptiWealth?{" "}
              <Link href="/onboard" className="font-semibold text-luxe-copper dark:text-luxe-emerald hover:underline">
                Create your profile
              </Link>
            </p>
          </div>

          {/* Footer info */}
          <div className="text-[10px] text-muted-foreground font-sans text-center md:text-left mt-4">
            OptiWealth © 2026. Secure personal finance sandbox.
          </div>

        </div>

        {/* Right Viewport Panel (The Frosted Mint Quote Block) */}
        <div className="w-full md:w-1/2 bg-secondary/35 dark:bg-black/15 backdrop-blur-md p-8 md:p-10 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border">
          
          {/* Header Status Badge */}
          <div className="flex items-center gap-2 self-start bg-luxe-copper/10 dark:bg-luxe-emerald/10 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest text-luxe-copper dark:text-luxe-emerald uppercase font-header">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxe-copper dark:bg-luxe-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-luxe-copper dark:bg-luxe-emerald"></span>
            </span>
            <span>ENGINE STATUS: ACTIVE</span>
          </div>

          {/* Rotating Quote List */}
          <div className="my-auto py-8 transition-all duration-500 ease-in-out">
            <p className="text-foreground text-base md:text-lg italic font-semibold leading-relaxed font-sans">
              &ldquo;{QUOTES[currentQuoteIndex].text}&rdquo;
            </p>
            <p className="text-luxe-copper dark:text-luxe-emerald text-xs font-bold uppercase tracking-widest mt-4 font-header">
              — {QUOTES[currentQuoteIndex].author}, {QUOTES[currentQuoteIndex].source}
            </p>
          </div>

          {/* Footer status text */}
          <div className="text-[10px] text-muted-foreground font-sans">
            Real-time telemetry and capital allocation engine active.
          </div>

        </div>

      </div>

    </div>
  );
}
