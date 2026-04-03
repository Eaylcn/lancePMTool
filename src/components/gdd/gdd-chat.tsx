"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GDDMessage } from "./gdd-message";
import { GDDSuggestionChips } from "./gdd-suggestion-chips";
import { GDDMultipleChoice } from "./gdd-multiple-choice";
import { GDDCheckboxGroup } from "./gdd-checkbox-group";
import type { GDDMessage as GDDMessageType, GDDSuggestion, GDDQuestionType } from "@/hooks/use-gdd";

interface GDDChatProps {
  messages: GDDMessageType[];
  suggestions: GDDSuggestion[];
  questionType?: GDDQuestionType;
  onSendMessage: (content: string) => void;
  isSending: boolean;
}

export function GDDChat({ messages, suggestions, questionType, onSendMessage, isSending }: GDDChatProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations("gdd");
  const locale = useLocale();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    onSendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionSelect = (value: string) => {
    if (isSending) return;
    onSendMessage(value);
  };

  const handleWriteOwn = () => {
    inputRef.current?.focus();
  };

  const handleHelpMe = () => {
    if (isSending) return;
    const helpMessage = locale === "tr"
      ? "Karar veremiyorum, bu konuda bana yardımcı olur musun? Seçenekleri karşılaştırıp öneri sunabilir misin?"
      : "I can't decide, can you help me with this? Can you compare the options and give me a recommendation?";
    onSendMessage(helpMessage);
  };

  // Parse assistant messages to extract displayable text
  const getDisplayContent = (msg: GDDMessageType): string => {
    if (msg.role === "user") return msg.content;

    // Try to parse JSON response from assistant
    try {
      const parsed = JSON.parse(msg.content);
      if (parsed.message) return parsed.message;
    } catch {
      // Try stripping markdown code fences
      try {
        let text = msg.content.trim();
        if (text.startsWith("```")) {
          text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }
        const parsed = JSON.parse(text);
        if (parsed.message) return parsed.message;
      } catch {
        // Return raw content as fallback
      }
    }
    return msg.content;
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <GDDMessage key={i} role={msg.role} content={getDisplayContent(msg)} />
        ))}

        {/* Interactive question area after last assistant message */}
        {!isSending && suggestions.length > 0 && messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && (
          questionType === "multiple_choice" ? (
            <GDDMultipleChoice
              options={suggestions}
              onSelect={handleSuggestionSelect}
              onWriteOwn={handleWriteOwn}
              onHelpMe={handleHelpMe}
              disabled={isSending}
            />
          ) : questionType === "checkbox" ? (
            <GDDCheckboxGroup
              options={suggestions}
              onSelect={handleSuggestionSelect}
              onWriteOwn={handleWriteOwn}
              onHelpMe={handleHelpMe}
              disabled={isSending}
            />
          ) : (
            <GDDSuggestionChips
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
              onWriteOwn={handleWriteOwn}
              onHelpMe={handleHelpMe}
              disabled={isSending}
            />
          )
        )}

        {/* Loading indicator */}
        {isSending && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">{t("thinking")}</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("inputPlaceholder")}
            disabled={isSending}
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            size="icon"
            className="shrink-0"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
