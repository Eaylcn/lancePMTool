"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2, Eye, Repeat, DollarSign, Heart, Layout,
  Layers, BarChart3, Swords, TrendingUp, Sparkles,
} from "lucide-react";

import { useGame } from "@/hooks/use-games";
import { useGameAnalysis } from "@/hooks/use-analyses";
import { GameHero } from "@/components/game/game-hero";
import { OverviewTab } from "@/components/game/tabs/overview-tab";
import { CategoryTab } from "@/components/game/tabs/category-tab";
import { KpiTab } from "@/components/game/tabs/kpi-tab";
import { CompetitorsTab } from "@/components/game/tabs/competitors-tab";
import { TrendsTab } from "@/components/game/tabs/trends-tab";
import { AiAnalysisTab } from "@/components/game/tabs/ai-analysis-tab";

// Category field configs (same as wizard)
const CATEGORY_CONFIGS = [
  {
    tabKey: "ftue",
    label: "FTUE",
    icon: Eye,
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
    icon: Repeat,
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
    icon: DollarSign,
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
    icon: Heart,
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
    icon: Layout,
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
    icon: Layers,
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

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("game");
  const { data: game, isLoading: gameLoading } = useGame(id);
  const { data: analysisData, isLoading: analysisLoading } = useGameAnalysis(id);

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

  return (
    <div className="space-y-6">
      {/* Hero */}
      <GameHero game={game} />

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex h-auto gap-1 p-1 bg-muted/50 rounded-xl border border-border/50 w-auto min-w-full sm:min-w-0">
              <TabsTrigger value="overview" className="gap-1.5 rounded-lg text-xs sm:text-sm">
                <BarChart3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("tabs.overview")}</span>
                <span className="sm:hidden">Overview</span>
              </TabsTrigger>
              {CATEGORY_CONFIGS.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TabsTrigger key={cat.tabKey} value={cat.tabKey} className="gap-1.5 rounded-lg text-xs sm:text-sm">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{cat.label}</span>
                  </TabsTrigger>
                );
              })}
              <TabsTrigger value="kpi" className="gap-1.5 rounded-lg text-xs sm:text-sm">
                <BarChart3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("tabs.kpi")}</span>
                <span className="sm:hidden">KPI</span>
              </TabsTrigger>
              <TabsTrigger value="competitors" className="gap-1.5 rounded-lg text-xs sm:text-sm">
                <Swords className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("tabs.competitors")}</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="gap-1.5 rounded-lg text-xs sm:text-sm">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("tabs.trends")}</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-1.5 rounded-lg text-xs sm:text-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("tabs.aiAnalysis")}</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
            </TabsList>
          </div>
          {/* Fade edges for scroll */}
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none sm:hidden" />
        </div>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab analysis={analysis} />
        </TabsContent>

        {CATEGORY_CONFIGS.map((cat) => (
          <TabsContent key={cat.tabKey} value={cat.tabKey} className="mt-6">
            <CategoryTab
              categoryKey={cat.tabKey}
              fields={cat.fields}
              ratingKey={cat.ratingKey}
              notesKey={cat.notesKey}
              analysis={analysis}
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

        <TabsContent value="ai" className="mt-6">
          <AiAnalysisTab aiAnalysis={aiAnalysis} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
