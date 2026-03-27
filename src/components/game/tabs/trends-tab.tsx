"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Cpu, ShoppingCart, Users, CircleDot } from "lucide-react";

interface TrendsTabProps {
  trends: Array<{
    id: string;
    trendType: string | null;
    title: string | null;
    impact: string | null;
    description: string | null;
    date: string | null;
  }>;
}

const impactConfig: Record<string, { color: string; bgColor: string; borderColor: string; icon: React.ElementType; label: string }> = {
  positive: { color: "text-emerald-500", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20", icon: TrendingUp, label: "Pozitif" },
  negative: { color: "text-red-500", bgColor: "bg-red-500/10", borderColor: "border-red-500/20", icon: TrendingDown, label: "Negatif" },
  neutral: { color: "text-yellow-500", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/20", icon: Minus, label: "Nötr" },
};

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  market: { icon: ShoppingCart, color: "text-blue-500" },
  technology: { icon: Cpu, color: "text-violet-500" },
  player_behavior: { icon: Users, color: "text-orange-500" },
};

export function TrendsTab({ trends }: TrendsTabProps) {
  const t = useTranslations("game");

  if (!trends || trends.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">{t("noTrends")}</p>
      </div>
    );
  }

  const positive = trends.filter((tr) => tr.impact === "positive");
  const negative = trends.filter((tr) => tr.impact === "negative");
  const neutral = trends.filter((tr) => tr.impact !== "positive" && tr.impact !== "negative");

  // Summary badges
  const summaryItems = [
    positive.length > 0 && { count: positive.length, ...impactConfig.positive },
    negative.length > 0 && { count: negative.length, ...impactConfig.negative },
    neutral.length > 0 && { count: neutral.length, ...impactConfig.neutral },
  ].filter(Boolean) as Array<{ count: number; color: string; bgColor: string; borderColor: string; icon: React.ElementType; label: string }>;

  const hasGroups = positive.length > 0 && negative.length > 0;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex gap-3 flex-wrap">
        {summaryItems.map((item) => (
          <div key={item.label} className={`flex items-center gap-2 rounded-lg border ${item.borderColor} ${item.bgColor} px-3 py-2`}>
            <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
            <span className="text-xs font-medium">{item.count} {item.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />

        <div className="space-y-4">
          {trends.map((trend, idx) => {
            const impact = impactConfig[trend.impact || "neutral"] || impactConfig.neutral;
            const ImpactIcon = impact.icon;
            const typeConf = typeConfig[trend.trendType || ""] || null;

            return (
              <div key={trend.id} className="relative flex gap-4 pl-0">
                {/* Timeline dot */}
                <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 ${impact.borderColor} ${impact.bgColor} flex items-center justify-center`}>
                  <ImpactIcon className={`h-4 w-4 ${impact.color}`} />
                </div>

                {/* Content card */}
                <div className={`flex-1 rounded-xl border ${impact.borderColor} p-4 space-y-2`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{trend.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {trend.trendType && (
                        <Badge variant="secondary" className="text-[10px] gap-1">
                          {typeConf && <typeConf.icon className={`h-3 w-3 ${typeConf.color}`} />}
                          {t(`trendType.${trend.trendType}`)}
                        </Badge>
                      )}
                      <Badge variant="outline" className={`text-[10px] ${impact.color}`}>
                        {impact.label}
                      </Badge>
                    </div>
                  </div>
                  {trend.description && (
                    <p className="text-xs leading-relaxed text-muted-foreground">{trend.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
