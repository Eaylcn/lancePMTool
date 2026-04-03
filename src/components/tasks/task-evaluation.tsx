"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="border-border/60 bg-muted/30 rounded-xl mt-3">
      <CardContent className="p-4 space-y-3">
        <p className="text-sm font-semibold">{t("evaluation")}</p>

        {evaluation.strengths.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              {t("strengths")}
            </p>
            <ul className="text-xs text-muted-foreground space-y-0.5 pl-5">
              {evaluation.strengths.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
        )}

        {evaluation.improvements.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {t("improvements")}
            </p>
            <ul className="text-xs text-muted-foreground space-y-0.5 pl-5">
              {evaluation.improvements.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
        )}

        {evaluation.keyTakeaway && (
          <div className="bg-blue-500/8 dark:bg-blue-500/10 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" />
              {t("keyTakeaway")}
            </p>
            <p className="text-xs text-muted-foreground">{evaluation.keyTakeaway}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
