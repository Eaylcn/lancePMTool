"use client";

import { useTranslations } from "next-intl";
import { Gamepad2, BarChart3, MessageSquare, CheckSquare, Flame, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProfileStatsProps {
  stats: {
    totalGames: number;
    totalAnalyses: number;
    interviewSessions: number;
    totalTasks: number;
    currentStreak: number;
    observationLevel: string;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const t = useTranslations("profile.stats");
  const dt = useTranslations("dashboard.levels");

  const items = [
    { icon: Gamepad2, label: t("totalGames"), value: String(stats.totalGames), color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: BarChart3, label: t("totalAnalyses"), value: String(stats.totalAnalyses), color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: MessageSquare, label: t("interviewSessions"), value: String(stats.interviewSessions), color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { icon: CheckSquare, label: t("totalTasks"), value: String(stats.totalTasks), color: "text-amber-500", bg: "bg-amber-500/10" },
    { icon: Flame, label: t("currentStreak"), value: String(stats.currentStreak), color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: Eye, label: t("observationLevel"), value: dt(stats.observationLevel), color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <Card key={item.label} className="p-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${item.bg}`}>
              <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground leading-tight">{item.label}</p>
              <p className="text-lg font-bold leading-tight">{item.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
