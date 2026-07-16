"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/Card";
import { createFallbackPnlSeries } from "@/lib/trading/fallbackPreview";
import type { SimulationState } from "@/lib/trading/types";

export function PnlGrowthChart({ state }: { state: SimulationState | null }) {
  const data = state?.pnlSeries?.length ? state.pnlSeries : createFallbackPnlSeries();

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-[0.24em] text-terminal-text">PnL Growth</h2>
        <p className="text-xs text-terminal-negative">SIMULATED PNL</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="index" stroke="#73806f" tick={{ fontSize: 10 }} />
            <YAxis stroke="#73806f" tick={{ fontSize: 10 }} width={54} />
            <Tooltip contentStyle={{ background: "#f4efdc", border: "1px solid #bdb39a", fontSize: 12 }} />
            <Area type="monotone" dataKey="pnl" stroke="#d3c19a" fill="#d3c19a33" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {!state?.pnlSeries?.length ? (
        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-terminal-muted">
          Preview curve until enough fills accumulate
        </p>
      ) : null}
    </Card>
  );
}
