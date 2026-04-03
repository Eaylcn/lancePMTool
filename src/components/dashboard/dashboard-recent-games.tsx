"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Gamepad2, CheckCircle2, XCircle, Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RecentGame {
  id: string;
  title: string;
  genre: unknown;
  platform: string | null;
  status: string | null;
  hasAnalysis: boolean;
  createdAt: string;
}

interface DashboardRecentGamesProps {
  games: RecentGame[];
}

export function DashboardRecentGames({ games }: DashboardRecentGamesProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  if (games.length === 0) {
    return (
      <Card className="p-6 text-center border-dashed rounded-xl border-border/60">
        <Gamepad2 className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
        <h3 className="font-semibold mb-1">{t("noGames")}</h3>
        <p className="text-sm text-muted-foreground">{t("noGamesDescription")}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3 rounded-xl border-border/60">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Gamepad2 className="h-4 w-4 text-primary" />
          {t("recentGames")}
        </h3>
        <Link
          href={`/${locale}/library`}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          {t("viewAll")}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {games.map((game) => {
          const genres = Array.isArray(game.genre) ? (game.genre as string[]) : [];
          return (
            <Link
              key={game.id}
              href={`/${locale}/library/${game.id}`}
              className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Gamepad2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{game.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {genres.length > 0 && <span>{genres.slice(0, 2).join(", ")}</span>}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(game.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {game.hasAnalysis ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-500">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t("recentActivity.hasAnalysis")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <XCircle className="h-3.5 w-3.5" />
                    {t("recentActivity.noAnalysis")}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
