"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { InterviewTopic } from "@/lib/ai/prompts/interview";

interface SessionHeaderProps {
  topic: InterviewTopic;
  status: string;
  avgScore?: string | null;
  questionNumber?: number;
  totalQuestions?: number;
  onBack: () => void;
}

export function SessionHeader({ topic, status, avgScore, questionNumber, totalQuestions, onBack }: SessionHeaderProps) {
  const t = useTranslations("interview");
  const progress = questionNumber && totalQuestions ? (questionNumber / totalQuestions) * 100 : 0;

  return (
    <div className="border-b pb-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="font-semibold">{t(`topics.${topic}`)}</h2>
            <p className="text-xs text-muted-foreground">
              {t(`topicDescriptions.${topic}`)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {avgScore && (
            <Badge className="text-xs">
              {t("avgScore")}: {avgScore}
            </Badge>
          )}
          <Badge variant={status === "completed" ? "default" : "secondary"} className="text-xs">
            {status === "completed" ? t("completed") : t("active")}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      {questionNumber && totalQuestions && status !== "completed" && (
        <div className="flex items-center gap-3 px-11">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {t("questionOf", { current: questionNumber, total: totalQuestions })}
          </span>
        </div>
      )}
    </div>
  );
}
