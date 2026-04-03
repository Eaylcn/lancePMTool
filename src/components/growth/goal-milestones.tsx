"use client";

import { useTranslations } from "next-intl";
import { Target, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PmLevelBadge } from "./pm-level-badge";

interface GoalMilestonesProps {
  stats: {
    totalGames: number;
    totalAnalyses: number;
    averageAnalysisQuality: number;
  };
  currentLevel?: string;
}

const MILESTONES = [
  { level: "beginner_pm", minGames: 0, minAnalyses: 0, minQuality: 0 },
  { level: "junior_pm", minGames: 3, minAnalyses: 3, minQuality: 4 },
  { level: "mid_pm", minGames: 8, minAnalyses: 8, minQuality: 6 },
  { level: "senior_pm", minGames: 15, minAnalyses: 15, minQuality: 7.5 },
  { level: "lead_pm", minGames: 25, minAnalyses: 25, minQuality: 8.5 },
];

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function GoalMilestones({ stats, currentLevel }: GoalMilestonesProps) {
  const t = useTranslations("growth");

  // Default to beginner_pm if no level set (index 0), so next target is junior_pm
  const currentIdx = Math.max(0, MILESTONES.findIndex((m) => m.level === currentLevel));
  const nextMilestone = MILESTONES[currentIdx + 1];
  const isMaxLevel = !nextMilestone;

  const requirements = nextMilestone ? [
    {
      label: t("gamesRequired"),
      current: stats.totalGames,
      target: nextMilestone.minGames,
      color: "bg-emerald-500",
    },
    {
      label: t("analysesRequired"),
      current: stats.totalAnalyses,
      target: nextMilestone.minAnalyses,
      color: "bg-blue-500",
    },
    {
      label: t("qualityRequired"),
      current: stats.averageAnalysisQuality,
      target: nextMilestone.minQuality,
      color: "bg-purple-500",
    },
  ] : [];

  return (
    <Card className="rounded-xl border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-amber-500" />
          {t("goalMilestones")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current → Next level */}
        <div className="flex items-center gap-2">
          <PmLevelBadge level={currentLevel || "beginner_pm"} size="sm" />
          {nextMilestone && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <PmLevelBadge level={nextMilestone.level} size="sm" />
            </>
          )}
        </div>

        {isMaxLevel ? (
          <p className="text-sm text-muted-foreground">{t("maxLevelReached")}</p>
        ) : (
          <div className="space-y-3">
            {requirements.map((req) => (
              <div key={req.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{req.label}</span>
                  <span className="font-medium tabular-nums">
                    {req.current}/{req.target}
                  </span>
                </div>
                <ProgressBar value={req.current} max={req.target} color={req.color} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
