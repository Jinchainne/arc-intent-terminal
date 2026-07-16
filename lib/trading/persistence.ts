import fs from "node:fs/promises";
import path from "node:path";

import { createInitialMarketState } from "@/lib/trading/marketSimulator";
import { createDefaultAutoBotState } from "@/lib/trading/tradeStore";
import { tradeStore } from "@/lib/trading/tradeStore";
import type { SimulationState, TradeRecord } from "@/lib/trading/types";

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "sim-state.json");

type PersistedTradeRecord = Omit<TradeRecord, "notionalUsdc6"> & {
  notionalUsdc6: string;
};

type PersistedStore = {
  markets: typeof tradeStore.markets;
  trades: PersistedTradeRecord[];
  activityLog: typeof tradeStore.activityLog;
  feed: typeof tradeStore.feed;
  pnlSeries: typeof tradeStore.pnlSeries;
  monteCarlo: SimulationState["monteCarlo"];
  autoBot: typeof tradeStore.autoBot;
  lastSignal: (Omit<NonNullable<typeof tradeStore.lastSignal>, "notionalUsdc6"> & {
    notionalUsdc6: string;
  }) | null;
  risk: typeof tradeStore.risk;
  allTimePnl: number;
};

let loaded = false;
let persistenceAvailable = true;

function defaultPersistedStore(): PersistedStore {
  return {
    markets: createInitialMarketState(),
    trades: [],
    activityLog: [],
    feed: [],
    pnlSeries: [],
    monteCarlo: {
      expectedReturn: 0,
      expectedDrawdown: 0,
      percentile5: 0,
      percentile95: 0,
      histogram: []
    },
    autoBot: createDefaultAutoBotState(),
    lastSignal: null,
    risk: {
      approved: false,
      score: 72,
      phase: "Scan",
      flags: []
    },
    allTimePnl: 0
  };
}

function normalizeMarkets(markets: PersistedStore["markets"] | undefined) {
  const seededMarkets = createInitialMarketState();
  if (!markets) {
    return seededMarkets;
  }

  return Object.fromEntries(
    Object.entries(seededMarkets).map(([market, seededSeries]) => {
      const currentSeries = markets[market as keyof typeof markets];
      return [
        market,
        Array.isArray(currentSeries) && currentSeries.length > 1 ? currentSeries : seededSeries
      ];
    })
  ) as PersistedStore["markets"];
}

function hasLegacyBurnerState(payload: PersistedStore) {
  return (
    payload.autoBot?.mode !== "manual-wallet" ||
    Boolean(payload.autoBot?.signerAddress) ||
    payload.feed?.some((entry) => /burner/i.test(entry.message)) ||
    payload.activityLog?.some((entry) => /burner/i.test(entry.message)) ||
    payload.autoBot?.lastMessage?.includes("Burner") ||
    payload.autoBot?.lastDecision?.includes("REAL_TRADING_DISABLED prevents any automatic execution") ||
    payload.autoBot?.blockedReason?.includes("REAL_TRADING_DISABLED prevents any automatic execution")
  );
}

function sanitizePersistedStore(payload: PersistedStore): PersistedStore {
  if (hasLegacyBurnerState(payload)) {
    const clean = defaultPersistedStore();
    clean.markets = normalizeMarkets(payload.markets);
    return clean;
  }

  return {
    ...defaultPersistedStore(),
    ...payload,
    markets: normalizeMarkets(payload.markets),
    autoBot: {
      ...createDefaultAutoBotState(),
      ...payload.autoBot,
      mode: "manual-wallet",
      signerAddress: "",
      lastMessage:
        payload.autoBot?.lastMessage && /burner/i.test(payload.autoBot.lastMessage)
          ? "Auto bot idle. Configure a ledger and choose a testnet execution mode."
          : (payload.autoBot?.lastMessage ?? createDefaultAutoBotState().lastMessage)
    }
  };
}

function serialize() {
  const payload: PersistedStore = {
    markets: tradeStore.markets,
    trades: tradeStore.trades.map((trade) => ({
      ...trade,
      notionalUsdc6: trade.notionalUsdc6.toString()
    })),
    activityLog: tradeStore.activityLog,
    feed: tradeStore.feed,
    pnlSeries: tradeStore.pnlSeries,
    monteCarlo: tradeStore.monteCarlo,
    autoBot: tradeStore.autoBot,
    lastSignal: tradeStore.lastSignal
      ? {
          ...tradeStore.lastSignal,
          notionalUsdc6: tradeStore.lastSignal.notionalUsdc6.toString()
        }
      : null,
    risk: tradeStore.risk,
    allTimePnl: tradeStore.allTimePnl
  };

  return payload;
}

async function loadTradeStore(force = false) {
  if (loaded && !force) {
    return;
  }

  try {
    const raw = await fs.readFile(storePath, "utf8");
    const payload = sanitizePersistedStore(JSON.parse(raw) as PersistedStore);
    tradeStore.markets = normalizeMarkets(payload.markets);
    tradeStore.trades = (payload.trades ?? []).map((trade) => ({
      ...trade,
      notionalUsdc6: BigInt(trade.notionalUsdc6)
    }));
    tradeStore.activityLog = payload.activityLog ?? [];
    tradeStore.feed = payload.feed ?? [];
    tradeStore.pnlSeries = payload.pnlSeries ?? [];
    tradeStore.monteCarlo = payload.monteCarlo ?? tradeStore.monteCarlo;
    tradeStore.autoBot = payload.autoBot ?? tradeStore.autoBot;
    tradeStore.lastSignal = payload.lastSignal
      ? {
          ...payload.lastSignal,
          notionalUsdc6: BigInt(payload.lastSignal.notionalUsdc6)
        }
      : null;
    tradeStore.risk = payload.risk ?? tradeStore.risk;
    tradeStore.allTimePnl = payload.allTimePnl ?? 0;
  } catch {
    const payload = defaultPersistedStore();
    tradeStore.markets = payload.markets;
    tradeStore.trades = [];
    tradeStore.activityLog = payload.activityLog;
    tradeStore.feed = payload.feed;
    tradeStore.pnlSeries = payload.pnlSeries;
    tradeStore.monteCarlo = payload.monteCarlo;
    tradeStore.autoBot = payload.autoBot;
    tradeStore.lastSignal = null;
    tradeStore.risk = payload.risk;
    tradeStore.allTimePnl = payload.allTimePnl;
  }

  loaded = true;
}

export async function ensureTradeStoreLoaded() {
  await loadTradeStore(false);
}

export async function reloadTradeStore() {
  await loadTradeStore(true);
}

export async function persistTradeStore() {
  if (!persistenceAvailable) {
    return;
  }

  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.writeFile(storePath, JSON.stringify(serialize(), null, 2), "utf8");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "EROFS") {
      persistenceAvailable = false;
      return;
    }
    throw error;
  }
}
