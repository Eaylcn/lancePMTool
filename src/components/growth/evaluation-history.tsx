"use client";

import { useTranslations } from "next-intl";
import { Clock, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EvaluationHistoryProps {
  data: {
    gameId: string;
    gameTitle: string;
    avgGameScore: number;
    avgAnalysisQuality: number;
    observationLevel: string;
    date: string;
  }[];
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-slate-500/10 text-slate-500",
  intermediate: "bg-blue-500/10 text-blue-500",
  advanced: "bg-purple-500/10 text-purple-500",
  professional: "bg-amber-500/10 text-amber-500",
};

export function EvaluationHistory({ data }: EvaluationHistoryProps) {
  const t = useTranslations("growth");

  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-orange-500" />
          {t("evaluationHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map(item => (
            <div
              key={item.gameId}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.gameTitle}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{t("gameScore")}</p>
                  <p className="text-sm font-mono font-medium">{item.avgGameScore}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{t("analysisQuality")}</p>
                  <p className="text-sm font-mono font-medium">{item.avgAnalysisQuality}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${LEVEL_COLORS[item.observationLevel] || ""}`}
                >
                  {t(`observationLevels.${item.observationLevel}`)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
