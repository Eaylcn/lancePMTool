"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

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
  const ratingColor = rating >= 7 ? "text-emerald-500" : rating >= 4 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="space-y-4">
      {/* Rating header */}
      {ratingKey && (
        <div className="flex items-center gap-3 pb-2">
          <Star className={`h-6 w-6 fill-current ${ratingColor}`} />
          <span className={`text-3xl font-bold ${ratingColor}`}>{rating.toFixed(1)}</span>
          <span className="text-muted-foreground">/ 10</span>
        </div>
      )}

      {/* Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ key, labelKey }) => {
          const value = String(analysis[key] ?? "");
          if (!value) return null;
          return (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`fields.${labelKey}`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notes */}
      {notesKey && !!analysis[notesKey] && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("notes")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{String(analysis[notesKey])}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
