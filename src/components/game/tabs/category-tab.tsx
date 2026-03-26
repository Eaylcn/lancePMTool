"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { CategoryVisual } from "./category-visuals";

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

export function CategoryTab({ categoryKey, fields, ratingKey, notesKey, analysis, aiComment }: CategoryTabProps) {
  const t = useTranslations("analyze");
  const tGame = useTranslations("game");

  if (!analysis) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">{tGame("noAnalysis")}</p>
      </div>
    );
  }

  const rating = Number(analysis[ratingKey]) || 0;
  const ratingColor = rating >= 7 ? "text-emerald-500" : rating >= 4 ? "text-yellow-500" : "text-red-500";
  const ratingBg = rating >= 7 ? "from-emerald-500/10 to-emerald-500/5" : rating >= 4 ? "from-yellow-500/10 to-yellow-500/5" : "from-red-500/10 to-red-500/5";

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      {rating > 0 && (
        <div className={`rounded-xl bg-gradient-to-r ${ratingBg} border border-border p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">{t(`categories.${categoryKey}`)}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-32 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${rating >= 7 ? "bg-emerald-500" : rating >= 4 ? "bg-yellow-500" : "bg-red-500"} transition-all`}
                    style={{ width: `${rating * 10}%` }}
                  />
                </div>
                <span className={`text-lg font-bold tabular-nums ${ratingColor}`}>{rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">/10</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category-specific Visual */}
      <CategoryVisual categoryKey={categoryKey} analysis={analysis} />

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

      {/* Fields — card grid */}
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
