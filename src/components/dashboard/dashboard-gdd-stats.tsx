"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { FileEdit, PlayCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardGddStatsProps {
  gddStats: {
    totalGdds: number;
    activeGdds: number;
    completedGdds: number;
  };
}

export function DashboardGddStats({ gddStats }: DashboardGddStatsProps) {
  const t = useTranslations("dashboard.gddStats");
  const locale = useLocale();

  const items = [
    {
      icon: FileEdit,
      label: t("total"),
      value: gddStats.totalGdds,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      icon: PlayCircle,
      label: t("active"),
      value: gddStats.activeGdds,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
    },
    {
      icon: CheckCircle2,
      label: t("completed"),
      value: gddStats.completedGdds,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <Card className="p-4 space-y-3 rounded-xl border-border/60">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <FileEdit className="h-4 w-4 text-indigo-500" />
          {t("title")}
        </h3>
        <Link
          href={`/${locale}/gdd`}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <div className={`p-1.5 rounded-lg ${item.bg}`}>
                <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
