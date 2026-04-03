"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, AlertCircle, Lightbulb, ArrowRight, Sparkles } from "lucide-react";

interface FinalFeedback {
  overallReadiness: "low" | "medium" | "high";
  avgScore: number;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
  summary: string;
}

interface FinalEvaluationProps {
  feedback: FinalFeedback;
}

const READINESS_CONFIG = {
  low: {
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    ringColor: "text-red-500",
    label: "low",
  },
  medium: {
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    ringColor: "text-yellow-500",
    label: "medium",
  },
  high: {
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    ringColor: "text-green-500",
    label: "high",
  },
};

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = score >= 7 ? "text-green-500" : score >= 5 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={cn("transition-all duration-1000", color)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-xl font-bold", color)}>{score.toFixed(1)}</span>
        <span className="text-[10px] text-muted-foreground">/10</span>
      </div>
    </div>
  );
}

function ReadinessGauge({ level }: { level: "low" | "medium" | "high" }) {
  const config = READINESS_CONFIG[level];
  const levels = ["low", "medium", "high"] as const;
  const activeIndex = levels.indexOf(level);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1.5">
        {levels.map((l, i) => (
          <div
            key={l}
            className={cn(
              "h-3 w-8 rounded-full transition-all",
              i <= activeIndex ? config.bg.replace("/10", "/60") : "bg-muted/40"
            )}
            style={i <= activeIndex ? {
              backgroundColor: l === "low" ? "oklch(0.637 0.237 25.331 / 0.6)" :
                l === "medium" ? "oklch(0.795 0.184 86.047 / 0.6)" :
                "oklch(0.723 0.219 142.498 / 0.6)"
            } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function FinalEvaluation({ feedback }: FinalEvaluationProps) {
  const t = useTranslations("interview");
  const readinessConfig = READINESS_CONFIG[feedback.overallReadiness];
  const isHigh = feedback.overallReadiness === "high";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2 py-2">
        <div className="relative inline-block">
          <Trophy className={cn("h-12 w-12 mx-auto", isHigh ? "text-yellow-500" : "text-muted-foreground/60")} />
          {isHigh && (
            <Sparkles className="h-5 w-5 text-yellow-400 absolute -top-1 -right-2 animate-pulse" />
          )}
        </div>
        <h2 className="text-xl font-bold">{t("finalEvaluation")}</h2>
      </div>

      {/* Score + Readiness */}
      <div className="flex justify-center gap-6">
        <Card className="text-center rounded-xl border-border/60">
          <CardContent className="p-5 flex flex-col items-center gap-2">
            <ScoreRing score={feedback.avgScore} />
            <p className="text-xs text-muted-foreground font-medium">{t("avgScore")}</p>
          </CardContent>
        </Card>
        <Card className={cn("text-center rounded-xl border", readinessConfig.border, readinessConfig.bg)}>
          <CardContent className="p-5 flex flex-col items-center gap-3 justify-center">
            <p className={cn("text-lg font-bold", readinessConfig.color)}>
              {t(`readiness.${feedback.overallReadiness}`)}
            </p>
            <ReadinessGauge level={feedback.overallReadiness} />
            <p className="text-xs opacity-70">{t("overallReadiness")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {feedback.summary && (
        <Card className="rounded-xl border-border/60">
          <CardContent className="p-4">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{feedback.summary}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        {feedback.strengths.length > 0 && (
          <Card className="rounded-xl border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="rounded-lg bg-green-500/10 p-1.5">
                  <TrendingUp className="h-4 w-4" />
                </div>
                {t("strengths")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1.5">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-green-500 mt-0.5">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Improvements */}
        {feedback.improvements.length > 0 && (
          <Card className="rounded-xl border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <div className="rounded-lg bg-orange-500/10 p-1.5">
                  <AlertCircle className="h-4 w-4" />
                </div>
                {t("improvements")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1.5">
                {feedback.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-orange-500 mt-0.5">-</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Next Steps */}
      {feedback.nextSteps.length > 0 && (
        <Card className="rounded-xl border-border/60 bg-blue-500/5 dark:bg-blue-500/8">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="rounded-lg bg-blue-500/10 p-1.5">
                <Lightbulb className="h-4 w-4" />
              </div>
              {t("nextSteps")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {feedback.nextSteps.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
