"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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

const impactConfig: Record<string, { color: string; icon: React.ElementType }> = {
  positive: { color: "text-emerald-500 bg-emerald-500/10", icon: TrendingUp },
  negative: { color: "text-red-500 bg-red-500/10", icon: TrendingDown },
  neutral: { color: "text-yellow-500 bg-yellow-500/10", icon: Minus },
};

export function TrendsTab({ trends }: TrendsTabProps) {
  const t = useTranslations("game");

  if (!trends || trends.length === 0) {
    return <p className="text-muted-foreground">{t("noTrends")}</p>;
  }

  return (
    <div className="space-y-3">
      {trends.map((trend) => {
        const impact = impactConfig[trend.impact || "neutral"] || impactConfig.neutral;
        const ImpactIcon = impact.icon;

        return (
          <Card key={trend.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${impact.color}`}>
                  <ImpactIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{trend.title}</h3>
                    {trend.trendType && (
                      <Badge variant="secondary" className="text-[10px]">
                        {t(`trendType.${trend.trendType}`)}
                      </Badge>
                    )}
                    {trend.date && (
                      <span className="text-xs text-muted-foreground">{trend.date}</span>
                    )}
                  </div>
                  {trend.description && (
                    <p className="text-sm text-muted-foreground">{trend.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
