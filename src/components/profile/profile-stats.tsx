"use client";

import { useTranslations } from "next-intl";
import {
  Gamepad2,
  BarChart3,
  MessageSquare,
  CheckSquare,
  Flame,
  Eye,
} from "lucide-react";
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
    {
      icon: Gamepad2,
      label: t("totalGames"),
      value: String(stats.totalGames),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      ring: "ring-blue-500/20",
    },
    {
      icon: BarChart3,
      label: t("totalAnalyses"),
      value: String(stats.totalAnalyses),
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      ring: "ring-purple-500/20",
    },
    {
      icon: MessageSquare,
      label: t("interviewSessions"),
      value: String(stats.interviewSessions),
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      ring: "ring-indigo-500/20",
    },
    {
      icon: CheckSquare,
      label: t("totalTasks"),
      value: String(stats.totalTasks),
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
    },
    {
      icon: Flame,
      label: t("currentStreak"),
      value: String(stats.currentStreak),
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      ring: "ring-orange-500/20",
    },
    {
      icon: Eye,
      label: t("observationLevel"),
      value: dt(stats.observationLevel),
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <Card
          key={item.label}
          className="group relative p-4 border-border/60 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`p-1.5 rounded-lg ${item.bg} ring-1 ${item.ring} transition-transform group-hover:scale-110`}
            >
              <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
            </div>
          </div>
          <p className="text-xl font-bold leading-tight tracking-tight">
            {item.value}
          </p>
          <p className="text-[11px] text-muted-foreground leading-tight mt-1">
            {item.label}
          </p>
        </Card>
      ))}
    </div>
  );
}
