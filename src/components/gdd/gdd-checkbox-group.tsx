"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GDDSuggestion } from "@/hooks/use-gdd";

interface GDDCheckboxGroupProps {
  options: GDDSuggestion[];
  onSelect: (value: string) => void;
  onWriteOwn: () => void;
  onHelpMe: () => void;
  disabled?: boolean;
}

export function GDDCheckboxGroup({ options, onSelect, onWriteOwn, onHelpMe, disabled }: GDDCheckboxGroupProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const t = useTranslations("gdd");

  if (!options.length) return null;

  const toggleOption = (value: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (selected.size === 0) return;
    // Find labels for selected values and join them
    const selectedLabels = options
      .filter(opt => selected.has(opt.value))
      .map(opt => opt.value);
    onSelect(selectedLabels.join(", "));
  };

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs text-muted-foreground">{t("selectMultiple")}</p>
      <div className="space-y-1.5">
        {options.map((opt) => {
          const isChecked = selected.has(opt.value);
          return (
            <button
              key={opt.id}
              onClick={() => toggleOption(opt.value)}
              disabled={disabled}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm text-left transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isChecked
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "border-border/60 hover:border-primary/40 hover:bg-muted/50"
              }`}
            >
              <div className={`h-4 w-4 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
                isChecked ? "border-primary bg-primary" : "border-muted-foreground/40"
              }`}>
                {isChecked && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          onClick={handleConfirm}
          disabled={selected.size === 0 || disabled}
        >
          {t("confirm")} {selected.size > 0 && `(${selected.size})`}
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
