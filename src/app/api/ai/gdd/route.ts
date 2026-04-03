import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { gddSessions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { getGDDSystemPrompt } from "@/lib/ai/prompts/gdd";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set ANTHROPIC_API_KEY in .env.local" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { sessionId, message, currentPhase, completedPhases, currentGDDData, messageHistory, locale } = body;

  if (!sessionId || !message) {
    return NextResponse.json({ error: "sessionId and message are required" }, { status: 400 });
  }

  const validLocale = locale === "en" ? "en" : "tr";

  try {
    // Verify session belongs to user
    const [session] = await db.select().from(gddSessions)
      .where(and(eq(gddSessions.id, sessionId), eq(gddSessions.userId, user.id)));

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Extract custom phases from session data
    const sessionGddData = (currentGDDData || session.gddData) as Record<string, unknown>;
    const sessionMeta = sessionGddData._meta as Record<string, unknown> | undefined;
    const customPhases = sessionMeta?.custom_phases as { phase: number; key: string; title_en: string; title_tr: string; required_fields: string[]; description?: string }[] | undefined;

    const systemPrompt = getGDDSystemPrompt(
      validLocale,
      currentPhase || session.currentPhase,
      completedPhases || session.completedPhases as number[],
      sessionGddData,
      customPhases
    );

    // Build conversation history for AI
    const messages: { role: "user" | "assistant"; content: string }[] = [];
    const history = messageHistory || session.messages as { role: string; content: string }[];

    for (const msg of history) {
      if (msg.role === "user" || msg.role === "assistant") {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
    // Add current user message
    messages.push({ role: "user", content: message });

    const client = getAnthropicClient();

    let aiResponse;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        aiResponse = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: systemPrompt,
          messages,
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

    if (!aiResponse) {
      return NextResponse.json({ error: "AI servisi yanıt vermedi" }, { status: 502 });
    }

    console.log(`[AI GDD] session=${sessionId} | input=${aiResponse.usage.input_tokens} output=${aiResponse.usage.output_tokens}`);

    const textContent = aiResponse.content.find(c => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    // 3-stage JSON parse
    let parsed: Record<string, unknown>;
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

    // Update GDD data if there's an update
    const gddData = (session.gddData || {}) as Record<string, Record<string, unknown>>;
    const gddUpdate = parsed.gdd_update as { phase: number; field: string; value: unknown } | null;

    if (gddUpdate && gddUpdate.phase && gddUpdate.field) {
      const phaseKey = getPhaseKey(gddUpdate.phase, gddData);
      if (!gddData[phaseKey]) {
        gddData[phaseKey] = {};
      }
      gddData[phaseKey][gddUpdate.field] = gddUpdate.value;
    }

    // Update phase tracking
    let newPhase = session.currentPhase;
    const newCompletedPhases = [...(session.completedPhases as number[])];

    if (parsed.phase_completed && parsed.next_phase) {
      if (!newCompletedPhases.includes(newPhase)) {
        newCompletedPhases.push(newPhase);
      }
      newPhase = parsed.next_phase as number;
    }

    // Build updated messages array
    const updatedMessages = [
      ...(session.messages as Record<string, unknown>[]),
      { role: "user", content: message, timestamp: new Date().toISOString() },
      { role: "assistant", content: rawText, timestamp: new Date().toISOString() },
    ];

    // Determine title from first concept
    let title = session.title;
    if (title === "İsimsiz GDD" && gddData.pitch && typeof gddData.pitch === "object" && "concept" in gddData.pitch) {
      const concept = gddData.pitch.concept as string;
      if (concept) {
        title = concept.length > 50 ? concept.substring(0, 50) + "..." : concept;
      }
    }

    // Update session in DB
    const metaForStatus = gddData._meta as Record<string, unknown> | undefined;
    const totalPhasesForStatus = (metaForStatus?.total_phases as number) || 7;
    const status = newPhase > totalPhasesForStatus ? "completed" as const : "in_progress" as const;

    await db.update(gddSessions)
      .set({
        messages: updatedMessages,
        gddData,
        currentPhase: newPhase > totalPhasesForStatus ? totalPhasesForStatus : newPhase,
        completedPhases: newCompletedPhases,
        title,
        status,
        genre: gddData.genre && typeof gddData.genre === "object" && "primary_genre" in gddData.genre
          ? gddData.genre.primary_genre as string : session.genre,
        platform: gddData.pitch && typeof gddData.pitch === "object" && "platform" in gddData.pitch
          ? gddData.pitch.platform as string : session.platform,
        updatedAt: new Date(),
      })
      .where(eq(gddSessions.id, sessionId));

    // Determine total phases from custom phases or default 7
    const meta = gddData._meta as Record<string, unknown> | undefined;
    const totalPhases = (meta?.total_phases as number) || 7;

    return NextResponse.json({
      message: parsed.message,
      question_type: parsed.question_type || "suggestions",
      suggestions: parsed.suggestions || [],
      gdd_update: parsed.gdd_update,
      phase_completed: parsed.phase_completed || false,
      next_phase: parsed.next_phase || null,
      current_phase: newPhase > totalPhases ? totalPhases : newPhase,
      completed_phases: newCompletedPhases,
      gdd_data: gddData,
    });
  } catch (error) {
    console.error("GDD AI error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `GDD AI failed: ${msg}` }, { status: 500 });
  }
}

const DEFAULT_PHASE_KEYS: Record<number, string> = {
  1: "pitch",
  2: "genre",
  3: "core_loop",
  4: "world",
  5: "characters",
  6: "systems",
  7: "mvp",
};

function getPhaseKey(phase: number, gddData?: Record<string, Record<string, unknown>>): string {
  if (phase === 1) return "pitch";

  // Check for custom phases
  const meta = gddData?._meta as Record<string, unknown> | undefined;
  const customPhases = meta?.custom_phases as { phase: number; key: string }[] | undefined;
  if (customPhases) {
    const found = customPhases.find(p => p.phase === phase);
    if (found) return found.key;
  }

  return DEFAULT_PHASE_KEYS[phase] || "unknown";
}
