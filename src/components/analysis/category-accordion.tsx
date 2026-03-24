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
}: CategoryAccordionProps) {
  const t = useTranslations("analyze");

  // Calculate fill percentage
  const totalFields = fields.length + 1 + 1; // fields + rating + notes
  const filledFields = fields.filter((f) => values[f.key]).length
    + (values[ratingKey] ? 1 : 0)
    + (values[notesKey] ? 1 : 0);
  const fillPercent = Math.round((filledFields / totalFields) * 100);

  const ratingValue = Number(values[ratingKey]) || 0;
  const ratingColor = ratingValue >= 7 ? "text-emerald-500" : ratingValue >= 4 ? "text-yellow-500" : "text-red-500";

  return (
    <AccordionItem value={categoryKey} className="rounded-xl border border-border/50 px-4 data-open:border-primary/20 transition-colors">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary shrink-0">
            <Icon className="h-4 w-4" />
          </div>
          <span className="font-medium">{t(`categories.${categoryKey}`)}</span>
          <div className="flex items-center gap-2 ml-auto mr-2">
            {ratingValue > 0 && (
              <span className={`text-xs font-bold ${ratingColor}`}>{ratingValue.toFixed(1)}</span>
            )}
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              fillPercent === 100
                ? "bg-emerald-500/10 text-emerald-500"
                : fillPercent > 0
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-muted text-muted-foreground"
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
              <div key={field.key} className={`space-y-1.5 ${isAiFilled ? "border-l-2 border-primary pl-3" : ""}`}>
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
          <div className={`space-y-1.5 ${aiFilledFields.includes(ratingKey) ? "border-l-2 border-primary pl-3" : ""}`}>
            <div className="flex items-center gap-2">
              <Label className="text-sm">{t("rating")}</Label>
              {aiFilledFields.includes(ratingKey) && <AiFilledBadge />}
            </div>
            <RatingInput
              value={Number(values[ratingKey]) || 0}
              onChange={(v) => onChange(ratingKey, v)}
            />
          </div>

          {/* Notes */}
          <div className={`space-y-1.5 ${aiFilledFields.includes(notesKey) ? "border-l-2 border-primary pl-3" : ""}`}>
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
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
