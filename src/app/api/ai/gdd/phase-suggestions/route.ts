import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gddSessions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { getPhaseSuggestionsPrompt } from "@/lib/ai/prompts/gdd";
import { requirePro } from "@/lib/auth/require-pro";

export async function POST(request: NextRequest) {
  const auth = await requirePro();
  if (!auth.ok) return auth.response;
  const user = auth.user;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { sessionId, phaseKey, phaseTitle, locale } = body;

  if (!sessionId || !phaseKey) {
    return NextResponse.json({ error: "sessionId and phaseKey are required" }, { status: 400 });
  }

  const validLocale = locale === "en" ? "en" : "tr";

  try {
    const [session] = await db.select().from(gddSessions)
      .where(and(eq(gddSessions.id, sessionId), eq(gddSessions.userId, user.id)));

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const gddData = (session.gddData || {}) as Record<string, Record<string, unknown>>;
    const phaseData = gddData[phaseKey] || {};
    const pitchData = gddData.pitch || {};

    const prompt = getPhaseSuggestionsPrompt(validLocale, phaseTitle || phaseKey, phaseData, pitchData);
    const client = getAnthropicClient();

    const aiResponse = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    console.log(`[AI GDD Suggestions] session=${sessionId} phase=${phaseKey} | input=${aiResponse.usage.input_tokens} output=${aiResponse.usage.output_tokens}`);

    const textContent = aiResponse.content.find(c => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    // Parse JSON
    let parsed: { suggestions: PhaseSuggestionItem[] };
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
          return NextResponse.json({ error: "Failed to parse suggestions" }, { status: 502 });
        }
        parsed = JSON.parse(jsonMatch[0]);
      }
    }

    // Store in _meta.phase_suggestions[phaseKey]
    const meta = (gddData._meta || {}) as Record<string, unknown>;
    const existingSuggestions = (meta.phase_suggestions || {}) as Record<string, unknown>;

    const updatedGddData = {
      ...gddData,
      _meta: {
        ...meta,
        phase_suggestions: {
          ...existingSuggestions,
          [phaseKey]: parsed.suggestions || [],
        },
      },
    };

    await db.update(gddSessions)
      .set({
        gddData: updatedGddData,
        updatedAt: new Date(),
      })
      .where(eq(gddSessions.id, sessionId));

    return NextResponse.json({
      phaseKey,
      suggestions: parsed.suggestions || [],
    });
  } catch (error) {
    console.error("GDD Phase Suggestions error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Suggestions failed: ${msg}` }, { status: 500 });
  }
}

interface PhaseSuggestionItem {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}
