"use client";

import { useTranslations } from "next-intl";
import { Check, Loader2, Lock, Sparkles, Gamepad2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PhaseInfo {
  phase: number;
  key: string;
  title: string;
}

interface GDDOverviewProps {
  gddData: Record<string, Record<string, unknown>>;
  phases: PhaseInfo[];
  completedPhases: number[];
  currentPhase: number;
  onRequestSuggestions: (topic: string) => void;
}

const summaryFields: Record<string, { label: string; icon?: string }> = {
  concept: { label: "Konsept" },
  tagline: { label: "Tagline" },
  platform: { label: "Platform" },
  game_engine: { label: "Oyun Motoru" },
  target_audience: { label: "Hedef Kitle" },
  unique_selling_point: { label: "Benzersiz Özellik" },
  monetization: { label: "Monetizasyon" },
};

function formatFieldValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value ? "Evet" : "Hayır";
  if (typeof value === "string") return value || null;
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : null;
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return obj.name ? String(obj.name) : JSON.stringify(value);
  }
  return String(value);
}

export function GDDOverview({ gddData, phases, completedPhases, currentPhase, onRequestSuggestions }: GDDOverviewProps) {
  const t = useTranslations("gdd");

  const pitchData = gddData.pitch as Record<string, unknown> | undefined;
  const hasPitch = pitchData && Object.keys(pitchData).length > 0;
  const meta = gddData._meta as Record<string, unknown> | undefined;
  const gameVision = meta?.game_vision as string | undefined;
  const progress = phases.length > 0 ? (completedPhases.length / phases.length) * 100 : 0;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Game Vision */}
        {gameVision && (
          <Card className="rounded-xl border-primary/20 bg-primary/[0.02]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                {t("gameVision")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground/90 italic">{gameVision}</p>
            </CardContent>
          </Card>
        )}

        {/* Game Summary */}
        <Card className="rounded-xl border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-primary" />
              {t("gameSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasPitch ? (
              <div className="space-y-2">
                {Object.entries(summaryFields).map(([key, { label }]) => {
                  const value = formatFieldValue(pitchData[key]);
                  if (!value) return null;
                  return (
                    <div key={key} className="flex gap-2 text-sm">
                      <span className="font-medium text-muted-foreground shrink-0 w-32">{label}:</span>
                      <span className="text-foreground">{value}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noDataYet")}</p>
            )}
          </CardContent>
        </Card>

        {/* Phase Progress */}
        <Card className="rounded-xl border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              {t("phaseProgress")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{completedPhases.length}/{phases.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Phase list */}
            <div className="space-y-1.5">
              {phases.map(({ phase, title }) => {
                const isCompleted = completedPhases.includes(phase);
                const isActive = currentPhase === phase;
                const isLocked = !isCompleted && !isActive && phase > currentPhase;

                return (
                  <div
                    key={phase}
                    className={cn(
                      "flex items-center gap-2 text-sm py-1",
                      isLocked && "opacity-40"
                    )}
                  >
                    {isCompleted && <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />}
                    {isActive && <Loader2 className="h-3.5 w-3.5 text-primary animate-spin shrink-0" />}
                    {isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                    <span className={cn(
                      isActive && "text-primary font-medium",
                      isCompleted && "text-foreground"
                    )}>
                      {title}
                    </span>
                    {isActive && <Badge variant="outline" className="text-[10px] ml-auto">{t("inProgress")}</Badge>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Phase Detail Cards */}
        {phases.map(({ phase, key, title }) => {
          const isCompleted = completedPhases.includes(phase);
          const isActive = currentPhase === phase;
          const isLocked = !isCompleted && !isActive && phase > currentPhase;
          const phaseData = gddData[key] as Record<string, unknown> | undefined;
          const hasData = phaseData && Object.keys(phaseData).length > 0;

          if (isLocked) return null; // Don't show locked phases

          return (
            <Card
              key={phase}
              className={cn(
                "rounded-xl border-border/60",
                isCompleted && "border-green-500/20",
                isActive && "border-primary/30"
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {isCompleted && <Check className="h-4 w-4 text-green-500" />}
                    {isActive && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                    {title}
                  </CardTitle>
                  {(isCompleted || isActive) && hasData && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => onRequestSuggestions(title)}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {t("getSuggestions")}
                    </Button>
                  )}
                </div>
              </CardHeader>
              {hasData && (
                <CardContent className="pt-0">
                  <div className="space-y-1 text-xs">
                    {Object.entries(phaseData).slice(0, 4).map(([field, value]) => {
                      const formatted = formatFieldValue(value);
                      if (!formatted) return null;
                      const label = field.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                      return (
                        <div key={field} className="flex gap-2">
                          <span className="font-medium text-muted-foreground shrink-0">{label}:</span>
                          <span className="text-foreground line-clamp-1">{formatted}</span>
                        </div>
                      );
                    })}
                    {Object.keys(phaseData).length > 4 && (
                      <span className="text-muted-foreground">+{Object.keys(phaseData).length - 4} more</span>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
