"use client";

import { useTranslations } from "next-intl";
import {
  PlayCircle, RefreshCw, DollarSign, UserCheck,
  Palette, Layers, Cpu, Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillCategoryCardsProps {
  data: {
    category: string;
    avgGameScore: number;
    avgAnalysisQuality: number;
  }[];
}

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; bar: string }> = {
  ftue: { icon: PlayCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
  coreLoop: { icon: RefreshCw, color: "text-blue-500", bg: "bg-blue-500/10", bar: "bg-blue-500" },
  monetization: { icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10", bar: "bg-amber-500" },
  retention: { icon: UserCheck, color: "text-purple-500", bg: "bg-purple-500/10", bar: "bg-purple-500" },
  uxui: { icon: Palette, color: "text-pink-500", bg: "bg-pink-500/10", bar: "bg-pink-500" },
  metaGame: { icon: Layers, color: "text-orange-500", bg: "bg-orange-500/10", bar: "bg-orange-500" },
  technical: { icon: Cpu, color: "text-cyan-500", bg: "bg-cyan-500/10", bar: "bg-cyan-500" },
};

function ScoreBar({ value, maxValue, color }: { value: number; maxValue: number; color: string }) {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function SkillCategoryCards({ data }: SkillCategoryCardsProps) {
  const t = useTranslations("growth");

  return (
    <Card className="rounded-xl border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-purple-500" />
          {t("skillBreakdown")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {data.map((item) => {
            const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.ftue;
            const Icon = config.icon;
            return (
              <div
                key={item.category}
                className="p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-md ${config.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                  </div>
                  <span className="text-sm font-medium">{t(`categories.${item.category}`)}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{t("categoryGameScore")}</span>
                      <span className="font-medium tabular-nums">{item.avgGameScore}/10</span>
                    </div>
                    <ScoreBar value={item.avgGameScore} maxValue={10} color={config.bar} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{t("categoryAnalysisQuality")}</span>
                      <span className="font-medium tabular-nums">{item.avgAnalysisQuality}/10</span>
                    </div>
                    <ScoreBar value={item.avgAnalysisQuality} maxValue={10} color={config.bar} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
