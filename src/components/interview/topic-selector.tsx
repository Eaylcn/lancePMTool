"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Briefcase, Coins, MousePointerClick, BookOpen,
  Users, BarChart3, Radio,
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

interface TopicSelectorProps {
  onSelect: (topic: InterviewTopic) => void;
  disabled?: boolean;
}

export function TopicSelector({ onSelect, disabled }: TopicSelectorProps) {
  const t = useTranslations("interview");

  return (
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
            onClick={() => !disabled && onSelect(topic)}
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
                7 {t("questionOf", { current: "", total: "" }).includes("Question") ? "questions" : "soru"}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
