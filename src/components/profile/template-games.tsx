"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Gamepad2, CheckCircle2, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TemplateGame {
  id: string;
  title: string;
  genre: unknown;
  platform: string | null;
  hasAnalysis: boolean;
}

interface TemplateGamesProps {
  games: TemplateGame[];
  namespace?: "profile" | "portfolio";
}

export function TemplateGames({ games, namespace = "profile" }: TemplateGamesProps) {
  const t = useTranslations(namespace);
  const [expanded, setExpanded] = useState(false);

  if (games.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm text-muted-foreground">
            {t("templateGames")}
          </h3>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {games.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-muted-foreground h-7 px-2"
        >
          {expanded ? (
            <>
              {t("hideTemplates")}
              <ChevronUp className="h-3 w-3 ml-1" />
            </>
          ) : (
            <>
              {t("showTemplates")}
              <ChevronDown className="h-3 w-3 ml-1" />
            </>
          )}
        </Button>
      </div>

      {expanded && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {t("templateDescription")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {games.map((game) => {
              const genres = Array.isArray(game.genre) ? (game.genre as string[]) : [];
              return (
                <Card key={game.id} className="p-3 border-dashed opacity-80">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Gamepad2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="font-medium text-sm">{game.title}</p>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 border-dashed">
                          {t("templateBadge")}
                        </Badge>
                      </div>
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
                      <CheckCircle2 className="h-4 w-4 text-emerald-500/60 shrink-0" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
