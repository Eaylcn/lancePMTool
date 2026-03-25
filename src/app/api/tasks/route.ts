import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { dailyTasks } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { getTaskGenerationSystemPrompt, getTaskGenerationUserPrompt } from "@/lib/ai/prompts/tasks";
import { taskGenerationResultSchema } from "@/lib/ai/types";

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

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const locale = searchParams.get("locale") === "en" ? "en" : "tr";

  try {
    // Check if tasks exist for this date
    const tasks = await db.select().from(dailyTasks)
      .where(and(eq(dailyTasks.userId, user.id), eq(dailyTasks.date, date)));

    if (tasks.length > 0) {
      return NextResponse.json(tasks);
    }

    // No tasks for today — auto-generate
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured. Please set ANTHROPIC_API_KEY in .env.local" },
        { status: 503 }
      );
    }

    // Get recent task titles to avoid repetition
    const recentTasks = await db.select({ title: dailyTasks.title }).from(dailyTasks)
      .where(eq(dailyTasks.userId, user.id));
    const recentTitles = recentTasks.map(t => t.title).filter(Boolean) as string[];

    const client = getAnthropicClient();

    let message;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: getTaskGenerationSystemPrompt(locale),
          messages: [
            { role: "user", content: getTaskGenerationUserPrompt(recentTitles, "") },
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
    const validated = taskGenerationResultSchema.parse(parsed);

    // Save tasks to DB
    const newTasks = await db.insert(dailyTasks).values(
      validated.tasks.map(task => ({
        userId: user.id,
        date,
        type: task.type,
        title: task.title,
        description: task.description,
        difficulty: task.difficulty,
        status: "pending" as const,
      }))
    ).returning();

    return NextResponse.json(newTasks, { status: 201 });
  } catch (error) {
    console.error("Tasks fetch/generate error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to get tasks: ${msg}` }, { status: 500 });
  }
}
