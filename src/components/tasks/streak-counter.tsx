"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy, CheckCircle2 } from "lucide-react";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
}

export function StreakCounter({ currentStreak, longestStreak, totalCompleted }: StreakCounterProps) {
  const t = useTranslations("tasks");

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
        <CardContent className="p-4 flex items-center gap-3">
          <Flame className={`h-8 w-8 ${currentStreak > 0 ? "text-orange-500 animate-pulse" : "text-muted-foreground/40"}`} />
          <div>
            <p className="text-2xl font-bold">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">{t("streak.current")}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-2xl font-bold">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">{t("streak.longest")}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-2xl font-bold">{totalCompleted}</p>
            <p className="text-xs text-muted-foreground">{t("streak.total")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
