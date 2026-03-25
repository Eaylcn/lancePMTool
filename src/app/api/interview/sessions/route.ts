import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { interviewSessions, interviewMessages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { getInterviewSystemPrompt, getInterviewUserPrompt } from "@/lib/ai/prompts/interview";
import { interviewResponseSchema } from "@/lib/ai/types";
import type { InterviewTopic } from "@/lib/ai/prompts/interview";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await db.select().from(interviewSessions)
    .where(eq(interviewSessions.userId, user.id))
    .orderBy(desc(interviewSessions.createdAt));

  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { topic, difficulty, locale } = body;

  if (!topic) {
    return NextResponse.json({ error: "topic is required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set ANTHROPIC_API_KEY in .env.local" },
      { status: 503 }
    );
  }

  const validLocale = locale === "en" ? "en" : "tr";

  try {
    // Create session
    const [session] = await db.insert(interviewSessions).values({
      userId: user.id,
      topic,
      difficulty: difficulty || "intermediate",
      status: "active",
    }).returning();

    // Generate first question
    const client = getAnthropicClient();

    let message;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: getInterviewSystemPrompt(validLocale, topic as InterviewTopic),
          messages: [
            { role: "user", content: getInterviewUserPrompt([]) },
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

    // Parse AI response
    let parsed: unknown;
    const rawText = textContent.text;
    try {
      parsed = JSON.parse(rawText.trim());
    } catch {
      try {
        let jsonText = rawText.trim();
        if (jsonText.startsWith("```")) {
          jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }
        parsed = JSON.parse(jsonText);
      } catch {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          return NextResponse.json({ error: "AI yanıtı işlenemedi" }, { status: 502 });
        }
        parsed = JSON.parse(jsonMatch[0]);
      }
    }

    const validated = interviewResponseSchema.parse(parsed);

    // Save AI's first question as assistant message
    const [aiMessage] = await db.insert(interviewMessages).values({
      sessionId: session.id,
      role: "assistant",
      content: validated.question,
    }).returning();

    return NextResponse.json({
      session,
      firstMessage: aiMessage,
      questionNumber: validated.questionNumber,
      totalQuestions: validated.totalQuestions,
    }, { status: 201 });
  } catch (error) {
    console.error("Interview start error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to start interview: ${msg}` }, { status: 500 });
  }
}
