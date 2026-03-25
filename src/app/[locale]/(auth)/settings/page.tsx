"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Settings, User, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();

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
          <div className="p-3 bg-primary/10 rounded-xl">
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
    </div>
  );
}
