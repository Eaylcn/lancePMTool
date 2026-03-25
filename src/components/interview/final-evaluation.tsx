"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

interface FinalFeedback {
  overallReadiness: "low" | "medium" | "high";
  avgScore: number;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
  summary: string;
}

interface FinalEvaluationProps {
  feedback: FinalFeedback;
}

const READINESS_COLORS = {
  low: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  high: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
};

export function FinalEvaluation({ feedback }: FinalEvaluationProps) {
  const t = useTranslations("interview");

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <Trophy className="h-10 w-10 text-yellow-500 mx-auto" />
        <h2 className="text-xl font-bold">{t("finalEvaluation")}</h2>
      </div>

      {/* Score + Readiness */}
      <div className="flex justify-center gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <p className="text-3xl font-bold">{feedback.avgScore.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">{t("avgScore")}</p>
          </CardContent>
        </Card>
        <Card className={cn("text-center border", READINESS_COLORS[feedback.overallReadiness])}>
          <CardContent className="p-4">
            <p className="text-lg font-bold">{t(`readiness.${feedback.overallReadiness}`)}</p>
            <p className="text-xs opacity-80">{t("overallReadiness")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {feedback.summary && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm whitespace-pre-wrap">{feedback.summary}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        {feedback.strengths.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                {t("strengths")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Improvements */}
        {feedback.improvements.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <AlertCircle className="h-4 w-4" />
                {t("improvements")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1">
                {feedback.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Next Steps */}
      {feedback.nextSteps.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Lightbulb className="h-4 w-4" />
              {t("nextSteps")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1">
              {feedback.nextSteps.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground">{i + 1}. {s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
