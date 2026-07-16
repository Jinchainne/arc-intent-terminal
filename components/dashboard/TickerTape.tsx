"use client";

import { Card } from "@/components/ui/Card";
import { ARC_MARKETS } from "@/lib/arc/constants";
import { createFallbackPreviewMarkets } from "@/lib/trading/fallbackPreview";
import type { MarketSymbol, SimulationState } from "@/lib/trading/types";

export function TickerTape({
  state,
  selectedMarket
}: {
  state: SimulationState | null;
  selectedMarket: MarketSymbol;
}) {
  const fallbackMarkets = createFallbackPreviewMarkets();
  const items =
    (state
      ? ARC_MARKETS.map((market) => [market, state.markets[market]?.length ? state.markets[market] : fallbackMarkets[market]])
      : ARC_MARKETS.map((market) => [market, fallbackMarkets[market]])) as Array<
      [MarketSymbol, Array<{ timestamp: number; price: number }>]
    >;

  const normalizedItems = items.map(([market, series]) => {
            const last = series.at(-1)?.price ?? 0;
            const prev = series.at(-2)?.price ?? last;
            const deltaPct = prev === 0 ? 0 : ((last - prev) / prev) * 100;
            return {
              market,
              price: last,
              deltaPct
            };
          });

  return (
    <Card className="overflow-hidden py-2">
      <div className="ticker-track flex min-w-max items-center gap-6 px-4 text-[11px] uppercase tracking-[0.22em]">
        {[...normalizedItems, ...normalizedItems].map((item, index) => (
          <div
            key={`${item.market}-${index}`}
            className={`flex items-center gap-3 border-r border-terminal-border pr-6 ${
              item.market === selectedMarket ? "text-terminal-text" : "text-terminal-muted"
            }`}
          >
            <span>{item.market}</span>
            <span>{item.price.toFixed(item.price > 10 ? 2 : 4)}</span>
            <span className={item.deltaPct >= 0 ? "text-terminal-positive" : "text-terminal-negative"}>
              {item.deltaPct >= 0 ? "UP" : "DN"} {Math.abs(item.deltaPct).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
