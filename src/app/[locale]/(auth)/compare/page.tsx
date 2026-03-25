"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { GitCompareArrows, Sparkles, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGames } from "@/hooks/use-games";
import { useComparisons, useDeleteComparison, useAiCompare } from "@/hooks/use-comparisons";
import { GameSelector } from "@/components/compare/game-selector";
import { ComparisonBars } from "@/components/compare/comparison-bars";
import { AiCompareResult } from "@/components/compare/ai-compare-result";
import { SavedComparisons } from "@/components/compare/saved-comparisons";
import { EmptyState } from "@/components/shared/empty-state";
import { AiLoadingModal } from "@/components/shared/ai-loading-modal";
import type { CompareAiResult } from "@/lib/ai/types";

interface ComparisonData {
  id?: string;
  game1Id: string;
  game2Id: string;
  game1Title: string;
  game2Title: string;
  aiResult: CompareAiResult | null;
}

export default function ComparePage() {
  const t = useTranslations("compare");
  const locale = useLocale();

  const [game1Id, setGame1Id] = useState<string | null>(null);
  const [game2Id, setGame2Id] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<ComparisonData | null>(null);

  // AI loading state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiElapsed, setAiElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: games = [], isLoading: gamesLoading } = useGames();
  const { data: savedComparisons = [] } = useComparisons();
  const deleteComparison = useDeleteComparison();
  const aiCompare = useAiCompare();

  const game1 = games.find((g: { id: string }) => g.id === game1Id);
  const game2 = games.find((g: { id: string }) => g.id === game2Id);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const handleAiCompare = async () => {
    if (!game1Id || !game2Id || !game1 || !game2) return;

    setAiLoading(true);
    setAiStep(0);
    setAiElapsed(0);

    timerRef.current = setInterval(() => {
      setAiElapsed(prev => {
        const next = prev + 1;
        if (next === 5) setAiStep(1);
        if (next === 15) setAiStep(2);
        if (next === 30) setAiStep(3);
        return next;
      });
    }, 1000);

    try {
      const result = await aiCompare.mutateAsync({
        game1Id,
        game2Id,
        locale,
      });

      setCurrentResult({
        id: result.id,
        game1Id,
        game2Id,
        game1Title: game1.title,
        game2Title: game2.title,
        aiResult: result.aiResult as CompareAiResult,
      });
      setAiStep(4);
    } catch {
      // error handled by mutation
    } finally {
      stopTimer();
      setTimeout(() => setAiLoading(false), 500);
    }
  };

  const handleLoadComparison = (comp: {
    id: string;
    game1Id: string;
    game2Id: string;
    game1Title: string;
    game2Title: string;
    aiResult: unknown;
  }) => {
    setGame1Id(comp.game1Id);
    setGame2Id(comp.game2Id);
    setCurrentResult({
      id: comp.id,
      game1Id: comp.game1Id,
      game2Id: comp.game2Id,
      game1Title: comp.game1Title,
      game2Title: comp.game2Title,
      aiResult: comp.aiResult as CompareAiResult | null,
    });
  };

  // Reset result when game selection changes
  useEffect(() => {
    if (currentResult && (game1Id !== currentResult.game1Id || game2Id !== currentResult.game2Id)) {
      setCurrentResult(null);
    }
  }, [game1Id, game2Id, currentResult]);

  const aiSteps = [
    "Oyun verileri yükleniyor...",
    "Analizler karşılaştırılıyor...",
    "AI değerlendirme yapıyor...",
    "Sonuçlar hazırlanıyor...",
  ];

  if (!gamesLoading && games.length < 2) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("description")}</p>
        </div>
        <EmptyState
          icon={GitCompareArrows}
          title={t("emptyState.title")}
          description={t("emptyState.description")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("description")}</p>
      </div>

      {/* Game Selectors */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-background p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <GameSelector
            label={t("selectGame1")}
            games={games}
            selectedGameId={game1Id}
            onSelect={setGame1Id}
            disabledGameId={game2Id}
            placeholder={t("selectPlaceholder")}
            searchPlaceholder={t("searchPlaceholder")}
            noGamesText={t("noGames")}
          />

          <div className="flex items-center justify-center sm:pb-1">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Swords className="h-4 w-4 text-primary" />
            </div>
          </div>

          <GameSelector
            label={t("selectGame2")}
            games={games}
            selectedGameId={game2Id}
            onSelect={setGame2Id}
            disabledGameId={game1Id}
            placeholder={t("selectPlaceholder")}
            searchPlaceholder={t("searchPlaceholder")}
            noGamesText={t("noGames")}
          />
        </div>

        {/* Action Buttons */}
        {game1Id && game2Id && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleAiCompare}
              disabled={aiCompare.isPending}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {t("aiCompareButton")}
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      {currentResult?.aiResult && game1 && game2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Comparison Bars - Left */}
          <div className="lg:col-span-1">
            <ComparisonBars
              categoryWinners={currentResult.aiResult.categoryWinners}
              game1Title={game1.title}
              game2Title={game2.title}
            />
          </div>

          {/* AI Result - Right */}
          <div className="lg:col-span-2">
            <AiCompareResult
              result={currentResult.aiResult}
              game1Title={game1.title}
              game2Title={game2.title}
            />
          </div>
        </div>
      )}

      {/* Saved Comparisons */}
      <SavedComparisons
        comparisons={savedComparisons}
        onLoad={handleLoadComparison}
        onDelete={(id) => deleteComparison.mutate(id)}
        isDeleting={deleteComparison.isPending}
      />

      {/* AI Loading Modal */}
      <AiLoadingModal
        open={aiLoading}
        title={t("aiComparing")}
        steps={aiSteps}
        currentStep={aiStep}
        elapsedSeconds={aiElapsed}
      />
    </div>
  );
}
