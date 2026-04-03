"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { SurveyQuestionCard } from "@/components/survey/survey-question";
import type { SurveyQuestion } from "@/lib/types/survey";

const QUESTIONS_PER_PAGE = 4;

interface PublicSurveyFormProps {
  questions: SurveyQuestion[];
  showProgressBar?: boolean;
  onSubmit: (responses: Record<string, unknown>, metadata: { completionTimeSeconds: number; locale: string }) => void;
  isSubmitting: boolean;
}

export function PublicSurveyForm({ questions, showProgressBar = true, onSubmit, isSubmitting }: PublicSurveyFormProps) {
  const locale = useLocale() as "tr" | "en";
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [page, setPage] = useState(0);
  const startTime = useRef(Date.now());

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);
  const isLastPage = page === totalPages - 1;
  const isFirstPage = page === 0;

  const answeredCount = questions.filter((q) => {
    const val = responses[q.id];
    return val !== undefined && val !== null && val !== "" && !(Array.isArray(val) && val.length === 0);
  }).length;

  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  const handleChange = (questionId: string, value: unknown) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    onSubmit(responses, { completionTimeSeconds: elapsed, locale });
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      {showProgressBar && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {locale === "tr" ? "Sayfa" : "Page"} {page + 1} / {totalPages}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {pageQuestions.map((q, i) => (
          <div key={q.id} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-3">
              {page * QUESTIONS_PER_PAGE + i + 1} / {questions.length}
              {q.required && <span className="text-red-500 ml-1">*</span>}
            </p>
            <SurveyQuestionCard
              question={q}
              value={responses[q.id]}
              onChange={(val) => handleChange(q.id, val)}
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p - 1)}
          disabled={isFirstPage}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {locale === "tr" ? "Önceki" : "Previous"}
        </Button>

        {isLastPage ? (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-1.5"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {locale === "tr" ? "Gönder" : "Submit"}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            className="gap-1"
          >
            {locale === "tr" ? "Sonraki" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
