"use client";

import { useTranslations } from "next-intl";
import { SURVEY_CATEGORIES, CATEGORY_LABELS } from "@/lib/constants/survey-questions";
import type { SurveyCategory } from "@/lib/constants/survey-questions";
import { useLocale } from "next-intl";

interface SurveyProgressProps {
  currentCategory: number;
  categoryProgress: Record<string, { answered: number; total: number }>;
}

export function SurveyProgress({ currentCategory, categoryProgress }: SurveyProgressProps) {
  const t = useTranslations("survey");
  const locale = useLocale() as "tr" | "en";

  const totalAnswered = Object.values(categoryProgress).reduce((sum, p) => sum + p.answered, 0);
  const totalQuestions = Object.values(categoryProgress).reduce((sum, p) => sum + p.total, 0);
  const overallPercent = totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Overall progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t("progress", { current: totalAnswered, total: totalQuestions })}</span>
          <span>{Math.round(overallPercent)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* Category steps */}
      <div className="flex gap-1">
        {SURVEY_CATEGORIES.map((cat, i) => {
          const prog = categoryProgress[cat] || { answered: 0, total: 4 };
          const isActive = i === currentCategory;
          const isComplete = prog.answered === prog.total;
          const isPast = i < currentCategory;

          return (
            <div key={cat} className="flex-1 space-y-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  isActive
                    ? "bg-primary"
                    : isComplete || isPast
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
              <p className={`text-[10px] truncate text-center ${
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              }`}>
                {CATEGORY_LABELS[cat as SurveyCategory][locale]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
