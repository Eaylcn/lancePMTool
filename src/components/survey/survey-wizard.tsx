"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle, Save } from "lucide-react";
import {
  SURVEY_CATEGORIES,
  CATEGORY_LABELS,
  getQuestionsByCategory,
  getCategoryProgress,
  type SurveyCategory,
} from "@/lib/constants/survey-questions";
import { SurveyQuestionCard } from "./survey-question";
import { SurveyProgress } from "./survey-progress";
import { SurveyResult } from "./survey-result";
import { useUpdateSurvey, useSubmitSurvey } from "@/hooks/use-survey";

interface SurveyWizardProps {
  initialResponses: Record<string, unknown>;
  completed: boolean;
}

export function SurveyWizard({ initialResponses, completed: initialCompleted }: SurveyWizardProps) {
  const t = useTranslations("survey");
  const locale = useLocale() as "tr" | "en";
  const updateSurvey = useUpdateSurvey();
  const submitSurvey = useSubmitSurvey();

  const [responses, setResponses] = useState<Record<string, unknown>>(initialResponses || {});
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [completed, setCompleted] = useState(initialCompleted);
  const [saved, setSaved] = useState(false);

  const currentCategory = SURVEY_CATEGORIES[categoryIndex] as SurveyCategory;
  const questions = getQuestionsByCategory(currentCategory);
  const isLast = categoryIndex === SURVEY_CATEGORIES.length - 1;
  const isFirst = categoryIndex === 0;

  const categoryProgress = Object.fromEntries(
    SURVEY_CATEGORIES.map((cat) => [cat, getCategoryProgress(responses, cat as SurveyCategory)])
  );

  // Auto-save when changing category
  const autoSave = useCallback(async () => {
    try {
      await updateSurvey.mutateAsync(responses);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Silently fail for auto-save
    }
  }, [responses, updateSurvey]);

  const handleNext = async () => {
    await autoSave();
    if (isLast) return;
    setCategoryIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (isFirst) return;
    setCategoryIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    await updateSurvey.mutateAsync(responses);
    await submitSurvey.mutateAsync();
    setCompleted(true);
  };

  const handleAnswerChange = (questionId: string, value: unknown) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  if (completed) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/10 mb-2">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold">{t("resultTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("resultSubtitle")}</p>
        </div>
        <SurveyResult responses={responses} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <SurveyProgress currentCategory={categoryIndex} categoryProgress={categoryProgress} />

      {/* Category header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {CATEGORY_LABELS[currentCategory][locale]}
        </h2>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
            <Save className="h-3 w-3" />
            {t("autoSaved")}
          </span>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={q.id} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-3">
              {t("questionOf", { current: i + 1, total: questions.length })}
            </p>
            <SurveyQuestionCard
              question={q}
              value={responses[q.id]}
              onChange={(val) => handleAnswerChange(q.id, val)}
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={isFirst}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("prevButton")}
        </Button>

        {isLast ? (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={submitSurvey.isPending}
            className="gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            {t("submitButton")}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleNext}
            disabled={updateSurvey.isPending}
            className="gap-1"
          >
            {t("nextButton")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
