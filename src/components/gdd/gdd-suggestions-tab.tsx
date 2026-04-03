"use client";

import { useTranslations } from "next-intl";
import { Lightbulb, Loader2, ArrowRight, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PhaseSuggestionItem } from "@/hooks/use-gdd";
import { cn } from "@/lib/utils";

interface PhaseInfo {
  phase: number;
  key: string;
  title: string;
}

interface GDDSuggestionsTabProps {
  phases: PhaseInfo[];
  completedPhases: number[];
  phaseSuggestions: Record<string, PhaseSuggestionItem[]>;
  loadingPhases: string[];
  onApplySuggestion: (phaseTitle: string, suggestion: string) => void;
}

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  medium: {
    icon: TrendingUp,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  low: {
    icon: Sparkles,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
};

export function GDDSuggestionsTab({
  phases,
  completedPhases,
  phaseSuggestions,
  loadingPhases,
  onApplySuggestion,
}: GDDSuggestionsTabProps) {
  const t = useTranslations("gdd");

  const completedPhasesWithData = phases.filter(p => completedPhases.includes(p.phase));
  const hasSuggestions = Object.keys(phaseSuggestions).length > 0;
  const hasLoading = loadingPhases.length > 0;

  if (!hasSuggestions && !hasLoading && completedPhasesWithData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center space-y-2">
          <Lightbulb className="h-8 w-8 text-muted-foreground/50 mx-auto" />
          <p className="text-sm text-muted-foreground">{t("noSuggestionsYet")}</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {completedPhasesWithData.map(({ phase, key, title }) => {
          const suggestions = phaseSuggestions[key] || [];
          const isLoading = loadingPhases.includes(key);

          return (
            <Card key={phase} className="rounded-xl border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  {title}
                  {suggestions.length > 0 && (
                    <Badge variant="outline" className="text-[10px] ml-auto">
                      {suggestions.length} {t("suggestionsCount")}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isLoading && suggestions.length === 0 && (
                  <div className="flex items-center gap-2 py-3 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">{t("generatingSuggestions")}</span>
                  </div>
                )}
                {suggestions.map((suggestion, i) => {
                  const config = priorityConfig[suggestion.priority] || priorityConfig.medium;
                  const PriorityIcon = config.icon;

                  return (
                    <div
                      key={i}
                      className={cn(
                        "rounded-lg border p-3 space-y-1.5",
                        config.border,
                        config.bg
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <PriorityIcon className={cn("h-4 w-4 mt-0.5 shrink-0", config.color)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{suggestion.title}</span>
                            <Badge variant="outline" className="text-[9px] shrink-0">
                              {t(`priority_${suggestion.priority}`)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{suggestion.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 shrink-0 text-xs gap-1"
                          onClick={() => onApplySuggestion(title, suggestion.title)}
                        >
                          <ArrowRight className="h-3 w-3" />
                          {t("applySuggestion")}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
