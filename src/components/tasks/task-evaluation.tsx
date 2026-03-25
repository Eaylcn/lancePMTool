"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

interface TaskEvaluationProps {
  evaluation: {
    score: number;
    strengths: string[];
    improvements: string[];
    keyTakeaway: string;
  };
}

export function TaskEvaluation({ evaluation }: TaskEvaluationProps) {
  const t = useTranslations("tasks");

  return (
    <Card className="border-dashed mt-3">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{t("evaluation")}</span>
          <Badge variant={evaluation.score >= 7 ? "default" : evaluation.score >= 5 ? "secondary" : "destructive"}>
            {t("score")}: {evaluation.score}/10
          </Badge>
        </div>

        {evaluation.strengths.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {t("strengths")}
            </p>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {evaluation.strengths.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
        )}

        {evaluation.improvements.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {t("improvements")}
            </p>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {evaluation.improvements.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
        )}

        {evaluation.keyTakeaway && (
          <div>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              {t("keyTakeaway")}
            </p>
            <p className="text-xs text-muted-foreground">{evaluation.keyTakeaway}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
