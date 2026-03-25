"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion } from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles, ArrowLeft, ArrowRight, Save, Loader2,
  Eye, Repeat, DollarSign, Heart, Layout, Layers, Cpu, Star,
  ChevronDown,
} from "lucide-react";

import { WizardSteps } from "@/components/analysis/wizard-steps";
import { CategoryAccordion } from "@/components/analysis/category-accordion";
import { KpiForm } from "@/components/analysis/kpi-form";
import { CompetitorTable } from "@/components/analysis/competitor-table";
import { TrendTable } from "@/components/analysis/trend-table";
import { GenreSelect } from "@/components/shared/genre-select";
import { AiLoadingModal } from "@/components/shared/ai-loading-modal";
import { useGames, useCreateGame } from "@/hooks/use-games";
import { useCreateAnalysis } from "@/hooks/use-analyses";
import { useDraftFill, useAiAnalyze } from "@/hooks/use-ai";
import { GENRE_SPECIFIC_FIELDS } from "@/lib/constants/genres";

const STORAGE_KEY = "lance-analysis-draft";

// Category field definitions
const CATEGORIES = [
  {
    key: "ftue",
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
    key: "coreLoop",
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
    key: "monetization",
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
    extraNotes: [{ key: "monetizationCommentary", labelKey: "monetizationCommentary" }],
  },
  {
    key: "retention",
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
    extraNotes: [{ key: "retentionCommentary", labelKey: "retentionCommentary" }],
  },
  {
    key: "uxui",
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
    key: "metaGame",
    icon: Layers,
    fields: [
      { key: "metaSystems", labelKey: "metaSystems" },
      { key: "metaLongTerm", labelKey: "metaLongTerm" },
    ],
    ratingKey: "metaRating",
    notesKey: "metaNotes",
  },
  {
    key: "technical",
    icon: Cpu,
    fields: [
      { key: "techLoadTime", labelKey: "techLoadTime" },
      { key: "techFps", labelKey: "techFps" },
      { key: "techBattery", labelKey: "techBattery" },
      { key: "techOffline", labelKey: "techOffline" },
      { key: "techSize", labelKey: "techSize" },
    ],
    ratingKey: "techRating",
    notesKey: "techNotes",
  },
  {
    key: "overall",
    icon: Star,
    fields: [
      { key: "overallBestFeature", labelKey: "overallBestFeature" },
      { key: "overallWorstFeature", labelKey: "overallWorstFeature" },
      { key: "overallUniqueMechanic", labelKey: "overallUniqueMechanic" },
      { key: "overallTargetAudience", labelKey: "overallTargetAudience" },
      { key: "overallLearnings", labelKey: "overallLearnings" },
    ],
    ratingKey: "",
    notesKey: "",
  },
];

