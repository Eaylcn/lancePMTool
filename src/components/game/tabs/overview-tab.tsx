"use client";

import { useTranslations } from "next-intl";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer,
} from "recharts";
import { Sparkles } from "lucide-react";

interface OverviewTabProps {
  analysis: Record<string, unknown> | null;
  aiSummary?: string | null;
}

export function OverviewTab({ analysis, aiSummary }: OverviewTabProps) {
  const t = useTranslations("game");

  if (!analysis) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">{t("noAnalysis")}</p>
      </div>
    );
  }

  const radarData = [
    { category: "FTUE", value: Number(analysis.ftueRating) || 0 },
    { category: "Core Loop", value: Number(analysis.coreLoopRating) || 0 },
    { category: "Monetization", value: Number(analysis.monetizationRating) || 0 },
    { category: "Retention", value: Number(analysis.retentionRating) || 0 },
    { category: "UX/UI", value: Number(analysis.uxRating) || 0 },
    { category: "Meta Game", value: Number(analysis.metaRating) || 0 },
    { category: "Technical", value: Number(analysis.techRating) || 0 },
  ];

  const overallFields = [
    { key: "overallBestFeature", label: t("bestFeature") },
    { key: "overallWorstFeature", label: t("worstFeature") },
    { key: "overallUniqueMechanic", label: t("uniqueMechanic") },
    { key: "overallTargetAudience", label: t("targetAudience") },
    { key: "overallLearnings", label: t("learnings") },
  ];

  return (
    <div className="space-y-8">
      {/* Radar + AI Summary side by side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Radar Chart — left, no title, not selectable */}
        <div className="lg:w-[360px] shrink-0 select-none" style={{ outline: "none" }} tabIndex={-1}>
          <div className="h-[280px] pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#6366f1" strokeOpacity={0.25} />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Summary — right */}
        {aiSummary && (
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("executiveSummary")}
            </h3>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {aiSummary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Overall Insights */}
      <div>
        <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
          <div className="h-5 w-1 rounded-full bg-primary" />
          {t("tabs.overview")}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {overallFields.map(({ key, label }) => {
            const value = analysis[key] as string;
            if (!value) return null;
            return (
              <div key={key} className="rounded-lg border border-border p-4 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-sm leading-relaxed">{value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
