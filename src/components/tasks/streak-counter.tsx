"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
}

const MILESTONES = [3, 7, 14, 30, 60, 100];

function getMilestoneInfo(streak: number): { next: number; reached: number | null } | null {
  const reached = MILESTONES.filter(m => streak >= m);
  const next = MILESTONES.find(m => streak < m);
  return {
    next: next || MILESTONES[MILESTONES.length - 1],
    reached: reached.length > 0 ? reached[reached.length - 1] : null,
  };
}

export function StreakCounter({ currentStreak, longestStreak, totalCompleted }: StreakCounterProps) {
  const t = useTranslations("tasks");
  const milestone = getMilestoneInfo(currentStreak);
  const progress = milestone ? Math.min(currentStreak / milestone.next, 1) : 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <Card className={cn(
          "rounded-xl border-border/60",
          currentStreak > 0 && "bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20"
        )}>
          <CardContent className="p-4 flex items-center gap-3">
            <Flame className={cn(
              "h-8 w-8",
              currentStreak > 0 ? "text-orange-500 animate-pulse" : "text-muted-foreground/40"
            )} />
            <div>
              <p className="text-2xl font-bold">{currentStreak}</p>
              <p className="text-xs text-muted-foreground">{t("streak.current")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60">
          <CardContent className="p-4 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{longestStreak}</p>
              <p className="text-xs text-muted-foreground">{t("streak.longest")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{totalCompleted}</p>
              <p className="text-xs text-muted-foreground">{t("streak.total")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestone Progress */}
      {currentStreak > 0 && milestone && (
        <Card className="rounded-xl border-border/60">
          <CardContent className="p-3 flex items-center gap-3">
            <Star className="h-5 w-5 text-yellow-500 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">
                  {milestone.reached && (
                    <Badge variant="outline" className="text-[10px] mr-1.5 px-1.5 py-0 border-yellow-500/30 text-yellow-600 dark:text-yellow-400">
                      {milestone.reached}{t("streak.days")}
                    </Badge>
                  )}
                  {progress < 1
                    ? `${currentStreak}/${milestone.next} ${t("streak.days")}`
                    : t("streakMilestone", { days: milestone.next })}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
