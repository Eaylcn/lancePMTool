"use client";

import { useTranslations, useLocale } from "next-intl";
import { History, BarChart3, GitCompare, FlaskConical, TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

interface AnalysisHistoryItem {
  id: string;
  surveyId: string;
  analysisType: "normal" | "cross_question" | "cross_survey" | "trend";
  results: Record<string, unknown>;
  createdAt: string;
  surveyTitle?: string;
}

interface SurveyHistoryProps {
  analyses: AnalysisHistoryItem[];
  onSelect: (analysis: AnalysisHistoryItem) => void;
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  normal: BarChart3,
  cross_question: GitCompare,
  cross_survey: FlaskConical,
  trend: TrendingUp,
};

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-primary/10 text-primary",
  cross_question: "bg-violet-500/10 text-violet-500",
  cross_survey: "bg-emerald-500/10 text-emerald-500",
  trend: "bg-amber-500/10 text-amber-500",
};

export function SurveyHistory({ analyses, onSelect }: SurveyHistoryProps) {
  const t = useTranslations("surveys");
  const locale = useLocale() as "tr" | "en";

  if (analyses.length === 0) {
    return (
      <EmptyState
        icon={History}
        title={t("history.emptyTitle")}
        description={t("history.emptyDescription")}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("history.title")}</h3>

      <div className="space-y-3">
        {analyses.map((analysis) => {
          const Icon = TYPE_ICONS[analysis.analysisType] || BarChart3;
          const colorClass = TYPE_COLORS[analysis.analysisType] || TYPE_COLORS.normal;
          const summary = (analysis.results?.summary as string) || "";

          return (
            <button
              key={analysis.id}
              onClick={() => onSelect(analysis)}
              className="w-full text-left rounded-xl border border-border bg-card p-4 hover:bg-accent/50 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`rounded-lg p-1.5 ${colorClass}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {analysis.surveyTitle || t("history.unknownSurvey")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t(`results.${analysis.analysisType === "normal" ? "normalAnalysis" : analysis.analysisType === "cross_question" ? "crossQuestionAnalysis" : analysis.analysisType === "cross_survey" ? "crossSurveyAnalysis" : "trendAnalysis"}`)}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(analysis.createdAt).toLocaleDateString(locale)}
                </span>
              </div>
              {summary && (
                <p className="text-xs text-muted-foreground line-clamp-2">{summary}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
