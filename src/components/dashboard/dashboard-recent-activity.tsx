"use client";

import { useTranslations } from "next-intl";
import { Activity, Gamepad2, BarChart3, FileEdit, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RecentActivityItem {
  type: string;
  title: string;
  createdAt: string;
}

interface DashboardRecentActivityProps {
  activities: RecentActivityItem[];
}

const ACTIVITY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  game_added: { icon: Gamepad2, color: "text-blue-500", bg: "bg-blue-500/10" },
  analysis_completed: { icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
  gdd_created: { icon: FileEdit, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  gdd_updated: { icon: FileEdit, color: "text-sky-500", bg: "bg-sky-500/10" },
  interview_completed: { icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
};

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

export function DashboardRecentActivity({ activities }: DashboardRecentActivityProps) {
  const t = useTranslations("dashboard");

  if (activities.length === 0) {
    return (
      <Card className="p-6 text-center border-dashed rounded-xl border-border/60">
        <Activity className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
        <h3 className="font-semibold mb-1">{t("noActivity")}</h3>
        <p className="text-sm text-muted-foreground">{t("noActivityDescription")}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3 rounded-xl border-border/60">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        {t("recentActivityTitle")}
      </h3>
      <div className="space-y-2">
        {activities.map((activity, i) => {
          const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.game_added;
          const Icon = config.icon;
          return (
            <div
              key={`${activity.type}-${i}`}
              className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${config.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {t(`activityTypes.${activity.type}`)}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatRelativeTime(activity.createdAt)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
