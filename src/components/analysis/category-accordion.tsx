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

  return (
    <AccordionItem value={categoryKey}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span>{t(`categories.${categoryKey}`)}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label htmlFor={field.key}>{t(`fields.${field.labelKey}`)}</Label>
                {aiFilledFields.includes(field.key) && <AiFilledBadge />}
              </div>
              <Textarea
                id={field.key}
                value={(values[field.key] as string) || ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                rows={3}
                className={aiFilledFields.includes(field.key) ? "border-primary/20 bg-primary/5" : ""}
              />
            </div>
          ))}

          {/* Rating */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Label>{t("rating")}</Label>
              {aiFilledFields.includes(ratingKey) && <AiFilledBadge />}
            </div>
            <RatingInput
              value={Number(values[ratingKey]) || 0}
              onChange={(v) => onChange(ratingKey, v)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Label>{t("notes")}</Label>
              {aiFilledFields.includes(notesKey) && <AiFilledBadge />}
            </div>
            <Textarea
              value={(values[notesKey] as string) || ""}
              onChange={(e) => onChange(notesKey, e.target.value)}
              rows={3}
              placeholder={t("notesPlaceholder")}
              className={aiFilledFields.includes(notesKey) ? "border-primary/20 bg-primary/5" : ""}
            />
          </div>

          {/* Extra comment areas */}
          {extraNotes?.map((extra) => (
            <div key={extra.key} className="space-y-1.5">
              <Label>{t(`fields.${extra.labelKey}`)}</Label>
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
