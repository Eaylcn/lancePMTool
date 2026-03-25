import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { dailyTasks, taskStreaks } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { getTaskEvaluationSystemPrompt, getTaskEvaluationUserPrompt } from "@/lib/ai/prompts/tasks";
import { taskEvaluationResultSchema } from "@/lib/ai/types";

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: taskId } = await params;
  const body = await request.json();
  const { response, locale } = body;

  if (!response?.trim()) {
    return NextResponse.json({ error: "Response is required" }, { status: 400 });
  }

  const validLocale = locale === "en" ? "en" : "tr";

  try {
    // Verify task ownership
    const [task] = await db.select().from(dailyTasks)
      .where(and(eq(dailyTasks.id, taskId), eq(dailyTasks.userId, user.id)));

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.status === "completed") {
      return NextResponse.json({ error: "Task already completed" }, { status: 400 });
    }

    const trimmedResponse = response.trim();

    // Auto low-score for very short responses
    if (trimmedResponse.length < 50) {
      const autoFeedback = {
        score: 1,
        strengths: [],
        improvements: [validLocale === "tr"
          ? "Yanıtınız çok kısa. Lütfen en az birkaç cümle ile detaylı bir cevap verin."
          : "Your response is too short. Please provide a detailed answer with at least a few sentences."],
        keyTakeaway: validLocale === "tr"
          ? "PM analizi derinlik ve detay gerektirir."
          : "PM analysis requires depth and detail.",
      };

      const [updated] = await db.update(dailyTasks)
        .set({
          response: trimmedResponse,
          aiScore: "1",
          aiFeedback: autoFeedback,
          status: "completed",
        })
        .where(eq(dailyTasks.id, taskId))
        .returning();

      await updateStreak(user.id, task.date);

      return NextResponse.json({ task: updated, evaluation: autoFeedback });
    }

    // AI evaluation
    const client = getAnthropicClient();

    let message;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: getTaskEvaluationSystemPrompt(validLocale),
          messages: [
            {
              role: "user",
              content: getTaskEvaluationUserPrompt(
                {
                  type: task.type || "analysis",
                  title: task.title || "",
                  description: task.description || "",
                  difficulty: task.difficulty || "intermediate",
                },
                trimmedResponse,
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

    if (!message) {
      return NextResponse.json({ error: "AI servisi yanıt vermedi" }, { status: 502 });
    }

    const textContent = message.content.find(c => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No text response" }, { status: 500 });
    }

    const parsed = parseAiJson(textContent.text);
    const evaluation = taskEvaluationResultSchema.parse(parsed);

    // Update task
    const [updated] = await db.update(dailyTasks)
      .set({
        response: trimmedResponse,
        aiScore: String(evaluation.score),
        aiFeedback: evaluation,
        status: "completed",
      })
      .where(eq(dailyTasks.id, taskId))
      .returning();

    await updateStreak(user.id, task.date);

    return NextResponse.json({ task: updated, evaluation });
  } catch (error) {
    console.error("Task submit error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to submit task: ${msg}` }, { status: 500 });
  }
}

async function updateStreak(userId: string, taskDate: string) {
  // Check if all tasks for this date are completed
  const dateTasks = await db.select().from(dailyTasks)
    .where(and(eq(dailyTasks.userId, userId), eq(dailyTasks.date, taskDate)));

  const allCompleted = dateTasks.every(t => t.status === "completed");
  if (!allCompleted) return;

  // Get or create streak record
  const [existing] = await db.select().from(taskStreaks)
    .where(eq(taskStreaks.userId, userId));

  const today = taskDate;

  if (existing) {
    const lastCompleted = existing.lastCompleted;
    const currentStreak = existing.currentStreak || 0;
    const longestStreak = existing.longestStreak || 0;
    const totalCompleted = existing.totalCompleted || 0;

    // Calculate if this is consecutive
    let newStreak = 1;
    if (lastCompleted) {
      const lastDate = new Date(lastCompleted);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak = currentStreak + 1;
      } else if (diffDays === 0) {
        newStreak = currentStreak; // Same day, no change
      }
    }

    await db.update(taskStreaks)
      .set({
        currentStreak: newStreak,
        longestStreak: Math.max(longestStreak, newStreak),
        totalCompleted: totalCompleted + 1,
        lastCompleted: today,
        updatedAt: new Date(),
      })
      .where(eq(taskStreaks.id, existing.id));
  } else {
    await db.insert(taskStreaks).values({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      totalCompleted: 1,
      lastCompleted: today,
    });
  }
}
