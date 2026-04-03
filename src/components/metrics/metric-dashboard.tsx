"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
  BarChart, Bar, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3, Heart, Gamepad2, Calendar,
  TrendingUp, TrendingDown, Activity, Layers,
} from "lucide-react";
import { useChartColors } from "@/hooks/use-chart-colors";
import type { MetricAiAnalysis } from "@/lib/metrics/types";

interface AnalysisItem {
  id: string;
  gameId: string;
  gameTitle: string | null;
  rawMetrics: unknown;
  derivedMetrics: unknown;
  aiAnalysis: MetricAiAnalysis | null;
  createdAt: string;
}

interface MetricDashboardProps {
  analyses: AnalysisItem[];
}

const GENRE_COLORS = [
  "oklch(0.65 0.19 155)",
  "oklch(0.62 0.18 250)",
  "oklch(0.58 0.19 293)",
  "oklch(0.75 0.18 75)",
  "oklch(0.65 0.19 340)",
  "oklch(0.70 0.17 45)",
  "oklch(0.72 0.14 200)",
  "oklch(0.60 0.16 15)",
];

export function MetricDashboard({ analyses }: MetricDashboardProps) {
  const t = useTranslations("metrics.dashboard");
  const { mutedFg, borderColor, cardBg, cardFg, themeKey } = useChartColors();

  const stats = useMemo(() => {
    const withScore = analyses.filter((a) => a.aiAnalysis?.healthScore != null);
    const scores = withScore.map((a) => a.aiAnalysis!.healthScore);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const worstScore = scores.length > 0 ? Math.min(...scores) : 0;
    const uniqueGames = new Set(analyses.map((a) => a.gameId)).size;
    const lastDate = analyses.length > 0 ? new Date(analyses[0].createdAt).toLocaleDateString() : "—";

    return {
      totalAnalyses: analyses.length,
      avgScore,
      bestScore,
      worstScore,
      uniqueGames,
      lastDate,
    };
  }, [analyses]);

  // Trend data — chronological order
  const trendData = useMemo(() => {
    return [...analyses]
      .filter((a) => a.aiAnalysis?.healthScore != null)
      .reverse()
      .map((a, i) => ({
        index: i + 1,
        score: a.aiAnalysis!.healthScore,
        game: a.gameTitle && a.gameTitle.length > 12 ? a.gameTitle.slice(0, 12) + "..." : (a.gameTitle || "—"),
        fullTitle: a.gameTitle || "—",
        date: new Date(a.createdAt).toLocaleDateString(),
      }));
  }, [analyses]);

  // Genre distribution from raw metrics (using genre info from analyses)
  const genreData = useMemo(() => {
    const genreCounts: Record<string, number> = {};
    analyses.forEach((a) => {
      const raw = a.rawMetrics as Record<string, unknown> | null;
      // We don't have genre stored directly, so group by game
      const title = a.gameTitle || "Diğer";
      genreCounts[title] = (genreCounts[title] || 0) + 1;
    });
    return Object.entries(genreCounts)
      .map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + "..." : name, value, fullName: name }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [analyses]);

  // Recent analyses (last 5)
  const recentAnalyses = useMemo(() => analyses.slice(0, 5), [analyses]);

  const statCards = [
    { key: "totalAnalyses", value: stats.totalAnalyses, icon: BarChart3, color: "text-blue-500" },
    { key: "avgScore", value: stats.avgScore > 0 ? `${stats.avgScore}/100` : "—", icon: Activity, color: "text-emerald-500" },
    { key: "bestScore", value: stats.bestScore > 0 ? stats.bestScore : "—", icon: TrendingUp, color: "text-green-500" },
    { key: "worstScore", value: stats.worstScore > 0 ? stats.worstScore : "—", icon: TrendingDown, color: "text-red-500" },
    { key: "uniqueGames", value: stats.uniqueGames, icon: Gamepad2, color: "text-purple-500" },
    { key: "lastAnalysis", value: stats.lastDate, icon: Calendar, color: "text-amber-500" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-emerald-500/20";
    if (score >= 40) return "bg-yellow-500/20";
    return "bg-red-500/20";
  };

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card) => (
          <Card key={card.key} className="border-border/50">
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`h-4 w-4 ${card.color}`} />
                <span className="text-xs text-muted-foreground">{t(`stats.${card.key}`)}</span>
              </div>
              <p className="text-xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Health Score Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              {t("healthTrend")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
                {t("noData")}
              </div>
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer key={themeKey} width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                    <XAxis
                      dataKey="game"
                      tick={{ fontSize: 10, fill: mutedFg }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: mutedFg }}
                      width={35}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: cardBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: cardFg,
                      }}
                      formatter={(value) => [`${value}/100`, t("stats.avgScore")]}
                      labelFormatter={(_, payload) => {
                        const item = payload?.[0]?.payload;
                        return item ? `${item.fullTitle} — ${item.date}` : "";
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
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

        {/* Game Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-pink-500" />
              {t("gameDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {genreData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
                {t("noData")}
              </div>
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer key={`bar-${themeKey}`} width="100%" height="100%">
                  <BarChart data={genreData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: mutedFg }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: mutedFg }}
                      width={25}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: cardBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: cardFg,
                      }}
                      formatter={(value) => [value, t("analysisCount")]}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ""}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {genreData.map((_, i) => (
                        <Cell key={i} fill={GENRE_COLORS[i % GENRE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            {t("recentAnalyses")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAnalyses.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              {t("noData")}
            </div>
          ) : (
            <div className="space-y-2">
              {recentAnalyses.map((item) => {
                const score = item.aiAnalysis?.healthScore ?? 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${getScoreBg(score)}`}>
                        <Heart className={`h-3.5 w-3.5 ${getScoreColor(score)}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.gameTitle || "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</p>
                      <p className="text-xs text-muted-foreground">/100</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
