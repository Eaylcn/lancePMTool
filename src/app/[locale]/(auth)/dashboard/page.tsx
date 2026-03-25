"use client";

import { useTranslations } from "next-intl";
import { LayoutDashboard, Gamepad2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/use-dashboard";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { DashboardFeatureStats } from "@/components/dashboard/dashboard-feature-stats";
import { DashboardRecentGames } from "@/components/dashboard/dashboard-recent-games";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: dashboard, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gradient Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50 p-6">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-primary/10 blur-xl" />
      </div>

      {/* Stats */}
      {dashboard && (
        <>
          <DashboardStats stats={dashboard.stats} />

          <DashboardQuickActions />

          <DashboardFeatureStats
            interviewStats={dashboard.interviewStats}
            taskStats={dashboard.taskStats}
          />

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
