"use client";

import { use, useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

import { useGame } from "@/hooks/use-games";
import { useGameAnalysis } from "@/hooks/use-analyses";
import { useAiAnalyze } from "@/hooks/use-ai";
import { AiLoadingModal } from "@/components/shared/ai-loading-modal";
import { GameHero } from "@/components/game/game-hero";
import { OverviewTab } from "@/components/game/tabs/overview-tab";
import { CategoryTab } from "@/components/game/tabs/category-tab";
import { KpiTab } from "@/components/game/tabs/kpi-tab";
import { CompetitorsTab } from "@/components/game/tabs/competitors-tab";
import { TrendsTab } from "@/components/game/tabs/trends-tab";
import { AiAnalysisTab } from "@/components/game/tabs/ai-analysis-tab";

// Category field configs
const CATEGORY_CONFIGS = [
  {
    tabKey: "ftue",
    label: "FTUE",
    fields: [
      { key: "ftueFirstImpression", labelKey: "ftueFirstImpression" },
      { key: "ftueOnboardingType", labelKey: "ftueOnboardingType" },
      { key: "ftueDuration", labelKey: "ftueDuration" },
      { key: "ftueFrictionPoints", labelKey: "ftueFrictionPoints" },
      { key: "ftuePermissionTiming", labelKey: "ftuePermissionTiming" },
    ],
    ratingKey: "ftueRating",
    notesKey: "ftueNotes",
  },
  {
    tabKey: "coreLoop",
    label: "Core Loop",
    fields: [
      { key: "coreLoopDefinition", labelKey: "coreLoopDefinition" },
      { key: "coreLoopSessionLength", labelKey: "coreLoopSessionLength" },
      { key: "coreLoopMasteryCurve", labelKey: "coreLoopMasteryCurve" },
      { key: "coreLoopVariety", labelKey: "coreLoopVariety" },
    ],
    ratingKey: "coreLoopRating",
    notesKey: "coreLoopNotes",
  },
  {
    tabKey: "monetization",
    label: "Monetization",
    fields: [
      { key: "monetizationModel", labelKey: "monetizationModel" },
      { key: "monetizationIap", labelKey: "monetizationIap" },
      { key: "monetizationAds", labelKey: "monetizationAds" },
      { key: "monetizationBattlePass", labelKey: "monetizationBattlePass" },
      { key: "monetizationVip", labelKey: "monetizationVip" },
    ],
    ratingKey: "monetizationRating",
    notesKey: "monetizationNotes",
  },
  {
    tabKey: "retention",
    label: "Retention",
    fields: [
      { key: "retentionRewards", labelKey: "retentionRewards" },
      { key: "retentionEnergy", labelKey: "retentionEnergy" },
      { key: "retentionNotifications", labelKey: "retentionNotifications" },
      { key: "retentionFomo", labelKey: "retentionFomo" },
      { key: "retentionSocial", labelKey: "retentionSocial" },
      { key: "retentionStreak", labelKey: "retentionStreak" },
    ],
    ratingKey: "retentionRating",
    notesKey: "retentionNotes",
  },
  {
    tabKey: "uxui",
    label: "UX/UI",
    fields: [
      { key: "uxMenu", labelKey: "uxMenu" },
      { key: "uxButtons", labelKey: "uxButtons" },
      { key: "uxLoading", labelKey: "uxLoading" },
      { key: "uxHud", labelKey: "uxHud" },
      { key: "uxAccessibility", labelKey: "uxAccessibility" },
    ],
    ratingKey: "uxRating",
    notesKey: "uxNotes",
  },
  {
    tabKey: "metaTech",
    label: "Meta & Tech",
    fields: [
      { key: "metaSystems", labelKey: "metaSystems" },
      { key: "metaLongTerm", labelKey: "metaLongTerm" },
      { key: "techLoadTime", labelKey: "techLoadTime" },
      { key: "techFps", labelKey: "techFps" },
      { key: "techBattery", labelKey: "techBattery" },
      { key: "techOffline", labelKey: "techOffline" },
      { key: "techSize", labelKey: "techSize" },
    ],
    ratingKey: "metaRating",
    notesKey: "metaNotes",
  },
];

function scoreColor(value: number) {
  if (value >= 7) return "text-emerald-400";
  if (value >= 4) return "text-yellow-400";
  return "text-red-400";
}

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("game");
  const locale = useLocale();
  const { data: game, isLoading: gameLoading } = useGame(id);
  const { data: analysisData, isLoading: analysisLoading } = useGameAnalysis(id);
  const aiAnalyze = useAiAnalyze();

  // AI Loading Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalStep, setAiModalStep] = useState(0);
  const [aiModalElapsed, setAiModalElapsed] = useState(0);
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    };
  }, []);

  const aiModalSteps = [
    "AI mentör incelemesi başlatılıyor...",
    "Kapsamlı değerlendirme yapılıyor...",
    "Kategori puanları hesaplanıyor...",
    "Sonuçlar kaydediliyor...",
  ];

  const handleAnalyze = async () => {
    setAiModalStep(0);
    setAiModalElapsed(0);
    setAiModalOpen(true);

    elapsedIntervalRef.current = setInterval(() => {
      setAiModalElapsed((prev) => prev + 1);
    }, 1000);
    stepIntervalRef.current = setInterval(() => {
      setAiModalStep((prev) => (prev < aiModalSteps.length - 1 ? prev + 1 : prev));
    }, 35000);

    try {
      await aiAnalyze.mutateAsync({ gameId: id, locale });
    } finally {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
      setAiModalOpen(false);
    }
  };

  if (gameLoading || analysisLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">{t("notFound")}</p>
      </div>
    );
  }

  const analysis = analysisData?.analysis || null;
  const kpis = analysisData?.kpis || [];
  const competitors = analysisData?.competitors || [];
  const trends = analysisData?.trends || [];
  const aiAnalysis = analysisData?.aiAnalysis || null;

  // Get AI comment for a category tab
  const getAiComment = (tabKey: string): string | null => {
    if (!aiAnalysis?.categoryScores) return null;
    const scores = aiAnalysis.categoryScores as Record<string, { comment?: string }>;
    return scores[tabKey]?.comment || null;
  };

  // Get rating for a category
  const getRating = (ratingKey: string): number | null => {
    if (!analysis) return null;
    const val = Number(analysis[ratingKey]);
    return isNaN(val) || val === 0 ? null : val;
  };

  return (
    <div className="space-y-6">
      {/* Hero — compute overall rating from analysis if not on game */}
      <GameHero game={game} computedRating={(() => {
        if (game.overallRating) return null; // game already has rating
        if (!analysis) return null;
        const ratingKeys = ["ftueRating", "coreLoopRating", "monetizationRating", "retentionRating", "uxRating", "metaRating"];
        const ratings = ratingKeys.map(k => Number(analysis[k])).filter(v => !isNaN(v) && v > 0);
        return ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
      })()} />

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList variant="line" className="flex flex-wrap gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-3.5 py-2">
            {t("tabs.overview")}
          </TabsTrigger>
          {CATEGORY_CONFIGS.map((cat) => {
            const rating = getRating(cat.ratingKey);
            return (
              <TabsTrigger key={cat.tabKey} value={cat.tabKey} className="text-xs sm:text-sm px-3.5 py-2 gap-1.5">
                {cat.label}
                {rating !== null && (
                  <span className={`text-[10px] font-semibold tabular-nums ${scoreColor(rating)}`}>
                    {rating.toFixed(1)}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
          <TabsTrigger value="kpi" className="text-xs sm:text-sm px-3.5 py-2">
            {t("tabs.kpi")}
          </TabsTrigger>
          <TabsTrigger value="competitors" className="text-xs sm:text-sm px-3.5 py-2">
            {t("tabs.competitors")}
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs sm:text-sm px-3.5 py-2">
            {t("tabs.trends")}
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs sm:text-sm px-3.5 py-2">
            {t("tabs.aiAnalysis")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6" keepMounted>
          <OverviewTab analysis={analysis} aiSummary={aiAnalysis?.executiveSummary || null} />
        </TabsContent>

        {CATEGORY_CONFIGS.map((cat) => (
          <TabsContent key={cat.tabKey} value={cat.tabKey} className="mt-6">
            <CategoryTab
              categoryKey={cat.tabKey}
              fields={cat.fields}
              ratingKey={cat.ratingKey}
              notesKey={cat.notesKey}
              analysis={analysis}
              aiComment={getAiComment(cat.tabKey)}
            />
          </TabsContent>
        ))}

        <TabsContent value="kpi" className="mt-6">
          <KpiTab kpis={kpis} />
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          <CompetitorsTab competitors={competitors} />
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <TrendsTab trends={trends} />
        </TabsContent>

        <TabsContent value="ai" className="mt-6" keepMounted>
          <AiAnalysisTab
            aiAnalysis={aiAnalysis}
            onAnalyze={analysis ? handleAnalyze : undefined}
            isAnalyzing={aiAnalyze.isPending}
          />
        </TabsContent>
      </Tabs>

      {/* AI Loading Modal */}
      <AiLoadingModal
        open={aiModalOpen}
        title="AI Analiz"
        steps={aiModalSteps}
        currentStep={aiModalStep}
        elapsedSeconds={aiModalElapsed}
      />
    </div>
  );
}
