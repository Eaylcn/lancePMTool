"use client";

import { useTranslations } from "next-intl";
import { Gamepad2, BarChart3, Star, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardStatsProps {
  stats: {
    totalGames: number;
    totalAnalyses: number;
    avgScore: number;
    pmLevel: string;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const t = useTranslations("dashboard");

  const items = [
    {
      icon: Gamepad2,
      label: t("totalGames"),
      value: String(stats.totalGames),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: BarChart3,
      label: t("totalAnalyses"),
      value: String(stats.totalAnalyses),
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      icon: Star,
      label: t("avgScore"),
      value: stats.avgScore > 0 ? String(stats.avgScore) : "—",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      icon: TrendingUp,
      label: t("pmLevel"),
      value: t(`levels.${stats.pmLevel}`),
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <Card key={item.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${item.bg}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-bold">{item.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
