"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TaskEvaluation } from "./task-evaluation";
import { cn } from "@/lib/utils";
import { Loader2, Send, BookOpen, BarChart3, Wrench, Eye, ChevronDown, ChevronUp, Clock } from "lucide-react";

const TYPE_ICONS: Record<string, React.ElementType> = {
  analysis: BarChart3,
  learning: BookOpen,
  practice: Wrench,
  reflection: Eye,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-600 dark:text-red-400",
};

interface Task {
  id: string;
  type: string;
  title: string;
  description: string;
  difficulty: string;
  status: string;
  response?: string | null;
  aiScore?: string | null;
  aiFeedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    keyTakeaway: string;
  } | null;
}

interface TaskCardProps {
  task: Task;
  onSubmit: (taskId: string, response: string) => void;
  submitting?: boolean;
  submittingTaskId?: string | null;
}

function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = score >= 7 ? "text-green-500" : score >= 5 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={3} className="text-muted/30" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={3}
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" className={cn("transition-all duration-700", color)}
        />
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center text-xs font-bold", color)}>
        {score}
      </span>
    </div>
  );
}

export function TaskCard({ task, onSubmit, submitting, submittingTaskId }: TaskCardProps) {
  const t = useTranslations("tasks");
  const [response, setResponse] = useState(task.response || "");
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const Icon = TYPE_ICONS[task.type] || BookOpen;
  const isCompleted = task.status === "completed";
  const isExpired = task.status === "expired";
  const isSubmitting = submitting && submittingTaskId === task.id;
  const charProgress = Math.min(response.trim().length / 50, 1);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, response, isCompleted]);

  const handleSubmit = () => {
    if (response.trim().length < 50) return;
    onSubmit(task.id, response);
  };

  return (
    <Card className={cn(
      "rounded-xl border-border/60 transition-all hover:shadow-md",
      isCompleted && "opacity-90",
      isExpired && "opacity-60 border-red-500/20"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "rounded-lg p-2",
              isExpired ? "bg-red-500/10" : "bg-primary/10"
            )}>
              {isExpired ? (
                <Clock className="h-4 w-4 text-red-500" />
              ) : (
                <Icon className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <CardTitle className="text-sm">{task.title}</CardTitle>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="outline" className="text-xs">
                  {t(`types.${task.type}`)}
                </Badge>
                <Badge className={cn("text-xs border-0", DIFFICULTY_COLORS[task.difficulty])}>
                  {t(`difficulty.${task.difficulty}`)}
                </Badge>
                {isExpired && (
                  <Badge variant="destructive" className="text-xs">
                    {t("status.expired")}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {isCompleted && task.aiScore && (
            <ScoreRing score={Number(task.aiScore)} />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{task.description}</p>

        {!isCompleted && !isExpired ? (
          <>
            {/* Expand/Collapse Button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className={cn(
                "w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm transition-all",
                expanded
                  ? "bg-primary/5 border-primary/20 text-primary"
                  : "border-dashed border-border/80 text-muted-foreground hover:border-primary/30 hover:text-primary"
              )}
            >
              {expanded ? t("collapseResponse") : t("expandResponse")}
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {/* Animated Response Area */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: expanded ? contentHeight + 16 : 0, opacity: expanded ? 1 : 0 }}
            >
              <div ref={contentRef} className="space-y-2.5">
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder={t("responsePlaceholder")}
                  className="min-h-[120px] resize-none"
                  disabled={isSubmitting}
                />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    {/* Character Progress Bar */}
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[120px]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          charProgress >= 1 ? "bg-green-500" : "bg-primary/60"
                        )}
                        style={{ width: `${charProgress * 100}%` }}
                      />
                    </div>
                    <span className={cn(
                      "text-xs",
                      charProgress >= 1 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                    )}>
                      {response.trim().length}/50
                    </span>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={response.trim().length < 50 || isSubmitting}
                    size="sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        {t("submitting")}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        {t("submitResponse")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : isCompleted ? (
          <>
            {task.response && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm whitespace-pre-wrap">{task.response}</p>
              </div>
            )}
            {task.aiFeedback && (
              <TaskEvaluation evaluation={task.aiFeedback} />
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
