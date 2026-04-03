"use client";

import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { useChartColors } from "@/hooks/use-chart-colors";

interface GenreDistributionProps {
  data: Record<string, number>;
}

const COLORS = [
  "oklch(0.65 0.19 155)",   // emerald
  "oklch(0.62 0.18 250)",   // blue
  "oklch(0.58 0.19 293)",   // purple
  "oklch(0.75 0.18 75)",    // amber
  "oklch(0.65 0.19 340)",   // pink
  "oklch(0.70 0.17 45)",    // orange
  "oklch(0.72 0.14 200)",   // cyan
  "oklch(0.60 0.16 15)",    // red
];

export function GenreDistribution({ data }: GenreDistributionProps) {
  const t = useTranslations("growth");
  const { cardBg, borderColor, cardFg, themeKey } = useChartColors();

  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return (
      <Card className="rounded-xl border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-pink-500" />
            {t("genreDistribution")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
            {t("noAnalyses")}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-4 w-4 text-pink-500" />
          {t("genreDistribution")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer key={themeKey} width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: cardFg,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2">
          {chartData.map((entry, i) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
