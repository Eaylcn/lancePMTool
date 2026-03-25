"use client";

import { useTranslations } from "next-intl";
import { History, Heart, Calendar, Gamepad2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { MetricAiAnalysis } from "@/lib/metrics/types";

interface MetricHistoryItem {
  id: string;
  gameId: string;
  gameTitle: string | null;
  rawMetrics: unknown;
  derivedMetrics: unknown;
  aiAnalysis: MetricAiAnalysis | null;
  createdAt: string;
}

interface MetricHistoryProps {
  analyses: MetricHistoryItem[];
  onSelect: (item: MetricHistoryItem) => void;
}

export function MetricHistory({ analyses, onSelect }: MetricHistoryProps) {
  const t = useTranslations("metrics.history");

  if (analyses.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Card className="p-8 text-center">
          <History className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">{t("noHistory")}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          {t("title")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="space-y-3">
        {analyses.map((item) => {
          const healthScore = item.aiAnalysis?.healthScore ?? 0;
          const scoreColor =
            healthScore >= 70
              ? "text-emerald-500"
              : healthScore >= 40
              ? "text-yellow-500"
              : "text-red-500";
          const scoreBg =
            healthScore >= 70
              ? "bg-emerald-500/20"
              : healthScore >= 40
              ? "bg-yellow-500/20"
              : "bg-red-500/20";

          return (
            <Card
              key={item.id}
              className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${scoreBg}`}>
                    <Heart className={`h-4 w-4 ${scoreColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {item.gameTitle || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {t("healthScore")}
                  </p>
                  <p className={`text-2xl font-bold ${scoreColor}`}>
                    {healthScore}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
