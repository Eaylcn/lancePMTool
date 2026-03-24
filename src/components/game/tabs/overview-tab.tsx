"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer,
} from "recharts";

interface OverviewTabProps {
  analysis: Record<string, unknown> | null;
}

export function OverviewTab({ analysis }: OverviewTabProps) {
  const t = useTranslations("game");

  if (!analysis) {
    return <p className="text-muted-foreground">{t("noAnalysis")}</p>;
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
    <div className="space-y-6">
      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("categoryScores")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Overall insights */}
      <div className="grid gap-4 sm:grid-cols-2">
        {overallFields.map(({ key, label }) => {
          const value = analysis[key] as string;
          if (!value) return null;
          return (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
