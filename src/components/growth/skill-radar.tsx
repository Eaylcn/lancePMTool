"use client";

import { useTranslations } from "next-intl";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface SkillRadarProps {
  data: {
    category: string;
    avgGameScore: number;
    avgAnalysisQuality: number;
  }[];
}

export function SkillRadar({ data }: SkillRadarProps) {
  const t = useTranslations("growth");

  const chartData = data.map(d => ({
    category: t(`categories.${d.category}`),
    gameScore: d.avgGameScore,
    analysisQuality: d.avgAnalysisQuality,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-purple-500" />
          {t("skillRadar")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] select-none pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} outerRadius="70%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Radar
                name={t("gameScore")}
                dataKey="gameScore"
                stroke="hsl(142, 71%, 45%)"
                fill="hsl(142, 71%, 45%)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name={t("analysisQuality")}
                dataKey="analysisQuality"
                stroke="hsl(217, 91%, 60%)"
                fill="hsl(217, 91%, 60%)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {t("gameScore")}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            {t("analysisQuality")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
