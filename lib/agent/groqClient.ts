import { redactSecrets } from "@/lib/agent/redactSecrets";

const groqApiKey = process.env.GROQ_API_KEY ?? process.env.AI_API_KEY;
const groqBaseUrl = process.env.AI_BASE_URL ?? "https://api.groq.com/openai/v1";
const groqModel = process.env.AI_MODEL ?? process.env.GROQ_MODEL ?? "qwen/qwen3-coder";

export async function runGroqChat(prompt: string) {
  const apiKey = groqApiKey;

  if (!apiKey) {
    throw new Error("Groq API key not configured.");
  }

  const response = await fetch(`${groqBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: groqModel,
      messages: [{ role: "user", content: redactSecrets(prompt) }],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`Groq request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return payload.choices?.[0]?.message?.content?.trim() || "No Groq response received.";
}
