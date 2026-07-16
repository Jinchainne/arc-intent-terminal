import type { AutoBotState, RiskStatus, StrategySignal, TradeRecord } from "@/lib/trading/types";

type PlannerInput = {
  autoBot: AutoBotState;
  risk: RiskStatus;
  signal: StrategySignal;
  latestTrade: TradeRecord | null;
};

export function deriveAutoBotPlanner(input: PlannerInput) {
  const objective = input.autoBot.objective || "Keep Arc testnet execution healthy and submit only high-quality intents.";

  if (!input.autoBot.enabled) {
    return {
      objective,
      nextAction: "Arm the bot to resume autonomous monitoring.",
      lastDecision: "Bot is paused, so no execution action was taken.",
      blockedReason: ""
    };
  }

  if (!input.autoBot.ledgerAddress) {
    return {
      objective,
      nextAction: "Deploy or configure an ArcTradeIntentLedger before the next cycle.",
      lastDecision: "Execution stayed in observation mode because no ledger address is configured.",
      blockedReason: "Ledger missing."
    };
  }

  if (input.autoBot.pendingCount > 0 && input.autoBot.mode === "manual-wallet") {
    return {
      objective,
      nextAction: "Confirm the latest pending browser-wallet intent before creating more.",
      lastDecision: "The planner is holding new submissions until the pending browser-wallet intent is confirmed.",
      blockedReason: "Pending browser-wallet intent."
    };
  }

  if (!input.risk.approved) {
    return {
      objective,
      nextAction: input.risk.flags.includes("Max consecutive losses reached.")
        ? "Reset strategy state or wait for a cleaner regime before resuming."
        : "Wait for a stronger signal or healthier risk state.",
      lastDecision: `The planner rejected ${input.signal.market} ${input.signal.action} because ${input.risk.flags.join(" ") || "risk was not approved"}.`,
      blockedReason: input.risk.flags.join(" ")
    };
  }

  if (input.latestTrade?.status === "intent-logged") {
    return {
      objective,
      nextAction: "Monitor the last on-chain intent and prepare the next qualified cycle.",
      lastDecision: `The planner submitted ${input.latestTrade.market} ${input.latestTrade.side} on Arc testnet.`,
      blockedReason: ""
    };
  }

  if (input.latestTrade?.status === "intent-pending") {
    return {
      objective,
      nextAction: "Confirm the pending intent with your browser wallet.",
      lastDecision: `The planner prepared ${input.latestTrade.market} ${input.latestTrade.side} and is waiting for the next execution step.`,
      blockedReason: ""
    };
  }

  return {
    objective,
    nextAction: "Keep scanning for the next approved Arc testnet opportunity.",
    lastDecision: "No trade was emitted this cycle, so the planner stayed in watch mode.",
    blockedReason: ""
  };
}
