"use client";

import { useTranslations } from "next-intl";
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryData {
  winner: "game1" | "game2" | "tie";
  game1Score: number;
  game2Score: number;
  analysis: string;
}

interface ComparisonBarsProps {
  categoryWinners: Record<string, CategoryData>;
  game1Title: string;
  game2Title: string;
}

const CATEGORY_KEYS = ["ftue", "coreLoop", "monetization", "retention", "uxui", "metaGame", "technical"] as const;

const CATEGORY_COLORS = {
  game1: {
    bar: "bg-emerald-500",
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  game2: {
    bar: "bg-blue-500",
    text: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  tie: {
    bar: "bg-amber-500",
    text: "text-amber-500",
    bg: "bg-amber-500/10",
  },
};

export function ComparisonBars({ categoryWinners, game1Title, game2Title }: ComparisonBarsProps) {
  const t = useTranslations("compare");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          {t("categoryWinners")}
        </CardTitle>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {game1Title}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            {game2Title}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {CATEGORY_KEYS.map(cat => {
          const data = categoryWinners[cat];
          if (!data) return null;

          const maxScore = Math.max(data.game1Score, data.game2Score, 1);
          const g1Width = (data.game1Score / 10) * 100;
          const g2Width = (data.game2Score / 10) * 100;
          const winnerColors = CATEGORY_COLORS[data.winner];

          return (
            <div key={cat} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{t(`categories.${cat}`)}</span>
                <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full ${winnerColors.bg} ${winnerColors.text}`}>
                  {data.winner === "tie" ? t("tie") : (
                    <>
                      <Trophy className="h-3 w-3" />
                      {data.winner === "game1" ? game1Title : game2Title}
                    </>
                  )}
                </div>
              </div>

              {/* Bars */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${CATEGORY_COLORS.game1.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${g1Width}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono w-8 text-right text-emerald-500">{data.game1Score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${CATEGORY_COLORS.game2.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${g2Width}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono w-8 text-right text-blue-500">{data.game2Score}</span>
                </div>
              </div>

              {/* Analysis tooltip on hover */}
              {data.analysis && (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-300 overflow-hidden">
                  {data.analysis}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
