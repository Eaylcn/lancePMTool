"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Sparkles, CheckCircle2, AlertCircle, Lightbulb, MessageSquare,
  Target, Loader2, BookOpen, GraduationCap, Wrench, Calendar, Brain,
  TrendingUp, Award, BarChart3,
} from "lucide-react";

// ─── Types matching new Zod schema ───
interface FieldReview {
  field: string;
  fieldLabel: string;
  issue: "wrong_answer" | "too_short" | "irrelevant" | "incomplete" | "empty" | "factually_wrong";
  message: string;
}

interface InterviewPrep {
  talkingPoints: string[];
  likelyQuestions: Array<{ question: string; modelAnswer: string }>;
  keyInsights: string[];
}

interface BenchmarkComparison {
  summary: string;
  comparisons: Array<{ metric: string; gameValue: string; benchmark: string; verdict: string }>;
}

interface PMScenario {
  summary: string;
  actionItems: Array<{ priority: number; action: string; rationale: string; expectedImpact: string }>;
}

interface AiAnalysisData {
  executiveSummary: string | null;
  overallScoreJustification: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  categoryScores: Record<string, { gameScore: number; analysisQuality: number; comment: string }> | null;
  verdicts: Array<{ category: string; verdict: string; recommendation: string }> | null;
  fieldReviews: FieldReview[] | null;
  kpiTrendsInsight: string | null;
  observationLevel: string | null;
  observationFeedback: { level: string; strengths: string[]; improvements: string[]; nextSteps: string[] } | null;
  pmLearnings: Array<{ topic: string; insight: string; actionable: string }> | null;
  interviewPrep: InterviewPrep | null;
  benchmarkComparison: BenchmarkComparison | null;
  pmScenario: PMScenario | null;
  mechanicSuggestions: Array<{ mechanic: string; reason: string; implementation: string }> | null;
}

interface AiAnalysisTabProps {
  aiAnalysis: AiAnalysisData | null;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

// ─── Issue badge helpers ───
const issueLabels: Record<string, string> = {
  wrong_answer: "Yanlış Cevap",
  too_short: "Çok Kısa",
  irrelevant: "İlgisiz",
  incomplete: "Eksik",
  empty: "Boş",
  factually_wrong: "Hatalı Bilgi",
};

const issueColors: Record<string, string> = {
  wrong_answer: "bg-red-500/10 text-red-500",
  too_short: "bg-yellow-500/10 text-yellow-500",
  irrelevant: "bg-orange-500/10 text-orange-500",
  incomplete: "bg-blue-500/10 text-blue-500",
  empty: "bg-zinc-500/10 text-zinc-400",
  factually_wrong: "bg-red-600/10 text-red-600",
};

const levelColors: Record<string, string> = {
  beginner: "bg-orange-500/10 text-orange-500",
  intermediate: "bg-yellow-500/10 text-yellow-500",
  advanced: "bg-blue-500/10 text-blue-500",
  professional: "bg-emerald-500/10 text-emerald-500",
};

const levelProgress: Record<string, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  professional: 100,
};

