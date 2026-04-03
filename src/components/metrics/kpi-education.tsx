"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Clock,
  Repeat,
  BarChart3,
  Wallet,
  Timer,
  CalendarDays,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Category = "all" | "engagement" | "monetization" | "retention";

const KPI_ITEMS = [
  { key: "dau", icon: Users, color: "text-blue-500", category: "engagement" as const },
  { key: "mau", icon: Users, color: "text-indigo-500", category: "engagement" as const },
  { key: "arpdau", icon: DollarSign, color: "text-emerald-500", category: "monetization" as const },
  { key: "ltv", icon: Wallet, color: "text-amber-500", category: "monetization" as const },
  { key: "cpi", icon: Target, color: "text-red-500", category: "monetization" as const },
  { key: "retention", icon: TrendingUp, color: "text-purple-500", category: "retention" as const },
  { key: "stickiness", icon: Repeat, color: "text-cyan-500", category: "engagement" as const },
  { key: "arpu", icon: BarChart3, color: "text-pink-500", category: "monetization" as const },
  { key: "sessionLength", icon: Timer, color: "text-orange-500", category: "engagement" as const },
  { key: "sessionsPerDay", icon: CalendarDays, color: "text-teal-500", category: "engagement" as const },
] as const;

const CATEGORIES: { key: Category; count: number }[] = [
  { key: "all", count: KPI_ITEMS.length },
  { key: "engagement", count: KPI_ITEMS.filter(i => i.category === "engagement").length },
  { key: "monetization", count: KPI_ITEMS.filter(i => i.category === "monetization").length },
  { key: "retention", count: KPI_ITEMS.filter(i => i.category === "retention").length },
];

export function KpiEducation() {
  const t = useTranslations("metrics.education");
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredItems = activeCategory === "all"
    ? KPI_ITEMS
    : KPI_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ key, count }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
              activeCategory === key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {t(`categories.${key}`)} ({count})
          </button>
        ))}
      </div>

      <Accordion className="space-y-2">
        {filteredItems.map(({ key, icon: Icon, color }) => (
          <AccordionItem
            key={key}
            value={key}
            className="border border-border/50 rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-semibold text-sm">{t(`${key}.name`)}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                {t(`${key}.definition`)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {key === "dau" ? "Formula" : "Formula"}
                  </p>
                  <p className="text-sm font-mono">{t(`${key}.formula`)}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Why?
                  </p>
                  <p className="text-sm">{t(`${key}.why`)}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Range
                  </p>
                  <p className="text-xs">{t(`${key}.range`)}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
