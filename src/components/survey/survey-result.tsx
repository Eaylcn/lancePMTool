"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  SURVEY_CATEGORIES,
  SURVEY_QUESTIONS,
  CATEGORY_LABELS,
  type SurveyCategory,
} from "@/lib/constants/survey-questions";

interface SurveyResultProps {
  responses: Record<string, unknown>;
}

// Correct answers for single-choice questions
const CORRECT_ANSWERS: Record<string, string> = {
  gpm_1: "b", gpm_2: "b",
  mon_1: "c", mon_3: "b",
  ret_1: "b",
  ux_1: "b",
  met_1: "b",
  mkt_1: "b",
  lop_1: "b",
};

// Correct answers for multiple-choice questions (all correct options)
const CORRECT_MULTIPLE: Record<string, string[]> = {
  mon_2: ["a", "b", "c", "e"],
  ret_2: ["a", "c", "d", "e"],
  ux_2: ["a", "b", "d", "e"],
  met_2: ["a", "b", "d"],
  mkt_2: ["a", "b", "c", "e"],
  lop_2: ["a", "b", "c", "e"],
};

function computeCategoryScore(
  category: SurveyCategory,
  responses: Record<string, unknown>
): { score: number; maxScore: number; percent: number } {
  const questions = SURVEY_QUESTIONS.filter((q) => q.category === category);
  let score = 0;
  let maxScore = 0;

  for (const q of questions) {
    if (q.type === "single") {
      maxScore += 1;
      if (CORRECT_ANSWERS[q.id] && responses[q.id] === CORRECT_ANSWERS[q.id]) {
        score += 1;
      }
    } else if (q.type === "multiple") {
      const correct = CORRECT_MULTIPLE[q.id];
      if (correct) {
        maxScore += correct.length;
        const userAnswer = Array.isArray(responses[q.id]) ? (responses[q.id] as string[]) : [];
        for (const c of correct) {
          if (userAnswer.includes(c)) score += 1;
        }
        // Penalize wrong selections
        for (const u of userAnswer) {
          if (!correct.includes(u)) score = Math.max(0, score - 0.5);
        }
      }
    } else if (q.type === "scale") {
      maxScore += 5;
      score += typeof responses[q.id] === "number" ? (responses[q.id] as number) : 0;
    } else if (q.type === "text") {
      maxScore += 1;
      const text = (responses[q.id] as string) || "";
      if (text.trim().length >= 20) score += 1;
      else if (text.trim().length >= 5) score += 0.5;
    }
  }

  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return { score: Math.round(score * 10) / 10, maxScore, percent };
}

function getLevel(percent: number): "beginner" | "intermediate" | "advanced" {
  if (percent >= 70) return "advanced";
  if (percent >= 40) return "intermediate";
  return "beginner";
}

const levelColors = {
  beginner: "text-red-400 bg-red-500/10 border-red-500/30",
  intermediate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  advanced: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

export function SurveyResult({ responses }: SurveyResultProps) {
  const t = useTranslations("survey");
  const locale = useLocale() as "tr" | "en";

  const categoryScores = SURVEY_CATEGORIES.map((cat) => ({
    category: cat as SurveyCategory,
    ...computeCategoryScore(cat as SurveyCategory, responses),
  }));

  const overallPercent = Math.round(
    categoryScores.reduce((sum, c) => sum + c.percent, 0) / categoryScores.length
  );
  const overallLevel = getLevel(overallPercent);

  return (
    <div className="space-y-6">
      {/* Overall score */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
          <span className="text-3xl font-bold text-primary">{overallPercent}%</span>
        </div>
        <div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${levelColors[overallLevel]}`}>
            {t(`levels.${overallLevel}`)}
          </span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-3">
        {categoryScores.map(({ category, percent }) => {
          const level = getLevel(percent);
          return (
            <div key={category} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {CATEGORY_LABELS[category][locale]}
                </span>
                <span className={`text-xs font-medium rounded-full border px-2 py-0.5 ${levelColors[level]}`}>
                  {t(`levels.${level}`)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    percent >= 70
                      ? "bg-emerald-500"
                      : percent >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{percent}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
