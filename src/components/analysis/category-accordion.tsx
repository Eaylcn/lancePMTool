"use client";

import { useTranslations } from "next-intl";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RatingInput } from "@/components/shared/rating-input";
import { AiFilledBadge } from "./ai-filled-badge";

interface FieldConfig {
  key: string;
  labelKey: string;
  type?: "text" | "textarea";
}

interface CategoryAccordionProps {
  categoryKey: string;
  icon: React.ElementType;
  fields: FieldConfig[];
  values: Record<string, string | number>;
  onChange: (key: string, value: string | number) => void;
  ratingKey: string;
  notesKey: string;
  aiFilledFields: string[];
  extraNotes?: { key: string; labelKey: string }[];
  personalObservation?: string | null;
}

export function CategoryAccordion({
  categoryKey,
  icon: Icon,
  fields,
  values,
  onChange,
  ratingKey,
  notesKey,
  aiFilledFields,
  extraNotes,
  personalObservation,
}: CategoryAccordionProps) {
  const t = useTranslations("analyze");

  // Calculate fill percentage
  const totalFields = fields.length + 1 + 1;
  const filledFields = fields.filter((f) => values[f.key]).length
    + (values[ratingKey] ? 1 : 0)
    + (values[notesKey] ? 1 : 0);
  const fillPercent = Math.round((filledFields / totalFields) * 100);

  const ratingValue = Number(values[ratingKey]) || 0;
  const ratingColor = ratingValue >= 7 ? "text-emerald-500" : ratingValue >= 4 ? "text-yellow-500" : "text-red-500";

  return (
    <AccordionItem value={categoryKey} className="rounded-lg border border-border px-4 transition-colors">
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex items-center gap-2.5 flex-1">
          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium">{t(`categories.${categoryKey}`)}</span>
          <div className="flex items-center gap-2 ml-auto mr-2">
            {ratingValue > 0 && (
              <span className={`text-xs font-semibold tabular-nums ${ratingColor}`}>{ratingValue.toFixed(1)}</span>
            )}
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
              fillPercent === 100
                ? "text-emerald-500 bg-emerald-500/10"
                : fillPercent > 0
                  ? "text-yellow-500 bg-yellow-500/10"
                  : "text-muted-foreground bg-muted"
            }`}>
              {fillPercent}%
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pb-2">
          {fields.map((field) => {
            const isAiFilled = aiFilledFields.includes(field.key);
            return (
              <div key={field.key} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor={field.key} className="text-sm">{t(`fields.${field.labelKey}`)}</Label>
                  {isAiFilled && <AiFilledBadge />}
                </div>
                <Textarea
                  id={field.key}
                  value={(values[field.key] as string) || ""}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  rows={3}
                  className={isAiFilled ? "border-primary/20 bg-primary/5 focus:bg-background" : ""}
                />
              </div>
            );
          })}

          {/* Rating */}
          {ratingKey && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label className="text-sm">{t("rating")}</Label>
                {aiFilledFields.includes(ratingKey) && <AiFilledBadge />}
              </div>
              <RatingInput
                value={Number(values[ratingKey]) || 0}
                onChange={(v) => onChange(ratingKey, v)}
              />
            </div>
          )}

          {/* Notes */}
          {notesKey && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label className="text-sm">{t("notes")}</Label>
                {aiFilledFields.includes(notesKey) && <AiFilledBadge />}
              </div>
              <Textarea
                value={(values[notesKey] as string) || ""}
                onChange={(e) => onChange(notesKey, e.target.value)}
                rows={3}
                placeholder={t("notesPlaceholder")}
                className={aiFilledFields.includes(notesKey) ? "border-primary/20 bg-primary/5 focus:bg-background" : ""}
              />
            </div>
          )}

          {/* Extra comment areas */}
          {extraNotes?.map((extra) => (
            <div key={extra.key} className="space-y-1.5">
              <Label className="text-sm">{t(`fields.${extra.labelKey}`)}</Label>
              <Textarea
                value={(values[extra.key] as string) || ""}
                onChange={(e) => onChange(extra.key, e.target.value)}
                rows={3}
                placeholder={t("commentPlaceholder")}
              />
            </div>
          ))}

          {/* Personal Observations */}
          {personalObservation && (
            <div className="rounded-lg bg-accent/10 border border-accent/20 p-3 space-y-1.5">
              <Label className="text-sm font-medium text-accent-foreground/80">
                {t("personalObservations")}
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {personalObservation}
              </p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
