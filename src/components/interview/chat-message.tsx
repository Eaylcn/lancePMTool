"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, User, ChevronDown, ChevronUp, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MessageFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  keyTakeaway: string;
}

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
  score?: string | null;
  feedback?: MessageFeedback | null;
}

function ScoreRing({ score, size = 40 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = score >= 7 ? "text-green-500" : score >= 5 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="text-muted/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={cn("transition-all duration-700", color)}
        />
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center text-xs font-bold", color)}>
        {score}
      </span>
    </div>
  );
}

export function ChatMessage({ role, content, score, feedback }: ChatMessageProps) {
  const t = useTranslations("interview");
  const [showFeedback, setShowFeedback] = useState(false);
  const isAssistant = role === "assistant";
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [feedbackHeight, setFeedbackHeight] = useState(0);

  useEffect(() => {
    if (feedbackRef.current) {
      setFeedbackHeight(feedbackRef.current.scrollHeight);
    }
  }, [showFeedback, feedback]);

  return (
    <div className={cn("flex gap-3", isAssistant ? "justify-start" : "justify-end")}>
      {isAssistant && (
        <div className="shrink-0 rounded-full bg-primary/10 p-2 h-8 w-8 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className={cn("max-w-[80%] space-y-2", !isAssistant && "items-end")}>
        <Card className={cn(
          "border-0 shadow-sm w-fit",
          isAssistant
            ? "bg-muted/50"
            : "bg-primary text-primary-foreground ml-auto"
        )}>
          <CardContent className="p-3">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </CardContent>
        </Card>

        {score && (
          <div className={cn("flex items-center gap-2", !isAssistant && "justify-end")}>
            <ScoreRing score={Number(score)} size={36} />
            {feedback && (
              <button
                onClick={() => setShowFeedback(!showFeedback)}
                className={cn(
                  "text-xs flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all",
                  showFeedback
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {t("feedback")}
                {showFeedback ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
          </div>
        )}

        {/* Animated Feedback Card */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: showFeedback ? feedbackHeight + 16 : 0, opacity: showFeedback ? 1 : 0 }}
        >
          <div ref={feedbackRef}>
            {feedback && (
              <Card className="border-border/60 bg-muted/30">
                <CardContent className="p-3 space-y-2.5">
                  {feedback.strengths.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1 flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {t("strengths")}
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 pl-5">
                        {feedback.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                      </ul>
                    </div>
                  )}
                  {feedback.improvements.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {t("improvements")}
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 pl-5">
                        {feedback.improvements.map((s, i) => <li key={i}>• {s}</li>)}
                      </ul>
                    </div>
                  )}
                  {feedback.keyTakeaway && (
                    <div className="bg-blue-500/8 dark:bg-blue-500/10 rounded-lg p-2.5">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5" />
                        {t("keyTakeaway")}
                      </p>
                      <p className="text-xs text-muted-foreground">{feedback.keyTakeaway}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {!isAssistant && (
        <div className="shrink-0 rounded-full bg-primary p-2 h-8 w-8 flex items-center justify-center">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
