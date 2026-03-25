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

  return (
    <div className="flex items-center justify-between border-b pb-4">
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
        {questionNumber && totalQuestions && (
          <Badge variant="outline" className="text-xs">
            {t("questionOf", { current: questionNumber, total: totalQuestions })}
          </Badge>
        )}
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
  );
}
