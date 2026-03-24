"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiFilledBadge } from "./ai-filled-badge";

interface KpiFormProps {
  values: Record<string, string | number>;
  onChange: (key: string, value: string | number) => void;
  aiFilledFields: string[];
}

export function KpiForm({ values, onChange, aiFilledFields }: KpiFormProps) {
  const t = useTranslations("analyze");

  const fields = [
    { key: "period", label: t("kpi.period"), type: "text", placeholder: "2024-Q1" },
    { key: "downloads", label: t("kpi.downloads"), type: "number" },
    { key: "revenue", label: t("kpi.revenue"), type: "number" },
    { key: "dau", label: t("kpi.dau"), type: "number" },
    { key: "mau", label: t("kpi.mau"), type: "number" },
    { key: "rating", label: t("kpi.storeRating"), type: "number" },
    { key: "chartPosition", label: t("kpi.chartPosition"), type: "number" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{t("kpi.title")}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Label htmlFor={`kpi-${field.key}`}>{field.label}</Label>
              {aiFilledFields.includes(`kpi.${field.key}`) && <AiFilledBadge />}
            </div>
            <Input
              id={`kpi-${field.key}`}
              type={field.type === "number" ? "number" : "text"}
              value={values[field.key] ?? ""}
              onChange={(e) => onChange(field.key, field.type === "number" ? Number(e.target.value) || "" : e.target.value)}
              placeholder={field.placeholder}
              className={aiFilledFields.includes(`kpi.${field.key}`) ? "border-primary/20 bg-primary/5" : ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
