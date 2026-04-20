import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interviewSessions, interviewMessages } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import {
  getInterviewSystemPrompt, getInterviewUserPrompt,
  getInterviewFinalSystemPrompt, getInterviewFinalUserPrompt,
} from "@/lib/ai/prompts/interview";
import { interviewResponseSchema, interviewFinalFeedbackSchema } from "@/lib/ai/types";
import type { InterviewTopic } from "@/lib/ai/prompts/interview";
import { requirePro } from "@/lib/auth/require-pro";

function parseAiJson(rawText: string): unknown {
  try {
    return JSON.parse(rawText.trim());
  } catch {
    try {
      let jsonText = rawText.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      return JSON.parse(jsonText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Cannot parse AI response");
      return JSON.parse(jsonMatch[0]);
    }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePro();
  if (!auth.ok) return auth.response;
  const user = auth.user;

  const { id: sessionId } = await params;
  const body = await request.json();
  const { content, locale } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  }

  const validLocale = locale === "en" ? "en" : "tr";

  try {
    // Verify session
    const [session] = await db.select().from(interviewSessions)
      .where(and(eq(interviewSessions.id, sessionId), eq(interviewSessions.userId, user.id)));

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status === "completed") {
      return NextResponse.json({ error: "Session already completed" }, { status: 400 });
    }

    // Get existing messages
    const existingMessages = await db.select().from(interviewMessages)
      .where(eq(interviewMessages.sessionId, sessionId))
      .orderBy(asc(interviewMessages.createdAt));

    // Save user message
    const [userMsg] = await db.insert(interviewMessages).values({
      sessionId,
      role: "user",
      content: content.trim(),
    }).returning();

    // Build conversation history for AI
    const conversationHistory = existingMessages.map(m => ({
      role: m.role as "assistant" | "user",
      content: m.content,
    }));

    const client = getAnthropicClient();

    // Get AI response (evaluate + next question)
    let message;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          system: getInterviewSystemPrompt(validLocale, session.topic as InterviewTopic),
          messages: [
            {
              role: "user",
              content: getInterviewUserPrompt(conversationHistory, content.trim()),
            },
          ],
        });
        break;
      } catch (err: unknown) {
        const status = (err as { status?: number }).status;
        if ((status === 529 || status === 429) && attempt < maxRetries - 1) {
          await new Promise(r => setTimeout(r, (attempt + 1) * 5000));
          continue;
        }
        throw err;
      }
    }

    if (!message) {
      return NextResponse.json({ error: "AI servisi yanıt vermedi" }, { status: 502 });
    }

    const textContent = message.content.find(c => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No text response" }, { status: 500 });
    }

    const parsed = parseAiJson(textContent.text);
    const validated = interviewResponseSchema.parse(parsed);

    // Update user message with score
    if (validated.feedback) {
      await db.update(interviewMessages)
        .set({
          score: String(validated.feedback.score),
          feedback: validated.feedback,
        })
        .where(eq(interviewMessages.id, userMsg.id));
    }

    // Save AI's response (next question or completion note)
    const aiContent = validated.isLastQuestion
      ? (validated.feedback?.keyTakeaway || "Interview completed.")
      : validated.question;

    const [aiMsg] = await db.insert(interviewMessages).values({
      sessionId,
      role: "assistant",
      content: aiContent,
    }).returning();

    // If last question, generate final evaluation and complete session
    let finalFeedback = null;

    if (validated.isLastQuestion) {
      // Get all messages including the ones we just added
      const allMessages = await db.select().from(interviewMessages)
        .where(eq(interviewMessages.sessionId, sessionId))
        .orderBy(asc(interviewMessages.createdAt));

      // Generate final evaluation
      let finalMessage;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          finalMessage = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            system: getInterviewFinalSystemPrompt(validLocale),
            messages: [
              {
                role: "user",
                content: getInterviewFinalUserPrompt(
                  session.topic,
                  allMessages.map(m => ({ role: m.role, content: m.content, score: m.score })),
                ),
              },
            ],
          });
          break;
        } catch (err: unknown) {
          const status = (err as { status?: number }).status;
          if ((status === 529 || status === 429) && attempt < maxRetries - 1) {
            await new Promise(r => setTimeout(r, (attempt + 1) * 5000));
            continue;
          }
          throw err;
        }
      }

      if (finalMessage) {
        const finalText = finalMessage.content.find(c => c.type === "text");
        if (finalText && finalText.type === "text") {
          const finalParsed = parseAiJson(finalText.text);
          finalFeedback = interviewFinalFeedbackSchema.parse(finalParsed);

          // Update session
          await db.update(interviewSessions)
            .set({
              status: "completed",
              avgScore: String(finalFeedback.avgScore),
              finalFeedback: finalFeedback,
              updatedAt: new Date(),
            })
            .where(eq(interviewSessions.id, sessionId));
        }
      }
    }

    return NextResponse.json({
      userMessage: userMsg,
      aiMessage: aiMsg,
      feedback: validated.feedback || null,
      isLastQuestion: validated.isLastQuestion,
      questionNumber: validated.questionNumber,
      totalQuestions: validated.totalQuestions,
      finalFeedback,
    });
  } catch (error) {
    console.error("Interview message error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to process message: ${msg}` }, { status: 500 });
  }
}
