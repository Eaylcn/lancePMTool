"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

interface CategoryField {
  key: string;
  labelKey: string;
}

interface CategoryTabProps {
  categoryKey: string;
  fields: CategoryField[];
  ratingKey: string;
  notesKey: string;
  analysis: Record<string, unknown> | null;
  aiComment?: string | null;
}

export function CategoryTab({ fields, notesKey, analysis, aiComment }: CategoryTabProps) {
  const t = useTranslations("analyze");
  const tGame = useTranslations("game");

  if (!analysis) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">{tGame("noAnalysis")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Comment */}
      {aiComment && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">AI Analiz</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{aiComment}</p>
        </div>
      )}

      {/* Fields — same card grid as overview */}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ key, labelKey }) => {
          const value = String(analysis[key] ?? "");
          if (!value) return null;
          return (
            <div key={key} className="rounded-lg border border-border p-4 space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t(`fields.${labelKey}`)}
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      {notesKey && !!analysis[notesKey] && (
        <div className="rounded-lg bg-muted/30 border border-border p-4 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("notes")}</p>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {String(analysis[notesKey])}
          </p>
        </div>
      )}
    </div>
  );
}
