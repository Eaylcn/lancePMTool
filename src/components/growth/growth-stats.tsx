"use client";

import { useTranslations } from "next-intl";
import { Gamepad2, Brain, Eye, BarChart3, Layers, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface GrowthStatsProps {
  stats: {
    totalGames: number;
    totalAnalyses: number;
    aiAnalyzedCount: number;
    averageObservationLevel: string;
    averageAnalysisQuality: number;
    genreCount: number;
  };
}

export function GrowthStats({ stats }: GrowthStatsProps) {
  const t = useTranslations("growth");
  const tObs = useTranslations("growth.observationLevels");

  const cards = [
    { key: "totalGames", value: stats.totalGames, icon: Gamepad2, color: "text-emerald-500" },
    { key: "totalAnalyses", value: stats.totalAnalyses, icon: Brain, color: "text-blue-500" },
    { key: "avgLevel", value: tObs(stats.averageObservationLevel), icon: Eye, color: "text-purple-500" },
    { key: "avgQuality", value: `${stats.averageAnalysisQuality}/10`, icon: BarChart3, color: "text-orange-500" },
    { key: "genreCount", value: stats.genreCount, icon: Layers, color: "text-pink-500" },
    { key: "aiAnalyzed", value: stats.aiAnalyzedCount, icon: Award, color: "text-amber-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map(card => (
        <Card key={card.key} className="border-border/50">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`h-4 w-4 ${card.color}`} />
              <span className="text-xs text-muted-foreground">{t(`stats.${card.key}`)}</span>
            </div>
            <p className="text-xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
