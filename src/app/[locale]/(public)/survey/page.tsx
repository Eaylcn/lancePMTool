"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ClipboardList, Loader2 } from "lucide-react";
import { useSurveySession, useCreateSurvey } from "@/hooks/use-survey";
import { SurveyWizard } from "@/components/survey/survey-wizard";

export default function SurveyPage() {
  const t = useTranslations("survey");
  const { data: session, isLoading } = useSurveySession();
  const createSurvey = useCreateSurvey();

  const handleStart = async () => {
    await createSurvey.mutateAsync();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // No session yet — show landing
  if (!session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center space-y-6">
          {/* Hero */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Info */}
          <div className="rounded-xl border border-border bg-card p-5 text-left">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("heroDescription")}
            </p>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            onClick={handleStart}
            disabled={createSurvey.isPending}
            className="gap-2"
          >
            {createSurvey.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ClipboardList className="h-4 w-4" />
            )}
            {t("startButton")}
          </Button>
        </div>
      </div>
    );
  }

  // Session exists — show wizard
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <SurveyWizard
        initialResponses={(session.responses as Record<string, unknown>) || {}}
        completed={session.completed || false}
      />
    </div>
  );
}
