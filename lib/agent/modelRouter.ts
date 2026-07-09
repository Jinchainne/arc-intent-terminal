import { runGroqChat } from "@/lib/agent/groqClient";
import { getOllamaStatus, runOllamaChat } from "@/lib/agent/ollamaClient";
import { ARC_AGENT_SYSTEM_PROMPT } from "@/lib/agent/systemPrompt";
import type { AgentResponse } from "@/lib/agent/types";
import { searchArcDocs } from "@/lib/docs/searchArcDocs";

export async function routeAgentQuestion(question: string) {
  const docs = await searchArcDocs(question);
  const prompt = [
    ARC_AGENT_SYSTEM_PROMPT,
    "",
    "Local Arc docs context:",
    ...docs.map((entry) => `- ${entry.title}: ${entry.snippet}`),
    "",
    `User question: ${question}`
  ].join("\n");

  const providerMode = process.env.AGENT_PROVIDER ?? "auto";
  const hasGroq = Boolean(process.env.GROQ_API_KEY ?? process.env.AI_API_KEY);
  const isComplexPrompt = /why|explain|review|validate|compare|decimal|risk|config/i.test(question);
  const isHosted = Boolean(process.env.VERCEL);
  const ollamaStatus = await getOllamaStatus();
  const preferGroq =
    providerMode === "groq" ||
    (providerMode === "auto" && hasGroq && (isComplexPrompt || isHosted || !ollamaStatus.ok));
  const preferOllama = providerMode === "ollama" || (providerMode === "auto" && ollamaStatus.ok && !preferGroq);

  if (preferGroq) {
    try {
      const answer = await runGroqChat(prompt);
      return {
        answer,
        provider: "groq",
        fallbackUsed: false,
        docs: docs.map((entry) => entry.path),
        warnings: []
      } satisfies AgentResponse;
    } catch (error) {
      const answer = await runOllamaChat(prompt);
      return {
        answer,
        provider: "fallback",
        fallbackUsed: true,
        docs: docs.map((entry) => entry.path),
        warnings: [error instanceof Error ? error.message : "Groq failed."]
      } satisfies AgentResponse;
    }
  }

  if (preferOllama) {
    try {
      const answer = await runOllamaChat(prompt);
      return {
        answer,
        provider: "ollama",
        fallbackUsed: false,
        docs: docs.map((entry) => entry.path),
        warnings: []
      } satisfies AgentResponse;
    } catch (error) {
      if (hasGroq) {
        const answer = await runGroqChat(prompt);
        return {
          answer,
          provider: "fallback",
          fallbackUsed: true,
          docs: docs.map((entry) => entry.path),
          warnings: [error instanceof Error ? error.message : "Ollama failed."]
        } satisfies AgentResponse;
      }
    }
  }

  return {
    answer:
      "No model route is currently available. Local mode needs Ollama running on http://localhost:11434 with qwen2.5-coder:7b. Hosted mode needs a Groq API key.",
    provider: "fallback",
    fallbackUsed: true,
    docs: docs.map((entry) => entry.path),
    warnings: [ollamaStatus.message]
  } satisfies AgentResponse;
}
