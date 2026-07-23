import "server-only";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function getConciergeReply(
  knowledgeBase: string,
  apartmentName: string,
  history: ChatMessage[],
  message: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return fallbackAnswer(knowledgeBase, message);
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: [
          `You are the AI concierge for "${apartmentName}", a short-term rental apartment.`,
          "Answer ONLY using the knowledge base below. Be warm, concise, and practical.",
          "If the answer isn't in the knowledge base, say you don't have that information and suggest contacting the host.",
          "Detect the guest's language from their message and reply in that language.",
          "",
          "KNOWLEDGE BASE:",
          knowledgeBase || "(empty)",
        ].join("\n"),
        messages: [...history, { role: "user", content: message }],
      }),
    });

    if (!res.ok) return fallbackAnswer(knowledgeBase, message);

    const data = await res.json();
    const text = data.content?.[0]?.text;
    return text || fallbackAnswer(knowledgeBase, message);
  } catch {
    return fallbackAnswer(knowledgeBase, message);
  }
}

function fallbackAnswer(knowledgeBase: string, message: string): string {
  const paragraphs = knowledgeBase.split(/\n{2,}/).filter(Boolean);
  const keywords = message
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3);

  let best: { text: string; score: number } | null = null;
  for (const p of paragraphs) {
    const lower = p.toLowerCase();
    const score = keywords.reduce((sum, kw) => sum + (lower.includes(kw) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { text: p, score };
  }

  if (best) return best.text.slice(0, 500);
  return "I don't have that information yet — please ask your host directly, or check the guest guide for more details.";
}
