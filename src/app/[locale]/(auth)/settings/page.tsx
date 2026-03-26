"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Settings, User, ArrowRight, Globe, Sun, Moon, Monitor, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExportCsv } from "@/hooks/use-export";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { exportCsv, isExporting } = useExportCsv();

  const themes = [
    { value: "light", icon: Sun, label: t("themeLight") },
    { value: "dark", icon: Moon, label: t("themeDark") },
    { value: "system", icon: Monitor, label: t("themeSystem") },
  ] as const;

  const handleLocaleChange = (newLocale: string) => {
    const path = window.location.pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = path;
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
      }
    } catch {
      // Silently fail
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">{t("title")}</h1>
          </div>
          <p className="text-sm text-white/70">{t("subtitle")}</p>
        </div>
      </div>

      {/* Profile Settings Card */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl shrink-0">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="font-semibold">{t("profileSettings")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("profileSettingsDescription")}
            </p>
          </div>
          <Link href={`/${locale}/profile`}>
            <Button variant="outline" size="sm">
              {t("goToProfile")}
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Language */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl shrink-0">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="font-semibold">{t("language")}</h2>
              <p className="text-sm text-muted-foreground">{t("languageDescription")}</p>
            </div>
            <div className="flex gap-2">
              {[
                { value: "tr", label: "Türkçe" },
                { value: "en", label: "English" },
              ].map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleLocaleChange(lang.value)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    locale === lang.value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Theme */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl shrink-0">
            <Sun className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="font-semibold">{t("theme")}</h2>
              <p className="text-sm text-muted-foreground">{t("themeDescription")}</p>
            </div>
            <div className="flex gap-2">
              {themes.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                    theme === value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Data Export */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl shrink-0">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="font-semibold">{t("dataExport")}</h2>
            <p className="text-sm text-muted-foreground">{t("dataExportDescription")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportData} disabled={isExporting}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            {t("exportAll")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
