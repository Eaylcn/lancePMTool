"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardStepsProps {
  currentStep: number;
  steps: string[];
}

export function WizardSteps({ currentStep, steps }: WizardStepsProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((label, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                  isCompleted && "bg-primary text-primary-foreground shadow-md",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg animate-pulse",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground border-2 border-border"
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : step}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="relative mx-3 sm:mx-6 flex-shrink-0">
                <div className="h-[2px] w-12 sm:w-20 bg-muted rounded-full" />
                <div
                  className={cn(
                    "absolute top-0 left-0 h-[2px] rounded-full bg-primary transition-all duration-500",
                    step < currentStep ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
