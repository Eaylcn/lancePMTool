"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyMonthlySummaryProps {
  analysisHistory: {
    createdAt: string;
    hasAiAnalysis: boolean;
  }[];
}

export function WeeklyMonthlySummary({ analysisHistory }: WeeklyMonthlySummaryProps) {
  const t = useTranslations("growth");

  const { week, month } = useMemo(() => {
    const now = Date.now();
    const d7 = now - 7 * 86400000;
    const d30 = now - 30 * 86400000;

    let weekGames = 0, weekAnalyses = 0, monthGames = 0, monthAnalyses = 0;
    for (const item of analysisHistory) {
      const ts = new Date(item.createdAt).getTime();
      if (ts >= d30) {
        monthGames++;
        if (item.hasAiAnalysis) monthAnalyses++;
        if (ts >= d7) {
          weekGames++;
          if (item.hasAiAnalysis) weekAnalyses++;
        }
      }
    }
    return {
      week: { games: weekGames, analyses: weekAnalyses },
      month: { games: monthGames, analyses: monthAnalyses },
    };
  }, [analysisHistory]);

  const sections = [
    { label: t("last7Days"), ...week, icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: t("last30Days"), ...month, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <Card className="rounded-xl border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          {t("activitySummary")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.map((s) => (
          <div key={s.label} className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-md ${s.bg}`}>
                <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
              </div>
              <span className="text-sm font-medium">{s.label}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">{t("gamesAdded")}</p>
                <p className="text-xl font-bold">{s.games}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("analysesCompleted")}</p>
                <p className="text-xl font-bold">{s.analyses}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
