"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { User, Link2, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileActivity } from "@/components/profile/profile-activity";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { SkillRadar } from "@/components/growth/skill-radar";
import { TemplateGames } from "@/components/profile/template-games";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const locale = useLocale();
  const { data, isLoading } = useProfile();

  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(() => {
    if (!data?.profile.username) return;
    const url = `${window.location.origin}/${locale}/portfolio/${data.profile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data?.profile.username, locale]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="flex gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!data) return null;

  const hasUsername = !!data.profile.username;

  return (
    <div className="space-y-6">
      {/* Gradient Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50 p-6">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
      </div>

      {/* Profile Header / Edit Form */}
      {editing ? (
        <ProfileEditForm
          profile={data.profile}
          onClose={() => setEditing(false)}
        />
      ) : (
        <Card className="p-4">
          <ProfileHeader
            profile={data.profile}
            pmLevel={data.stats.pmLevel}
            onEdit={() => setEditing(true)}
            onShare={handleShare}
          />
        </Card>
      )}

      {/* Portfolio Link Card */}
      {!editing && (
        <Card className="p-4">
          {hasUsername ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("sharePortfolio")}</p>
                <p className="text-xs text-muted-foreground">
                  /{locale}/portfolio/{data.profile.username}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleShare}>
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                    {t("linkCopied")}
                  </>
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5 mr-1.5" />
                    {t("copyLink")}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("setUsername")}</p>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                {t("editProfile")}
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Stats */}
      <ProfileStats stats={data.stats} />

      {/* Skill Radar */}
      {data.skillRadar && data.skillRadar.some((s: { avgGameScore: number }) => s.avgGameScore > 0) && (
        <SkillRadar data={data.skillRadar} />
      )}

      {/* Template Games */}
      {data.templateGames && data.templateGames.length > 0 && (
        <TemplateGames games={data.templateGames} namespace="profile" />
      )}

      {/* Recent Activity */}
      <ProfileActivity activities={data.recentActivity} />
    </div>
  );
}
