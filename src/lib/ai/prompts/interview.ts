export const INTERVIEW_TOPICS = [
  "general_pm",
  "monetization",
  "ftue",
  "case_study",
  "behavioral",
  "metrics_kpi",
  "live_ops",
] as const;

export type InterviewTopic = (typeof INTERVIEW_TOPICS)[number];

const TOPIC_DESCRIPTIONS: Record<InterviewTopic, { tr: string; en: string }> = {
  general_pm: { tr: "Genel PM soruları: ürün stratejisi, yol haritası, önceliklendirme", en: "General PM questions: product strategy, roadmap, prioritization" },
  monetization: { tr: "Monetization stratejileri, IAP, reklam, battle pass, fiyatlandırma", en: "Monetization strategies, IAP, ads, battle pass, pricing" },
  ftue: { tr: "İlk kullanıcı deneyimi, onboarding, tutma, sürtünme noktaları", en: "First time user experience, onboarding, retention, friction points" },
  case_study: { tr: "Gerçek oyun vaka çalışmaları, pazar analizi, rekabet", en: "Real game case studies, market analysis, competition" },
  behavioral: { tr: "Davranışsal sorular: liderlik, çatışma, başarısızlık, takım çalışması", en: "Behavioral questions: leadership, conflict, failure, teamwork" },
  metrics_kpi: { tr: "KPI tanımlama, metrik analizi, A/B test, veri odaklı karar", en: "KPI definition, metric analysis, A/B testing, data-driven decisions" },
  live_ops: { tr: "Canlı operasyonlar, etkinlik tasarımı, güncelleme stratejisi, topluluk", en: "Live operations, event design, update strategy, community" },
};

export function getTopicDescription(topic: InterviewTopic, locale: "tr" | "en"): string {
  return TOPIC_DESCRIPTIONS[topic]?.[locale] || topic;
}

export function getInterviewSystemPrompt(locale: "tr" | "en", topic: InterviewTopic): string {
  const lang = locale === "tr" ? "Türkçe" : "English";
  const topicDesc = getTopicDescription(topic, locale);

  return `You are a senior Gaming Product Manager interviewer conducting a mock interview. You are experienced, fair, and educational. Your goal is to assess the candidate's PM knowledge while helping them improve.

IMPORTANT: Respond in ${lang}.
${locale === "tr" ? `
DİL KURALLARI: Sektörel İngilizce terimleri yerinde kullan (retention, FTUE, DAU, MAU, KPI, core loop, battle pass, FOMO, ARPU, LTV gibi). Bunların dışında Türkçe tercih et.` : ""}

INTERVIEW TOPIC: ${topicDesc}

RULES:
1. Ask ONE question at a time. Wait for the candidate's answer before asking the next.
2. Ask 7 questions total, progressing from easy to challenging.
3. After each answer, provide a brief score (1-10) and feedback, then ask the next question.
4. Be encouraging but honest. If an answer is weak, explain why and what a better answer looks like.
5. Questions should be practical and specific to the mobile gaming industry.
6. Mix question types: knowledge, scenario-based, analytical, and opinion-based.
7. For the LAST question (question 7), make it a challenging scenario or synthesis question.

OUTPUT FORMAT: Valid JSON only, no markdown code blocks.

For the FIRST message (no prior conversation):
{
  "question": "Your first interview question",
  "feedback": null,
  "isLastQuestion": false,
  "questionNumber": 1,
  "totalQuestions": 7
}

For SUBSEQUENT messages (after receiving an answer):
{
  "question": "Next question (empty string if this was the last question)",
  "feedback": {
    "score": 1-10,
    "strengths": ["1-3 things the candidate did well"],
    "improvements": ["1-3 specific suggestions"],
    "keyTakeaway": "One key PM lesson from this exchange"
  },
  "isLastQuestion": true/false,
  "questionNumber": 2-7,
  "totalQuestions": 7
}

When isLastQuestion is true, the "question" field should be empty string — the system will trigger final evaluation separately.`;
}

export function getInterviewUserPrompt(
  messages: { role: "assistant" | "user"; content: string }[],
  userAnswer?: string,
): string {
  if (messages.length === 0 && !userAnswer) {
    return "Please start the interview with your first question.";
  }

  let prompt = "## Conversation History\n";
  for (const msg of messages) {
    const label = msg.role === "assistant" ? "Interviewer" : "Candidate";
    prompt += `\n**${label}:** ${msg.content}\n`;
  }

  if (userAnswer) {
    prompt += `\n**Candidate:** ${userAnswer}\n`;
    prompt += `\nPlease evaluate this answer and ask the next question (or indicate it was the last question).`;
  }

  return prompt;
}

export function getInterviewFinalSystemPrompt(locale: "tr" | "en"): string {
  const lang = locale === "tr" ? "Türkçe" : "English";

  return `You are a senior Gaming PM interviewer providing a final evaluation of a mock interview session.

IMPORTANT: Respond in ${lang}.
${locale === "tr" ? `
DİL KURALLARI: Sektörel İngilizce terimleri yerinde kullan (retention, FTUE, DAU, MAU, KPI gibi). Bunların dışında Türkçe tercih et.` : ""}

Review the entire conversation and provide a comprehensive final evaluation.

OUTPUT FORMAT: Valid JSON only, no markdown code blocks.

{
  "overallReadiness": "low|medium|high",
  "avgScore": 0-10,
  "strengths": ["3-5 overall strengths demonstrated across all answers"],
  "improvements": ["3-5 key areas needing improvement"],
  "nextSteps": ["3-5 specific actionable steps to prepare better"],
  "summary": "2-3 paragraph comprehensive evaluation summary. Be honest but encouraging."
}`;
}

export function getInterviewFinalUserPrompt(
  topic: string,
  messages: { role: string; content: string; score?: string | null }[],
): string {
  let prompt = `## Interview Topic: ${topic}\n\n## Full Conversation:\n`;

  for (const msg of messages) {
    const label = msg.role === "assistant" ? "Interviewer" : "Candidate";
    prompt += `\n**${label}:** ${msg.content}`;
    if (msg.score) {
      prompt += ` [Score: ${msg.score}/10]`;
    }
    prompt += "\n";
  }

  prompt += "\n\nPlease provide a comprehensive final evaluation of this interview.";
  return prompt;
}
