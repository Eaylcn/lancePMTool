"use client";

import { useTranslations } from "next-intl";
import { Gamepad2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ShowcaseGame {
  id: string;
  title: string;
  genre: unknown;
  platform: string | null;
  hasAnalysis: boolean;
}

interface GameShowcaseProps {
  games: ShowcaseGame[];
}

export function GameShowcase({ games }: GameShowcaseProps) {
  const t = useTranslations("portfolio");

  if (games.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Gamepad2 className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
        <p className="text-sm text-muted-foreground">{t("noGames")}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <Gamepad2 className="h-4 w-4 text-primary" />
        {t("gameShowcase")}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {games.map((game) => {
          const genres = Array.isArray(game.genre) ? (game.genre as string[]) : [];
          return (
            <Card key={game.id} className="p-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{game.title}</p>
                  <div className="flex flex-wrap gap-1">
                    {genres.slice(0, 3).map((g) => (
                      <Badge key={g} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {g}
                      </Badge>
                    ))}
                    {game.platform && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {game.platform}
                      </Badge>
                    )}
                  </div>
                </div>
                {game.hasAnalysis && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
