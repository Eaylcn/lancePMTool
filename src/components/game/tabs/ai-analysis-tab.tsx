"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Sparkles, CheckCircle2, AlertCircle, Lightbulb, MessageSquare, Target } from "lucide-react";

interface AiAnalysisTabProps {
  aiAnalysis: {
    executiveSummary: string | null;
    strengths: string[] | null;
    weaknesses: string[] | null;
    categoryScores: Record<string, { gameScore: number; analysisQuality: number; comment: string }> | null;
    observationLevel: string | null;
    observationFeedback: { level: string; strengths: string[]; improvements: string[]; nextSteps: string[] } | null;
    pmLearnings: Array<{ topic: string; insight: string; actionable: string }> | null;
    interviewPrep: Array<{ question: string; suggestedAnswer: string; category: string }> | null;
    benchmarkComparison: { similarGames: string[]; standoutFeatures: string[]; industryPosition: string } | null;
    pmScenario: { scenario: string; challenge: string; suggestedApproach: string } | null;
    mechanicSuggestions: Array<{ mechanic: string; reason: string; implementation: string }> | null;
  } | null;
}

export function AiAnalysisTab({ aiAnalysis }: AiAnalysisTabProps) {
  const t = useTranslations("game");

  if (!aiAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground">{t("noAiAnalysis")}</p>
      </div>
    );
  }

  // Prepare bar chart data from category scores
  const categoryChartData = aiAnalysis.categoryScores
    ? Object.entries(aiAnalysis.categoryScores).map(([key, scores]) => ({
        category: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        gameScore: scores.gameScore,
        analysisQuality: scores.analysisQuality,
      }))
    : [];

  const levelColors: Record<string, string> = {
    beginner: "bg-orange-500/10 text-orange-500",
    intermediate: "bg-yellow-500/10 text-yellow-500",
    advanced: "bg-blue-500/10 text-blue-500",
    professional: "bg-emerald-500/10 text-emerald-500",
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      {aiAnalysis.executiveSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t("executiveSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{aiAnalysis.executiveSummary}</p>
          </CardContent>
        </Card>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid gap-4 sm:grid-cols-2">
        {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {t("strengths")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {aiAnalysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-emerald-500 shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {aiAnalysis.weaknesses && aiAnalysis.weaknesses.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                {t("weaknesses")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {aiAnalysis.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-red-500 shrink-0">−</span>
                    {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Category Scores Chart */}
      {categoryChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("categoryScoresChart")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="gameScore" fill="hsl(var(--primary))" name="Game Score" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="analysisQuality" fill="hsl(var(--accent))" name="Analysis Quality" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observation Level */}
      {aiAnalysis.observationFeedback && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t("observationLevel")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge className={levelColors[aiAnalysis.observationLevel || "beginner"] || ""}>
              {aiAnalysis.observationFeedback.level}
            </Badge>
            {aiAnalysis.observationFeedback.nextSteps?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">{t("nextSteps")}</p>
                <ul className="space-y-1">
                  {aiAnalysis.observationFeedback.nextSteps.map((step, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary shrink-0">→</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* PM Learnings */}
      {aiAnalysis.pmLearnings && aiAnalysis.pmLearnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              {t("pmLearnings")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiAnalysis.pmLearnings.map((l, i) => (
                <div key={i} className="rounded-lg border border-border p-3 space-y-1">
                  <p className="text-sm font-medium">{l.topic}</p>
                  <p className="text-sm text-muted-foreground">{l.insight}</p>
                  <p className="text-xs text-primary">{l.actionable}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview Prep */}
      {aiAnalysis.interviewPrep && aiAnalysis.interviewPrep.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              {t("interviewPrep")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiAnalysis.interviewPrep.map((q, i) => (
                <div key={i} className="space-y-1.5">
                  <p className="text-sm font-medium">Q: {q.question}</p>
                  <p className="text-sm text-muted-foreground">{q.suggestedAnswer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
