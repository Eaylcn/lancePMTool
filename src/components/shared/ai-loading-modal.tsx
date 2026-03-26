"use client";

import { useState, useEffect } from "react";
import { Brain, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface AiLoadingModalProps {
  open: boolean;
  title: string;
  steps: string[];
  currentStep: number;
  elapsedSeconds: number;
}

const PM_TIPS = [
  "D1 retention %35+ endüstri standardıdır.",
  "Whale oyuncular gelirin %50-70'ini oluşturur.",
  "FTUE ilk 5 dakikası D1 retention'ı doğrudan etkiler.",
  "LTV = ARPDAU × Lifetime (retention'dan türetilir).",
  "Starter pack $0.99-$2.99 arasında olmalı.",
  "Battle Pass sezon süresi genellikle 4-8 haftadır.",
  "DAU/MAU oranı %20+ iyi bir stickiness göstergesidir.",
  "A/B testte p < 0.05 istatistiksel anlamlılık için gereklidir.",
  "Soft launch ülkeleri: Kanada, Avustralya, Nordik ülkeleri.",
  "Progressive disclosure: bilgiyi kademeli göster, oyuncuyu bunaltma.",
  "CPI > LTV ise oyun kâr edemez.",
  "Session length casualda 3-5dk, mid-core'da 10-15dk idealdir.",
  "Rewarded ads en yüksek eCPM veren reklam formatıdır.",
  "FOMO mekanikleri kısa vadede retention artırır ama churn riski taşır.",
];

export function AiLoadingModal({ open, title, steps, currentStep, elapsedSeconds }: AiLoadingModalProps) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setTipIndex(Math.floor(Math.random() * PM_TIPS.length));
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % PM_TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [open]);

  const progressPercent = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeStr = minutes > 0
    ? `${minutes}:${seconds.toString().padStart(2, "0")}`
    : `0:${seconds.toString().padStart(2, "0")}`;

  return (
    <Dialog open={open} onOpenChange={() => {}} disablePointerDismissal>
      <DialogContent
        className="sm:max-w-md overflow-hidden p-0"
        showCloseButton={false}
      >
        {/* Gradient header with pulsing icon */}
        <div className="relative bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5 px-6 pt-8 pb-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(var(--primary-rgb,99,102,241),0.12),transparent_60%)]" />

          {/* Pulsing brain icon */}
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute inset-0 h-16 w-16 rounded-2xl bg-primary/20 animate-ping opacity-30" />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center">
              <Brain className="h-7 w-7 text-primary animate-pulse" />
            </div>
          </div>

          <h3 className="text-base font-semibold relative">{title}</h3>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 rounded-full bg-muted/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progressPercent, 95)}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="px-6 py-4 space-y-2.5">
          {steps.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  isDone ? "opacity-60" : isActive ? "opacity-100" : "opacity-30"
                }`}
              >
                {isDone && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </div>
                )}
                {isActive && (
                  <div className="relative flex h-6 w-6 items-center justify-center">
                    <div className="absolute h-6 w-6 rounded-full bg-primary/20 animate-ping opacity-40" />
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                )}
                {!isDone && !isActive && (
                  <div className="h-6 w-6 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
                  </div>
                )}
                <span className={`text-sm ${
                  isDone ? "text-muted-foreground" : isActive ? "text-foreground font-medium" : "text-muted-foreground/40"
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* PM Tip + Timer */}
        <div className="px-6 pb-5 space-y-3">
          {/* PM Tip */}
          <div className="rounded-lg bg-muted/40 border border-border/50 px-3.5 py-2.5">
            <div className="flex items-start gap-2">
              <span className="text-xs shrink-0 mt-0.5">💡</span>
              <p className="text-xs text-muted-foreground leading-relaxed transition-all duration-500">
                {PM_TIPS[tipIndex]}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center">
            <span className="text-xs text-muted-foreground/60 tabular-nums">
              {timeStr}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
