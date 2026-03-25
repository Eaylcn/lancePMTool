"use client";

import { useTranslations } from "next-intl";
import { Sparkles, Trophy, Lightbulb, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CompareAiResult } from "@/lib/ai/types";

interface AiCompareResultProps {
  result: CompareAiResult;
  game1Title: string;
  game2Title: string;
}

export function AiCompareResult({ result, game1Title, game2Title }: AiCompareResultProps) {
  const t = useTranslations("compare");

  const winnerName = result.overallWinner === "game1" ? game1Title
    : result.overallWinner === "game2" ? game2Title
    : t("tie");

  const winnerColor = result.overallWinner === "game1" ? "text-emerald-500"
    : result.overallWinner === "game2" ? "text-blue-500"
    : "text-amber-500";

  const winnerBg = result.overallWinner === "game1" ? "from-emerald-500/10 to-emerald-500/5"
    : result.overallWinner === "game2" ? "from-blue-500/10 to-blue-500/5"
    : "from-amber-500/10 to-amber-500/5";

  return (
    <div className="space-y-4">
      {/* Overall Winner */}
      <Card className={`bg-gradient-to-br ${winnerBg} border-0`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className={`h-6 w-6 ${winnerColor}`} />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("overallWinner")}</p>
              <p className={`text-xl font-bold ${winnerColor}`}>{winnerName}</p>
            </div>
          </div>
          {result.overallJustification && (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {result.overallJustification}
            </p>
          )}
        </CardContent>
      </Card>

      {/* General Comparison */}
      {result.generalComparison && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("generalComparison")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {result.generalComparison}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Learnings */}
      {result.learnings.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              {t("learnings")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.learnings.map((learning, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  <span className="text-muted-foreground leading-relaxed">{learning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {(result.crossCategoryRecommendations.forGame1.length > 0 ||
        result.crossCategoryRecommendations.forGame2.length > 0 ||
        result.crossCategoryRecommendations.general.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              {t("recommendations")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.crossCategoryRecommendations.forGame1.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  {t("forGame1", { game: game1Title })}
                </h4>
                <ul className="space-y-1.5">
                  {result.crossCategoryRecommendations.forGame1.map((rec, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <Badge variant="outline" className="shrink-0 h-5 w-5 p-0 justify-center text-xs">{i + 1}</Badge>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.crossCategoryRecommendations.forGame2.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  {t("forGame2", { game: game2Title })}
                </h4>
                <ul className="space-y-1.5">
                  {result.crossCategoryRecommendations.forGame2.map((rec, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <Badge variant="outline" className="shrink-0 h-5 w-5 p-0 justify-center text-xs">{i + 1}</Badge>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.crossCategoryRecommendations.general.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">{t("generalRecommendations")}</h4>
                <ul className="space-y-1.5">
                  {result.crossCategoryRecommendations.general.map((rec, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <Badge variant="outline" className="shrink-0 h-5 w-5 p-0 justify-center text-xs">{i + 1}</Badge>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
