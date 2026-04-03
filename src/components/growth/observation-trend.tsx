"use client";

import { useTranslations } from "next-intl";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useChartColors } from "@/hooks/use-chart-colors";

interface ObservationTrendProps {
  data: {
    gameTitle: string;
    level: string;
    levelNumeric: number;
    date: string;
  }[];
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
  4: "Professional",
};

export function ObservationTrend({ data }: ObservationTrendProps) {
  const t = useTranslations("growth");
  const { mutedFg, borderColor, cardBg, cardFg, themeKey } = useChartColors();

  const chartData = data.map((d, i) => ({
    index: i + 1,
    gameTitle: d.gameTitle.length > 15 ? d.gameTitle.slice(0, 15) + "..." : d.gameTitle,
    level: d.levelNumeric,
    fullTitle: d.gameTitle,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          {t("observationTrend")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
            {t("noAnalyses")}
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer key={themeKey} width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                <XAxis
                  dataKey="gameTitle"
                  tick={{ fontSize: 10, fill: mutedFg }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  domain={[0, 4]}
                  ticks={[1, 2, 3, 4]}
                  tickFormatter={(val: number) => LEVEL_LABELS[val] || ""}
                  tick={{ fontSize: 10, fill: mutedFg }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: cardFg,
                  }}
                  formatter={(value) => [LEVEL_LABELS[value as number] || value, t("observationLevel")]}
                  labelFormatter={(label) => String(label)}
                />
                <Line
                  type="monotone"
                  dataKey="level"
                  stroke="hsl(142, 71%, 45%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(142, 71%, 45%)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
