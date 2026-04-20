import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gddSessions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { getPhaseGenerationPrompt, getGameVisionPrompt } from "@/lib/ai/prompts/gdd";
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
  const { sessionId, locale } = body;

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  const validLocale = locale === "en" ? "en" : "tr";

  try {
    // Verify session belongs to user
    const [session] = await db.select().from(gddSessions)
      .where(and(eq(gddSessions.id, sessionId), eq(gddSessions.userId, user.id)));

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const gddData = (session.gddData || {}) as Record<string, Record<string, unknown>>;
    const pitchData = gddData.pitch || {};

    // Don't regenerate if already exists
    if (gddData._meta && (gddData._meta as Record<string, unknown>).custom_phases) {
      const meta = gddData._meta as Record<string, unknown>;
      return NextResponse.json({
        phases: meta.custom_phases,
        total_phases: meta.total_phases,
      });
    }

    const prompt = getPhaseGenerationPrompt(validLocale, pitchData);
    const client = getAnthropicClient();

    const aiResponse = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    console.log(`[AI GDD Phases] session=${sessionId} | input=${aiResponse.usage.input_tokens} output=${aiResponse.usage.output_tokens}`);

    const textContent = aiResponse.content.find(c => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    // Parse JSON response
    let parsed: { phases: unknown[]; total_phases: number };
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
          return NextResponse.json({ error: "Failed to parse phase generation response" }, { status: 502 });
        }
        parsed = JSON.parse(jsonMatch[0]);
      }
    }

    // Validate
    if (!Array.isArray(parsed.phases) || parsed.phases.length === 0) {
      return NextResponse.json({ error: "Invalid phases format" }, { status: 502 });
    }

    // Generate game vision in parallel
    let gameVision = "";
    try {
      const visionPrompt = getGameVisionPrompt(validLocale, pitchData);
      const visionResponse = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: visionPrompt }],
      });
      console.log(`[AI GDD Vision] session=${sessionId} | input=${visionResponse.usage.input_tokens} output=${visionResponse.usage.output_tokens}`);
      const visionText = visionResponse.content.find(c => c.type === "text");
      if (visionText && visionText.type === "text") {
        gameVision = visionText.text.trim();
      }
    } catch (err) {
      console.error("Game vision generation failed:", err);
    }

    // Store in _meta
    const updatedGddData = {
      ...gddData,
      _meta: {
        ...(gddData._meta as Record<string, unknown> || {}),
        custom_phases: parsed.phases,
        total_phases: parsed.total_phases || parsed.phases.length + 1,
        game_vision: gameVision || undefined,
      },
    };

    await db.update(gddSessions)
      .set({
        gddData: updatedGddData,
        updatedAt: new Date(),
      })
      .where(eq(gddSessions.id, sessionId));

    return NextResponse.json({
      phases: parsed.phases,
      total_phases: parsed.total_phases || parsed.phases.length + 1,
      game_vision: gameVision || null,
    });
  } catch (error) {
    console.error("GDD Phase Generation error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Phase generation failed: ${msg}` }, { status: 500 });
  }
}
