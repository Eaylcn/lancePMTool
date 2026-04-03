"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface GDDMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function GDDMessage({ role, content }: GDDMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div className={cn("flex gap-3", isAssistant ? "justify-start" : "justify-end")}>
      {isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isAssistant
            ? "bg-muted text-foreground rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        )}
      >
        {isAssistant ? (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-hr:my-3 prose-strong:text-foreground prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
      </div>
      {!isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
