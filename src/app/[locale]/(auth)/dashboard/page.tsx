"use client";

import { useTranslations } from "next-intl";
import { Gamepad2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/use-dashboard";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { DashboardFeatureStats } from "@/components/dashboard/dashboard-feature-stats";
import { DashboardRecentGames } from "@/components/dashboard/dashboard-recent-games";
import { DashboardGddStats } from "@/components/dashboard/dashboard-gdd-stats";
import { DashboardRecentActivity } from "@/components/dashboard/dashboard-recent-activity";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: dashboard, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  const displayName = dashboard?.profile?.displayName || "PM";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "goodMorning" : hour < 18 ? "goodAfternoon" : "goodEvening";

  return (
    <div className="space-y-5">
      {/* Gradient Hero — Compact */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50 p-4 sm:p-5">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t(greeting)}, <span className="text-primary">{displayName}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("subtitle")}
            </p>
          </div>
          {dashboard?.stats?.pmLevel && (
            <span className="rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1 shrink-0">
              {t(`levels.${dashboard.stats.pmLevel}`)}
            </span>
          )}
        </div>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/3 blur-2xl" />
        <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-primary/5 blur-xl" />
      </div>

      {/* Content */}
      {dashboard && (
        <>
          <DashboardStats stats={dashboard.stats} />

          <DashboardQuickActions />

          <DashboardGddStats gddStats={dashboard.gddStats} />

          <DashboardFeatureStats
            interviewStats={dashboard.interviewStats}
            taskStats={dashboard.taskStats}
          />

          <DashboardRecentActivity activities={dashboard.recentActivity} />

          <DashboardRecentGames games={dashboard.recentGames} />
        </>
      )}

      {/* Empty State */}
      {dashboard && dashboard.stats.totalGames === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Gamepad2 className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t("noGames")}</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {t("noGamesDescription")}
          </p>
        </div>
      )}
    </div>
  );
}
