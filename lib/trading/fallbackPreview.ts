import { ARC_MARKETS } from "@/lib/arc/constants";
import type { MarketCandle, MarketSymbol } from "@/lib/trading/types";

const basePrices: Record<MarketSymbol, number> = {
  "BTC/USDC-SIM": 108240,
  "ETH/USDC-SIM": 6040,
  "SOL/USDC-SIM": 214,
  "ARC-GAS/USDC-SIM": 1
};

const offsets = [0, -0.004, 0.006, 0.003, -0.002, 0.008, 0.011, 0.007];

export function createFallbackPreviewMarkets() {
  const now = Date.UTC(2026, 6, 16, 0, 0, 0);

  return Object.fromEntries(
    ARC_MARKETS.map((market) => [
      market,
      offsets.map((offset, index) => ({
        timestamp: now - (offsets.length - 1 - index) * 60_000,
        price: Number((basePrices[market] * (1 + offset)).toFixed(6))
      }))
    ])
  ) as Record<MarketSymbol, MarketCandle[]>;
}
