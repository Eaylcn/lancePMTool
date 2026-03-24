"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardStepsProps {
  currentStep: number;
  steps: string[];
}

export function WizardSteps({ currentStep, steps }: WizardStepsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isCompleted && "bg-primary text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:inline",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "h-[2px] w-8 sm:w-16",
                step < currentStep ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
