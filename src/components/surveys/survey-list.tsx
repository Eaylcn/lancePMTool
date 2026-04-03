"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Copy, ExternalLink, Pencil, Play, Square, Trash2, Check, Plus, Users, Calendar,
} from "lucide-react";
import { useUpdateSurveyStatus, useDeleteSurvey, type SurveyListItem } from "@/hooks/use-surveys";
import { EmptyState } from "@/components/shared/empty-state";

interface SurveyListProps {
  surveys: SurveyListItem[];
  onCreateNew: () => void;
  onEdit: (surveyId: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  expired: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  closed: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function SurveyList({ surveys, onCreateNew, onEdit }: SurveyListProps) {
  const t = useTranslations("surveys");
  const locale = useLocale() as "tr" | "en";
  const updateStatus = useUpdateSurveyStatus();
  const deleteSurvey = useDeleteSurvey();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = async (shareToken: string, surveyId: string) => {
    const url = `${window.location.origin}/${locale}/survey/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(surveyId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleActivate = (id: string) => {
    updateStatus.mutate({ id, status: "active" });
  };

  const handleClose = (id: string) => {
    updateStatus.mutate({ id, status: "closed" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t("list.deleteConfirm"))) {
      deleteSurvey.mutate(id);
    }
  };

  if (surveys.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={Users}
          title={t("list.emptyTitle")}
          description={t("list.emptyDescription")}
        />
        <div className="flex justify-center">
          <Button onClick={onCreateNew} className="gap-1.5">
            <Plus className="h-4 w-4" />
            {t("list.createNew")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("list.title")}</h3>
        <Button size="sm" onClick={onCreateNew} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          {t("list.createNew")}
        </Button>
      </div>

      <div className="space-y-3">
        {surveys.map((survey) => (
          <div
            key={survey.id}
            className="rounded-xl border border-border bg-card p-4 space-y-3"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm truncate">{survey.title}</h4>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[survey.status]}`}
                  >
                    {t(`status.${survey.status}`)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {survey.gameTitle || t("list.noGame")} · {survey.questionCount} {t("templates.questions")}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {survey.responseCount} {t("dashboard.responses")}
              </span>
              {survey.expiresAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(survey.expiresAt).toLocaleDateString(locale)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyLink(survey.shareToken, survey.id)}
                className="h-7 text-xs gap-1"
              >
                {copiedId === survey.id ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copiedId === survey.id ? t("list.copied") : t("list.copyLink")}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/${locale}/survey/${survey.shareToken}`, "_blank")}
                className="h-7 text-xs gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                {t("list.preview")}
              </Button>

              {survey.status === "draft" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(survey.id)}
                    className="h-7 text-xs gap-1"
                  >
                    <Pencil className="h-3 w-3" />
                    {t("list.edit")}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleActivate(survey.id)}
                    className="h-7 text-xs gap-1"
                  >
                    <Play className="h-3 w-3" />
                    {t("list.activate")}
                  </Button>
                </>
              )}

              {survey.status === "active" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClose(survey.id)}
                  className="h-7 text-xs gap-1 text-amber-500 border-amber-500/20"
                >
                  <Square className="h-3 w-3" />
                  {t("list.close")}
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(survey.id)}
                className="h-7 text-xs gap-1 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
