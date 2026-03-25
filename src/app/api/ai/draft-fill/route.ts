import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/ai/client";
import { getDraftFillSystemPrompt, getDraftFillUserPrompt } from "@/lib/ai/prompts/draft-fill";
import { draftFillResponseSchema } from "@/lib/ai/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { notes, genre, gameTitle, locale } = body;

  if (!notes) {
    return NextResponse.json({ error: "notes are required" }, { status: 400 });
  }

  const validLocale = locale === "en" ? "en" : "tr";

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set ANTHROPIC_API_KEY in .env.local" },
      { status: 503 }
    );
  }

  try {
    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 16000,
      system: getDraftFillSystemPrompt(validLocale),
      messages: [
        {
          role: "user",
          content: getDraftFillUserPrompt(gameTitle || "", genre || [], notes),
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    // Strip markdown code blocks if present
    let jsonText = textContent.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonText);
    const validated = draftFillResponseSchema.parse(parsed);

    return NextResponse.json(validated);
  } catch (error) {
    console.error("Draft fill error:", error);
    const message = error instanceof Error ? error.message : "AI draft fill failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
