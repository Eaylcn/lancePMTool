"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ArrowUp, ArrowDown, Minus, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComparisonBenchmarkProps {
  evaluationHistory: {
    avgGameScore: number;
    avgAnalysisQuality: number;
    observationLevel: string;
  }[];
}

const LEVEL_MAP: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, professional: 4 };

export function ComparisonBenchmark({ evaluationHistory }: ComparisonBenchmarkProps) {
  const t = useTranslations("growth");

  const comparison = useMemo(() => {
    if (evaluationHistory.length < 2) return null;

    const sorted = [...evaluationHistory].reverse(); // oldest first
    const earlyCount = Math.min(3, Math.floor(sorted.length / 2));
    const early = sorted.slice(0, earlyCount);
    const recent = sorted.slice(-earlyCount);

    const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / (arr.length || 1);

    const earlyGameScore = avg(early.map((e) => e.avgGameScore));
    const recentGameScore = avg(recent.map((e) => e.avgGameScore));
    const earlyQuality = avg(early.map((e) => e.avgAnalysisQuality));
    const recentQuality = avg(recent.map((e) => e.avgAnalysisQuality));
    const earlyLevel = avg(early.map((e) => LEVEL_MAP[e.observationLevel] || 1));
    const recentLevel = avg(recent.map((e) => LEVEL_MAP[e.observationLevel] || 1));

    return [
      {
        label: t("gameScore"),
        early: earlyGameScore.toFixed(1),
        recent: recentGameScore.toFixed(1),
        delta: recentGameScore - earlyGameScore,
        color: "text-emerald-500",
      },
      {
        label: t("analysisQuality"),
        early: earlyQuality.toFixed(1),
        recent: recentQuality.toFixed(1),
        delta: recentQuality - earlyQuality,
        color: "text-blue-500",
      },
      {
        label: t("observationLevel"),
        early: earlyLevel.toFixed(1),
        recent: recentLevel.toFixed(1),
        delta: recentLevel - earlyLevel,
        color: "text-purple-500",
      },
    ];
  }, [evaluationHistory, t]);

  return (
    <Card className="rounded-xl border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-500" />
          {t("benchmark")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!comparison ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t("needMoreData")}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {comparison.map((item) => {
              const DeltaIcon = item.delta > 0.05 ? ArrowUp : item.delta < -0.05 ? ArrowDown : Minus;
              const deltaColor = item.delta > 0.05 ? "text-emerald-500" : item.delta < -0.05 ? "text-red-500" : "text-muted-foreground";
              return (
                <div key={item.label} className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{item.early}</span>
                    <DeltaIcon className={`h-3.5 w-3.5 ${deltaColor}`} />
                    <span className={`text-lg font-bold ${item.color}`}>{item.recent}</span>
                  </div>
                  <p className={`text-xs font-medium ${deltaColor}`}>
                    {item.delta > 0 ? "+" : ""}{item.delta.toFixed(1)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
