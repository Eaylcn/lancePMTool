"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}

export function CategoryTab({ categoryKey, fields, ratingKey, notesKey, analysis }: CategoryTabProps) {
  const t = useTranslations("analyze");
  const tGame = useTranslations("game");

  if (!analysis) {
    return <p className="text-muted-foreground">{tGame("noAnalysis")}</p>;
  }

  const rating = Number(analysis[ratingKey]) || 0;
  const ratingColor = rating >= 7 ? "text-emerald-500 border-emerald-500" : rating >= 4 ? "text-yellow-500 border-yellow-500" : "text-red-500 border-red-500";
  const ratingBg = rating >= 7 ? "bg-emerald-500/10" : rating >= 4 ? "bg-yellow-500/10" : "bg-red-500/10";

  return (
    <div className="space-y-6">
      {/* Rating header */}
      {ratingKey && (
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center h-16 w-16 rounded-full border-[3px] ${ratingColor} ${ratingBg}`}>
            <span className={`text-2xl font-bold ${ratingColor.split(" ")[0]}`}>{rating.toFixed(1)}</span>
          </div>
          <div>
            <p className="text-sm font-medium">{t(`categories.${categoryKey}`)}</p>
            <p className="text-xs text-muted-foreground">/ 10</p>
          </div>
        </div>
      )}

      {/* Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ key, labelKey }) => {
          const value = String(analysis[key] ?? "");
          if (!value) return null;
          return (
            <Card key={key} className="border-border/50 hover:border-border transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`fields.${labelKey}`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notes */}
      {notesKey && !!analysis[notesKey] && (
        <div className="border-l-4 border-primary/30 pl-4 py-2">
          <p className="text-xs font-medium text-muted-foreground mb-1">{t("notes")}</p>
          <p className="text-sm whitespace-pre-wrap italic text-muted-foreground leading-relaxed">
            {String(analysis[notesKey])}
          </p>
        </div>
      )}
    </div>
  );
}
