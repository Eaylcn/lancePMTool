"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Save, Pencil, Eye, Loader2, MessageSquare, LayoutDashboard, Lightbulb } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GDDChat } from "./gdd-chat";
import { GDDPreview } from "./gdd-preview";
import { GDDPhaseStepper } from "./gdd-phase-stepper";
import { GDDExport } from "./gdd-export";
import { GDDAIPromptExport } from "./gdd-ai-prompt-export";
import { GDDOverview } from "./gdd-overview";
import { GDDSuggestionsTab } from "./gdd-suggestions-tab";
import {
  useGDDSession,
  useSendGDDMessage,
  useUpdateGDDSession,
  useGenerateGDDPhases,
  useGenerateGDDPhaseSuggestions,
  type GDDMessage,
  type GDDSuggestion,
  type GDDQuestionType,
  type CustomPhase,
  type PhaseSuggestionItem,
} from "@/hooks/use-gdd";
import { getGDDOpeningMessage } from "@/lib/ai/prompts/gdd";

interface GDDWorkspaceProps {
  sessionId: string;
}

export function GDDWorkspace({ sessionId }: GDDWorkspaceProps) {
  const locale = useLocale();
  const t = useTranslations("gdd");
  const { data: session, isLoading } = useGDDSession(sessionId);
  const sendMessage = useSendGDDMessage();
  const updateSession = useUpdateGDDSession();
  const generatePhases = useGenerateGDDPhases();
  const generatePhaseSuggestions = useGenerateGDDPhaseSuggestions();

  const [messages, setMessages] = useState<GDDMessage[]>([]);
  const [suggestions, setSuggestions] = useState<GDDSuggestion[]>([]);
  const [questionType, setQuestionType] = useState<GDDQuestionType>("suggestions");
  const [currentPhase, setCurrentPhase] = useState(1);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [gddData, setGddData] = useState<Record<string, Record<string, unknown>>>({});
  const [customPhases, setCustomPhases] = useState<CustomPhase[] | null>(null);
  const [isGeneratingPhases, setIsGeneratingPhases] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [saved, setSaved] = useState(true);
  const [initialIdeaSent, setInitialIdeaSent] = useState(false);
  const [phaseSuggestions, setPhaseSuggestions] = useState<Record<string, PhaseSuggestionItem[]>>({});
  const [loadingSuggestionPhases, setLoadingSuggestionPhases] = useState<string[]>([]);

  // Init state from session
  useEffect(() => {
    if (!session) return;

    const sessionMessages = (session.messages || []) as GDDMessage[];
    setCurrentPhase(session.currentPhase);
    setCompletedPhases((session.completedPhases || []) as number[]);
    const sessionGddData = (session.gddData || {}) as Record<string, Record<string, unknown>>;
    setGddData(sessionGddData);
    setTitleInput(session.title);

    // Restore custom phases from _meta
    const meta = sessionGddData._meta as Record<string, unknown> | undefined;
    if (meta?.custom_phases) {
      setCustomPhases(meta.custom_phases as CustomPhase[]);
    }
    if (meta?.phase_suggestions) {
      setPhaseSuggestions(meta.phase_suggestions as Record<string, PhaseSuggestionItem[]>);
    }

    if (sessionMessages.length === 0) {
      // New session — add opening message
      const openingRaw = getGDDOpeningMessage(locale as "tr" | "en");
      const opening: GDDMessage = {
        role: "assistant",
        content: openingRaw,
        timestamp: new Date().toISOString(),
      };
      setMessages([opening]);

      // Parse suggestions from opening
      try {
        const parsed = JSON.parse(openingRaw);
        setSuggestions(parsed.suggestions || []);
      } catch {
        setSuggestions([]);
      }

      // Save opening message to DB
      updateSession.mutate({
        id: sessionId,
        data: { messages: [opening] } as Record<string, unknown>,
      });
    } else {
      setMessages(sessionMessages);

      // Parse suggestions and questionType from last assistant message
      const lastAssistant = [...sessionMessages].reverse().find(m => m.role === "assistant");
      if (lastAssistant) {
        try {
          let text = lastAssistant.content;
          if (text.startsWith("```")) {
            text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
          }
          const parsed = JSON.parse(text);
          setSuggestions(parsed.suggestions || []);
          setQuestionType(parsed.question_type || "suggestions");
        } catch {
          setSuggestions([]);
          setQuestionType("suggestions");
        }
      }
    }
  }, [session, locale, sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Compute phase config for child components (must be before handleSendMessage)
  const DEFAULT_PHASES = useMemo(() => [
    { phase: 1, key: "pitch", title: locale === "en" ? "Core Idea & Pitch" : "Temel Fikir & Pitch" },
    { phase: 2, key: "genre", title: locale === "en" ? "Genre & Gameplay" : "Tür & Oynanış" },
    { phase: 3, key: "core_loop", title: locale === "en" ? "Core Loop" : "Core Loop" },
    { phase: 4, key: "world", title: locale === "en" ? "World & Atmosphere" : "Dünya & Atmosfer" },
    { phase: 5, key: "characters", title: locale === "en" ? "Characters & Enemies" : "Karakter & Düşmanlar" },
    { phase: 6, key: "systems", title: locale === "en" ? "Systems" : "Sistemler" },
    { phase: 7, key: "mvp", title: locale === "en" ? "MVP Scope" : "MVP Kapsamı" },
  ], [locale]);

  const phaseConfig = useMemo(() => {
    if (!customPhases) return DEFAULT_PHASES;
    return [
      { phase: 1, key: "pitch", title: locale === "en" ? "Core Idea & Pitch" : "Temel Fikir & Pitch" },
      ...customPhases.map(p => ({
        phase: p.phase,
        key: p.key,
        title: locale === "en" ? p.title_en : p.title_tr,
      })),
    ];
  }, [customPhases, locale, DEFAULT_PHASES]);

  const handleSendMessage = useCallback((content: string) => {
    // Add user message to local state immediately
    const userMsg: GDDMessage = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setSuggestions([]);
    setQuestionType("suggestions");
    setSaved(false);

    sendMessage.mutate({
      sessionId,
      message: content,
      currentPhase,
      completedPhases,
      currentGDDData: gddData,
      messageHistory: messages,
      locale,
    }, {
      onSuccess: (data) => {
        // Add assistant response
        const assistantMsg: GDDMessage = {
          role: "assistant",
          content: JSON.stringify({
            message: data.message,
            question_type: data.question_type,
            suggestions: data.suggestions,
            gdd_update: data.gdd_update,
            phase_completed: data.phase_completed,
            next_phase: data.next_phase,
          }),
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMsg]);
        setSuggestions(data.suggestions || []);
        setQuestionType(data.question_type || "suggestions");
        setCurrentPhase(data.current_phase);
        setCompletedPhases(data.completed_phases);
        setGddData(data.gdd_data);
        setSaved(true);

        // Generate dynamic phases after Phase 1 completes
        if (data.phase_completed && data.current_phase === 2 && !customPhases) {
          setIsGeneratingPhases(true);
          generatePhases.mutate({
            sessionId,
            locale,
          }, {
            onSuccess: (phaseData) => {
              setCustomPhases(phaseData.phases);
              setIsGeneratingPhases(false);
            },
            onError: () => {
              setIsGeneratingPhases(false);
            },
          });
        }

        // Generate phase suggestions when a phase completes
        if (data.phase_completed) {
          const completedPhaseNum = data.current_phase - 1;
          const completedPhaseConfig = phaseConfig.find(p => p.phase === completedPhaseNum);
          if (completedPhaseConfig && !phaseSuggestions[completedPhaseConfig.key]) {
            setLoadingSuggestionPhases(prev => [...prev, completedPhaseConfig.key]);
            generatePhaseSuggestions.mutate({
              sessionId,
              phaseKey: completedPhaseConfig.key,
              phaseTitle: completedPhaseConfig.title,
              locale,
            }, {
              onSuccess: (result) => {
                setPhaseSuggestions(prev => ({
                  ...prev,
                  [result.phaseKey]: result.suggestions,
                }));
                setLoadingSuggestionPhases(prev => prev.filter(k => k !== completedPhaseConfig.key));
              },
              onError: () => {
                setLoadingSuggestionPhases(prev => prev.filter(k => k !== completedPhaseConfig.key));
              },
            });
          }
        }
      },
    });
  }, [sessionId, currentPhase, completedPhases, gddData, messages, locale, sendMessage, customPhases, generatePhases, phaseConfig, phaseSuggestions, generatePhaseSuggestions]);

  // Auto-send initial idea if present
  useEffect(() => {
    if (initialIdeaSent || !session || messages.length === 0) return;
    const meta = (session.gddData as Record<string, Record<string, unknown>>)?._meta as Record<string, unknown> | undefined;
    const initialIdea = meta?.initial_idea as string | undefined;
    if (!initialIdea) return;
    const sessionMessages = (session.messages || []) as GDDMessage[];
    if (sessionMessages.length > 0) return; // Not a new session
    setInitialIdeaSent(true);
    setTimeout(() => handleSendMessage(initialIdea), 300);
  }, [messages, session, initialIdeaSent, handleSendMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTitleSave = () => {
    if (!titleInput.trim()) return;
    updateSession.mutate({ id: sessionId, data: { title: titleInput.trim() } as Record<string, unknown> });
    setIsEditingTitle(false);
  };

  const handleApplySuggestion = useCallback((phaseTitle: string, suggestion: string) => {
    const message = locale === "tr"
      ? `"${phaseTitle}" bölümündeki "${suggestion}" önerisini GDD'ye uygulayabilir misin?`
      : `Can you apply the "${suggestion}" suggestion to the "${phaseTitle}" section of the GDD?`;
    setActiveTab("chat");
    setTimeout(() => handleSendMessage(message), 150);
  }, [locale, handleSendMessage]);

  const handleOverviewSuggestion = useCallback((topic: string) => {
    const message = locale === "tr"
      ? `GDD'nin "${topic}" bölümü hakkında öneriler ve iyileştirmeler sunabilir misin?`
      : `Can you provide suggestions and improvements for the "${topic}" section of the GDD?`;
    setActiveTab("chat");
    setTimeout(() => handleSendMessage(message), 150);
  }, [locale, handleSendMessage]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">{t("loading")}</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">{t("notFound")}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/gdd">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>

            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                  className="h-8 w-64"
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleTitleSave}>
                  <Save className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{session.title}</h1>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {saved ? t("saved") : t("saving")}
            </span>
            <GDDExport
              title={session.title}
              gddData={gddData}
              isCompleted={session.status === "completed"}
              phases={phaseConfig}
            />
            <GDDAIPromptExport
              title={session.title}
              gddData={gddData}
              isCompleted={session.status === "completed"}
              phases={phaseConfig}
            />

            {/* Mobile preview button */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Eye className="h-4 w-4 mr-1.5" />
                    {t("preview")}
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[90vw] sm:w-[400px] p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>{t("preview")}</SheetTitle>
                </SheetHeader>
                <GDDPreview
                  currentPhase={currentPhase}
                  completedPhases={completedPhases}
                  gddData={gddData}
                  phases={phaseConfig}
                  customPhases={customPhases}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Phase stepper */}
        <GDDPhaseStepper currentPhase={currentPhase} completedPhases={completedPhases} phases={phaseConfig} />
      </div>

      {/* Phase generation loading */}
      {isGeneratingPhases && (
        <div className="flex items-center justify-center gap-2 py-3 bg-primary/5 border-b border-border">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-primary">{t("generatingPhases")}</span>
        </div>
      )}

      {/* Split view */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Chat + Overview Tabs */}
        <div className="flex-1 border-r border-border flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="chat" className="flex flex-col flex-1 min-h-0">
            <div className="border-b border-border px-4">
              <TabsList variant="line">
                <TabsTrigger value="chat" className="px-3.5 py-2 gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  {t("chatTab")}
                </TabsTrigger>
                <TabsTrigger value="overview" className="px-3.5 py-2 gap-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  {t("overviewTab")}
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="px-3.5 py-2 gap-1.5">
                  <Lightbulb className="h-4 w-4" />
                  {t("suggestionsTab")}
                  {Object.keys(phaseSuggestions).length > 0 && (
                    <span className="ml-1 text-[10px] bg-amber-500/20 text-amber-600 rounded-full px-1.5">
                      {Object.values(phaseSuggestions).flat().length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="chat" className="flex-1 min-h-0">
              <GDDChat
                messages={messages}
                suggestions={suggestions}
                questionType={questionType}
                onSendMessage={handleSendMessage}
                isSending={sendMessage.isPending || isGeneratingPhases}
              />
            </TabsContent>
            <TabsContent value="overview" className="flex-1 min-h-0">
              <GDDOverview
                gddData={gddData}
                phases={phaseConfig}
                completedPhases={completedPhases}
                currentPhase={currentPhase}
                onRequestSuggestions={handleOverviewSuggestion}
              />
            </TabsContent>
            <TabsContent value="suggestions" className="flex-1 min-h-0">
              <GDDSuggestionsTab
                phases={phaseConfig}
                completedPhases={completedPhases}
                phaseSuggestions={phaseSuggestions}
                loadingPhases={loadingSuggestionPhases}
                onApplySuggestion={handleApplySuggestion}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: GDD Preview (desktop only) */}
        <div className="w-[400px] shrink-0 hidden lg:block">
          <GDDPreview
            currentPhase={currentPhase}
            completedPhases={completedPhases}
            gddData={gddData}
            phases={phaseConfig}
            customPhases={customPhases}
          />
        </div>
      </div>
    </div>
  );
}
