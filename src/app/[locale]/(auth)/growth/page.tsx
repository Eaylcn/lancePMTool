"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { TrendingUp, Sparkles, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGrowthDashboard, useGrowthReports, useGenerateGrowthReport } from "@/hooks/use-growth";
import { GrowthStats } from "@/components/growth/growth-stats";
import { SkillRadar } from "@/components/growth/skill-radar";
import { ObservationTrend } from "@/components/growth/observation-trend";
import { EvaluationHistory } from "@/components/growth/evaluation-history";
import { GrowthReport } from "@/components/growth/growth-report";
import { AnalysisHistoryTable } from "@/components/growth/analysis-history-table";
import { EmptyState } from "@/components/shared/empty-state";
import { AiLoadingModal } from "@/components/shared/ai-loading-modal";
import { PmLevelBadge } from "@/components/growth/pm-level-badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function GrowthPage() {
  const t = useTranslations("growth");
  const locale = useLocale();

  const { data: dashboard, isLoading: dashboardLoading } = useGrowthDashboard();
  const { data: reports = [] } = useGrowthReports();
  const generateReport = useGenerateGrowthReport();

  const latestReport = reports[0];

  // AI loading state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiElapsed, setAiElapsed] = useState(0);
  const [latestOverallScore, setLatestOverallScore] = useState<number | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const handleGenerateReport = async () => {
    setAiLoading(true);
    setAiStep(0);
    setAiElapsed(0);

    timerRef.current = setInterval(() => {
      setAiElapsed(prev => {
        const next = prev + 1;
        if (next === 5) setAiStep(1);
        if (next === 15) setAiStep(2);
        if (next === 25) setAiStep(3);
        return next;
      });
    }, 1000);

    try {
      const result = await generateReport.mutateAsync({ locale });
      setLatestOverallScore(result.overallScore);
      setAiStep(4);
    } catch {
      // error handled by mutation
    } finally {
      stopTimer();
      setTimeout(() => setAiLoading(false), 500);
    }
  };

  const aiSteps = [
    "Analiz verileri toplanıyor...",
    "PM performansı değerlendiriliyor...",
    "Büyüme raporu oluşturuluyor...",
    "Öneriler hazırlanıyor...",
  ];

  if (dashboardLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!dashboard || dashboard.stats.totalGames === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("description")}</p>
        </div>
        <EmptyState
          icon={TrendingUp}
          title={t("noAnalyses")}
          description={t("noAnalysesDescription")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            {t("title")}
            {latestReport?.currentLevel && (
              <PmLevelBadge level={latestReport.currentLevel as string} size="sm" />
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("description")}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard" className="gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            {t("tabs.dashboard")}
          </TabsTrigger>
          <TabsTrigger value="report" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            {t("tabs.report")}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <History className="h-3.5 w-3.5" />
            {t("tabs.history")}
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4 mt-4">
          <GrowthStats stats={dashboard.stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ObservationTrend data={dashboard.observationTrend} />
            <SkillRadar data={dashboard.skillRadar} />
          </div>

          <EvaluationHistory data={dashboard.evaluationHistory} />
        </TabsContent>

        {/* Report Tab */}
        <TabsContent value="report" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button
              onClick={handleGenerateReport}
              disabled={generateReport.isPending || dashboard.stats.totalAnalyses === 0}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {t("generateReport")}
            </Button>
          </div>

          {latestReport ? (
            <GrowthReport
              report={{
                currentLevel: latestReport.currentLevel as string,
                overallAssessment: latestReport.overallAssessment as string || "",
                strengths: (latestReport.strengths as { category: string; detail: string }[]) || [],
                weaknesses: (latestReport.weaknesses as { category: string; detail: string }[]) || [],
                trendAnalysis: (latestReport.trendAnalysis as { period: string; level: string; insight: string }[]) || [],
                genreDiversity: (latestReport.genreDiversity as { genre: string; count: number; depth: string }[]) || [],
                actionPlan: (latestReport.actionPlan as { priority: number; action: string; timeline: string; reason: string }[]) || [],
                interviewReadiness: (latestReport.interviewReadiness as { topic: string; readiness: string; tip: string }[]) || [],
                createdAt: latestReport.createdAt as string,
              }}
              overallScore={latestOverallScore}
            />
          ) : (
            <EmptyState
              icon={FileText}
              title={t("noReport")}
              description={t("noReportDescription")}
              action={{
                label: t("generateReport"),
                onClick: handleGenerateReport,
              }}
            />
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4 mt-4">
          <AnalysisHistoryTable data={dashboard.analysisHistory} />
        </TabsContent>
      </Tabs>

      {/* AI Loading Modal */}
      <AiLoadingModal
        open={aiLoading}
        title={t("generating")}
        steps={aiSteps}
        currentStep={aiStep}
        elapsedSeconds={aiElapsed}
      />
    </div>
  );
}
