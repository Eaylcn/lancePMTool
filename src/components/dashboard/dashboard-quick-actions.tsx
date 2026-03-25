"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { BarChart3, MessageSquare, CheckSquare, Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";

const ACTIONS = [
  { key: "newAnalysis", icon: BarChart3, href: "/analyze/new", color: "text-blue-500", bg: "bg-blue-500/10" },
  { key: "startInterview", icon: MessageSquare, href: "/interview", color: "text-purple-500", bg: "bg-purple-500/10" },
  { key: "dailyTasks", icon: CheckSquare, href: "/tasks", color: "text-amber-500", bg: "bg-amber-500/10" },
  { key: "metrics", icon: Calculator, href: "/metrics", color: "text-emerald-500", bg: "bg-emerald-500/10" },
] as const;

export function DashboardQuickActions() {
  const t = useTranslations("dashboard.quickActions");
  const locale = useLocale();

  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold text-sm">{t("title")}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ACTIONS.map(({ key, icon: Icon, href, color, bg }) => (
          <Link
            key={key}
            href={`/${locale}${href}`}
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className={`p-2 rounded-lg ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <span className="text-xs font-medium text-center">{t(key)}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
