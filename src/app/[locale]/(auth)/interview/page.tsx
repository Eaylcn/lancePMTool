"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { MessageSquare, Loader2 } from "lucide-react";
import { useInterviewSessions, useInterviewSession, useStartInterview, useSendMessage } from "@/hooks/use-interview";
import { TopicSelector } from "@/components/interview/topic-selector";
import { ChatMessage } from "@/components/interview/chat-message";
import { ChatInput } from "@/components/interview/chat-input";
import { SessionHeader } from "@/components/interview/session-header";
import { SessionHistory } from "@/components/interview/session-history";
import { FinalEvaluation } from "@/components/interview/final-evaluation";
import { EmptyState } from "@/components/shared/empty-state";
import type { InterviewTopic } from "@/lib/ai/prompts/interview";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  score?: string | null;
  feedback?: { score: number; strengths: string[]; improvements: string[]; keyTakeaway: string } | null;
}

interface SessionData {
  id: string;
  topic: string;
  difficulty: string;
  status: string;
  avgScore?: string | null;
  finalFeedback?: {
    overallReadiness: "low" | "medium" | "high";
    avgScore: number;
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
    summary: string;
  } | null;
}

export default function InterviewPage() {
  const t = useTranslations("interview");
  const locale = useLocale();

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(7);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [localSession, setLocalSession] = useState<SessionData | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions = [], isLoading: sessionsLoading } = useInterviewSessions();
  const { data: sessionData } = useInterviewSession(selectedSessionId || "");
  const startInterview = useStartInterview();
  const sendMessage = useSendMessage();

  // Sync remote session data with local state
  useEffect(() => {
    if (sessionData) {
      setLocalMessages(sessionData.messages || []);
      setLocalSession(sessionData.session || null);
    }
  }, [sessionData]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleStartInterview = async (topic: InterviewTopic) => {
    try {
      const result = await startInterview.mutateAsync({
        topic,
        difficulty: "intermediate",
        locale,
      });
      setSelectedSessionId(result.session.id);
      setQuestionNumber(result.questionNumber || 1);
      setTotalQuestions(result.totalQuestions || 7);
      setLocalMessages([result.firstMessage]);
      setLocalSession(result.session);
    } catch {
      // Error handled by TanStack
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedSessionId) return;

    // Optimistic: add user message immediately
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
    };
    setLocalMessages(prev => [...prev, tempUserMsg]);

    try {
      const result = await sendMessage.mutateAsync({
        sessionId: selectedSessionId,
        content,
        locale,
      });

      // Replace temp message with real data and add AI response
      setLocalMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tempUserMsg.id);
        const msgs = [...withoutTemp, result.userMessage, result.aiMessage];
        return msgs;
      });

      if (result.questionNumber) setQuestionNumber(result.questionNumber);
      if (result.totalQuestions) setTotalQuestions(result.totalQuestions);

      // Handle feedback on user message
      if (result.feedback && result.userMessage) {
        setLocalMessages(prev =>
          prev.map(m =>
            m.id === result.userMessage.id
              ? { ...m, score: String(result.feedback.score), feedback: result.feedback }
              : m
          )
        );
      }

      // Handle session completion
      if (result.isLastQuestion && result.finalFeedback) {
        setLocalSession(prev => prev ? {
          ...prev,
          status: "completed",
          avgScore: String(result.finalFeedback.avgScore),
          finalFeedback: result.finalFeedback,
        } : null);
      }
    } catch {
      // Remove optimistic message on error
      setLocalMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
    }
  };

  const handleBack = () => {
    setSelectedSessionId(null);
    setLocalMessages([]);
    setLocalSession(null);
  };

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  // Active chat view
  if (selectedSessionId && localSession) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <SessionHeader
          topic={localSession.topic as InterviewTopic}
          status={localSession.status}
          avgScore={localSession.avgScore}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          onBack={handleBack}
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1">
          {localMessages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              score={msg.score}
              feedback={msg.feedback}
            />
          ))}

          {sendMessage.isPending && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{t("thinking")}</span>
            </div>
          )}

          {/* Final evaluation */}
          {localSession.status === "completed" && localSession.finalFeedback && (
            <FinalEvaluation feedback={localSession.finalFeedback} />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {localSession.status !== "completed" && (
          <div className="border-t pt-4">
            <ChatInput
              onSend={handleSendMessage}
              disabled={localSession.status === "completed"}
              loading={sendMessage.isPending}
            />
          </div>
        )}
      </div>
    );
  }

  // Topic selection view
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border p-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      {/* Topic selector */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("selectTopic")}</h2>
        <TopicSelector
          onSelect={handleStartInterview}
          disabled={startInterview.isPending}
        />
        {startInterview.isPending && (
          <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">{t("thinking")}</span>
          </div>
        )}
      </div>

      {/* Session history */}
      {sessionsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : sessions.length > 0 ? (
        <SessionHistory sessions={sessions} onSelect={handleSelectSession} />
      ) : (
        <EmptyState
          icon={MessageSquare}
          title={t("noSessions")}
          description={t("noSessionsDescription")}
        />
      )}
    </div>
  );
}
