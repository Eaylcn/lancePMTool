"use client";

import { useTranslations } from "next-intl";
import { BarChart3, Users, ClipboardCheck, TrendingUp } from "lucide-react";
import type { SurveyListItem } from "@/hooks/use-surveys";

interface SurveyDashboardProps {
  surveys: SurveyListItem[];
}

export function SurveyDashboard({ surveys }: SurveyDashboardProps) {
  const t = useTranslations("surveys");

  const totalSurveys = surveys.length;
  const totalResponses = surveys.reduce((acc, s) => acc + s.responseCount, 0);
  const activeSurveys = surveys.filter((s) => s.status === "active").length;
  const avgCompletion =
    totalSurveys > 0
      ? Math.round(
          surveys
            .filter((s) => s.responseCount > 0)
            .reduce((acc, s) => acc + s.responseCount, 0) / Math.max(surveys.filter((s) => s.responseCount > 0).length, 1)
        )
      : 0;

  const stats = [
    {
      label: t("dashboard.totalSurveys"),
      value: totalSurveys,
      icon: ClipboardCheck,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: t("dashboard.totalResponses"),
      value: totalResponses,
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: t("dashboard.activeSurveys"),
      value: activeSurveys,
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: t("dashboard.avgResponses"),
      value: avgCompletion,
      icon: BarChart3,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  // Recent surveys
  const recentSurveys = [...surveys]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold mb-4">{t("dashboard.recentActivity")}</h3>
        {recentSurveys.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("dashboard.noSurveys")}</p>
        ) : (
          <div className="space-y-3">
            {recentSurveys.map((survey) => (
              <div
                key={survey.id}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{survey.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {survey.gameTitle || t("dashboard.noGame")} · {survey.responseCount} {t("dashboard.responses")}
                  </p>
                </div>
                <StatusBadge status={survey.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    active: "bg-emerald-500/10 text-emerald-500",
    expired: "bg-amber-500/10 text-amber-500",
    closed: "bg-red-500/10 text-red-500",
  };

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || colors.draft}`}>
      {status}
    </span>
  );
}
