"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Briefcase, Coins, MousePointerClick, BookOpen,
  Users, BarChart3, Radio, Zap, TrendingUp, Award,
} from "lucide-react";
import type { InterviewTopic } from "@/lib/ai/prompts/interview";

const TOPIC_ICONS: Record<InterviewTopic, React.ElementType> = {
  general_pm: Briefcase,
  monetization: Coins,
  ftue: MousePointerClick,
  case_study: BookOpen,
  behavioral: Users,
  metrics_kpi: BarChart3,
  live_ops: Radio,
};

const TOPICS: InterviewTopic[] = [
  "general_pm", "monetization", "ftue", "case_study",
  "behavioral", "metrics_kpi", "live_ops",
];

type Difficulty = "beginner" | "intermediate" | "advanced";

const DIFFICULTY_CONFIG: Record<Difficulty, { icon: React.ElementType; color: string; activeColor: string }> = {
  beginner: {
    icon: Zap,
    color: "text-green-600 dark:text-green-400",
    activeColor: "bg-green-500/15 border-green-500/40 text-green-700 dark:text-green-300",
  },
  intermediate: {
    icon: TrendingUp,
    color: "text-yellow-600 dark:text-yellow-400",
    activeColor: "bg-yellow-500/15 border-yellow-500/40 text-yellow-700 dark:text-yellow-300",
  },
  advanced: {
    icon: Award,
    color: "text-red-600 dark:text-red-400",
    activeColor: "bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-300",
  },
};

interface TopicSelectorProps {
  onSelect: (topic: InterviewTopic, difficulty: Difficulty) => void;
  disabled?: boolean;
}

export function TopicSelector({ onSelect, disabled }: TopicSelectorProps) {
  const t = useTranslations("interview");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("intermediate");

  return (
    <div className="space-y-5">
      {/* Difficulty Picker */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{t("selectDifficulty")}</p>
        <div className="flex gap-2">
          {(["beginner", "intermediate", "advanced"] as Difficulty[]).map((diff) => {
            const config = DIFFICULTY_CONFIG[diff];
            const Icon = config.icon;
            const isActive = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                  isActive
                    ? config.activeColor
                    : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {t(`difficulty.${diff}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {TOPICS.map((topic) => {
          const Icon = TOPIC_ICONS[topic];
          return (
            <Card
              key={topic}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 hover:scale-[1.02]",
                disabled && "opacity-50 pointer-events-none"
              )}
              onClick={() => !disabled && onSelect(topic, selectedDifficulty)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">
                      {t(`topics.${topic}`)}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {t(`topicDescriptions.${topic}`)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="mt-3 text-xs">
                  7 {t("questions")}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
