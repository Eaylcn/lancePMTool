"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { FlaskConical, Loader2, BarChart3, GitCompare, TrendingUp } from "lucide-react";
import {
  useSurveys,
  useSurveyResponses,
  useRunSurveyAnalysis,
  type SurveyListItem,
} from "@/hooks/use-surveys";
import { EmptyState } from "@/components/shared/empty-state";
import type { SurveyQuestion } from "@/lib/types/survey";

interface SurveyResultsViewProps {
  surveys: SurveyListItem[];
  onAnalysisComplete?: () => void;
}

export function SurveyResultsView({ surveys, onAnalysisComplete }: SurveyResultsViewProps) {
  const t = useTranslations("surveys");
  const locale = useLocale() as "tr" | "en";

  const [selectedSurveyId, setSelectedSurveyId] = useState<string>("");
  const [compareSurveyId, setCompareSurveyId] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<Record<string, unknown> | null>(null);
  const [analysisType, setAnalysisType] = useState<string>("");

  const { data: responses = [] } = useSurveyResponses(selectedSurveyId || null);
  const runAnalysis = useRunSurveyAnalysis();

  const selectedSurvey = surveys.find((s) => s.id === selectedSurveyId);
  const surveysWithResponses = surveys.filter((s) => s.responseCount > 0);

  const handleRunAnalysis = async (type: "normal" | "cross_question" | "cross_survey" | "trend") => {
    if (!selectedSurveyId) return;

    try {
      const result = await runAnalysis.mutateAsync({
        surveyId: selectedSurveyId,
        analysisType: type,
        compareSurveyIds: type === "cross_survey" && compareSurveyId ? [compareSurveyId] : undefined,
        locale,
      });
      setAnalysisResult(result.results);
      setAnalysisType(type);
      onAnalysisComplete?.();
    } catch {
      // error handled by mutation
    }
  };

  if (surveysWithResponses.length === 0) {
    return (
      <EmptyState
        icon={FlaskConical}
        title={t("results.emptyTitle")}
        description={t("results.emptyDescription")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Survey selector */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold">{t("results.selectSurvey")}</h3>
        <select
          value={selectedSurveyId}
          onChange={(e) => {
            setSelectedSurveyId(e.target.value);
            setAnalysisResult(null);
          }}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">{t("results.chooseSurvey")}</option>
          {surveysWithResponses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} ({s.responseCount} {t("dashboard.responses")})
            </option>
          ))}
        </select>

        {/* Comparison survey selector */}
        {selectedSurveyId && (
          <div>
            <label className="text-xs text-muted-foreground">{t("results.compareTo")}</label>
            <select
              value={compareSurveyId}
              onChange={(e) => setCompareSurveyId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">{t("results.noComparison")}</option>
              {surveysWithResponses
                .filter((s) => s.id !== selectedSurveyId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.responseCount} {t("dashboard.responses")})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Response summary */}
      {selectedSurveyId && responses.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-sm font-semibold">
            {t("results.responseSummary")} ({responses.length})
          </h3>
          <ResponseSummaryCharts responses={responses} surveyId={selectedSurveyId} />
        </div>
      )}

      {/* AI Analysis buttons */}
      {selectedSurveyId && responses.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-sm font-semibold">{t("results.aiAnalysis")}</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => handleRunAnalysis("normal")}
              disabled={runAnalysis.isPending}
              className="gap-1.5"
            >
              {runAnalysis.isPending && analysisType === "" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <BarChart3 className="h-3.5 w-3.5" />
              )}
              {t("results.normalAnalysis")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRunAnalysis("cross_question")}
              disabled={runAnalysis.isPending}
              className="gap-1.5"
            >
              <GitCompare className="h-3.5 w-3.5" />
              {t("results.crossQuestionAnalysis")}
            </Button>
            {compareSurveyId && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRunAnalysis("cross_survey")}
                disabled={runAnalysis.isPending}
                className="gap-1.5"
              >
                <FlaskConical className="h-3.5 w-3.5" />
                {t("results.crossSurveyAnalysis")}
              </Button>
            )}
            {compareSurveyId && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRunAnalysis("trend")}
                disabled={runAnalysis.isPending}
                className="gap-1.5"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                {t("results.trendAnalysis")}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Analysis result */}
      {analysisResult && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-sm font-semibold">{t("results.analysisResults")}</h3>
          <AnalysisResultDisplay result={analysisResult} type={analysisType} />
        </div>
      )}
    </div>
  );
}

