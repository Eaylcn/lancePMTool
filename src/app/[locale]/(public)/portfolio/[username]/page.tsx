"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UserX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { PortfolioLayout } from "@/components/portfolio/portfolio-layout";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { GameShowcase } from "@/components/portfolio/game-showcase";
import { SkillRadar } from "@/components/growth/skill-radar";

export default function PortfolioPage() {
  const t = useTranslations("portfolio");
  const params = useParams();
  const username = params.username as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio", username],
    queryFn: async () => {
      const res = await fetch(`/api/portfolio/${username}`);
      if (res.status === 404) throw new Error("not_found");
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      return res.json();
    },
    enabled: !!username,
  });

  return (
    <PortfolioLayout>
      {isLoading && (
        <div className="space-y-6">
          <div className="flex gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <UserX className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-bold mb-2">{t("notFound")}</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            {t("notFoundDescription")}
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Profile Header (read-only) */}
          <Card className="p-4">
            <ProfileHeader
              profile={data.profile}
              pmLevel={data.stats.pmLevel}
              onEdit={() => {}}
              onShare={() => {}}
              readOnly
            />
          </Card>

          {/* Stats */}
          <ProfileStats
            stats={{
              ...data.stats,
              totalTasks: 0,
            }}
          />

          {/* Skill Radar */}
          {data.skillRadar && data.skillRadar.some((s: { avgGameScore: number }) => s.avgGameScore > 0) && (
            <SkillRadar data={data.skillRadar} />
          )}

          {/* Game Showcase */}
          <GameShowcase games={data.games} />
        </div>
      )}
    </PortfolioLayout>
  );
}
