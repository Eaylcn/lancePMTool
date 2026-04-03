"use client";

import { useLocale } from "next-intl";
import type { SurveyQuestion } from "@/lib/types/survey";

interface SurveyQuestionProps {
  question: SurveyQuestion;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function SurveyQuestionCard({ question, value, onChange }: SurveyQuestionProps) {
  const locale = useLocale() as "tr" | "en";

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium leading-relaxed">
        {question.question[locale]}
      </h3>

      {question.type === "single" && question.options && (
        <div className="space-y-2">
          {question.options.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all ${
                  selected
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                }`}
              >
                {opt.label[locale]}
              </button>
            );
          })}
        </div>
      )}

      {question.type === "multiple" && question.options && (
        <div className="space-y-2">
          {question.options.map((opt) => {
            const selected = Array.isArray(value) && value.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => {
                  const current = Array.isArray(value) ? value : [];
                  const next = selected
                    ? current.filter((v: string) => v !== opt.value)
                    : [...current, opt.value];
                  onChange(next);
                }}
                className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all ${
                  selected
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center ${
                    selected ? "border-primary bg-primary" : "border-muted-foreground/30"
                  }`}>
                    {selected && (
                      <svg className="h-2.5 w-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {opt.label[locale]}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {question.type === "scale" && (
        <div className="space-y-3">
          <div className="flex justify-between gap-2">
            {Array.from({ length: (question.scaleMax || 5) - (question.scaleMin || 1) + 1 }, (_, i) => {
              const val = (question.scaleMin || 1) + i;
              const selected = value === val;
              return (
                <button
                  key={val}
                  onClick={() => onChange(val)}
                  className={`flex-1 rounded-lg border py-3 text-sm font-medium transition-all ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
          {question.scaleLabels && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{question.scaleLabels.min[locale]}</span>
              <span>{question.scaleLabels.max[locale]}</span>
            </div>
          )}
        </div>
      )}

      {question.type === "text" && (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={locale === "tr" ? "Cevabınızı yazın..." : "Type your answer..."}
          className="w-full min-h-[120px] rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
        />
      )}
    </div>
  );
}
