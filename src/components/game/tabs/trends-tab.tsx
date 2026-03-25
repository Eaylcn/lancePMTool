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

function TrendCard({ trend, t }: { trend: TrendsTabProps["trends"][0]; t: ReturnType<typeof useTranslations> }) {
  const impact = impactConfig[trend.impact || "neutral"] || impactConfig.neutral;
  const ImpactIcon = impact.icon;

  return (
    <Card>
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
            </div>
            {trend.description && (
              <p className="text-sm text-muted-foreground">{trend.description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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

  const hasGroups = positive.length > 0 && negative.length > 0;

  // If no clear groups, show all as a flat list
  if (!hasGroups) {
    return (
      <div className="space-y-3">
        {trends.map((trend) => (
          <TrendCard key={trend.id} trend={trend} t={t} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Positive */}
      {positive.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-emerald-500">
            <TrendingUp className="h-4 w-4" />
            {t("positiveTrends")}
          </h3>
          <div className="space-y-3">
            {positive.map((trend) => (
              <TrendCard key={trend.id} trend={trend} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* Negative */}
      {negative.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-red-500">
            <TrendingDown className="h-4 w-4" />
            {t("negativeTrends")}
          </h3>
          <div className="space-y-3">
            {negative.map((trend) => (
              <TrendCard key={trend.id} trend={trend} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* Neutral */}
      {neutral.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-yellow-500">
            <Minus className="h-4 w-4" />
            {t("neutralTrends")}
          </h3>
          <div className="space-y-3">
            {neutral.map((trend) => (
              <TrendCard key={trend.id} trend={trend} t={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