// ─── Sub-tab: Genel Değerlendirme ───
function GeneralAssessment({ ai }: { ai: AiAnalysisData }) {
  const t = useTranslations("game");

  const categoryChartData = ai.categoryScores
    ? Object.entries(ai.categoryScores).map(([key, scores]) => ({
        category: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        gameScore: scores.gameScore,
        analysisQuality: scores.analysisQuality,
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      {ai.executiveSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t("executiveSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{ai.executiveSummary}</p>
          </CardContent>
        </Card>
      )}

      {/* Overall Score Justification */}
      {ai.overallScoreJustification && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              {t("overallScoreJustification")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{ai.overallScoreJustification}</p>
          </CardContent>
        </Card>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid gap-4 sm:grid-cols-2">
        {ai.strengths && ai.strengths.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {t("strengths")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {ai.strengths.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-emerald-500 shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {ai.weaknesses && ai.weaknesses.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                {t("weaknesses")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {ai.weaknesses.map((w, i) => (
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 12, fill: "#a1a1aa" }} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: "#a1a1aa" }} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="gameScore" fill="#818cf8" name="Oyun Puanı" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="analysisQuality" fill="#34d399" name="Analiz Kalitesi" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Score Comments */}
      {ai.categoryScores && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("categoryAssessments")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(ai.categoryScores).map(([key, scores]) => (
              <div key={key} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs tabular-nums">
                      Oyun: {scores.gameScore.toFixed(1)}
                    </Badge>
                    <Badge variant="outline" className="text-xs tabular-nums">
                      Analiz: {scores.analysisQuality.toFixed(1)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{scores.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Verdicts */}
      {ai.verdicts && ai.verdicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t("categoryVerdicts")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ai.verdicts.map((v, i) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-1.5">
                <p className="text-sm font-medium">{v.category}</p>
                <p className="text-sm text-muted-foreground">{v.verdict}</p>
                <p className="text-xs text-primary">→ {v.recommendation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* KPI & Trends Insight */}
      {ai.kpiTrendsInsight && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t("kpiTrendsInsight")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">{ai.kpiTrendsInsight}</p>
          </CardContent>
        </Card>
      )}

      {/* Benchmark Comparison */}
      {ai.benchmarkComparison && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t("benchmarkComparison")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{ai.benchmarkComparison.summary}</p>

            {ai.benchmarkComparison.comparisons.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-medium text-muted-foreground">{t("metric")}</th>
                      <th className="text-left py-2 pr-4 font-medium text-muted-foreground">{t("gameValue")}</th>
                      <th className="text-left py-2 pr-4 font-medium text-muted-foreground">{t("benchmark")}</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">{t("verdict")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ai.benchmarkComparison.comparisons.map((c, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 pr-4 font-medium">{c.metric}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{c.gameValue}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{c.benchmark}</td>
                        <td className="py-2">{c.verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Sub-tab: Analiz Değerlendirmesi ───
function AnalysisAssessment({ ai }: { ai: AiAnalysisData }) {
  const t = useTranslations("game");

  return (
    <div className="space-y-6">
      {/* Observation Level with Progress Bar */}
      {ai.observationFeedback && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t("observationLevel")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className={levelColors[ai.observationLevel || "beginner"] || ""}>
                {ai.observationFeedback.level}
              </Badge>
            </div>

            {/* 5-level progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Başlangıç</span>
                <span>Gelişen</span>
                <span>İyi</span>
                <span>Çok İyi</span>
                <span>Profesyonel</span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${levelProgress[ai.observationLevel || "beginner"] || 25}%` }}
                />
              </div>
            </div>

            {/* Good observations */}
            {ai.observationFeedback.strengths?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {t("goodObservations")}
                </p>
                <ul className="space-y-1">
                  {ai.observationFeedback.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-emerald-500 shrink-0">+</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvement areas */}
            {ai.observationFeedback.improvements?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                  {t("improvementAreas")}
                </p>
                <ul className="space-y-1">
                  {ai.observationFeedback.improvements.map((imp, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-red-500 shrink-0">−</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next steps */}
            {ai.observationFeedback.nextSteps?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">{t("nextSteps")}</p>
                <ul className="space-y-1">
                  {ai.observationFeedback.nextSteps.map((step, i) => (
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

      {/* Field Reviews with Issue Type Badges */}
      {ai.fieldReviews && ai.fieldReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t("fieldReviews")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ai.fieldReviews.map((review, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-2.5">
                  <Badge className={`${issueColors[review.issue] || issueColors.empty} text-[10px] shrink-0 mt-0.5`}>
                    {issueLabels[review.issue] || review.issue}
                  </Badge>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">{review.fieldLabel}</p>
                    <p className="text-sm">{review.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Quality per Category */}
      {ai.categoryScores && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("analysisQualityByCategory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(ai.categoryScores).map(([key, scores]) => {
                const pct = (scores.analysisQuality / 10) * 100;
                const barColor = scores.analysisQuality >= 7 ? "bg-emerald-500" : scores.analysisQuality >= 4 ? "bg-yellow-500" : "bg-red-500";
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24 capitalize shrink-0">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold tabular-nums w-6 text-right">
                      {scores.analysisQuality.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Sub-tab: PM Dersleri ───
function PMLessons({ ai }: { ai: AiAnalysisData }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            PM Dersleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion multiple className="space-y-2">
            {/* PM Learnings */}
            {ai.pmLearnings && ai.pmLearnings.length > 0 && (
              <AccordionItem value="learnings">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    PM Öğrenim Noktaları
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {ai.pmLearnings.map((l, i) => (
                      <div key={i} className="rounded-lg border border-border p-3 space-y-1">
                        <p className="text-sm font-medium">{l.topic}</p>
                        <p className="text-sm text-muted-foreground">{l.insight}</p>
                        <p className="text-xs text-primary">→ {l.actionable}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Interview Prep */}
            {ai.interviewPrep && (
              <AccordionItem value="interview">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Mülakat Hazırlığı
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {/* Talking Points */}
                    {ai.interviewPrep.talkingPoints?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Konuşma Noktaları</p>
                        <ul className="space-y-1">
                          {ai.interviewPrep.talkingPoints.map((tp, i) => (
                            <li key={i} className="text-sm flex gap-2">
                              <span className="text-primary shrink-0">•</span>
                              {tp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Likely Questions */}
                    {ai.interviewPrep.likelyQuestions?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Olası Sorular & Model Cevaplar</p>
                        <div className="space-y-3">
                          {ai.interviewPrep.likelyQuestions.map((q, i) => (
                            <div key={i} className="space-y-1.5 rounded-lg border border-border p-3">
                              <p className="text-sm font-medium">S: {q.question}</p>
                              <p className="text-sm text-muted-foreground">{q.modelAnswer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Insights */}
                    {ai.interviewPrep.keyInsights?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Anahtar İçgörüler</p>
                        <ul className="space-y-1">
                          {ai.interviewPrep.keyInsights.map((insight, i) => (
                            <li key={i} className="text-sm flex gap-2">
                              <span className="text-yellow-500 shrink-0">★</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* PM Scenario */}
            {ai.pmScenario && (
              <AccordionItem value="scenario">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    PM Senaryosu — İlk 3 Ay
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <p className="text-sm leading-relaxed">{ai.pmScenario.summary}</p>

                    {ai.pmScenario.actionItems?.length > 0 && (
                      <div className="space-y-2">
                        {ai.pmScenario.actionItems
                          .sort((a, b) => a.priority - b.priority)
                          .map((item, i) => (
                            <div key={i} className="rounded-lg border border-border p-3 space-y-1.5">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] tabular-nums">
                                  #{item.priority}
                                </Badge>
                                <p className="text-sm font-medium">{item.action}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.rationale}</p>
                              <p className="text-xs text-primary">Beklenen Etki: {item.expectedImpact}</p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Mechanic Suggestions */}
            {ai.mechanicSuggestions && ai.mechanicSuggestions.length > 0 && (
              <AccordionItem value="mechanics">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary" />
                    Mekanik İyileştirme Önerileri
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {ai.mechanicSuggestions.map((m, i) => (
                      <div key={i} className="rounded-lg border border-border p-3 space-y-1.5">
                        <p className="text-sm font-medium">{m.mechanic}</p>
                        <p className="text-sm text-muted-foreground">{m.reason}</p>
                        <p className="text-xs text-primary">Uygulama: {m.implementation}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Component ───
export function AiAnalysisTab({ aiAnalysis, onAnalyze, isAnalyzing }: AiAnalysisTabProps) {
  const t = useTranslations("game");

  if (!aiAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground mb-4">{t("noAiAnalysis")}</p>
        {onAnalyze && (
          <Button onClick={onAnalyze} disabled={isAnalyzing} className="gap-2">
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isAnalyzing ? t("analyzing") : t("runAiAnalysis")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Re-analyze button */}
      {onAnalyze && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onAnalyze} disabled={isAnalyzing} className="gap-2">
            {isAnalyzing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {t("reAnalyze")}
          </Button>
        </div>
      )}

      <Tabs defaultValue="general">
        <TabsList variant="line" className="flex">
          <TabsTrigger value="general" className="text-xs sm:text-sm px-3 py-2">
            {t("generalAssessment")}
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs sm:text-sm px-3 py-2">
            {t("analysisAssessment")}
          </TabsTrigger>
          <TabsTrigger value="lessons" className="text-xs sm:text-sm px-3 py-2">
            {t("pmLessons")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4" keepMounted>
          <GeneralAssessment ai={aiAnalysis} />
        </TabsContent>

        <TabsContent value="analysis" className="mt-4" keepMounted>
          <AnalysisAssessment ai={aiAnalysis} />
        </TabsContent>

        <TabsContent value="lessons" className="mt-4" keepMounted>
          <PMLessons ai={aiAnalysis} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
