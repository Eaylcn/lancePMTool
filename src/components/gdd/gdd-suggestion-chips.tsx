"use client";

import { useTranslations } from "next-intl";
import { HelpCircle } from "lucide-react";
import type { GDDSuggestion } from "@/hooks/use-gdd";

interface GDDSuggestionChipsProps {
  suggestions: GDDSuggestion[];
  onSelect: (value: string) => void;
  onWriteOwn: () => void;
  onHelpMe: () => void;
  disabled?: boolean;
}

export function GDDSuggestionChips({ suggestions, onSelect, onWriteOwn, onHelpMe, disabled }: GDDSuggestionChipsProps) {
  const t = useTranslations("gdd");

  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.value)}
          disabled={disabled}
          className="px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm hover:bg-primary/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
          {s.label}
        </button>
      ))}
      <button
        onClick={onWriteOwn}
        disabled={disabled}
        className="px-3 py-1.5 rounded-full border border-muted text-sm text-muted-foreground hover:border-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("writeOwn")}
      </button>
      <button
        onClick={onHelpMe}
        disabled={disabled}
        className="px-3 py-1.5 rounded-full border border-muted text-sm text-muted-foreground hover:border-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        {t("helpMeDecide")}
      </button>
    </div>
  );
}
