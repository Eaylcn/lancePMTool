"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  User,
  Link2,
  Check,
  Share2,
  Pencil,
  Sparkles,
  Activity,
  Target,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/use-profile";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileActivity } from "@/components/profile/profile-activity";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { SkillRadar } from "@/components/growth/skill-radar";
import { SkillCategoryCards } from "@/components/growth/skill-category-cards";
import { TemplateGames } from "@/components/profile/template-games";
import { PmLevelBadge } from "@/components/growth/pm-level-badge";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const locale = useLocale();
  const { data, isLoading } = useProfile();

  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!data?.profile.username) return;
    const url = `${window.location.origin}/${locale}/portfolio/${data.profile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  const profile = data.profile;
  const hasUsername = !!profile.username;
  const initials = profile.fullName
    ? profile.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "PM";

  const portfolioUrl = hasUsername
    ? `/${locale}/portfolio/${profile.username}`
    : "";

  const hasSkills =
    data.skillRadar &&
    data.skillRadar.some((s: { avgGameScore: number }) => s.avgGameScore > 0);
  const hasTemplates = data.templateGames && data.templateGames.length > 0;

  return (
    <div className="space-y-6">
      {/* Premium Hero */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
        {/* Glow accents */}
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-xl ring-1 ring-primary/20">
                <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-purple-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500 text-white shadow-md ring-2 ring-background">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {profile.fullName || t("anonymousName")}
                </h1>
                <PmLevelBadge level={data.stats.pmLevel} size="sm" />
              </div>

              {profile.title && (
                <p className="text-sm text-muted-foreground font-medium">
                  {profile.title}
                </p>
              )}

              {profile.bio && (
                <p className="text-sm text-foreground/80 max-w-2xl leading-relaxed">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                {profile.username && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    @{profile.username}
                  </span>
                )}
                {profile.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t("memberSince")}:{" "}
                    {new Date(profile.createdAt).toLocaleDateString(locale)}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing((v) => !v)}
                className="gap-1.5 bg-background/60 backdrop-blur"
              >
                <Pencil className="h-3.5 w-3.5" />
                {editing ? t("cancel") : t("editProfile")}
              </Button>
              {hasUsername && (
                <Button
                  size="sm"
                  onClick={handleShare}
                  className="gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      {t("linkCopied")}
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      {t("sharePortfolio")}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit form (collapsible) */}
      {editing && (
        <ProfileEditForm
          profile={profile}
          onClose={() => setEditing(false)}
        />
      )}

      {/* Stats */}
      <ProfileStats stats={data.stats} />

      {/* Portfolio callout */}
      <Card className="relative overflow-hidden p-5">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

        {hasUsername ? (
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{t("portfolioTitle")}</p>
                <p className="text-xs text-muted-foreground mb-1.5">
                  {t("portfolioSubtitle")}
                </p>
                <code className="inline-block text-[11px] bg-muted/60 border border-border/60 rounded px-2 py-0.5 font-mono text-foreground/80 truncate max-w-full">
                  {typeof window !== "undefined" ? window.location.host : ""}
                  {portfolioUrl}
                </code>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    {t("linkCopied")}
                  </>
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5" />
                    {t("copyLink")}
                  </>
                )}
              </Button>
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-7 items-center gap-1.5 rounded-[min(var(--radius-md),12px)] bg-secondary px-2.5 text-[0.8rem] font-medium text-secondary-foreground transition-all hover:bg-secondary/80"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {t("openPortfolio")}
              </a>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 shrink-0">
                <Link2 className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t("setUsernameTitle")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("setUsername")}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing(true)}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              {t("editProfile")}
            </Button>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="activity">
        <TabsList variant="line" className="flex flex-wrap gap-1">
          <TabsTrigger
            value="activity"
            className="gap-1.5 text-xs sm:text-sm px-3.5 py-2"
          >
            <Activity className="h-3.5 w-3.5" />
            {t("tabs.activity")}
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="gap-1.5 text-xs sm:text-sm px-3.5 py-2"
            disabled={!hasSkills}
          >
            <Target className="h-3.5 w-3.5" />
            {t("tabs.skills")}
          </TabsTrigger>
          {hasTemplates && (
            <TabsTrigger
              value="templates"
              className="gap-1.5 text-xs sm:text-sm px-3.5 py-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t("tabs.templates")}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="activity" className="mt-4 space-y-5">
          <ProfileActivity activities={data.recentActivity} />
        </TabsContent>

        {hasSkills && (
          <TabsContent value="skills" className="mt-4 space-y-5">
            <SkillRadar data={data.skillRadar} />
            <SkillCategoryCards data={data.skillRadar} />
          </TabsContent>
        )}

        {hasTemplates && (
          <TabsContent value="templates" className="mt-4">
            <TemplateGames games={data.templateGames} namespace="profile" />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
