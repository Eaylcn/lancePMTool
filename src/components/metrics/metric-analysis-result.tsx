"use client";

import { useTranslations } from "next-intl";
import {
  Heart,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { MetricAiAnalysis } from "@/lib/metrics/types";

interface MetricAnalysisResultProps {
  analysis: MetricAiAnalysis | null;
}

export function MetricAnalysisResult({ analysis }: MetricAnalysisResultProps) {
  const t = useTranslations("metrics.analysis");

  if (!analysis) {
    return (
      <Card className="p-6 text-center">
        <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{t("noAnalysis")}</p>
      </Card>
    );
  }

  const scoreColor =
    analysis.healthScore >= 70
      ? "text-emerald-500"
      : analysis.healthScore >= 40
      ? "text-yellow-500"
      : "text-red-500";

  const scoreBg =
    analysis.healthScore >= 70
      ? "bg-emerald-500/20"
      : analysis.healthScore >= 40
      ? "bg-yellow-500/20"
      : "bg-red-500/20";

  return (
    <div className="space-y-4">
      {/* Health Score */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl ${scoreBg}`}>
            <Heart className={`h-8 w-8 ${scoreColor}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("healthScore")}</p>
            <p className={`text-4xl font-bold ${scoreColor}`}>
              {analysis.healthScore}
              <span className="text-lg text-muted-foreground">/100</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Summary */}
      {analysis.summary && (
        <Card className="p-4 space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            {t("summary")}
          </h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {analysis.summary}
          </p>
        </Card>
      )}

      {/* Benchmark Comparison from AI */}
      {analysis.benchmarkComparison.length > 0 && (
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            {t("benchmarkComparison")}
          </h3>
          <div className="space-y-2">
            {analysis.benchmarkComparison.map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium">{b.metric}</span>
                  {b.comment && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {b.comment}
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    b.verdict === "above"
                      ? "bg-emerald-500/20 text-emerald-500"
                      : b.verdict === "at"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {b.verdict}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Insights */}
      {analysis.insights.length > 0 && (
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            {t("insights")}
          </h3>
          <ul className="space-y-2">
            {analysis.insights.map((insight, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{insight}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            {t("recommendations")}
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-emerald-500 font-bold shrink-0">{i + 1}.</span>
                <span className="text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Risk Factors */}
      {analysis.riskFactors.length > 0 && (
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            {t("riskFactors")}
          </h3>
          <ul className="space-y-2">
            {analysis.riskFactors.map((risk, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{risk}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
