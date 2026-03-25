"use client";

import { Sparkles, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AiLoadingModalProps {
  open: boolean;
  title: string;
  steps: string[];
  currentStep: number;
  elapsedSeconds: number;
}

export function AiLoadingModal({ open, title, steps, currentStep, elapsedSeconds }: AiLoadingModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}} disablePointerDismissal>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {steps.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            const isPending = i > currentStep;

            return (
              <div key={i} className="flex items-center gap-3">
                {isDone && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </div>
                )}
                {isActive && (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                )}
                {isPending && (
                  <div className="h-5 w-5 rounded-full border border-border" />
                )}
                <span className={`text-sm ${isDone ? "text-muted-foreground line-through" : isActive ? "text-foreground font-medium" : "text-muted-foreground/50"}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {elapsedSeconds > 0 ? `${elapsedSeconds} saniye...` : "Başlatılıyor..."}
          </span>
          <span className="text-xs text-muted-foreground">
            Bu işlem 2-3 dakika sürebilir
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
