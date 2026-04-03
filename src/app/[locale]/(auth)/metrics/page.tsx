"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  BarChart3, GraduationCap, Calculator, History,
  LayoutDashboard, FlaskConical,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGames } from "@/hooks/use-games";
import { useMetricAnalyses, useRunMetricAnalysis } from "@/hooks/use-metrics";
import { calculateDerivedMetrics, compareWithBenchmarks } from "@/lib/metrics/calculator";
import { MetricDashboard } from "@/components/metrics/metric-dashboard";
import { KpiEducation } from "@/components/metrics/kpi-education";
import { MetricCalculator } from "@/components/metrics/metric-calculator";
import { MetricBenchmarks } from "@/components/metrics/metric-benchmarks";
import { MetricAnalysisResult } from "@/components/metrics/metric-analysis-result";
import { MetricHistory } from "@/components/metrics/metric-history";
import { EmptyState } from "@/components/shared/empty-state";
import { AiLoadingModal } from "@/components/shared/ai-loading-modal";
import type { RawMetrics, MetricAiAnalysis } from "@/lib/metrics/types";

export default function MetricsPage() {
  const t = useTranslations("metrics");
  const locale = useLocale();

  // Tab state — controlled for programmatic switching
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data hooks
  const { data: gamesData = [], isLoading: gamesLoading } = useGames();
  const { data: analysesData = [] } = useMetricAnalyses();
  const runAnalysis = useRunMetricAnalysis();

  // Calculator state
  const [rawMetrics, setRawMetrics] = useState<RawMetrics>({});
  const [genre, setGenre] = useState("");
  const [gameId, setGameId] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<MetricAiAnalysis | null>(null);

  // AI loading state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiElapsed, setAiElapsed] = useState(0);
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

  // Derived metrics (real-time)
  const derivedMetrics = useMemo(
    () => calculateDerivedMetrics(rawMetrics),
    [rawMetrics]
  );

  // Benchmark comparisons (real-time)
  const benchmarkComparisons = useMemo(
    () => (genre ? compareWithBenchmarks(rawMetrics, derivedMetrics, genre) : []),
    [rawMetrics, derivedMetrics, genre]
  );

  // Game list for selector
  const gamesList = useMemo(
    () =>
      (gamesData as { id: string; title: string }[]).map((g) => ({
        id: g.id,
        title: g.title,
      })),
    [gamesData]
  );

  // Typed analyses for reuse
  const typedAnalyses = analysesData as Array<{
    id: string;
    gameId: string;
    gameTitle: string | null;
    rawMetrics: unknown;
    derivedMetrics: unknown;
    aiAnalysis: MetricAiAnalysis | null;
    createdAt: string;
  }>;

  // Handle raw metric change
  const handleRawChange = useCallback(
    (field: string, value: number | undefined) => {
      setRawMetrics((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Handle AI analyze — auto-switch to analysis tab on completion
  const handleAnalyze = async () => {
    if (!genre || !gameId) return;

    setAiLoading(true);
    setAiStep(0);
    setAiElapsed(0);

    timerRef.current = setInterval(() => {
      setAiElapsed((prev) => {
        const next = prev + 1;
        if (next === 3) setAiStep(1);
        if (next === 8) setAiStep(2);
        if (next === 15) setAiStep(3);
        return next;
      });
    }, 1000);

    try {
      const result = await runAnalysis.mutateAsync({
        rawMetrics,
        genre,
        gameId,
        locale,
      });
      setCurrentAnalysis(result.aiAnalysis as MetricAiAnalysis);
      setAiStep(4);
      // Auto-switch to analysis tab after completion
      setTimeout(() => setActiveTab("analysis"), 600);
    } catch {
      // error handled by mutation
    } finally {
      stopTimer();
      setTimeout(() => setAiLoading(false), 500);
    }
  };

  // Handle history item selection — load data and switch to analysis tab
  const handleHistorySelect = useCallback(
    (item: { rawMetrics: unknown; aiAnalysis: MetricAiAnalysis | null }) => {
      if (item.rawMetrics) {
        setRawMetrics(item.rawMetrics as RawMetrics);
      }
      if (item.aiAnalysis) {
        setCurrentAnalysis(item.aiAnalysis);
        setActiveTab("analysis");
      }
    },
    []
  );

  const aiSteps = [
    "Metrikler hesaplanıyor...",
    "Benchmark karşılaştırması yapılıyor...",
    "AI analiz hazırlıyor...",
    "Sonuçlar oluşturuluyor...",
  ];

  if (gamesLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gradient Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50 p-6">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-primary/10 blur-xl" />
      </div>

      {/* Tabs — 5 tab with line variant */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line" className="flex flex-wrap gap-1">
          <TabsTrigger value="dashboard" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <LayoutDashboard className="h-3.5 w-3.5" />
            {t("tabs.dashboard")}
          </TabsTrigger>
          <TabsTrigger value="education" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <GraduationCap className="h-3.5 w-3.5" />
            {t("tabs.education")}
          </TabsTrigger>
          <TabsTrigger value="calculator" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <Calculator className="h-3.5 w-3.5" />
            {t("tabs.calculator")}
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <FlaskConical className="h-3.5 w-3.5" />
            {t("tabs.analysis")}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <History className="h-3.5 w-3.5" />
            {t("tabs.history")}
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="mt-4">
          <MetricDashboard analyses={typedAnalyses} />
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="mt-4">
          <KpiEducation />
        </TabsContent>

        {/* Calculator Tab — only calculator, no benchmarks/analysis */}
        <TabsContent value="calculator" className="space-y-6 mt-4">
          <MetricCalculator
            rawMetrics={rawMetrics}
            derivedMetrics={derivedMetrics}
            genre={genre}
            gameId={gameId}
            games={gamesList}
            onRawChange={handleRawChange}
            onGenreChange={(v) => setGenre(v ?? "")}
            onGameChange={(v) => setGameId(v ?? "")}
            onAnalyze={handleAnalyze}
            isAnalyzing={runAnalysis.isPending}
          />
        </TabsContent>

        {/* Analysis Tab — benchmarks + AI analysis result */}
        <TabsContent value="analysis" className="space-y-6 mt-4">
          {!currentAnalysis && benchmarkComparisons.length === 0 ? (
            <EmptyState
              icon={FlaskConical}
              title={t("analysisEmpty.title")}
              description={t("analysisEmpty.description")}
            />
          ) : (
            <>
              {benchmarkComparisons.length > 0 && (
                <MetricBenchmarks
                  comparisons={benchmarkComparisons}
                  genre={genre}
                />
              )}
              <MetricAnalysisResult analysis={currentAnalysis} />
            </>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <MetricHistory
            analyses={typedAnalyses}
            onSelect={handleHistorySelect}
          />
        </TabsContent>
      </Tabs>

      {/* AI Loading Modal */}
      <AiLoadingModal
        open={aiLoading}
        title="Metrik Analizi"
        steps={aiSteps}
        currentStep={aiStep}
        elapsedSeconds={aiElapsed}
      />
    </div>
  );
}
