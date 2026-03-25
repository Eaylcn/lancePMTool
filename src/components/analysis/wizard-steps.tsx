"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardStepsProps {
  currentStep: number;
  steps: string[];
  onStepClick?: (step: number) => void;
}

export function WizardSteps({ currentStep, steps, onStepClick }: WizardStepsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-border">
      {steps.map((label, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const isClickable = isCompleted && onStepClick;

        return (
          <button
            key={step}
            type="button"
            onClick={() => isClickable && onStepClick(step)}
            disabled={!isClickable}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-150",
              isActive && "border-primary text-foreground",
              isCompleted && "border-transparent text-muted-foreground hover:text-foreground",
              !isActive && !isCompleted && "border-transparent text-muted-foreground/60",
              isClickable && "cursor-pointer"
            )}
          >
            {isCompleted ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <span className="text-xs tabular-nums">{step}.</span>
            )}
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
