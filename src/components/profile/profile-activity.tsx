"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Gamepad2,
  BarChart3,
  MessageSquare,
  Clock,
  CalendarClock,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface Activity {
  type: string;
  title: string;
  date: string;
}

interface ProfileActivityProps {
  activities: Activity[];
}

const ACTIVITY_CONFIG: Record<
  string,
  { icon: typeof Gamepad2; color: string; bg: string; ring: string; key: string }
> = {
  game_added: {
    icon: Gamepad2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/20",
    key: "gameAdded",
  },
  analysis_completed: {
    icon: BarChart3,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    ring: "ring-purple-500/20",
    key: "analysisCompleted",
  },
  interview_completed: {
    icon: MessageSquare,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    ring: "ring-indigo-500/20",
    key: "interviewCompleted",
  },
};

export function ProfileActivity({ activities }: ProfileActivityProps) {
  const t = useTranslations("profile.activity");
  const locale = useLocale();

  if (activities.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center border-dashed">
        <div className="p-3 rounded-full bg-muted/60 mb-3">
          <CalendarClock className="h-6 w-6 text-muted-foreground/60" />
        </div>
        <p className="text-sm font-medium">{t("noActivity")}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          {t("noActivityDescription")}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          {t("title")}
        </h3>
        <span className="text-[11px] text-muted-foreground">
          {t("recentCount", { count: activities.length })}
        </span>
      </div>

      <div className="relative space-y-0">
        {/* Vertical timeline line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border/60" />

        {activities.map((activity, i) => {
          const config =
            ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.game_added;
          const Icon = config.icon;
          const relativeDate = formatRelativeDate(activity.date, locale, t);

          return (
            <div
              key={i}
              className="relative flex items-start gap-3 py-2 pl-0 group rounded-lg hover:bg-muted/40 transition-colors -mx-2 px-2"
            >
              <div
                className={`relative z-10 p-1.5 rounded-full ${config.bg} ring-1 ${config.ring} shrink-0`}
              >
                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {t(config.key)}
                </p>
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0 pt-0.5">
                {relativeDate}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function formatRelativeDate(
  dateStr: string,
  locale: string,
  t: (key: string, values?: Record<string, string | number>) => string
): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t("today");
  if (diffDays === 1) return t("yesterday");
  if (diffDays < 7) return t("daysAgo", { count: diffDays });
  if (diffDays < 30)
    return t("weeksAgo", { count: Math.floor(diffDays / 7) });
  return date.toLocaleDateString(locale);
}
