"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import {
  Eye,
  Repeat,
  DollarSign,
  Heart,
  Layout,
  Layers,
  Cpu,
  Star,
} from "lucide-react";

import { WizardSteps } from "@/components/analysis/wizard-steps";
import { CategoryAccordion } from "@/components/analysis/category-accordion";
import { KpiForm } from "@/components/analysis/kpi-form";
import { CompetitorTable } from "@/components/analysis/competitor-table";
import { TrendTable } from "@/components/analysis/trend-table";
import { GenreSelect } from "@/components/shared/genre-select";
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

    const result = await draftFill.mutateAsync({
      notes: rawNotes,
      genre: Array.isArray(genre) ? genre : [],
      gameTitle: title,
      locale,
    });

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
  };

  const handleSave = async (withAi: boolean) => {
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
        <p className="text-muted-foreground mt-1">{t("description")}</p>
      </div>

      {/* Steps indicator */}
      <WizardSteps currentStep={step} steps={stepLabels} />

      {/* Step 1: Note Input */}
      {step === 1 && (
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Game selection mode */}
            <div className="space-y-3">
              <Label>{t("gameSelection")}</Label>
              <div className="flex gap-3">
                <Button
                  variant={gameMode === "new" ? "default" : "outline"}
                  onClick={() => setGameMode("new")}
                  size="sm"
                >
                  {t("newGame")}
                </Button>
                <Button
                  variant={gameMode === "existing" ? "default" : "outline"}
                  onClick={() => setGameMode("existing")}
                  size="sm"
                >
                  {t("existingGame")}
                </Button>
              </div>
            </div>

            {gameMode === "existing" ? (
              <div className="space-y-2">
                <Label>{t("selectGame")}</Label>
                <Select value={selectedGameId} onValueChange={setSelectedGameId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectGamePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {existingGames?.map((game: { id: string; title: string }) => (
                      <SelectItem key={game.id} value={game.id}>{game.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("gameTitle")} *</Label>
                  <Input
                    value={newGameTitle}
                    onChange={(e) => setNewGameTitle(e.target.value)}
                    placeholder={t("gameTitlePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("studio")}</Label>
                  <Input
                    value={newGameStudio}
                    onChange={(e) => setNewGameStudio(e.target.value)}
                    placeholder={t("studioPlaceholder")}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>{t("genre")}</Label>
                  <GenreSelect value={newGameGenre} onChange={setNewGameGenre} />
                </div>
                <div className="space-y-2">
                  <Label>{t("platform")}</Label>
                  <Select value={newGamePlatform} onValueChange={setNewGamePlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectPlatform")} />
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

            <Separator />

            {/* Raw notes */}
            <div className="space-y-2">
              <Label>{t("rawNotes")}</Label>
              <Textarea
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                placeholder={t("rawNotesPlaceholder")}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">{t("rawNotesHint")}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => { setStep(2); saveDraft(); }}
              >
                {t("manualFill")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={handleDraftFill}
                disabled={draftFill.isPending || (!newGameTitle && !selectedGameId) || !rawNotes}
                className="gap-2"
              >
                {draftFill.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {t("aiDraftFill")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Review & Edit */}
      {step === 2 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Accordion type="multiple" defaultValue={["ftue"]} className="space-y-2">
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

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tCommon("back")}
              </Button>
              <Button onClick={() => { setStep(3); saveDraft(); }}>
                {tCommon("next")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: KPI, Competitors, Trends & Save */}
      {step === 3 && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <KpiForm
              values={kpis}
              onChange={(key, value) => setKpis((prev) => ({ ...prev, [key]: value }))}
              aiFilledFields={aiFilledFields}
            />

            <Separator />

            <CompetitorTable competitors={competitors} onChange={setCompetitors} />

            <Separator />

            <TrendTable trends={trends} onChange={setTrends} />

            <Separator />

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tCommon("back")}
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSave(false)}
                  disabled={createAnalysis.isPending || createGame.isPending}
                  className="gap-2"
                >
                  {(createAnalysis.isPending || createGame.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <Save className="h-4 w-4" />
                  {t("saveOnly")}
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  disabled={createAnalysis.isPending || createGame.isPending || aiAnalyze.isPending}
                  className="gap-2"
                >
                  {(createAnalysis.isPending || aiAnalyze.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <Sparkles className="h-4 w-4" />
                  {t("saveAndAnalyze")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