// ============================================
// Response Summary Charts (simple bars)
// ============================================
function ResponseSummaryCharts({
  responses,
  surveyId,
}: {
  responses: { responses: Record<string, unknown> }[];
  surveyId: string;
}) {
  const responseData = responses.map((r) => r.responses);
  if (responseData.length === 0) return null;

  // Get all question IDs from responses
  const allKeys = new Set<string>();
  responseData.forEach((r) => Object.keys(r).forEach((k) => allKeys.add(k)));

  return (
    <div className="space-y-4">
      {[...allKeys].slice(0, 10).map((qId) => {
        const answers = responseData.map((r) => r[qId]).filter((a) => a != null);
        if (answers.length === 0) return null;

        // Check if numeric (scale)
        const nums = answers.map(Number).filter((n) => !isNaN(n));
        if (nums.length === answers.length && nums.length > 0) {
          const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
          return (
            <div key={qId} className="space-y-1">
              <p className="text-xs font-medium">{qId}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(avg / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{avg.toFixed(1)}</span>
              </div>
            </div>
          );
        }

        // Categorical
        const counts: Record<string, number> = {};
        answers.forEach((a) => {
          const vals = Array.isArray(a) ? a : [a];
          vals.forEach((v) => {
            const key = String(v);
            counts[key] = (counts[key] || 0) + 1;
          });
        });

        const max = Math.max(...Object.values(counts));

        return (
          <div key={qId} className="space-y-1.5">
            <p className="text-xs font-medium">{qId}</p>
            {Object.entries(counts).map(([val, count]) => (
              <div key={val} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-20 truncate">{val}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded-full"
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// Analysis Result Display
// ============================================
function AnalysisResultDisplay({ result, type }: { result: Record<string, unknown>; type: string }) {
  const summary = (result.summary as string) || "";
  const keyFindings = (result.keyFindings as { title: string; description: string; importance: string }[]) || [];
  const recommendations = (result.recommendations as { title: string; description: string; priority: string }[]) || [];
  const correlations = (result.correlations as { question1: string; question2: string; correlation: string; strength: string }[]) || [];
  const insights = (result.insights as { title: string; description: string }[]) || (result.insights as string[]) || [];
  const overallScore = result.overallScore as number | undefined;

  const priorityColors: Record<string, string> = {
    high: "bg-red-500/10 text-red-500",
    medium: "bg-amber-500/10 text-amber-500",
    low: "bg-blue-500/10 text-blue-500",
  };

  return (
    <div className="space-y-5">
      {/* Overall score */}
      {overallScore !== undefined && (
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold">{overallScore}</div>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="text-sm leading-relaxed whitespace-pre-line">{summary}</div>
      )}

      {/* Key findings */}
      {keyFindings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Key Findings
          </h4>
          {keyFindings.map((f, i) => (
            <div key={i} className="rounded-lg border border-border p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityColors[f.importance] || priorityColors.medium}`}>
                  {f.importance}
                </span>
                <span className="text-sm font-medium">{f.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Correlations (cross-question) */}
      {correlations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Correlations
          </h4>
          {correlations.map((c, i) => (
            <div key={i} className="rounded-lg border border-border p-3 space-y-1">
              <div className="text-xs text-muted-foreground">
                {c.question1} ↔ {c.question2}
              </div>
              <p className="text-sm">{c.correlation}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                c.strength === "strong" ? "bg-red-500/10 text-red-500" :
                c.strength === "moderate" ? "bg-amber-500/10 text-amber-500" :
                "bg-blue-500/10 text-blue-500"
              }`}>
                {c.strength}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Recommendations
          </h4>
          {recommendations.map((r, i) => (
            <div key={i} className="rounded-lg border border-border p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityColors[r.priority] || priorityColors.medium}`}>
                  {r.priority}
                </span>
                <span className="text-sm font-medium">{r.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">{r.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Generic insights */}
      {insights.length > 0 && typeof insights[0] === "object" && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Insights
          </h4>
          {(insights as { title: string; description: string }[]).map((ins, i) => (
            <div key={i} className="rounded-lg border border-border p-3 space-y-1">
              <span className="text-sm font-medium">{ins.title}</span>
              <p className="text-xs text-muted-foreground">{ins.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
