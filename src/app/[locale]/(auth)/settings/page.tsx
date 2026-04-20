"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Settings,
  User,
  ArrowRight,
  Globe,
  Sun,
  Moon,
  Monitor,
  Download,
  Palette,
  UserCog,
  Database,
  LogOut,
  Mail,
  CheckCircle2,
  Loader2,
  FileSpreadsheet,
  ShieldAlert,
  Pencil,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useExportCsv } from "@/hooks/use-export";
import { useProfile } from "@/hooks/use-profile";
import { PmLevelBadge } from "@/components/growth/pm-level-badge";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const { exportCsv, isExporting } = useExportCsv();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const themes = [
    { value: "light", icon: Sun, label: t("themeLight"), desc: t("themeLightDesc") },
    { value: "dark", icon: Moon, label: t("themeDark"), desc: t("themeDarkDesc") },
    { value: "system", icon: Monitor, label: t("themeSystem"), desc: t("themeSystemDesc") },
  ] as const;

  const handleLocaleChange = (newLocale: string) => {
    const path = window.location.pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.assign(path);
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("/api/games?includeTemplates=true");
      const games = await res.json();
      if (Array.isArray(games) && games.length > 0) {
        const data = games.map((g: Record<string, unknown>) => ({
          title: g.title,
          studio: g.studio,
          genre: Array.isArray(g.genre) ? (g.genre as string[]).join(", ") : "",
          platform: g.platform,
          status: g.status,
          rating: g.overallRating,
          isTemplate: g.isTemplate,
        }));
        await exportCsv(data, "gamelens_all_games");
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 2500);
      }
    } catch {
      // silently fail
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      window.location.assign(`/${locale}/login`);
    } catch {
      setSigningOut(false);
      setSignOutConfirm(false);
    }
  };

  const totalGames = profile?.stats?.totalGames ?? 0;
  const totalAnalyses = profile?.stats?.totalAnalyses ?? 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-500/10 via-slate-500/5 to-transparent p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-slate-500/10 blur-3xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-background/60 backdrop-blur shadow-sm ring-1 ring-border/60">
            <Settings className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general">
        <TabsList variant="line" className="flex flex-wrap gap-1">
          <TabsTrigger value="general" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <Globe className="h-3.5 w-3.5" />
            {t("tabs.general")}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <Palette className="h-3.5 w-3.5" />
            {t("tabs.appearance")}
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <UserCog className="h-3.5 w-3.5" />
            {t("tabs.account")}
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-1.5 text-xs sm:text-sm px-3.5 py-2">
            <Database className="h-3.5 w-3.5" />
            {t("tabs.data")}
          </TabsTrigger>
        </TabsList>

        {/* GENERAL */}
        <TabsContent value="general" className="mt-4 space-y-4">
          {/* Language */}
          <SectionCard
            icon={Globe}
            title={t("language")}
            description={t("languageDescription")}
            iconColor="text-blue-500"
            iconBg="bg-blue-500/10"
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "tr", label: "Türkçe", flag: "TR", native: "Türkiye" },
                { value: "en", label: "English", flag: "EN", native: "International" },
              ].map((lang) => {
                const active = locale === lang.value;
                return (
                  <button
                    key={lang.value}
                    onClick={() => handleLocaleChange(lang.value)}
                    className={`group relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/30 hover:bg-muted/40"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-xs ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {lang.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{lang.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {lang.native}
                      </p>
                    </div>
                    {active && (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {/* Profile quick access */}
          <SectionCard
            icon={User}
            title={t("profileSettings")}
            description={t("profileSettingsDescription")}
            iconColor="text-purple-500"
            iconBg="bg-purple-500/10"
            action={
              <Link href={`/${locale}/profile`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  {t("goToProfile")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            }
          />
        </TabsContent>

        {/* APPEARANCE */}
        <TabsContent value="appearance" className="mt-4 space-y-4">
          <SectionCard
            icon={Palette}
            title={t("theme")}
            description={t("themeDescription")}
            iconColor="text-amber-500"
            iconBg="bg-amber-500/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themes.map(({ value, icon: Icon, label, desc }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`group relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/30 hover:bg-muted/40"
                    }`}
                  >
                    <ThemePreview variant={value} />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`h-4 w-4 ${
                            active ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <p className="text-sm font-semibold">{label}</p>
                      </div>
                      {active && (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        {/* ACCOUNT */}
        <TabsContent value="account" className="mt-4 space-y-4">
          {/* Account summary */}
          <Card className="p-5">
            {profileLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                    <UserCog className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm truncate">
                        {profile?.profile?.fullName || t("account.anonymous")}
                      </p>
                      {profile?.stats?.pmLevel && (
                        <PmLevelBadge level={profile.stats.pmLevel} size="sm" />
                      )}
                    </div>
                    {profile?.profile?.username && (
                      <p className="text-xs text-muted-foreground">
                        @{profile.profile.username}
                      </p>
                    )}
                  </div>
                </div>
                <Link href={`/${locale}/profile`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Pencil className="h-3.5 w-3.5" />
                    {t("account.edit")}
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InfoTile
              icon={Mail}
              label={t("account.plan")}
              value={profile?.profile?.role === "pro" ? "Pro" : "Free"}
              color="text-emerald-500"
              bg="bg-emerald-500/10"
            />
            <InfoTile
              icon={FileSpreadsheet}
              label={t("account.totalGames")}
              value={String(totalGames)}
              color="text-blue-500"
              bg="bg-blue-500/10"
            />
            <InfoTile
              icon={Database}
              label={t("account.totalAnalyses")}
              value={String(totalAnalyses)}
              color="text-purple-500"
              bg="bg-purple-500/10"
            />
          </div>

          {profile?.profile?.createdAt && (
            <p className="text-[11px] text-muted-foreground px-1">
              {t("account.memberSince", {
                date: new Date(profile.profile.createdAt).toLocaleDateString(
                  locale
                ),
              })}
            </p>
          )}

          {/* Danger zone */}
          <Card className="p-5 border-red-500/30 bg-red-500/[0.02]">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">
                {t("dangerZone")}
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{t("signOut")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("signOutDescription")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSignOutConfirm(true)}
                className="border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                {t("signOut")}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* DATA */}
        <TabsContent value="data" className="mt-4 space-y-4">
          <SectionCard
            icon={Download}
            title={t("dataExport")}
            description={t("dataExportDescription")}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-500/10"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                disabled={isExporting}
                className="gap-1.5"
              >
                {isExporting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : exportSuccess ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                {exportSuccess ? t("exportDone") : t("exportAll")}
              </Button>
            }
          >
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[11px]">
                CSV
              </Badge>
              <span className="text-xs text-muted-foreground">
                {t("exportGameCount", { count: totalGames })}
              </span>
            </div>
          </SectionCard>

          {/* Privacy note */}
          <Card className="p-5 bg-muted/30 border-dashed">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium">{t("privacyTitle")}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  {t("privacyDescription")}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={signOutConfirm}
        onOpenChange={setSignOutConfirm}
        title={t("signOutConfirmTitle")}
        description={t("signOutConfirmDescription")}
        confirmLabel={t("signOut")}
        onConfirm={handleSignOut}
        loading={signingOut}
        variant="destructive"
      />
    </div>
  );
}

// ------- sub components -------

function SectionCard({
  icon: Icon,
  title,
  description,
  iconColor,
  iconBg,
  action,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl ${iconBg} shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-sm">{title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
          {children}
        </div>
      </div>
    </Card>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${bg} shrink-0`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{label}</p>
          <p className="text-base font-bold leading-tight">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function ThemePreview({ variant }: { variant: "light" | "dark" | "system" }) {
  const bgClass =
    variant === "light"
      ? "bg-white"
      : variant === "dark"
      ? "bg-slate-900"
      : "bg-gradient-to-r from-white via-white to-slate-900";

  const barClass = variant === "light" ? "bg-slate-200" : "bg-slate-700";
  const accentClass = variant === "light" ? "bg-slate-100" : "bg-slate-800";
  const pillClass = variant === "light" ? "bg-primary/60" : "bg-primary";

  return (
    <div
      className={`relative h-16 rounded-lg border overflow-hidden ${bgClass}`}
    >
      <div className={`absolute top-2 left-2 right-2 h-1.5 rounded ${barClass}`} />
      <div className={`absolute top-5 left-2 w-8 h-1.5 rounded ${pillClass}`} />
      <div className={`absolute top-5 left-12 right-2 h-1.5 rounded ${accentClass}`} />
      <div className={`absolute bottom-2 left-2 right-1/2 h-3 rounded ${accentClass}`} />
      <div className={`absolute bottom-2 right-2 w-8 h-3 rounded ${pillClass} opacity-70`} />
    </div>
  );
}

