"use client";

import { useTranslations } from "next-intl";
import { MessageSquare, CheckSquare, Flame, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardFeatureStatsProps {
  interviewStats: {
    completedSessions: number;
    avgScore: number;
  };
  taskStats: {
    streak: number;
    longestStreak: number;
    totalCompleted: number;
  };
}

export function DashboardFeatureStats({ interviewStats, taskStats }: DashboardFeatureStatsProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Interview Stats */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-purple-500" />
          {t("interviewStats.title")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">{t("interviewStats.completedSessions")}</p>
            <p className="text-2xl font-bold text-purple-500">{interviewStats.completedSessions}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">{t("interviewStats.avgScore")}</p>
            <p className="text-2xl font-bold text-purple-500">
              {interviewStats.avgScore > 0 ? interviewStats.avgScore : "—"}
            </p>
          </div>
        </div>
      </Card>

      {/* Task Stats */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-amber-500" />
          {t("taskStats.title")}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground">{t("taskStats.streak")}</p>
            <p className="text-xl font-bold text-amber-500">{taskStats.streak}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="h-3.5 w-3.5 text-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground">{t("taskStats.longestStreak")}</p>
            <p className="text-xl font-bold text-amber-500">{taskStats.longestStreak}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mt-1">{t("taskStats.totalCompleted")}</p>
            <p className="text-xl font-bold text-amber-500">{taskStats.totalCompleted}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
