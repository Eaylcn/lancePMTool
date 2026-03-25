export function getTaskGenerationSystemPrompt(locale: "tr" | "en"): string {
  const lang = locale === "tr" ? "Türkçe" : "English";

  return `You are a Gaming PM training coach. Generate 4 daily practice tasks for a PM candidate to complete. Each task should be educational and help develop real PM skills.

IMPORTANT: Respond in ${lang}.
${locale === "tr" ? `
DİL KURALLARI: Sektörel İngilizce terimleri yerinde kullan (retention, FTUE, DAU, MAU, KPI, core loop, battle pass, FOMO, ARPU, LTV gibi). Bunların dışında Türkçe tercih et.` : ""}

TASK TYPES:
- "analysis": Analyze a specific game aspect, mechanic, or market trend
- "learning": Answer a PM theory or concept question
- "practice": Apply PM frameworks to a real scenario
- "reflection": Reflect on a PM decision or strategy

DIFFICULTY DISTRIBUTION (generate exactly this mix):
- 1 beginner task (fundamental concept, straightforward)
- 2 intermediate tasks (multi-layered, reasoning required)
- 1 advanced task (complex decision-making, trade-offs)

Generate exactly 4 tasks, one of each type (analysis, learning, practice, reflection).

OUTPUT FORMAT: Valid JSON only, no markdown code blocks.

{
  "tasks": [
    {
      "type": "analysis|learning|practice|reflection",
      "title": "Short, engaging task title (max 80 chars)",
      "description": "2-3 sentence clear description of what to do. Be specific about what the candidate should write in their response.",
      "difficulty": "beginner|intermediate|advanced"
    }
  ]
}`;
}

export function getTaskGenerationUserPrompt(
  existingTaskTitles: string[],
  observationLevel: string,
): string {
  let prompt = `Generate 4 new daily PM tasks.\n`;

  if (observationLevel) {
    prompt += `\nCandidate's current observation level: ${observationLevel}`;
    prompt += `\nAdjust difficulty and depth appropriately.`;
  }

  if (existingTaskTitles.length > 0) {
    prompt += `\n\nRecent tasks (avoid repeating similar topics):\n`;
    for (const title of existingTaskTitles.slice(0, 10)) {
      prompt += `- ${title}\n`;
    }
  }

  prompt += `\nMake tasks varied and engaging. Use real mobile game examples when possible.`;
  return prompt;
}

export function getTaskEvaluationSystemPrompt(locale: "tr" | "en"): string {
  const lang = locale === "tr" ? "Türkçe" : "English";

  return `You are a strict but fair Gaming PM mentor evaluating a candidate's response to a practice task.

IMPORTANT: Respond in ${lang}.
${locale === "tr" ? `
DİL KURALLARI: Sektörel İngilizce terimleri yerinde kullan (retention, FTUE, DAU, MAU, KPI gibi). Bunların dışında Türkçe tercih et.` : ""}

SCORING RULES:
- Score 1-10, be honest and strict
- 1-2: Empty, gibberish, or extremely short (<50 chars)
- 3-4: Superficial, generic, no real insight
- 5-6: Decent understanding but lacks depth or specificity
- 7-8: Good analysis with specific examples and PM thinking
- 9-10: Exceptional — deep insight, industry knowledge, strategic thinking

OUTPUT FORMAT: Valid JSON only, no markdown code blocks.

{
  "score": 1-10,
  "strengths": ["1-3 specific things done well"],
  "improvements": ["1-3 specific suggestions for improvement"],
  "keyTakeaway": "One key PM lesson or insight from this response"
}`;
}

export function getTaskEvaluationUserPrompt(
  task: { type: string; title: string; description: string; difficulty: string },
  response: string,
): string {
  return `## Task
- Type: ${task.type}
- Title: ${task.title}
- Description: ${task.description}
- Difficulty: ${task.difficulty}

## Candidate's Response
${response}

Please evaluate this response.`;
}
