import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { metricAnalyses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { getMetricAnalysisSystemPrompt, getMetricAnalysisUserPrompt } from "@/lib/ai/prompts/metrics";
import { rawMetricsSchema, metricAiAnalysisSchema } from "@/lib/metrics/types";
import { calculateDerivedMetrics, compareWithBenchmarks } from "@/lib/metrics/calculator";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { rawMetrics, genre, gameId, locale } = body;

  if (!rawMetrics || !genre || !gameId) {
    return NextResponse.json({ error: "rawMetrics, genre, and gameId are required" }, { status: 400 });
  }

  const validLocale = locale === "en" ? "en" : "tr";

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set ANTHROPIC_API_KEY in .env.local" },
      { status: 503 }
    );
  }

  try {
    // Validate raw metrics
    const parsedRaw = rawMetricsSchema.parse(rawMetrics);

    // Calculate derived metrics
    const derivedMetrics = calculateDerivedMetrics(parsedRaw);

    // Compare with benchmarks
    const benchmarks = compareWithBenchmarks(parsedRaw, derivedMetrics, genre);

    // AI call with retry
    const client = getAnthropicClient();
    let message;
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          system: getMetricAnalysisSystemPrompt(validLocale),
          messages: [
            {
              role: "user",
              content: getMetricAnalysisUserPrompt(parsedRaw, derivedMetrics, genre, benchmarks),
            },
          ],
        });
        break;
      } catch (err: unknown) {
        const status = (err as { status?: number }).status;
        if ((status === 529 || status === 429) && attempt < maxRetries - 1) {
          const wait = (attempt + 1) * 5000;
          console.log(`[AI Metrics] Retry ${attempt + 1}/${maxRetries} after ${wait}ms (status ${status})`);
          await new Promise(r => setTimeout(r, wait));
          continue;
        }
        throw err;
      }
    }

    if (!message) {
      return NextResponse.json({ error: "AI servisi yanıt vermedi" }, { status: 502 });
    }

    // Token usage logging
    console.log(`[AI Metrics] genre=${genre} | input=${message.usage.input_tokens} output=${message.usage.output_tokens}`);

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

    const validated = metricAiAnalysisSchema.parse(parsed);

    // Upsert: check existing
    const [existing] = await db.select({ id: metricAnalyses.id }).from(metricAnalyses)
      .where(and(eq(metricAnalyses.gameId, gameId), eq(metricAnalyses.userId, user.id)));

    const data = {
      rawMetrics: parsedRaw,
      derivedMetrics,
      aiAnalysis: validated,
    };

    let result;

    if (existing) {
      [result] = await db.update(metricAnalyses)
        .set(data)
        .where(eq(metricAnalyses.id, existing.id))
        .returning();
    } else {
      [result] = await db.insert(metricAnalyses).values({
        gameId,
        userId: user.id,
        ...data,
      }).returning();
    }

    return NextResponse.json(result, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error("AI metrics error:", error);
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Metric analysis failed: ${errMessage}` },
      { status: 500 }
    );
  }
}
