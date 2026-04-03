"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  ClipboardList, LayoutDashboard, FileText, List, FlaskConical, History,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useSurveys } from "@/hooks/use-surveys";
import { SurveyDashboard } from "@/components/surveys/survey-dashboard";
import { SurveyTemplates } from "@/components/surveys/survey-templates";
import { SurveyList } from "@/components/surveys/survey-list";
import { SurveyResultsView } from "@/components/surveys/survey-results-view";
import { SurveyHistory } from "@/components/surveys/survey-history";
import { SurveyCreateDialog } from "@/components/surveys/survey-create-dialog";
import type { SurveyTemplate } from "@/lib/types/survey";

export default function SurveysPage() {
  const t = useTranslations("surveys");
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: surveysData = [], isLoading } = useSurveys();

  // Create dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);

  const handleSelectTemplate = useCallback((template: SurveyTemplate) => {
    setSelectedTemplate(template);
    setCreateOpen(true);
  }, []);

  const handleCreateManual = useCallback(() => {
    setSelectedTemplate(null);
    setCreateOpen(true);
  }, []);

  const handleCreated = useCallback((_surveyId: string, _shareToken: string) => {
    setActiveTab("mySurveys");
  }, []);

  const handleEditSurvey = useCallback((_surveyId: string) => {
    // TODO: open edit dialog
  }, []);

  // History data placeholder (from analyses)
  const historyAnalyses: {
    id: string;
    surveyId: string;
    analysisType: "normal" | "cross_question" | "cross_survey" | "trend";
    results: Record<string, unknown>;
    createdAt: string;
    surveyTitle?: string;
  }[] = [];

  if (isLoading) {
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
            <ClipboardList className="h-8 w-8 text-primary" />
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-primary/10 blur-xl" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line" className="flex flex-wrap gap-1">
          <TabsTrigger value="dashboard" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <LayoutDashboard className="h-3.5 w-3.5" />
            {t("tabs.dashboard")}
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <FileText className="h-3.5 w-3.5" />
            {t("tabs.templates")}
          </TabsTrigger>
          <TabsTrigger value="mySurveys" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <List className="h-3.5 w-3.5" />
            {t("tabs.mySurveys")}
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <FlaskConical className="h-3.5 w-3.5" />
            {t("tabs.results")}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <History className="h-3.5 w-3.5" />
            {t("tabs.history")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4">
          <SurveyDashboard surveys={surveysData} />
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <SurveyTemplates
            onSelectTemplate={handleSelectTemplate}
            onCreateManual={handleCreateManual}
          />
        </TabsContent>

        <TabsContent value="mySurveys" className="mt-4">
          <SurveyList
            surveys={surveysData}
            onCreateNew={handleCreateManual}
            onEdit={handleEditSurvey}
          />
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <SurveyResultsView surveys={surveysData} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SurveyHistory
            analyses={historyAnalyses}
            onSelect={() => {}}
          />
        </TabsContent>
      </Tabs>

      {/* Create dialog */}
      <SurveyCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        template={selectedTemplate}
        onCreated={handleCreated}
      />
    </div>
  );
}
