"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GDDSuggestion } from "@/hooks/use-gdd";

interface GDDMultipleChoiceProps {
  options: GDDSuggestion[];
  onSelect: (value: string) => void;
  onWriteOwn: () => void;
  onHelpMe: () => void;
  disabled?: boolean;
}

export function GDDMultipleChoice({ options, onSelect, onWriteOwn, onHelpMe, disabled }: GDDMultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const t = useTranslations("gdd");

  if (!options.length) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs text-muted-foreground">{t("selectOne")}</p>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.value)}
            disabled={disabled}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm text-left transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              selected === opt.value
                ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                : "border-border/60 hover:border-primary/40 hover:bg-muted/50"
            }`}
          >
            <div className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected === opt.value ? "border-primary" : "border-muted-foreground/40"
            }`}>
              {selected === opt.value && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          onClick={() => selected && onSelect(selected)}
          disabled={!selected || disabled}
        >
          {t("confirm")}
        </Button>
        <button
          onClick={onWriteOwn}
          disabled={disabled}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
        >
          {t("writeOwn")}
        </button>
        <button
          onClick={onHelpMe}
          disabled={disabled}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
        >
          <HelpCircle className="h-3 w-3" />
          {t("helpMeDecide")}
        </button>
      </div>
    </div>
  );
}
