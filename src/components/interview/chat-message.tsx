"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, User, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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

export function ChatMessage({ role, content, score, feedback }: ChatMessageProps) {
  const t = useTranslations("interview");
  const [showFeedback, setShowFeedback] = useState(false);
  const isAssistant = role === "assistant";

  return (
    <div className={cn("flex gap-3", isAssistant ? "justify-start" : "justify-end")}>
      {isAssistant && (
        <div className="shrink-0 rounded-full bg-primary/10 p-2 h-8 w-8 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className={cn("max-w-[80%] space-y-2", !isAssistant && "items-end")}>
        <Card className={cn(
          "border-0 shadow-sm",
          isAssistant
            ? "bg-muted/50"
            : "bg-primary text-primary-foreground"
        )}>
          <CardContent className="p-3">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </CardContent>
        </Card>

        {score && (
          <div className="flex items-center gap-2">
            <Badge variant={Number(score) >= 7 ? "default" : Number(score) >= 5 ? "secondary" : "destructive"} className="text-xs">
              {t("score")}: {score}/10
            </Badge>
            {feedback && (
              <button
                onClick={() => setShowFeedback(!showFeedback)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                {t("feedback")}
                {showFeedback ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
          </div>
        )}

        {showFeedback && feedback && (
          <Card className="border-dashed">
            <CardContent className="p-3 space-y-2">
              {feedback.strengths.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">{t("strengths")}</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {feedback.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {feedback.improvements.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">{t("improvements")}</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {feedback.improvements.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {feedback.keyTakeaway && (
                <div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">{t("keyTakeaway")}</p>
                  <p className="text-xs text-muted-foreground">{feedback.keyTakeaway}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      {!isAssistant && (
        <div className="shrink-0 rounded-full bg-primary p-2 h-8 w-8 flex items-center justify-center">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
