import { Card } from "@/components/ui/Card";

export function ModelStatus({ provider }: { provider: string }) {
  const details =
    provider === "groq"
      ? "Groq path is active. This works on hosted deployments when a Groq key is configured."
      : provider === "fallback"
        ? "Fallback path was used. If this is the Vercel site, local Ollama is not reachable from the cloud."
        : "Ollama local path is active. This only works when you run the app locally on the same machine as Ollama.";

  return (
    <Card className="p-4">
      <h2 className="text-sm uppercase tracking-[0.24em] text-terminal-text">Model Status</h2>
      <div className="mt-3 border border-terminal-border px-3 py-2 text-sm text-terminal-text">
        Provider: {provider.toUpperCase()}
      </div>
      <p className="mt-3 text-xs text-terminal-muted">{details}</p>
    </Card>
  );
}
