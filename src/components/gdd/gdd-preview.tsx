"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GDDSectionCard } from "./gdd-section-card";
import type { CustomPhase } from "@/hooks/use-gdd";

interface PhaseInfo {
  phase: number;
  key: string;
  title: string;
}

interface GDDPreviewProps {
  currentPhase: number;
  completedPhases: number[];
  gddData: Record<string, Record<string, unknown>>;
  phases: PhaseInfo[];
  customPhases?: CustomPhase[] | null;
}

export function GDDPreview({ currentPhase, completedPhases, gddData, phases, customPhases }: GDDPreviewProps) {
  const t = useTranslations("gdd");
  const [expandedPhase, setExpandedPhase] = useState<number>(currentPhase);

  // Auto-expand current phase when it changes
  useEffect(() => {
    setExpandedPhase(currentPhase);
  }, [currentPhase]);

  const handleToggle = (phase: number) => {
    setExpandedPhase(prev => prev === phase ? -1 : phase);
  };

  // Get custom fields for a phase (if dynamic)
  const getCustomFields = (phaseNum: number): string[] | undefined => {
    if (!customPhases || phaseNum === 1) return undefined;
    const cp = customPhases.find(p => p.phase === phaseNum);
    return cp?.required_fields;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">{t("preview")}</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {phases.map(({ phase, key, title }) => (
            <GDDSectionCard
              key={phase}
              title={title}
              phase={phase}
              currentPhase={currentPhase}
              completedPhases={completedPhases}
              data={gddData[key]}
              isExpanded={expandedPhase === phase}
              onToggle={() => handleToggle(phase)}
              customFields={getCustomFields(phase)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