export default function AnalyzeNewPage() {
  const t = useTranslations("analyze");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [showGameInfo, setShowGameInfo] = useState(false);

  // Step 1 state
  const [gameMode, setGameMode] = useState<"existing" | "new">("new");
  const [selectedGameId, setSelectedGameId] = useState("");
  const [newGameTitle, setNewGameTitle] = useState("");
  const [newGameStudio, setNewGameStudio] = useState("");
  const [newGameGenre, setNewGameGenre] = useState<string[]>([]);
  const [newGamePlatform, setNewGamePlatform] = useState("");
  const [rawNotes, setRawNotes] = useState("");

  // Step 2 state — analysis fields
  const [analysisFields, setAnalysisFields] = useState<Record<string, string | number>>({});
  const [genreSpecificFields, setGenreSpecificFields] = useState<Record<string, Record<string, string>>>({});
  const [aiFilledFields, setAiFilledFields] = useState<string[]>([]);

  // Step 3 state
  const [kpis, setKpis] = useState<Record<string, string | number>>({});
  const [competitors, setCompetitors] = useState<Array<{ competitorName: string; relationship: string; notes: string }>>([]);
  const [trends, setTrends] = useState<Array<{ trendType: string; title: string; impact: string; description: string }>>([]);

  // Hooks
  const { data: existingGames } = useGames();
  const createGame = useCreateGame();
  const createAnalysis = useCreateAnalysis();
  const draftFill = useDraftFill();
  const aiAnalyze = useAiAnalyze();

  // AI Loading Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalTitle, setAiModalTitle] = useState("");
  const [aiModalSteps, setAiModalSteps] = useState<string[]>([]);
  const [aiModalStep, setAiModalStep] = useState(0);
  const [aiModalElapsed, setAiModalElapsed] = useState(0);
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startModal = (title: string, steps: string[], stepIntervalMs = 35000) => {
    setAiModalTitle(title);
    setAiModalSteps(steps);
    setAiModalStep(0);
    setAiModalElapsed(0);
    setAiModalOpen(true);

    // Elapsed timer
    elapsedIntervalRef.current = setInterval(() => {
      setAiModalElapsed((prev) => prev + 1);
    }, 1000);

    // Simulated step progress
    stepIntervalRef.current = setInterval(() => {
      setAiModalStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stepIntervalMs);
  };

  const stopModal = () => {
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    stepIntervalRef.current = null;
    elapsedIntervalRef.current = null;
    setAiModalOpen(false);
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    };
  }, []);

  // localStorage auto-save
  const saveDraft = useCallback(() => {
    const draft = {
      step, gameMode, selectedGameId, newGameTitle, newGameStudio, newGameGenre, newGamePlatform,
      rawNotes, analysisFields, genreSpecificFields, aiFilledFields, kpis, competitors, trends,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [step, gameMode, selectedGameId, newGameTitle, newGameStudio, newGameGenre, newGamePlatform,
      rawNotes, analysisFields, genreSpecificFields, aiFilledFields, kpis, competitors, trends]);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.step) setStep(draft.step);
        if (draft.gameMode) setGameMode(draft.gameMode);
        if (draft.selectedGameId) setSelectedGameId(draft.selectedGameId);
        if (draft.newGameTitle) setNewGameTitle(draft.newGameTitle);
        if (draft.newGameStudio) setNewGameStudio(draft.newGameStudio);
        if (draft.newGameGenre) setNewGameGenre(draft.newGameGenre);
        if (draft.newGamePlatform) setNewGamePlatform(draft.newGamePlatform);
        if (draft.rawNotes) setRawNotes(draft.rawNotes);
        if (draft.analysisFields) setAnalysisFields(draft.analysisFields);
        if (draft.genreSpecificFields) setGenreSpecificFields(draft.genreSpecificFields);
        if (draft.aiFilledFields) setAiFilledFields(draft.aiFilledFields);
        if (draft.kpis) setKpis(draft.kpis);
        if (draft.competitors) setCompetitors(draft.competitors);
        if (draft.trends) setTrends(draft.trends);
      } catch { /* ignore corrupt data */ }
    }
  }, []);

  // Auto-save every 30s
  useEffect(() => {
    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [saveDraft]);

  // Handlers
  const handleFieldChange = (key: string, value: string | number) => {
    setAnalysisFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenreFieldChange = (genre: string, key: string, value: string) => {
    setGenreSpecificFields((prev) => ({
      ...prev,
      [genre]: { ...(prev[genre] || {}), [key]: value },
    }));
  };

  const handleDraftFill = async () => {
    const title = gameMode === "new" ? newGameTitle : existingGames?.find((g: { id: string }) => g.id === selectedGameId)?.title || "";
    const genre = gameMode === "new" ? newGameGenre : existingGames?.find((g: { id: string }) => g.id === selectedGameId)?.genre || [];

    startModal("AI Draft Fill", [
      "Notlar analiz ediliyor...",
      "Oyun bilgileri çıkarılıyor...",
      "Kategoriler dolduruluyor...",
      "Form hazırlanıyor...",
    ], 15000);

    try {
      const result = await draftFill.mutateAsync({
        notes: rawNotes,
        genre: Array.isArray(genre) ? genre : [],
        gameTitle: title || undefined,
        locale,
      });

      // Populate game info from AI if not already set
      if (gameMode === "new") {
        if (!newGameTitle && result.gameTitle) setNewGameTitle(result.gameTitle);
        if (newGameGenre.length === 0 && result.gameGenre) setNewGameGenre(result.gameGenre);
        if (!newGamePlatform && result.gamePlatform) setNewGamePlatform(result.gamePlatform);
        if (!newGameStudio && result.gameStudio) setNewGameStudio(result.gameStudio);
      }

      // Populate analysis fields
      setAnalysisFields(result.analysis as unknown as Record<string, string | number>);
      setAiFilledFields(result.filledFields);

      if (result.genreSpecificFields) {
        setGenreSpecificFields(result.genreSpecificFields);
      }

      if (result.kpis) {
        setKpis(result.kpis as unknown as Record<string, string | number>);
      }

      if (result.competitors) {
        setCompetitors(result.competitors);
      }

      if (result.trends) {
        setTrends(result.trends);
      }

      setStep(2);
    } finally {
      stopModal();
    }
  };

  const handleSave = async (withAi: boolean) => {
    if (withAi) {
      startModal("AI Analiz & Kaydet", [
        "Analiz kaydediliyor...",
        "AI mentör incelemesi başlatılıyor...",
        "Kapsamlı değerlendirme yapılıyor...",
        "Sonuçlar kaydediliyor...",
      ]);
    }

    try {
      let gameId = selectedGameId;

      // Create game if new
      if (gameMode === "new") {
        const game = await createGame.mutateAsync({
          title: newGameTitle,
          studio: newGameStudio || undefined,
          genre: newGameGenre,
          platform: newGamePlatform || undefined,
        });
        gameId = game.id;
      }

      // Create analysis
      await createAnalysis.mutateAsync({
        gameId,
        analysis: {
          ...analysisFields,
          genreSpecificFields,
          aiFilledFields,
        },
        kpis: Object.keys(kpis).length > 0 ? kpis : undefined,
        competitors: competitors.length > 0 ? competitors : undefined,
        trends: trends.length > 0 ? trends : undefined,
      });

      // Request AI analysis if requested
      if (withAi) {
        await aiAnalyze.mutateAsync({ gameId, locale });
      }

      // Clear draft
      localStorage.removeItem(STORAGE_KEY);

      // Navigate to game detail
      router.push(`/game/${gameId}`);
    } finally {
      if (withAi) {
        stopModal();
      }
    }
  };

  const genres = gameMode === "new"
    ? newGameGenre
    : (existingGames?.find((g: { id: string }) => g.id === selectedGameId)?.genre as string[]) || [];

  const stepLabels = [t("step1"), t("step2"), t("step3")];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("description")}</p>
      </div>

      {/* Steps indicator */}
      <WizardSteps
        currentStep={step}
        steps={stepLabels}
        onStepClick={(s) => { setStep(s); saveDraft(); }}
      />

      {/* Step 1: Notes First */}
      {step === 1 && (
        <div className="space-y-5">
          {/* Raw Notes — Primary */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("rawNotes")}</Label>
            <Textarea
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder={t("rawNotesPlaceholder")}
              rows={16}
              className="font-mono text-sm resize-y min-h-[300px]"
            />
            <p className="text-xs text-muted-foreground">{t("rawNotesHint")}</p>
          </div>

          {/* Game Info — Collapsible, Optional */}
          <div className="border border-border rounded-lg">
            <button
              type="button"
              onClick={() => setShowGameInfo(!showGameInfo)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{t("gameSelection")} ({tCommon("optional")})</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-150 ${showGameInfo ? "rotate-180" : ""}`} />
            </button>

            {showGameInfo && (
              <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                <div className="flex gap-2">
                  <Button
                    variant={gameMode === "new" ? "default" : "outline"}
                    onClick={() => setGameMode("new")}
                    size="sm"
                    className="h-7 text-xs"
                  >
                    {t("newGame")}
                  </Button>
                  <Button
                    variant={gameMode === "existing" ? "default" : "outline"}
                    onClick={() => setGameMode("existing")}
                    size="sm"
                    className="h-7 text-xs"
                  >
                    {t("existingGame")}
                  </Button>
                </div>

                {gameMode === "existing" ? (
                  <div className="space-y-2">
                    <Label className="text-sm">{t("selectGame")}</Label>
                    <Select value={selectedGameId} onValueChange={(v) => setSelectedGameId(v ?? "")}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder={t("selectGamePlaceholder")}>
                          {(v: string | null) => {
                            if (!v) return t("selectGamePlaceholder");
                            const game = existingGames?.find((g: { id: string; title: string }) => g.id === v);
                            return game?.title ?? t("selectGamePlaceholder");
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {existingGames?.map((game: { id: string; title: string }) => (
                          <SelectItem key={game.id} value={game.id}>{game.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("gameTitle")}</Label>
                      <Input
                        value={newGameTitle}
                        onChange={(e) => setNewGameTitle(e.target.value)}
                        placeholder={t("gameTitlePlaceholder")}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("studio")}</Label>
                      <Input
                        value={newGameStudio}
                        onChange={(e) => setNewGameStudio(e.target.value)}
                        placeholder={t("studioPlaceholder")}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-sm">{t("genre")}</Label>
                      <GenreSelect value={newGameGenre} onChange={setNewGameGenre} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("platform")}</Label>
                      <Select value={newGamePlatform} onValueChange={(v) => setNewGamePlatform(v ?? "")}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder={t("selectPlatform")}>
                            {(v: string | null) => {
                              if (!v) return t("selectPlatform");
                              const labels: Record<string, string> = { ios: "iOS", android: "Android", both: t("bothPlatforms") };
                              return labels[v] ?? t("selectPlatform");
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ios">iOS</SelectItem>
                          <SelectItem value="android">Android</SelectItem>
                          <SelectItem value="both">{t("bothPlatforms")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => { setStep(2); saveDraft(); }}
              className="gap-2 h-9"
            >
              {t("manualFill")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={handleDraftFill}
              disabled={draftFill.isPending || !rawNotes.trim()}
              className="gap-2 h-9"
            >
              {draftFill.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {t("aiDraftFill")}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Review & Edit */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Show game info summary if AI filled it */}
          {gameMode === "new" && newGameTitle && (
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-sm">{t("gameTitle")} *</Label>
                    <Input
                      value={newGameTitle}
                      onChange={(e) => setNewGameTitle(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">{t("studio")}</Label>
                    <Input
                      value={newGameStudio}
                      onChange={(e) => setNewGameStudio(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-sm">{t("genre")}</Label>
                    <GenreSelect value={newGameGenre} onChange={setNewGameGenre} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Accordion multiple defaultValue={["ftue"]} className="space-y-2">
            {CATEGORIES.map((cat) => (
              <CategoryAccordion
                key={cat.key}
                categoryKey={cat.key}
                icon={cat.icon}
                fields={cat.fields}
                values={analysisFields}
                onChange={handleFieldChange}
                ratingKey={cat.ratingKey}
                notesKey={cat.notesKey}
                aiFilledFields={aiFilledFields}
                extraNotes={cat.extraNotes}
              />
            ))}

            {/* Genre-specific accordions */}
            {genres.map((genre) => {
              const genreFields = GENRE_SPECIFIC_FIELDS[genre];
              if (!genreFields) return null;
              return (
                <CategoryAccordion
                  key={`genre-${genre}`}
                  categoryKey={genre}
                  icon={Star}
                  fields={genreFields}
                  values={genreSpecificFields[genre] || {}}
                  onChange={(key, value) => handleGenreFieldChange(genre, key, String(value))}
                  ratingKey=""
                  notesKey=""
                  aiFilledFields={aiFilledFields}
                />
              );
            })}
          </Accordion>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-2 h-9">
              <ArrowLeft className="h-3.5 w-3.5" />
              {tCommon("back")}
            </Button>
            <Button onClick={() => { setStep(3); saveDraft(); }} className="gap-2 h-9">
              {tCommon("next")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: KPI, Competitors, Trends & Save */}
      {step === 3 && (
        <div className="space-y-5">
          <Card className="border-border">
            <CardContent className="p-5">
              <KpiForm
                values={kpis}
                onChange={(key, value) => setKpis((prev) => ({ ...prev, [key]: value }))}
                aiFilledFields={aiFilledFields}
              />
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-5">
              <CompetitorTable competitors={competitors} onChange={setCompetitors} />
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-5">
              <TrendTable trends={trends} onChange={setTrends} />
            </CardContent>
          </Card>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(2)} className="gap-2 h-9">
              <ArrowLeft className="h-3.5 w-3.5" />
              {tCommon("back")}
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={createAnalysis.isPending || createGame.isPending}
                className="gap-2 h-9"
              >
                {(createAnalysis.isPending || createGame.isPending) && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                <Save className="h-3.5 w-3.5" />
                {t("saveOnly")}
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={createAnalysis.isPending || createGame.isPending || aiAnalyze.isPending}
                className="gap-2 h-9"
              >
                {(createAnalysis.isPending || aiAnalyze.isPending) && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                <Sparkles className="h-3.5 w-3.5" />
                {t("saveAndAnalyze")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Loading Modal */}
      <AiLoadingModal
        open={aiModalOpen}
        title={aiModalTitle}
        steps={aiModalSteps}
        currentStep={aiModalStep}
        elapsedSeconds={aiModalElapsed}
      />
    </div>
  );
}
