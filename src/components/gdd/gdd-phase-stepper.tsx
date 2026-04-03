"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PhaseInfo {
  phase: number;
  key: string;
  title: string;
}

interface GDDPhaseStepperProps {
  currentPhase: number;
  completedPhases: number[];
  phases: PhaseInfo[];
}

export function GDDPhaseStepper({ currentPhase, completedPhases, phases }: GDDPhaseStepperProps) {
  const totalPhases = phases.length;
  const progress = (completedPhases.length / totalPhases) * 100;

  const currentTitle = phases.find(p => p.phase === currentPhase)?.title || `Phase ${currentPhase}`;

  return (
    <div className="space-y-2">
      {/* Phase indicators */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {phases.map((p, idx) => {
          const isCompleted = completedPhases.includes(p.phase);
          const isActive = currentPhase === p.phase;

          return (
            <div key={p.phase} className="flex items-center flex-1 min-w-0">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all",
                  isCompleted && "bg-green-500 text-white",
                  isActive && !isCompleted && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                  !isCompleted && !isActive && "bg-muted text-muted-foreground"
                )}
                title={p.title}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : p.phase}
              </div>
              {idx < phases.length - 1 && (
                <div className={cn(
                  "h-0.5 flex-1 mx-1 rounded-full min-w-[8px]",
                  isCompleted ? "bg-green-500" : "bg-muted"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current phase label + percentage */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {currentTitle} ({currentPhase}/{totalPhases})
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
