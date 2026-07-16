import { ARC_MARKETS } from "@/lib/arc/constants";
import type { ActivityLogEntry, MarketCandle, MarketSymbol, SimulationState, TradeRecord } from "@/lib/trading/types";

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

const previewTimes = [
  Date.UTC(2026, 6, 16, 9, 4, 0),
  Date.UTC(2026, 6, 16, 9, 7, 0),
  Date.UTC(2026, 6, 16, 9, 10, 0),
  Date.UTC(2026, 6, 16, 9, 13, 0),
  Date.UTC(2026, 6, 16, 9, 16, 0),
  Date.UTC(2026, 6, 16, 9, 19, 0)
];

export function createFallbackPnlSeries() {
  return [
    { index: 1, pnl: 6.4 },
    { index: 2, pnl: 4.1 },
    { index: 3, pnl: 11.8 },
    { index: 4, pnl: 8.9 },
    { index: 5, pnl: 14.6 },
    { index: 6, pnl: 19.2 }
  ];
}

export function createFallbackMonteCarlo(): SimulationState["monteCarlo"] {
  return {
    expectedReturn: 18.4,
    expectedDrawdown: -6.8,
    percentile5: -9.2,
    percentile95: 34.6,
    histogram: [18, 22, 15, 28, 24, 12, 26, 19, 31, 21, 17, 27]
  };
}

export function createFallbackTrades(): TradeRecord[] {
  return [
    {
      id: "preview-trade-1",
      market: "BTC/USDC-SIM",
      strategy: "Mean Reversion",
      side: "BUY",
      confidence: 71,
      notionalUsdc6: 250000000n,
      entryPrice: 108120,
      exitPrice: 108840,
      pnl: 6.4,
      rr: 1.8,
      reason: "Preview fill after oversold recoil into support.",
      mode: "paper",
      timestamp: previewTimes[3],
      status: "filled",
      chainStatus: "confirmed",
      runnerSource: "dashboard"
    },
    {
      id: "preview-trade-2",
      market: "ETH/USDC-SIM",
      strategy: "Momentum",
      side: "BUY",
      confidence: 68,
      notionalUsdc6: 180000000n,
      entryPrice: 6022,
      exitPrice: 6061,
      pnl: 8.2,
      rr: 1.5,
      reason: "Preview breakout continuation with tight stop.",
      mode: "testnet-intent",
      timestamp: previewTimes[4],
      status: "intent-logged",
      chainStatus: "prepared",
      txHash: "0x7f6c8e32f4b1278f4cb2c09f7e1ba4f2f3ad2211dbeef1b37d4e1a6fcfae1102",
      submittedAt: previewTimes[4],
      runnerSource: "manual-wallet"
    }
  ];
}

export function createFallbackFeed() {
  return [
    {
      id: "preview-feed-1",
      tone: "info" as const,
      message: "Scan: BTC/USDC-SIM rebased against Arc RPC health and cached docs context.",
      timestamp: previewTimes[1]
    },
    {
      id: "preview-feed-2",
      tone: "good" as const,
      message: "Detect: Mean Reversion surfaced a BUY route with 71% confidence.",
      timestamp: previewTimes[2]
    },
    {
      id: "preview-feed-3",
      tone: "info" as const,
      message: "Validate: browser-wallet mode kept final submission under manual confirmation.",
      timestamp: previewTimes[3]
    },
    {
      id: "preview-feed-4",
      tone: "good" as const,
      message: "Settle: simulated session delta stayed positive after the latest preview fill.",
      timestamp: previewTimes[5]
    }
  ];
}

export function createFallbackActivity(): ActivityLogEntry[] {
  return [
    {
      id: "preview-activity-1",
      source: "dashboard",
      kind: "runner",
      status: "info",
      message: "Preview cycle hydrated from local state to keep the dashboard warm.",
      timestamp: previewTimes[0]
    },
    {
      id: "preview-activity-2",
      source: "manual-wallet",
      kind: "intent",
      status: "prepared",
      message: "Prepared ETH/USDC-SIM BUY intent for browser-wallet confirmation.",
      timestamp: previewTimes[4],
      market: "ETH/USDC-SIM",
      txHash: "0x7f6c8e32f4b1278f4cb2c09f7e1ba4f2f3ad2211dbeef1b37d4e1a6fcfae1102"
    }
  ];
}
