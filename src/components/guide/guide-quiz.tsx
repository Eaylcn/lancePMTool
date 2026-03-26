"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { CheckCircle, XCircle } from "lucide-react";
import type { GuideQuiz } from "@/lib/constants/pm-guide";

interface GuideQuizCardProps {
  quiz: GuideQuiz;
  index: number;
}

export function GuideQuizCard({ quiz, index }: GuideQuizCardProps) {
  const locale = useLocale() as "tr" | "en";
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === quiz.correct;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <p className="text-sm font-medium">
        <span className="text-muted-foreground mr-1">Q{index + 1}.</span>
        {quiz.question[locale]}
      </p>

      <div className="space-y-2">
        {quiz.options.map((opt) => {
          const isThis = selected === opt.value;
          const isCorrectOpt = opt.value === quiz.correct;
          let style = "border-border hover:border-primary/30 hover:bg-muted/50";
          if (answered && isCorrectOpt) style = "border-emerald-500/50 bg-emerald-500/10 text-emerald-400";
          else if (answered && isThis && !isCorrect) style = "border-red-500/50 bg-red-500/10 text-red-400";

          return (
            <button
              key={opt.value}
              onClick={() => !answered && setSelected(opt.value)}
              disabled={answered}
              className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition-all ${style} ${answered ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-2">
                {answered && isCorrectOpt && <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                {answered && isThis && !isCorrect && <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                {opt.label[locale]}
              </div>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`rounded-lg px-3 py-2 text-xs ${isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
          {quiz.explanation[locale]}
        </div>
      )}
    </div>
  );
}
