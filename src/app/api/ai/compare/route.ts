import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { games, analyses, comparisons } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { getCompareSystemPrompt, getCompareUserPrompt } from "@/lib/ai/prompts/compare";
import { compareAiResultSchema } from "@/lib/ai/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { comparisonId, game1Id, game2Id, locale } = body;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set ANTHROPIC_API_KEY in .env.local" },
      { status: 503 }
    );
  }

  const validLocale = locale === "en" ? "en" : "tr";

  try {
    // Resolve game IDs
    let resolvedGame1Id = game1Id;
    let resolvedGame2Id = game2Id;
    let existingComparisonId = comparisonId;

    if (comparisonId) {
      const [existing] = await db.select().from(comparisons)
        .where(and(eq(comparisons.id, comparisonId), eq(comparisons.userId, user.id)));
      if (!existing) {
        return NextResponse.json({ error: "Comparison not found" }, { status: 404 });
      }
      resolvedGame1Id = existing.game1Id;
      resolvedGame2Id = existing.game2Id;
    }

    if (!resolvedGame1Id || !resolvedGame2Id) {
      return NextResponse.json({ error: "Two game IDs are required" }, { status: 400 });
    }

    // Fetch both games and analyses in parallel
    const [
      [game1], [game2], [analysis1], [analysis2],
    ] = await Promise.all([
      db.select().from(games).where(and(eq(games.id, resolvedGame1Id), eq(games.userId, user.id))),
      db.select().from(games).where(and(eq(games.id, resolvedGame2Id), eq(games.userId, user.id))),
      db.select().from(analyses).where(and(eq(analyses.gameId, resolvedGame1Id), eq(analyses.userId, user.id))),
      db.select().from(analyses).where(and(eq(analyses.gameId, resolvedGame2Id), eq(analyses.userId, user.id))),
    ]);

    if (!game1 || !game2) {
      return NextResponse.json({ error: "One or both games not found" }, { status: 404 });
    }

    if (!analysis1 || !analysis2) {
      return NextResponse.json(
        { error: "Both games must have analyses before comparing" },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();

    // Retry with backoff
    let message;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 12000,
          system: getCompareSystemPrompt(validLocale),
          messages: [
            {
              role: "user",
              content: getCompareUserPrompt(game1, analysis1, game2, analysis2),
            },
          ],
        });
        break;
      } catch (err: unknown) {
        const status = (err as { status?: number }).status;
        if ((status === 529 || status === 429) && attempt < maxRetries - 1) {
          const wait = (attempt + 1) * 5000;
          console.log(`[AI Compare] Retry ${attempt + 1}/${maxRetries} after ${wait}ms (status ${status})`);
          await new Promise(r => setTimeout(r, wait));
          continue;
        }
        throw err;
      }
    }

    if (!message) {
      return NextResponse.json({ error: "AI servisi yanıt vermedi" }, { status: 502 });
    }

    console.log(`[AI Compare] ${game1.title} vs ${game2.title} | input=${message.usage.input_tokens} output=${message.usage.output_tokens}`);

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    // 3-stage JSON parse
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

    const validated = compareAiResultSchema.parse(parsed);

    // Upsert comparison
    if (existingComparisonId) {
      const [updated] = await db.update(comparisons)
        .set({ aiResult: validated })
        .where(and(eq(comparisons.id, existingComparisonId), eq(comparisons.userId, user.id)))
        .returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db.insert(comparisons).values({
        userId: user.id,
        game1Id: resolvedGame1Id,
        game2Id: resolvedGame2Id,
        aiResult: validated,
      }).returning();
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error("AI compare error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `AI comparison failed: ${msg}` }, { status: 500 });
  }
}
