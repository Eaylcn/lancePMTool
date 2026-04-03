"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Smile, Bug, Layout, UserMinus, ListOrdered, CreditCard, TrendingUp, Clock, Plus,
} from "lucide-react";
import { SURVEY_TEMPLATES } from "@/lib/constants/survey-templates";
import type { SurveyTemplate } from "@/lib/types/survey";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Smile,
  Bug,
  Layout,
  UserMinus,
  ListOrdered,
  CreditCard,
  TrendingUp,
};

const COLOR_MAP: Record<string, string> = {
  emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
  orange: "from-orange-500/20 to-orange-500/5 border-orange-500/20",
  violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20",
  red: "from-red-500/20 to-red-500/5 border-red-500/20",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
  amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
};

const ICON_COLOR_MAP: Record<string, string> = {
  emerald: "text-emerald-500",
  orange: "text-orange-500",
  violet: "text-violet-500",
  red: "text-red-500",
  blue: "text-blue-500",
  amber: "text-amber-500",
  cyan: "text-cyan-500",
};

interface SurveyTemplatesProps {
  onSelectTemplate: (template: SurveyTemplate) => void;
  onCreateManual: () => void;
}

export function SurveyTemplates({ onSelectTemplate, onCreateManual }: SurveyTemplatesProps) {
  const t = useTranslations("surveys");
  const locale = useLocale() as "tr" | "en";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("templates.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("templates.subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onCreateManual} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          {t("templates.createManual")}
        </Button>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SURVEY_TEMPLATES.map((template) => {
          const Icon = ICON_MAP[template.icon] || Smile;
          const colorClass = COLOR_MAP[template.color] || COLOR_MAP.emerald;
          const iconColor = ICON_COLOR_MAP[template.color] || ICON_COLOR_MAP.emerald;

          return (
            <div
              key={template.type}
              className={`rounded-xl border bg-gradient-to-br ${colorClass} p-5 space-y-3 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2.5 bg-background/80 ${iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  ~{template.estimatedMinutes} min
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm">{template.title[locale]}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {template.description[locale]}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  {template.questions.length} {t("templates.questions")}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onSelectTemplate(template)}
                  className="h-7 text-xs"
                >
                  {t("templates.useTemplate")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
