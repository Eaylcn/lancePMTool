"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TaskEvaluation } from "./task-evaluation";
import { cn } from "@/lib/utils";
import { Loader2, Send, BookOpen, BarChart3, Wrench, Eye } from "lucide-react";

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

export function TaskCard({ task, onSubmit, submitting, submittingTaskId }: TaskCardProps) {
  const t = useTranslations("tasks");
  const [response, setResponse] = useState(task.response || "");

  const Icon = TYPE_ICONS[task.type] || BookOpen;
  const isCompleted = task.status === "completed";
  const isSubmitting = submitting && submittingTaskId === task.id;

  const handleSubmit = () => {
    if (response.trim().length < 50) return;
    onSubmit(task.id, response);
  };

  return (
    <Card className={cn(isCompleted && "opacity-80")}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-4 w-4 text-primary" />
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
              </div>
            </div>
          </div>
          {isCompleted && task.aiScore && (
            <Badge variant={Number(task.aiScore) >= 7 ? "default" : Number(task.aiScore) >= 5 ? "secondary" : "destructive"}>
              {Number(task.aiScore).toFixed(0)}/10
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{task.description}</p>

        {!isCompleted ? (
          <>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder={t("responsePlaceholder")}
              className="min-h-[120px] resize-none"
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-xs",
                response.trim().length < 50 ? "text-muted-foreground" : "text-green-600 dark:text-green-400"
              )}>
                {t("characterCount", { count: response.trim().length })}
                {response.trim().length < 50 && ` — ${t("minCharacters")}`}
              </span>
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
          </>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
