"use client";

import { useEffect, useMemo, useRef } from "react";

import { Card } from "@/components/ui/Card";
import type { SimulationState } from "@/lib/trading/types";
import { formatUtc } from "@/lib/utils/time";

export function LiveFeed({ state }: { state: SimulationState | null }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const rows = useMemo(() => state?.feed ?? [], [state]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) {
      return;
    }
    node.scrollTo({ top: 0, behavior: "smooth" });
  }, [rows]);

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-[0.24em] text-terminal-text">Live Feed</h2>
        <p className="text-xs text-terminal-muted">Polymarket bot style tape</p>
      </div>
      <div ref={viewportRef} className="max-h-[26rem] overflow-hidden">
        <div className="grid grid-cols-[56px_1fr_70px] gap-x-3 gap-y-2 text-xs">
          {rows.map((entry, index) => (
            <div key={entry.id} className="contents">
              <div
                className="feed-enter border border-terminal-border px-2 py-2 text-center"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <span
                  className={
                    entry.tone === "good"
                      ? "text-terminal-positive"
                      : entry.tone === "bad"
                        ? "text-terminal-negative"
                        : "text-terminal-accent"
                  }
                >
                  {entry.tone.toUpperCase()}
                </span>
              </div>
              <div
                className="feed-enter border border-terminal-border px-3 py-2 text-terminal-text"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {entry.message}
              </div>
              <div
                className="feed-enter border border-terminal-border px-2 py-2 text-right text-terminal-muted"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {formatUtc(entry.timestamp).slice(11, 19)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
