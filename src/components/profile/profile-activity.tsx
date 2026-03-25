"use client";

import { useTranslations } from "next-intl";
import { Gamepad2, BarChart3, MessageSquare, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Activity {
  type: string;
  title: string;
  date: string;
}

interface ProfileActivityProps {
  activities: Activity[];
}

const ACTIVITY_CONFIG: Record<string, { icon: typeof Gamepad2; color: string; bg: string; key: string }> = {
  game_added: { icon: Gamepad2, color: "text-blue-500", bg: "bg-blue-500/10", key: "gameAdded" },
  analysis_completed: { icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10", key: "analysisCompleted" },
  interview_completed: { icon: MessageSquare, color: "text-indigo-500", bg: "bg-indigo-500/10", key: "interviewCompleted" },
};

export function ProfileActivity({ activities }: ProfileActivityProps) {
  const t = useTranslations("profile.activity");

  if (activities.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Clock className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
        <p className="text-sm text-muted-foreground">{t("noActivity")}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        {t("title")}
      </h3>

      <div className="space-y-1">
        {activities.map((activity, i) => {
          const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.game_added;
          const Icon = config.icon;
          const relativeDate = formatRelativeDate(activity.date);

          return (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`p-1.5 rounded-md ${config.bg} shrink-0`}>
                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">
                  <span className="font-medium">{activity.title}</span>
                  <span className="text-muted-foreground"> — {t(config.key)}</span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{relativeDate}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Bugün";
  if (diffDays === 1) return "Dün";
  if (diffDays < 7) return `${diffDays} gün önce`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
  return date.toLocaleDateString();
}
